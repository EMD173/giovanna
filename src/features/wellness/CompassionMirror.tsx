/**
 * COMPASSION MIRROR: Burnout Mitigation Layer
 * 
 * NLP-powered detection of caregiver self-blame and burnout patterns
 * in spoken Vocal Ledger logs. When detected, the Oracle offers
 * grounding prompts to return the parent to the present moment.
 * 
 * FEATURES:
 * - Self-blame Detection: NLP patterns for guilt, perfectionism, exhaustion
 * - Oracle Intervention: Personalized grounding prompts
 * - Burnout Weight Tracking: Trends over time
 * 
 * PHILOSOPHY: Perfection is a stationary state. The oracle reminds us
 * that we are dynamic subjects in a living process.
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart,
    Brain,
    AlertCircle,
    Sun,
    Moon,
    Wind,
    Flower2,
    RefreshCw,
    TrendingDown,
    TrendingUp,
    Activity
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

export interface BurnoutIndicator {
    category: BurnoutCategory;
    phrase: string;
    weight: number;       // 0-1, higher = more concerning
    detectedAt: Date;
}

export type BurnoutCategory =
    | 'self_blame'
    | 'perfectionism'
    | 'exhaustion'
    | 'hopelessness'
    | 'isolation'
    | 'guilt';

export interface CompassionPrompt {
    id: string;
    category: BurnoutCategory;
    prompt: string;
    followUp?: string;
}

export interface BurnoutMetrics {
    currentWeight: number;        // 0-1 overall burnout weight
    weeklyTrend: 'improving' | 'stable' | 'worsening';
    strengthNarrativesLogged: number;
    stressEventsLogged: number;
    lifeForceRatio: number;      // strength / (stress + 1)
}

// ============================================================================
// NLP DETECTION PATTERNS
// ============================================================================

const BURNOUT_PATTERNS: { pattern: RegExp; category: BurnoutCategory; weight: number }[] = [
    // Self-blame patterns
    { pattern: /my fault/i, category: 'self_blame', weight: 0.8 },
    { pattern: /i('m| am) (a )?(bad|terrible|awful) (mom|dad|parent)/i, category: 'self_blame', weight: 0.9 },
    { pattern: /i('m| am) failing/i, category: 'self_blame', weight: 0.85 },
    { pattern: /i should have/i, category: 'self_blame', weight: 0.6 },
    { pattern: /why can't i/i, category: 'self_blame', weight: 0.7 },
    { pattern: /i can't do this right/i, category: 'self_blame', weight: 0.75 },

    // Perfectionism patterns
    { pattern: /never good enough/i, category: 'perfectionism', weight: 0.8 },
    { pattern: /i should be (able|better)/i, category: 'perfectionism', weight: 0.65 },
    { pattern: /other parents (can|don't)/i, category: 'perfectionism', weight: 0.6 },
    { pattern: /if only i/i, category: 'perfectionism', weight: 0.5 },

    // Exhaustion patterns
    { pattern: /so (tired|exhausted)/i, category: 'exhaustion', weight: 0.6 },
    { pattern: /can't do this (anymore|again)/i, category: 'exhaustion', weight: 0.85 },
    { pattern: /running on empty/i, category: 'exhaustion', weight: 0.7 },
    { pattern: /nothing left to give/i, category: 'exhaustion', weight: 0.8 },
    { pattern: /burnt out/i, category: 'exhaustion', weight: 0.75 },

    // Hopelessness patterns
    { pattern: /nothing (ever )?(works|helps)/i, category: 'hopelessness', weight: 0.85 },
    { pattern: /what's the point/i, category: 'hopelessness', weight: 0.9 },
    { pattern: /will (it|this) ever get better/i, category: 'hopelessness', weight: 0.7 },
    { pattern: /giving up/i, category: 'hopelessness', weight: 0.95 },

    // Isolation patterns
    { pattern: /no one understands/i, category: 'isolation', weight: 0.7 },
    { pattern: /all alone in this/i, category: 'isolation', weight: 0.75 },
    { pattern: /nobody helps/i, category: 'isolation', weight: 0.65 },

    // Guilt patterns
    { pattern: /i feel (so )?guilty/i, category: 'guilt', weight: 0.7 },
    { pattern: /i('m| am)( a)? horrible/i, category: 'guilt', weight: 0.8 },
    { pattern: /i yelled/i, category: 'guilt', weight: 0.55 },
    { pattern: /i lost (my|it|control)/i, category: 'guilt', weight: 0.6 },
];

const COMPASSION_PROMPTS: CompassionPrompt[] = [
    {
        id: 'dynamic_subject',
        category: 'self_blame',
        prompt: "Perfection is a stationary state. You are a dynamic subject in a living process. Let's return to the Now.",
        followUp: "What is one thing you can feel right now? Your feet on the ground, perhaps?"
    },
    {
        id: 'enough_already',
        category: 'perfectionism',
        prompt: "You have been enough since the moment you were born. Nothing you do can add or subtract from that.",
        followUp: "Can you name one thing that went well today, even if it's small?"
    },
    {
        id: 'rest_revolution',
        category: 'exhaustion',
        prompt: "Rest is not earned. It is biologically necessary. The system that made you feel guilty for resting is the one that needs to change, not you.",
        followUp: "What is the smallest possible rest you could take right now? Even closing your eyes for 30 seconds counts."
    },
    {
        id: 'seasons_change',
        category: 'hopelessness',
        prompt: "This moment is not forever. Seasons change. Children grow. Your nervous system is doing its best to protect you by preparing for the worst. But this is only one moment.",
        followUp: "Can you think of a moment—any moment—when things felt lighter?"
    },
    {
        id: 'village_calling',
        category: 'isolation',
        prompt: "You were never meant to do this alone. The nuclear family is a historical anomaly. Your need for village is not weakness—it is wisdom encoded in your DNA.",
        followUp: "Who is one person you could reach out to, even just to say 'this is hard today'?"
    },
    {
        id: 'rupture_repair',
        category: 'guilt',
        prompt: "Rupture happens in all relationships. What matters is repair. Your child's brain is wiring for connection right now, and every repair teaches them that love survives mistakes.",
        followUp: "When you're ready, what would repair look like for you both?"
    }
];

const CATEGORY_META: Record<BurnoutCategory, { label: string; icon: React.ReactNode; color: string }> = {
    'self_blame': { label: 'Self-Blame', icon: <AlertCircle className="w-4 h-4" />, color: '#EF4444' },
    'perfectionism': { label: 'Perfectionism', icon: <Activity className="w-4 h-4" />, color: '#F59E0B' },
    'exhaustion': { label: 'Exhaustion', icon: <Moon className="w-4 h-4" />, color: '#8B5CF6' },
    'hopelessness': { label: 'Hopelessness', icon: <TrendingDown className="w-4 h-4" />, color: '#64748B' },
    'isolation': { label: 'Isolation', icon: <Wind className="w-4 h-4" />, color: '#3B82F6' },
    'guilt': { label: 'Guilt', icon: <Heart className="w-4 h-4" />, color: '#EC4899' },
};

// ============================================================================
// CORE FUNCTIONS
// ============================================================================

/**
 * Analyze text for burnout indicators
 */
