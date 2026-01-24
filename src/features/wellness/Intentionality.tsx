/**
 * INTENTIONALITY MODULE: Mirror Mode & Pre-Decided Responses
 * 
 * A sacred space for parents to pre-decide their responses to specific
 * triggers before they occur, enabling conscious caregiving.
 * 
 * FEATURES:
 * - Mirror Mode UI: Pre-decide responses to known triggers
 * - Recursive Feedback: Post-log reflection on chosen response effectiveness
 * - Atmospheric Alignment: Track if response maintained desired resonance
 * 
 * PHILOSOPHY: Intentionality transforms reaction into conscious response.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart,
    Brain,
    Sparkles,
    Plus,
    Check,
    X,
    Moon,
    Sun,
    Wind,
    Anchor,
    Target,
    MessageCircle,
    ThumbsUp,
    RotateCcw
} from 'lucide-react';
import { useAuthStore } from '../../core/stores/useAuthStore';

// ============================================================================
// TYPES
// ============================================================================

export interface IntentionalResponse {
    id: string;
    trigger: string;                    // The situation/trigger
    triggerCategory: TriggerCategory;
    chosenResponse: string;             // What I choose to do
    responseEnergy: ResponseEnergy;     // The energy I want to embody
    createdAt: Date;
    usageCount: number;
    effectivenessScore?: number;        // 1-5 scale
    lastUsedAt?: Date;
}

export type TriggerCategory =
    | 'vestibular_stimming'
    | 'sensory_overload'
    | 'transition_resistance'
    | 'meltdown'
    | 'elopement'
    | 'food_refusal'
    | 'sleep_difficulty'
    | 'communication_frustration'
    | 'social_withdrawal'
    | 'other';

export type ResponseEnergy =
    | 'calm_presence'
    | 'playful_engagement'
    | 'quiet_witness'
    | 'firm_boundary'
    | 'joyful_redirection'
    | 'co_regulation';

export interface ReflectionPrompt {
    intentionId: string;
    prompt: string;
    timestamp: Date;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const TRIGGER_OPTIONS: { value: TriggerCategory; label: string; emoji: string }[] = [
    { value: 'vestibular_stimming', label: 'Vestibular Stimming', emoji: '🌀' },
    { value: 'sensory_overload', label: 'Sensory Overload', emoji: '⚡' },
    { value: 'transition_resistance', label: 'Transition Resistance', emoji: '🚪' },
    { value: 'meltdown', label: 'Meltdown', emoji: '🌊' },
    { value: 'elopement', label: 'Elopement Risk', emoji: '🏃' },
    { value: 'food_refusal', label: 'Food Refusal', emoji: '🍽️' },
    { value: 'sleep_difficulty', label: 'Sleep Difficulty', emoji: '🌙' },
    { value: 'communication_frustration', label: 'Communication Frustration', emoji: '💬' },
    { value: 'social_withdrawal', label: 'Social Withdrawal', emoji: '🫥' },
    { value: 'other', label: 'Other', emoji: '✨' },
];

const RESPONSE_ENERGIES: { value: ResponseEnergy; label: string; icon: React.ReactNode; color: string }[] = [
    { value: 'calm_presence', label: 'Calm Presence', icon: <Moon className="w-4 h-4" />, color: '#8B5CF6' },
    { value: 'playful_engagement', label: 'Playful Engagement', icon: <Sparkles className="w-4 h-4" />, color: '#F59E0B' },
    { value: 'quiet_witness', label: 'Quiet Witness', icon: <Wind className="w-4 h-4" />, color: '#6B7280' },
    { value: 'firm_boundary', label: 'Firm Boundary', icon: <Anchor className="w-4 h-4" />, color: '#EF4444' },
    { value: 'joyful_redirection', label: 'Joyful Redirection', icon: <Sun className="w-4 h-4" />, color: '#10B981' },
    { value: 'co_regulation', label: 'Co-Regulation', icon: <Heart className="w-4 h-4" />, color: '#EC4899' },
];

// ============================================================================
// COMPONENT
// ============================================================================

export const Intentionality = () => {
    const { user } = useAuthStore();
    const [intentions, setIntentions] = useState<IntentionalResponse[]>([]);
    const [showCreator, setShowCreator] = useState(false);
    const [reflectionPrompt, setReflectionPrompt] = useState<ReflectionPrompt | null>(null);

    // Load saved intentions (mock for now - replace with Firestore)
    useEffect(() => {
        // TODO: Load from Firestore
        const saved = localStorage.getItem(`intentions_${user?.uid}`);
        if (saved) {
            setIntentions(JSON.parse(saved));
        }
    }, [user]);

    // Save intentions
    const saveIntention = (intention: IntentionalResponse) => {
        const updated = [...intentions, intention];
        setIntentions(updated);
        localStorage.setItem(`intentions_${user?.uid}`, JSON.stringify(updated));
        setShowCreator(false);
    };

    // Record intention usage for recursive feedback
    const useIntention = (id: string) => {
        const updated = intentions.map(i =>
            i.id === id
                ? { ...i, usageCount: i.usageCount + 1, lastUsedAt: new Date() }
                : i
        );
        setIntentions(updated);
        localStorage.setItem(`intentions_${user?.uid}`, JSON.stringify(updated));

        // Show reflection prompt
        const intention = intentions.find(i => i.id === id);
        if (intention) {
            setReflectionPrompt({
                intentionId: id,
                prompt: `Did your choice of "${intention.responseEnergy.replace(/_/g, ' ')}" help you maintain the atmospheric resonance you desired?`,
                timestamp: new Date(),
            });
        }
    };

    // Record reflection feedback
    const submitReflection = (intentionId: string, wasEffective: boolean) => {
        const updated = intentions.map(i => {
            if (i.id === intentionId) {
                const currentScore = i.effectivenessScore || 3;
                const newScore = wasEffective
                    ? Math.min(5, currentScore + 0.5)
                    : Math.max(1, currentScore - 0.5);
                return { ...i, effectivenessScore: newScore };
            }
            return i;
        });
        setIntentions(updated);
        localStorage.setItem(`intentions_${user?.uid}`, JSON.stringify(updated));
        setReflectionPrompt(null);
    };

    const deleteIntention = (id: string) => {
        const updated = intentions.filter(i => i.id !== id);
        setIntentions(updated);
        localStorage.setItem(`intentions_${user?.uid}`, JSON.stringify(updated));
    };

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
                            background: 'linear-gradient(145deg, rgba(139, 92, 246, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)',
                            border: '1px solid rgba(139, 92, 246, 0.3)',
                        }}
                    >
                        <Target className="w-8 h-8" style={{ color: '#A78BFA' }} />
                    </div>
                    <h1
                        className="text-2xl font-bold mb-2"
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            color: 'var(--text-primary)',
                        }}
                    >
                        Mirror Mode
                    </h1>
                    <p className="text-sm opacity-60 max-w-md mx-auto">
                        Pre-decide your response to specific triggers.
                        When the moment comes, you'll already know your path.
                    </p>
                </motion.div>

                {/* Intentions List */}
                <div className="space-y-4 mb-6">
                    <AnimatePresence>
                        {intentions.map((intention, index) => (
                            <IntentionCard
                                key={intention.id}
                                intention={intention}
                                index={index}
                                onUse={() => useIntention(intention.id)}
                                onDelete={() => deleteIntention(intention.id)}
                            />
                        ))}
                    </AnimatePresence>

                    {intentions.length === 0 && !showCreator && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <Brain className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p className="opacity-60 mb-4">
                                No intentions set yet.<br />
                                Create your first pre-decided response.
                            </p>
                        </motion.div>
                    )}
                </div>

                {/* Add Button */}
                {!showCreator && (
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => setShowCreator(true)}
                        className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all"
                        style={{
                            background: 'linear-gradient(145deg, rgba(139, 92, 246, 0.6) 0%, rgba(167, 139, 250, 0.8) 100%)',
                        }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Plus className="w-5 h-5" />
                        Create New Intention
                    </motion.button>
                )}

                {/* Daily Practice Prompt */}
                {intentions.length > 0 && (
                    <DailyPracticePrompt
                        intentions={intentions}
                        onSubmit={(intentionId, newSetting, outcome) => {
                            // Log the practice and update effectiveness
                            const updated = intentions.map(i => {
                                if (i.id === intentionId) {
                                    const currentScore = i.effectivenessScore || 3;
                                    const newScore = outcome === 'success'
                                        ? Math.min(5, currentScore + 0.3)
                                        : outcome === 'partial'
                                            ? currentScore
                                            : Math.max(1, currentScore - 0.2);
                                    return {
                                        ...i,
                                        usageCount: i.usageCount + 1,
                                        effectivenessScore: newScore,
                                        lastUsedAt: new Date(),
                                    };
                                }
                                return i;
                            });
                            setIntentions(updated);
                            localStorage.setItem(`intentions_${user?.uid}`, JSON.stringify(updated));
                            // TODO: Also log to Firebase 'practice_logs' collection
                            console.log('Practice logged:', { intentionId, newSetting, outcome });
                        }}
                    />
                )}

                {/* Creator Modal */}
                <AnimatePresence>
                    {showCreator && (
                        <IntentionCreator
                            onSave={saveIntention}
                            onCancel={() => setShowCreator(false)}
                        />
                    )}
                </AnimatePresence>

                {/* Reflection Prompt */}
                <AnimatePresence>
                    {reflectionPrompt && (
                        <ReflectionModal
                            prompt={reflectionPrompt}
                            onReflect={(effective) => submitReflection(reflectionPrompt.intentionId, effective)}
                            onDismiss={() => setReflectionPrompt(null)}
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

interface IntentionCardProps {
    intention: IntentionalResponse;
    index: number;
    onUse: () => void;
    onDelete: () => void;
}

const IntentionCard = ({ intention, index, onUse, onDelete }: IntentionCardProps) => {
    const trigger = TRIGGER_OPTIONS.find(t => t.value === intention.triggerCategory);
    const energy = RESPONSE_ENERGIES.find(e => e.value === intention.responseEnergy);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ delay: index * 0.1 }}
            className="glass-panel rounded-[24px] p-5"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{trigger?.emoji}</span>
                    <div>
                        <h3 className="font-semibold text-sm">{trigger?.label}</h3>
                        <p className="text-xs opacity-50">{intention.trigger}</p>
                    </div>
                </div>
                <button
                    onClick={onDelete}
                    className="p-1 rounded-full hover:bg-white/10 opacity-30 hover:opacity-100 transition-all"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div
                className="p-4 rounded-xl mb-4"
                style={{ background: 'rgba(255,255,255,0.05)' }}
            >
                <p className="text-sm italic opacity-80">
                    "I choose <span style={{ color: energy?.color }}>{energy?.label}</span> during {trigger?.label.toLowerCase()}."
                </p>
                <p className="text-sm mt-2 opacity-70">
                    → {intention.chosenResponse}
                </p>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs opacity-50">
                    <span>Used {intention.usageCount}x</span>
                    {intention.effectivenessScore && (
                        <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {intention.effectivenessScore.toFixed(1)}/5
                        </span>
                    )}
                </div>
                <button
                    onClick={onUse}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
                    style={{
                        background: `${energy?.color}30`,
                        color: energy?.color,
                    }}
                >
                    <Check className="w-4 h-4" />
                    Used This
                </button>
            </div>
        </motion.div>
    );
};

