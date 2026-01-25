/**
 * PROGRESS ANALYTICS SERVICE
 *
 * Aggregates data from Skills, Observations, and Memory to provide
 * meaningful progress insights for parents, therapists, and schools.
 *
 * Features:
 * - Skill mastery trends over time
 * - Observation frequency and connection patterns
 * - Strength-based progress narratives
 * - Exportable progress summaries
 */

import { getSkills, getSkillProgress, getEntriesForDateRange } from '../../core/firebase/skills';
import { getObservations } from '../../core/firebase/firestore';
import { getMemoryInsights } from '../../core/firebase/memory';
import type {
    Skill,
    SkillEntry,
    Observation,
    MemoryInsight,
    ResonanceChannel,
} from '../../core/stores/types';

// Extended skill type with progress data
interface SkillWithProgress extends Skill {
    progress?: {
        totalEntries: number;
        totalSuccesses: number;
        totalAttempts: number;
        successRate: number;
        recentTrend: 'improving' | 'stable' | 'declining';
        lastEntry?: Date;
        streakDays: number;
        currentMastery: number;
    };
}

// =====================================================
// TYPES
// =====================================================

export interface ProgressPeriod {
    start: Date;
    end: Date;
    label: string; // "Last 7 days", "Last 30 days", etc.
}

export interface SkillProgressSummary {
    skillId: string;
    skillName: string;
    category: string;
    startLevel: number;
    currentLevel: number;
    levelChange: number;
    practiceCount: number;
    streak: number;
    trend: 'improving' | 'stable' | 'declining';
    highlights: string[];
}

export interface ObservationStats {
    totalCount: number;
    periodCount: number;
    averageReciprocity: number;
    reciprocityTrend: 'improving' | 'stable' | 'declining';
    channelDistribution: Record<ResonanceChannel, number>;
    dominantChannels: ResonanceChannel[];
    joyMoments: number;
    connectionBids: number;
}

export interface StrengthHighlight {
    strength: string;
    source: 'skill' | 'observation' | 'video' | 'memory';
    occurrences: number;
    confidence: number;
}

export interface ProgressReport {
    childName: string;
    period: ProgressPeriod;
    generatedAt: Date;

    // Skill Progress
    skillSummaries: SkillProgressSummary[];
    topImprovingSkills: SkillProgressSummary[];
    skillsNeedingSupport: SkillProgressSummary[];

    // Observation Insights
    observationStats: ObservationStats;

    // Strengths & Patterns
    strengthHighlights: StrengthHighlight[];
    memoryInsights: MemoryInsight[];

    // Narrative Summary
    narrativeSummary: string;
    recommendationsForTherapist: string[];
    recommendationsForSchool: string[];
    celebrationPoints: string[];
}

// =====================================================
// PROGRESS CALCULATION
// =====================================================

/**
 * Calculate skill progress summary for a given period
 */