export function detectBurnoutPatterns(text: string): BurnoutIndicator[] {
    const indicators: BurnoutIndicator[] = [];

    for (const { pattern, category, weight } of BURNOUT_PATTERNS) {
        const match = text.match(pattern);
        if (match) {
            indicators.push({
                category,
                phrase: match[0],
                weight,
                detectedAt: new Date(),
            });
        }
    }

    return indicators;
}

/**
 * Get the appropriate compassion prompt based on detected indicators
 */
export function getCompassionPrompt(indicators: BurnoutIndicator[], parentName?: string): CompassionPrompt | null {
    if (indicators.length === 0) return null;

    // Find highest weight indicator
    const highestWeight = indicators.reduce((max, ind) =>
        ind.weight > max.weight ? ind : max
    );

    // Get matching prompt
    const prompt = COMPASSION_PROMPTS.find(p => p.category === highestWeight.category);

    if (prompt && parentName) {
        return {
            ...prompt,
            prompt: prompt.prompt.replace('You', parentName),
        };
    }

    return prompt || null;
}

/**
 * Calculate overall burnout weight from indicators
 */
export function calculateBurnoutWeight(indicators: BurnoutIndicator[]): number {
    if (indicators.length === 0) return 0;

    // Average of all weights, capped at 1
    const total = indicators.reduce((sum, ind) => sum + ind.weight, 0);
    return Math.min(1, total / indicators.length);
}

