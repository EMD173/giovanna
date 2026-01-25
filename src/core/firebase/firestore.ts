/**
 * Firestore Data Layer
 * 
 * Relational operations for the Epigenetic schema.
 * This is NOT surveillance infrastructure — it is a
 * witnessing archive for the family's homeplace.
 */

import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp
} from 'firebase/firestore';
import { db } from './config';
import type { Observation, OracleReflection, ReciprocityLevel, ResonanceChannel, MediaAttachment } from '../stores/types';

// Collection references
const observationsRef = collection(db, 'observations');
const reflectionsRef = collection(db, 'reflections');

/**
 * Save an observation to Firestore
 */
export async function saveObservation(
    userId: string,
    data: {
        strengthNarrative: string;
        channels: ResonanceChannel[];
        atmosphericResonance: string;
        relationalReciprocity: ReciprocityLevel;
        biologicalNeeds: string;
        media?: MediaAttachment[];
    }
): Promise<string> {
    const docRef = await addDoc(observationsRef, {
        userId,
        timestamp: serverTimestamp(),
        ...data,
    });
    return docRef.id;
}

/**
 * Get user's recent observations
 */
export async function getObservations(
    userId: string,
    limitCount: number = 20
): Promise<Observation[]> {
    const q = query(
        observationsRef,
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Observation[];
}

/**
 * Save an Oracle reflection
 */
export async function saveReflection(
    userId: string,
    data: {
        emergentTheme: string;
        sourceObservations: string[];
        scholarlyQuestion: string;
    }
): Promise<string> {
    const docRef = await addDoc(reflectionsRef, {
        userId,
        timestamp: serverTimestamp(),
        ...data,
    });
    return docRef.id;
}

/**
 * Get Oracle's past reflections for a user
 */
export async function getReflections(
    userId: string,
    limitCount: number = 10
): Promise<OracleReflection[]> {
    const q = query(
        reflectionsRef,
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as OracleReflection[];
}

/**
 * Calculate Sanctuary Pulse from recent observations
 */
export async function calculateSanctuaryPulse(userId: string) {
    const observations = await getObservations(userId, 10);

    if (observations.length === 0) {
        return {
            averageReciprocity: 3,
            systemicStressDetected: false,
            recentObservationCount: 0,
            lastUpdated: new Date(),
        };
    }

    // Calculate average reciprocity
    const totalReciprocity = observations.reduce(
        (sum, obs) => sum + obs.relationalReciprocity,
        0
    );
    const averageReciprocity = totalReciprocity / observations.length;

    // Detect systemic stress keywords
    const stressKeywords = [
        'school', 'police', 'IEP', 'diagnosis', 'therapy',
        'insurance', 'institution', 'system', 'waiting', 'denied'
    ];

    const systemicStressDetected = observations.some(obs =>
        stressKeywords.some(keyword =>
            obs.atmosphericResonance?.toLowerCase().includes(keyword)
        )
    );

    return {
        averageReciprocity,
        systemicStressDetected,
        recentObservationCount: observations.length,
        lastUpdated: new Date(),
    };
}
