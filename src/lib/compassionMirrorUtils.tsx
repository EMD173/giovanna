/**
 * Compassion Mirror NLP Utilities
 * 
 * NLP-powered detection of caregiver self-blame and burnout patterns.
 */

import React from 'react';
import { IconAlertCircle, IconHeart, IconBattery, IconHelp, IconCloudRain } from '@tabler/icons-react';

// ============================================================================
// TYPES
// ============================================================================

export interface BurnoutIndicator {
    category: BurnoutCategory;
    phrase: string;
    weight: number;
    detectedAt: Date;
}

export type BurnoutCategory =
    | 'self_blame'
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
    currentWeight: number;
    weeklyTrend: 'improving' | 'stable' | 'worsening';
    strengthNarrativesLogged: number;
    stressEventsLogged: number;
    lifeForceRatio: number;
}

// ============================================================================
// NLP DETECTION PATTERNS
// ============================================================================

const BURNOUT_PATTERNS: { pattern: RegExp; category: BurnoutCategory; weight: number }[] = [
    // Self-blame patterns
    { pattern: /my fault/i, category: 'self_blame', weight: 0.8 },
    { pattern: /i('m| am) (a )?(bad|terrible|awful) (mom|dad|parent)/i, category: 'self_blame', weight: 0.9 },
    { pattern: /i should have/i, category: 'self_blame', weight: 0.6 },
    { pattern: /if only i/i, category: 'self_blame', weight: 0.7 },
    { pattern: /i'm failing/i, category: 'self_blame', weight: 0.85 },
    { pattern: /i can't do (this|anything) right/i, category: 'self_blame', weight: 0.9 },

    // Exhaustion patterns
    { pattern: /so tired/i, category: 'exhaustion', weight: 0.5 },
    { pattern: /i can't (do this|anymore|keep going)/i, category: 'exhaustion', weight: 0.8 },
    { pattern: /exhausted/i, category: 'exhaustion', weight: 0.7 },
    { pattern: /no energy/i, category: 'exhaustion', weight: 0.65 },
    { pattern: /burnt out/i, category: 'exhaustion', weight: 0.75 },

    // Hopelessness patterns
    { pattern: /nothing (ever )?(works|helps)/i, category: 'hopelessness', weight: 0.85 },
    { pattern: /what's the point/i, category: 'hopelessness', weight: 0.9 },
    { pattern: /will (it|this) ever get better/i, category: 'hopelessness', weight: 0.7 },
    { pattern: /giving up/i, category: 'hopelessness', weight: 0.95 },

    // Isolation patterns
    { pattern: /no one understands/i, category: 'isolation', weight: 0.75 },
    { pattern: /all alone/i, category: 'isolation', weight: 0.8 },
    { pattern: /no help/i, category: 'isolation', weight: 0.7 },
    { pattern: /on my own/i, category: 'isolation', weight: 0.6 },

    // Guilt patterns
    { pattern: /i feel guilty/i, category: 'guilt', weight: 0.7 },
    { pattern: /i('m| am)( a)? horrible/i, category: 'guilt', weight: 0.8 },
    { pattern: /i yelled/i, category: 'guilt', weight: 0.55 },
    { pattern: /i lost (my|it|control)/i, category: 'guilt', weight: 0.6 },
];

export const COMPASSION_PROMPTS: CompassionPrompt[] = [
    {
        id: 'dynamic_subject',
        category: 'self_blame',
        prompt: "Perfection is a stationary state. You are a dynamic subject in a living process. Let's return to the Now.",
        followUp: "What is one thing that went right today, even if small?"
    },
    {
        id: 'nervous_system',
        category: 'exhaustion',
        prompt: "Your nervous system is asking for rest. This is wisdom, not weakness. What would it mean to honor that signal?",
        followUp: "What is the smallest possible step toward rest you could take right now?"
    },
    {
        id: 'hope_seeds',
        category: 'hopelessness',
        prompt: "Hope is not linear. Seeds grow in darkness before they break soil. Progress is happening even when you cannot see it.",
        followUp: "Can you think of a moment—any moment—when things felt lighter?"
    },
    {
        id: 'village_calling',
        category: 'isolation',
        prompt: "You were never meant to do this alone. The nuclear family is a historical anomaly. Your need for village is not weakness—it is wisdom encoded in your DNA.",
        followUp: "Who is one person you could reach out to today?"
    },
    {
        id: 'repair_wisdom',
        category: 'guilt',
        prompt: "Rupture and repair is the rhythm of all healthy relationships. The repair is where the growth happens. You have not damaged your child—you have given them the gift of witnessing a human who tries.",
        followUp: "When you're ready, what would repair look like for you both?"
    }
];

export const CATEGORY_META: Record<BurnoutCategory, { label: string; icon: React.ReactNode; color: string }> = {
    'self_blame': { label: 'Self-Blame', icon: <IconAlertCircle className="w-4 h-4" />, color: '#EF4444' },
    'exhaustion': { label: 'Exhaustion', icon: <IconBattery className="w-4 h-4" />, color: '#F59E0B' },
    'hopelessness': { label: 'Hopelessness', icon: <IconHelp className="w-4 h-4" />, color: '#8B5CF6' },
    'isolation': { label: 'Isolation', icon: <IconCloudRain className="w-4 h-4" />, color: '#3B82F6' },
    'guilt': { label: 'Guilt', icon: <IconHeart className="w-4 h-4" />, color: '#EC4899' },
};

// ============================================================================
// CORE FUNCTIONS
// ============================================================================

/**
 * Analyze text for burnout indicators
 */
export function detectBurnoutPatterns(text: string): BurnoutIndicator[] {
    const indicators: BurnoutIndicator[] = [];
    const now = new Date();

    for (const { pattern, category, weight } of BURNOUT_PATTERNS) {
        const match = text.match(pattern);
        if (match) {
            indicators.push({
                category,
                phrase: match[0],
                weight,
                detectedAt: now,
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
    const sorted = [...indicators].sort((a, b) => b.weight - a.weight);
    const primary = sorted[0];

    // Get matching prompt
    const prompt = COMPASSION_PROMPTS.find(p => p.category === primary.category);

    if (prompt && parentName) {
        return {
            ...prompt,
            prompt: prompt.prompt.replace(/Beloved/g, parentName),
        };
    }

    return prompt || null;
}

/**
 * Calculate overall burnout weight from indicators
 */
export function calculateBurnoutWeight(indicators: BurnoutIndicator[]): number {
    if (indicators.length === 0) return 0;

    const totalWeight = indicators.reduce((sum, ind) => sum + ind.weight, 0);
    // Cap at 1.0
    return Math.min(totalWeight / 2, 1.0);
}

/**
 * Calculate Life Force Preserved ratio
 */
export function calculateLifeForceRatio(strengthNarratives: number, stressEvents: number): number {
    const total = strengthNarratives + stressEvents;
    if (total === 0) return 0.5;
    return strengthNarratives / total;
}
