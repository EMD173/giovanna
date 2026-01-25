/**
 * MEMORY SERVICE: Longitudinal Intelligence
 *
 * Analyzes observations over time to build a deep understanding
 * of the child. Generates insights, summaries, and context for Oracle.
 *
 * Key Functions:
 * - analyzeObservations: Extract patterns from recent observations
 * - generateSummary: Create period summaries
 * - updateMemory: Refresh memory based on new observations
 * - getContextForOracle: Build context string for Oracle prompts
 */

import { getObservations } from '../../core/firebase/firestore';
import {
    createMemoryInsight,
    getMemoryInsights,
    reinforceInsight,
    saveMemorySummary,
    logMemoryUpdate,
    getLastMemoryUpdate,
    buildMemoryContextString,
} from '../../core/firebase/memory';
import type {
    Observation,
    MemoryInsight,
    InsightCategory,
    MemoryTier,
    ResonanceChannel,
} from '../../core/stores/types';

// =====================================================
// PATTERN ANALYSIS
// =====================================================

/**
 * Analyze observations to extract patterns and insights
 * Uses rule-based analysis (can be enhanced with AI later)
 */
export async function analyzeObservationsForInsights(
    userId: string,
    observations: Observation[]
): Promise<{
    newInsights: Partial<MemoryInsight>[];
    reinforcedInsightIds: string[];
}> {
    if (observations.length === 0) {
        return { newInsights: [], reinforcedInsightIds: [] };
    }

    const existingInsights = await getMemoryInsights(userId);
    const existingTitles = new Set(existingInsights.map((i) => i.title.toLowerCase()));

    const newInsights: Partial<MemoryInsight>[] = [];
    const reinforcedInsightIds: string[] = [];

    // Analyze channel frequency
    const channelCounts: Record<string, number> = {};
    observations.forEach((obs) => {
        obs.channels?.forEach((channel) => {
            channelCounts[channel] = (channelCounts[channel] || 0) + 1;
        });
    });

    // Find dominant channels (>30% of observations)
    const threshold = observations.length * 0.3;
    for (const [channel, count] of Object.entries(channelCounts)) {
        if (count >= threshold) {
            const title = `Frequent ${channel.toLowerCase()} communication`;

            if (existingTitles.has(title.toLowerCase())) {
                // Reinforce existing insight
                const existing = existingInsights.find(
                    (i) => i.title.toLowerCase() === title.toLowerCase()
                );
                if (existing) reinforcedInsightIds.push(existing.id);
            } else {
                // Create new insight
                newInsights.push({
                    category: mapChannelToCategory(channel as ResonanceChannel),
                    title,
                    description: `${channel} appears in ${count} of ${observations.length} recent observations, indicating this is a primary communication channel.`,
                    confidence: Math.min(0.9, count / observations.length),
                    contextSnippet: `Child often communicates through ${channel.toLowerCase()}`,
                    tier: 'patterns',
                });
            }
        }
    }

    // Analyze reciprocity patterns
    const avgReciprocity =
        observations.reduce((sum, obs) => sum + obs.relationalReciprocity, 0) /
        observations.length;

    if (avgReciprocity >= 4) {
        const title = 'Strong connection patterns';
        if (!existingTitles.has(title.toLowerCase())) {
            newInsights.push({
                category: 'connection',
                title,
                description: `Average reciprocity of ${avgReciprocity.toFixed(1)}/5 indicates strong parent-child connection during this period.`,
                confidence: 0.7,
                contextSnippet: 'Parent-child connection is generally strong',
                tier: 'patterns',
            });
        }
    } else if (avgReciprocity <= 2) {
        const title = 'Connection needs attention';
        if (!existingTitles.has(title.toLowerCase())) {
            newInsights.push({
                category: 'connection',
                title,
                description: `Average reciprocity of ${avgReciprocity.toFixed(1)}/5 suggests connection may be strained. Consider what environmental factors might be contributing.`,
                confidence: 0.6,
                contextSnippet: 'Connection may need extra attention right now',
                tier: 'recent',
            });
        }
    }

    // Analyze atmospheric resonance for triggers
    const triggers = extractTriggersFromAtmospheric(observations);
    for (const trigger of triggers) {
        const title = `${trigger.keyword} as a trigger`;
        if (!existingTitles.has(title.toLowerCase())) {
            newInsights.push({
                category: 'trigger',
                title,
                description: `"${trigger.keyword}" appears in ${trigger.count} observations' atmospheric context, suggesting it may be a trigger or stressor.`,
                confidence: Math.min(0.8, trigger.count / 5),
                contextSnippet: `"${trigger.keyword}" may be a trigger`,
                tier: 'patterns',
            });
        }
    }

    // Analyze biological needs patterns
    const bioPatterns = extractBiologicalPatterns(observations);
    for (const pattern of bioPatterns) {
        const title = pattern.title;
        if (!existingTitles.has(title.toLowerCase())) {
            newInsights.push({
                category: 'sensory',
                title,
                description: pattern.description,
                confidence: pattern.confidence,
                contextSnippet: pattern.snippet,
                tier: 'patterns',
            });
        }
    }

    return { newInsights, reinforcedInsightIds };
}

