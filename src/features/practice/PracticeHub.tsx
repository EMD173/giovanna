/**
 * PRACTICE HUB: Creative Learning Center
 *
 * A playful space for parents and children to:
 * - Practice skills through role-play games (Playbook)
 * - Build consistency with rhythmic anchors (Mantras)
 * - Prepare for challenging situations through joy
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Gamepad2,
    Anchor,
    ChevronRight,
    Sparkles,
    Star,
    Target,
    Zap,
    BookOpen,
    Loader2,
    ArrowLeft,
} from 'lucide-react';
import { useAuthStore } from '../../core/stores/useAuthStore';
import { getProfile } from '../../core/firebase/profiles';
import type { UserProfile } from '../../core/stores/profileTypes';

// Import practice components
import { Playbook } from './Playbook';
import { Mantras } from './Mantras';

interface PracticeHubProps {
    onNavigate?: (view: string) => void;
}

type PracticeView = 'hub' | 'playbook' | 'mantras';

interface QuickSkillTip {
    title: string;
    description: string;
    icon: typeof Gamepad2;
    color: string;
}

const QUICK_TIPS: QuickSkillTip[] = [
    {
        title: 'Practice Before the Storm',
        description: 'Role-play challenging situations when everyone is calm, not during crisis.',
        icon: Zap,
        color: '#F59E0B',
    },
    {
        title: 'Make It Silly',
        description: 'Laughter releases tension. Exaggerate scenarios to build resilience through joy.',
        icon: Sparkles,
        color: '#EC4899',
    },
    {
        title: 'Repeat, Repeat, Repeat',
        description: 'Consistency builds neural pathways. The 100th time matters as much as the first.',
        icon: Target,
        color: '#8B5CF6',
    },
    {
        title: 'Celebrate Small Wins',
        description: "Every attempt counts. Your child's brain is growing with each practice.",
        icon: Star,
        color: '#10B981',
    },
];

export const PracticeHub = ({ onNavigate: _onNavigate }: PracticeHubProps) => {
    const { user } = useAuthStore();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [currentView, setCurrentView] = useState<PracticeView>('hub');
    const [isLoading, setIsLoading] = useState(true);
    const [activeTipIndex, setActiveTipIndex] = useState(0);

    useEffect(() => {
        loadData();
    }, [user]);

    useEffect(() => {
        // Rotate tips every 8 seconds
        const interval = setInterval(() => {
            setActiveTipIndex((prev) => (prev + 1) % QUICK_TIPS.length);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    const loadData = async () => {
        if (!user) return;
        setIsLoading(true);

        try {
            const userProfile = await getProfile(user.uid);
            setProfile(userProfile);
        } catch (error) {
            console.error('Failed to load practice data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const childName = profile?.childName || 'your child';

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-[#8B5CF6]" />
                <p className="text-sm opacity-60">Preparing the playroom...</p>
            </div>
        );
    }

    // Render sub-views
    if (currentView === 'playbook') {
        return (
            <div className="min-h-screen">
                <button
                    onClick={() => setCurrentView('hub')}
                    className="fixed top-6 left-6 z-50 px-4 py-2 rounded-full bg-white/40 backdrop-blur-md font-semibold text-sm flex items-center gap-2"
                    style={{ color: 'var(--text-primary)' }}
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>
                <Playbook />
            </div>
        );
    }

    if (currentView === 'mantras') {
        return (
            <div className="min-h-screen">
                <button
                    onClick={() => setCurrentView('hub')}
                    className="fixed top-6 left-6 z-50 px-4 py-2 rounded-full bg-white/40 backdrop-blur-md font-semibold text-sm flex items-center gap-2"
                    style={{ color: 'var(--text-primary)' }}
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>
                <Mantras />
            </div>
        );
    }

    const activeTip = QUICK_TIPS[activeTipIndex];
    const TipIcon = activeTip.icon;

    return (
        <div className="flex flex-col space-y-6 pt-8 pb-32 fade-in">
            {/* HEADER */}
            <header className="px-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-bold tracking-widest text-[#8B5CF6] uppercase opacity-80">
                            Learning Through Play
                        </h2>
                        <h1 className="text-3xl font-serif text-[#1A1A1A] mt-1">
                            Practice Space
                        </h1>
                    </div>
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-[#8B5CF6]/20 to-[#EC4899]/20">
                        <Gamepad2 className="w-6 h-6 text-[#8B5CF6]" />
                    </div>
                </div>
                <p className="text-sm opacity-60 mt-2">
                    Build skills with {childName} through joyful practice
                </p>
            </header>

            {/* ROTATING TIP CARD */}
            <div className="px-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTipIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="glass-panel p-5 rounded-[24px] relative overflow-hidden"
                    >
                        <div
                            className="absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full opacity-20"
                            style={{ backgroundColor: activeTip.color }}
                        />

                        <div className="relative z-10 flex items-start gap-4">
                            <div
                                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                                style={{ backgroundColor: `${activeTip.color}20` }}
                            >
                                <TipIcon
                                    className="w-6 h-6"
                                    style={{ color: activeTip.color }}
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-[#1A1A1A] mb-1">
                                    {activeTip.title}
                                </h3>
                                <p className="text-sm text-[#1A1A1A]/60 leading-relaxed">
                                    {activeTip.description}
                                </p>
                            </div>
                        </div>

                        {/* Tip indicators */}
                        <div className="flex justify-center gap-2 mt-4">
                            {QUICK_TIPS.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveTipIndex(i)}
                                    className={`w-2 h-2 rounded-full transition-all ${
                                        i === activeTipIndex
                                            ? 'bg-[#8B5CF6] w-6'
                                            : 'bg-[#1A1A1A]/20'
                                    }`}
                                />
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* PRACTICE TOOLS */}
            <div className="px-4 space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A]/50">
                    Practice Tools
                </h3>

                <button
                    onClick={() => setCurrentView('playbook')}
                    className="w-full glass-panel p-5 rounded-[20px] flex items-center gap-4 text-left hover:scale-[1.01] active:scale-[0.99] transition-transform"
                >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8B5CF6]/20 to-[#8B5CF6]/10 flex items-center justify-center">
                        <Gamepad2 className="w-7 h-7 text-[#8B5CF6]" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-[#1A1A1A]">Playbook</h4>
                        <p className="text-sm text-[#1A1A1A]/60">
                            Role-play games for skill practice
                        </p>
                        <p className="text-xs text-[#8B5CF6] mt-1">
                            Waiting, transitions, asking for help & more
                        </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#1A1A1A]/30" />
                </button>

                <button
                    onClick={() => setCurrentView('mantras')}
                    className="w-full glass-panel p-5 rounded-[20px] flex items-center gap-4 text-left hover:scale-[1.01] active:scale-[0.99] transition-transform"
                >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#10B981]/20 to-[#10B981]/10 flex items-center justify-center">
                        <Anchor className="w-7 h-7 text-[#10B981]" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-[#1A1A1A]">Rhythmic Anchors</h4>
                        <p className="text-sm text-[#1A1A1A]/60">
                            Family mantras for consistency
                        </p>
                        <p className="text-xs text-[#10B981] mt-1">
                            Boundaries, transitions, regulation & repair
                        </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#1A1A1A]/30" />
                </button>
            </div>

            {/* SKILLS OVERVIEW */}
            <div className="px-4 space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A]/50">
                    Skills to Practice
                </h3>

                <div className="grid grid-cols-2 gap-3">
                    <SkillCard
                        title="Waiting"
                        description="Building patience"
                        icon={Target}
                        color="#F59E0B"
                    />
                    <SkillCard
                        title="Transitions"
                        description="Shifting activities"
                        icon={Zap}
                        color="#3B82F6"
                    />
                    <SkillCard
                        title="Asking for Help"
                        description="Using words"
                        icon={BookOpen}
                        color="#10B981"
                    />
                    <SkillCard
                        title="Accepting No"
                        description="Flexible thinking"
                        icon={Anchor}
                        color="#EC4899"
                    />
                </div>
            </div>

            {/* PHILOSOPHY CARD */}
            <div className="px-4">
                <div className="glass-panel p-5 rounded-[20px] bg-gradient-to-br from-[#FEF3C7]/50 to-white/50">
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-xl bg-[#D4AF37]/20">
                            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-[#1A1A1A] mb-1">
                                The Power of Play
                            </h4>
                            <p className="text-sm text-[#1A1A1A]/70 italic leading-relaxed">
                                "Play is the sacred language of childhood. Through play, we
                                practice the impossible until it becomes possible. When we
                                laugh together, we build together."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Skill Card Component
interface SkillCardProps {
    title: string;
    description: string;
    icon: typeof Target;
    color: string;
}

const SkillCard = ({ title, description, icon: Icon, color }: SkillCardProps) => (
    <div className="glass-panel p-4 rounded-[16px]">
        <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-2"
            style={{ backgroundColor: `${color}20` }}
        >
            <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <h4 className="font-semibold text-sm text-[#1A1A1A]">{title}</h4>
        <p className="text-xs text-[#1A1A1A]/50">{description}</p>
    </div>
);

export default PracticeHub;
