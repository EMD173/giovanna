/**
 * STRATEGY LIBRARY
 * 
 * Curated, evidence-based regulation strategies organized by:
 * - Challenge type (meltdown, transition, sensory, etc.)
 * - Who uses it (parent strategies, child coping strategies)
 * - When to use (prevention, in-the-moment, recovery)
 * 
 * Features:
 * - Favorites system
 * - Track which strategies you've tried
 * - Effectiveness ratings
 * - Personal notes
 * - Integration with longitudinal memory (what works for YOUR child)
 */

import { useState, useEffect } from 'react';
import {
    ArrowLeft,
    Heart,
    Check,
    Search,
    Filter,
    ChevronDown,
    ChevronRight,
    Zap,
    Wind,
    Shield,
    Lightbulb,
} from 'lucide-react';
import { useAuthStore } from '../../core/stores/useAuthStore';
import { getProfile } from '../../core/firebase/profiles';

// ============================================================================
// TYPES
// ============================================================================

export type ChallengeType = 
    | 'meltdown'
    | 'transition'
    | 'sensory_overload'
    | 'anxiety'
    | 'sleep'
    | 'feeding'
    | 'communication'
    | 'social';

export type StrategyTiming = 
    | 'prevention'
    | 'in_moment'
    | 'recovery';

export type StrategyUser = 
    | 'parent'
    | 'child'
    | 'both';

export interface Strategy {
    id: string;
    title: string;
    description: string;
    detailedSteps: string[];
    
    // Classification
    challengeType: ChallengeType;
    timing: StrategyTiming;
    forWho: StrategyUser;
    
    // Metadata
    ageRange?: string;               // e.g., "3-8", "All ages"
    requiresSupplies?: string[];     // e.g., ["weighted blanket", "timer"]
    evidenceBased?: boolean;
    source?: string;                 // Citation or source
    
    // Visual
    emoji: string;
    color: string;
}

export interface UserStrategyData {
    strategyId: string;
    isFavorite: boolean;
    hasTried: boolean;
    effectiveness?: 'very_helpful' | 'somewhat_helpful' | 'not_helpful' | 'made_worse';
    personalNotes?: string;
    lastUsed?: Date;
    useCount: number;
}

// ============================================================================
// STRATEGY DATABASE
// ============================================================================

const CHALLENGE_CONFIG: Record<ChallengeType, {
    label: string;
    emoji: string;
    color: string;
    bgColor: string;
}> = {
    meltdown: { label: 'Meltdowns', emoji: '🌋', color: '#DC2626', bgColor: 'rgba(220, 38, 38, 0.1)' },
    transition: { label: 'Transitions', emoji: '🔄', color: '#7C3AED', bgColor: 'rgba(124, 58, 237, 0.1)' },
    sensory_overload: { label: 'Sensory Overload', emoji: '🎧', color: '#0891B2', bgColor: 'rgba(8, 145, 178, 0.1)' },
    anxiety: { label: 'Anxiety', emoji: '💙', color: '#2563EB', bgColor: 'rgba(37, 99, 235, 0.1)' },
    sleep: { label: 'Sleep', emoji: '🌙', color: '#4B0082', bgColor: 'rgba(75, 0, 130, 0.1)' },
    feeding: { label: 'Feeding', emoji: '🍽️', color: '#16A34A', bgColor: 'rgba(22, 163, 74, 0.1)' },
    communication: { label: 'Communication', emoji: '💬', color: '#D97706', bgColor: 'rgba(217, 119, 6, 0.1)' },
    social: { label: 'Social', emoji: '🤝', color: '#EC4899', bgColor: 'rgba(236, 72, 153, 0.1)' },
};

const TIMING_CONFIG: Record<StrategyTiming, {
    label: string;
    icon: typeof Shield;
    description: string;
}> = {
    prevention: { label: 'Prevention', icon: Shield, description: 'Before it starts' },
    in_moment: { label: 'In the Moment', icon: Zap, description: 'During the challenge' },
    recovery: { label: 'Recovery', icon: Wind, description: 'After the storm' },
};

