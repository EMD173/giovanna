/**
 * WELLNESS HUB: Parent Self-Care Center
 *
 * A sacred space for caregiver wellness combining:
 * - Compassion Mirror: Burnout detection and grounding prompts
 * - Intentionality: Pre-decided responses to triggers
 * - Daily check-ins and self-care tracking
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart,
    Sparkles,
    Moon,
    Sun,
    Wind,
    Target,
    Brain,
    Flame,
    ChevronRight,
    TrendingUp,
    TrendingDown,
    Minus,
    Coffee,
    Loader2,
    Check,
} from 'lucide-react';
import { useAuthStore } from '../../core/stores/useAuthStore';
import { getProfile } from '../../core/firebase/profiles';
import type { UserProfile } from '../../core/stores/profileTypes';

// Import wellness components
import { CompassionMirror } from './CompassionMirror';
import { Intentionality } from './Intentionality';

interface WellnessHubProps {
    onNavigate?: (view: string) => void;
}

type WellnessView = 'hub' | 'compassion' | 'intentionality';

interface SelfCareCheck {
    id: string;
    label: string;
    icon: typeof Heart;
    checked: boolean;
    category: 'physical' | 'emotional' | 'social';
}

const DEFAULT_SELF_CARE_CHECKS: Omit<SelfCareCheck, 'checked'>[] = [
    { id: 'water', label: 'Drank water', icon: Coffee, category: 'physical' },
    { id: 'food', label: 'Ate something', icon: Flame, category: 'physical' },
    { id: 'movement', label: 'Moved my body', icon: Wind, category: 'physical' },
    { id: 'outside', label: 'Went outside', icon: Sun, category: 'physical' },
    { id: 'breath', label: 'Took deep breaths', icon: Wind, category: 'emotional' },
    { id: 'boundary', label: 'Set a boundary', icon: Target, category: 'emotional' },
    { id: 'joy', label: 'Did something for joy', icon: Sparkles, category: 'emotional' },
    { id: 'connection', label: 'Connected with someone', icon: Heart, category: 'social' },
];

export const WellnessHub = ({ onNavigate: _onNavigate }: WellnessHubProps) => {
    const { user } = useAuthStore();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [currentView, setCurrentView] = useState<WellnessView>('hub');
    const [isLoading, setIsLoading] = useState(true);

    // Daily check-in state
    const [selfCareChecks, setSelfCareChecks] = useState<SelfCareCheck[]>([]);
    const [energyLevel, setEnergyLevel] = useState<number | null>(null);
    const [moodNote, setMoodNote] = useState('');
    const [showCheckInComplete, setShowCheckInComplete] = useState(false);

    // Wellness metrics (would come from Firestore in production)
    const [metrics] = useState({
        lifeForceRatio: 2.1,
        trend: 'improving' as 'improving' | 'stable' | 'declining',
        intentionsSet: 8,
        intentionsUsed: 5,
        strengthNarratives: 24,
        stressEvents: 12,
        lastCheckIn: new Date(Date.now() - 86400000), // 1 day ago
    });

    useEffect(() => {
        loadData();
    }, [user]);

    const loadData = async () => {
        if (!user) return;
        setIsLoading(true);

        try {
            const userProfile = await getProfile(user.uid);
            setProfile(userProfile);

            // Initialize self-care checks
            const checks = DEFAULT_SELF_CARE_CHECKS.map((c) => ({
                ...c,
                checked: false,
            }));
            setSelfCareChecks(checks);
        } catch (error) {
            console.error('Failed to load wellness data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleCheck = (id: string) => {
        setSelfCareChecks((prev) =>
            prev.map((c) => (c.id === id ? { ...c, checked: !c.checked } : c))
        );
    };

    const handleCheckInComplete = () => {
        setShowCheckInComplete(true);
        setTimeout(() => setShowCheckInComplete(false), 3000);
        // In production, save to Firestore
    };

    const parentName = profile?.parent?.title || 'Beloved';
    const completedChecks = selfCareChecks.filter((c) => c.checked).length;

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-[#EC4899]" />
                <p className="text-sm opacity-60">Creating your sanctuary...</p>
            </div>
        );
    }

    // Render sub-views
    if (currentView === 'compassion') {
        return (
            <div className="min-h-screen">
                <button
                    onClick={() => setCurrentView('hub')}
                    className="fixed top-6 left-6 z-50 px-4 py-2 rounded-full bg-white/40 backdrop-blur-md font-semibold text-sm"
                    style={{ color: 'var(--text-primary)' }}
                >
                    ← Back
                </button>
                <CompassionMirror
                    parentName={parentName}
                    onComplete={() => setCurrentView('hub')}
                />
            </div>
        );
    }

    if (currentView === 'intentionality') {
        return (
            <div className="min-h-screen">
                <button
                    onClick={() => setCurrentView('hub')}
                    className="fixed top-6 left-6 z-50 px-4 py-2 rounded-full bg-white/40 backdrop-blur-md font-semibold text-sm"
                    style={{ color: 'var(--text-primary)' }}
                >
                    ← Back
                </button>
                <Intentionality />
            </div>
        );
    }

    return (
        <div className="flex flex-col space-y-6 pt-8 pb-32 fade-in">
            {/* HEADER */}
            <header className="px-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-bold tracking-widest text-[#EC4899] uppercase opacity-80">
                            Sacred Space
                        </h2>
                        <h1 className="text-3xl font-serif text-[#1A1A1A] mt-1">
                            Caregiver Wellness
                        </h1>
                    </div>
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-[#EC4899]/20 to-[#8B5CF6]/20">
                        <Heart className="w-6 h-6 text-[#EC4899]" />
                    </div>
                </div>
                <p className="text-sm opacity-60 mt-2">
                    Tend to yourself, {parentName}. You matter too.
                </p>
            </header>

            {/* LIFE FORCE INDICATOR */}
            <div className="px-4">
                <div className="glass-panel p-5 rounded-[24px] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#EC4899]/20 to-transparent blur-2xl rounded-full" />

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Flame className="w-5 h-5 text-[#EC4899]" />
                                <span className="font-semibold text-[#1A1A1A]">
                                    Life Force Preserved
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                {metrics.trend === 'improving' ? (
                                    <TrendingUp className="w-4 h-4 text-green-500" />
                                ) : metrics.trend === 'declining' ? (
                                    <TrendingDown className="w-4 h-4 text-red-500" />
                                ) : (
                                    <Minus className="w-4 h-4 text-gray-400" />
                                )}
                                <span className="text-xs text-[#1A1A1A]/50">
                                    {metrics.trend}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-end gap-3 mb-3">
                            <span className="text-4xl font-bold text-[#1A1A1A]">
                                {metrics.lifeForceRatio.toFixed(1)}
                            </span>
                            <span className="text-sm text-[#1A1A1A]/50 mb-1">ratio</span>
                        </div>

                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full rounded-full bg-gradient-to-r from-[#EC4899] to-[#8B5CF6]"
                                initial={{ width: 0 }}
                                animate={{
                                    width: `${Math.min(100, (metrics.lifeForceRatio / 3) * 100)}%`,
                                }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                            />
                        </div>

                        <div className="flex justify-between mt-2 text-xs text-[#1A1A1A]/50">
                            <span>{metrics.strengthNarratives} strengths captured</span>
                            <span>{metrics.stressEvents} stress events</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* WELLNESS TOOLS */}
            <div className="px-4 space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A]/50">
                    Wellness Tools
                </h3>

                <button
                    onClick={() => setCurrentView('compassion')}
                    className="w-full glass-panel p-5 rounded-[20px] flex items-center gap-4 text-left hover:scale-[1.01] active:scale-[0.99] transition-transform"
                >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#EC4899]/20 to-[#EC4899]/10 flex items-center justify-center">
                        <Heart className="w-7 h-7 text-[#EC4899]" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-[#1A1A1A]">Compassion Mirror</h4>
                        <p className="text-sm text-[#1A1A1A]/60">
                            Burnout detection & grounding prompts
                        </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#1A1A1A]/30" />
                </button>

                <button
                    onClick={() => setCurrentView('intentionality')}
                    className="w-full glass-panel p-5 rounded-[20px] flex items-center gap-4 text-left hover:scale-[1.01] active:scale-[0.99] transition-transform"
                >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8B5CF6]/20 to-[#8B5CF6]/10 flex items-center justify-center">
                        <Target className="w-7 h-7 text-[#8B5CF6]" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-[#1A1A1A]">Intentionality</h4>
                        <p className="text-sm text-[#1A1A1A]/60">
                            Pre-decide responses to triggers
                        </p>
                        <p className="text-xs text-[#8B5CF6] mt-1">
                            {metrics.intentionsUsed}/{metrics.intentionsSet} intentions used
                        </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#1A1A1A]/30" />
                </button>
            </div>

            {/* DAILY CHECK-IN */}
            <div className="px-4 space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A]/50">
                        Daily Check-In
                    </h3>
                    <span className="text-xs text-[#1A1A1A]/40">
                        {completedChecks}/{selfCareChecks.length} completed
                    </span>
                </div>

                <div className="glass-panel p-5 rounded-[20px]">
                    {/* Energy Level */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-[#1A1A1A]/70 mb-3">
                            How's your energy today?
                        </label>
                        <div className="flex justify-between">
                            {[1, 2, 3, 4, 5].map((level) => (
                                <button
                                    key={level}
                                    onClick={() => setEnergyLevel(level)}
                                    className={`w-12 h-12 rounded-xl transition-all ${
                                        energyLevel === level
                                            ? 'bg-gradient-to-br from-[#EC4899] to-[#8B5CF6] text-white scale-110'
                                            : 'bg-gray-100 text-[#1A1A1A]/60 hover:bg-gray-200'
                                    }`}
                                >
                                    {level === 1 ? (
                                        <Moon className="w-5 h-5 mx-auto" />
                                    ) : level === 5 ? (
                                        <Sun className="w-5 h-5 mx-auto" />
                                    ) : (
                                        <span className="font-semibold">{level}</span>
                                    )}
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-[#1A1A1A]/40">
                            <span>Depleted</span>
                            <span>Energized</span>
                        </div>
                    </div>

                    {/* Self-Care Checklist */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-[#1A1A1A]/70 mb-3">
                            Self-care check
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {selfCareChecks.map((check) => (
                                <button
                                    key={check.id}
                                    onClick={() => toggleCheck(check.id)}
                                    className={`flex items-center gap-2 p-3 rounded-xl text-left transition-all ${
                                        check.checked
                                            ? 'bg-green-50 border-green-200 border'
                                            : 'bg-gray-50 border border-transparent'
                                    }`}
                                >
                                    <div
                                        className={`w-5 h-5 rounded flex items-center justify-center transition-all ${
                                            check.checked
                                                ? 'bg-green-500 text-white'
                                                : 'border border-[#1A1A1A]/20'
                                        }`}
                                    >
                                        {check.checked && <Check className="w-3 h-3" />}
                                    </div>
                                    <span
                                        className={`text-sm ${
                                            check.checked
                                                ? 'text-green-700'
                                                : 'text-[#1A1A1A]/60'
                                        }`}
                                    >
                                        {check.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Mood Note */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-[#1A1A1A]/70 mb-2">
                            Anything on your heart? (optional)
                        </label>
                        <textarea
                            value={moodNote}
                            onChange={(e) => setMoodNote(e.target.value)}
                            placeholder="A thought, a feeling, a hope..."
                            rows={2}
                            className="w-full px-4 py-3 rounded-xl border border-[#1A1A1A]/10 focus:border-[#EC4899] focus:ring-1 focus:ring-[#EC4899] outline-none resize-none text-sm"
                        />
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleCheckInComplete}
                        disabled={energyLevel === null}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] text-white font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <Check className="w-5 h-5" />
                        Complete Check-In
                    </button>
                </div>
            </div>

            {/* WISDOM CARD */}
            <div className="px-4">
                <div className="glass-panel p-5 rounded-[20px] bg-gradient-to-br from-[#FEF3C7]/50 to-white/50">
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-xl bg-[#D4AF37]/20">
                            <Brain className="w-5 h-5 text-[#D4AF37]" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-[#1A1A1A] mb-1">
                                Today's Wisdom
                            </h4>
                            <p className="text-sm text-[#1A1A1A]/70 italic leading-relaxed">
                                "Rest is not earned. It is biologically necessary. The system
                                that made you feel guilty for resting is the one that needs to
                                change, not you."
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Check-in Complete Toast */}
            <AnimatePresence>
                {showCheckInComplete && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-24 left-4 right-4 bg-green-500 text-white p-4 rounded-2xl flex items-center gap-3 shadow-lg"
                    >
                        <Check className="w-6 h-6" />
                        <span className="font-semibold">
                            Check-in complete. You're seen, {parentName}.
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default WellnessHub;
