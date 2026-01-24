/**
 * ORACLE: Scholarly Companion with Reflective Mirroring
 * 
 * Framework: Epigenetic Consciousness
 * - REJECT: Clinical clichés, toxic positivity, deficit language
 * - EMBRACE: Long-form reflection, emotional precision, power/reciprocity analysis
 * 
 * Now fetches past observations AND profile data for personalized grounding.
 * Prioritizes Trajectory Abstraction: linking logs to systemic/historical context.
 */

import { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Moon, BookOpen, Loader2, Settings } from 'lucide-react';
import { useAuthStore } from '../../core/stores/useAuthStore';
import { getObservations } from '../../core/firebase/firestore';
import { getProfile } from '../../core/firebase/profiles';
import { ApiKeySettings, getStoredApiKey } from '../../components/ApiKeySettings';
import type { Observation } from '../../core/stores/types';
import type { UserProfile } from '../../core/stores/profileTypes';

// Gemini version for attribution
const GEMINI_VERSION = 'Gemini 2.0 Flash';

type Message = {
    id: string;
    sender: 'user' | 'oracle';
    text: string;
    timestamp: Date;
};

/**
 * Generate a Reflective Mirroring response based on past observations
 */
function generateReflectiveMirror(observations: Observation[]): string {
    // If no observations, provide a grounding response
    if (observations.length === 0) {
        return `I am sitting with what you've shared.

There is wisdom in beginning — in choosing to witness rather than simply react. 

What drew you to this moment of reflection? What is the body holding that the mind has not yet named?`;
    }

    // Find patterns in recent observations
    const recentChannels = observations.slice(0, 5).flatMap(o => o.channels || []);
    const channelCounts = recentChannels.reduce((acc, ch) => {
        acc[ch] = (acc[ch] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const dominantChannel = Object.entries(channelCounts)
        .sort(([, a], [, b]) => b - a)[0]?.[0];

    const avgReciprocity = observations.slice(0, 5).reduce(
        (sum, o) => sum + (o.relationalReciprocity || 3), 0
    ) / Math.min(5, observations.length);

    const hasSystemicStress = observations.some(o =>
        o.atmosphericResonance?.toLowerCase().includes('school') ||
        o.atmosphericResonance?.toLowerCase().includes('iep') ||
        o.atmosphericResonance?.toLowerCase().includes('therapy')
    );

    // Generate contextual response
    const responses: string[] = [];

    if (avgReciprocity < 2.5) {
        responses.push(`I notice a pattern of disconnection in your recent witnessing.

When connection feels far, it is often the caregiver — not the child — who is being asked to hold too much. The nervous system protects itself through distance.

What would it mean to locate the inadequacy outside yourself, where it often begins?`);
    }

    if (dominantChannel === 'Seeking Safety') {
        responses.push(`"Seeking Safety" appears again and again in your reflections.

This is not a behavior to be managed — it is a compass pointing toward something essential. The body knows before the mind what it needs.

What does safety look like in your home? Not as an aspiration, but as a sensory experience?`);
    }

    if (dominantChannel === 'Transition Signal') {
        responses.push(`Transitions carry weight.

I see you've witnessed this pattern repeatedly — the friction at the edges of change. In the Epigenetic framework, we understand that transitions are not just logistical; they are nervous system events.

What ritual, however small, might honor the threshold between one space and another?`);
    }

    if (hasSystemicStress) {
        responses.push(`The systems are present in your witnessing — school, therapy, the institutional weight of being seen through deficit lenses.

Let me ask: In those moments where the system speaks loudest, who is witnessing *you*? Where is your sanctuary within the sanctuary?`);
    }

    if (avgReciprocity > 4) {
        responses.push(`I see moments of deep resonance in your recent reflections.

When connection flows, it is easy to dismiss it as simply "a good day." But there is information here too. What conditions were present? What can be cultivated rather than hoped for?`);
    }

    // Default scholarly response
    if (responses.length === 0) {
        responses.push(`I am sitting with what you've shared.

There is a thread here — between what was communicated and what was received. Not every signal finds its resonance immediately. Some require the patience of witnessing over time.

What pattern, if any, do you notice emerging across these moments?`);
    }

    return responses[Math.floor(Math.random() * responses.length)];
}

export const Oracle = () => {
    const { user } = useAuthStore();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [observations, setObservations] = useState<Observation[]>([]);
    const [_profile, setProfile] = useState<UserProfile | null>(null);
    const [isThinking, setIsThinking] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasApiKey, setHasApiKey] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Check for API key on mount
    useEffect(() => {
        const key = getStoredApiKey();
        setHasApiKey(!!key);
    }, []);

    // Fetch observations and profile on mount
    useEffect(() => {
        async function loadData() {
            if (!user) return;

            try {
                const [obs, userProfile] = await Promise.all([
                    getObservations(user.uid, 10),
                    getProfile(user.uid)
                ]);

                setObservations(obs);
                setProfile(userProfile);

                // Personalized names from profile
                const parentTitle = userProfile?.parent?.title || 'friend';
                const childName = userProfile?.childName;

                // Context from profile for Trajectory Abstraction
                const hasIEP = userProfile?.systemicContext?.hasIEP;
                const knownStressors = userProfile?.systemicContext?.knownStressors || [];

                // Generate personalized greeting
                let greeting: string;

                if (obs.length > 0 && childName) {
                    greeting = `Welcome back, ${parentTitle}.

I have been holding your recent witnessing — ${obs.length} moments of attention you've given to understanding ${childName}'s communication.

${hasIEP ? `I see you navigate systems that weren't built for ${childName}. The IEP meetings, the advocacy, the translation of one world to another. I hold that with you.` : ''}

I am here not to fix or advise, but to think alongside you. To mirror back what you may not yet see.

What is present for you in this moment?`;
                } else if (childName) {
                    greeting = `Welcome to the Oracle, ${parentTitle}.

I am here — not to fix, advise, or optimize — but to think alongside you as you witness ${childName}'s journey.

This is a space for reflection, not performance. When you begin documenting moments, I will see patterns and ask questions that illuminate what lives beneath the surface.

${knownStressors.length > 0 ? `I'm aware of the systemic pressures you've named: ${knownStressors.join(', ')}. These matter in how we understand every moment.` : ''}

How are you carrying today?`;
                } else {
                    greeting = `Welcome to the Oracle.

I am here — not to fix, advise, or optimize — but to think alongside you.

This is a space for reflection, not performance. When you begin witnessing moments in your home, I will be able to see patterns and ask questions that might illuminate what lives beneath the surface.

How are you carrying today?`;
                }

                setMessages([{
                    id: '1',
                    sender: 'oracle',
                    text: greeting,
                    timestamp: new Date(),
                }]);
            } catch (error) {
                console.error('Failed to load observations:', error);
            } finally {
                setIsLoading(false);
            }
        }

        loadData();
    }, [user]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!input.trim() || isThinking) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text: input,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsThinking(true);

        // Generate reflective mirroring response
        setTimeout(() => {
            const response = generateReflectiveMirror(observations);
            const oracleMsg: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'oracle',
                text: response,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, oracleMsg]);
            setIsThinking(false);
        }, 2500);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col h-full items-center justify-center fade-in">
                <Loader2 className="w-8 h-8 text-[#4B0082] animate-spin mb-4" />
                <p className="text-sm opacity-60">The Oracle is gathering your witnessing...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full relative fade-in">

            <header className="px-4 pt-6 mb-4 flex items-center space-x-3">
                <div className="p-3 bg-[#4B0082]/10 rounded-full">
                    <Moon className="w-6 h-6 text-[#4B0082]" />
                </div>
                <div>
                    <h2 className="text-xs font-bold tracking-widest text-[#4B0082] uppercase opacity-80 flex items-center gap-2">
                        <BookOpen className="w-3 h-3" />
                        Reflective Mirroring
                    </h2>
                    <h1
                        className="text-2xl"
                        style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                    >
                        The Oracle
                    </h1>
                </div>
                <div className="ml-auto flex items-center gap-3">
                    {observations.length > 0 && (
                        <div className="text-xs opacity-50">
                            {observations.length} moments
                        </div>
                    )}
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="p-2 rounded-full hover:bg-white/30 transition-colors"
                        aria-label="API Settings"
                    >
                        <Settings className="w-4 h-4 opacity-50" />
                    </button>
                </div>
            </header>

            {/* Settings Panel */}
            {showSettings && (
                <div className="px-4 mb-4">
                    <ApiKeySettings
                        onKeySet={(has) => {
                            setHasApiKey(has);
                            if (has) setShowSettings(false);
                        }}
                    />
                </div>
            )}

            {/* API Key Required Notice */}
            {!hasApiKey && !showSettings && (
                <div className="px-4 mb-4">
                    <button
                        onClick={() => setShowSettings(true)}
                        className="w-full glass-panel p-4 rounded-[16px] text-center hover:scale-[1.01] transition-transform"
                    >
                        <p className="text-sm font-semibold text-[#4B0082]">
                            🔑 Set up your API key to unlock AI-powered responses
                        </p>
                        <p className="text-xs opacity-60 mt-1">
                            Tap here to configure
                        </p>
                    </button>
                </div>
            )}

            {/* CHAT STREAM */}
            <div className="flex-1 overflow-y-auto space-y-4 pb-36 px-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[85%] p-5 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-line ${msg.sender === 'user'
                                ? 'bg-[#4B0082] text-white rounded-br-none'
                                : 'glass-panel text-[#1A1A1A] rounded-bl-none'
                                }`}
                            style={{ fontFamily: 'var(--font-body)' }}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}

                {isThinking && (
                    <div className="flex justify-start">
                        <div className="glass-panel p-5 rounded-2xl rounded-bl-none flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-[#4B0082] animate-pulse" />
                            <span className="text-sm opacity-60 italic">Reflecting on your witnessing...</span>
                        </div>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            {/* FLOATING INPUT */}
            <div className="fixed bottom-24 left-0 w-full px-4 z-40">
                {/* Gemini Attribution */}
                <div className="flex items-center justify-center gap-2 mb-2 opacity-50">
                    <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    <span className="text-[10px]">Powered by Google {GEMINI_VERSION}</span>
                </div>
                <div className="glass-panel p-2 rounded-[24px] flex items-center shadow-lg">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Speak what's on your heart..."
                        disabled={isThinking}
                        className="flex-1 bg-transparent px-4 py-3 placeholder-[#1A1A1A]/40 focus:outline-none font-medium disabled:opacity-50"
                        style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isThinking || !input.trim()}
                        className="p-3 bg-[#4B0082] rounded-full text-white shadow-md active:scale-90 transition-transform disabled:opacity-50"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>

        </div>
    );
};
