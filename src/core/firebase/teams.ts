/**
 * Teams Firestore Operations
 * 
 * CRUD operations for care-team management:
 * - Create/manage teams
 * - Invite members with roles
 * - Publish observations to teams
 * - Generate IEP summaries
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
import type { Team, TeamMember, TeamRole, TeamType, IEPSummary, VillageContact } from '../stores/teamTypes';
import type { Observation } from '../stores/types';
import { getObservations } from './firestore';

const teamsRef = collection(db, 'teams');

/**
 * Create a new team
 */
export async function createTeam(
    ownerId: string,
    data: {
        name: string;
        type: TeamType;
        childName: string;
        childAge?: number;
    }
): Promise<string> {
    const docRef = await addDoc(teamsRef, {
        ...data,
        ownerId,
        members: [],
        tier: 'Free',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return docRef.id;
}

/**
 * Get teams where user is owner or member
 */
export async function getUserTeams(userId: string): Promise<Team[]> {
    // Get teams owned by user
    const ownedQuery = query(
        teamsRef,
        where('ownerId', '==', userId),
        orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(ownedQuery);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as Team));
}

/**
 * Invite a member to a team
 */
export async function inviteTeamMember(
    teamId: string,
    contact: VillageContact,
    role: TeamRole
): Promise<void> {
    const teamDoc = doc(teamsRef, teamId);
    const teamSnap = await getDoc(teamDoc);

    if (!teamSnap.exists()) {
        throw new Error('Team not found');
    }

    const team = teamSnap.data() as Team;
    const newMember: TeamMember = {
        email: contact.email,
        name: contact.name,
        role,
        status: 'pending',
        invitedAt: serverTimestamp() as Timestamp,
    };

    await updateDoc(teamDoc, {
        members: [...team.members, newMember],
        updatedAt: serverTimestamp(),
    });
}

/**
 * Publish an observation to a team
 */
export async function publishObservationToTeam(
    observationId: string,
    teamId: string
): Promise<void> {
    const obsDoc = doc(db, 'observations', observationId);
    await updateDoc(obsDoc, {
        teamId,
        isPublished: true,
    });
}

/**
 * Get published observations for a team
 */
export async function getTeamObservations(teamId: string): Promise<Observation[]> {
    const obsRef = collection(db, 'observations');
    const q = query(
        obsRef,
        where('teamId', '==', teamId),
        where('isPublished', '==', true),
        orderBy('timestamp', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as Observation));
}

/**
 * Generate IEP Summary from observations
 * Synthesizes patterns across atmospheric, biological, and strategic dimensions
 */
export async function generateIEPSummary(
    userId: string,
    teamId: string,
    dateRange: { start: Date; end: Date }
): Promise<IEPSummary> {
    // Fetch user's observations
    const observations = await getObservations(userId, 100);

    // Filter by date range
    const filtered = observations.filter(obs => {
        const obsDate = obs.timestamp.toDate();
        return obsDate >= dateRange.start && obsDate <= dateRange.end;
    });

    // Synthesize Atmospheric Triggers
    const atmosphericTriggers = extractPatterns(
        filtered.map(o => o.atmosphericResonance).filter(Boolean)
    );

    // Synthesize Biological Rhythms
    const biologicalRhythms = extractPatterns(
        filtered.map(o => o.biologicalNeeds).filter(Boolean)
    );

    // Synthesize Effective Strategies (from high-reciprocity observations)
    const highReciprocity = filtered.filter(o => o.relationalReciprocity >= 4);
    const effectiveStrategies = highReciprocity.length > 0
        ? [`${highReciprocity.length} moments of deep connection observed`]
        : [];

    // Channel frequency
    const channelCounts = filtered
        .flatMap(o => o.channels)
        .reduce((acc, channel) => {
            acc[channel] = (acc[channel] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

    const communicationChannels = Object.entries(channelCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([channel]) => channel);

    // Average reciprocity
    const avgReciprocity = filtered.length > 0
        ? filtered.reduce((sum, o) => sum + o.relationalReciprocity, 0) / filtered.length
        : 0;

    // Generate narrative
    const narrativeSummary = generateNarrative(
        filtered.length,
        avgReciprocity,
        communicationChannels,
        atmosphericTriggers
    );

    return {
        id: `summary-${Date.now()}`,
        teamId,
        generatedAt: { toDate: () => new Date() } as Timestamp,
        dateRange,
        atmosphericTriggers,
        biologicalRhythms,
        effectiveStrategies,
        communicationChannels,
        averageReciprocity: Math.round(avgReciprocity * 10) / 10,
        observationCount: filtered.length,
        narrativeSummary,
    };
}

/**
 * Extract common patterns from text entries
 */
function extractPatterns(entries: string[]): string[] {
    if (entries.length === 0) return [];

    // Simple keyword extraction (could be enhanced with NLP)
    const keywords: Record<string, number> = {};
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for'];

    entries.forEach(entry => {
        entry.toLowerCase().split(/\s+/).forEach(word => {
            const clean = word.replace(/[^a-z]/g, '');
            if (clean.length > 3 && !stopWords.includes(clean)) {
                keywords[clean] = (keywords[clean] || 0) + 1;
            }
        });
    });

    return Object.entries(keywords)
        .filter(([, count]) => count > 1)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));
}

/**
 * Generate professional, dignity-centered narrative
 */
function generateNarrative(
    count: number,
    avgReciprocity: number,
    channels: string[],
    triggers: string[]
): string {
    if (count === 0) {
        return 'No observations recorded during this period.';
    }

    const reciprocityDescription = avgReciprocity >= 4
        ? 'strong mutual recognition and connection'
        : avgReciprocity >= 3
            ? 'present and attuned engagement'
            : 'navigating challenging moments together';

    const channelText = channels.length > 0
        ? `Primary communication channels observed include ${channels.join(', ')}.`
        : '';

    const triggerText = triggers.length > 0
        ? `Environmental factors noted: ${triggers.join(', ')}.`
        : '';

    return `Over ${count} documented observations, this child demonstrates ${reciprocityDescription}. ${channelText} ${triggerText} These insights honor the child's unique communication style and support collaborative care planning.`.trim();
}