export async function calculateSkillProgress(
    userId: string,
    period: ProgressPeriod
): Promise<SkillProgressSummary[]> {
    // Get all skills
    const skills = await getSkills(userId);
    const entries = await getEntriesForDateRange(userId, period.start, period.end);

    // Fetch progress for each skill
    const skillsWithProgress: SkillWithProgress[] = await Promise.all(
        skills.map(async (skill) => {
            const progress = await getSkillProgress(userId, skill.id);
            return {
                ...skill,
                progress: {
                    ...progress,
                    currentMastery: masteryToNumber(skill.currentMastery),
                },
            };
        })
    );

    // Group entries by skill
    const entriesBySkill: Record<string, SkillEntry[]> = {};
    entries.forEach((entry) => {
        if (!entriesBySkill[entry.skillId]) {
            entriesBySkill[entry.skillId] = [];
        }
        entriesBySkill[entry.skillId].push(entry);
    });

    const summaries: SkillProgressSummary[] = [];

    for (const skill of skillsWithProgress) {
        const skillEntries = entriesBySkill[skill.id] || [];
        const progress = skill.progress;

        if (skillEntries.length === 0 && !progress) continue;

        // Calculate level change based on success rate
        const sortedEntries = [...skillEntries].sort(
            (a, b) => a.date.toDate().getTime() - b.date.toDate().getTime()
        );

        // Calculate success rate for first entries vs last entries
        const firstEntries = sortedEntries.slice(0, Math.ceil(sortedEntries.length / 2));
        const lastEntries = sortedEntries.slice(Math.ceil(sortedEntries.length / 2));

        const firstSuccessRate = firstEntries.length > 0
            ? firstEntries.reduce((s, e) => s + e.successCount, 0) /
              Math.max(firstEntries.reduce((s, e) => s + e.attemptCount, 0), 1)
            : 0;
        const lastSuccessRate = lastEntries.length > 0
            ? lastEntries.reduce((s, e) => s + e.successCount, 0) /
              Math.max(lastEntries.reduce((s, e) => s + e.attemptCount, 0), 1)
            : firstSuccessRate;

        const currentLevel = progress?.currentMastery || (lastSuccessRate * 5);
        const startLevel = firstSuccessRate * 5;
        const levelChange = currentLevel - startLevel;

        // Determine trend from progress or calculate
        let trend: 'improving' | 'stable' | 'declining' = progress?.recentTrend || 'stable';
        if (levelChange > 0.5) trend = 'improving';
        else if (levelChange < -0.5) trend = 'declining';

        // Extract highlights from notes
        const highlights: string[] = [];
        skillEntries.forEach((entry) => {
            if (entry.notes && entry.notes.length > 10) {
                const successRate = entry.attemptCount > 0 ? entry.successCount / entry.attemptCount : 0;
                if (successRate >= 0.8 || entry.notes.toLowerCase().includes('success')) {
                    highlights.push(entry.notes.slice(0, 100));
                }
            }
        });

        summaries.push({
            skillId: skill.id,
            skillName: skill.name,
            category: skill.category,
            startLevel,
            currentLevel,
            levelChange,
            practiceCount: skillEntries.length,
            streak: progress?.streakDays || 0,
            trend,
            highlights: highlights.slice(0, 3),
        });
    }

    return summaries;
}

/**
 * Calculate observation statistics for a period
 */
export async function calculateObservationStats(
    userId: string,
    period: ProgressPeriod
): Promise<ObservationStats> {
    const allObservations = await getObservations(userId, 200);

    // Filter to period
    const periodObservations = allObservations.filter((obs) => {
        const obsDate = obs.timestamp?.toDate?.();
        return obsDate && obsDate >= period.start && obsDate <= period.end;
    });

    // Calculate average reciprocity
    const totalReciprocity = periodObservations.reduce(
        (sum, obs) => sum + (obs.relationalReciprocity || 3),
        0
    );
    const averageReciprocity = periodObservations.length > 0
        ? totalReciprocity / periodObservations.length
        : 3;

    // Channel distribution
    const channelCounts: Record<string, number> = {};
    periodObservations.forEach((obs) => {
        obs.channels?.forEach((channel) => {
            channelCounts[channel] = (channelCounts[channel] || 0) + 1;
        });
    });

    // Find dominant channels
    const sortedChannels = Object.entries(channelCounts)
        .sort(([, a], [, b]) => b - a);
    const dominantChannels = sortedChannels
        .slice(0, 3)
        .map(([channel]) => channel as ResonanceChannel);

    // Count joy and connection moments
    const joyMoments = periodObservations.filter(
        (obs) => obs.channels?.includes('Joy Expression')
    ).length;
    const connectionBids = periodObservations.filter(
        (obs) => obs.channels?.includes('Connection Bid')
    ).length;

    // Calculate trend (compare first half to second half of period)
    const midPoint = new Date(
        (period.start.getTime() + period.end.getTime()) / 2
    );
    const firstHalf = periodObservations.filter(
        (obs) => obs.timestamp?.toDate?.() < midPoint
    );
    const secondHalf = periodObservations.filter(
        (obs) => obs.timestamp?.toDate?.() >= midPoint
    );

    const firstHalfAvg = firstHalf.length > 0
        ? firstHalf.reduce((s, o) => s + o.relationalReciprocity, 0) / firstHalf.length
        : 3;
    const secondHalfAvg = secondHalf.length > 0
        ? secondHalf.reduce((s, o) => s + o.relationalReciprocity, 0) / secondHalf.length
        : 3;

    let reciprocityTrend: 'improving' | 'stable' | 'declining' = 'stable';
    if (secondHalfAvg - firstHalfAvg > 0.3) reciprocityTrend = 'improving';
    else if (secondHalfAvg - firstHalfAvg < -0.3) reciprocityTrend = 'declining';

    return {
        totalCount: allObservations.length,
        periodCount: periodObservations.length,
        averageReciprocity,
        reciprocityTrend,
        channelDistribution: channelCounts as Record<ResonanceChannel, number>,
        dominantChannels,
        joyMoments,
        connectionBids,
    };
}

