/**
 * Care Team Firestore Operations
 * 
 * CRUD for care teams with publishing logic and data sovereignty.
 * Ensures private reflections never leave parent profile.
 */

import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    query,
    where,
    orderBy,
    serverTimestamp,
    type Timestamp
} from 'firebase/firestore';
import { db } from './config';
import type {
    CareTeam,
    CareTeamMember,
    PublishedObservation,
    RefractedNarrative
} from '../stores/careTeamTypes';
import type { Observation } from '../stores/types';
import { getObservations } from './firestore';

const careTeamsRef = collection(db, 'care_teams');
const publishedObsRef = collection(db, 'published_observations');

/**
 * Create a new care team (Admin action)
 */
export async function createCareTeam(
    adminId: string,
    data: {
        name: string;
        childName: string;
        childId: string;
    }
): Promise<string> {
    const docRef = await addDoc(careTeamsRef, {
        ...data,
        adminId,
        members: [],
        tier: 'Village',
        subscriptionActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return docRef.id;
}

/**
 * Get care teams where user is admin
 */
export async function getAdminCareTeams(adminId: string): Promise<CareTeam[]> {
    const q = query(
        careTeamsRef,
        where('adminId', '==', adminId),
        orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as CareTeam));
}

/**
 * Invite a practitioner to a care team (Admin action)
 */
export async function invitePractitioner(
    careTeamId: string,
    data: {
        email: string;
        name: string;
        organization?: string;
        title?: string;
    }
): Promise<void> {
    const teamDoc = doc(careTeamsRef, careTeamId);
    const teamSnap = await getDoc(teamDoc);

    if (!teamSnap.exists()) {
        throw new Error('Care team not found');
    }

    const team = teamSnap.data() as CareTeam;
    const newMember: CareTeamMember = {
        email: data.email,
        name: data.name,
        role: 'Practitioner',
        organization: data.organization,
        title: data.title,
        status: 'invited',
        invitedAt: serverTimestamp() as Timestamp,
    };

    await updateDoc(teamDoc, {
        members: [...team.members, newMember],
        updatedAt: serverTimestamp(),
    });
}

/**
 * Publish an observation to care team
 * Creates a "Refracted Narrative" - strength-based version
 */
export async function publishObservation(
    adminId: string,
    observationId: string,
    careTeamId: string,
    refractedContent?: {
        strengthNarrative?: string;
        effectiveStrategies?: string[];
    }
): Promise<string> {
    // Fetch original observation
    const obsRef = doc(db, 'observations', observationId);
    const obsSnap = await getDoc(obsRef);

    if (!obsSnap.exists()) {
        throw new Error('Observation not found');
    }

    const obs = obsSnap.data() as Observation;

    // Create strength-based refracted version
    const published: Omit<PublishedObservation, 'id'> = {
        originalId: observationId,
        careTeamId,

        // Use provided refracted content or original
        strengthNarrative: refractedContent?.strengthNarrative || obs.strengthNarrative,
        communicationChannels: obs.channels || [],
        effectiveStrategies: refractedContent?.effectiveStrategies || [],

        // Generalize reciprocity level (no exact numbers)
        reciprocityLevel: obs.relationalReciprocity >= 4 ? 'High'
            : obs.relationalReciprocity >= 2 ? 'Moderate'
                : 'Low',

        // Generalize biological context
        biologicalContext: obs.biologicalNeeds ? 'Sensory considerations noted' : 'Standard conditions',

        publishedAt: serverTimestamp() as Timestamp,
        publishedBy: adminId,
        isRedacted: false,
    };

    const docRef = await addDoc(publishedObsRef, published);

    // Mark original as published
    await updateDoc(obsRef, {
        isPublished: true,
        teamId: careTeamId,
    });

    return docRef.id;
}

/**
 * Get published observations for a care team (Practitioner view)
 */
export async function getPublishedObservations(
    careTeamId: string
): Promise<PublishedObservation[]> {
    const q = query(
        publishedObsRef,
        where('careTeamId', '==', careTeamId),
        where('isRedacted', '==', false),
        orderBy('publishedAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as PublishedObservation));
}

/**
 * Redact a published observation (Admin action)
 * Removes from practitioner view but keeps audit trail
 */
export async function redactObservation(
    observationId: string
): Promise<void> {
    const docRef = doc(publishedObsRef, observationId);
    await updateDoc(docRef, {
        isRedacted: true,
    });
}

/**
 * Generate a Refracted Narrative for practitioners
 * Synthesizes observations into strength-based, actionable insights
 */
export async function generateRefractedNarrative(
    userId: string,
    careTeamId: string,
    dateRange: { start: Date; end: Date }
): Promise<RefractedNarrative> {
    // Fetch observations
    const observations = await getObservations(userId, 50);

    // Filter by date range
    const filtered = observations.filter(obs => {
        const obsDate = obs.timestamp.toDate();
        return obsDate >= dateRange.start && obsDate <= dateRange.end;
    });

    // Synthesize strengths (high reciprocity moments)
    const highConnection = filtered.filter(o => o.relationalReciprocity >= 4);
    const strengthsSummary = highConnection.length > 0
        ? `This child demonstrates ${highConnection.length} documented moments of deep connection and mutual recognition. When given appropriate support, they show capacity for meaningful relational engagement.`
        : 'Building relationship documentation. Continue observing moments of connection.';

    // Extract communication patterns
    const channels = filtered.flatMap(o => o.channels);
    const channelCounts = channels.reduce((acc, ch) => {
        acc[ch] = (acc[ch] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const communicationPatterns = Object.entries(channelCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([channel, count]) => `${channel} (observed ${count} times)`);

    // Extract effective approaches from high-reciprocity moments
    const effectiveApproaches = highConnection.length > 0
        ? ['Responsive co-regulation', 'Recognition of communication bids']
        : ['Ongoing assessment of effective strategies'];

    // Environmental considerations from atmospheric resonance
    const atmosphericPatterns = filtered
        .map(o => o.atmosphericResonance)
        .filter(Boolean);

    const environmentalConsiderations = atmosphericPatterns.length > 0
        ? ['Transitions may require additional support', 'Sensory environment impacts regulation']
        : ['Environmental factors being documented'];

    // Generate classroom strategies
    const classroomStrategies = [
        'Provide predictable routines with visual supports',
        'Offer sensory breaks as needed',
        'Recognize and respond to communication bids',
        'Allow processing time before expecting responses',
    ];

    // Transition supports
    const transitionSupports = [
        'Verbal and visual warnings before transitions',
        'Transition objects or rituals when helpful',
        'Reduced expectations during high-stress periods',
    ];

    // Sensory considerations
    const biologicalKeywords = filtered.map(o => o.biologicalNeeds.toLowerCase());
    const sensoryConsiderations = biologicalKeywords.some(b => b.includes('sensory'))
        ? ['Sensory regulation needs identified', 'Movement breaks may support focus']
        : ['Sensory profile being assessed'];

    return {
        id: `narrative-${Date.now()}`,
        careTeamId,
        generatedAt: { toDate: () => new Date() } as Timestamp,
        strengthsSummary,
        communicationPatterns,
        effectiveApproaches,
        environmentalConsiderations,
        classroomStrategies,
        transitionSupports,
        sensoryConsiderations,
        observationCount: filtered.length,
        dateRange,
    };
}

/**
 * Verify practitioner access to a care team
 */
export async function verifyPractitionerAccess(
    careTeamId: string,
    email: string
): Promise<boolean> {
    const teamDoc = doc(careTeamsRef, careTeamId);
    const teamSnap = await getDoc(teamDoc);

    if (!teamSnap.exists()) {
        return false;
    }

    const team = teamSnap.data() as CareTeam;
    const member = team.members.find(m => m.email === email && m.status === 'active');

    return !!member;
}
