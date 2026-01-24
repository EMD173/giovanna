/**
 * THE SOVEREIGN PLAYBOOK: Creative Practice Layer
 * 
 * Educational role-play and regulation-preloading games that help
 * parents and children practice systemic context skills through joy.
 * 
 * FEATURES:
 * - The Vocation Game: Design Taco-Bell style role-play for systemic skills
 * - The Listening Pulse: Silly command games for regulation preloading
 * 
 * PHILOSOPHY: Play is the sacred language of childhood. Through play,
 * we practice the impossible until it becomes possible.
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Gamepad2,
    Users,
    RefreshCw,
    ChevronRight,
    Star,
    Music,
    Hand,
    Eye,
    Ear
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

export interface VocationGame {
    id: string;
    title: string;
    scenario: string;
    targetSkill: SystemicSkill;
    roles: GameRole[];
    prompts: string[];
    celebrationPhrase: string;
}

export interface GameRole {
    name: string;
    description: string;
    keyPhrases: string[];
}

export type SystemicSkill =
    | 'waiting'
    | 'transitioning'
    | 'asking_for_help'
    | 'accepting_no'
    | 'following_directions'
    | 'sharing_space'
    | 'flexible_thinking'
    | 'emotional_expression';

export interface ListeningPulseGame {
    id: string;
    name: string;
    description: string;
    targetAge: 'child' | 'adult' | 'both';
    sensoryChannel: SensoryChannel;
    commands: PulseCommand[];
    regulationGoal: string;
}

export interface PulseCommand {
    instruction: string;
    duration?: number; // seconds
    intensity: 'gentle' | 'moderate' | 'silly';
}

export type SensoryChannel = 'vestibular' | 'proprioceptive' | 'auditory' | 'visual' | 'tactile';

// ============================================================================
// GAME LIBRARIES
// ============================================================================

const VOCATION_GAME_TEMPLATES: VocationGame[] = [
    {
        id: 'taco_drive_thru',
        title: "Taco Bell Drive-Thru",
        scenario: "You're at the drive-thru! Practice ordering, waiting, and accepting when they're out of something.",
        targetSkill: 'waiting',
        roles: [
            {
                name: 'Customer',
                description: "The person ordering food",
                keyPhrases: ["I'd like to order...", "How long will that take?", "Okay, I'll wait."]
            },
            {
                name: 'Worker',
                description: "The drive-thru employee",
                keyPhrases: ["Welcome!", "That'll be 5 minutes", "Sorry, we're out of that!"]
            }
        ],
        prompts: [
            "Customer orders their favorite item",
            "Worker says the wait will be 3 minutes",
            "Customer practices waiting calmly",
            "Worker announces the item is ready!"
        ],
        celebrationPhrase: "You waited like a champion! 🌮"
    },
    {
        id: 'doctor_visit',
        title: "Doctor's Office Adventure",
        scenario: "Time for a check-up! Practice waiting in the lobby, following directions, and using brave words.",
        targetSkill: 'following_directions',
        roles: [
            {
                name: 'Patient',
                description: "The person getting a check-up",
                keyPhrases: ["I can do this", "What happens next?", "I need a break"]
            },
            {
                name: 'Doctor',
                description: "The caring doctor",
                keyPhrases: ["Let's check your...", "Great job!", "You're so brave!"]
            }
        ],
        prompts: [
            "Doctor asks patient to sit on the table",
            "Patient takes a deep breath",
            "Doctor checks heartbeat while counting together",
            "Celebration high-five!"
        ],
        celebrationPhrase: "You followed all the steps like a superstar! ⭐"
    },
    {
        id: 'playground_sharing',
        title: "Playground Friends",
        scenario: "The playground is fun, but crowded! Practice asking to join, sharing equipment, and flexible thinking.",
        targetSkill: 'sharing_space',
        roles: [
            {
                name: 'New Friend',
                description: "Someone who wants to play",
                keyPhrases: ["Can I play too?", "We can take turns!", "Maybe we can both..."]
            },
            {
                name: 'Current Player',
                description: "Already using the swing/slide",
                keyPhrases: ["Sure, let's share!", "You can go next", "Want to do it together?"]
            }
        ],
        prompts: [
            "New Friend walks up and asks to join",
            "Current Player thinks about sharing",
            "They figure out a turn-taking plan",
            "Both friends play happily!"
        ],
        celebrationPhrase: "Sharing made the fun double! 🎢"
    },
    {
        id: 'store_disappointment',
        title: "The Store Said No",
        scenario: "You wanted something at the store, but the answer is no today. Practice accepting no with dignity.",
        targetSkill: 'accepting_no',
        roles: [
            {
                name: 'Shopper',
                description: "Wants a special toy/treat",
                keyPhrases: ["Can I please have...?", "I understand", "Maybe another time"]
            },
            {
                name: 'Parent',
                description: "The loving grown-up",
                keyPhrases: ["Not today, love", "I know you wanted it", "Let's add it to your wish list"]
            }
        ],
        prompts: [
            "Shopper sees something they really want",
            "Shopper asks politely",
            "Parent explains it's not today",
            "Shopper takes a breath and accepts with grace"
        ],
        celebrationPhrase: "You handled that disappointment like a true champion of feelings! 💪"
    }
];

const LISTENING_PULSE_GAMES: ListeningPulseGame[] = [
    {
        id: 'freeze_dance_silly',
        name: "Freeze Dance: Silly Edition",
        description: "Dance when the music plays, freeze in the silliest pose when it stops!",
        targetAge: 'both',
        sensoryChannel: 'vestibular',
        commands: [
            { instruction: "Dance like a wiggly noodle!", intensity: 'silly' },
            { instruction: "FREEZE! Make a silly face!", duration: 5, intensity: 'silly' },
            { instruction: "Dance like you're made of jello!", intensity: 'silly' },
            { instruction: "FREEZE! Pretend you're a statue of a superhero!", duration: 5, intensity: 'moderate' }
        ],
        regulationGoal: "Practicing stop-and-go helps the brain practice impulse control while having fun!"
    },
    {
        id: 'animal_commands',
        name: "Animal Body Commands",
        description: "Move your body like different animals when called!",
        targetAge: 'child',
        sensoryChannel: 'proprioceptive',
        commands: [
            { instruction: "Walk like a heavy elephant!", intensity: 'moderate' },
            { instruction: "Slither like a sneaky snake!", intensity: 'gentle' },
            { instruction: "Jump like a kangaroo!", intensity: 'silly' },
            { instruction: "Curl up like a sleepy cat...", intensity: 'gentle' }
        ],
        regulationGoal: "Heavy work (elephant, bear) provides proprioceptive input that calms the nervous system."
    },
    {
        id: 'whisper_shout',
        name: "The Whisper-Shout Game",
        description: "Practice volume control by following whisper and shout commands!",
        targetAge: 'both',
        sensoryChannel: 'auditory',
        commands: [
            { instruction: "Say your name in your LOUDEST voice!", intensity: 'silly' },
            { instruction: "Now whisper the tiniest whisper...", intensity: 'gentle' },
            { instruction: "Medium voice - like talking to a friend", duration: 3, intensity: 'moderate' },
            { instruction: "OPERA SINGER MODE!", intensity: 'silly' }
        ],
        regulationGoal: "Voice modulation practice helps with classroom expectations and emotional expression."
    },
    {
        id: 'body_scan_adventure',
        name: "Body Scan Adventure",
        description: "A calming game to notice your body from toes to head.",
        targetAge: 'both',
        sensoryChannel: 'tactile',
        commands: [
            { instruction: "Wiggle your toes like little worms", duration: 5, intensity: 'gentle' },
            { instruction: "Squeeze your legs like you're hugging them", duration: 5, intensity: 'moderate' },
            { instruction: "Shake your hands like they're wet", duration: 3, intensity: 'moderate' },
            { instruction: "Take a deep breath and relax your shoulders", duration: 5, intensity: 'gentle' }
        ],
        regulationGoal: "Body awareness helps children recognize and regulate their internal states."
    },
    {
        id: 'eye_spy_calm',
        name: "Calm-Down Eye Spy",
        description: "A grounding game to find objects and return to the present moment.",
        targetAge: 'adult',
        sensoryChannel: 'visual',
        commands: [
            { instruction: "Find 3 things that are blue", duration: 15, intensity: 'gentle' },
            { instruction: "Find 2 things that are soft", duration: 10, intensity: 'gentle' },
            { instruction: "Find 1 thing that makes you smile", duration: 10, intensity: 'gentle' },
            { instruction: "Take one deep breath for gratitude", intensity: 'gentle' }
        ],
        regulationGoal: "Visual grounding helps adults return from stress to the present moment."
    }
];

const SENSORY_CHANNEL_META: Record<SensoryChannel, { icon: React.ReactNode; color: string; label: string }> = {
    'vestibular': { icon: <RefreshCw className="w-4 h-4" />, color: '#8B5CF6', label: 'Movement' },
    'proprioceptive': { icon: <Hand className="w-4 h-4" />, color: '#10B981', label: 'Body Awareness' },
    'auditory': { icon: <Ear className="w-4 h-4" />, color: '#3B82F6', label: 'Listening' },
    'visual': { icon: <Eye className="w-4 h-4" />, color: '#F59E0B', label: 'Looking' },
    'tactile': { icon: <Hand className="w-4 h-4" />, color: '#EC4899', label: 'Touch' },
};

const SKILL_LABELS: Record<SystemicSkill, string> = {
    'waiting': 'Waiting Patiently',
    'transitioning': 'Smooth Transitions',
    'asking_for_help': 'Asking for Help',
    'accepting_no': 'Accepting No Gracefully',
    'following_directions': 'Following Directions',
    'sharing_space': 'Sharing & Taking Turns',
    'flexible_thinking': 'Flexible Thinking',
    'emotional_expression': 'Expressing Feelings'
};

// ============================================================================
// COMPONENT
// ============================================================================

type PlaybookView = 'menu' | 'vocation' | 'pulse';

export const Playbook = () => {
    const [view, setView] = useState<PlaybookView>('menu');
    const [selectedGame, setSelectedGame] = useState<VocationGame | null>(null);
    const [selectedPulse, setSelectedPulse] = useState<ListeningPulseGame | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentCommandIndex, setCurrentCommandIndex] = useState(0);

    const startPulseGame = useCallback((game: ListeningPulseGame) => {
        setSelectedPulse(game);
        setIsPlaying(true);
        setCurrentCommandIndex(0);
    }, []);

    const nextCommand = useCallback(() => {
        if (selectedPulse && currentCommandIndex < selectedPulse.commands.length - 1) {
            setCurrentCommandIndex(prev => prev + 1);
        } else {
            setIsPlaying(false);
        }
    }, [selectedPulse, currentCommandIndex]);

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
                        <Gamepad2 className="w-8 h-8" style={{ color: '#A78BFA' }} />
                    </div>
                    <h1
                        className="text-2xl font-bold mb-2"
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            color: 'var(--text-primary)',
                        }}
                    >
                        The Sovereign Playbook
                    </h1>
                    <p className="text-sm opacity-60 max-w-md mx-auto">
                        Practice the impossible until it becomes possible.
                        Play is the sacred language of connection.
                    </p>
                </motion.div>

                {/* Main Menu */}
                {view === 'menu' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <button
                            onClick={() => setView('vocation')}
                            className="w-full glass-panel rounded-[24px] p-6 text-left transition-all hover:scale-[1.02]"
                            style={{ borderLeft: '4px solid #8B5CF6' }}
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className="p-3 rounded-xl"
                                    style={{ background: 'rgba(139, 92, 246, 0.2)' }}
                                >
                                    <Users className="w-6 h-6" style={{ color: '#A78BFA' }} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg">The Vocation Game</h3>
                                    <p className="text-sm opacity-60">
                                        Role-play real-world scenarios to practice systemic skills
                                    </p>
                                </div>
                                <ChevronRight className="w-5 h-5 opacity-40" />
                            </div>
                        </button>

                        <button
                            onClick={() => setView('pulse')}
                            className="w-full glass-panel rounded-[24px] p-6 text-left transition-all hover:scale-[1.02]"
                            style={{ borderLeft: '4px solid #EC4899' }}
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className="p-3 rounded-xl"
                                    style={{ background: 'rgba(236, 72, 153, 0.2)' }}
                                >
                                    <Music className="w-6 h-6" style={{ color: '#EC4899' }} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg">The Listening Pulse</h3>
                                    <p className="text-sm opacity-60">
                                        Silly command games for regulation preloading
                                    </p>
                                </div>
                                <ChevronRight className="w-5 h-5 opacity-40" />
                            </div>
                        </button>
                    </motion.div>
                )}

                {/* Vocation Games List */}
                {view === 'vocation' && !selectedGame && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                    >
                        <button
                            onClick={() => setView('menu')}
                            className="text-sm opacity-60 hover:opacity-100 mb-4"
                        >
                            ← Back to Playbook
                        </button>

                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5" style={{ color: '#A78BFA' }} />
                            Choose Your Vocation Game
                        </h2>

                        <div className="space-y-3">
                            {VOCATION_GAME_TEMPLATES.map(game => (
                                <button
                                    key={game.id}
                                    onClick={() => setSelectedGame(game)}
                                    className="w-full glass-panel rounded-[20px] p-5 text-left transition-all hover:scale-[1.01]"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-bold">{game.title}</h3>
                                        <span
                                            className="text-xs px-2 py-1 rounded-full"
                                            style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#A78BFA' }}
                                        >
                                            {SKILL_LABELS[game.targetSkill]}
                                        </span>
                                    </div>
                                    <p className="text-sm opacity-60">{game.scenario}</p>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Selected Vocation Game */}
                {selectedGame && (
                    <VocationGamePlayer
                        game={selectedGame}
                        onBack={() => setSelectedGame(null)}
                    />
                )}

                {/* Listening Pulse Games List */}
                {view === 'pulse' && !selectedPulse && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                    >
                        <button
                            onClick={() => setView('menu')}
                            className="text-sm opacity-60 hover:opacity-100 mb-4"
                        >
                            ← Back to Playbook
                        </button>

                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Music className="w-5 h-5" style={{ color: '#EC4899' }} />
                            The Listening Pulse
                        </h2>

                        <div className="space-y-3">
                            {LISTENING_PULSE_GAMES.map(game => {
                                const channelMeta = SENSORY_CHANNEL_META[game.sensoryChannel];
                                return (
                                    <button
                                        key={game.id}
                                        onClick={() => startPulseGame(game)}
                                        className="w-full glass-panel rounded-[20px] p-5 text-left transition-all hover:scale-[1.01]"
                                        style={{ borderLeft: `3px solid ${channelMeta.color}` }}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-bold">{game.name}</h3>
                                            <div
                                                className="flex items-center gap-1 text-xs px-2 py-1 rounded-full"
                                                style={{ background: `${channelMeta.color}20`, color: channelMeta.color }}
                                            >
                                                {channelMeta.icon}
                                                {channelMeta.label}
                                            </div>
                                        </div>
                                        <p className="text-sm opacity-60">{game.description}</p>
                                        <p className="text-xs mt-2 opacity-40">
                                            For: {game.targetAge === 'both' ? 'All ages' : game.targetAge === 'child' ? 'Children' : 'Adults'}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {/* Listening Pulse Player */}
                {selectedPulse && isPlaying && (
                    <ListeningPulsePlayer
                        game={selectedPulse}
                        currentIndex={currentCommandIndex}
                        onNext={nextCommand}
                        onFinish={() => {
                            setIsPlaying(false);
                            setSelectedPulse(null);
                            setView('pulse');
                        }}
                    />
                )}
            </div>
        </div>
    );
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface VocationGamePlayerProps {
    game: VocationGame;
    onBack: () => void;
}

const VocationGamePlayer = ({ game, onBack }: VocationGamePlayerProps) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    const nextStep = () => {
        if (currentStep < game.prompts.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            setIsComplete(true);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
        >
            <button
                onClick={onBack}
                className="text-sm opacity-60 hover:opacity-100"
            >
                ← Choose Different Game
            </button>

            <div
                className="glass-panel rounded-[28px] p-8"
                style={{ border: '2px solid rgba(139, 92, 246, 0.3)' }}
            >
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-2">{game.title}</h2>
                    <p className="text-sm opacity-60">{game.scenario}</p>
                </div>

                {/* Roles */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {game.roles.map((role, i) => (
                        <div
                            key={i}
                            className="p-4 rounded-xl text-center"
                            style={{
                                background: i === 0
                                    ? 'rgba(139, 92, 246, 0.1)'
                                    : 'rgba(236, 72, 153, 0.1)'
                            }}
                        >
                            <h4 className="font-bold text-sm mb-1">{role.name}</h4>
                            <p className="text-xs opacity-60">{role.description}</p>
                        </div>
                    ))}
                </div>

                {/* Current Prompt */}
                {!isComplete ? (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center mb-6"
                        >
                            <p className="text-xs opacity-40 mb-2">Step {currentStep + 1} of {game.prompts.length}</p>
                            <p className="text-lg font-medium">{game.prompts[currentStep]}</p>
                        </motion.div>
                    </AnimatePresence>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center mb-6"
                    >
                        <div className="text-4xl mb-2">🎉</div>
                        <p className="text-lg font-bold" style={{ color: '#A78BFA' }}>
                            {game.celebrationPhrase}
                        </p>
                    </motion.div>
                )}

                {/* Controls */}
                {!isComplete ? (
                    <button
                        onClick={nextStep}
                        className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2"
                        style={{
                            background: 'linear-gradient(145deg, rgba(139, 92, 246, 0.6), rgba(236, 72, 153, 0.6))',
                        }}
                    >
                        <ChevronRight className="w-5 h-5" />
                        {currentStep === game.prompts.length - 1 ? 'Celebrate!' : 'Next Step'}
                    </button>
                ) : (
                    <button
                        onClick={onBack}
                        className="w-full py-4 rounded-xl font-bold bg-white/10"
                    >
                        Play Another Game
                    </button>
                )}
            </div>
        </motion.div>
    );
};

interface ListeningPulsePlayerProps {
    game: ListeningPulseGame;
    currentIndex: number;
    onNext: () => void;
    onFinish: () => void;
}

const ListeningPulsePlayer = ({ game, currentIndex, onNext, onFinish }: ListeningPulsePlayerProps) => {
    const currentCommand = game.commands[currentIndex];
    const channelMeta = SENSORY_CHANNEL_META[game.sensoryChannel];
    const isLastCommand = currentIndex === game.commands.length - 1;

    const getIntensityStyle = (intensity: PulseCommand['intensity']) => {
        switch (intensity) {
            case 'silly': return { bg: 'rgba(236, 72, 153, 0.2)', color: '#EC4899' };
            case 'moderate': return { bg: 'rgba(59, 130, 246, 0.2)', color: '#3B82F6' };
            case 'gentle': return { bg: 'rgba(34, 197, 94, 0.2)', color: '#22C55E' };
        }
    };

    const style = getIntensityStyle(currentCommand.intensity);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: 'rgba(0,0,0,0.85)' }}
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="w-full max-w-md text-center"
            >
                {/* Game Title */}
                <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                    style={{ background: `${channelMeta.color}20`, color: channelMeta.color }}
                >
                    {channelMeta.icon}
                    <span className="text-sm font-medium">{game.name}</span>
                </div>

                {/* Command Display */}
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="mb-8"
                >
                    <div
                        className="p-8 rounded-[32px] mb-4"
                        style={{ background: style.bg }}
                    >
                        <p
                            className="text-2xl font-bold"
                            style={{ color: style.color }}
                        >
                            {currentCommand.instruction}
                        </p>
                    </div>

                    {currentCommand.duration && (
                        <p className="text-sm opacity-60">
                            Hold for {currentCommand.duration} seconds
                        </p>
                    )}
                </motion.div>

                {/* Progress */}
                <div className="flex justify-center gap-2 mb-8">
                    {game.commands.map((_, i) => (
                        <div
                            key={i}
                            className="w-3 h-3 rounded-full"
                            style={{
                                background: i === currentIndex
                                    ? channelMeta.color
                                    : i < currentIndex
                                        ? `${channelMeta.color}60`
                                        : 'rgba(255,255,255,0.2)'
                            }}
                        />
                    ))}
                </div>

                {/* Controls */}
                <div className="flex gap-4">
                    <button
                        onClick={onFinish}
                        className="flex-1 py-4 rounded-xl font-medium bg-white/10"
                    >
                        End Game
                    </button>
                    <button
                        onClick={isLastCommand ? onFinish : onNext}
                        className="flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2"
                        style={{
                            background: `linear-gradient(145deg, ${channelMeta.color}80, ${channelMeta.color}40)`,
                        }}
                    >
                        {isLastCommand ? (
                            <>
                                <Star className="w-5 h-5" />
                                Complete!
                            </>
                        ) : (
                            <>
                                <ChevronRight className="w-5 h-5" />
                                Next
                            </>
                        )}
                    </button>
                </div>

                {/* Regulation Goal */}
                <p className="mt-6 text-xs opacity-40 max-w-sm mx-auto">
                    💡 {game.regulationGoal}
                </p>
            </motion.div>
        </motion.div>
    );
};

export default Playbook;
