/**
 * LONGITUDINAL MEMORY FIRESTORE OPERATIONS
 *
 * Persistence layer for the child's memory system.
 * Stores insights, summaries, and memory context.
 *
 * Firestore Structure:
 * /users/{userId}/memoryInsights/{insightId}
 * /users/{userId}/memorySummaries/{summaryId}
 * /users/{userId}/memoryEvents/{eventId}
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
    limit,
    serverTimestamp,
    Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import type {
    MemoryInsight,
    ChildMemorySummary,
    MemoryUpdateEvent,
    MemoryTier,
    InsightCategory,
} from '../stores/types';

// Collection references
const getInsightsRef = (userId: string) =>
    collection(db, 'users', userId, 'memoryInsights');
const getSummariesRef = (userId: string) =>
    collection(db, 'users', userId, 'memorySummaries');
const getEventsRef = (userId: string) =>
    collection(db, 'users', userId, 'memoryEvents');

// =====================================================
// MEMORY INSIGHTS CRUD
// =====================================================

/**
 * Create a new memory insight
 */
export async function createMemoryInsight(
    userId: string,
    data: {
        category: InsightCategory;
        title: string;
        description: string;
        confidence: number;
        sourceObservationIds: string[];
        tier: MemoryTier;
        contextSnippet: string;
    }
): Promise<string> {
    const insightsRef = getInsightsRef(userId);

    const insight = {
        userId,
        ...data,
        isActive: true,
        firstObserved: serverTimestamp(),
        lastConfirmed: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(insightsRef, insight);
    return docRef.id;
}

/**
 * Get all active memory insights for a user
 */
export async function getMemoryInsights(
    userId: string,
    tier?: MemoryTier
): Promise<MemoryInsight[]> {
    const insightsRef = getInsightsRef(userId);

    let q;
    if (tier) {
        q = query(
            insightsRef,
            where('isActive', '==', true),
            where('tier', '==', tier),
            orderBy('confidence', 'desc')
        );
    } else {
        q = query(
            insightsRef,
            where('isActive', '==', true),
            orderBy('confidence', 'desc')
        );
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as MemoryInsight[];
}

/**
 * Get insights by category
 */
export async function getInsightsByCategory(
    userId: string,
    category: InsightCategory
): Promise<MemoryInsight[]> {
    const insightsRef = getInsightsRef(userId);
    const q = query(
        insightsRef,
        where('category', '==', category),
        where('isActive', '==', true),
        orderBy('confidence', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as MemoryInsight[];
}

/**
 * Get top insights for quick context (for Oracle injection)
 */
export async function getTopInsights(
    userId: string,
    limitCount: number = 10
): Promise<MemoryInsight[]> {
    const insightsRef = getInsightsRef(userId);
    const q = query(
        insightsRef,
        where('isActive', '==', true),
        orderBy('confidence', 'desc'),
        limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as MemoryInsight[];
}

/**
 * Update an insight (reinforce or modify)
 */
export async function updateMemoryInsight(
    userId: string,
    insightId: string,
    updates: Partial<{
        description: string;
        confidence: number;
        sourceObservationIds: string[];
        tier: MemoryTier;
        contextSnippet: string;
        isActive: boolean;
    }>
): Promise<void> {
    const insightsRef = getInsightsRef(userId);
    const docRef = doc(insightsRef, insightId);

    await updateDoc(docRef, {
        ...updates,
        lastConfirmed: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
}

/**
 * Reinforce an insight (add new observation as evidence)
 */
export async function reinforceInsight(
    userId: string,
    insightId: string,
    observationId: string
): Promise<void> {
    const insightsRef = getInsightsRef(userId);
    const docRef = doc(insightsRef, insightId);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) return;

    const data = snapshot.data() as MemoryInsight;
    const existingIds = data.sourceObservationIds || [];

    if (!existingIds.includes(observationId)) {
        // Add observation and boost confidence
        const newConfidence = Math.min(1, data.confidence + 0.05);

        await updateDoc(docRef, {
            sourceObservationIds: [...existingIds, observationId],
            confidence: newConfidence,
            lastConfirmed: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
    }
}

/**
 * Archive an insight (soft delete)
 */
export async function archiveInsight(
    userId: string,
    insightId: string
): Promise<void> {
    await updateMemoryInsight(userId, insightId, { isActive: false });
}

// =====================================================
// MEMORY SUMMARIES CRUD
// =====================================================

/**
 * Create or update a memory summary
 */
export async function saveMemorySummary(
    userId: string,
    data: {
        periodStart: Date;
        periodEnd: Date;
        tier: MemoryTier;
        narrativeSummary: string;
        keyInsights: string[];
        commonTriggers: string[];
        effectiveStrategies: string[];
        communicationPatterns: string[];
        strengthsObserved: string[];
        observationCount: number;
        averageReciprocity: number;
        dominantChannels: string[];
        progressNotes?: string;
        concernAreas?: string;
    }
): Promise<string> {
    const summariesRef = getSummariesRef(userId);

    const summary = {
        userId,
        ...data,
        periodStart: Timestamp.fromDate(data.periodStart),
        periodEnd: Timestamp.fromDate(data.periodEnd),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(summariesRef, summary);
    return docRef.id;
}

/**
 * Get the latest summary for a tier
 */
export async function getLatestSummary(
    userId: string,
    tier: MemoryTier
): Promise<ChildMemorySummary | null> {
    const summariesRef = getSummariesRef(userId);
    const q = query(
        summariesRef,
        where('tier', '==', tier),
        orderBy('periodEnd', 'desc'),
        limit(1)
    );

    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return {
        id: doc.id,
        ...doc.data(),
    } as ChildMemorySummary;
}

/**
 * Get all summaries for a tier
 */
export async function getSummaries(
    userId: string,
    tier?: MemoryTier
): Promise<ChildMemorySummary[]> {
    const summariesRef = getSummariesRef(userId);

    let q;
    if (tier) {
        q = query(
            summariesRef,
            where('tier', '==', tier),
            orderBy('periodEnd', 'desc')
        );
    } else {
        q = query(summariesRef, orderBy('periodEnd', 'desc'));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as ChildMemorySummary[];
}

// =====================================================
// MEMORY UPDATE EVENTS
// =====================================================

/**
 * Log a memory update event
 */
export async function logMemoryUpdate(
    userId: string,
    data: {
        tier: MemoryTier;
        observationsProcessed: number;
        insightsGenerated: number;
        summaryUpdated: boolean;
    }
): Promise<string> {
    const eventsRef = getEventsRef(userId);

    const event = {
        userId,
        timestamp: serverTimestamp(),
        ...data,
    };

    const docRef = await addDoc(eventsRef, event);
    return docRef.id;
}

/**
 * Get last memory update for a tier
 */
export async function getLastMemoryUpdate(
    userId: string,
    tier: MemoryTier
): Promise<MemoryUpdateEvent | null> {
    const eventsRef = getEventsRef(userId);
    const q = query(
        eventsRef,
        where('tier', '==', tier),
        orderBy('timestamp', 'desc'),
        limit(1)
    );

    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return {
        id: doc.id,
        ...doc.data(),
    } as MemoryUpdateEvent;
}

// =====================================================
// MEMORY CONTEXT BUILDER
// =====================================================

/**
 * Build compact memory context for Oracle injection
 * Returns a string suitable for including in prompts
 */
export async function buildMemoryContextString(
    userId: string
): Promise<string> {
    // Get latest summary and top insights
    const [recentSummary, topInsights] = await Promise.all([
        getLatestSummary(userId, 'recent'),
        getTopInsights(userId, 8),
    ]);

    if (!recentSummary && topInsights.length === 0) {
        return ''; // No memory yet
    }

    let context = '\n## CHILD MEMORY CONTEXT\n\n';

    // Add summary if available
    if (recentSummary) {
        context += `### Recent Overview (Last 30 Days)\n`;
        context += `${recentSummary.narrativeSummary}\n\n`;

        if (recentSummary.strengthsObserved.length > 0) {
            context += `**Strengths:** ${recentSummary.strengthsObserved.join(', ')}\n`;
        }

        if (recentSummary.effectiveStrategies.length > 0) {
            context += `**What Works:** ${recentSummary.effectiveStrategies.join(', ')}\n`;
        }

        if (recentSummary.commonTriggers.length > 0) {
            context += `**Known Triggers:** ${recentSummary.commonTriggers.join(', ')}\n`;
        }

        context += '\n';
    }

    // Add key insights
    if (topInsights.length > 0) {
        context += `### Learned Patterns\n`;

        // Group by category
        const byCategory = topInsights.reduce(
            (acc, insight) => {
                if (!acc[insight.category]) acc[insight.category] = [];
                acc[insight.category].push(insight.contextSnippet);
                return acc;
            },
            {} as Record<string, string[]>
        );

        for (const [category, snippets] of Object.entries(byCategory)) {
            context += `- **${category}**: ${snippets.join('; ')}\n`;
        }
    }

    return context;
}

/**
 * Get memory context object for structured use
 */
export async function getMemoryContextObject(
    userId: string
): Promise<{
    hasMemory: boolean;
    summary?: string;
    strengths: string[];
    strategies: string[];
    triggers: string[];
    insights: { category: string; snippet: string }[];
}> {
    const [recentSummary, topInsights] = await Promise.all([
        getLatestSummary(userId, 'recent'),
        getTopInsights(userId, 8),
    ]);

    const result = {
        hasMemory: !!(recentSummary || topInsights.length > 0),
        summary: recentSummary?.narrativeSummary,
        strengths: recentSummary?.strengthsObserved || [],
        strategies: recentSummary?.effectiveStrategies || [],
        triggers: recentSummary?.commonTriggers || [],
        insights: topInsights.map((i) => ({
            category: i.category,
            snippet: i.contextSnippet,
        })),
    };

    return result;
}
