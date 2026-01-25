/**
 * MEMORY INSIGHTS: The Child's Learning
 *
 * Displays the longitudinal memory of the child:
 * - Learned patterns and insights
 * - Effective strategies
 * - Known triggers
 * - Strengths and growth
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain,
    Sparkles,
    Heart,
    AlertTriangle,
    TrendingUp,
    Zap,
    Shield,
    X,
    Loader2,
    RefreshCw,
    ChevronRight,
    Lightbulb,
} from 'lucide-react';
import { useAuthStore } from '../../core/stores/useAuthStore';
import { getMemoryInsights, getLatestSummary } from '../../core/firebase/memory';
import { updateMemory } from '../../lib/ai/memoryService';
import type { MemoryInsight, ChildMemorySummary, InsightCategory } from '../../core/stores/types';

interface MemoryInsightsProps {
    onNavigate?: (view: string) => void;
    compact?: boolean; // For dashboard widget mode
}

// Category styling
const CATEGORY_STYLES: Record<InsightCategory, { icon: typeof Brain; color: string; bg: string }> = {
    trigger: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
    calming: { icon: Shield, color: 'text-green-600', bg: 'bg-green-50' },
    sensory: { icon: Zap, color: 'text-purple-600', bg: 'bg-purple-50' },
    communication: { icon: Heart, color: 'text-pink-600', bg: 'bg-pink-50' },
    strength: { icon: Sparkles, color: 'text-amber-600', bg: 'bg-amber-50' },
    growth: { icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
    connection: { icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50' },
    environment: { icon: Lightbulb, color: 'text-teal-600', bg: 'bg-teal-50' },
};

export const MemoryInsights = ({ onNavigate: _onNavigate, compact = false }: MemoryInsightsProps) => {
    const { user } = useAuthStore();
    const [insights, setInsights] = useState<MemoryInsight[]>([]);
    const [summary, setSummary] = useState<ChildMemorySummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<InsightCategory | null>(null);
    const [selectedInsight, setSelectedInsight] = useState<MemoryInsight | null>(null);

    useEffect(() => {
        if (user) {
            loadData();
        }
    }, [user]);

    const loadData = async () => {
        if (!user) return;

        try {
            const [insightsData, summaryData] = await Promise.all([
                getMemoryInsights(user.uid),
                getLatestSummary(user.uid, 'recent'),
            ]);

            setInsights(insightsData);
            setSummary(summaryData);
        } catch (error) {
            console.error('Error loading memory insights:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = async () => {
        if (!user || isUpdating) return;

        setIsUpdating(true);
        try {
            await updateMemory(user.uid);
            await loadData();
        } catch (error) {
            console.error('Error updating memory:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    // Group insights by category
    const insightsByCategory = insights.reduce(
        (acc, insight) => {
            if (!acc[insight.category]) acc[insight.category] = [];
            acc[insight.category].push(insight);
            return acc;
        },
        {} as Record<InsightCategory, MemoryInsight[]>
    );

    const categories = Object.keys(insightsByCategory) as InsightCategory[];

    // Compact mode for dashboard widget
    if (compact) {
        return (
            <div className="glass-panel p-4 rounded-[20px]">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Brain className="w-5 h-5 text-[#4B0082]" />
                        <h3 className="font-semibold text-sm">Memory</h3>
                    </div>
                    <span className="text-xs text-[#1A1A1A]/50">
                        {insights.length} insights
                    </span>
                </div>

                {insights.length === 0 ? (
                    <p className="text-xs text-[#1A1A1A]/50">
                        Learning patterns from observations...
                    </p>
                ) : (
                    <div className="space-y-2">
                        {insights.slice(0, 3).map((insight) => {
                            const style = CATEGORY_STYLES[insight.category];
                            const Icon = style.icon;
                            return (
                                <div
                                    key={insight.id}
                                    className="flex items-center gap-2 text-xs"
                                >
                                    <Icon className={`w-3 h-3 ${style.color}`} />
                                    <span className="text-[#1A1A1A]/70 truncate">
                                        {insight.contextSnippet}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#FDF8F3] to-[#F5E6D3] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 text-[#4B0082] animate-spin mx-auto mb-3" />
                    <p className="text-[#1A1A1A]/60">Loading memory...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#FDF8F3] to-[#F5E6D3] pb-24">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#4B0082] to-[#6B2FAA] text-white p-6 pt-12">
                <div className="max-w-lg mx-auto">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
                                <Brain className="w-6 h-6" />
                                Memory
                            </h1>
                            <p className="text-white/80 text-sm">
                                What I've learned about your child
                            </p>
                        </div>
                        <button
                            onClick={handleRefresh}
                            disabled={isUpdating}
                            className="p-2 rounded-full bg-white/20 backdrop-blur-sm"
                        >
                            <RefreshCw
                                className={`w-5 h-5 ${isUpdating ? 'animate-spin' : ''}`}
                            />
                        </button>
                    </div>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-3 gap-3 mt-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold">{insights.length}</div>
                            <div className="text-xs text-white/70">Insights</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold">{categories.length}</div>
                            <div className="text-xs text-white/70">Categories</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold">
                                {summary?.observationCount || 0}
                            </div>
                            <div className="text-xs text-white/70">Observations</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-lg mx-auto p-4">
                {/* Summary Section */}
                {summary && (
                    <section className="mb-6">
                        <div className="bg-white rounded-2xl p-5 shadow-sm">
                            <h2 className="text-sm font-bold text-[#4B0082] uppercase tracking-wide mb-3">
                                Recent Overview
                            </h2>
                            <p className="text-[#1A1A1A]/80 text-sm leading-relaxed">
                                {summary.narrativeSummary}
                            </p>

                            {summary.strengthsObserved.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <h3 className="text-xs font-semibold text-[#1A1A1A]/50 mb-2">
                                        STRENGTHS OBSERVED
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {summary.strengthsObserved.map((strength, i) => (
                                            <span
                                                key={i}
                                                className="px-2 py-1 bg-amber-50 text-amber-700 rounded-full text-xs"
                                            >
                                                {strength}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {summary.effectiveStrategies.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <h3 className="text-xs font-semibold text-[#1A1A1A]/50 mb-2">
                                        WHAT WORKS
                                    </h3>
                                    <ul className="space-y-1">
                                        {summary.effectiveStrategies.slice(0, 3).map((strategy, i) => (
                                            <li
                                                key={i}
                                                className="text-xs text-[#1A1A1A]/70 flex items-start gap-2"
                                            >
                                                <span className="text-green-500 mt-0.5">•</span>
                                                {strategy}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* Category Filter */}
                <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                            !selectedCategory
                                ? 'bg-[#4B0082] text-white'
                                : 'bg-white text-[#1A1A1A]/60'
                        }`}
                    >
                        All
                    </button>
                    {categories.map((cat) => {
                        const style = CATEGORY_STYLES[cat];
                        const Icon = style.icon;
                        return (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap flex items-center gap-1 ${
                                    selectedCategory === cat
                                        ? 'bg-[#4B0082] text-white'
                                        : 'bg-white text-[#1A1A1A]/60'
                                }`}
                            >
                                <Icon className="w-3 h-3" />
                                {cat}
                            </button>
                        );
                    })}
                </div>

                {/* Insights List */}
                {insights.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                        <Brain className="w-12 h-12 text-[#4B0082]/30 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
                            Building Memory
                        </h3>
                        <p className="text-[#1A1A1A]/60 text-sm mb-4">
                            Add more observations to help me learn patterns about your child.
                        </p>
                        <p className="text-xs text-[#1A1A1A]/40">
                            Memory insights appear after 5+ observations
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {(selectedCategory
                            ? insightsByCategory[selectedCategory] || []
                            : insights
                        ).map((insight) => {
                            const style = CATEGORY_STYLES[insight.category];
                            const Icon = style.icon;
                            return (
                                <motion.button
                                    key={insight.id}
                                    onClick={() => setSelectedInsight(insight)}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    className="w-full bg-white rounded-xl p-4 shadow-sm text-left"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-lg ${style.bg}`}>
                                            <Icon className={`w-4 h-4 ${style.color}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-[#1A1A1A] mb-1">
                                                {insight.title}
                                            </h3>
                                            <p className="text-xs text-[#1A1A1A]/60 line-clamp-2">
                                                {insight.contextSnippet}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${style.bg} ${style.color}`}>
                                                    {insight.category}
                                                </span>
                                                <span className="text-xs text-[#1A1A1A]/40">
                                                    {Math.round(insight.confidence * 100)}% confident
                                                </span>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-[#1A1A1A]/30" />
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Insight Detail Modal */}
            <AnimatePresence>
                {selectedInsight && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center"
                        onClick={() => setSelectedInsight(null)}
                    >
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-t-3xl w-full max-w-lg max-h-[80vh] overflow-y-auto"
                        >
                            {(() => {
                                const style = CATEGORY_STYLES[selectedInsight.category];
                                const Icon = style.icon;
                                return (
                                    <>
                                        <div className={`${style.bg} p-6`}>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className={`p-3 rounded-xl bg-white/80`}>
                                                    <Icon className={`w-6 h-6 ${style.color}`} />
                                                </div>
                                                <button
                                                    onClick={() => setSelectedInsight(null)}
                                                    className="p-2"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                            <h2 className="text-xl font-bold text-[#1A1A1A]">
                                                {selectedInsight.title}
                                            </h2>
                                            <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-white/80 ${style.color}`}>
                                                {selectedInsight.category}
                                            </span>
                                        </div>

                                        <div className="p-6">
                                            <p className="text-[#1A1A1A]/80 leading-relaxed mb-6">
                                                {selectedInsight.description}
                                            </p>

                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                                <div className="bg-gray-50 rounded-xl p-3">
                                                    <div className="text-2xl font-bold text-[#4B0082]">
                                                        {Math.round(selectedInsight.confidence * 100)}%
                                                    </div>
                                                    <div className="text-xs text-[#1A1A1A]/50">
                                                        Confidence
                                                    </div>
                                                </div>
                                                <div className="bg-gray-50 rounded-xl p-3">
                                                    <div className="text-2xl font-bold text-[#4B0082]">
                                                        {selectedInsight.sourceObservationIds.length}
                                                    </div>
                                                    <div className="text-xs text-[#1A1A1A]/50">
                                                        Observations
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-[#4B0082]/5 rounded-xl p-4">
                                                <h3 className="text-sm font-semibold text-[#4B0082] mb-2">
                                                    Context for Oracle
                                                </h3>
                                                <p className="text-sm text-[#1A1A1A]/70 italic">
                                                    "{selectedInsight.contextSnippet}"
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MemoryInsights;
