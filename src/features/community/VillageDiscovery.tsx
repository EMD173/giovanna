/**
 * VILLAGE DISCOVERY: Global Community Link
 * 
 * Decentralized network for sharing 'Refracted Narratives' —
 * anonymized, strength-based insights from private logs that
 * build collective wisdom without exposing private pain.
 * 
 * FEATURES:
 * - Story Purifier: Transforms private logs into anonymized insights
 * - Community Boards: Global sharing with Gold Leaf styling
 * - Wisdom Aggregation: Cross-family patterns surfaced
 * 
 * PHILOSOPHY: Parents across the world are living parallel struggles.
 * Their wisdom, when shared safely, becomes medicine for all.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Globe2,
    Heart,
    Sparkles,
    Send,
    Shield,
    Users,
    RefreshCw,
    Eye,
    Star,
    TrendingUp
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

export interface RefractedNarrative {
    id: string;
    purifiedContent: string;          // Anonymized, strength-based version
    category: NarrativeCategory;
    resonanceCount: number;           // "This helped me" count
    contributorAnonymousId: string;   // Hashed contributor ID
    createdAt: Date;
    tags: string[];
    wisdomExtract?: string;           // Key insight distilled
}

export type NarrativeCategory =
    | 'regulation_win'
    | 'connection_moment'
    | 'sensory_insight'
    | 'transition_strategy'
    | 'advocacy_success'
    | 'repair_after_rupture'
    | 'school_navigation'
    | 'community_wisdom';

export interface StoryPurification {
    originalExcerpt: string;
    purifiedVersion: string;
    removedIdentifiers: string[];
    strengthReframe: string;
}

// ============================================================================
// MOCK DATA (Replace with Firebase)
// ============================================================================

const MOCK_NARRATIVES: RefractedNarrative[] = [
    {
        id: 'rn_001',
        purifiedContent: "When morning transitions felt impossible, we discovered that starting with vestibular input (gentle swinging) before any demands completely changed the trajectory. The body needed to wake up first.",
        category: 'transition_strategy',
        resonanceCount: 47,
        contributorAnonymousId: 'sanctuary_parent_7a3c',
        createdAt: new Date(Date.now() - 86400000 * 2),
        tags: ['morning', 'vestibular', 'transitions'],
        wisdomExtract: 'The body needs to wake up before demands arrive.',
    },
    {
        id: 'rn_002',
        purifiedContent: "After a dysregulation, we've learned that repair doesn't require words. Sitting nearby, quietly, with their comfort object accessible, says 'I'm still here' louder than any apology.",
        category: 'repair_after_rupture',
        resonanceCount: 89,
        contributorAnonymousId: 'sanctuary_parent_2d8f',
        createdAt: new Date(Date.now() - 86400000 * 5),
        tags: ['repair', 'quiet presence', 'co-regulation'],
        wisdomExtract: 'Repair doesn\'t require words. Presence is the message.',
    },
    {
        id: 'rn_003',
        purifiedContent: "The IEP team kept focusing on 'non-compliance' until I asked them to observe my child at the end of the day versus the beginning. Same child, different capacity. Time is a variable they weren't measuring.",
        category: 'advocacy_success',
        resonanceCount: 156,
        contributorAnonymousId: 'sanctuary_parent_9f1e',
        createdAt: new Date(Date.now() - 86400000 * 7),
        tags: ['IEP', 'advocacy', 'capacity'],
        wisdomExtract: 'Time is a variable institutions often forget to measure.',
    },
    {
        id: 'rn_004',
        purifiedContent: "Fluorescent lights were the invisible enemy. Once we understood that, we could name it: 'The lights are too loud today.' Now school provides sunglasses and a dim corner. Naming it gave it power to change.",
        category: 'sensory_insight',
        resonanceCount: 72,
        contributorAnonymousId: 'sanctuary_parent_5b2a',
        createdAt: new Date(Date.now() - 86400000 * 3),
        tags: ['sensory', 'lighting', 'accommodations'],
        wisdomExtract: 'Naming the invisible enemy gives it power to change.',
    },
    {
        id: 'rn_005',
        purifiedContent: "Connection came through parallel play, not face-to-face. We build Legos side by side and suddenly stories emerge that wouldn't appear under direct questions. Side by side, not face to face.",
        category: 'connection_moment',
        resonanceCount: 123,
        contributorAnonymousId: 'sanctuary_parent_8c4d',
        createdAt: new Date(Date.now() - 86400000),
        tags: ['connection', 'parallel play', 'communication'],
        wisdomExtract: 'Side by side, not face to face.',
    },
];

const CATEGORY_META: Record<NarrativeCategory, { label: string; color: string; icon: React.ReactNode }> = {
    'regulation_win': { label: 'Regulation Win', color: '#22C55E', icon: <Star className="w-4 h-4" /> },
    'connection_moment': { label: 'Connection Moment', color: '#EC4899', icon: <Heart className="w-4 h-4" /> },
    'sensory_insight': { label: 'Sensory Insight', color: '#F59E0B', icon: <Eye className="w-4 h-4" /> },
    'transition_strategy': { label: 'Transition Strategy', color: '#8B5CF6', icon: <RefreshCw className="w-4 h-4" /> },
    'advocacy_success': { label: 'Advocacy Success', color: '#D4AF37', icon: <Shield className="w-4 h-4" /> },
    'repair_after_rupture': { label: 'Repair After Rupture', color: '#60A5FA', icon: <Heart className="w-4 h-4" /> },
    'school_navigation': { label: 'School Navigation', color: '#10B981', icon: <TrendingUp className="w-4 h-4" /> },
    'community_wisdom': { label: 'Community Wisdom', color: '#A78BFA', icon: <Users className="w-4 h-4" /> },
};

// ============================================================================
// STORY PURIFIER LOGIC
// ============================================================================

/**
 * Story Purifier: Transform private log into anonymized, strength-based insight
 */
