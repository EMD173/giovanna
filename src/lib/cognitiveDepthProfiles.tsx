/**
 * Cognitive Depth Profiles and Utilities
 * 
 * Provides vocabulary and terminology at different cognitive depth levels.
 */

import React from 'react';
import { IconHeart, IconMoodSmile, IconBriefcase, IconSchool, IconBrain } from '@tabler/icons-react';

// ============================================================================
// TYPES
// ============================================================================

export type CognitiveDepthLevel = 1 | 2 | 3 | 4 | 5;

/**
 * DEFAULT DEPTH: Level 3 (Professional & Clinical)
 * 
 * This default greets social workers and educators with clinical-grade
 * terminology while remaining accessible. Users can adjust up or down.
 */
export const DEFAULT_COGNITIVE_DEPTH: CognitiveDepthLevel = 3;

export interface DepthProfile {
    level: CognitiveDepthLevel;
    label: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    vocabulary: VocabularySet;
}

export interface VocabularySet {
    regulation: string;
    dysregulation: string;
    reciprocity: string;
    sanctuary: string;
    oracle: string;
    observation: string;
    intervention: string;
    captureFeature: string;
    mantrasFeature: string;
    villageFeature: string;
    vaultFeature: string;
    howItWorks: string;
}

// ============================================================================
// DEPTH PROFILES
// ============================================================================

export const DEPTH_PROFILES: Record<CognitiveDepthLevel, DepthProfile> = {
    1: {
        level: 1,
        label: "Simple & Clear",
        description: "Easy-to-understand language, like explaining to a friend",
        icon: <IconHeart className="w-5 h-5" />,
        color: '#22C55E',
        vocabulary: {
            regulation: 'feeling calm',
            dysregulation: 'having a hard time',
            reciprocity: 'back-and-forth connection',
            sanctuary: 'safe space',
            oracle: 'helpful guide',
            observation: 'what I noticed',
            intervention: 'what helped',
            captureFeature: 'Quick Notes',
            mantrasFeature: 'Family Sayings',
            villageFeature: 'Community',
            vaultFeature: 'Memory Box',
            howItWorks: "Write down what you see, and we'll help you understand your child better.",
        },
    },
    2: {
        level: 2,
        label: "Simplified",
        description: "Clear language with some helpful terms explained",
        icon: <IconMoodSmile className="w-5 h-5" />,
        color: '#10B981',
        vocabulary: {
            regulation: 'self-regulation',
            dysregulation: 'dysregulation',
            reciprocity: 'reciprocity',
            sanctuary: 'sanctuary',
            oracle: 'guidance assistant',
            observation: 'observation',
            intervention: 'support strategy',
            captureFeature: 'Observation Log',
            mantrasFeature: 'Anchor Phrases',
            villageFeature: 'Parent Community',
            vaultFeature: 'Documentation',
            howItWorks: "Log observations about your child and receive personalized guidance.",
        },
    },
    3: {
        level: 3,
        label: "Professional & Clinical",
        description: "Standard clinical and educational terminology",
        icon: <IconBriefcase className="w-5 h-5" />,
        color: '#3B82F6',
        vocabulary: {
            regulation: 'emotional regulation',
            dysregulation: 'behavioral dysregulation',
            reciprocity: 'dyadic reciprocity',
            sanctuary: 'therapeutic environment',
            oracle: 'pattern recognition oracle',
            observation: 'behavioral observation',
            intervention: 'evidence-based intervention',
            captureFeature: 'Behavioral Ledger',
            mantrasFeature: 'Rhythmic Anchors',
            villageFeature: 'Professional Network',
            vaultFeature: 'Institutional Vault',
            howItWorks: "Document behavioral observations and receive data-driven intervention recommendations.",
        },
    },
    4: {
        level: 4,
        label: "Advanced Clinical",
        description: "In-depth clinical and research-informed language",
        icon: <IconSchool className="w-5 h-5" />,
        color: '#8B5CF6',
        vocabulary: {
            regulation: 'autonomic state modulation',
            dysregulation: 'polyvagal state disruption',
            reciprocity: 'secure attachment dynamics',
            sanctuary: 'neurobiologically-attuned environment',
            oracle: 'recursive pattern emergence engine',
            observation: 'phenomenological witnessing',
            intervention: 'neurosequential intervention',
            captureFeature: 'Multimodal Capture Layer',
            mantrasFeature: 'Linguistic Consistency Anchors',
            villageFeature: 'Care Team Coordination',
            vaultFeature: 'Institutional Documentation Vault',
            howItWorks: "Capture multimodal behavioral data for pattern recognition and evidence-based intervention planning.",
        },
    },
    5: {
        level: 5,
        label: "Scholarly & Theoretical",
        description: "PhD-level theoretical frameworks and research terminology",
        icon: <IconBrain className="w-5 h-5" />,
        color: '#EC4899',
        vocabulary: {
            regulation: 'ventral vagal engagement',
            dysregulation: 'allostatic overload',
            reciprocity: 'recursive relational consciousness',
            sanctuary: 'epigenetically-resonant holding environment',
            oracle: 'phenomenological refraction engine',
            observation: 'recursive witnessing',
            intervention: 'consciousness emergence facilitation',
            captureFeature: 'Phenomenological Ledger',
            mantrasFeature: 'Phase-Locking Verbal Anchors',
            villageFeature: 'Consciousness Network',
            vaultFeature: 'Sovereign Knowledge Vault',
            howItWorks: "Engage in phenomenological witnessing to surface recursive patterns and generate strength-based refractions for institutional advocacy.",
        },
    },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get vocabulary for a specific depth level
 */
export function getVocabulary(level: CognitiveDepthLevel): VocabularySet {
    return DEPTH_PROFILES[level].vocabulary;
}

/**
 * Translate a term based on depth level
 */
export function translateTerm(
    term: keyof VocabularySet,
    level: CognitiveDepthLevel
): string {
    return DEPTH_PROFILES[level].vocabulary[term];
}

/**
 * Get depth-appropriate explanation for a concept
 */
export function getDepthExplanation(
    concept: string,
    level: CognitiveDepthLevel
): string {
    const explanations: Record<string, Record<CognitiveDepthLevel, string>> = {
        'stim': {
            1: "When your child does repetitive movements that help them feel better",
            2: "Self-stimulating behaviors that help regulate the nervous system",
            3: "Stimming behaviors serving regulatory and sensory integration functions",
            4: "Biological necessity movements providing proprioceptive/vestibular regulation",
            5: "Biological necessity phenomena as autonomous nervous system modulation strategies",
        },
        'meltdown': {
            1: "When everything becomes too much and your child needs to let it out",
            2: "An overwhelming emotional response to sensory or emotional overload",
            3: "Neurological overwhelm resulting in temporary loss of self-regulation",
            4: "Amygdala hijack triggered by allostatic overload exceeding window of tolerance",
            5: "Autonomic nervous system cascade following failure of cortical top-down modulation",
        },
    };

    return explanations[concept.toLowerCase()]?.[level] || concept;
}
