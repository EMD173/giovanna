/**
 * Profile Firestore Operations
 * 
 * CRUD operations for user profiles and regulation state calculations.
 */

import {
    collection,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import type { UserProfile, RegulationState, BiologicalContext, SystemicContext } from '../stores/profileTypes';
import { getObservations } from './firestore';

const profilesRef = collection(db, 'profiles');

/**
 * Get user profile
 */
export async function getProfile(userId: string): Promise<UserProfile | null> {
    const docRef = doc(profilesRef, userId);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
        return null;
    }

    return {
        id: snapshot.id,
        ...snapshot.data()
    } as UserProfile;
}

/**
 * Create initial profile (Recognition Rite Step 1)
 */
export async function createProfile(
    userId: string,
    data: {
        parentTitle: string;
        childName: string;
        childAge?: number;
    }
): Promise<void> {
    const docRef = doc(profilesRef, userId);

    await setDoc(docRef, {
        userId,
        parent: { title: data.parentTitle },
        childName: data.childName,
        childAge: data.childAge,
        onboardingComplete: false,
        onboardingStep: 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
}

/**
 * Update biological context (Recognition Rite Step 2)
 */
export async function updateBiologicalContext(
    userId: string,
    context: BiologicalContext
): Promise<void> {
    const docRef = doc(profilesRef, userId);

    await updateDoc(docRef, {
        biologicalContext: context,
        onboardingStep: 2,
        updatedAt: serverTimestamp(),
    });
}

/**
 * Update systemic context (Recognition Rite Step 3)
 */
export async function updateSystemicContext(
    userId: string,
    context: SystemicContext
): Promise<void> {
    const docRef = doc(profilesRef, userId);

    await updateDoc(docRef, {
        systemicContext: context,
        onboardingStep: 3,
        onboardingComplete: true,
        updatedAt: serverTimestamp(),
    });
}

/**
 * Update profile with partial data
 */
export async function updateProfile(
    userId: string,
    data: Partial<UserProfile>
): Promise<void> {
    const docRef = doc(profilesRef, userId);

    await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
    });
}

/**
 * Calculate regulation state from recent observations
 * Core logic for Bio-Responsive Stats
 */
export async function calculateRegulationState(userId: string): Promise<RegulationState> {
    const observations = await getObservations(userId, 50);

    // Filter to last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentObs = observations.filter(obs => {
        const obsDate = obs.timestamp.toDate();
        return obsDate >= sevenDaysAgo;
    });

    if (recentObs.length === 0) {
        return {
            averageReciprocity: 3,
            systemicStressLevel: 0,
            observationCount: 0,
            lastUpdated: new Date(),
            trend: 'stable',
        };
    }

    // Calculate average reciprocity
    const totalReciprocity = recentObs.reduce((sum, obs) => sum + obs.relationalReciprocity, 0);
    const averageReciprocity = totalReciprocity / recentObs.length;

    // Detect systemic stress (keywords in atmospheric resonance)
    const stressKeywords = ['stress', 'exhaustion', 'overwhelm', 'crisis', 'difficult', 'hard', 'struggle'];
    const stressCount = recentObs.filter(obs => {
        const text = obs.atmosphericResonance.toLowerCase();
        return stressKeywords.some(keyword => text.includes(keyword));
    }).length;
    const systemicStressLevel = Math.min(stressCount / recentObs.length, 1);

    // Calculate trend (compare first half vs second half)
    const midpoint = Math.floor(recentObs.length / 2);
    if (recentObs.length >= 4) {
        const earlyAvg = recentObs.slice(0, midpoint).reduce((s, o) => s + o.relationalReciprocity, 0) / midpoint;
        const lateAvg = recentObs.slice(midpoint).reduce((s, o) => s + o.relationalReciprocity, 0) / (recentObs.length - midpoint);

        const trend = lateAvg > earlyAvg + 0.5 ? 'rising'
            : lateAvg < earlyAvg - 0.5 ? 'declining'
                : 'stable';

        return {
            averageReciprocity: Math.round(averageReciprocity * 10) / 10,
            systemicStressLevel: Math.round(systemicStressLevel * 100) / 100,
            observationCount: recentObs.length,
            lastUpdated: new Date(),
            trend,
        };
    }

    return {
        averageReciprocity: Math.round(averageReciprocity * 10) / 10,
        systemicStressLevel: Math.round(systemicStressLevel * 100) / 100,
        observationCount: recentObs.length,
        lastUpdated: new Date(),
        trend: 'stable',
    };
}