/**
 * Calculate Life Force Preserved ratio
 */
export function calculateLifeForceRatio(strengthNarratives: number, stressEvents: number): number {
    return strengthNarratives / (stressEvents + 1);
}

// ============================================================================
// COMPONENT
// ============================================================================

interface CompassionMirrorProps {
    parentName?: string;
    onComplete?: () => void;
}

export const CompassionMirror = ({ parentName = 'Beloved', onComplete }: CompassionMirrorProps) => {
    const [inputText, setInputText] = useState('');
    const [indicators, setIndicators] = useState<BurnoutIndicator[]>([]);
    const [compassionPrompt, setCompassionPrompt] = useState<CompassionPrompt | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [metrics] = useState<BurnoutMetrics>({
        currentWeight: 0,
        weeklyTrend: 'stable',
        strengthNarrativesLogged: 12,
        stressEventsLogged: 5,
        lifeForceRatio: 2.0,
    });

    // Analyze text as user types
    const analyzeText = useCallback((text: string) => {
        const detected = detectBurnoutPatterns(text);
        setIndicators(detected);

        if (detected.length > 0) {
            const prompt = getCompassionPrompt(detected, parentName);
            setCompassionPrompt(prompt);

            // Auto-show prompt for high-weight indicators
            const highWeight = detected.some(ind => ind.weight >= 0.7);
            if (highWeight && !showPrompt) {
                setShowPrompt(true);
            }
        }
    }, [parentName, showPrompt]);

    // Debounce analysis
    useEffect(() => {
        const timer = setTimeout(() => {
            if (inputText.trim()) {
                analyzeText(inputText);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [inputText, analyzeText]);

    return (
        <div
            className="min-h-screen p-6 pb-24"
            style={{
                background: 'linear-gradient(145deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
            }}
        >
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div
                        className="inline-flex p-4 rounded-2xl mb-4"
                        style={{
                            background: 'linear-gradient(145deg, rgba(236, 72, 153, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
                            border: '1px solid rgba(236, 72, 153, 0.3)',
                        }}
                    >
                        <Heart className="w-8 h-8" style={{ color: '#EC4899' }} />
                    </div>
                    <h1
                        className="text-2xl font-bold mb-2"
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            color: 'var(--text-primary)',
                        }}
                    >
                        Compassion Mirror
                    </h1>
                    <p className="text-sm opacity-60 max-w-md mx-auto">
                        A sacred space to witness your weight, and remember your worth.
                    </p>
                </motion.div>

                {/* Life Force Metric */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-panel rounded-[24px] p-6 mb-6"
                    style={{ borderLeft: '4px solid #22C55E' }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium opacity-60">Life Force Preserved</h3>
                            <p className="text-3xl font-bold" style={{ color: '#22C55E' }}>
                                {metrics.lifeForceRatio.toFixed(1)}x
                            </p>
                            <p className="text-xs opacity-40">
                                {metrics.strengthNarrativesLogged} strengths / {metrics.stressEventsLogged} stress events
                            </p>
                        </div>
                        <div className="text-right">
                            <div
                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs"
                                style={{
                                    background: metrics.weeklyTrend === 'improving'
                                        ? 'rgba(34, 197, 94, 0.2)'
                                        : metrics.weeklyTrend === 'worsening'
                                            ? 'rgba(239, 68, 68, 0.2)'
                                            : 'rgba(255,255,255,0.1)',
                                    color: metrics.weeklyTrend === 'improving'
                                        ? '#22C55E'
                                        : metrics.weeklyTrend === 'worsening'
                                            ? '#EF4444'
                                            : '#94A3B8'
                                }}
                            >
                                {metrics.weeklyTrend === 'improving'
                                    ? <TrendingUp className="w-3 h-3" />
                                    : metrics.weeklyTrend === 'worsening'
                                        ? <TrendingDown className="w-3 h-3" />
                                        : <RefreshCw className="w-3 h-3" />
                                }
                                {metrics.weeklyTrend}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Input Area */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-panel rounded-[24px] p-6 mb-6"
                >
                    <label className="text-sm font-medium opacity-70 block mb-2">
                        What's weighing on you today?
                    </label>
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Speak your truth here... The Oracle is listening with compassion."
                        className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-sm min-h-[120px] resize-none"
                    />

                    {/* Detected Indicators */}
                    {indicators.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                            <p className="text-xs opacity-60 mb-2">Patterns detected:</p>
                            <div className="flex flex-wrap gap-2">
                                {indicators.map((ind, i) => {
                                    const meta = CATEGORY_META[ind.category];
                                    return (
                                        <span
                                            key={i}
                                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                                            style={{ background: `${meta.color}20`, color: meta.color }}
                                        >
                                            {meta.icon}
                                            {meta.label}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Compassion Prompt Modal */}
                <AnimatePresence>
                    {showPrompt && compassionPrompt && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-6"
                            style={{ background: 'rgba(0,0,0,0.8)' }}
                            onClick={() => setShowPrompt(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                className="w-full max-w-md glass-panel rounded-[32px] p-8"
                                style={{ border: '2px solid rgba(236, 72, 153, 0.3)' }}
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="text-center mb-6">
                                    <div
                                        className="inline-flex p-3 rounded-2xl mb-4"
                                        style={{ background: 'rgba(139, 92, 246, 0.2)' }}
                                    >
                                        <Brain className="w-6 h-6" style={{ color: '#A78BFA' }} />
                                    </div>
                                    <h3 className="text-sm opacity-60">The Oracle speaks...</h3>
                                </div>

                                <p
                                    className="text-lg font-medium text-center mb-6 leading-relaxed"
                                    style={{ fontFamily: "'Playfair Display', serif" }}
                                >
                                    "{compassionPrompt.prompt}"
                                </p>

                                {compassionPrompt.followUp && (
                                    <p className="text-sm opacity-70 text-center mb-6">
                                        {compassionPrompt.followUp}
                                    </p>
                                )}

                                <button
                                    onClick={() => {
                                        setShowPrompt(false);
                                        onComplete?.();
                                    }}
                                    className="w-full py-4 rounded-xl font-medium flex items-center justify-center gap-2"
                                    style={{
                                        background: 'linear-gradient(145deg, rgba(236, 72, 153, 0.6), rgba(139, 92, 246, 0.6))',
                                    }}
                                >
                                    <Sun className="w-5 h-5" />
                                    Return to Now
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Quick Grounding Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-2 gap-4"
                >
                    <button
                        onClick={() => {
                            setCompassionPrompt(COMPASSION_PROMPTS[0]);
                            setShowPrompt(true);
                        }}
                        className="glass-panel rounded-[20px] p-4 text-left hover:scale-[1.02] transition-all"
                    >
                        <Flower2 className="w-5 h-5 mb-2" style={{ color: '#22C55E' }} />
                        <p className="text-sm font-medium">Grounding Breath</p>
                        <p className="text-xs opacity-60">Return to the present</p>
                    </button>

                    <button
                        onClick={() => {
                            setCompassionPrompt(COMPASSION_PROMPTS[4]);
                            setShowPrompt(true);
                        }}
                        className="glass-panel rounded-[20px] p-4 text-left hover:scale-[1.02] transition-all"
                    >
                        <Heart className="w-5 h-5 mb-2" style={{ color: '#EC4899' }} />
                        <p className="text-sm font-medium">Self-Compassion</p>
                        <p className="text-xs opacity-60">Remember your worth</p>
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default CompassionMirror;
