/**
 * TIMELINE STORE
 * 
 * Zustand store for efficient temporal data management.
 * 
 * Features:
 * - Caches observations to avoid redundant Firestore reads
 * - Maintains ChildUnderstanding in memory
 * - Provides reactive access to patterns and insights
 * - Handles background updates to memory system
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Observation } from './types';
import { 
    buildTimelineSlice, 
    buildChildUnderstanding,
    generateAIContext,
    type TimelineSlice,
    type ChildUnderstanding,
    type PatternMemory,
    type GrowthMilestone,
} from '../../lib/ai/longitudinalMemory';

// ============================================================================
// STATE TYPES
// ============================================================================

interface TimelineState {
    // Core data
    observations: Observation[];
    understanding: ChildUnderstanding | null;
    
    // Caching
    lastFetchedAt: Date | null;
    isStale: boolean;
    
    // Loading states
    isLoading: boolean;
    isUpdatingMemory: boolean;
    error: string | null;
    
    // Computed views (cached)
    recentSlice: TimelineSlice | null;      // Last 30 days
    weeklySlice: TimelineSlice | null;       // Last 7 days
    
    // Actions
    setObservations: (observations: Observation[]) => void;
    addObservation: (observation: Observation) => void;
    updateMemory: (userId: string, childName: string) => Promise<void>;
    refreshSlices: () => void;
    markAsStale: () => void;
    
    // Selectors (these are functions for efficiency)
    getAIContext: () => string;
    getTopPatterns: (limit?: number) => PatternMemory[];
    getRecentMilestones: (limit?: number) => GrowthMilestone[];
    getInsightsSummary: () => InsightsSummary;
}

interface InsightsSummary {
    totalObservations: number;
    averageReciprocity: number;
    trend: 'rising' | 'stable' | 'declining';
    topChannel: string | null;
    topStrategy: string | null;
    patternCount: number;
    milestoneCount: number;
}

// ============================================================================
// STORE
// ============================================================================

export const useTimelineStore = create<TimelineState>()(
    persist(
        (set, get) => ({
            // Initial state
            observations: [],
            understanding: null,
            lastFetchedAt: null,
            isStale: true,
            isLoading: false,
            isUpdatingMemory: false,
            error: null,
            recentSlice: null,
            weeklySlice: null,
            
            // Actions
            setObservations: (observations: Observation[]) => {
                set({ 
                    observations, 
                    lastFetchedAt: new Date(),
                    isStale: false,
                });
                get().refreshSlices();
            },
            
            addObservation: (observation: Observation) => {
                const current = get().observations;
                set({ 
                    observations: [observation, ...current],
                    isStale: true, // Memory needs update
                });
                get().refreshSlices();
            },
            
            updateMemory: async (userId: string, childName: string) => {
                const { observations, understanding } = get();
                
                if (observations.length === 0) {
                    return;
                }
                
                set({ isUpdatingMemory: true, error: null });
                
                try {
                    const newUnderstanding = buildChildUnderstanding(
                        userId,
                        childName,
                        observations,
                        understanding || undefined
                    );
                    
                    set({ 
                        understanding: newUnderstanding,
                        isUpdatingMemory: false,
                        isStale: false,
                    });
                } catch (error) {
                    set({ 
                        error: error instanceof Error ? error.message : 'Failed to update memory',
                        isUpdatingMemory: false,
                    });
                }
            },
            
            refreshSlices: () => {
                const { observations } = get();
                
                if (observations.length === 0) {
                    set({ recentSlice: null, weeklySlice: null });
                    return;
                }
                
                const now = new Date();
                const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                
                const recentSlice = buildTimelineSlice(observations, {
                    startDate: thirtyDaysAgo,
                    maxObservations: 50,
                });
                
                const weeklySlice = buildTimelineSlice(observations, {
                    startDate: sevenDaysAgo,
                    maxObservations: 20,
                });
                
                set({ recentSlice, weeklySlice });
            },
            
            markAsStale: () => {
                set({ isStale: true });
            },
            
            // Selectors
            getAIContext: () => {
                const { understanding } = get();
                if (!understanding) return '';
                return generateAIContext(understanding);
            },
            
            getTopPatterns: (limit = 5) => {
                const { understanding } = get();
                if (!understanding) return [];
                return understanding.patterns
                    .filter(p => p.confidence > 0.4)
                    .slice(0, limit);
            },
            
            getRecentMilestones: (limit = 3) => {
                const { understanding } = get();
                if (!understanding) return [];
                return understanding.milestones
                    .sort((a, b) => b.date.getTime() - a.date.getTime())
                    .slice(0, limit);
            },
            
            getInsightsSummary: () => {
                const { understanding, observations } = get();
                
                const defaultSummary: InsightsSummary = {
                    totalObservations: observations.length,
                    averageReciprocity: 3,
                    trend: 'stable',
                    topChannel: null,
                    topStrategy: null,
                    patternCount: 0,
                    milestoneCount: 0,
                };
                
                if (!understanding) return defaultSummary;
                
                const topChannel = understanding.currentInsights.dominantChannels[0]?.channel || null;
                const topStrategy = understanding.currentInsights.effectiveStrategies[0]?.strategy || null;
                
                return {
                    totalObservations: understanding.totalObservations,
                    averageReciprocity: understanding.metrics.averageReciprocity,
                    trend: understanding.metrics.overallReciprocityTrend,
                    topChannel,
                    topStrategy,
                    patternCount: understanding.patterns.length,
                    milestoneCount: understanding.milestones.length,
                };
            },
        }),
        {
            name: 'giovanna-timeline',
            // Only persist certain fields
            partialize: (state) => ({
                understanding: state.understanding,
                lastFetchedAt: state.lastFetchedAt,
            }),
        }
    )
);

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Hook to get AI context for Oracle queries
 */
export function useAIContext(): string {
    return useTimelineStore(state => state.getAIContext());
}

/**
 * Hook to get top patterns
 */
export function useTopPatterns(limit = 5): PatternMemory[] {
    return useTimelineStore(state => state.getTopPatterns(limit));
}

/**
 * Hook to get insights summary
 */
export function useInsightsSummary(): InsightsSummary {
    return useTimelineStore(state => state.getInsightsSummary());
}

/**
 * Hook to check if memory needs update
 */
export function useMemoryStatus(): {
    isStale: boolean;
    isUpdating: boolean;
    lastUpdated: Date | null;
} {
    return useTimelineStore(state => ({
        isStale: state.isStale,
        isUpdating: state.isUpdatingMemory,
        lastUpdated: state.understanding?.lastUpdated || null,
    }));
}

export default useTimelineStore;