/**
 * Map resonance channel to insight category
 */
function mapChannelToCategory(channel: ResonanceChannel): InsightCategory {
    const mapping: Record<ResonanceChannel, InsightCategory> = {
        'Seeking Safety': 'trigger',
        'Sensory Need': 'sensory',
        'Connection Bid': 'connection',
        'Transition Signal': 'trigger',
        'Body Wisdom': 'sensory',
        'Joy Expression': 'strength',
    };
    return mapping[channel] || 'communication';
}

/**
 * Extract potential triggers from atmospheric resonance text
 */
function extractTriggersFromAtmospheric(
    observations: Observation[]
): { keyword: string; count: number }[] {
    const triggerKeywords = [
        'school',
        'homework',
        'transition',
        'loud',
        'crowded',
        'tired',
        'hungry',
        'change',
        'new',
        'unexpected',
        'waiting',
        'rushed',
        'morning',
        'evening',
        'sibling',
        'screen',
    ];

    const counts: Record<string, number> = {};

    observations.forEach((obs) => {
        const text = (obs.atmosphericResonance || '').toLowerCase();
        triggerKeywords.forEach((keyword) => {
            if (text.includes(keyword)) {
                counts[keyword] = (counts[keyword] || 0) + 1;
            }
        });
    });

    return Object.entries(counts)
        .filter(([, count]) => count >= 2)
        .map(([keyword, count]) => ({ keyword, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
}

/**
 * Extract patterns from biological needs
 */
function extractBiologicalPatterns(
    observations: Observation[]
): { title: string; description: string; confidence: number; snippet: string }[] {
    const patterns: { title: string; description: string; confidence: number; snippet: string }[] = [];

    const bioKeywords: Record<string, string[]> = {
        sleep: ['tired', 'sleep', 'nap', 'rest', 'exhausted', 'drowsy'],
        hunger: ['hungry', 'food', 'snack', 'meal', 'eat', 'blood sugar'],
        sensory: ['loud', 'bright', 'texture', 'smell', 'touch', 'overwhelm'],
        movement: ['run', 'jump', 'move', 'still', 'energy', 'restless'],
    };

    for (const [category, keywords] of Object.entries(bioKeywords)) {
        let count = 0;
        observations.forEach((obs) => {
            const text = (obs.biologicalNeeds || '').toLowerCase();
            if (keywords.some((kw) => text.includes(kw))) {
                count++;
            }
        });

        if (count >= 3) {
            patterns.push({
                title: `${category.charAt(0).toUpperCase() + category.slice(1)} sensitivity`,
                description: `${category}-related needs appear in ${count} observations, indicating this is an important biological factor.`,
                confidence: Math.min(0.8, count / observations.length),
                snippet: `${category} needs are important to monitor`,
            });
        }
    }

    return patterns;
}

// =====================================================
// SUMMARY GENERATION
// =====================================================

/**
 * Generate a summary for a time period
 */
export async function generatePeriodSummary(
    userId: string,
    observations: Observation[],
    tier: MemoryTier
): Promise<string | null> {
    if (observations.length === 0) return null;

    // Calculate period bounds
    const timestamps = observations.map((o) => o.timestamp.toDate());
    const periodStart = new Date(Math.min(...timestamps.map((t) => t.getTime())));
    const periodEnd = new Date(Math.max(...timestamps.map((t) => t.getTime())));

    // Calculate metrics
    const avgReciprocity =
        observations.reduce((sum, obs) => sum + obs.relationalReciprocity, 0) /
        observations.length;

    // Find dominant channels
    const channelCounts: Record<string, number> = {};
    observations.forEach((obs) => {
        obs.channels?.forEach((channel) => {
            channelCounts[channel] = (channelCounts[channel] || 0) + 1;
        });
    });
    const dominantChannels = Object.entries(channelCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([channel]) => channel);

    // Extract patterns
    const triggers = extractTriggersFromAtmospheric(observations);
    void extractBiologicalPatterns(observations); // Reserved for future sensory summary

    // Generate narrative summary
    const narrativeSummary = generateNarrativeSummary(
        observations.length,
        avgReciprocity,
        dominantChannels,
        triggers,
        tier
    );

    // Key insights from strength narratives
    const keyInsights = extractKeyInsights(observations);

    // Effective strategies (from high-reciprocity observations)
    const effectiveStrategies = extractStrategies(
        observations.filter((o) => o.relationalReciprocity >= 4)
    );

    // Strengths observed
    const strengthsObserved = extractStrengths(observations);

    // Save summary
    await saveMemorySummary(userId, {
        periodStart,
        periodEnd,
        tier,
        narrativeSummary,
        keyInsights,
        commonTriggers: triggers.map((t) => t.keyword),
        effectiveStrategies,
        communicationPatterns: dominantChannels,
        strengthsObserved,
        observationCount: observations.length,
        averageReciprocity: avgReciprocity,
        dominantChannels,
    });

    return narrativeSummary;
}

/**
 * Generate narrative summary text
 */
function generateNarrativeSummary(
    observationCount: number,
    avgReciprocity: number,
    dominantChannels: string[],
    triggers: { keyword: string; count: number }[],
    tier: MemoryTier
): string {
    const periodLabel =
        tier === 'recent'
            ? 'the past 30 days'
            : tier === 'patterns'
                ? 'the past 6 months'
                : 'over time';

    let summary = `Over ${periodLabel}, ${observationCount} moments have been witnessed. `;

    // Reciprocity narrative
    if (avgReciprocity >= 4) {
        summary += `Connection has been strong, with an average reciprocity of ${avgReciprocity.toFixed(1)}/5. `;
    } else if (avgReciprocity >= 3) {
        summary += `Connection has been steady, with room for deeper attunement. `;
    } else {
        summary += `This period has shown some connection challenges, which is data, not failure. `;
    }

    // Channel narrative
    if (dominantChannels.length > 0) {
        summary += `The child has primarily communicated through ${dominantChannels.join(', ').toLowerCase()}. `;
    }

    // Trigger narrative
    if (triggers.length > 0) {
        summary += `Environmental factors like ${triggers.slice(0, 2).map((t) => t.keyword).join(' and ')} have appeared frequently. `;
    }

    return summary;
}

/**
 * Extract key insights from observation narratives
 */
function extractKeyInsights(observations: Observation[]): string[] {
    const insights: string[] = [];

    // Look for patterns in strength narratives
    const highReciprocity = observations.filter((o) => o.relationalReciprocity >= 4);
    if (highReciprocity.length > 0) {
        insights.push(
            `${highReciprocity.length} moments of deep connection were witnessed`
        );
    }

    const lowReciprocity = observations.filter((o) => o.relationalReciprocity <= 2);
    if (lowReciprocity.length > 0) {
        insights.push(
            `${lowReciprocity.length} moments of disconnection offer learning opportunities`
        );
    }

    // Channel diversity
    const allChannels = new Set(observations.flatMap((o) => o.channels || []));
    if (allChannels.size >= 4) {
        insights.push('Child communicates through diverse channels');
    }

    return insights.slice(0, 5);
}

/**
 * Extract effective strategies from high-reciprocity observations
 */
function extractStrategies(observations: Observation[]): string[] {
    const strategies: string[] = [];

    // Look for patterns in what worked
    const strategyKeywords = [
        'worked',
        'helped',
        'calmed',
        'regulated',
        'connected',
        'smiled',
        'laughed',
        'relaxed',
    ];

    observations.forEach((obs) => {
        const narrative = (obs.strengthNarrative || '').toLowerCase();
        strategyKeywords.forEach((keyword) => {
            if (narrative.includes(keyword)) {
                // Extract a snippet around the keyword
                const idx = narrative.indexOf(keyword);
                const start = Math.max(0, idx - 30);
                const end = Math.min(narrative.length, idx + 50);
                const snippet = narrative.slice(start, end).trim();
                if (snippet.length > 10) {
                    strategies.push(snippet);
                }
            }
        });
    });

    // Deduplicate and limit
    return [...new Set(strategies)].slice(0, 5);
}

/**
 * Extract observed strengths
 */
function extractStrengths(observations: Observation[]): string[] {
    const strengths: string[] = [];

    // Joy expressions
    const joyObs = observations.filter((o) =>
        o.channels?.includes('Joy Expression')
    );
    if (joyObs.length > 0) {
        strengths.push('Expresses joy and delight');
    }

    // Connection bids
    const connectionObs = observations.filter((o) =>
        o.channels?.includes('Connection Bid')
    );
    if (connectionObs.length >= 3) {
        strengths.push('Actively seeks connection');
    }

    // Body wisdom
    const bodyObs = observations.filter((o) =>
        o.channels?.includes('Body Wisdom')
    );
    if (bodyObs.length >= 2) {
        strengths.push('Attuned to body signals');
    }

    return strengths;
}

// =====================================================
// MEMORY UPDATE ORCHESTRATION
// =====================================================

/**
 * Update memory system with new observations
 * Should be called periodically or after new observations
 */
export async function updateMemory(userId: string): Promise<{
    insightsGenerated: number;
    insightsReinforced: number;
    summaryUpdated: boolean;
}> {
    // Get recent observations
    const observations = await getObservations(userId, 50);

    if (observations.length === 0) {
        return { insightsGenerated: 0, insightsReinforced: 0, summaryUpdated: false };
    }

    // Analyze for insights
    const { newInsights, reinforcedInsightIds } = await analyzeObservationsForInsights(
        userId,
        observations
    );

    // Save new insights
    let insightsGenerated = 0;
    for (const insight of newInsights) {
        if (insight.category && insight.title && insight.description) {
            await createMemoryInsight(userId, {
                category: insight.category,
                title: insight.title,
                description: insight.description,
                confidence: insight.confidence || 0.5,
                sourceObservationIds: observations.slice(0, 5).map((o) => o.id),
                tier: insight.tier || 'patterns',
                contextSnippet: insight.contextSnippet || '',
            });
            insightsGenerated++;
        }
    }

    // Reinforce existing insights
    for (const insightId of reinforcedInsightIds) {
        await reinforceInsight(userId, insightId, observations[0].id);
    }

    // Check if we need to update summary (daily)
    const lastUpdate = await getLastMemoryUpdate(userId, 'recent');
    const shouldUpdateSummary =
        !lastUpdate ||
        Date.now() - lastUpdate.timestamp.toDate().getTime() > 24 * 60 * 60 * 1000;

    let summaryUpdated = false;
    if (shouldUpdateSummary) {
        // Generate summary for last 30 days
        const recentObs = observations.filter((o) => {
            const obsDate = o.timestamp.toDate();
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return obsDate >= thirtyDaysAgo;
        });

        if (recentObs.length >= 3) {
            await generatePeriodSummary(userId, recentObs, 'recent');
            summaryUpdated = true;
        }
    }

    // Log the update
    await logMemoryUpdate(userId, {
        tier: 'recent',
        observationsProcessed: observations.length,
        insightsGenerated,
        summaryUpdated,
    });

    return {
        insightsGenerated,
        insightsReinforced: reinforcedInsightIds.length,
        summaryUpdated,
    };
}

/**
 * Get memory context string for Oracle injection
 */
export async function getMemoryContextForOracle(userId: string): Promise<string> {
    return buildMemoryContextString(userId);
}

/**
 * Check if memory needs update
 */
export async function shouldUpdateMemory(userId: string): Promise<boolean> {
    const lastUpdate = await getLastMemoryUpdate(userId, 'recent');

    if (!lastUpdate) return true;

    // Update if more than 24 hours since last update
    const hoursSinceUpdate =
        (Date.now() - lastUpdate.timestamp.toDate().getTime()) / (1000 * 60 * 60);

    return hoursSinceUpdate >= 24;
}
