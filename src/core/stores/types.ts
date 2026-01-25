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
 * Media attachment for observations
 */
export interface MediaAttachment {
    type: 'video' | 'image';
    url: string;                             // Firebase Storage URL
    thumbnailUrl?: string;                   // Thumbnail for videos
    duration?: number;                       // Video duration in seconds
    size?: number;                           // File size in bytes
    mimeType?: string;                       // MIME type
}

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

    // Media Attachments
    media?: MediaAttachment[];               // Video/image attachments

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

/**
 * =====================================================
 * SKILL TRACKING TYPES
 * =====================================================
 * ABA-informed skill building with dignity-centered framing
 */

/**
 * Skill Categories for organization
 */
export const SKILL_CATEGORIES = [
    'Communication',
    'Daily Living',
    'Social',
    'Academic',
    'Motor',
    'Self-Regulation',
] as const;

export type SkillCategory = typeof SKILL_CATEGORIES[number];

/**
 * Mastery levels for skill progression
 */
export const MASTERY_LEVELS = [
    'Emerging',      // Just starting, needs full support
    'Developing',    // Making progress, needs partial support
    'Practicing',    // Can do with minimal prompts
    'Mastered',      // Independent and consistent
] as const;

export type MasteryLevel = typeof MASTERY_LEVELS[number];

/**
 * Skill definition - a goal the child is working toward
 */
export interface Skill {
    id: string;
    userId: string;
    childName?: string;                    // Optional child name for multi-child support

    // Skill Details
    name: string;                          // e.g., "Request help using AAC device"
    description?: string;                  // Detailed description
    category: SkillCategory;               // Category for organization

    // Tracking Configuration
    targetFrequency?: 'daily' | 'weekly';  // How often to track
    targetCount?: number;                  // Target successful attempts per period

    // Current Status
    currentMastery: MasteryLevel;          // Current mastery level
    isActive: boolean;                     // Whether actively tracking

    // IEP Connection
    iepGoalId?: string;                    // Link to IEP goal if applicable

    // Timestamps
    createdAt: Timestamp;
    updatedAt: Timestamp;
    masteredAt?: Timestamp;                // When mastery achieved
}

/**
 * Skill entry - a single tracking data point
 */
export interface SkillEntry {
    id: string;
    skillId: string;
    userId: string;

    // Entry Data
    date: Timestamp;                       // Date of entry
    successCount: number;                  // Successful attempts
    attemptCount: number;                  // Total attempts
    promptLevel?: 'full' | 'partial' | 'minimal' | 'independent';

    // Context
    setting?: string;                      // Where (home, school, therapy)
    notes?: string;                        // Optional notes

    // Celebration
    isMilestone?: boolean;                 // Mark special achievements

    createdAt: Timestamp;
}

/**
 * Skill template - pre-defined skills for easy setup
 */
export interface SkillTemplate {
    id: string;
    name: string;
    description: string;
    category: SkillCategory;
    ageRange?: string;                     // e.g., "3-5", "6-12"
    suggestedTargetCount?: number;
}