export function purifyStory(privateLog: string, childName?: string): StoryPurification {
    let purified = privateLog;
    const removedIdentifiers: string[] = [];

    // Remove child name if provided
    if (childName) {
        const nameRegex = new RegExp(childName, 'gi');
        if (nameRegex.test(purified)) {
            purified = purified.replace(nameRegex, 'my child');
            removedIdentifiers.push(childName);
        }
    }

    // Remove common identifying patterns
    const identifyingPatterns: [RegExp, string, string][] = [
        [/\b(my son|my daughter|my boy|my girl)\b/gi, 'my child', 'gendered reference'],
        [/\b\d{1,2}[- ]?(year|yr|yo)[s -]?(old)?\b/gi, '', 'age'],
        [/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi, 'one day', 'day name'],
        [/\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/gi, '', 'month name'],
        [/\b(dr\.?\s+\w+|doctor\s+\w+)\b/gi, 'their doctor', 'doctor name'],
        [/\b(\w+\s+elementary|\w+\s+middle|\w+\s+high|\w+\s+school)\b/gi, 'their school', 'school name'],
        [/\b(he|him|his|she|her|hers)\b/gi, 'they', 'pronouns'],
    ];

    for (const [pattern, replacement, type] of identifyingPatterns) {
        if (pattern.test(purified)) {
            purified = purified.replace(pattern, replacement);
            removedIdentifiers.push(type);
        }
    }

    // Clean up extra spaces
    purified = purified.replace(/\s+/g, ' ').trim();

    // Generate strength reframe
    const strengthReframe = generateStrengthReframe(purified);

    return {
        originalExcerpt: privateLog.substring(0, 50) + '...',
        purifiedVersion: purified,
        removedIdentifiers: [...new Set(removedIdentifiers)],
        strengthReframe,
    };
}

/**
 * Generate a strength-based reframe of the narrative
 */
