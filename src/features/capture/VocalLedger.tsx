/**
 * VOCAL LEDGER: Read-Back & Echo of Recognition
 * 
 * A voice-first capture experience that speaks the parent's observations
 * back to them in a warm, empathetic tone—creating "Mirror Moments" of
 * recognition and reflection.
 * 
 * FEATURES:
 * - Voice recording and transcription
 * - Echo of Recognition: Oracle synthesizes and speaks back
 * - Mirror Moments stored for wellness review
 * 
 * PHILOSOPHY: The parent's voice is the first instrument of witnessing.
 * When their words are reflected back, they hear their own expertise.
 */

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mic,
    MicOff,
    Play,
    Pause,
    Volume2,
    Heart,
    Sparkles,
    Save,
    RefreshCw,
    MessageCircle
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

export interface VocalEntry {
    id: string;
    audioBlob?: Blob;
    transcription: string;
    timestamp: Date;
    duration: number;            // seconds
    oracleReflection?: string;   // The Echo of Recognition
    mirrorMoment?: MirrorMoment;
}

export interface MirrorMoment {
    id: string;
    originalEntry: string;
    reflection: string;
    emotionalTone: 'strength' | 'struggle' | 'growth' | 'connection';
    createdAt: Date;
}

// ============================================================================
// ORACLE REFLECTION GENERATOR (Mock - Replace with actual AI)
// ============================================================================

function generateEchoOfRecognition(transcription: string): {
    reflection: string;
    emotionalTone: MirrorMoment['emotionalTone'];
} {
    // Detect emotional patterns in the transcription
    const lowerText = transcription.toLowerCase();

    // VALIDATION FIRST: Always acknowledge the parent's intentional witnessing
    const validationPrefix = "I see you. ";
    const intentionalAffirmation = "Your choice to notice this matters. ";

    // Strength patterns
    if (
        lowerText.includes('did well') ||
        lowerText.includes('success') ||
        lowerText.includes('proud') ||
        lowerText.includes('breakthrough') ||
        lowerText.includes('improvement') ||
        lowerText.includes('better')
    ) {
        return {
            reflection: `${validationPrefix}You witnessed a moment of strength today. "${transcription.slice(0, 50)}..." — ${intentionalAffirmation}This is the kind of observation that builds the Wisdom Vault. You are seeing what the institutions cannot. Your child is lucky to have you as their witness.`,
            emotionalTone: 'strength',
        };
    }

    // Struggle patterns
    if (
        lowerText.includes('hard') ||
        lowerText.includes('difficult') ||
        lowerText.includes('meltdown') ||
        lowerText.includes('overwhelm') ||
        lowerText.includes('struggle')
    ) {
        return {
            reflection: `${validationPrefix}You stayed present through difficulty. "${transcription.slice(0, 50)}..." — ${intentionalAffirmation}This is not failure. This is sacred data that only you can collect. Your nervous system held space even when it was hard. That is strength.`,
            emotionalTone: 'struggle',
        };
    }

    // Connection patterns
    if (
        lowerText.includes('connect') ||
        lowerText.includes('together') ||
        lowerText.includes('hug') ||
        lowerText.includes('laugh') ||
        lowerText.includes('smile') ||
        lowerText.includes('joy')
    ) {
        return {
            reflection: `${validationPrefix}A moment of connection was captured. "${transcription.slice(0, 50)}..." — ${intentionalAffirmation}These reciprocal exchanges are the building blocks of secure attachment. You are co-creating safety, one moment at a time.`,
            emotionalTone: 'connection',
        };
    }

    // Default: Growth - still validation-first
    return {
        reflection: `${validationPrefix}Your observation matters. "${transcription.slice(0, 50)}..." — ${intentionalAffirmation}Every note you take is an act of witnessing. You are building a map of your child that no one else can see. This knowledge is sovereign.`,
        emotionalTone: 'growth',
    };
}

// ============================================================================
// COMPONENT
// ============================================================================