// The actual strategy library
const STRATEGIES: Strategy[] = [
    // MELTDOWN STRATEGIES
    {
        id: 'melt-1',
        title: 'Create a Calm-Down Corner',
        description: 'A dedicated safe space with sensory tools where your child can go when overwhelmed.',
        detailedSteps: [
            'Choose a quiet corner or small space in your home',
            'Add soft items: bean bag, cushions, weighted blanket',
            'Include calming sensory tools: fidgets, noise-canceling headphones',
            'Add visual calming aids: lava lamp, fiber optic lights',
            'Practice going there when calm so it becomes familiar',
        ],
        challengeType: 'meltdown',
        timing: 'prevention',
        forWho: 'child',
        emoji: '🏠',
        color: '#DC2626',
        ageRange: 'All ages',
        requiresSupplies: ['Cushions', 'Sensory tools', 'Optional: weighted blanket'],
        evidenceBased: true,
    },
    {
        id: 'melt-2',
        title: 'Low-Demand Communication',
        description: 'Reduce verbal demands during dysregulation. Use minimal words, soft tone.',
        detailedSteps: [
            'Stop asking questions - they require processing energy',
            'Lower your voice volume and pitch',
            'Use 1-2 word phrases maximum: "I\'m here" or "Safe"',
            'Avoid reasoning or explaining - save it for later',
            'Offer presence without expectation',
        ],
        challengeType: 'meltdown',
        timing: 'in_moment',
        forWho: 'parent',
        emoji: '🤫',
        color: '#DC2626',
        evidenceBased: true,
        source: 'Polyvagal Theory - Dr. Stephen Porges',
    },
    {
        id: 'melt-3',
        title: 'Co-Regulation Breathing',
        description: 'Parent regulates first, then offers calm presence for child to attune to.',
        detailedSteps: [
            'Step one: Regulate YOURSELF first (you can\'t pour from an empty cup)',
            'Take slow, visible deep breaths - let your child see you breathing',
            'Lower your shoulders, soften your face',
            'Position yourself at or below child\'s eye level',
            'Wait. Your calm nervous system is contagious.',
        ],
        challengeType: 'meltdown',
        timing: 'in_moment',
        forWho: 'parent',
        emoji: '🌬️',
        color: '#DC2626',
        evidenceBased: true,
        source: 'Dr. Mona Delahooke - Beyond Behaviors',
    },
    {
        id: 'melt-4',
        title: 'Repair & Reconnect',
        description: 'After a meltdown, rebuild connection without shame or lengthy discussions.',
        detailedSteps: [
            'Wait until your child is fully regulated (may take 20-60 min)',
            'Offer physical comfort if they want it (some prefer space)',
            'Avoid "talking about what happened" immediately',
            'Simple reconnection: "I love you. That was hard."',
            'Later (hours/next day): collaborative problem-solving if needed',
        ],
        challengeType: 'meltdown',
        timing: 'recovery',
        forWho: 'both',
        emoji: '💜',
        color: '#DC2626',
        evidenceBased: true,
        source: 'Circle of Security',
    },
    
    // TRANSITION STRATEGIES
    {
        id: 'trans-1',
        title: 'Visual Schedule',
        description: 'Pictures showing the sequence of activities help predict what\'s coming next.',
        detailedSteps: [
            'Use pictures or symbols your child understands',
            'Show the current activity and 1-2 upcoming activities',
            'Review the schedule together at transition points',
            'Allow child to move completed items to "done" section',
            'Keep it consistent - same format each day',
        ],
        challengeType: 'transition',
        timing: 'prevention',
        forWho: 'child',
        emoji: '📋',
        color: '#7C3AED',
        evidenceBased: true,
        requiresSupplies: ['Visual schedule board', 'Picture cards'],
    },
    {
        id: 'trans-2',
        title: 'Countdown Warnings',
        description: 'Give predictable warnings before transitions: 10 min, 5 min, 2 min, time.',
        detailedSteps: [
            'Set a visual timer when giving the first warning',
            'Use consistent language: "In 10 minutes, we will..."',
            'Give a sensory cue at each warning (tap shoulder, show timer)',
            'At final warning, offer a "last thing" they can do',
            'Acknowledge the transition is hard: "I know stopping is hard"',
        ],
        challengeType: 'transition',
        timing: 'prevention',
        forWho: 'parent',
        emoji: '⏱️',
        color: '#7C3AED',
        requiresSupplies: ['Visual timer'],
        evidenceBased: true,
    },
    {
        id: 'trans-3',
        title: 'Transition Object',
        description: 'A special item that travels between activities, providing continuity.',
        detailedSteps: [
            'Identify a small, portable comfort item',
            'The object "comes with" during all transitions',
            'Can be a favorite toy, fidget, or special bracelet',
            'Create a ritual: "Let\'s bring Bear to the car with us"',
            'Gradually fade reliance as transitions become easier',
        ],
        challengeType: 'transition',
        timing: 'in_moment',
        forWho: 'child',
        emoji: '🧸',
        color: '#7C3AED',
    },
    
    // SENSORY OVERLOAD STRATEGIES
    {
        id: 'sens-1',
        title: 'Sensory Diet',
        description: 'Proactive sensory input throughout the day to maintain regulation.',
        detailedSteps: [
            'Identify your child\'s sensory needs (seeking vs avoiding)',
            'Build in movement breaks every 30-60 minutes',
            'Offer heavy work: carrying groceries, pushing laundry basket',
            'Include calming input: deep pressure, weighted items',
            'Work with an OT to customize the diet',
        ],
        challengeType: 'sensory_overload',
        timing: 'prevention',
        forWho: 'child',
        emoji: '🏋️',
        color: '#0891B2',
        evidenceBased: true,
        source: 'Occupational Therapy sensory integration research',
    },
    {
        id: 'sens-2',
        title: 'Noise-Canceling Headphones',
        description: 'Reduce auditory overwhelm in loud or unpredictable environments.',
        detailedSteps: [
            'Introduce headphones at home first when calm',
            'Practice wearing in gradually increasing environments',
            'Keep a pair in car, backpack, and at school',
            'Teach child to self-advocate: "I need my headphones"',
            'Pair with other calming strategies as needed',
        ],
        challengeType: 'sensory_overload',
        timing: 'in_moment',
        forWho: 'child',
        emoji: '🎧',
        color: '#0891B2',
        requiresSupplies: ['Noise-canceling headphones or ear defenders'],
    },
    {
        id: 'sens-3',
        title: 'Deep Pressure Input',
        description: 'Firm, even pressure helps calm an overwhelmed nervous system.',
        detailedSteps: [
            'Offer a tight hug (ask first, or use a code word)',
            'Use a weighted blanket or lap pad',
            'Try a "burrito roll" in a blanket',
            'Encourage wall push-ups or carrying heavy items',
            'Some children like being squished between cushions',
        ],
        challengeType: 'sensory_overload',
        timing: 'in_moment',
        forWho: 'child',
        emoji: '🫂',
        color: '#0891B2',
        evidenceBased: true,
    },
    
    // ANXIETY STRATEGIES
    {
        id: 'anx-1',
        title: '5-4-3-2-1 Grounding',
        description: 'Use the five senses to bring attention back to the present moment.',
        detailedSteps: [
            '5 things you can SEE',
            '4 things you can TOUCH',
            '3 things you can HEAR',
            '2 things you can SMELL',
            '1 thing you can TASTE',
            'Adapt for your child\'s communication level',
        ],
        challengeType: 'anxiety',
        timing: 'in_moment',
        forWho: 'both',
        emoji: '✋',
        color: '#2563EB',
        evidenceBased: true,
    },
    {
        id: 'anx-2',
        title: 'Worry Box',
        description: 'A physical container where worries can be "put away" until worry time.',
        detailedSteps: [
            'Decorate a small box together',
            'When worries come, write or draw them on paper',
            'Put the worry in the box - it\'s "held" for later',
            'Schedule a daily 10-min "worry time" (not before bed)',
            'At worry time, review and problem-solve if needed',
        ],
        challengeType: 'anxiety',
        timing: 'prevention',
        forWho: 'child',
        emoji: '📦',
        color: '#2563EB',
        requiresSupplies: ['Small box', 'Paper', 'Markers'],
    },
    
    // SLEEP STRATEGIES
    {
        id: 'sleep-1',
        title: 'Consistent Bedtime Routine',
        description: 'Same steps, same order, same time every night signals sleep is coming.',
        detailedSteps: [
            'Start 30-60 minutes before desired sleep time',
            'Include: bath/wash, pajamas, teeth, story, cuddle',
            'Use a visual schedule if helpful',
            'Dim lights progressively throughout routine',
            'End with the same ritual every night (song, phrase, etc.)',
        ],
        challengeType: 'sleep',
        timing: 'prevention',
        forWho: 'both',
        emoji: '🌙',
        color: '#4B0082',
        evidenceBased: true,
    },
    {
        id: 'sleep-2',
        title: 'Weighted Blanket',
        description: 'Deep pressure during sleep can help maintain calm and improve sleep quality.',
        detailedSteps: [
            'Choose appropriate weight (typically 10% of body weight)',
            'Introduce during calm, awake time first',
            'Use for initial falling asleep (can be removed later)',
            'Ensure child can easily remove it themselves',
            'Monitor for overheating',
        ],
        challengeType: 'sleep',
        timing: 'in_moment',
        forWho: 'child',
        emoji: '🛏️',
        color: '#4B0082',
        requiresSupplies: ['Weighted blanket'],
        evidenceBased: true,
    },
    
    // FEEDING STRATEGIES
    {
        id: 'feed-1',
        title: 'Food Chaining',
        description: 'Gradually introduce new foods based on similarities to accepted foods.',
        detailedSteps: [
            'List all currently accepted foods',
            'Identify sensory properties: color, texture, temperature',
            'Find a "bridge" food similar to an accepted one',
            'Present new food alongside familiar one - no pressure',
            'Celebrate any interaction (touching, smelling) as progress',
        ],
        challengeType: 'feeding',
        timing: 'prevention',
        forWho: 'parent',
        emoji: '🍎',
        color: '#16A34A',
        evidenceBased: true,
        source: 'SOS Approach to Feeding',
    },
    {
        id: 'feed-2',
        title: 'Divided Plates',
        description: 'Keep foods separated to respect sensory preferences and reduce overwhelm.',
        detailedSteps: [
            'Use plates with compartments or dividers',
            'Never let foods touch unless child is okay with it',
            'Include at least one "safe" food at every meal',
            'Offer new foods in a separate "looking bowl" - optional to try',
            'Keep portions tiny for new foods (less overwhelming)',
        ],
        challengeType: 'feeding',
        timing: 'in_moment',
        forWho: 'parent',
        emoji: '🍽️',
        color: '#16A34A',
        requiresSupplies: ['Divided plates or bowls'],
    },
    
    // COMMUNICATION STRATEGIES
    {
        id: 'comm-1',
        title: 'Wait Time',
        description: 'Give 10-15 seconds of silence after asking a question or making a request.',
        detailedSteps: [
            'Ask your question or give an instruction once',
            'Stop talking and count to 10-15 in your head',
            'Resist the urge to repeat or rephrase immediately',
            'Watch for any response - verbal, gestural, or physical',
            'If no response, try a simpler version or visual support',
        ],
        challengeType: 'communication',
        timing: 'in_moment',
        forWho: 'parent',
        emoji: '⏳',
        color: '#D97706',
        evidenceBased: true,
    },
    {
        id: 'comm-2',
        title: 'Visual Supports',
        description: 'Use pictures, symbols, or written words to supplement verbal communication.',
        detailedSteps: [
            'Pair verbal instructions with a picture or gesture',
            'Use "First-Then" boards for sequences',
            'Create visual choice boards for common decisions',
            'Keep AAC device or communication book accessible always',
            'Model using visuals yourself - don\'t just demand child use them',
        ],
        challengeType: 'communication',
        timing: 'prevention',
        forWho: 'both',
        emoji: '🖼️',
        color: '#D97706',
        evidenceBased: true,
        requiresSupplies: ['Picture cards', 'First-Then board'],
    },
    
    // SOCIAL STRATEGIES
    {
        id: 'social-1',
        title: 'Parallel Play First',
        description: 'Playing alongside (not with) a peer builds comfort before interactive play.',
        detailedSteps: [
            'Set up two of the same activity side by side',
            'Both children engage independently but in proximity',
            'Parent facilitates: "Look, Maya is building too!"',
            'No pressure for interaction or sharing yet',
            'Gradually introduce small moments of interaction',
        ],
        challengeType: 'social',
        timing: 'prevention',
        forWho: 'child',
        emoji: '🧩',
        color: '#EC4899',
        evidenceBased: true,
    },
    {
        id: 'social-2',
        title: 'Social Scripts',
        description: 'Pre-teach exact words to say in common social situations.',
        detailedSteps: [
            'Identify a challenging social situation',
            'Write out exactly what to say (keep it simple)',
            'Practice at home through role-play',
            'Use visual cue cards as reminders',
            'Celebrate any attempt, even if not perfect',
        ],
        challengeType: 'social',
        timing: 'prevention',
        forWho: 'child',
        emoji: '📝',
        color: '#EC4899',
        evidenceBased: true,
    },
];

