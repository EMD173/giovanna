/**
 * MULTIMODAL CAPTURE: Divine Neural Interface
 * 
 * An evolved relational witnessing interface with:
 * - Talk-to-Text: Hands-free voice capture via Web Speech API
 * - Read-Back: Oracle vocalizes reflections for mutual recognition
 * - Wisdom Refraction: Spiritual anchors surface during low reciprocity
 * 
 * Framework: Epigenetic Consciousness + Trauma-Informed Care
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mic,
    MicOff,
    Volume2,
    VolumeX,
    Sparkles,
    Heart,
    Brain,
    AlertTriangle,
    Save,
    RefreshCw,
    BookOpen,
    Pause,
    Play
} from 'lucide-react';
import {
    RESONANCE_CHANNELS,
    type ResonanceChannel,
    type ReciprocityLevel
} from '../../core/stores/types';
import { saveObservation } from '../../core/firebase/firestore';
import { useAuthStore } from '../../core/stores/useAuthStore';
import {
    getWisdomRefraction,
    type WisdomRefraction,
    type WisdomAnchor
} from '../wellness/WisdomVault';
import { convertSpeechToNarrative } from '../../lib/ai/agents/oracle';

// ============================================================================
// WEB SPEECH API TYPES
// ============================================================================

interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}

interface SpeechRecognitionResult {
    isFinal: boolean;
    length: number;
    [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
    length: number;
    [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent {
    resultIndex: number;
    results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
    error: string;
}

interface SpeechRecognitionInstance {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
    onend: (() => void) | null;
    start: () => void;
    stop: () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

interface MultimodalCaptureProps {
    onComplete?: () => void;
    spiritualAnchors?: WisdomAnchor[];
}

export const MultimodalCapture = ({
    onComplete,
    spiritualAnchors = ['secular']
}: MultimodalCaptureProps) => {
    const { user } = useAuthStore();

    // Speech Recognition State
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');
    const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

    // Read-Back (TTS) State
    const [isReading, setIsReading] = useState(false);
    const [readBackEnabled, setReadBackEnabled] = useState(true);
    const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);

    // Observation State
    const [channels, setChannels] = useState<ResonanceChannel[]>([]);
    const [reciprocity, setReciprocity] = useState<ReciprocityLevel>(3);
    const [atmosphericContext, setAtmosphericContext] = useState('');
    const [biologicalState, setBiologicalState] = useState('');

    // Oracle State
    const [oracleReflection, setOracleReflection] = useState<string>('');
    const [wisdomRefraction, setWisdomRefraction] = useState<WisdomRefraction | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Check for Web Speech API support
    const speechSupported = typeof window !== 'undefined' &&
        ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
    const ttsSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

    // ========================================================================
    // SPEECH RECOGNITION (Talk-to-Text)
    // ========================================================================

    const startRecording = useCallback(() => {
        if (!speechSupported) return;

        const SpeechRecognition = (window as unknown as {
            SpeechRecognition?: new () => SpeechRecognitionInstance;
            webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
        }).SpeechRecognition || (window as unknown as {
            webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
        }).webkitSpeechRecognition;

        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let finalTranscript = '';
            let interim = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result[0]) {
                    if (result.isFinal) {
                        finalTranscript += result[0].transcript + ' ';
                    } else {
                        interim += result[0].transcript;
                    }
                }
            }

            if (finalTranscript) {
                setTranscript(prev => prev + finalTranscript);
            }
            setInterimTranscript(interim);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error('Speech recognition error:', event.error);
            setIsRecording(false);
        };

        recognition.onend = () => {
            setIsRecording(false);
            setInterimTranscript('');
        };

        recognitionRef.current = recognition;
        recognition.start();
        setIsRecording(true);
    }, [speechSupported]);

    const stopRecording = useCallback(async () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
        setIsRecording(false);
        setInterimTranscript('');

        // Process the transcript into a dignity-centered narrative
        if (transcript.trim()) {
            setIsProcessing(true);
            try {
                const narrativeResult = convertSpeechToNarrative(transcript, 'your child');
                setOracleReflection(narrativeResult.structuredNarrative);

                // Check for wisdom refraction if reciprocity is low
                if (reciprocity < 2) {
                    const wisdom = getWisdomRefraction(reciprocity, spiritualAnchors);
                    setWisdomRefraction(wisdom);
                }
            } catch (error) {
                console.error('Failed to process narrative:', error);
            } finally {
                setIsProcessing(false);
            }
        }
    }, [transcript, reciprocity, spiritualAnchors]);

    // ========================================================================
    // TEXT-TO-SPEECH (Read-Back)
    // ========================================================================

    const speakText = useCallback((text: string) => {
        if (!ttsSupported || !readBackEnabled) return;

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;  // Slightly slower for presence
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Try to use a warm, calm voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v =>
            v.name.includes('Samantha') ||
            v.name.includes('Karen') ||
            v.name.includes('Victoria') ||
            v.lang.startsWith('en')
        );
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        utterance.onstart = () => setIsReading(true);
        utterance.onend = () => setIsReading(false);
        utterance.onerror = () => setIsReading(false);

        speechSynthRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    }, [ttsSupported, readBackEnabled]);

    const stopSpeaking = useCallback(() => {
        window.speechSynthesis.cancel();
        setIsReading(false);
    }, []);

    // Read back Oracle reflection when it changes
    useEffect(() => {
        if (oracleReflection && readBackEnabled && !isRecording) {
            speakText(oracleReflection);
        }
    }, [oracleReflection, readBackEnabled, isRecording, speakText]);

    // Read back wisdom refraction
    const readWisdom = useCallback(() => {
        if (wisdomRefraction) {
            speakText(wisdomRefraction.readBackText);
        }
    }, [wisdomRefraction, speakText]);

    // ========================================================================
    // SAVE OBSERVATION
    // ========================================================================

    const handleSave = async () => {
        if (!user || !transcript.trim()) return;

        setIsSaving(true);
        try {
            await saveObservation(user.uid, {
                strengthNarrative: oracleReflection || transcript,
                channels,
                atmosphericResonance: atmosphericContext,
                relationalReciprocity: reciprocity,
                biologicalNeeds: biologicalState,
            });

            // Reset form
            setTranscript('');
            setOracleReflection('');
            setWisdomRefraction(null);
            setChannels([]);
            setReciprocity(3);
            setAtmosphericContext('');
            setBiologicalState('');

            onComplete?.();
        } catch (error) {
            console.error('Failed to save observation:', error);
        } finally {
            setIsSaving(false);
        }
    };

    // ========================================================================
    // RENDER
    // ========================================================================

    return (
        <div className="min-h-screen p-4 pb-24">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1
                        className="text-2xl font-bold mb-2"
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            color: 'var(--text-primary)',
                        }}
                    >
                        Divine Witness
                    </h1>
                    <p className="text-sm opacity-60">
                        Speak your child's story. The Oracle listens.
                    </p>
                </motion.div>

                {/* Voice Capture Area */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-panel rounded-[32px] p-6 mb-6"
                >
                    {/* Microphone Button */}
                    <div className="flex justify-center mb-6">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={isRecording ? stopRecording : startRecording}
                            disabled={!speechSupported}
                            className="relative w-24 h-24 rounded-full flex items-center justify-center transition-all"
                            style={{
                                background: isRecording
                                    ? 'linear-gradient(145deg, rgba(239, 68, 68, 0.4) 0%, rgba(220, 38, 38, 0.6) 100%)'
                                    : 'linear-gradient(145deg, rgba(139, 92, 246, 0.3) 0%, rgba(167, 139, 250, 0.4) 100%)',
                                border: `2px solid ${isRecording ? 'rgba(239, 68, 68, 0.5)' : 'rgba(139, 92, 246, 0.4)'}`,
                                boxShadow: isRecording
                                    ? '0 0 40px rgba(239, 68, 68, 0.3)'
                                    : '0 8px 32px rgba(139, 92, 246, 0.2)',
                            }}
                        >
                            {isRecording ? (
                                <MicOff className="w-10 h-10 text-red-400" />
                            ) : (
                                <Mic className="w-10 h-10" style={{ color: '#A78BFA' }} />
                            )}

                            {/* Pulse animation when recording */}
                            {isRecording && (
                                <motion.div
                                    className="absolute inset-0 rounded-full"
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    style={{
                                        background: 'rgba(239, 68, 68, 0.3)',
                                        border: '2px solid rgba(239, 68, 68, 0.4)',
                                    }}
                                />
                            )}
                        </motion.button>
                    </div>

                    {/* Recording Status */}
                    <div className="text-center text-sm mb-4">
                        {!speechSupported ? (
                            <span className="text-red-400">Voice capture not supported in this browser</span>
                        ) : isRecording ? (
                            <span className="text-red-400 animate-pulse">● Recording... Tap to stop</span>
                        ) : (
                            <span className="opacity-60">Tap to begin witnessing</span>
                        )}
                    </div>

                    {/* Transcript Display */}
                    {(transcript || interimTranscript) && (
                        <div
                            className="p-4 rounded-2xl min-h-[100px] mb-4"
                            style={{ background: 'rgba(255,255,255,0.05)' }}
                        >
                            <p className="text-sm leading-relaxed">
                                {transcript}
                                <span className="opacity-50">{interimTranscript}</span>
                            </p>
                        </div>
                    )}

                    {/* Read-Back Toggle */}
                    <div className="flex items-center justify-between py-3 border-t border-white/10">
                        <div className="flex items-center gap-2">
                            {readBackEnabled ? (
                                <Volume2 className="w-4 h-4 opacity-60" />
                            ) : (
                                <VolumeX className="w-4 h-4 opacity-40" />
                            )}
                            <span className="text-sm opacity-60">Oracle Read-Back</span>
                        </div>
                        <button
                            onClick={() => setReadBackEnabled(!readBackEnabled)}
                            className="relative w-12 h-6 rounded-full transition-colors"
                            style={{
                                background: readBackEnabled
                                    ? 'rgba(139, 92, 246, 0.6)'
                                    : 'rgba(255,255,255,0.1)',
                            }}
                        >
                            <motion.div
                                className="absolute top-1 w-4 h-4 rounded-full bg-white"
                                animate={{ left: readBackEnabled ? '28px' : '4px' }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                        </button>
                    </div>
                </motion.div>

                {/* Oracle Reflection */}
                <AnimatePresence>
                    {isProcessing && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="glass-panel rounded-[24px] p-6 mb-6 text-center"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                className="inline-block mb-3"
                            >
                                <Brain className="w-8 h-8" style={{ color: '#A78BFA' }} />
                            </motion.div>
                            <p className="text-sm opacity-60">The Oracle is processing...</p>
                        </motion.div>
                    )}

                    {oracleReflection && !isProcessing && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="glass-panel rounded-[24px] p-6 mb-6"
                            style={{
                                border: '2px solid rgba(139, 92, 246, 0.3)',
                            }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5" style={{ color: '#A78BFA' }} />
                                    <span className="font-semibold">Oracle Reflection</span>
                                </div>
                                <button
                                    onClick={() => isReading ? stopSpeaking() : speakText(oracleReflection)}
                                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                                >
                                    {isReading ? (
                                        <Pause className="w-4 h-4" />
                                    ) : (
                                        <Play className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            <p className="text-sm leading-relaxed opacity-80 italic">
                                "{oracleReflection}"
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Wisdom Refraction (appears when reciprocity < 2) */}
                <AnimatePresence>
                    {wisdomRefraction && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="glass-panel rounded-[24px] p-6 mb-6"
                            style={{
                                background: 'linear-gradient(145deg, rgba(212, 175, 55, 0.1) 0%, rgba(255,255,255,0.02) 100%)',
                                border: '2px solid rgba(212, 175, 55, 0.3)',
                            }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="w-5 h-5" style={{ color: '#D4AF37' }} />
                                    <span className="font-semibold" style={{ color: '#D4AF37' }}>
                                        Wisdom Refraction
                                    </span>
                                </div>
                                <button
                                    onClick={readWisdom}
                                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                                    style={{ color: '#D4AF37' }}
                                >
                                    <Volume2 className="w-4 h-4" />
                                </button>
                            </div>

                            <blockquote className="text-sm leading-relaxed mb-3 italic">
                                "{wisdomRefraction.entry.quote}"
                            </blockquote>
                            <p className="text-xs opacity-60 mb-3">
                                — {wisdomRefraction.entry.source}
                            </p>
                            <p className="text-sm opacity-80">
                                {wisdomRefraction.personalizedReflection}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Reciprocity Slider */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-panel rounded-[24px] p-6 mb-6"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Heart className="w-5 h-5" style={{ color: '#EC4899' }} />
                        <span className="font-semibold">Relational Reciprocity</span>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs opacity-60">Disconnection</span>
                        <span className="text-xs opacity-60">Deep Connection</span>
                    </div>

                    <div className="flex gap-2">
                        {([1, 2, 3, 4, 5] as ReciprocityLevel[]).map((level) => (
                            <button
                                key={level}
                                onClick={() => {
                                    setReciprocity(level);
                                    // Trigger wisdom refraction if low
                                    if (level < 2) {
                                        const wisdom = getWisdomRefraction(level, spiritualAnchors);
                                        setWisdomRefraction(wisdom);
                                    } else {
                                        setWisdomRefraction(null);
                                    }
                                }}
                                className="flex-1 py-3 rounded-xl transition-all text-sm font-medium"
                                style={{
                                    background: reciprocity === level
                                        ? level < 2
                                            ? 'rgba(239, 68, 68, 0.3)'
                                            : level === 5
                                                ? 'rgba(34, 197, 94, 0.3)'
                                                : 'rgba(139, 92, 246, 0.3)'
                                        : 'rgba(255,255,255,0.05)',
                                    border: reciprocity === level
                                        ? `2px solid ${level < 2 ? 'rgba(239,68,68,0.5)' : level === 5 ? 'rgba(34,197,94,0.5)' : 'rgba(139,92,246,0.5)'}`
                                        : '2px solid transparent',
                                }}
                            >
                                {level}
                            </button>
                        ))}
                    </div>

                    {reciprocity < 2 && (
                        <div className="flex items-center gap-2 mt-3 text-xs text-red-400">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Low reciprocity detected — wisdom offered</span>
                        </div>
                    )}
                </motion.div>

                {/* Communication Channels */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-panel rounded-[24px] p-6 mb-6"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Brain className="w-5 h-5" style={{ color: '#60A5FA' }} />
                        <span className="font-semibold">Communication Channels</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {RESONANCE_CHANNELS.map((channel) => (
                            <button
                                key={channel}
                                onClick={() => {
                                    setChannels(prev =>
                                        prev.includes(channel)
                                            ? prev.filter(c => c !== channel)
                                            : [...prev, channel]
                                    );
                                }}
                                className="px-4 py-2 rounded-full text-sm transition-all"
                                style={{
                                    background: channels.includes(channel)
                                        ? 'rgba(96, 165, 250, 0.3)'
                                        : 'rgba(255,255,255,0.05)',
                                    border: channels.includes(channel)
                                        ? '2px solid rgba(96, 165, 250, 0.5)'
                                        : '2px solid transparent',
                                }}
                            >
                                {channel}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Context Fields */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-panel rounded-[24px] p-6 mb-6"
                >
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium opacity-70 block mb-2">
                                Atmospheric Context
                            </label>
                            <input
                                type="text"
                                value={atmosphericContext}
                                onChange={(e) => setAtmosphericContext(e.target.value)}
                                placeholder="What's happening in the environment?"
                                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium opacity-70 block mb-2">
                                Biological State
                            </label>
                            <input
                                type="text"
                                value={biologicalState}
                                onChange={(e) => setBiologicalState(e.target.value)}
                                placeholder="Hungry, tired, sensory needs..."
                                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-sm"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Save Button */}
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    onClick={handleSave}
                    disabled={!transcript.trim() || isSaving}
                    className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
                    style={{
                        background: transcript.trim() && !isSaving
                            ? 'linear-gradient(145deg, rgba(139, 92, 246, 0.6) 0%, rgba(167, 139, 250, 0.8) 100%)'
                            : 'rgba(255,255,255,0.1)',
                        opacity: transcript.trim() && !isSaving ? 1 : 0.5,
                    }}
                >
                    {isSaving ? (
                        <>
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            Honoring...
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            Honor This Witness
                        </>
                    )}
                </motion.button>
            </div>
        </div>
    );
};

export default MultimodalCapture;
