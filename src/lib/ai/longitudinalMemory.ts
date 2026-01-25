/**
 * LONGITUDINAL MEMORY SYSTEM
 * 
 * Core innovation: AI that truly "knows" the child over their lifetime.
 * 
 * Architecture:
 * - ChildUnderstanding: Persistent model of the child's patterns, preferences, and growth
 * - PatternMemory: Patterns that persist across sessions and grow more confident over time
 * - TimelineSlice: Efficient temporal context for any AI query
 * - GrowthTrajectory: Long-term development tracking
 * 
 * Philosophy:
 * - Memory is not surveillance — it is witnessing across time
 * - The AI should know the child as deeply as a beloved grandparent
 * - All patterns are framed in dignity, never deficit
 */

import type { Observation } from '../../core/stores/types';
import { 
    processEmergence, 
    observationsToNodes,
    calculateSystemicEntropy,
    type EmergentPattern,
    type TrajectoryNode,
    type SystemicState 
} from './agents/oracle';

// ============================================================================
// CORE TYPES
// ============================================================================

/**
 * TimelineSlice: A focused window of observations for efficient AI context
 */
export interface TimelineSlice {
    observations: Observation[];
    nodes: TrajectoryNode[];
    patterns: EmergentPattern[];
    systemicState: SystemicState;
    dateRange: {
        start: Date;
        end: Date;
    };
    observationCount: number;
}

/**
 * PatternMemory: A pattern that persists and grows more confident over time
 */
export interface PatternMemory {
    id: string;
    pattern: EmergentPattern;
    
    // Confidence tracking
    firstDetected: Date;
    lastConfirmed: Date;
    confirmationCount: number;       // How many times pattern was re-detected
    confidence: number;              // 0-1, grows with confirmations
    
    // Memory classification
    memoryType: 'short-term' | 'working' | 'long-term';
    
    // Human-readable insights
    parentSummary: string;           // "When there's stress at school, Leo often needs movement"
    professionalSummary: string;     // "Environmental stressors correlate with vestibular seeking"
    
    // Related insights
    relatedPatterns: string[];       // IDs of related patterns
    
    // Actions taken
    wasShared: boolean;              // Whether parent shared with care team
    wasActedUpon: boolean;           // Whether parent marked as helpful
}

/**
 * GrowthMilestone: A moment of development worth celebrating
 */
export interface GrowthMilestone {
    id: string;
    date: Date;
    type: 'connection' | 'regulation' | 'communication' | 'skill' | 'breakthrough';
    
    title: string;                   // "First time using words during overwhelm"
    description: string;             // Full narrative
    
    // Quantitative context
    previousBaseline?: number;       // e.g., average reciprocity before
    newBaseline?: number;            // e.g., average reciprocity after
    percentageChange?: number;
    
    // Evidence
    sourceObservationIds: string[];
    
    // Celebration
    celebrated: boolean;             // Did parent acknowledge?
    sharedWith: string[];            // Team member IDs
}

/**
 * ChildUnderstanding: The AI's persistent model of this unique child
 */
export interface ChildUnderstanding {
    id: string;
    userId: string;
    childName: string;
    
    // Temporal context
    firstObservationDate: Date;
    lastObservationDate: Date;
    totalObservations: number;
    
    // Pattern memory (what we've learned)
    patterns: PatternMemory[];
    
    // Growth trajectory
    milestones: GrowthMilestone[];
    
    // Current understanding (updated regularly)
    currentInsights: {
        // What works
        effectiveStrategies: StrategyInsight[];
        
        // Warning signals
        stressPredictors: StressPredictorInsight[];
        
        // Rhythms
        temporalRhythms: TemporalRhythmInsight[];
        
        // Communication style
        dominantChannels: ChannelInsight[];
        
        // Connection patterns
        connectionFactors: ConnectionInsight[];
    };
    
    // Aggregate metrics
    metrics: {
        overallReciprocityTrend: 'rising' | 'stable' | 'declining';
        averageReciprocity: number;
        patternStability: number;    // 0-1: how stable are the detected patterns
        observationFrequency: number; // Observations per week
    };
    