interface IntentionCreatorProps {
    onSave: (intention: IntentionalResponse) => void;
    onCancel: () => void;
}

const IntentionCreator = ({ onSave, onCancel }: IntentionCreatorProps) => {
    const [triggerCategory, setTriggerCategory] = useState<TriggerCategory | null>(null);
    const [triggerDescription, setTriggerDescription] = useState('');
    const [responseEnergy, setResponseEnergy] = useState<ResponseEnergy | null>(null);
    const [chosenResponse, setChosenResponse] = useState('');
    const [step, setStep] = useState(1);

    const isComplete = triggerCategory && triggerDescription && responseEnergy && chosenResponse;

    const handleSave = () => {
        if (!isComplete) return;

        onSave({
            id: `intention_${Date.now()}`,
            trigger: triggerDescription,
            triggerCategory: triggerCategory!,
            chosenResponse,
            responseEnergy: responseEnergy!,
            createdAt: new Date(),
            usageCount: 0,
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0, 0, 0, 0.7)' }}
            onClick={(e) => e.target === e.currentTarget && onCancel()}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="w-full max-w-md glass-panel rounded-[32px] p-6 max-h-[80vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-bold text-lg">Create Intention</h2>
                    <button onClick={onCancel} className="p-2 rounded-full hover:bg-white/10">
                        <X className="w-5 h-5 opacity-60" />
                    </button>
                </div>

                {/* Step 1: Select Trigger Category */}
                {step === 1 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <p className="text-sm opacity-60 mb-4">
                            What trigger are you preparing for?
                        </p>
                        <div className="grid grid-cols-2 gap-2 mb-6">
                            {TRIGGER_OPTIONS.map(trigger => (
                                <button
                                    key={trigger.value}
                                    onClick={() => setTriggerCategory(trigger.value)}
                                    className="p-3 rounded-xl text-left transition-all"
                                    style={{
                                        background: triggerCategory === trigger.value
                                            ? 'rgba(139, 92, 246, 0.3)'
                                            : 'rgba(255,255,255,0.05)',
                                        border: triggerCategory === trigger.value
                                            ? '2px solid rgba(139, 92, 246, 0.5)'
                                            : '2px solid transparent',
                                    }}
                                >
                                    <span className="text-lg mr-2">{trigger.emoji}</span>
                                    <span className="text-sm">{trigger.label}</span>
                                </button>
                            ))}
                        </div>
                        <input
                            type="text"
                            value={triggerDescription}
                            onChange={(e) => setTriggerDescription(e.target.value)}
                            placeholder="Describe the specific situation..."
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-sm mb-4"
                        />
                        <button
                            onClick={() => setStep(2)}
                            disabled={!triggerCategory || !triggerDescription}
                            className="w-full py-3 rounded-xl font-medium transition-all"
                            style={{
                                background: triggerCategory && triggerDescription
                                    ? 'rgba(139, 92, 246, 0.6)'
                                    : 'rgba(255,255,255,0.1)',
                                opacity: triggerCategory && triggerDescription ? 1 : 0.5,
                            }}
                        >
                            Next: Choose Your Response
                        </button>
                    </motion.div>
                )}

                {/* Step 2: Select Response Energy */}
                {step === 2 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <p className="text-sm opacity-60 mb-4">
                            What energy do you choose to embody?
                        </p>
                        <div className="space-y-2 mb-6">
                            {RESPONSE_ENERGIES.map(energy => (
                                <button
                                    key={energy.value}
                                    onClick={() => setResponseEnergy(energy.value)}
                                    className="w-full p-4 rounded-xl text-left flex items-center gap-3 transition-all"
                                    style={{
                                        background: responseEnergy === energy.value
                                            ? `${energy.color}30`
                                            : 'rgba(255,255,255,0.05)',
                                        border: responseEnergy === energy.value
                                            ? `2px solid ${energy.color}`
                                            : '2px solid transparent',
                                    }}
                                >
                                    <span style={{ color: energy.color }}>{energy.icon}</span>
                                    <span className="font-medium">{energy.label}</span>
                                </button>
                            ))}
                        </div>
                        <textarea
                            value={chosenResponse}
                            onChange={(e) => setChosenResponse(e.target.value)}
                            placeholder="What will you specifically do? (e.g., 'Take 3 deep breaths, lower my voice, offer a quiet space')"
                            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-sm mb-4 min-h-[100px]"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep(1)}
                                className="flex-1 py-3 rounded-xl font-medium bg-white/10"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!isComplete}
                                className="flex-1 py-3 rounded-xl font-medium transition-all"
                                style={{
                                    background: isComplete
                                        ? 'linear-gradient(145deg, rgba(139, 92, 246, 0.6), rgba(236, 72, 153, 0.6))'
                                        : 'rgba(255,255,255,0.1)',
                                    opacity: isComplete ? 1 : 0.5,
                                }}
                            >
                                Save Intention
                            </button>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </motion.div>
    );
};

