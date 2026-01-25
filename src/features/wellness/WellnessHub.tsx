/**
 * WELLNESS HUB
 * 
 * Comprehensive wellness tracking for both caregiver and child.
 * 
 * Features:
 * - Caregiver wellness check-ins
 * - Burnout risk assessment
 * - Sleep, stress, energy tracking
 * - Self-care goal setting
 * - Gratitude journaling
 * - Connection with resources
 */

import { useState, useEffect } from 'react';
import {
    ArrowLeft,
    Heart,
    Sun,
    Moon,
    Battery,
    Zap,
    Coffee,
    Users,
    Check,
    TrendingUp,
    Calendar,
    Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../../core/stores/useAuthStore';
import { getProfile } from '../../core/firebase/profiles';

// ============================================================================
// TYPES
// ============================================================================

type WellnessCategory = 'sleep' | 'energy' | 'stress' | 'connection' | 'selfcare';
type MoodLevel = 1 | 2 | 3 | 4 | 5;

interface WellnessCheckIn {
    id: string;
    date: Date;
    sleep: MoodLevel;
    energy: MoodLevel;
    stress: MoodLevel;      // Inverse: 5 = low stress (good)
    connection: MoodLevel;
    selfcare: MoodLevel;
    gratitude: string;
    wins: string;
    notes: string;
}

interface WellnessGoal {
    id: string;
    category: WellnessCategory;
    description: string;
    frequency: 'daily' | 'weekly';
    completedDates: string[];    // ISO date strings
    createdAt: Date;
}

interface BurnoutIndicator {
    level: 'low' | 'moderate' | 'high' | 'critical';
    score: number;
    message: string;
    suggestions: string[];
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const WELLNESS_CATEGORIES: Record<WellnessCategory, {
    label: string;
    emoji: string;
    icon: typeof Heart;
    color: string;
    question: string;
    lowLabel: string;
    highLabel: string;
}> = {
    sleep: {
        label: 'Sleep Quality',
        emoji: '😴',
        icon: Moon,
        color: '#7C3AED',
        question: 'How was your sleep last night?',
        lowLabel: 'Rough night',
        highLabel: 'Restful',
    },
    energy: {
        label: 'Energy Level',
        emoji: '⚡',
        icon: Zap,
        color: '#F59E0B',
        question: 'How is your energy today?',
        lowLabel: 'Depleted',
        highLabel: 'Energized',
    },
    stress: {
        label: 'Stress Level',
        emoji: '🧘',
        icon: Battery,
        color: '#16A34A',
        question: 'How manageable does today feel?',
        lowLabel: 'Overwhelmed',
        highLabel: 'Calm',
    },
    connection: {
        label: 'Connection',
        emoji: '💞',
        icon: Users,
        color: '#EC4899',
        question: 'How connected do you feel to others?',
        lowLabel: 'Isolated',
        highLabel: 'Supported',
    },
    selfcare: {
        label: 'Self-Care',
        emoji: '🌸',
        icon: Sun,
        color: '#0EA5E9',
        question: 'Have you done something for yourself?',
        lowLabel: 'Neglected',
        highLabel: 'Nourished',
    },
};

const SELF_CARE_IDEAS: Record<WellnessCategory, string[]> = {
    sleep: [
        'Set a "wind down" alarm 30 min before bed',
        'Put your phone in another room',
        'Take a warm shower before bed',
        'Try a 5-minute sleep meditation',
        'Use white noise or nature sounds',
    ],
    energy: [
        'Take a 10-minute walk outside',
        'Do 5 minutes of stretching',
        'Have a healthy snack',
        'Take 3 deep breaths by a window',
        'Listen to an upbeat song',
    ],
    stress: [
        'Practice box breathing (4-4-4-4)',
        'Write down 3 things you can control',
        'Do a body scan meditation',
        'Step outside for fresh air',
        'Let go of one non-essential task today',
    ],
    connection: [
        'Text a friend you haven\'t talked to recently',
        'Schedule a virtual coffee date',
        'Join an online parent group briefly',
        'Share a meme or funny thing with someone',
        'Ask for help with one small thing',
    ],
    selfcare: [
        'Take 5 minutes to do nothing',
        'Enjoy a hot beverage mindfully',
        'Read one page of something for pleasure',
        'Apply lotion or do a mini skincare routine',
        'Listen to a favorite song with headphones',
    ],
};

// ============================================================================
// COMPONENT
// ============================================================================

interface WellnessHubProps {
    onBack: () => void;
}

export const WellnessHub = ({ onBack }: WellnessHubProps) => {
    const { user } = useAuthStore();
    const [personalization, setPersonalization] = useState('');
    const [checkIns, setCheckIns] = useState<WellnessCheckIn[]>([]);
    const [goals, setGoals] = useState<WellnessGoal[]>([]);
    const [showCheckIn, setShowCheckIn] = useState(false);
    const [showGoals, setShowGoals] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    
    // Load data
    useEffect(() => {
        if (user) {
            getProfile(user.uid).then(profile => {
                if (profile?.childName) setPersonalization(`${profile.childName}'s caregiver`);
            });
            
            // Load from localStorage
            const storedCheckIns = localStorage.getItem(`giovanna-wellness-${user.uid}`);
            if (storedCheckIns) {
                try {
                    const parsed = JSON.parse(storedCheckIns);
                    setCheckIns(parsed.map((c: WellnessCheckIn) => ({
                        ...c,
                        date: new Date(c.date),
                    })));
                } catch (e) {
                    console.error('Failed to load wellness data:', e);
                }
            }
            
            const storedGoals = localStorage.getItem(`giovanna-wellness-goals-${user.uid}`);
            if (storedGoals) {
                try {
                    const parsed = JSON.parse(storedGoals);
                    setGoals(parsed.map((g: WellnessGoal) => ({
                        ...g,
                        createdAt: new Date(g.createdAt),
                    })));
                } catch (e) {
                    console.error('Failed to load wellness goals:', e);
                }
            }
        }
    }, [user]);
    
    // Save check-ins
    useEffect(() => {
        if (user && checkIns.length > 0) {
            localStorage.setItem(`giovanna-wellness-${user.uid}`, JSON.stringify(checkIns));
        }
    }, [checkIns, user]);
    
    // Save goals
    useEffect(() => {
        if (user && goals.length > 0) {
            localStorage.setItem(`giovanna-wellness-goals-${user.uid}`, JSON.stringify(goals));
        }
    }, [goals, user]);
    
    // Calculate burnout risk
    const calculateBurnoutRisk = (): BurnoutIndicator => {
        if (checkIns.length === 0) {
            return {
                level: 'low',
                score: 0,
                message: 'Start tracking to understand your wellness patterns',
                suggestions: ['Complete your first check-in to get started'],
            };
        }
        
        // Use last 7 check-ins
        const recent = checkIns.slice(-7);
        const avgScore = recent.reduce((sum, c) => {
            return sum + (c.sleep + c.energy + c.stress + c.connection + c.selfcare) / 5;
        }, 0) / recent.length;
        
        if (avgScore >= 4) {
            return {
                level: 'low',
                score: avgScore,
                message: 'You\'re doing great! Keep up the self-care.',
                suggestions: ['Maintain your current routines', 'Share your strategies with other caregivers'],
            };
        } else if (avgScore >= 3) {
            return {
                level: 'moderate',
                score: avgScore,
                message: 'You\'re managing, but watch for signs of fatigue.',
                suggestions: ['Add one small self-care activity this week', 'Consider asking for help with one task'],
            };
        } else if (avgScore >= 2) {
            return {
                level: 'high',
                score: avgScore,
                message: 'Your well-being needs attention. Be gentle with yourself.',
                suggestions: ['Prioritize sleep tonight', 'Reach out to someone who understands', 'Consider respite care'],
            };
        } else {
            return {
                level: 'critical',
                score: avgScore,
                message: 'You need support right now. You can\'t pour from an empty cup.',
                suggestions: ['Contact a trusted person today', 'Seek respite care immediately', 'Talk to your doctor about caregiver burnout'],
            };
        }
    };
    
    // Check-in today?
    const hasCheckedInToday = checkIns.some(
        c => c.date.toDateString() === new Date().toDateString()
    );
    
    // Save new check-in
    const saveCheckIn = (checkIn: Omit<WellnessCheckIn, 'id' | 'date'>) => {
        const newCheckIn: WellnessCheckIn = {
            ...checkIn,
            id: `wellness-${Date.now()}`,
            date: new Date(),
        };
        setCheckIns(prev => [...prev, newCheckIn]);
        setShowCheckIn(false);
    };
    
    // Add goal
    const addGoal = (goal: Omit<WellnessGoal, 'id' | 'completedDates' | 'createdAt'>) => {
        const newGoal: WellnessGoal = {
            ...goal,
            id: `goal-${Date.now()}`,
            completedDates: [],
            createdAt: new Date(),
        };
        setGoals(prev => [...prev, newGoal]);
    };
    
    // Toggle goal completion
    const toggleGoalCompletion = (goalId: string) => {
        const today = new Date().toISOString().split('T')[0];
        setGoals(prev => prev.map(g => {
            if (g.id !== goalId) return g;
            const isCompleted = g.completedDates.includes(today);
            return {
                ...g,
                completedDates: isCompleted
                    ? g.completedDates.filter(d => d !== today)
                    : [...g.completedDates, today],
            };
        }));
    };
    
    const burnoutRisk = calculateBurnoutRisk();
    
    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-500">Please sign in to access Wellness Hub</p>
            </div>
        );
    }
    
    // Sub-views
    if (showCheckIn) {
        return <CheckInView onBack={() => setShowCheckIn(false)} onSave={saveCheckIn} />;
    }
    
    if (showGoals) {
        return (
            <GoalsView 
                goals={goals} 
                onBack={() => setShowGoals(false)} 
                onAddGoal={addGoal}
                onToggleComplete={toggleGoalCompletion}
            />
        );
    }
    
    if (showHistory) {
        return <HistoryView checkIns={checkIns} onBack={() => setShowHistory(false)} />;
    }
    
    return (
        <div className="flex flex-col h-full pt-6 pb-32 px-4 fade-in overflow-y-auto">
            {/* Header */}
            <header className="flex items-center gap-3 mb-6">
                <button 
                    onClick={onBack}
                    className="p-2 rounded-full bg-white/40 hover:bg-white/60 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-[#4B0082]" />
                </button>
                <div className="flex-1">
                    <h1 
                        className="text-2xl font-bold"
                        style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                    >
                        Wellness Hub
                    </h1>
                    <p className="text-sm opacity-70">
                        {personalization ? `Dear ${personalization}, you matter too` : 'Your well-being matters'}
                    </p>
                </div>
            </header>
            
            {/* Burnout Risk Card */}
            <div 
                className={`glass-panel p-4 rounded-2xl mb-6 ${
                    burnoutRisk.level === 'critical' ? 'border-2 border-red-400 bg-red-50' :
                    burnoutRisk.level === 'high' ? 'border border-orange-300 bg-orange-50' :
                    ''
                }`}
            >
                <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        burnoutRisk.level === 'low' ? 'bg-green-100' :
                        burnoutRisk.level === 'moderate' ? 'bg-yellow-100' :
                        burnoutRisk.level === 'high' ? 'bg-orange-100' :
                        'bg-red-100'
                    }`}>
                        <Heart className={`w-6 h-6 ${
                            burnoutRisk.level === 'low' ? 'text-green-600' :
                            burnoutRisk.level === 'moderate' ? 'text-yellow-600' :
                            burnoutRisk.level === 'high' ? 'text-orange-600' :
                            'text-red-600'
                        }`} />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm opacity-70">Wellness Status</p>
                        <h3 className="font-bold capitalize" style={{ color: 'var(--text-primary)' }}>
                            {burnoutRisk.level === 'low' ? 'Thriving' :
                             burnoutRisk.level === 'moderate' ? 'Managing' :
                             burnoutRisk.level === 'high' ? 'Needs Care' :
                             'Needs Support'}
                        </h3>
                    </div>
                </div>
                <p className="text-sm opacity-80 mb-3">{burnoutRisk.message}</p>
                <div className="space-y-1">
                    {burnoutRisk.suggestions.map((suggestion, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs opacity-70">
                            <Sparkles className="w-3 h-3 mt-0.5 text-[#D4AF37]" />
                            {suggestion}
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Quick Check-in Button */}
            {!hasCheckedInToday && (
                <button
                    onClick={() => setShowCheckIn(true)}
                    className="glass-panel p-4 rounded-2xl mb-4 w-full text-left gold-leaf-border hover:scale-[1.01] transition-transform"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center">
                            <Sun className="w-6 h-6 text-[#D4AF37]" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                                Daily Check-In
                            </h3>
                            <p className="text-xs opacity-60">How are YOU doing today? (2 min)</p>
                        </div>
                        <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                </button>
            )}
            
            {hasCheckedInToday && (
                <div className="glass-panel p-4 rounded-2xl mb-4 bg-green-50 border border-green-200">
                    <div className="flex items-center gap-3">
                        <Check className="w-6 h-6 text-green-600" />
                        <div>
                            <p className="font-bold text-green-800 text-sm">Today's Check-In Complete</p>
                            <p className="text-xs text-green-600">Way to prioritize yourself! ✨</p>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Action Cards */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                    onClick={() => setShowGoals(true)}
                    className="glass-panel p-4 rounded-2xl text-left hover:scale-[1.02] active:scale-[0.98] transition-transform"
                >
                    <div className="w-10 h-10 rounded-xl bg-[#EC4899]/20 flex items-center justify-center mb-2">
                        <TrendingUp className="w-5 h-5 text-[#EC4899]" />
                    </div>
                    <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                        Self-Care Goals
                    </p>
                    <p className="text-xs opacity-60">{goals.length} active</p>
                </button>
                
                <button
                    onClick={() => setShowHistory(true)}
                    className="glass-panel p-4 rounded-2xl text-left hover:scale-[1.02] active:scale-[0.98] transition-transform"
                >
                    <div className="w-10 h-10 rounded-xl bg-[#0EA5E9]/20 flex items-center justify-center mb-2">
                        <Calendar className="w-5 h-5 text-[#0EA5E9]" />
                    </div>
                    <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                        History
                    </p>
                    <p className="text-xs opacity-60">{checkIns.length} check-ins</p>
                </button>
            </div>
            
            {/* Today's Self-Care Suggestions */}
            <div className="mb-6">
                <h2 className="text-sm font-bold opacity-70 mb-3">Today's Self-Care Ideas</h2>
                <div className="space-y-2">
                    {Object.entries(SELF_CARE_IDEAS).slice(0, 3).map(([category, ideas]) => {
                        const config = WELLNESS_CATEGORIES[category as WellnessCategory];
                        // Use first idea for consistent renders
                        const idea = ideas[0];
                        return (
                            <div 
                                key={category}
                                className="glass-panel p-3 rounded-xl flex items-center gap-3"
                            >
                                <span className="text-xl">{config.emoji}</span>
                                <div className="flex-1">
                                    <p className="text-xs opacity-50">{config.label}</p>
                                    <p className="text-sm">{idea}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            {/* Caregiver Affirmation */}
            <div className="glass-panel p-4 rounded-2xl bg-[#4B0082]/5 border border-[#4B0082]/10">
                <p className="text-center text-sm italic opacity-80">
                    "Caring for yourself is not self-indulgence, it is self-preservation."
                </p>
                <p className="text-center text-xs opacity-50 mt-1">— Audre Lorde</p>
            </div>
        </div>
    );
};

// ============================================================================
// CHECK-IN VIEW
// ============================================================================

const CheckInView = ({
    onBack,
    onSave,
}: {
    onBack: () => void;
    onSave: (checkIn: Omit<WellnessCheckIn, 'id' | 'date'>) => void;
}) => {
    const [step, setStep] = useState(0);
    const [scores, setScores] = useState({
        sleep: 3 as MoodLevel,
        energy: 3 as MoodLevel,
        stress: 3 as MoodLevel,
        connection: 3 as MoodLevel,
        selfcare: 3 as MoodLevel,
    });
    const [gratitude, setGratitude] = useState('');
    const [wins, setWins] = useState('');
    const [notes, setNotes] = useState('');
    
    const categories = Object.keys(WELLNESS_CATEGORIES) as WellnessCategory[];
    const isRating = step < categories.length;
    const currentCategory = categories[step];
    const config = WELLNESS_CATEGORIES[currentCategory];
    
    const handleRating = (score: MoodLevel) => {
        setScores(prev => ({ ...prev, [currentCategory]: score }));
        setTimeout(() => setStep(step + 1), 300);
    };
    
    const handleSubmit = () => {
        onSave({
            ...scores,
            gratitude,
            wins,
            notes,
        });
    };
    
    if (isRating) {
        return (
            <div className="flex flex-col h-full pt-6 pb-32 px-4 fade-in">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-sm text-[#4B0082] hover:opacity-70 mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>
                
                {/* Progress */}
                <div className="flex gap-1 mb-8">
                    {categories.map((_, i) => (
                        <div 
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all ${
                                i <= step ? 'bg-[#4B0082]' : 'bg-gray-200'
                            }`}
                        />
                    ))}
                </div>
                
                {/* Question */}
                <div className="text-center mb-8">
                    <span className="text-5xl mb-4 block">{config.emoji}</span>
                    <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                        {config.question}
                    </h2>
                    <p className="text-sm opacity-60">{config.label}</p>
                </div>
                
                {/* Rating Scale */}
                <div className="flex justify-between items-center px-4 mb-4">
                    <span className="text-xs opacity-60">{config.lowLabel}</span>
                    <span className="text-xs opacity-60">{config.highLabel}</span>
                </div>
                
                <div className="flex justify-center gap-3">
                    {([1, 2, 3, 4, 5] as MoodLevel[]).map(score => (
                        <button
                            key={score}
                            onClick={() => handleRating(score)}
                            className={`w-14 h-14 rounded-full text-xl font-bold transition-all ${
                                scores[currentCategory] === score
                                    ? 'bg-[#4B0082] text-white scale-110'
                                    : 'bg-white/60 hover:bg-white/80'
                            }`}
                            style={scores[currentCategory] === score ? {} : { color: config.color }}
                        >
                            {score}
                        </button>
                    ))}
                </div>
            </div>
        );
    }
    
    // Reflection step
    return (
        <div className="flex flex-col h-full pt-6 pb-32 px-4 fade-in overflow-y-auto">
            <button
                onClick={() => setStep(categories.length - 1)}
                className="flex items-center gap-2 text-sm text-[#4B0082] hover:opacity-70 mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back
            </button>
            
            <h2 className="text-xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                A Moment of Reflection ✨
            </h2>
            
            <div className="space-y-4">
                <div className="glass-panel p-4 rounded-xl">
                    <label className="text-sm font-bold mb-2 block">
                        What are you grateful for today? 🙏
                    </label>
                    <textarea
                        value={gratitude}
                        onChange={(e) => setGratitude(e.target.value)}
                        placeholder="Even small things count..."
                        className="w-full p-3 rounded-xl bg-white/50 border border-white/50 focus:ring-2 focus:ring-[#4B0082] outline-none resize-none text-sm"
                        rows={2}
                    />
                </div>
                
                <div className="glass-panel p-4 rounded-xl">
                    <label className="text-sm font-bold mb-2 block">
                        Any small wins? 🌟
                    </label>
                    <textarea
                        value={wins}
                        onChange={(e) => setWins(e.target.value)}
                        placeholder="Something you're proud of, even tiny..."
                        className="w-full p-3 rounded-xl bg-white/50 border border-white/50 focus:ring-2 focus:ring-[#4B0082] outline-none resize-none text-sm"
                        rows={2}
                    />
                </div>
                
                <div className="glass-panel p-4 rounded-xl">
                    <label className="text-sm font-bold mb-2 block">
                        Anything else on your mind? 💭
                    </label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Optional - just a space to release..."
                        className="w-full p-3 rounded-xl bg-white/50 border border-white/50 focus:ring-2 focus:ring-[#4B0082] outline-none resize-none text-sm"
                        rows={2}
                    />
                </div>
            </div>
            
            <button
                onClick={handleSubmit}
                className="mt-6 w-full py-4 rounded-xl bg-[#4B0082] text-white font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
                <Heart className="w-5 h-5" />
                Complete Check-In
            </button>
        </div>
    );
};