/**
 * Extract strength highlights from all data sources
 */
export async function extractStrengthHighlights(
    _userId: string,
    observations: Observation[],
    memoryInsights: MemoryInsight[]
): Promise<StrengthHighlight[]> {
    const highlights: StrengthHighlight[] = [];
    const strengthCounts: Record<string, { count: number; source: string; confidence: number }> = {};

    // From memory insights
    memoryInsights
        .filter((i) => i.category === 'strength')
        .forEach((insight) => {
            const key = insight.title.toLowerCase();
            if (!strengthCounts[key]) {
                strengthCounts[key] = { count: 0, source: 'memory', confidence: insight.confidence };
            }
            // Use sourceObservationIds length as a proxy for reinforcement count
            strengthCounts[key].count += insight.sourceObservationIds?.length || 1;
        });

    // From video analyses
    observations.forEach((obs) => {
        obs.media?.forEach((media) => {
            if (media.type === 'video' && media.analysis?.strengthsObserved) {
                media.analysis.strengthsObserved.forEach((strength) => {
                    const key = strength.toLowerCase().slice(0, 50);
                    if (!strengthCounts[key]) {
                        strengthCounts[key] = { count: 0, source: 'video', confidence: 0.7 };
                    }
                    strengthCounts[key].count++;
                });
            }
        });
    });

    // From observation channels
    const joyObs = observations.filter((o) => o.channels?.includes('Joy Expression'));
    if (joyObs.length >= 3) {
        strengthCounts['expresses joy and delight'] = {
            count: joyObs.length,
            source: 'observation',
            confidence: 0.8,
        };
    }

    const connectionObs = observations.filter((o) => o.channels?.includes('Connection Bid'));
    if (connectionObs.length >= 3) {
        strengthCounts['actively seeks connection'] = {
            count: connectionObs.length,
            source: 'observation',
            confidence: 0.8,
        };
    }

    // Convert to array and sort
    for (const [strength, data] of Object.entries(strengthCounts)) {
        highlights.push({
            strength,
            source: data.source as 'skill' | 'observation' | 'video' | 'memory',
            occurrences: data.count,
            confidence: data.confidence,
        });
    }

    return highlights
        .sort((a, b) => b.occurrences - a.occurrences)
        .slice(0, 10);
}

// =====================================================
// NARRATIVE GENERATION
// =====================================================

/**
 * Generate a narrative summary for the progress report
 */
function generateNarrativeSummary(
    childName: string,
    period: ProgressPeriod,
    skillSummaries: SkillProgressSummary[],
    observationStats: ObservationStats,
    strengthHighlights: StrengthHighlight[]
): string {
    const improving = skillSummaries.filter((s) => s.trend === 'improving');
    const practiced = skillSummaries.filter((s) => s.practiceCount > 0);

    let narrative = `During ${period.label}, `;

    // Observations context
    if (observationStats.periodCount > 0) {
        narrative += `${observationStats.periodCount} moments were witnessed with ${childName}. `;
        if (observationStats.reciprocityTrend === 'improving') {
            narrative += 'Connection has been strengthening over this period. ';
        } else if (observationStats.averageReciprocity >= 4) {
            narrative += 'Connection has remained strong throughout. ';
        }
    }

    // Skills progress
    if (improving.length > 0) {
        narrative += `${childName} showed improvement in ${improving.length} skill${improving.length > 1 ? 's' : ''}, `;
        narrative += `including ${improving.slice(0, 2).map((s) => s.skillName.toLowerCase()).join(' and ')}. `;
    }

    if (practiced.length > 0) {
        narrative += `Active practice occurred in ${practiced.length} skill areas. `;
    }

    // Strengths
    if (strengthHighlights.length > 0) {
        narrative += `Key strengths observed include ${strengthHighlights.slice(0, 2).map((s) => s.strength).join(' and ')}. `;
    }

    // Joy moments
    if (observationStats.joyMoments > 0) {
        narrative += `${observationStats.joyMoments} moments of joy were captured during this period.`;
    }

    return narrative;
}