interface ReflectionModalProps {
    prompt: ReflectionPrompt;
    onReflect: (effective: boolean) => void;
    onDismiss: () => void;
}

const ReflectionModal = ({ prompt, onReflect, onDismiss }: ReflectionModalProps) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end justify-center p-4"
        style={{ background: 'rgba(0, 0, 0, 0.7)' }}
    >
        <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="w-full max-w-md glass-panel rounded-t-[32px] p-6"
        >
            <div className="flex items-center gap-3 mb-4">
                <div
                    className="p-2 rounded-xl"
                    style={{ background: 'rgba(139, 92, 246, 0.2)' }}
                >
                    <MessageCircle className="w-5 h-5" style={{ color: '#A78BFA' }} />
                </div>
                <h3 className="font-bold">Recursive Feedback</h3>
            </div>

            <p className="text-sm opacity-80 mb-6">{prompt.prompt}</p>

            <div className="flex gap-3 mb-4">
                <button
                    onClick={() => onReflect(true)}
                    className="flex-1 py-4 rounded-xl flex items-center justify-center gap-2 font-medium transition-all"
                    style={{ background: 'rgba(34, 197, 94, 0.2)' }}
                >
                    <ThumbsUp className="w-5 h-5" style={{ color: '#22C55E' }} />
                    <span style={{ color: '#22C55E' }}>Yes, it helped</span>
                </button>
                <button
                    onClick={() => onReflect(false)}
                    className="flex-1 py-4 rounded-xl flex items-center justify-center gap-2 font-medium transition-all"
                    style={{ background: 'rgba(239, 68, 68, 0.2)' }}
                >
                    <RotateCcw className="w-5 h-5" style={{ color: '#EF4444' }} />
                    <span style={{ color: '#EF4444' }}>Try different</span>
                </button>
            </div>

            <button
                onClick={onDismiss}
                className="w-full py-3 text-center text-sm opacity-50"
            >
                Skip for now
            </button>
        </motion.div>
    </motion.div>
);

