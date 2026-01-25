/**
 * CAPTURE: Evolved Relational Resonance Interface
 * 
 * Framework: Epigenetic Consciousness
 * - Behavior = Communication
 * - Consequence = Regulation or Misrecognition
 * - Context = History, Body, Culture, Spirit, Power
 * 
 * Features:
 * - Multidimensional schema (strengthNarrative, reciprocity, biological, atmospheric)
 * - Liquid Glass aesthetic with low-friction quick-selects
 * - Gold Shimmer animation on save
 */

import { useState, useRef, useEffect } from 'react';
import { Mic, Camera, Feather, Heart, Loader2, Sparkles, StopCircle, FileText } from 'lucide-react';
import { useAuthStore } from '../../core/stores/useAuthStore';
import { saveObservation } from '../../core/firebase/firestore';
import { RESONANCE_CHANNELS, type ResonanceChannel, type ReciprocityLevel } from '../../core/stores/types';
import { convertSpeechToNarrative } from '../../lib/ai/agents/oracle';

// Web Speech API Type Declarations
interface SpeechRecognitionResult {
    isFinal: boolean;
    [index: number]: { transcript: string };
}

interface SpeechRecognitionResultList {
    length: number;
    [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEventType {
    resultIndex: number;
    results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEventType {
    error: string;
}

interface SpeechRecognitionType {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: ((event: SpeechRecognitionEventType) => void) | null;
    onerror: ((event: SpeechRecognitionErrorEventType) => void) | null;
    onend: (() => void) | null;
    start: () => void;
    stop: () => void;
}

interface WindowWithSpeech {
    SpeechRecognition?: new () => SpeechRecognitionType;
    webkitSpeechRecognition?: new () => SpeechRecognitionType;
}


// Biological State Tags
const BIOLOGICAL_STATES = [
    { label: 'Sensory Overload', emoji: '⚡' },
    { label: 'Hungry', emoji: '🍎' },
    { label: 'Sleepy', emoji: '😴' },
    { label: 'Regulated', emoji: '✨' },
    { label: 'Movement Need', emoji: '🏃' },
    { label: 'Calm', emoji: '🌿' },
] as const;

type BiologicalState = typeof BIOLOGICAL_STATES[number]['label'];

interface CaptureProps {
  onNavigate?: (view: string) => void;
}

export const Capture = ({ onNavigate }: CaptureProps) => {
    const { user } = useAuthStore();
    const [strengthNarrative, setStrengthNarrative] = useState('');
    const [selectedChannels, setSelectedChannels] = useState<ResonanceChannel[]>([]);
    const [atmosphericResonance, setAtmosphericResonance] = useState('');
    const [relationalReciprocity, setRelationalReciprocity] = useState<ReciprocityLevel>(3);
    const [biologicalStates, setBiologicalStates] = useState<BiologicalState[]>([]);
    const [saving, setSaving] = useState(false);
    const [showGoldShimmer, setShowGoldShimmer] = useState(false);

    // Vocal Capture State
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [processingVoice, setProcessingVoice] = useState(false);
    const recognitionRef = useRef<SpeechRecognitionType | null>(null);
    const [voiceSupported, setVoiceSupported] = useState(true);

    // Check for Web Speech API support
    useEffect(() => {
        const win = window as WindowWithSpeech;
        const SpeechRecognitionAPI = win.SpeechRecognition || win.webkitSpeechRecognition;
        if (!SpeechRecognitionAPI) {
            setVoiceSupported(false);
        }
    }, []);

    const toggleChannel = (channel: ResonanceChannel) => {
        setSelectedChannels(prev =>
            prev.includes(channel)
                ? prev.filter(c => c !== channel)
                : [...prev, channel]
        );
    };

    const toggleBiologicalState = (state: BiologicalState) => {
        setBiologicalStates(prev =>
            prev.includes(state)
                ? prev.filter(s => s !== state)
                : [...prev, state]
        );
    };

    // VOCAL CAPTURE: Start/Stop Recording
    const toggleRecording = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const startRecording = () => {
        const win = window as WindowWithSpeech;
        const SpeechRecognitionAPI = win.SpeechRecognition || win.webkitSpeechRecognition;
        if (!SpeechRecognitionAPI) {
            alert('Voice input is not supported in this browser.');
            return;
        }

        const recognition = new SpeechRecognitionAPI();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: SpeechRecognitionEventType) => {
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    finalTranscript += result[0].transcript;
                }
            }

            if (finalTranscript) {
                setTranscript(prev => prev + finalTranscript);
            }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEventType) => {
            console.error('Speech recognition error:', event.error);
            setIsRecording(false);
        };

        recognition.onend = () => {
            setIsRecording(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
        setIsRecording(true);
        setTranscript('');
    };

    const stopRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsRecording(false);

        // Process the transcript
        if (transcript.trim()) {
            setProcessingVoice(true);

            // Use Oracle to convert speech to narrative
            const narrativeResult = convertSpeechToNarrative(transcript, 'your child');

            // Set the structured narrative as the strength narrative
            setStrengthNarrative(narrativeResult.structuredNarrative);

            // Auto-select suggested channels
            const suggested = narrativeResult.suggestedChannels
                .filter(c => RESONANCE_CHANNELS.includes(c as ResonanceChannel)) as ResonanceChannel[];
            setSelectedChannels(suggested);

            // Set estimated reciprocity
            setRelationalReciprocity(narrativeResult.estimatedReciprocity as ReciprocityLevel);

            setProcessingVoice(false);
        }
    };

    const handleHonor = async () => {
        if (!user || !strengthNarrative.trim()) return;

        setSaving(true);
        try {
            await saveObservation(user.uid, {
                strengthNarrative,
                channels: selectedChannels,
                atmosphericResonance,
                relationalReciprocity,
                biologicalNeeds: biologicalStates.join(', '),
            });

            // Trigger Gold Shimmer animation
            setShowGoldShimmer(true);
            setTimeout(() => setShowGoldShimmer(false), 2000);

            // Reset form after delay to let user see the shimmer
            setTimeout(() => {
                setStrengthNarrative('');
                setSelectedChannels([]);
                setAtmosphericResonance('');
                setRelationalReciprocity(3);
                setBiologicalStates([]);
            }, 500);

        } catch (error) {
            console.error('Failed to save observation:', error);
        } finally {
            setSaving(false);
        }
    };

    const reciprocityLabels = ['Disconnected', 'Distant', 'Present', 'Connected', 'Mutual Recognition'];
    const channelIcons: Record<string, string> = {
        'Seeking Safety': '🛡️',
        'Sensory Need': '✨',
        'Connection Bid': '💜',
        'Transition Signal': '🌊',
        'Body Wisdom': '🧘',
        'Joy Expression': '🌈',
    };

    return (
        <div className="flex flex-col h-full pt-6 pb-32 px-4 fade-in overflow-y-auto relative">

            {/* GOLD SHIMMER OVERLAY */}
            {showGoldShimmer && (
                <div
                    className="fixed inset-0 pointer-events-none z-50"
                    style={{
                        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.4) 0%, rgba(255, 215, 0, 0.2) 50%, rgba(212, 175, 55, 0.4) 100%)',
                        animation: 'goldShimmer 2s ease-out forwards',
                    }}
                >
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center animate-pulse">
                            <Sparkles className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
                            <p
                                className="text-xl font-bold"
                                style={{ fontFamily: 'var(--font-display)', color: '#D4AF37' }}
                            >
                                Moment Honored
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* HEADER */}
            <header className="mb-6">
                <h2 className="text-sm font-bold tracking-widest text-[#4B0082] uppercase opacity-80">
                    Witness
                </h2>
                <h1
                    className="text-3xl mt-1"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                >
                    What was communicated?
                </h1>
                <p className="text-sm mt-2 opacity-70" style={{ color: 'var(--text-secondary)' }}>
                    Every signal is an invitation to understand.
                </p>
                
                {/* Centering Cue for Parents */}
                <div className="mt-4 p-3 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                    <p className="text-sm italic text-center" style={{ color: 'var(--text-primary)', opacity: 0.8 }}>
                        🌿 Take a breath. You are witnessing, not fixing.
                    </p>
                </div>
            </header>

            {/* STRENGTH NARRATIVE (Main Text Area) */}
            <div className="glass-panel p-4 rounded-[24px] mb-4">
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-bold opacity-80" style={{ color: 'var(--text-primary)' }}>
                        What did you witness?
                    </label>

                    {/* VOCAL CAPTURE BUTTON - Gold Leaf Premium */}
                    {voiceSupported && (
                        <button
                            onClick={toggleRecording}
                            disabled={processingVoice}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${isRecording
                                ? 'bg-red-500 text-white animate-pulse'
                                : 'gold-leaf-border text-[#D4AF37] hover:scale-[1.02]'
                                }`}
                            style={!isRecording ? {
                                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(75, 0, 130, 0.1) 100%)',
                            } : undefined}
                        >
                            {processingVoice ? (
                                <>
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    Processing...
                                </>
                            ) : isRecording ? (
                                <>
                                    <StopCircle className="w-3 h-3" />
                                    Stop
                                </>
                            ) : (
                                <>
                                    <Mic className="w-3 h-3" />
                                    Talk to Log
                                </>
                            )}
                        </button>
                    )}
                </div>

                {/* Recording Status */}
                {isRecording && (
                    <div className="bg-red-50 rounded-xl p-3 mb-3 flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                        <div className="flex-1">
                            <p className="text-xs font-semibold text-red-700">Recording...</p>
                            <p className="text-xs text-red-600 opacity-70">
                                {transcript || 'Speak your observation...'}
                            </p>
                        </div>
                    </div>
                )}

                <textarea
                    className="w-full bg-transparent text-base placeholder-[#1A1A1A]/40 resize-none focus:outline-none min-h-[120px]"
                    style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
                    placeholder="Describe what you witnessed with dignity...

• What was the body communicating?
• How did you respond?
• What strength was revealed?"
                    value={strengthNarrative}
                    onChange={(e) => setStrengthNarrative(e.target.value)}
                />
            </div>

            {/* CONNECTION LEVEL - Simplified */}
            <div className="glass-panel p-4 rounded-[24px] mb-4">
                <label className="text-sm font-bold opacity-80 mb-2 block" style={{ color: 'var(--text-primary)' }}>
                    How connected did you feel?
                </label>
                <p className="text-sm opacity-60 mb-4" style={{ fontFamily: 'var(--font-body)' }}>
                    Trust your gut — there's no wrong answer.
                </p>

                {/* Glass Slider Track */}
                <div className="relative h-12 bg-white/20 rounded-2xl overflow-hidden mb-2">
                    {/* Fill */}
                    <div
                        className="absolute left-0 top-0 h-full bg-linear-to-r from-[#4B0082]/60 to-[#4B0082] transition-all duration-300 rounded-2xl"
                        style={{ width: `${(relationalReciprocity / 5) * 100}%` }}
                    />

                    {/* Buttons */}
                    <div className="absolute inset-0 flex">
                        {([1, 2, 3, 4, 5] as ReciprocityLevel[]).map((level) => (
                            <button
                                key={level}
                                onClick={() => setRelationalReciprocity(level)}
                                className={`flex-1 flex items-center justify-center text-lg font-bold transition-all z-10 ${relationalReciprocity >= level ? 'text-white' : 'text-[#1A1A1A]/50'
                                    }`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>

                <p className="text-center text-sm font-medium" style={{ color: 'var(--accent-regal)' }}>
                    {reciprocityLabels[relationalReciprocity - 1]}
                </p>
            </div>

            {/* BODY SIGNALS - Simplified */}
            <div className="glass-panel p-4 rounded-[24px] mb-4">
                <label className="text-sm font-bold opacity-80 mb-2 block" style={{ color: 'var(--text-primary)' }}>
                    What was happening in the body?
                </label>
                <p className="text-sm opacity-60 mb-3" style={{ fontFamily: 'var(--font-body)' }}>
                    Select all that apply — trust what you noticed.
                </p>
                <div className="flex flex-wrap gap-2">
                    {BIOLOGICAL_STATES.map(({ label, emoji }) => {
                        const isSelected = biologicalStates.includes(label);
                        return (
                            <button
                                key={label}
                                onClick={() => toggleBiologicalState(label)}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${isSelected
                                    ? 'bg-[#D4AF37] text-white shadow-md'
                                    : 'bg-white/30 border border-white/40 text-[#1A1A1A]/70 hover:bg-white/50'
                                    }`}
                            >
                                <span className="mr-1">{emoji}</span>
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* CONTEXT - Simplified */}
            <div className="glass-panel p-4 rounded-[24px] mb-4">
                <label className="text-sm font-bold opacity-80 mb-2 block" style={{ color: 'var(--text-primary)' }}>
                    What else was going on?
                </label>
                <p className="text-sm opacity-60 mb-3" style={{ fontFamily: 'var(--font-body)' }}>
                    Any context that matters (school day, tired, transition...)
                </p>
                <input
                    type="text"
                    className="w-full bg-white/20 rounded-xl text-base placeholder-[#1A1A1A]/40 focus:outline-none p-3 border border-white/30 focus:border-[#4B0082]/50 transition-colors"
                    style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
                    placeholder="e.g., Post-IEP exhaustion, Sunday rest energy"
                    value={atmosphericResonance}
                    onChange={(e) => setAtmosphericResonance(e.target.value)}
                />
            </div>

            {/* HOW THEY COMMUNICATED - Simplified */}
            <div className="mb-4">
                <h3 className="text-sm font-bold opacity-80 mb-1" style={{ color: 'var(--text-primary)' }}>
                    How did they communicate?
                </h3>
                <p className="text-xs opacity-60 mb-3">Select any that apply</p>
                <div className="flex flex-wrap gap-2">
                    {RESONANCE_CHANNELS.map((channel) => {
                        const isSelected = selectedChannels.includes(channel);
                        return (
                            <button
                                key={channel}
                                onClick={() => toggleChannel(channel)}
                                className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${isSelected
                                    ? 'bg-[#4B0082] text-white shadow-md'
                                    : 'bg-white/30 border border-white/40 text-[#1A1A1A]/70 hover:bg-white/50'
                                    }`}
                            >
                                <span className="mr-1">{channelIcons[channel]}</span>
                                {channel}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ACTION BAR */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-3">
                    <button className="p-3 rounded-full bg-white/40 hover:bg-white/60 transition-colors shadow-sm">
                        <Mic className="w-5 h-5 text-[#4B0082]" />
                    </button>
                    <button className="p-3 rounded-full bg-white/40 hover:bg-white/60 transition-colors shadow-sm">
                        <Camera className="w-5 h-5 text-[#4B0082]" />
                    </button>
                    {/* Export Button */}
                    {onNavigate && (
                        <button 
                            onClick={() => onNavigate('ExportCenter')}
                            className="p-3 rounded-full bg-[#D4AF37]/20 hover:bg-[#D4AF37]/40 transition-colors shadow-sm border border-[#D4AF37]/30"
                            title="Export observations as PDF"
                        >
                            <FileText className="w-5 h-5 text-[#D4AF37]" />
                        </button>
                    )}
                </div>

                <button
                    onClick={handleHonor}
                    disabled={!strengthNarrative.trim() || saving}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-full font-bold transition-all shadow-lg ${strengthNarrative.trim() && !saving
                        ? 'bg-linear-to-r from-[#4B0082] to-[#6B238E] text-white hover:shadow-xl active:scale-95'
                        : 'bg-gray-300/50 text-gray-500'
                        }`}
                >
                    {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Feather className="w-4 h-4" />
                    )}
                    <span>{saving ? 'Honoring...' : 'Honor This Moment'}</span>
                </button>
            </div>

            {/* GROUNDING AFFIRMATION */}
            <p className="text-xs opacity-50 text-center flex items-center justify-center gap-2">
                <Heart className="w-3 h-3" />
                This is witnessing, not surveillance.
            </p>

            {/* GOLD SHIMMER ANIMATION KEYFRAMES */}
            <style>{`
        @keyframes goldShimmer {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          20% {
            opacity: 1;
            transform: scale(1);
          }
          80% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>

        </div>
    );
};