// ============================================================================
// GOALS VIEW
// ============================================================================

const GoalsView = ({
    goals,
    onBack,
    onAddGoal,
    onToggleComplete,
}: {
    goals: WellnessGoal[];
    onBack: () => void;
    onAddGoal: (goal: Omit<WellnessGoal, 'id' | 'completedDates' | 'createdAt'>) => void;
    onToggleComplete: (goalId: string) => void;
}) => {
    const [showAdd, setShowAdd] = useState(false);
    const [newGoal, setNewGoal] = useState({
        category: 'selfcare' as WellnessCategory,
        description: '',
        frequency: 'daily' as const,
    });
    
    const today = new Date().toISOString().split('T')[0];
    
    const handleAdd = () => {
        if (!newGoal.description.trim()) return;
        onAddGoal(newGoal);
        setNewGoal({ category: 'selfcare', description: '', frequency: 'daily' });
        setShowAdd(false);
    };
    
    return (
        <div className="flex flex-col h-full pt-6 pb-32 px-4 fade-in overflow-y-auto">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-sm text-[#4B0082] hover:opacity-70 mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Wellness Hub
            </button>
            
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                    Self-Care Goals
                </h1>
                <button
                    onClick={() => setShowAdd(true)}
                    className="px-3 py-2 rounded-xl bg-[#4B0082] text-white text-sm font-medium"
                >
                    + Add Goal
                </button>
            </div>
            
            {goals.length === 0 && !showAdd && (
                <div className="glass-panel p-6 rounded-2xl text-center">
                    <Coffee className="w-12 h-12 mx-auto mb-3 text-[#D4AF37] opacity-50" />
                    <p className="font-bold mb-2">No goals yet</p>
                    <p className="text-sm opacity-60">Set small, achievable self-care goals</p>
                </div>
            )}
            
            {/* Add Goal Form */}
            {showAdd && (
                <div className="glass-panel p-4 rounded-2xl mb-4">
                    <h3 className="font-bold mb-3">New Self-Care Goal</h3>
                    
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs font-bold opacity-70 mb-1 block">Category</label>
                            <div className="flex flex-wrap gap-2">
                                {(Object.keys(WELLNESS_CATEGORIES) as WellnessCategory[]).map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setNewGoal(prev => ({ ...prev, category: cat }))}
                                        className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                                            newGoal.category === cat
                                                ? 'bg-[#4B0082] text-white'
                                                : 'bg-white/40 hover:bg-white/60'
                                        }`}
                                    >
                                        {WELLNESS_CATEGORIES[cat].emoji} {WELLNESS_CATEGORIES[cat].label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <div>
                            <label className="text-xs font-bold opacity-70 mb-1 block">Goal</label>
                            <input
                                type="text"
                                value={newGoal.description}
                                onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="e.g., Take 5 minutes to sit quietly"
                                className="w-full p-3 rounded-xl bg-white/50 border border-white/50 focus:ring-2 focus:ring-[#4B0082] outline-none text-sm"
                            />
                        </div>
                        
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowAdd(false)}
                                className="flex-1 py-2 rounded-xl bg-gray-200 font-medium text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAdd}
                                className="flex-1 py-2 rounded-xl bg-[#4B0082] text-white font-medium text-sm"
                            >
                                Add Goal
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Goals List */}
            <div className="space-y-2">
                {goals.map(goal => {
                    const isCompletedToday = goal.completedDates.includes(today);
                    const config = WELLNESS_CATEGORIES[goal.category];
                    const streak = goal.completedDates.length;
                    
                    return (
                        <button
                            key={goal.id}
                            onClick={() => onToggleComplete(goal.id)}
                            className={`glass-panel p-4 rounded-xl w-full text-left transition-all ${
                                isCompletedToday ? 'bg-green-50 border border-green-200' : ''
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    isCompletedToday ? 'bg-green-500' : 'bg-gray-200'
                                }`}>
                                    {isCompletedToday ? (
                                        <Check className="w-5 h-5 text-white" />
                                    ) : (
                                        <span className="text-lg">{config.emoji}</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className={`font-medium ${isCompletedToday ? 'line-through opacity-60' : ''}`}>
                                        {goal.description}
                                    </p>
                                    <p className="text-xs opacity-50">{config.label} • {streak} day streak</p>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

// ============================================================================
// HISTORY VIEW
// ============================================================================

const HistoryView = ({
    checkIns,
    onBack,
}: {
    checkIns: WellnessCheckIn[];
    onBack: () => void;
}) => {
    const sortedCheckIns = [...checkIns].sort((a, b) => b.date.getTime() - a.date.getTime());
    
    const getAverageScore = (checkIn: WellnessCheckIn) => {
        return (checkIn.sleep + checkIn.energy + checkIn.stress + checkIn.connection + checkIn.selfcare) / 5;
    };
    
    return (
        <div className="flex flex-col h-full pt-6 pb-32 px-4 fade-in overflow-y-auto">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-sm text-[#4B0082] hover:opacity-70 mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Wellness Hub
            </button>
            
            <h1 className="text-xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                Wellness History
            </h1>
            
            {sortedCheckIns.length === 0 && (
                <div className="glass-panel p-6 rounded-2xl text-center">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-[#0EA5E9] opacity-50" />
                    <p className="font-bold mb-2">No check-ins yet</p>
                    <p className="text-sm opacity-60">Your wellness journey starts with one check-in</p>
                </div>
            )}
            
            <div className="space-y-3">
                {sortedCheckIns.map(checkIn => {
                    const avg = getAverageScore(checkIn);
                    return (
                        <div key={checkIn.id} className="glass-panel p-4 rounded-xl">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <p className="font-bold" style={{ color: 'var(--text-primary)' }}>
                                        {checkIn.date.toLocaleDateString('en-US', { 
                                            weekday: 'short', 
                                            month: 'short', 
                                            day: 'numeric' 
                                        })}
                                    </p>
                                    <p className="text-xs opacity-50">
                                        Average: {avg.toFixed(1)}/5
                                    </p>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    avg >= 4 ? 'bg-green-100 text-green-700' :
                                    avg >= 3 ? 'bg-yellow-100 text-yellow-700' :
                                    avg >= 2 ? 'bg-orange-100 text-orange-700' :
                                    'bg-red-100 text-red-700'
                                }`}>
                                    {avg >= 4 ? 'Great Day' :
                                     avg >= 3 ? 'Okay Day' :
                                     avg >= 2 ? 'Tough Day' :
                                     'Hard Day'}
                                </div>
                            </div>
                            
                            <div className="flex gap-3 mb-3">
                                {(Object.keys(WELLNESS_CATEGORIES) as WellnessCategory[]).map(cat => (
                                    <div key={cat} className="text-center flex-1">
                                        <span className="text-lg">{WELLNESS_CATEGORIES[cat].emoji}</span>
                                        <p className="text-xs font-bold">{checkIn[cat]}</p>
                                    </div>
                                ))}
                            </div>
                            
                            {checkIn.gratitude && (
                                <p className="text-xs bg-white/40 p-2 rounded-lg mb-1">
                                    🙏 {checkIn.gratitude}
                                </p>
                            )}
                            {checkIn.wins && (
                                <p className="text-xs bg-white/40 p-2 rounded-lg">
                                    🌟 {checkIn.wins}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WellnessHub;
