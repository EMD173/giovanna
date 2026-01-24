/**
 * Sanctuary Pulse Store (Zustand)
 * 
 * Dynamic materiality state derived from observation patterns.
 * This drives the visual atmosphere of the Dashboard.
 */

import { create } from 'zustand';
import type { SanctuaryPulse } from './types';
import { calculateSanctuaryPulse } from '../firebase/firestore';

interface SanctuaryPulseStore extends SanctuaryPulse {
    // Actions
    refresh: (userId: string) => Promise<void>;

    // Derived CSS modifiers
    getGoldIntensity: () => number;      // 0-1 for Gold Shimmer
    getPurpleDepth: () => number;        // 0-1 for Regal Purple
    getGlassOpacity: () => number;       // 0.3-0.6 for glass panels
}

export const useSanctuaryPulse = create<SanctuaryPulseStore>((set, get) => ({
    // Initial state (neutral)
    averageReciprocity: 3,
    systemicStressDetected: false,
    recentObservationCount: 0,
    lastUpdated: new Date(),

    // Refresh from Firestore
    refresh: async (userId: string) => {
        const pulse = await calculateSanctuaryPulse(userId);
        set(pulse);
    },

    // Gold intensity increases with reciprocity (high connection = warm gold)
    getGoldIntensity: () => {
        const { averageReciprocity } = get();
        // Map 1-5 to 0-1 (1,2 = 0, 3 = 0.3, 4 = 0.6, 5 = 1)
        return Math.max(0, (averageReciprocity - 2) / 3);
    },

    // Purple deepens with systemic stress detection
    getPurpleDepth: () => {
        const { systemicStressDetected, averageReciprocity } = get();
        if (systemicStressDetected) return 1;
        // Also deepen if low reciprocity (struggle)
        if (averageReciprocity <= 2) return 0.7;
        return 0.3; // Default gentle purple
    },

    // Glass opacity increases during stress (more protection)
    getGlassOpacity: () => {
        const { systemicStressDetected, averageReciprocity } = get();
        if (systemicStressDetected) return 0.6; // More opaque = more held
        if (averageReciprocity >= 4) return 0.3; // Light and open
        return 0.45; // Neutral
    },
}));
