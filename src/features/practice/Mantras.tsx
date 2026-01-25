/**
 * FAMILY MANTRA REGISTRY: Consistency Anchor Layer
 * 
 * A sacred repository for 'Rhythmic Anchors'—the proven phrases that
 * reduce cognitive load and increase predictability for neurodivergent children.
 * 
 * FEATURES:
 * - Log family mantras with warm shimmer highlighting
 * - Track effectiveness through reciprocity correlation
 * - Oracle suggestions for consistency optimization
 * 
 * PHILOSOPHY: Consistency is not rigidity—it is the scaffold upon which
 * safety is built. When a child can predict the response, their nervous
 * system can finally rest.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Anchor,
    Plus,
    Sparkles,
    Heart,
    Check,
    Trash2,
    RefreshCw,
    Lightbulb,
    Star,
    TrendingUp
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

export interface RhythmicAnchor {
    id: string;
    phrase: string;
    context: AnchorContext;
    effectivenessScore: number;  // 1-5 based on reciprocity outcomes
    timesUsed: number;
    lastUsed?: Date;
    createdAt: Date;
    notes?: string;
}

export type AnchorContext =
    | 'boundary_setting'      // "You know mommy said no"
    | 'transition_warning'    // "In 5 minutes we will..."
    | 'regulation_support'    // "Let's take a breath together"
    | 'safety_reminder'       // "We keep our bodies safe"
    | 'connection_repair'     // "I love you AND the answer is no"
    | 'celebration'           // "Your brain is growing!"
    | 'grounding';           // "Where are your feet?"

const CONTEXT_META: Record<AnchorContext, { label: string; color: string; icon: React.ReactNode }> = {
    'boundary_setting': { label: 'Boundaries', color: '#EF4444', icon: <Anchor className="w-4 h-4" /> },
    'transition_warning': { label: 'Transitions', color: '#F59E0B', icon: <RefreshCw className="w-4 h-4" /> },
    'regulation_support': { label: 'Regulation', color: '#10B981', icon: <Heart className="w-4 h-4" /> },
    'safety_reminder': { label: 'Safety', color: '#3B82F6', icon: <Star className="w-4 h-4" /> },
    'connection_repair': { label: 'Repair', color: '#EC4899', icon: <Heart className="w-4 h-4" /> },
    'celebration': { label: 'Celebration', color: '#8B5CF6', icon: <Sparkles className="w-4 h-4" /> },
    'grounding': { label: 'Grounding', color: '#06B6D4', icon: <Anchor className="w-4 h-4" /> },
};

// ============================================================================
// SAMPLE MANTRAS (Oracle-suggested defaults)
// ============================================================================

const SUGGESTED_MANTRAS: Partial<RhythmicAnchor>[] = [
    { phrase: "You know mommy/daddy said no", context: 'boundary_setting' },
    { phrase: "In 5 minutes, we will...", context: 'transition_warning' },
    { phrase: "First ___, then ___", context: 'transition_warning' },
    { phrase: "Let's take three breaths together", context: 'regulation_support' },
    { phrase: "Where are your feet right now?", context: 'grounding' },
    { phrase: "I love you AND the answer is still no", context: 'connection_repair' },
    { phrase: "Your brain is building new pathways!", context: 'celebration' },
    { phrase: "We keep our bodies safe", context: 'safety_reminder' },
    { phrase: "This is hard AND you can do hard things", context: 'regulation_support' },
    { phrase: "What does your body need right now?", context: 'grounding' },
];

// ============================================================================
// COMPONENT
// ============================================================================

export const Mantras = () => {
    const [mantras, setMantras] = useState<RhythmicAnchor[]>([
        {
            id: '1',
            phrase: "You know mommy said no",
            context: 'boundary_setting',
            effectivenessScore: 4.2,
            timesUsed: 47,
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            lastUsed: new Date(),
        },
        {
            id: '2',
            phrase: "First calm body, then we talk",
            context: 'regulation_support',
            effectivenessScore: 4.8,
            timesUsed: 32,
            createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
            lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        }
    ]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const addMantra = (phrase: string, context: AnchorContext) => {
        const newMantra: RhythmicAnchor = {
            id: `mantra_${Date.now()}`,
            phrase,
            context,
            effectivenessScore: 0,
            timesUsed: 0,
            createdAt: new Date(),
        };
        setMantras(prev => [...prev, newMantra]);
        setShowAddModal(false);
    };

    const deleteMantra = (id: string) => {
        setMantras(prev => prev.filter(m => m.id !== id));
    };

    const averageEffectiveness = mantras.length > 0
        ? mantras.reduce((sum, m) => sum + m.effectivenessScore, 0) / mantras.filter(m => m.effectivenessScore > 0).length || 0
        : 0;

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
                            background: 'linear-gradient(145deg, rgba(212, 175, 55, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)',
                            border: '1px solid rgba(212, 175, 55, 0.3)',
                        }}
                    >
                        <Anchor className="w-8 h-8" style={{ color: '#D4AF37' }} />
                    </div>
                    <h1
                        className="text-2xl font-bold mb-2"
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            color: 'var(--text-primary)',
                        }}
                    >
                        Family Mantra Registry
                    </h1>
                    <p className="text-sm opacity-60 max-w-md mx-auto">
                        Rhythmic Anchors: proven phrases that reduce cognitive load
                        and create predictable safety for your child.
                    </p>
                </motion.div>

                {/* Effectiveness Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-panel rounded-[24px] p-6 mb-6"
                    style={{ borderLeft: '4px solid #D4AF37' }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-60">Average Anchor Effectiveness</p>
                            <p className="text-3xl font-bold" style={{ color: '#D4AF37' }}>
                                {averageEffectiveness.toFixed(1)}<span className="text-lg opacity-60">/5</span>
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm opacity-60">{mantras.length} anchors registered</p>
                            <p className="text-sm" style={{ color: '#22C55E' }}>
                                <TrendingUp className="w-4 h-4 inline mr-1" />
                                Consistency building
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Mantras List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4 mb-6"
                >
                    {mantras.map((mantra, index) => (
                        <MantraCard
                            key={mantra.id}
                            mantra={mantra}
                            onDelete={() => deleteMantra(mantra.id)}
                            delay={index * 0.05}
                        />
                    ))}
                </motion.div>

                {/* Action Buttons */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
                        style={{
                            background: 'linear-gradient(145deg, rgba(212, 175, 55, 0.6), rgba(236, 72, 153, 0.6))',
                        }}
                    >
                        <Plus className="w-5 h-5" />
                        Add New Anchor
                    </button>
                    <button
                        onClick={() => setShowSuggestions(true)}
                        className="flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 bg-white/10"
                    >
                        <Lightbulb className="w-5 h-5" />
                        Oracle Suggestions
                    </button>
                </div>

                {/* Consistency Tip */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="glass-panel rounded-[20px] p-5"
                    style={{
                        background: 'linear-gradient(145deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.05))',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                    }}
                >
                    <div className="flex gap-3">
                        <Sparkles className="w-5 h-5 shrink-0" style={{ color: '#A78BFA' }} />
                        <div>
                            <p className="text-sm font-medium mb-1">Oracle Insight</p>
                            <p className="text-xs opacity-70">
                                Use the same exact words each time. Your child's brain builds neural
                                pathways faster when it can predict the phrase before it arrives.
                                Novelty may feel creative to you, but predictability is safety to them.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Add Mantra Modal */}
                <AnimatePresence>
                    {showAddModal && (
                        <AddMantraModal
                            onAdd={addMantra}
                            onClose={() => setShowAddModal(false)}
                        />
                    )}
                </AnimatePresence>

                {/* Suggestions Modal */}
                <AnimatePresence>
                    {showSuggestions && (
                        <SuggestionsModal
                            suggestions={SUGGESTED_MANTRAS}
                            onSelect={(phrase, context) => {
                                addMantra(phrase, context);
                                setShowSuggestions(false);
                            }}
                            onClose={() => setShowSuggestions(false)}
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

interface MantraCardProps {
    mantra: RhythmicAnchor;
    onDelete: () => void;
    delay?: number;
}

const MantraCard = ({ mantra, onDelete, delay = 0 }: MantraCardProps) => {
    const meta = CONTEXT_META[mantra.context];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="glass-panel rounded-[20px] p-5 relative overflow-hidden"
            style={{
                // Warm shimmer effect
                background: `linear-gradient(145deg, rgba(30,30,40,0.9) 0%, rgba(212, 175, 55, 0.05) 50%, rgba(30,30,40,0.9) 100%)`,
            }}
        >
            {/* Warm shimmer animation */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.1), transparent)',
                }}
                animate={{
                    x: ['-100%', '200%'],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 5,
                }}
            />

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                    <div
                        className="flex items-center gap-2 px-3 py-1 rounded-full text-xs"
                        style={{ background: `${meta.color}20`, color: meta.color }}
                    >
                        {meta.icon}
                        {meta.label}
                    </div>
                    <button
                        onClick={onDelete}
                        className="p-1 rounded opacity-40 hover:opacity-100 hover:text-red-400 transition-all"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                <p
                    className="text-lg font-medium mb-3"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    "{mantra.phrase}"
                </p>

                <div className="flex items-center justify-between text-xs opacity-60">
                    <span>Used {mantra.timesUsed} times</span>
                    <div className="flex items-center gap-1">
                        {mantra.effectivenessScore > 0 && (
                            <>
                                <span style={{ color: '#D4AF37' }}>★ {mantra.effectivenessScore.toFixed(1)}</span>
                                <span className="ml-2">effectiveness</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

interface AddMantraModalProps {
    onAdd: (phrase: string, context: AnchorContext) => void;
    onClose: () => void;
}

const AddMantraModal = ({ onAdd, onClose }: AddMantraModalProps) => {
    const [phrase, setPhrase] = useState('');
    const [context, setContext] = useState<AnchorContext>('boundary_setting');

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: 'rgba(0,0,0,0.8)' }}
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="w-full max-w-md glass-panel rounded-[28px] p-6"
                onClick={e => e.stopPropagation()}
            >
                <h3 className="text-xl font-bold mb-4">Add Rhythmic Anchor</h3>

                <div className="mb-4">
                    <label className="text-sm opacity-70 block mb-2">Your Anchor Phrase</label>
                    <input
                        type="text"
                        value={phrase}
                        onChange={e => setPhrase(e.target.value)}
                        placeholder="e.g., You know the answer is no"
                        className="w-full p-4 rounded-xl bg-white/5 border border-white/10"
                    />
                </div>

                <div className="mb-6">
                    <label className="text-sm opacity-70 block mb-2">Context</label>
                    <div className="grid grid-cols-2 gap-2">
                        {(Object.keys(CONTEXT_META) as AnchorContext[]).map(key => {
                            const meta = CONTEXT_META[key];
                            return (
                                <button
                                    key={key}
                                    onClick={() => setContext(key)}
                                    className="p-3 rounded-xl text-left text-sm flex items-center gap-2 transition-all"
                                    style={{
                                        background: context === key ? `${meta.color}30` : 'rgba(255,255,255,0.05)',
                                        border: context === key ? `2px solid ${meta.color}` : '2px solid transparent',
                                    }}
                                >
                                    <span style={{ color: meta.color }}>{meta.icon}</span>
                                    {meta.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl bg-white/10"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => phrase.trim() && onAdd(phrase.trim(), context)}
                        disabled={!phrase.trim()}
                        className="flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                        style={{
                            background: phrase.trim()
                                ? 'linear-gradient(145deg, rgba(212, 175, 55, 0.6), rgba(236, 72, 153, 0.6))'
                                : 'rgba(255,255,255,0.1)',
                            opacity: phrase.trim() ? 1 : 0.5,
                        }}
                    >
                        <Check className="w-4 h-4" />
                        Add Anchor
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

interface SuggestionsModalProps {
    suggestions: Partial<RhythmicAnchor>[];
    onSelect: (phrase: string, context: AnchorContext) => void;
    onClose: () => void;
}

const SuggestionsModal = ({ suggestions, onSelect, onClose }: SuggestionsModalProps) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
        style={{ background: 'rgba(0,0,0,0.8)' }}
        onClick={onClose}
    >
        <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-md glass-panel rounded-[28px] p-6 max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
        >
            <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5" style={{ color: '#D4AF37' }} />
                <h3 className="text-xl font-bold">Oracle-Suggested Anchors</h3>
            </div>
            <p className="text-sm opacity-60 mb-4">
                These phrases are based on evidence-based practices for reducing
                cognitive load and increasing predictability.
            </p>

            <div className="space-y-2">
                {suggestions.map((s, i) => {
                    const meta = s.context ? CONTEXT_META[s.context] : null;
                    return (
                        <button
                            key={i}
                            onClick={() => s.phrase && s.context && onSelect(s.phrase, s.context)}
                            className="w-full p-4 rounded-xl text-left hover:bg-white/10 transition-all"
                        >
                            <p className="font-medium">"{s.phrase}"</p>
                            {meta && (
                                <span
                                    className="text-xs mt-1 inline-flex items-center gap-1"
                                    style={{ color: meta.color }}
                                >
                                    {meta.icon} {meta.label}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            <button
                onClick={onClose}
                className="w-full mt-4 py-3 rounded-xl bg-white/10"
            >
                Close
            </button>
        </motion.div>
    </motion.div>
);

export default Mantras;