/**
 * Generate recommendations for therapists
 */
function generateTherapistRecommendations(
    skillSummaries: SkillProgressSummary[],
    observationStats: ObservationStats,
    memoryInsights: MemoryInsight[]
): string[] {
    const recommendations: string[] = [];

    // Skills needing support
    const declining = skillSummaries.filter((s) => s.trend === 'declining');
    if (declining.length > 0) {
        recommendations.push(
            `Consider additional support for: ${declining.map((s) => s.skillName).join(', ')}`
        );
    }

    // High-progress skills to build on
    const improving = skillSummaries.filter((s) => s.levelChange >= 1);
    if (improving.length > 0) {
        recommendations.push(
            `Continue building on success in: ${improving.map((s) => s.skillName).join(', ')}`
        );
    }

    // Communication channels
    if (observationStats.dominantChannels.length > 0) {
        recommendations.push(
            `Primary communication channels: ${observationStats.dominantChannels.join(', ')}`
        );
    }

    // Triggers from memory
    const triggers = memoryInsights.filter((i) => i.category === 'trigger');
    if (triggers.length > 0) {
        recommendations.push(
            `Known triggers to monitor: ${triggers.slice(0, 3).map((t) => t.title.replace('trigger as a ', '')).join(', ')}`
        );
    }

    // Calming strategies
    const calming = memoryInsights.filter((i) => i.category === 'calming');
    if (calming.length > 0) {
        recommendations.push(
            `Effective calming strategies: ${calming.slice(0, 2).map((c) => c.contextSnippet || c.title).join(', ')}`
        );
    }

    return recommendations;
}

/**
 * Generate recommendations for school
 */
function generateSchoolRecommendations(
    skillSummaries: SkillProgressSummary[],
    observationStats: ObservationStats,
    memoryInsights: MemoryInsight[]
): string[] {
    const recommendations: string[] = [];

    // Communication style
    if (observationStats.dominantChannels.length > 0) {
        recommendations.push(
            `Communicates primarily through: ${observationStats.dominantChannels.join(', ')}`
        );
    }

    // Sensory needs
    const sensory = memoryInsights.filter((i) => i.category === 'sensory');
    if (sensory.length > 0) {
        recommendations.push(
            `Sensory considerations: ${sensory.slice(0, 2).map((s) => s.contextSnippet || s.title).join('; ')}`
        );
    }

    // Academic-related skills
    const academicSkills = skillSummaries.filter((s) => s.category === 'Academic');
    if (academicSkills.length > 0) {
        const improving = academicSkills.filter((s) => s.trend === 'improving');
        if (improving.length > 0) {
            recommendations.push(
                `Academic growth areas: ${improving.map((s) => s.skillName).join(', ')}`
            );
        }
    }

    // Social skills
    const socialSkills = skillSummaries.filter((s) => s.category === 'Social');
    if (socialSkills.length > 0) {
        recommendations.push(
            `Social skill focus: ${socialSkills.slice(0, 2).map((s) => s.skillName).join(', ')}`
        );
    }

    // Transition support
    const transitions = memoryInsights.filter(
        (i) => i.title.toLowerCase().includes('transition')
    );
    if (transitions.length > 0) {
        recommendations.push('May benefit from additional transition support between activities');
    }

    return recommendations;
}

/**
 * Generate celebration points
 */
function generateCelebrationPoints(
    skillSummaries: SkillProgressSummary[],
    observationStats: ObservationStats,
    strengthHighlights: StrengthHighlight[]
): string[] {
    const celebrations: string[] = [];

    // Skill milestones
    const mastered = skillSummaries.filter((s) => s.currentLevel >= 4.5);
    if (mastered.length > 0) {
        celebrations.push(
            `Mastered ${mastered.length} skill${mastered.length > 1 ? 's' : ''}: ${mastered.map((s) => s.skillName).join(', ')}`
        );
    }

    // Improvement
    const bigImprovement = skillSummaries.filter((s) => s.levelChange >= 1);
    if (bigImprovement.length > 0) {
        celebrations.push(
            `Significant progress in: ${bigImprovement.map((s) => s.skillName).join(', ')}`
        );
    }

    // Streaks
    const streaks = skillSummaries.filter((s) => s.streak >= 7);
    if (streaks.length > 0) {
        celebrations.push(
            `Maintained practice streaks in: ${streaks.map((s) => s.skillName).join(', ')}`
        );
    }

    // Joy moments
    if (observationStats.joyMoments >= 5) {
        celebrations.push(`${observationStats.joyMoments} moments of joy captured!`);
    }

    // Connection
    if (observationStats.averageReciprocity >= 4) {
        celebrations.push('Strong parent-child connection throughout the period');
    }

    // Strengths
    strengthHighlights.slice(0, 2).forEach((s) => {
        celebrations.push(`Consistently shows: ${s.strength}`);
    });

    return celebrations.slice(0, 6);
}

