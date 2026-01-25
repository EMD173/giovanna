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
    analysis?: VideoAnalysis;                // AI analysis results (for videos)
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

/**
 * =====================================================
 * LONGITUDINAL MEMORY TYPES
 * =====================================================
 * AI-powered memory system that learns the child over time
 */

/**
 * Memory tiers for time-based organization
 */
export type MemoryTier = 'recent' | 'patterns' | 'lifetime';

/**
 * Insight categories for pattern recognition
 */
export const INSIGHT_CATEGORIES = [
    'trigger',           // What causes dysregulation
    'calming',           // What helps regulate
    'sensory',           // Sensory preferences/needs
    'communication',     // How child communicates
    'strength',          // Core strengths and joys
    'growth',            // Areas of growth/progress
    'connection',        // What builds connection
    'environment',       // Environmental factors
] as const;

export type InsightCategory = typeof INSIGHT_CATEGORIES[number];

/**
 * Individual memory insight - a learned pattern
 */
export interface MemoryInsight {
    id: string;
    userId: string;
    category: InsightCategory;

    // The insight content
    title: string;                         // Brief label: "Transitions are hard after school"
    description: string;                   // Detailed insight with context
    confidence: number;                    // 0-1, how confident based on observation count

    // Evidence
    sourceObservationIds: string[];        // Observations that support this insight
    firstObserved: Timestamp;              // When first detected
    lastConfirmed: Timestamp;              // When last confirmed by new observation

    // Status
    isActive: boolean;                     // Still relevant?
    tier: MemoryTier;                      // recent, patterns, lifetime

    // Oracle integration
    contextSnippet: string;                // Compact version for prompt injection

    createdAt: Timestamp;
    updatedAt: Timestamp;
}

/**
 * Child memory summary - periodic AI-generated overview
 */
export interface ChildMemorySummary {
    id: string;
    userId: string;

    // Time period covered
    periodStart: Timestamp;
    periodEnd: Timestamp;
    tier: MemoryTier;                      // recent (30 days), patterns (6 months), lifetime

    // Summary content
    narrativeSummary: string;              // Prose summary of the child during this period
    keyInsights: string[];                 // Bullet-point insights

    // Pattern analysis
    commonTriggers: string[];              // Frequently observed triggers
    effectiveStrategies: string[];         // What works
    communicationPatterns: string[];       // How child expresses needs
    strengthsObserved: string[];           // Recurring strengths

    // Metrics
    observationCount: number;              // How many observations in period
    averageReciprocity: number;            // Average reciprocity score
    dominantChannels: ResonanceChannel[];  // Most common communication channels

    // Growth indicators
    progressNotes?: string;                // Notable progress
    concernAreas?: string;                 // Areas needing attention

    createdAt: Timestamp;
    updatedAt: Timestamp;
}

/**
 * Memory context for Oracle prompt injection
 * Compact representation for API calls
 */
export interface MemoryContext {
    // Child overview (always included)
    childSummary: string;                  // 2-3 sentence summary

    // Recent patterns (last 30 days)
    recentInsights: {
        triggers: string[];
        calmingStrategies: string[];
        communicationNotes: string[];
    };

    // Relevant history (contextual)
    relevantMemories?: string[];           // Past observations relevant to current context

    // Skill progress context
    activeSkills?: {
        name: string;
        mastery: MasteryLevel;
        recentProgress: string;
    }[];

    // Systemic context
    systemicFactors?: string[];            // Current stressors, transitions, etc.
}

/**
 * Memory update event - tracks when memory was refreshed
 */
export interface MemoryUpdateEvent {
    id: string;
    userId: string;
    timestamp: Timestamp;
    tier: MemoryTier;
    observationsProcessed: number;
    insightsGenerated: number;
    summaryUpdated: boolean;
}

/**
 * =====================================================
 * VIDEO ANALYSIS TYPES
 * =====================================================
 * AI-powered video analysis for behavior understanding
 */

/**
 * Video analysis status
 */
export type VideoAnalysisStatus = 'pending' | 'processing' | 'completed' | 'failed';

/**
 * Detected element in video
 */
export interface VideoElement {
    type: 'behavior' | 'environment' | 'interaction' | 'emotion' | 'sensory';
    label: string;                         // Brief label
    description: string;                   // Detailed description
    timestamp?: number;                    // When in video (seconds)
    confidence: number;                    // 0-1 confidence score
}

/**
 * Video analysis result
 */
export interface VideoAnalysis {
    id: string;
    observationId?: string;                // Link to observation if attached
    videoUrl: string;                      // The analyzed video URL

    // Analysis status
    status: VideoAnalysisStatus;
    analyzedAt?: Timestamp;

    // AI-generated insights (dignity-centered)
    summary: string;                       // Brief summary of what's happening
    strengthsObserved: string[];           // Strengths and capabilities shown
    communicationNotes: string[];          // How child is communicating
    environmentalFactors: string[];        // Environmental context

    // Detected elements
    elements: VideoElement[];

    // Suggested strategies (strength-based)
    suggestedStrategies: string[];

    // Connection to memory
    relatedInsightIds?: string[];          // Links to existing memory insights
    newInsightSuggestions?: string[];      // Potential new insights to create

    // Metadata
    duration: number;                      // Video duration in seconds
    framesSampled: number;                 // How many frames were analyzed

    createdAt: Timestamp;
    updatedAt: Timestamp;
}

/**
 * Video analysis request (for queuing)
 */
export interface VideoAnalysisRequest {
    id: string;
    userId: string;
    videoUrl: string;
    observationId?: string;
    status: VideoAnalysisStatus;
    createdAt: Timestamp;
    completedAt?: Timestamp;
    error?: string;
}
