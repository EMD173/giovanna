/**
 * Epigenetic Data Schema
 * 
 * These types encode the Relational Resonance framework:
 * - Observation: Witnessing communication, not logging behavior
 * - OracleReflection: Emergent themes synthesized from patterns
 */

import type { Timestamp } from 'firebase/firestore';

/**
 * Channels of Communication
 * NOT triggers — these are ways the body speaks
 */
export const RESONANCE_CHANNELS = [
    'Seeking Safety',
    'Sensory Need',
    'Connection Bid',
    'Transition Signal',
    'Body Wisdom',
    'Joy Expression',
] as const;

export type ResonanceChannel = typeof RESONANCE_CHANNELS[number];

/**
 * Relational Reciprocity Scale
 * 1 = Disconnection / Misrecognition
 * 5 = Deep mutual recognition
 */
export type ReciprocityLevel = 1 | 2 | 3 | 4 | 5;

/**
 * Observation: A witnessed moment
 * 
 * This is NOT a behavior log. It is a relational record
 * that honors the communication between caregiver and child.
 */
export interface Observation {
    id: string;
    userId: string;
    timestamp: Timestamp;

    // The Witness
    strengthNarrative: string;               // Dignity-centered communication
    channels: ResonanceChannel[];            // Communication channels

    // Epigenetic Dimensions
    atmosphericResonance: string;            // Systemic/historical context
    relationalReciprocity: ReciprocityLevel; // Quality of connection
    biologicalNeeds: string;                 // Sensory/physical state

    // Team Sharing (Village Tier)
    teamId?: string;                         // Links to team when published
    isPublished?: boolean;                   // Whether shared with care team
}

/**
 * Oracle Reflection: Emergent themes from witnessing
 * 
 * The Oracle synthesizes patterns across observations
 * and poses scholarly, emotionally grounded questions.
 */
export interface OracleReflection {
    id: string;
    userId: string;
    timestamp: Timestamp;

    emergentTheme: string;                 // Pattern identified
    sourceObservations: string[];          // IDs of related observations
    scholarlyQuestion: string;             // Reflective mirroring question
}

/**
 * Sanctuary Pulse: Dynamic materiality state
 * Derived from observation patterns
 */
export interface SanctuaryPulse {
    averageReciprocity: number;            // 1-5 average
    systemicStressDetected: boolean;       // Stress in atmospheric resonance
    recentObservationCount: number;        // Last 7 days
    lastUpdated: Date;
}