// =====================================================
// REPORT GENERATION
// =====================================================

/**
 * Generate a complete progress report
 */
export async function generateProgressReport(
    userId: string,
    childName: string,
    period: ProgressPeriod
): Promise<ProgressReport> {
    // Gather all data
    const skillSummaries = await calculateSkillProgress(userId, period);
    const observationStats = await calculateObservationStats(userId, period);
    const memoryInsights = await getMemoryInsights(userId);
    const observations = await getObservations(userId, 100);

    // Filter observations to period
    const periodObservations = observations.filter((obs) => {
        const obsDate = obs.timestamp?.toDate?.();
        return obsDate && obsDate >= period.start && obsDate <= period.end;
    });

    const strengthHighlights = await extractStrengthHighlights(
        userId,
        periodObservations,
        memoryInsights
    );

    // Sort skills by improvement
    const topImproving = [...skillSummaries]
        .filter((s) => s.trend === 'improving')
        .sort((a, b) => b.levelChange - a.levelChange)
        .slice(0, 5);

    const needingSupport = [...skillSummaries]
        .filter((s) => s.trend === 'declining' || s.currentLevel < 2)
        .slice(0, 5);

    // Generate narratives
    const narrativeSummary = generateNarrativeSummary(
        childName,
        period,
        skillSummaries,
        observationStats,
        strengthHighlights
    );

    const recommendationsForTherapist = generateTherapistRecommendations(
        skillSummaries,
        observationStats,
        memoryInsights
    );

    const recommendationsForSchool = generateSchoolRecommendations(
        skillSummaries,
        observationStats,
        memoryInsights
    );

    const celebrationPoints = generateCelebrationPoints(
        skillSummaries,
        observationStats,
        strengthHighlights
    );

    return {
        childName,
        period,
        generatedAt: new Date(),
        skillSummaries,
        topImprovingSkills: topImproving,
        skillsNeedingSupport: needingSupport,
        observationStats,
        strengthHighlights,
        memoryInsights: memoryInsights.slice(0, 10),
        narrativeSummary,
        recommendationsForTherapist,
        recommendationsForSchool,
        celebrationPoints,
    };
}

// =====================================================
// PERIOD HELPERS
// =====================================================

/**
 * Create common period definitions
 */
export function createPeriod(type: 'week' | 'month' | 'quarter' | 'year'): ProgressPeriod {
    const end = new Date();
    const start = new Date();

    switch (type) {
        case 'week':
            start.setDate(start.getDate() - 7);
            return { start, end, label: 'the last 7 days' };
        case 'month':
            start.setMonth(start.getMonth() - 1);
            return { start, end, label: 'the last 30 days' };
        case 'quarter':
            start.setMonth(start.getMonth() - 3);
            return { start, end, label: 'the last 3 months' };
        case 'year':
            start.setFullYear(start.getFullYear() - 1);
            return { start, end, label: 'the last year' };
    }
}

/**
 * Create a custom date range period
 */
export function createCustomPeriod(start: Date, end: Date): ProgressPeriod {
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return {
        start,
        end,
        label: `${days} days (${start.toLocaleDateString()} - ${end.toLocaleDateString()})`,
    };
}

// =====================================================
// HELPERS
// =====================================================

/**
 * Convert mastery level to numeric value (1-5 scale)
 */
function masteryToNumber(mastery: string): number {
    const mapping: Record<string, number> = {
        'Not Started': 0,
        'Emerging': 1,
        'Developing': 2,
        'Practicing': 3,
        'Achieved': 4,
        'Mastered': 5,
    };
    return mapping[mastery] || 0;
}