    // System metadata
    lastUpdated: Date;
    memoryVersion: number;
}

/**
 * StrategyInsight: What helps this child regulate
 */
export interface StrategyInsight {
    strategy: string;                // "Deep pressure / weighted blanket"
    effectiveness: number;           // 0-1 confidence in effectiveness
    contexts: string[];              // "After school", "During transitions"
    evidenceCount: number;           // Number of observations supporting this
    lastObserved: Date;
}

/**
 * StressPredictorInsight: Early warning signals
 */
export interface StressPredictorInsight {
    predictor: string;               // "School pickup Mondays"
    severity: 'low' | 'moderate' | 'high';
    usualResponse: string;           // What typically follows
    preventiveAction: string;        // What helps prevent escalation
    confidence: number;
}

/**
 * TemporalRhythmInsight: Time-of-day patterns
 */
export interface TemporalRhythmInsight {
    timeWindow: string;              // "Morning 7-9am", "Evening 5-7pm"
    pattern: 'peak-connection' | 'challenging' | 'variable' | 'optimal-learning';
    averageReciprocity: number;
    suggestedApproach: string;
}

/**
 * ChannelInsight: Communication style patterns
 */
export interface ChannelInsight {
    channel: string;                 // "Body Wisdom", "Joy Expression"
    frequency: number;               // 0-1 how often this channel appears
    associatedReciprocity: number;   // Average reciprocity when this channel is present
    meaning: string;                 // What this channel means for this child
}

/**
 * ConnectionInsight: What creates deep connection with this child
 */
export interface ConnectionInsight {
    factor: string;                  // "Outdoor time", "One-on-one attention"
    impactScore: number;             // 0-1 how much this improves connection
    evidenceCount: number;
    parentNote?: string;             // Parent's own observation
}

// ============================================================================
// CORE FUNCTIONS
// ============================================================================

/**
 * Build a TimelineSlice for a specific date range
 */
export function buildTimelineSlice(
    observations: Observation[],
    options?: {
        startDate?: Date;
        endDate?: Date;
        maxObservations?: number;
    }
): TimelineSlice {
    const { startDate, endDate, maxObservations = 100 } = options || {};
    
    // Filter by date range
    let filtered = observations;
    if (startDate) {
        filtered = filtered.filter(o => o.timestamp.toDate() >= startDate);
    }
    if (endDate) {
        filtered = filtered.filter(o => o.timestamp.toDate() <= endDate);
    }
    
    // Limit and sort
    filtered = filtered
        .sort((a, b) => b.timestamp.toDate().getTime() - a.timestamp.toDate().getTime())
        .slice(0, maxObservations);
    
    // Build nodes and analyze
    const nodes = observationsToNodes(filtered);
    const patterns = processEmergence(filtered);
    const systemicState = calculateSystemicEntropy(filtered);
    
    // Calculate date range
    const dates = filtered.map(o => o.timestamp.toDate());
    const dateRange = {
        start: dates.length > 0 ? new Date(Math.min(...dates.map(d => d.getTime()))) : new Date(),
        end: dates.length > 0 ? new Date(Math.max(...dates.map(d => d.getTime()))) : new Date(),
    };
    
    return {
        observations: filtered,
        nodes,
        patterns,
        systemicState,
        dateRange,
        observationCount: filtered.length,
    };
}

/**
 * Create or update ChildUnderstanding from observations
 */
export function buildChildUnderstanding(
    userId: string,
    childName: string,
    observations: Observation[],
    existingUnderstanding?: ChildUnderstanding
): ChildUnderstanding {
    if (observations.length === 0) {
        return createEmptyUnderstanding(userId, childName);
    }
    
    // Get timeline slice for all observations
    const timelineSlice = buildTimelineSlice(observations);
    
    // Build pattern memories
    const patterns = buildPatternMemories(
        timelineSlice.patterns,
        existingUnderstanding?.patterns || []
    );
    
    // Detect milestones
    const milestones = detectMilestones(
        observations,
        existingUnderstanding?.milestones || []
    );
    
    // Build current insights
    const currentInsights = buildCurrentInsights(observations, patterns);
    
    // Calculate metrics
    const metrics = calculateMetrics(observations);
    
    return {
        id: existingUnderstanding?.id || `understanding-${userId}-${Date.now()}`,
        userId,
        childName,
        firstObservationDate: timelineSlice.dateRange.start,
        lastObservationDate: timelineSlice.dateRange.end,
        totalObservations: observations.length,
        patterns,
        milestones,
        currentInsights,
        metrics,
        lastUpdated: new Date(),
        memoryVersion: (existingUnderstanding?.memoryVersion || 0) + 1,
    };
}