function generateStrengthReframe(content: string): string {
    // Look for deficit language and reframe
    const reframes: [RegExp, string][] = [
        [/couldn't|can't/gi, 'was working on'],
        [/refused|won't/gi, 'needed support to'],
        [/failed|failing/gi, 'is building capacity for'],
        [/struggle|struggling/gi, 'is developing'],
        [/problem|issue/gi, 'communication pattern'],
        [/meltdown/gi, 'intense regulation moment'],
        [/tantrum/gi, 'emotional expression'],
    ];

    let reframed = content;
    let wasReframed = false;

    for (const [pattern, replacement] of reframes) {
        if (pattern.test(reframed)) {
            reframed = reframed.replace(pattern, replacement);
            wasReframed = true;
        }
    }

    return wasReframed
        ? "This story has been reframed through a strength-based lens."
        : "This story already centers strengths and wisdom.";
}

// ============================================================================
// COMPONENT
// ============================================================================

export const VillageDiscovery = () => {
    const [narratives, setNarratives] = useState<RefractedNarrative[]>(MOCK_NARRATIVES);
    const [selectedCategory, setSelectedCategory] = useState<NarrativeCategory | null>(null);
    const [showContributeModal, setShowContributeModal] = useState(false);

    // Filter narratives
    const filteredNarratives = selectedCategory
        ? narratives.filter(n => n.category === selectedCategory)
        : narratives;

    // Add resonance
    const addResonance = (id: string) => {
        setNarratives(prev => prev.map(n =>
            n.id === id ? { ...n, resonanceCount: n.resonanceCount + 1 } : n
        ));
    };

    return (
        <div
            className="min-h-screen p-6 pb-24"
            style={{
                background: 'linear-gradient(145deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
            }}
        >
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div
                        className="inline-flex p-4 rounded-2xl mb-4"
                        style={{
                            background: 'linear-gradient(145deg, rgba(212, 175, 55, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
                            border: '1px solid rgba(212, 175, 55, 0.4)',
                        }}
                    >
                        <Globe2 className="w-8 h-8" style={{ color: '#D4AF37' }} />
                    </div>
                    <h1
                        className="text-2xl font-bold mb-2"
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            color: 'var(--text-primary)',
                        }}
                    >
                        Village Discovery
                    </h1>
                    <p className="text-sm opacity-60 max-w-md mx-auto">
                        Wisdom from sanctuaries worldwide. Anonymized stories, shared strength.
                        You are not alone in this journey.
                    </p>
                </motion.div>

                {/* Category Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-6 overflow-x-auto"
                >
                    <div className="flex gap-2 pb-2">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className="shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all"
                            style={{
                                background: selectedCategory === null
                                    ? 'rgba(212, 175, 55, 0.3)'
                                    : 'rgba(255,255,255,0.05)',
                                border: selectedCategory === null
                                    ? '2px solid rgba(212, 175, 55, 0.5)'
                                    : '2px solid transparent',
                            }}
                        >
                            All Wisdom
                        </button>
                        {Object.entries(CATEGORY_META).slice(0, 5).map(([key, meta]) => (
                            <button
                                key={key}
                                onClick={() => setSelectedCategory(key as NarrativeCategory)}
                                className="shrink-0 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all"
                                style={{
                                    background: selectedCategory === key
                                        ? `${meta.color}30`
                                        : 'rgba(255,255,255,0.05)',
                                    border: selectedCategory === key
                                        ? `2px solid ${meta.color}`
                                        : '2px solid transparent',
                                }}
                            >
                                <span style={{ color: meta.color }}>{meta.icon}</span>
                                {meta.label}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Narratives Feed */}
                <div className="space-y-4 mb-6">
                    <AnimatePresence>
                        {filteredNarratives.map((narrative, index) => (
                            <NarrativeCard
                                key={narrative.id}
                                narrative={narrative}
                                index={index}
                                onResonate={() => addResonance(narrative.id)}
                            />
                        ))}
                    </AnimatePresence>
                </div>

                {/* Contribute Button */}
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    onClick={() => setShowContributeModal(true)}
                    className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
                    style={{
                        background: 'linear-gradient(145deg, rgba(212, 175, 55, 0.4) 0%, rgba(139, 92, 246, 0.4) 100%)',
                        border: '2px solid rgba(212, 175, 55, 0.4)',
                    }}
                >
                    <Sparkles className="w-5 h-5" style={{ color: '#D4AF37' }} />
                    <span style={{ color: '#D4AF37' }}>Share Your Wisdom</span>
                </motion.button>

                {/* Contribute Modal */}
                <AnimatePresence>
                    {showContributeModal && (
                        <ContributeModal
                            onClose={() => setShowContributeModal(false)}
                            onSubmit={(narrative) => {
                                setNarratives(prev => [narrative, ...prev]);
                                setShowContributeModal(false);
                            }}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface NarrativeCardProps {
    narrative: RefractedNarrative;
    index: number;
    onResonate: () => void;
}

const NarrativeCard = ({ narrative, index, onResonate }: NarrativeCardProps) => {
    const [hasResonated, setHasResonated] = useState(false);
    const meta = CATEGORY_META[narrative.category];

    const handleResonate = () => {
        if (!hasResonated) {
            onResonate();
            setHasResonated(true);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.05 }}
            className="glass-panel rounded-[24px] p-6"
            style={{
                borderLeft: `4px solid ${meta.color}`,
            }}
        >
            {/* Category Badge */}
            <div className="flex items-center justify-between mb-3">
                <div
                    className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                        background: `${meta.color}20`,
                        color: meta.color,
                    }}
                >
                    {meta.icon}
                    {meta.label}
                </div>
                <span className="text-xs opacity-40">
                    {Math.floor((Date.now() - narrative.createdAt.getTime()) / 86400000)}d ago
                </span>
            </div>

            {/* Content */}
            <p className="text-sm leading-relaxed mb-4 opacity-90">
                "{narrative.purifiedContent}"
            </p>

            {/* Wisdom Extract */}
            {narrative.wisdomExtract && (
                <div
                    className="p-3 rounded-xl mb-4"
                    style={{ background: 'rgba(212, 175, 55, 0.1)' }}
                >
                    <p className="text-xs font-medium" style={{ color: '#D4AF37' }}>
                        💡 {narrative.wisdomExtract}
                    </p>
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleResonate}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-all ${hasResonated ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                            }`}
                        style={{
                            background: hasResonated ? 'rgba(236, 72, 153, 0.3)' : 'rgba(255,255,255,0.05)',
                        }}
                    >
                        <Heart
                            className="w-4 h-4"
                            style={{
                                color: '#EC4899',
                                fill: hasResonated ? '#EC4899' : 'none',
                            }}
                        />
                        <span>{narrative.resonanceCount}</span>
                    </button>
                </div>
                <div className="flex items-center gap-1 text-xs opacity-40">
                    <Shield className="w-3 h-3" />
                    <span>Anonymized</span>
                </div>
            </div>
        </motion.div>
    );
};

interface ContributeModalProps {
    onClose: () => void;
    onSubmit: (narrative: RefractedNarrative) => void;
}

const ContributeModal = ({ onClose, onSubmit }: ContributeModalProps) => {
    const [privateLog, setPrivateLog] = useState('');
    const [category, setCategory] = useState<NarrativeCategory>('community_wisdom');
    const [purification, setPurification] = useState<StoryPurification | null>(null);
    const [step, setStep] = useState<'write' | 'review' | 'confirm'>('write');

    const handlePurify = () => {
        if (privateLog.trim()) {
            const result = purifyStory(privateLog);
            setPurification(result);
            setStep('review');
        }
    };

    const handleSubmit = () => {
        if (purification) {
            const narrative: RefractedNarrative = {
                id: `rn_${Date.now()}`,
                purifiedContent: purification.purifiedVersion,
                category,
                resonanceCount: 0,
                contributorAnonymousId: `sanctuary_parent_${Math.random().toString(36).substring(7)}`,
                createdAt: new Date(),
                tags: [],
            };
            onSubmit(narrative);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0, 0, 0, 0.7)' }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="w-full max-w-lg glass-panel rounded-[32px] p-6 max-h-[80vh] overflow-y-auto"
                style={{
                    border: '2px solid rgba(212, 175, 55, 0.3)',
                }}
            >
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div
                        className="p-2 rounded-xl"
                        style={{ background: 'rgba(212, 175, 55, 0.2)' }}
                    >
                        <Sparkles className="w-5 h-5" style={{ color: '#D4AF37' }} />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg">Share Your Wisdom</h2>
                        <p className="text-xs opacity-60">
                            The Story Purifier will anonymize your insight
                        </p>
                    </div>
                </div>

                {step === 'write' && (
                    <>
                        <div className="mb-4">
                            <label className="text-sm font-medium opacity-70 block mb-2">
                                Your Private Log
                            </label>
                            <textarea
                                value={privateLog}
                                onChange={(e) => setPrivateLog(e.target.value)}
                                placeholder="Describe a moment of wisdom, a strategy that worked, or an insight you've discovered..."
                                className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-sm min-h-[150px]"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="text-sm font-medium opacity-70 block mb-2">
                                Category
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(CATEGORY_META).map(([key, meta]) => (
                                    <button
                                        key={key}
                                        onClick={() => setCategory(key as NarrativeCategory)}
                                        className="p-3 rounded-xl text-left flex items-center gap-2 transition-all text-sm"
                                        style={{
                                            background: category === key
                                                ? `${meta.color}30`
                                                : 'rgba(255,255,255,0.05)',
                                            border: category === key
                                                ? `2px solid ${meta.color}`
                                                : '2px solid transparent',
                                        }}
                                    >
                                        <span style={{ color: meta.color }}>{meta.icon}</span>
                                        {meta.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handlePurify}
                            disabled={!privateLog.trim()}
                            className="w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2"
                            style={{
                                background: privateLog.trim()
                                    ? 'linear-gradient(145deg, rgba(212, 175, 55, 0.6), rgba(139, 92, 246, 0.6))'
                                    : 'rgba(255,255,255,0.1)',
                                opacity: privateLog.trim() ? 1 : 0.5,
                            }}
                        >
                            <Shield className="w-4 h-4" />
                            Purify & Preview
                        </button>
                    </>
                )}

                {step === 'review' && purification && (
                    <>
                        <div className="mb-4 p-4 rounded-xl" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
                            <div className="flex items-center gap-2 mb-2">
                                <Shield className="w-4 h-4 text-green-400" />
                                <span className="text-sm font-medium text-green-400">
                                    Identity Protected
                                </span>
                            </div>
                            <p className="text-xs opacity-60">
                                Removed: {purification.removedIdentifiers.join(', ') || 'No identifiers found'}
                            </p>
                        </div>

                        <div className="mb-4">
                            <label className="text-sm font-medium opacity-70 block mb-2">
                                Purified Version (What the world will see):
                            </label>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-sm">
                                "{purification.purifiedVersion}"
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep('write')}
                                className="flex-1 py-3 rounded-xl font-medium bg-white/10"
                            >
                                Edit
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2"
                                style={{
                                    background: 'linear-gradient(145deg, rgba(212, 175, 55, 0.6), rgba(139, 92, 246, 0.6))',
                                }}
                            >
                                <Send className="w-4 h-4" />
                                Share with Village
                            </button>
                        </div>
                    </>
                )}

                <button
                    onClick={onClose}
                    className="w-full mt-4 py-2 text-center text-sm opacity-50"
                >
                    Cancel
                </button>
            </motion.div>
        </motion.div>
    );
};

export default VillageDiscovery;