// ============================================================================
// COMPONENT
// ============================================================================

interface StrategyLibraryProps {
    onBack: () => void;
}

export const StrategyLibrary = ({ onBack }: StrategyLibraryProps) => {
    const { user } = useAuthStore();
    const [childName, setChildName] = useState('');
    const [userData, setUserData] = useState<Record<string, UserStrategyData>>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedChallenge, setSelectedChallenge] = useState<ChallengeType | 'all' | 'favorites'>('all');
    const [selectedTiming, setSelectedTiming] = useState<StrategyTiming | 'all'>('all');
    const [expandedStrategy, setExpandedStrategy] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    
    // Load user data
    useEffect(() => {
        if (user) {
            getProfile(user.uid).then(profile => {
                if (profile?.childName) setChildName(profile.childName);
            });
            
            // Load strategy data from localStorage
            const stored = localStorage.getItem(`giovanna-strategies-${user.uid}`);
            if (stored) {
                try {
                    setUserData(JSON.parse(stored));
                } catch (e) {
                    console.error('Failed to load strategy data:', e);
                }
            }
        }
    }, [user]);
    
    // Save user data
    useEffect(() => {
        if (user && Object.keys(userData).length > 0) {
            localStorage.setItem(`giovanna-strategies-${user.uid}`, JSON.stringify(userData));
        }
    }, [userData, user]);
    
    // Filter strategies
    const filteredStrategies = STRATEGIES.filter(strategy => {
        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchesSearch = 
                strategy.title.toLowerCase().includes(query) ||
                strategy.description.toLowerCase().includes(query);
            if (!matchesSearch) return false;
        }
        
        // Challenge filter
        if (selectedChallenge === 'favorites') {
            if (!userData[strategy.id]?.isFavorite) return false;
        } else if (selectedChallenge !== 'all') {
            if (strategy.challengeType !== selectedChallenge) return false;
        }
        
        // Timing filter
        if (selectedTiming !== 'all') {
            if (strategy.timing !== selectedTiming) return false;
        }
        
        return true;
    });
    
    // Toggle favorite
    const toggleFavorite = (strategyId: string) => {
        setUserData(prev => ({
            ...prev,
            [strategyId]: {
                ...prev[strategyId],
                strategyId,
                isFavorite: !prev[strategyId]?.isFavorite,
                hasTried: prev[strategyId]?.hasTried || false,
                useCount: prev[strategyId]?.useCount || 0,
            },
        }));
    };
    
    // Mark as tried
    const markAsTried = (strategyId: string, effectiveness?: UserStrategyData['effectiveness']) => {
        setUserData(prev => ({
            ...prev,
            [strategyId]: {
                ...prev[strategyId],
                strategyId,
                isFavorite: prev[strategyId]?.isFavorite || false,
                hasTried: true,
                effectiveness: effectiveness || prev[strategyId]?.effectiveness,
                lastUsed: new Date(),
                useCount: (prev[strategyId]?.useCount || 0) + 1,
            },
        }));
    };
    
    // Get stats
    const favoriteCount = Object.values(userData).filter(d => d.isFavorite).length;
    const triedCount = Object.values(userData).filter(d => d.hasTried).length;
    
    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-500">Please sign in to view strategies</p>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col h-full pt-6 pb-32 px-4 fade-in overflow-y-auto">
            {/* Header */}
            <header className="flex items-center gap-3 mb-4">
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
                        Strategy Library
                    </h1>
                    <p className="text-sm opacity-70">
                        Evidence-based tools for {childName || 'your family'}
                    </p>
                </div>
            </header>
            
            {/* Quick Stats */}
            <div className="flex gap-3 mb-4">
                <div className="glass-panel px-4 py-2 rounded-xl flex items-center gap-2">
                    <Heart className="w-4 h-4 text-pink-500" />
                    <span className="text-sm font-bold">{favoriteCount}</span>
                    <span className="text-xs opacity-60">favorites</span>
                </div>
                <div className="glass-panel px-4 py-2 rounded-xl flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-bold">{triedCount}</span>
                    <span className="text-xs opacity-60">tried</span>
                </div>
            </div>
            
            {/* Search */}
            <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search strategies..."
                    className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/50 border border-white/50 focus:ring-2 focus:ring-[#4B0082] outline-none"
                />
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors ${
                        showFilters ? 'bg-[#4B0082] text-white' : 'hover:bg-white/50'
                    }`}
                >
                    <Filter className="w-4 h-4" />
                </button>
            </div>
            
            {/* Filters */}
            {showFilters && (
                <div className="glass-panel p-4 rounded-xl mb-4 space-y-3">
                    {/* Challenge Type */}
                    <div>
                        <p className="text-xs font-bold opacity-70 mb-2">Challenge Type</p>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedChallenge('all')}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                                    selectedChallenge === 'all'
                                        ? 'bg-[#4B0082] text-white'
                                        : 'bg-white/40 hover:bg-white/60'
                                }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setSelectedChallenge('favorites')}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
                                    selectedChallenge === 'favorites'
                                        ? 'bg-pink-500 text-white'
                                        : 'bg-white/40 hover:bg-white/60'
                                }`}
                            >
                                <Heart className="w-3 h-3" /> Favorites
                            </button>
                            {(Object.keys(CHALLENGE_CONFIG) as ChallengeType[]).map(type => (
                                <button
                                    key={type}
                                    onClick={() => setSelectedChallenge(type)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                                        selectedChallenge === type
                                            ? 'text-white'
                                            : 'bg-white/40 hover:bg-white/60'
                                    }`}
                                    style={selectedChallenge === type ? { backgroundColor: CHALLENGE_CONFIG[type].color } : {}}
                                >
                                    {CHALLENGE_CONFIG[type].emoji} {CHALLENGE_CONFIG[type].label}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {/* Timing */}
                    <div>
                        <p className="text-xs font-bold opacity-70 mb-2">When to Use</p>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedTiming('all')}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                                    selectedTiming === 'all'
                                        ? 'bg-[#4B0082] text-white'
                                        : 'bg-white/40 hover:bg-white/60'
                                }`}
                            >
                                All
                            </button>
                            {(Object.keys(TIMING_CONFIG) as StrategyTiming[]).map(timing => {
                                const Icon = TIMING_CONFIG[timing].icon;
                                return (
                                    <button
                                        key={timing}
                                        onClick={() => setSelectedTiming(timing)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
                                            selectedTiming === timing
                                                ? 'bg-[#4B0082] text-white'
                                                : 'bg-white/40 hover:bg-white/60'
                                        }`}
                                    >
                                        <Icon className="w-3 h-3" /> {TIMING_CONFIG[timing].label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
            
            {/* Results Count */}
            <p className="text-xs opacity-50 mb-3">
                {filteredStrategies.length} strateg{filteredStrategies.length === 1 ? 'y' : 'ies'}
            </p>
            
            {/* Strategy Cards */}
            <div className="space-y-3">
                {filteredStrategies.map(strategy => (
                    <StrategyCard
                        key={strategy.id}
                        strategy={strategy}
                        userData={userData[strategy.id]}
                        isExpanded={expandedStrategy === strategy.id}
                        onToggleExpand={() => setExpandedStrategy(
                            expandedStrategy === strategy.id ? null : strategy.id
                        )}
                        onToggleFavorite={() => toggleFavorite(strategy.id)}
                        onMarkTried={(effectiveness) => markAsTried(strategy.id, effectiveness)}
                    />
                ))}
            </div>
            
            {/* Empty State */}
            {filteredStrategies.length === 0 && (
                <div className="text-center py-12">
                    <Lightbulb className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium opacity-70">No strategies found</p>
                    <p className="text-sm opacity-50">Try adjusting your filters</p>
                </div>
            )}
        </div>
    );
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const StrategyCard = ({
    strategy,
    userData,
    isExpanded,
    onToggleExpand,
    onToggleFavorite,
    onMarkTried,
}: {
    strategy: Strategy;
    userData?: UserStrategyData;
    isExpanded: boolean;
    onToggleExpand: () => void;
    onToggleFavorite: () => void;
    onMarkTried: (effectiveness?: UserStrategyData['effectiveness']) => void;
}) => {
    const challengeConfig = CHALLENGE_CONFIG[strategy.challengeType];
    const timingConfig = TIMING_CONFIG[strategy.timing];
    const TimingIcon = timingConfig.icon;
    
    return (
        <div className="glass-panel rounded-2xl overflow-hidden">
            {/* Header - Always visible */}
            <button
                onClick={onToggleExpand}
                className="w-full p-4 text-left hover:bg-white/30 transition-colors"
            >
                <div className="flex items-start gap-3">
                    <span 
                        className="text-2xl w-10 h-10 flex items-center justify-center rounded-xl"
                        style={{ backgroundColor: challengeConfig.bgColor }}
                    >
                        {strategy.emoji}
                    </span>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                                {strategy.title}
                            </h3>
                            {userData?.hasTried && (
                                <Check className="w-4 h-4 text-green-500" />
                            )}
                        </div>
                        <p className="text-sm opacity-70 mt-1">{strategy.description}</p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mt-2">
                            <span 
                                className="text-xs px-2 py-0.5 rounded-full"
                                style={{ 
                                    backgroundColor: challengeConfig.bgColor,
                                    color: challengeConfig.color,
                                }}
                            >
                                {challengeConfig.label}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 flex items-center gap-1">
                                <TimingIcon className="w-3 h-3" />
                                {timingConfig.label}
                            </span>
                            {strategy.evidenceBased && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                                    ✓ Evidence-based
                                </span>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleFavorite();
                            }}
                            className="p-2 rounded-full hover:bg-white/50 transition-colors"
                        >
                            <Heart 
                                className={`w-5 h-5 transition-colors ${
                                    userData?.isFavorite 
                                        ? 'fill-pink-500 text-pink-500' 
                                        : 'text-gray-400'
                                }`}
                            />
                        </button>
                        {isExpanded ? (
                            <ChevronDown className="w-4 h-4 opacity-40" />
                        ) : (
                            <ChevronRight className="w-4 h-4 opacity-40" />
                        )}
                    </div>
                </div>
            </button>
            
            {/* Expanded Content */}
            {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-200">
                    {/* Steps */}
                    <div className="mt-4">
                        <p className="text-xs font-bold opacity-70 mb-2">HOW TO DO IT</p>
                        <ol className="space-y-2">
                            {strategy.detailedSteps.map((step, i) => (
                                <li key={i} className="flex gap-3 text-sm">
                                    <span 
                                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                                        style={{ backgroundColor: challengeConfig.color }}
                                    >
                                        {i + 1}
                                    </span>
                                    <span>{step}</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                    
                    {/* Supplies */}
                    {strategy.requiresSupplies && strategy.requiresSupplies.length > 0 && (
                        <div className="mt-4">
                            <p className="text-xs font-bold opacity-70 mb-2">YOU'LL NEED</p>
                            <div className="flex flex-wrap gap-2">
                                {strategy.requiresSupplies.map((supply, i) => (
                                    <span 
                                        key={i}
                                        className="text-xs px-2 py-1 rounded-lg bg-white/50"
                                    >
                                        {supply}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Source */}
                    {strategy.source && (
                        <p className="text-xs opacity-50 mt-4 italic">
                            Source: {strategy.source}
                        </p>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        {!userData?.hasTried ? (
                            <button
                                onClick={() => onMarkTried()}
                                className="w-full py-2.5 rounded-xl bg-[#4B0082] text-white font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                            >
                                <Check className="w-4 h-4" />
                                Mark as Tried
                            </button>
                        ) : (
                            <div>
                                <p className="text-xs font-bold opacity-70 mb-2">HOW DID IT WORK?</p>
                                <div className="grid grid-cols-4 gap-2">
                                    {[
                                        { value: 'very_helpful', emoji: '🌟', label: 'Great!' },
                                        { value: 'somewhat_helpful', emoji: '👍', label: 'Helped' },
                                        { value: 'not_helpful', emoji: '😐', label: 'Meh' },
                                        { value: 'made_worse', emoji: '👎', label: 'Nope' },
                                    ].map(option => (
                                        <button
                                            key={option.value}
                                            onClick={() => onMarkTried(option.value as UserStrategyData['effectiveness'])}
                                            className={`p-2 rounded-xl text-center transition-all ${
                                                userData?.effectiveness === option.value
                                                    ? 'ring-2 ring-[#4B0082] bg-white/60'
                                                    : 'bg-white/30 hover:bg-white/50'
                                            }`}
                                        >
                                            <span className="text-xl">{option.emoji}</span>
                                            <p className="text-xs mt-1">{option.label}</p>
                                        </button>
                                    ))}
                                </div>
                                {userData?.useCount && userData.useCount > 1 && (
                                    <p className="text-xs opacity-50 mt-2 text-center">
                                        Used {userData.useCount} times
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StrategyLibrary;
