/**
 * COGNITIVE DEPTH SELECTOR: Meet Me Where I Am
 * 
 * A 1-5 scale that adjusts the entire app's vocabulary and complexity
 * to meet families at their preferred comprehension level.
 * 
 * LEVELS:
 * 1 - Simple & Clear (5th Grade): "Silly Games", "Family Mantras"
 * 3 - Professional & Clinical (Practitioner): "Regulation strategies", "IEP goals"
 * 5 - Scholarly & Theoretical (PhD): "Epigenetic Consciousness", "Recursive Logic"
 * 
 * PHILOSOPHY: Every parent deserves access to the tools that support their
 * child, regardless of their educational background. We meet you where you are.
 */

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    Brain,
    Smile,
    Briefcase,
    GraduationCap,
    Check,
    Sparkles
} from 'lucide-react';

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
    // Core concept translations
    regulation: string;
    dysregulation: string;
    reciprocity: string;
    sanctuary: string;
    oracle: string;
    observation: string;
    intervention: string;

    // Feature names
    captureFeature: string;
    mantrasFeature: string;
    villageFeature: string;
    vaultFeature: string;

    // Explanatory phrases
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
        icon: <Smile className="w-5 h-5" />,
        color: '#22C55E',
        vocabulary: {
            regulation: 'calm body',
            dysregulation: 'big feelings',
            reciprocity: 'connection',
            sanctuary: 'safe space',
            oracle: 'helper',
            observation: 'note',
            intervention: 'helping hand',
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
        icon: <Smile className="w-5 h-5" />,
        color: '#10B981',
        vocabulary: {
            regulation: 'self-calming',
            dysregulation: 'overwhelm',
            reciprocity: 'give-and-take moments',
            sanctuary: 'safe environment',
            oracle: 'guidance system',
            observation: 'observation',
            intervention: 'support strategy',
            captureFeature: 'Observations',
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
        icon: <Briefcase className="w-5 h-5" />,
        color: '#3B82F6',
        vocabulary: {
            regulation: 'self-regulation',
            dysregulation: 'dysregulation',
            reciprocity: 'relational reciprocity',
            sanctuary: 'therapeutic environment',
            oracle: 'AI analysis engine',
            observation: 'behavioral observation',
            intervention: 'intervention strategy',
            captureFeature: 'Behavioral Capture',
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
        icon: <GraduationCap className="w-5 h-5" />,
        color: '#8B5CF6',
        vocabulary: {
            regulation: 'autonomic regulation',
            dysregulation: 'nervous system dysregulation',
            reciprocity: 'bidirectional relational attunement',
            sanctuary: 'neurodiverse-affirming sanctuary',
            oracle: 'pattern recognition oracle',
            observation: 'multimodal behavioral documentation',
            intervention: 'evidence-based intervention protocol',
            captureFeature: 'Multimodal Capture',
            mantrasFeature: 'Consistency Anchors',
            villageFeature: 'Collegial Network',
            vaultFeature: 'Institutional Documentation Vault',
            howItWorks: "Capture multimodal behavioral data for pattern recognition and evidence-based intervention planning.",
        },
    },
    5: {
        level: 5,
        label: "Scholarly & Theoretical",
        description: "PhD-level theoretical frameworks and research terminology",
        icon: <Brain className="w-5 h-5" />,
        color: '#EC4899',
        vocabulary: {
            regulation: 'polyvagal state modulation',
            dysregulation: 'allostatic overload / amygdala hijack',
            reciprocity: 'recursive relational reciprocity',
            sanctuary: 'epigenetically-resonant holding environment',
            oracle: 'recursive pattern emergence oracle',
            observation: 'phenomenological witnessing',
            intervention: 'recursive strength-based refraction',
            captureFeature: 'Phenomenological Witnessing',
            mantrasFeature: 'Systemic Entropy Reduction Phrases',
            villageFeature: 'Distributed Care Collective',
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
        'regulation': {
            1: "When your child's body feels calm and they can think clearly.",
            2: "Your child's ability to manage their emotions and stay calm.",
            3: "The capacity for self-regulation—modulating arousal to maintain adaptive functioning.",
            4: "Autonomic regulation across sympathetic/parasympathetic states, enabling window of tolerance maintenance.",
            5: "Polyvagal state modulation through ventral vagal engagement, enabling recursive social engagement system activation.",
        },
        'reciprocity': {
            1: "The back-and-forth moments of connection between you and your child.",
            2: "When you and your child respond to each other in a give-and-take way.",
            3: "Bidirectional relational exchanges that build attachment security.",
            4: "Mutual attunement patterns reflecting secure attachment dynamics.",
            5: "Recursive relational reciprocity as the unit of consciousness transmission in the parent-child dyad.",
        },
        'sanctuary': {
            1: "A safe, calm space where your child feels protected.",
            2: "An environment designed to help your child feel secure and regulated.",
            3: "A therapeutic environment optimized for nervous system co-regulation.",
            4: "A neurodiverse-affirming holding environment that honors biological necessity.",
            5: "An epigenetically-resonant holding environment where recursive witnessing enables emergent selfhood.",
        },
    };

    return explanations[concept]?.[level] || concept;
}

// ============================================================================
// COMPONENT
// ============================================================================

interface CognitiveDepthSelectorProps {
    currentDepth: CognitiveDepthLevel;
    onDepthChange: (level: CognitiveDepthLevel) => void;
    onSave?: () => void;
}

export const CognitiveDepthSelector = ({
    currentDepth,
    onDepthChange,
    onSave
}: CognitiveDepthSelectorProps) => {
    const [selectedDepth, setSelectedDepth] = useState<CognitiveDepthLevel>(currentDepth);
    const [hasChanged, setHasChanged] = useState(false);

    const handleDepthChange = useCallback((level: CognitiveDepthLevel) => {
        setSelectedDepth(level);
        setHasChanged(level !== currentDepth);
        onDepthChange(level);
    }, [currentDepth, onDepthChange]);

    const handleSave = useCallback(() => {
        setHasChanged(false);
        onSave?.();
    }, [onSave]);

    const currentProfile = DEPTH_PROFILES[selectedDepth];

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
                            background: `linear-gradient(145deg, ${currentProfile.color}33 0%, ${currentProfile.color}11 100%)`,
                            border: `1px solid ${currentProfile.color}44`,
                        }}
                    >
                        <Brain className="w-8 h-8" style={{ color: currentProfile.color }} />
                    </div>
                    <h1
                        className="text-2xl font-bold mb-2"
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            color: 'var(--text-primary)',
                        }}
                    >
                        Cognitive Depth
                    </h1>
                    <p className="text-sm opacity-60 max-w-md mx-auto">
                        We meet you where you are. Choose how the app speaks to you.
                    </p>
                </motion.div>

                {/* Current Level Display */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-panel rounded-[24px] p-6 mb-6 text-center"
                    style={{ borderColor: `${currentProfile.color}44` }}
                >
                    <div
                        className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl mb-4"
                        style={{ background: `${currentProfile.color}22` }}
                    >
                        <span style={{ color: currentProfile.color }}>{currentProfile.icon}</span>
                        <span className="text-xl font-bold" style={{ color: currentProfile.color }}>
                            Level {selectedDepth}: {currentProfile.label}
                        </span>
                    </div>
                    <p className="text-sm opacity-70">{currentProfile.description}</p>
                </motion.div>

                {/* Slider Area */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-panel rounded-[24px] p-6 mb-6"
                >
                    <p className="text-sm font-medium mb-6 text-center opacity-70">
                        Slide to adjust your preferred complexity level
                    </p>

                    {/* Glass Panel Slider Track */}
                    <div className="relative h-16 mb-4">
                        {/* Track Background */}
                        <div
                            className="absolute inset-0 rounded-2xl"
                            style={{
                                background: 'linear-gradient(90deg, rgba(34, 197, 94, 0.2), rgba(59, 130, 246, 0.2), rgba(236, 72, 153, 0.2))',
                                border: '1px solid rgba(255,255,255,0.1)',
                            }}
                        />

                        {/* Level Buttons */}
                        <div className="absolute inset-0 flex items-center justify-between px-2">
                            {([1, 2, 3, 4, 5] as CognitiveDepthLevel[]).map(level => {
                                const profile = DEPTH_PROFILES[level];
                                const isSelected = selectedDepth === level;

                                return (
                                    <motion.button
                                        key={level}
                                        onClick={() => handleDepthChange(level)}
                                        className="relative flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all"
                                        style={{
                                            background: isSelected
                                                ? `${profile.color}`
                                                : 'rgba(255,255,255,0.1)',
                                            boxShadow: isSelected
                                                ? `0 4px 20px ${profile.color}66`
                                                : 'none',
                                        }}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <span
                                            className="text-lg font-bold"
                                            style={{
                                                color: isSelected ? '#fff' : 'rgba(255,255,255,0.6)'
                                            }}
                                        >
                                            {level}
                                        </span>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Labels */}
                    <div className="flex justify-between text-xs opacity-50 px-1">
                        <span>Simple</span>
                        <span>Professional</span>
                        <span>Scholarly</span>
                    </div>
                </motion.div>

                {/* Vocabulary Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-panel rounded-[24px] p-6 mb-6"
                >
                    <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" style={{ color: currentProfile.color }} />
                        How things will sound at this level:
                    </h3>

                    <div className="space-y-3">
                        <VocabPreview
                            label="Regulation"
                            value={currentProfile.vocabulary.regulation}
                            color={currentProfile.color}
                        />
                        <VocabPreview
                            label="Connection"
                            value={currentProfile.vocabulary.reciprocity}
                            color={currentProfile.color}
                        />
                        <VocabPreview
                            label="Safe Space"
                            value={currentProfile.vocabulary.sanctuary}
                            color={currentProfile.color}
                        />
                        <VocabPreview
                            label="Capture Feature"
                            value={currentProfile.vocabulary.captureFeature}
                            color={currentProfile.color}
                        />
                    </div>
                </motion.div>

                {/* How It Works (at current depth) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="p-5 rounded-[20px] mb-6"
                    style={{
                        background: `linear-gradient(145deg, ${currentProfile.color}22, ${currentProfile.color}11)`,
                        border: `1px solid ${currentProfile.color}44`,
                    }}
                >
                    <p className="text-sm italic" style={{ color: currentProfile.color }}>
                        "{currentProfile.vocabulary.howItWorks}"
                    </p>
                </motion.div>

                {/* Save Button */}
                {hasChanged && (
                    <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={handleSave}
                        className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
                        style={{
                            background: `linear-gradient(145deg, ${currentProfile.color}CC, ${currentProfile.color}88)`,
                        }}
                    >
                        <Check className="w-5 h-5" />
                        Save Preference
                    </motion.button>
                )}
            </div>
        </div>
    );
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface VocabPreviewProps {
    label: string;
    value: string;
    color: string;
}

const VocabPreview = ({ label, value, color }: VocabPreviewProps) => (
    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
        <span className="text-sm opacity-60">{label}:</span>
        <span
            className="text-sm font-medium px-3 py-1 rounded-full"
            style={{ background: `${color}22`, color }}
        >
            {value}
        </span>
    </div>
);

// ============================================================================
// COMPACT SELECTOR (For Settings/Profile)
// ============================================================================

interface CompactDepthSelectorProps {
    currentDepth: CognitiveDepthLevel;
    onDepthChange: (level: CognitiveDepthLevel) => void;
}

export const CompactDepthSelector = ({
    currentDepth,
    onDepthChange
}: CompactDepthSelectorProps) => {
    const profile = DEPTH_PROFILES[currentDepth];

    return (
        <div className="glass-panel rounded-[20px] p-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4" style={{ color: profile.color }} />
                    <span className="text-sm font-medium">Cognitive Depth</span>
                </div>
                <span
                    className="text-xs px-2 py-1 rounded-full"
                    style={{ background: `${profile.color}22`, color: profile.color }}
                >
                    {profile.label}
                </span>
            </div>

            <div className="flex gap-2">
                {([1, 2, 3, 4, 5] as CognitiveDepthLevel[]).map(level => {
                    const levelProfile = DEPTH_PROFILES[level];
                    const isSelected = currentDepth === level;

                    return (
                        <button
                            key={level}
                            onClick={() => onDepthChange(level)}
                            className="flex-1 py-2 rounded-lg text-xs font-bold transition-all"
                            style={{
                                background: isSelected ? levelProfile.color : 'rgba(255,255,255,0.05)',
                                color: isSelected ? '#fff' : 'rgba(255,255,255,0.5)',
                            }}
                        >
                            {level}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default CognitiveDepthSelector;