// ============================================================================
// DAILY PRACTICE PROMPT
// ============================================================================

type PracticeOutcome = 'success' | 'partial' | 'challenge';

interface DailyPracticePromptProps {
    intentions: IntentionalResponse[];
    onSubmit: (intentionId: string, newSetting: string, outcome: PracticeOutcome) => void;
}

const DailyPracticePrompt = ({ intentions, onSubmit }: DailyPracticePromptProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedIntention, setSelectedIntention] = useState<string | null>(null);
    const [newSetting, setNewSetting] = useState('');
    const [outcome, setOutcome] = useState<PracticeOutcome | null>(null);

    const handleSubmit = () => {
        if (!selectedIntention || !newSetting || !outcome) return;
        onSubmit(selectedIntention, newSetting, outcome);
        setIsExpanded(false);
        setSelectedIntention(null);
        setNewSetting('');
        setOutcome(null);
    };

    const selectedIntentionData = intentions.find(i => i.id === selectedIntention);
    const selectedEnergy = selectedIntentionData
        ? RESPONSE_ENERGIES.find(e => e.value === selectedIntentionData.responseEnergy)
        : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-[24px] p-5 mb-6"
            style={{
                background: 'linear-gradient(145deg, rgba(236, 72, 153, 0.1), rgba(139, 92, 246, 0.1))',
                border: '1px solid rgba(236, 72, 153, 0.2)',
            }}
        >
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between"
            >
                <div className="flex items-center gap-3">
                    <div
                        className="p-2 rounded-xl"
                        style={{ background: 'rgba(236, 72, 153, 0.2)' }}
                    >
                        <Sparkles className="w-5 h-5" style={{ color: '#EC4899' }} />
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-sm">Daily Practice</h3>
                        <p className="text-xs opacity-60">
                            How did you practice today?
                        </p>
                    </div>
                </div>
                <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <Plus className="w-5 h-5 opacity-40" />
                </motion.div>
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 space-y-4"
                    >
                        <div
                            className="p-4 rounded-xl text-sm"
                            style={{ background: 'rgba(236, 72, 153, 0.1)' }}
                        >
                            <p className="italic opacity-80">
                                "How did you practice your <strong>Chosen Response</strong> today in a new setting?"
                            </p>
                        </div>

                        {/* Select which intention */}
                        <div>
                            <label className="text-xs opacity-60 mb-2 block">
                                Which response did you practice?
                            </label>
                            <div className="space-y-2">
                                {intentions.slice(0, 3).map(intention => {
                                    const energy = RESPONSE_ENERGIES.find(e => e.value === intention.responseEnergy);
                                    return (
                                        <button
                                            key={intention.id}
                                            onClick={() => setSelectedIntention(intention.id)}
                                            className="w-full p-3 rounded-xl text-left text-sm transition-all"
                                            style={{
                                                background: selectedIntention === intention.id
                                                    ? `${energy?.color}30`
                                                    : 'rgba(255,255,255,0.05)',
                                                border: selectedIntention === intention.id
                                                    ? `2px solid ${energy?.color}`
                                                    : '2px solid transparent',
                                            }}
                                        >
                                            <span style={{ color: energy?.color }}>{energy?.label}</span>
                                            <span className="opacity-60"> for </span>
                                            <span>{intention.trigger}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* New setting input */}
                        <div>
                            <label className="text-xs opacity-60 mb-2 block">
                                What was the new setting?
                            </label>
                            <input
                                type="text"
                                value={newSetting}
                                onChange={(e) => setNewSetting(e.target.value)}
                                placeholder="e.g., At the grocery store, During a phone call..."
                                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-sm"
                            />
                        </div>

                        {/* Outcome */}
                        <div>
                            <label className="text-xs opacity-60 mb-2 block">
                                How did it go?
                            </label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setOutcome('success')}
                                    className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
                                    style={{
                                        background: outcome === 'success'
                                            ? 'rgba(34, 197, 94, 0.3)'
                                            : 'rgba(255,255,255,0.05)',
                                        border: outcome === 'success'
                                            ? '2px solid #22C55E'
                                            : '2px solid transparent',
                                        color: outcome === 'success' ? '#22C55E' : 'inherit',
                                    }}
                                >
                                    ✓ Success
                                </button>
                                <button
                                    onClick={() => setOutcome('partial')}
                                    className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
                                    style={{
                                        background: outcome === 'partial'
                                            ? 'rgba(245, 158, 11, 0.3)'
                                            : 'rgba(255,255,255,0.05)',
                                        border: outcome === 'partial'
                                            ? '2px solid #F59E0B'
                                            : '2px solid transparent',
                                        color: outcome === 'partial' ? '#F59E0B' : 'inherit',
                                    }}
                                >
                                    ◐ Partial
                                </button>
                                <button
                                    onClick={() => setOutcome('challenge')}
                                    className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
                                    style={{
                                        background: outcome === 'challenge'
                                            ? 'rgba(239, 68, 68, 0.3)'
                                            : 'rgba(255,255,255,0.05)',
                                        border: outcome === 'challenge'
                                            ? '2px solid #EF4444'
                                            : '2px solid transparent',
                                        color: outcome === 'challenge' ? '#EF4444' : 'inherit',
                                    }}
                                >
                                    ↻ Challenge
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            onClick={handleSubmit}
                            disabled={!selectedIntention || !newSetting || !outcome}
                            className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                            style={{
                                background: (selectedIntention && newSetting && outcome)
                                    ? `linear-gradient(145deg, ${selectedEnergy?.color || '#EC4899'}99, ${selectedEnergy?.color || '#EC4899'}66)`
                                    : 'rgba(255,255,255,0.1)',
                                opacity: (selectedIntention && newSetting && outcome) ? 1 : 0.5,
                            }}
                        >
                            <Check className="w-4 h-4" />
                            Log Practice
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Intentionality;