/**
 * Create empty understanding for new users
 */
function createEmptyUnderstanding(userId: string, childName: string): ChildUnderstanding {
    return {
        id: `understanding-${userId}-${Date.now()}`,
        userId,
        childName,
        firstObservationDate: new Date(),
        lastObservationDate: new Date(),
        totalObservations: 0,
        patterns: [],
        milestones: [],
        currentInsights: {
            effectiveStrategies: [],
            stressPredictors: [],
            temporalRhythms: [],
            dominantChannels: [],
            connectionFactors: [],
        },
        metrics: {
            overallReciprocityTrend: 'stable',
            averageReciprocity: 3,
            patternStability: 0,
            observationFrequency: 0,
        },
        lastUpdated: new Date(),
        memoryVersion: 1,
    };
}

/**
 * Build pattern memories from detected patterns
 * Merges with existing memories, increasing confidence for re-detected patterns
 */
function buildPatternMemories(
    detectedPatterns: EmergentPattern[],
    existingMemories: PatternMemory[]
): PatternMemory[] {
    const now = new Date();
    const memories: PatternMemory[] = [];
    
    // Create lookup for existing patterns by pattern type and description
    const existingLookup = new Map<string, PatternMemory>();
    existingMemories.forEach(m => {
        const key = `${m.pattern.patternType}:${m.pattern.triggerCondition}`;
        existingLookup.set(key, m);
    });
    
    // Process detected patterns
    for (const pattern of detectedPatterns) {
        const key = `${pattern.patternType}:${pattern.triggerCondition}`;
        const existing = existingLookup.get(key);
        
        if (existing) {
            // Pattern was re-detected - increase confidence
            const confirmationCount = existing.confirmationCount + 1;
            const confidence = Math.min(0.95, existing.confidence + 0.05);
            
            // Promote memory type based on confirmations
            let memoryType: PatternMemory['memoryType'] = 'short-term';
            if (confirmationCount >= 10) {
                memoryType = 'long-term';
            } else if (confirmationCount >= 4) {
                memoryType = 'working';
            }
            
            memories.push({
                ...existing,
                pattern, // Update with latest pattern data
                lastConfirmed: now,
                confirmationCount,
                confidence,
                memoryType,
            });
            
            existingLookup.delete(key); // Remove from lookup
        } else {
            // New pattern detected
            memories.push({
                id: `memory-${pattern.id}`,
                pattern,
                firstDetected: now,
                lastConfirmed: now,
                confirmationCount: 1,
                confidence: pattern.confidence,
                memoryType: 'short-term',
                parentSummary: generateParentSummary(pattern),
                professionalSummary: generateProfessionalSummary(pattern),
                relatedPatterns: [],
                wasShared: false,
                wasActedUpon: false,
            });
        }
    }
    
    // Keep existing patterns that weren't re-detected (with decay)
    existingLookup.forEach(oldMemory => {
        // Only keep long-term or working memories
        if (oldMemory.memoryType !== 'short-term') {
            memories.push({
                ...oldMemory,
                // Slight confidence decay for non-confirmed patterns
                confidence: Math.max(0.2, oldMemory.confidence - 0.02),
            });
        }
    });
    
    return memories.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Generate parent-friendly summary of a pattern
 */
function generateParentSummary(pattern: EmergentPattern): string {
    switch (pattern.patternType) {
        case 'biological-atmospheric':
            return `When there's stress in the environment, your child often shows increased ${pattern.outcome.toLowerCase()}.`;
        case 'channel-reciprocity':
            return pattern.description;
        case 'temporal-cycle':
            return pattern.description;
        case 'stress-response':
            return `After stressful moments, ${pattern.outcome}`;
        default:
            return pattern.description;
    }
}

/**
 * Generate professional summary of a pattern
 */
function generateProfessionalSummary(pattern: EmergentPattern): string {
    return `${pattern.patternType.replace(/-/g, ' ').toUpperCase()}: ${pattern.triggerCondition} → ${pattern.outcome}. Confidence: ${(pattern.confidence * 100).toFixed(0)}%.`;
}

/**
 * Detect milestones from observation history
 */
function detectMilestones(
    observations: Observation[],
    existingMilestones: GrowthMilestone[]
): GrowthMilestone[] {
    const milestones = [...existingMilestones];
    if (observations.length < 10) return milestones;
    
    // Sort by timestamp
    const sorted = observations.sort((a, b) => 
        a.timestamp.toDate().getTime() - b.timestamp.toDate().getTime()
    );
    
    // Split into quarters
    const quarterSize = Math.floor(sorted.length / 4);
    if (quarterSize < 3) return milestones;
    
    const firstQuarter = sorted.slice(0, quarterSize);
    const lastQuarter = sorted.slice(-quarterSize);
    
    // Calculate reciprocity averages
    const firstAvg = firstQuarter.reduce((s, o) => s + o.relationalReciprocity, 0) / firstQuarter.length;
    const lastAvg = lastQuarter.reduce((s, o) => s + o.relationalReciprocity, 0) / lastQuarter.length;
    
    // Detect significant improvement
    const improvement = ((lastAvg - firstAvg) / firstAvg) * 100;
    if (improvement > 20) {
        // Check if we already have a similar milestone
        const hasRecent = milestones.some(m => 
            m.type === 'connection' && 
            (new Date().getTime() - m.date.getTime()) < 30 * 24 * 60 * 60 * 1000
        );
        
        if (!hasRecent) {
            milestones.push({
                id: `milestone-connection-${Date.now()}`,
                date: new Date(),
                type: 'connection',
                title: 'Growing Connection Strength',
                description: `Average relational reciprocity has improved by ${improvement.toFixed(0)}% over your documented observations.`,
                previousBaseline: firstAvg,
                newBaseline: lastAvg,
                percentageChange: improvement,
                sourceObservationIds: lastQuarter.map(o => o.id),
                celebrated: false,
                sharedWith: [],
            });
        }
    }
    
    // Detect first high-connection moment
    const highConnection = sorted.find(o => o.relationalReciprocity >= 5);
    if (highConnection) {
        const hasHighMilestone = milestones.some(m => m.type === 'breakthrough');
        if (!hasHighMilestone) {
            milestones.push({
                id: `milestone-first-5-${Date.now()}`,
                date: highConnection.timestamp.toDate(),
                type: 'breakthrough',
                title: 'Moment of Deep Mutual Recognition',
                description: `A moment of profound connection was documented: "${highConnection.strengthNarrative.slice(0, 100)}..."`,
                sourceObservationIds: [highConnection.id],
                celebrated: false,
                sharedWith: [],
            });
        }
    }
    
    return milestones;
}

/**
 * Build current insights from observations and patterns
 */
function buildCurrentInsights(
    observations: Observation[],
    patterns: PatternMemory[]
): ChildUnderstanding['currentInsights'] {
    // Effective Strategies
    const effectiveStrategies = extractStrategies(observations);
    
    // Stress Predictors
    const stressPredictors = extractStressPredictors(patterns);
    
    // Temporal Rhythms
    const temporalRhythms = extractTemporalRhythms(observations);
    
    // Dominant Channels
    const dominantChannels = extractChannelInsights(observations);
    
    // Connection Factors
    const connectionFactors = extractConnectionFactors(observations);
    
    return {
        effectiveStrategies,
        stressPredictors,
        temporalRhythms,
        dominantChannels,
        connectionFactors,
    };
}

/**
 * Extract what strategies work based on high-reciprocity observations
 */
function extractStrategies(observations: Observation[]): StrategyInsight[] {
    const highReciprocity = observations.filter(o => o.relationalReciprocity >= 4);
    if (highReciprocity.length < 2) return [];
    
    // Common themes in biological needs during high connection
    const bioThemes: Record<string, number> = {};
    highReciprocity.forEach(o => {
        const words = o.biologicalNeeds.toLowerCase().split(/[,\s]+/);
        words.forEach(w => {
            if (w.length > 3) {
                bioThemes[w] = (bioThemes[w] || 0) + 1;
            }
        });
    });
    
    // Convert to strategies
    const strategies: StrategyInsight[] = [];
    const themeMap: Record<string, string> = {
        'calm': 'Quiet, low-stimulation environment',
        'regulated': 'Maintaining regulatory state',
        'movement': 'Movement breaks and physical activity',
        'pressure': 'Deep pressure / proprioceptive input',
        'quiet': 'Reduced auditory stimulation',
        'outside': 'Outdoor time and nature',
        'rest': 'Adequate rest and recovery time',
    };
    
    Object.entries(bioThemes)
        .filter(([, count]) => count >= 2)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .forEach(([theme, count]) => {
            const strategy = themeMap[theme] || `${theme} support`;
            strategies.push({
                strategy,
                effectiveness: Math.min(count / highReciprocity.length, 0.95),
                contexts: ['High-connection moments'],
                evidenceCount: count,
                lastObserved: new Date(),
            });
        });
    
    return strategies;
}

/**
 * Extract stress predictors from patterns
 */
function extractStressPredictors(patterns: PatternMemory[]): StressPredictorInsight[] {
    return patterns
        .filter(p => p.pattern.patternType === 'stress-response' || 
                    p.pattern.patternType === 'biological-atmospheric')
        .filter(p => p.confidence > 0.5)
        .slice(0, 5)
        .map(p => ({
            predictor: p.pattern.triggerCondition,
            severity: p.confidence > 0.8 ? 'high' : p.confidence > 0.6 ? 'moderate' : 'low',
            usualResponse: p.pattern.outcome,
            preventiveAction: generatePreventiveAction(p.pattern),
            confidence: p.confidence,
        }));
}

/**
 * Generate preventive action for a stress pattern
 */
function generatePreventiveAction(pattern: EmergentPattern): string {
    if (pattern.outcome.toLowerCase().includes('sensory')) {
        return 'Prepare sensory supports (noise-canceling headphones, fidgets) before the triggering event';
    }
    if (pattern.outcome.toLowerCase().includes('vestibular') || 
        pattern.outcome.toLowerCase().includes('movement')) {
        return 'Build in movement breaks before and during the triggering event';
    }
    if (pattern.outcome.toLowerCase().includes('proprioceptive')) {
        return 'Offer deep pressure or heavy work activities beforehand';
    }
    return 'Reduce environmental demands and increase co-regulation support';
}

/**
 * Extract temporal rhythm insights
 */
function extractTemporalRhythms(observations: Observation[]): TemporalRhythmInsight[] {
    if (observations.length < 10) return [];
    
    // Group by 4-hour buckets
    const buckets: Record<string, { reciprocities: number[]; label: string }> = {
        '0': { reciprocities: [], label: 'Night (12-4am)' },
        '1': { reciprocities: [], label: 'Early Morning (4-8am)' },
        '2': { reciprocities: [], label: 'Morning (8am-12pm)' },
        '3': { reciprocities: [], label: 'Afternoon (12-4pm)' },
        '4': { reciprocities: [], label: 'Evening (4-8pm)' },
        '5': { reciprocities: [], label: 'Night (8pm-12am)' },
    };
    
    observations.forEach(o => {
        const hour = o.timestamp.toDate().getHours();
        const bucket = Math.floor(hour / 4).toString();
        buckets[bucket].reciprocities.push(o.relationalReciprocity);
    });
    
    const overallAvg = observations.reduce((s, o) => s + o.relationalReciprocity, 0) / observations.length;
    
    const rhythms: TemporalRhythmInsight[] = [];
    
    Object.entries(buckets).forEach(([, data]) => {
        if (data.reciprocities.length < 3) return;
        
        const avg = data.reciprocities.reduce((s, r) => s + r, 0) / data.reciprocities.length;
        const diff = avg - overallAvg;
        
        let pattern: TemporalRhythmInsight['pattern'];
        let suggestedApproach: string;
        
        if (diff > 0.5) {
            pattern = 'peak-connection';
            suggestedApproach = 'Great time for bonding, learning, and challenging activities';
        } else if (diff < -0.5) {
            pattern = 'challenging';
            suggestedApproach = 'Reduce demands, increase support, plan rest if possible';
        } else {
            pattern = 'variable';
            suggestedApproach = 'Watch for cues and adjust support as needed';
        }
        
        rhythms.push({
            timeWindow: data.label,
            pattern,
            averageReciprocity: avg,
            suggestedApproach,
        });
    });
    
    return rhythms.sort((a, b) => b.averageReciprocity - a.averageReciprocity);
}

/**
 * Extract dominant channel insights
 */
function extractChannelInsights(observations: Observation[]): ChannelInsight[] {
    const channelData: Record<string, { count: number; totalReciprocity: number }> = {};
    
    observations.forEach(o => {
        o.channels.forEach(channel => {
            if (!channelData[channel]) {
                channelData[channel] = { count: 0, totalReciprocity: 0 };
            }
            channelData[channel].count++;
            channelData[channel].totalReciprocity += o.relationalReciprocity;
        });
    });
    
    const total = observations.length;
    
    const channelMeanings: Record<string, string> = {
        'Seeking Safety': 'Shows need for security and predictability',
        'Sensory Need': 'Communicates through sensory seeking or avoiding',
        'Connection Bid': 'Actively seeks relationship and attention',
        'Transition Signal': 'Communicates about changes and shifts',
        'Body Wisdom': 'Expresses through physical movement and body',
        'Joy Expression': 'Shares positive emotions and excitement',
    };
    
    return Object.entries(channelData)
        .map(([channel, data]) => ({
            channel,
            frequency: data.count / total,
            associatedReciprocity: data.totalReciprocity / data.count,
            meaning: channelMeanings[channel] || 'Unique communication style',
        }))
        .sort((a, b) => b.frequency - a.frequency);
}

/**
 * Extract connection factors from high-reciprocity observations
 */
function extractConnectionFactors(observations: Observation[]): ConnectionInsight[] {
    const highReciprocity = observations.filter(o => o.relationalReciprocity >= 4);
    if (highReciprocity.length < 2) return [];
    
    // Extract themes from atmospheric resonance
    const themes: Record<string, number> = {};
    
    highReciprocity.forEach(o => {
        const atmo = o.atmosphericResonance.toLowerCase();
        
        // Location-based factors
        if (atmo.includes('home')) themes['Home environment'] = (themes['Home environment'] || 0) + 1;
        if (atmo.includes('outside') || atmo.includes('outdoor')) themes['Outdoor time'] = (themes['Outdoor time'] || 0) + 1;
        if (atmo.includes('quiet')) themes['Quiet environment'] = (themes['Quiet environment'] || 0) + 1;
        
        // Activity-based factors
        if (atmo.includes('play')) themes['Play time'] = (themes['Play time'] || 0) + 1;
        if (atmo.includes('one on one') || atmo.includes('alone together')) themes['One-on-one attention'] = (themes['One-on-one attention'] || 0) + 1;
        
        // Time-based factors
        if (atmo.includes('morning')) themes['Morning time'] = (themes['Morning time'] || 0) + 1;
        if (atmo.includes('evening')) themes['Evening time'] = (themes['Evening time'] || 0) + 1;
    });
    
    return Object.entries(themes)
        .filter(([, count]) => count >= 2)
        .map(([factor, count]) => ({
            factor,
            impactScore: Math.min(count / highReciprocity.length, 0.95),
            evidenceCount: count,
        }))
        .sort((a, b) => b.impactScore - a.impactScore)
        .slice(0, 6);
}

/**
 * Calculate aggregate metrics
 */
function calculateMetrics(observations: Observation[]): ChildUnderstanding['metrics'] {
    if (observations.length === 0) {
        return {
            overallReciprocityTrend: 'stable',
            averageReciprocity: 3,
            patternStability: 0,
            observationFrequency: 0,
        };
    }
    
    // Sort by date
    const sorted = observations.sort((a, b) => 
        a.timestamp.toDate().getTime() - b.timestamp.toDate().getTime()
    );
    
    // Calculate average
    const avgReciprocity = sorted.reduce((s, o) => s + o.relationalReciprocity, 0) / sorted.length;
    
    // Calculate trend
    const halfIndex = Math.floor(sorted.length / 2);
    if (halfIndex > 2) {
        const firstHalf = sorted.slice(0, halfIndex);
        const secondHalf = sorted.slice(halfIndex);
        
        const firstAvg = firstHalf.reduce((s, o) => s + o.relationalReciprocity, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((s, o) => s + o.relationalReciprocity, 0) / secondHalf.length;
        
        const diff = secondAvg - firstAvg;
        const trend: 'rising' | 'stable' | 'declining' = 
            diff > 0.3 ? 'rising' : diff < -0.3 ? 'declining' : 'stable';
        
        return {
            overallReciprocityTrend: trend,
            averageReciprocity: avgReciprocity,
            patternStability: 0.5, // Would need persistent patterns to calculate
            observationFrequency: calculateFrequency(sorted),
        };
    }
    
    return {
        overallReciprocityTrend: 'stable',
        averageReciprocity: avgReciprocity,
        patternStability: 0,
        observationFrequency: calculateFrequency(sorted),
    };
}

/**
 * Calculate observation frequency (per week)
 */
function calculateFrequency(sortedObservations: Observation[]): number {
    if (sortedObservations.length < 2) return 0;
    
    const first = sortedObservations[0].timestamp.toDate();
    const last = sortedObservations[sortedObservations.length - 1].timestamp.toDate();
    
    const weeks = (last.getTime() - first.getTime()) / (7 * 24 * 60 * 60 * 1000);
    if (weeks < 1) return sortedObservations.length;
    
    return sortedObservations.length / weeks;
}

/**
 * Generate an AI context string from ChildUnderstanding
 * This is what gets passed to the Oracle for personalized responses
 */
export function generateAIContext(understanding: ChildUnderstanding): string {
    const parts: string[] = [];
    
    parts.push(`## LONGITUDINAL MEMORY: ${understanding.childName}`);
    parts.push(`Total observations: ${understanding.totalObservations} | Trend: ${understanding.metrics.overallReciprocityTrend}`);
    parts.push('');
    
    // Dominant channels
    if (understanding.currentInsights.dominantChannels.length > 0) {
        parts.push('### Communication Style');
        understanding.currentInsights.dominantChannels.slice(0, 3).forEach(c => {
            parts.push(`- ${c.channel} (${(c.frequency * 100).toFixed(0)}%): ${c.meaning}`);
        });
        parts.push('');
    }
    
    // What works
    if (understanding.currentInsights.effectiveStrategies.length > 0) {
        parts.push('### What Works');
        understanding.currentInsights.effectiveStrategies.slice(0, 3).forEach(s => {
            parts.push(`- ${s.strategy} (effectiveness: ${(s.effectiveness * 100).toFixed(0)}%)`);
        });
        parts.push('');
    }
    
    // Stress predictors
    if (understanding.currentInsights.stressPredictors.length > 0) {
        parts.push('### Watch For');
        understanding.currentInsights.stressPredictors.slice(0, 2).forEach(p => {
            parts.push(`- ${p.predictor} → ${p.usualResponse}`);
        });
        parts.push('');
    }
    
    // Long-term patterns
    const longTermPatterns = understanding.patterns.filter(p => p.memoryType === 'long-term');
    if (longTermPatterns.length > 0) {
        parts.push('### Confirmed Patterns');
        longTermPatterns.slice(0, 3).forEach(p => {
            parts.push(`- ${p.parentSummary} (confirmed ${p.confirmationCount}x)`);
        });
    }
    
    return parts.join('\n');
}

export default {
    buildTimelineSlice,
    buildChildUnderstanding,
    generateAIContext,
};