export const VocalLedger = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [currentEntry, setCurrentEntry] = useState<Partial<VocalEntry> | null>(null);
    const [showReflection, setShowReflection] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                // Mock transcription - in production, use a speech-to-text API
                const mockTranscription = "Today I noticed that when we used the calm-down corner, my child was able to take three deep breaths before rejoining the activity. This was a big improvement from last week.";

                const { reflection, emotionalTone } = generateEchoOfRecognition(mockTranscription);

                setCurrentEntry({
                    id: `vocal_${Date.now()}`,
                    audioBlob,
                    transcription: mockTranscription,
                    timestamp: new Date(),
                    duration: recordingTime,
                    oracleReflection: reflection,
                    mirrorMoment: {
                        id: `mirror_${Date.now()}`,
                        originalEntry: mockTranscription,
                        reflection,
                        emotionalTone,
                        createdAt: new Date(),
                    },
                });

                setShowReflection(true);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);

            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } catch (error) {
            console.error('Failed to start recording:', error);
        }
    }, [recordingTime]);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
    }, [isRecording]);

    const pauseRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            if (isPaused) {
                mediaRecorderRef.current.resume();
                timerRef.current = setInterval(() => {
                    setRecordingTime(prev => prev + 1);
                }, 1000);
            } else {
                mediaRecorderRef.current.pause();
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                }
            }
            setIsPaused(!isPaused);
        }
    }, [isRecording, isPaused]);

    const speakReflection = useCallback(() => {
        if (!currentEntry?.oracleReflection) return;

        setIsSpeaking(true);
        const utterance = new SpeechSynthesisUtterance(currentEntry.oracleReflection);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;

        // Try to use a warm female voice
        const voices = speechSynthesis.getVoices();
        const warmVoice = voices.find(v =>
            v.name.includes('Samantha') ||
            v.name.includes('Karen') ||
            v.name.includes('Female')
        );
        if (warmVoice) utterance.voice = warmVoice;

        utterance.onend = () => setIsSpeaking(false);
        speechSynthesis.speak(utterance);
    }, [currentEntry]);

    const saveEntry = useCallback(() => {
        if (!currentEntry) return;

        // Save to localStorage (replace with Firebase in production)
        const saved = localStorage.getItem('vocal_ledger') || '[]';
        const entries = JSON.parse(saved);
        entries.push({
            ...currentEntry,
            audioBlob: undefined, // Don't serialize blob
        });
        localStorage.setItem('vocal_ledger', JSON.stringify(entries));

        // Also save mirror moment to separate collection
        if (currentEntry.mirrorMoment) {
            const mirrorMoments = JSON.parse(localStorage.getItem('mirror_moments') || '[]');
            mirrorMoments.push(currentEntry.mirrorMoment);
            localStorage.setItem('mirror_moments', JSON.stringify(mirrorMoments));
        }

        // Reset
        setCurrentEntry(null);
        setShowReflection(false);
    }, [currentEntry]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getEmotionalColor = (tone?: MirrorMoment['emotionalTone']) => {
        switch (tone) {
            case 'strength': return '#22C55E';
            case 'struggle': return '#EC4899';
            case 'growth': return '#8B5CF6';
            case 'connection': return '#F59E0B';
            default: return '#8B5CF6';
        }
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
                            background: 'linear-gradient(145deg, rgba(236, 72, 153, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
                            border: '1px solid rgba(236, 72, 153, 0.3)',
                        }}
                    >
                        <MessageCircle className="w-8 h-8" style={{ color: '#EC4899' }} />
                    </div>
                    <h1
                        className="text-2xl font-bold mb-2"
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            color: 'var(--text-primary)',
                        }}
                    >
                        Vocal Ledger
                    </h1>
                    <p className="text-sm opacity-60 max-w-md mx-auto">
                        Speak your observations. We'll listen, reflect, and remember.
                    </p>
                </motion.div>

                {/* Recording Interface */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-panel rounded-[32px] p-8 mb-6"
                >
                    {!isRecording && !showReflection && (
                        <div className="text-center">
                            <button
                                onClick={startRecording}
                                className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 transition-all hover:scale-105"
                                style={{
                                    background: 'linear-gradient(145deg, rgba(236, 72, 153, 0.6), rgba(139, 92, 246, 0.6))',
                                    boxShadow: '0 8px 32px rgba(236, 72, 153, 0.4)',
                                }}
                            >
                                <Mic className="w-10 h-10 text-white" />
                            </button>
                            <p className="text-sm opacity-60">
                                Tap to start recording your observation
                            </p>
                        </div>
                    )}

                    {isRecording && (
                        <div className="text-center">
                            {/* Recording Animation */}
                            <motion.div
                                className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 relative"
                                style={{ background: 'rgba(236, 72, 153, 0.2)' }}
                            >
                                <motion.div
                                    className="absolute inset-0 rounded-full"
                                    style={{ background: 'rgba(236, 72, 153, 0.3)' }}
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                                <MicOff
                                    className="w-10 h-10 relative z-10"
                                    style={{ color: '#EC4899' }}
                                />
                            </motion.div>

                            <p className="text-3xl font-bold mb-2" style={{ color: '#EC4899' }}>
                                {formatTime(recordingTime)}
                            </p>
                            <p className="text-sm opacity-60 mb-6">
                                {isPaused ? 'Paused' : 'Recording...'}
                            </p>

                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={pauseRecording}
                                    className="p-4 rounded-full bg-white/10"
                                >
                                    {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
                                </button>
                                <button
                                    onClick={stopRecording}
                                    className="px-8 py-4 rounded-full font-bold"
                                    style={{
                                        background: 'linear-gradient(145deg, rgba(34, 197, 94, 0.6), rgba(16, 185, 129, 0.6))',
                                    }}
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Echo of Recognition Modal */}
                <AnimatePresence>
                    {showReflection && currentEntry && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-6"
                            style={{ background: 'rgba(0,0,0,0.85)' }}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                className="w-full max-w-md glass-panel rounded-[32px] p-6"
                            >
                                {/* Header */}
                                <div className="flex items-center gap-3 mb-6">
                                    <div
                                        className="p-3 rounded-2xl"
                                        style={{
                                            background: `${getEmotionalColor(currentEntry.mirrorMoment?.emotionalTone)}22`
                                        }}
                                    >
                                        <Heart
                                            className="w-6 h-6"
                                            style={{ color: getEmotionalColor(currentEntry.mirrorMoment?.emotionalTone) }}
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">Echo of Recognition</h3>
                                        <p className="text-xs opacity-60">Your words, witnessed and reflected</p>
                                    </div>
                                </div>

                                {/* Original Transcription */}
                                <div
                                    className="p-4 rounded-xl mb-4"
                                    style={{ background: 'rgba(255,255,255,0.05)' }}
                                >
                                    <p className="text-xs opacity-50 mb-1">You said:</p>
                                    <p className="text-sm italic opacity-80">
                                        "{currentEntry.transcription}"
                                    </p>
                                </div>

                                {/* Oracle Reflection */}
                                <div
                                    className="p-4 rounded-xl mb-6"
                                    style={{
                                        background: `${getEmotionalColor(currentEntry.mirrorMoment?.emotionalTone)}15`,
                                        border: `1px solid ${getEmotionalColor(currentEntry.mirrorMoment?.emotionalTone)}33`,
                                    }}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <Sparkles className="w-4 h-4" style={{ color: getEmotionalColor(currentEntry.mirrorMoment?.emotionalTone) }} />
                                        <span className="text-xs font-medium opacity-60">Oracle reflects:</span>
                                    </div>
                                    <p className="text-sm" style={{ color: getEmotionalColor(currentEntry.mirrorMoment?.emotionalTone) }}>
                                        {currentEntry.oracleReflection}
                                    </p>
                                </div>

                                {/* Listen Button */}
                                <button
                                    onClick={speakReflection}
                                    disabled={isSpeaking}
                                    className="w-full py-4 rounded-xl mb-4 flex items-center justify-center gap-2 transition-all"
                                    style={{
                                        background: isSpeaking
                                            ? `${getEmotionalColor(currentEntry.mirrorMoment?.emotionalTone)}44`
                                            : `${getEmotionalColor(currentEntry.mirrorMoment?.emotionalTone)}22`,
                                        color: getEmotionalColor(currentEntry.mirrorMoment?.emotionalTone),
                                    }}
                                >
                                    {isSpeaking ? (
                                        <>
                                            <RefreshCw className="w-5 h-5 animate-spin" />
                                            Speaking...
                                        </>
                                    ) : (
                                        <>
                                            <Volume2 className="w-5 h-5" />
                                            Hear My Reflection
                                        </>
                                    )}
                                </button>

                                {/* Save Button */}
                                <button
                                    onClick={saveEntry}
                                    className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2"
                                    style={{
                                        background: 'linear-gradient(145deg, rgba(139, 92, 246, 0.6), rgba(236, 72, 153, 0.6))',
                                    }}
                                >
                                    <Save className="w-5 h-5" />
                                    Save to Mirror Moments
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Recent Mirror Moments */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-panel rounded-[24px] p-5"
                >
                    <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" style={{ color: '#A78BFA' }} />
                        Recent Mirror Moments
                    </h3>

                    <RecentMirrorMoments />
                </motion.div>
            </div>
        </div>
    );
};

// ============================================================================
// RECENT MIRROR MOMENTS
// ============================================================================

const RecentMirrorMoments = () => {
    const [moments, setMoments] = useState<MirrorMoment[]>([]);

    // Load from localStorage
    useState(() => {
        const saved = localStorage.getItem('mirror_moments');
        if (saved) {
            setMoments(JSON.parse(saved).slice(-3).reverse());
        }
    });

    const getEmotionalColor = (tone: MirrorMoment['emotionalTone']) => {
        switch (tone) {
            case 'strength': return '#22C55E';
            case 'struggle': return '#EC4899';
            case 'growth': return '#8B5CF6';
            case 'connection': return '#F59E0B';
        }
    };

    const getEmotionalLabel = (tone: MirrorMoment['emotionalTone']) => {
        switch (tone) {
            case 'strength': return 'Strength';
            case 'struggle': return 'Growth Edge';
            case 'growth': return 'Insight';
            case 'connection': return 'Connection';
        }
    };

    if (moments.length === 0) {
        return (
            <div className="text-center py-8 opacity-50">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Your mirror moments will appear here</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {moments.map(moment => (
                <div
                    key={moment.id}
                    className="p-4 rounded-xl"
                    style={{
                        background: `${getEmotionalColor(moment.emotionalTone)}10`,
                        borderLeft: `3px solid ${getEmotionalColor(moment.emotionalTone)}`,
                    }}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                                background: `${getEmotionalColor(moment.emotionalTone)}22`,
                                color: getEmotionalColor(moment.emotionalTone),
                            }}
                        >
                            {getEmotionalLabel(moment.emotionalTone)}
                        </span>
                        <span className="text-xs opacity-40">
                            {new Date(moment.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    <p className="text-sm opacity-80 line-clamp-2">
                        {moment.reflection}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default VocalLedger;
