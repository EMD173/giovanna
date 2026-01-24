/**
 * VOCAL LEDGER: Speech-to-Text Capture for the Oracle
 * 
 * Voice-captured observations that can be:
 * 1. Saved directly as raw witnessing
 * 2. Refined with Oracle assistance
 * 3. Refracted into Professional Documentation for IEP Bridge
 * 
 * Uses browser's Web Speech API (SpeechRecognition)
 */

import { useState, useRef, useEffect } from 'react';
import {
    Mic,
    MicOff,
    Save,
    Sparkles,
    FileText,
    Volume2,
    Trash2,
    Loader2,
    AlertCircle,
    CheckCircle
} from 'lucide-react';

interface VocalLedgerProps {
    onCapture: (transcript: string) => void;
    onRefract?: (transcript: string) => Promise<string>;
    placeholder?: string;
}

// TypeScript types for Web Speech API
interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message: string;
}

interface SpeechRecognitionResult {
    isFinal: boolean;
    [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}

interface SpeechRecognitionResultList {
    length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
}

declare global {
    interface Window {
        SpeechRecognition: new () => SpeechRecognition;
        webkitSpeechRecognition: new () => SpeechRecognition;
    }
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    abort(): void;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
    onend: (() => void) | null;
    onstart: (() => void) | null;
}

export const VocalLedger = ({ onCapture, onRefract, placeholder }: VocalLedgerProps) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSupported, setIsSupported] = useState(true);
    const [isRefracting, setIsRefracting] = useState(false);
    const [refractedText, setRefractedText] = useState<string | null>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    useEffect(() => {
        // Check for browser support
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setIsSupported(false);
            return;
        }

        // Initialize speech recognition
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let interim = '';
            let final = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    final += result[0].transcript;
                } else {
                    interim += result[0].transcript;
                }
            }

            if (final) {
                setTranscript(prev => prev + ' ' + final);
            }
            setInterimTranscript(interim);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error('Speech recognition error:', event.error);
            if (event.error === 'not-allowed') {
                setError('Microphone access denied. Please enable microphone permissions.');
            } else if (event.error === 'no-speech') {
                setError('No speech detected. Try speaking louder or closer to the microphone.');
            } else {
                setError(`Error: ${event.error}`);
            }
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
        };
    }, []);

    const startListening = () => {
        if (!recognitionRef.current) return;
        setError(null);
        setIsListening(true);
        recognitionRef.current.start();
    };

    const stopListening = () => {
        if (!recognitionRef.current) return;
        recognitionRef.current.stop();
        setIsListening(false);
        setInterimTranscript('');
    };

    const clearTranscript = () => {
        setTranscript('');
        setInterimTranscript('');
        setRefractedText(null);
    };

    const handleSave = () => {
        if (transcript.trim()) {
            onCapture(transcript.trim());
            clearTranscript();
        }
    };

    const handleRefract = async () => {
        if (!onRefract || !transcript.trim()) return;

        setIsRefracting(true);
        try {
            const refracted = await onRefract(transcript.trim());
            setRefractedText(refracted);
        } catch (err) {
            console.error('Refraction failed:', err);
            setError('Failed to refract into professional documentation.');
        } finally {
            setIsRefracting(false);
        }
    };

    if (!isSupported) {
        return (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-center">
                <AlertCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
                <p className="text-sm text-red-700">
                    Speech recognition is not supported in this browser.
                </p>
                <p className="text-xs text-red-500 mt-1">
                    Try Chrome, Edge, or Safari for voice capture.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Main Recording Area */}
            <div
                className="relative p-6 rounded-[24px] overflow-hidden"
                style={{
                    background: isListening
                        ? 'linear-gradient(135deg, rgba(75, 0, 130, 0.15) 0%, rgba(212, 175, 55, 0.1) 100%)'
                        : 'rgba(255, 255, 255, 0.4)',
                    border: isListening ? '2px solid rgba(75, 0, 130, 0.3)' : '2px solid rgba(255, 255, 255, 0.3)',
                }}
            >
                {/* Listening Animation */}
                {isListening && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="absolute w-32 h-32 rounded-full bg-[#4B0082]/10 animate-ping" />
                        <div className="absolute w-24 h-24 rounded-full bg-[#4B0082]/20 animate-pulse" />
                    </div>
                )}

                {/* Content */}
                <div className="relative z-10 text-center">
                    {/* Main Mic Button */}
                    <button
                        onClick={isListening ? stopListening : startListening}
                        className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-all ${isListening
                            ? 'bg-[#4B0082] text-white shadow-lg scale-105'
                            : 'bg-white/60 text-[#4B0082] hover:bg-[#4B0082]/10'
                            }`}
                    >
                        {isListening ? (
                            <MicOff className="w-8 h-8" />
                        ) : (
                            <Mic className="w-8 h-8" />
                        )}
                    </button>

                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {isListening ? 'Listening... Tap to stop' : 'Tap to start speaking'}
                    </p>
                    <p className="text-xs opacity-60 mt-1">
                        {placeholder || 'Speak your observation. The Oracle will listen.'}
                    </p>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {/* Transcript Display */}
            {(transcript || interimTranscript) && (
                <div className="glass-panel p-4 rounded-[24px]">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider opacity-60 flex items-center gap-2">
                            <Volume2 className="w-3 h-3" />
                            Captured
                        </span>
                        <button
                            onClick={clearTranscript}
                            className="p-1 text-red-400 hover:text-red-600"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                    <p
                        className="text-sm leading-relaxed"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        {transcript}
                        {interimTranscript && (
                            <span className="text-[#4B0082]/50 italic"> {interimTranscript}</span>
                        )}
                    </p>
                </div>
            )}

            {/* Action Buttons */}
            {transcript && (
                <div className="flex gap-3">
                    <button
                        onClick={handleSave}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#4B0082] text-white font-semibold hover:bg-[#6B238E] transition-colors"
                    >
                        <Save className="w-4 h-4" />
                        Save Observation
                    </button>

                    {onRefract && (
                        <button
                            onClick={handleRefract}
                            disabled={isRefracting}
                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37] font-semibold hover:bg-[#D4AF37]/30 transition-colors disabled:opacity-50"
                        >
                            {isRefracting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <FileText className="w-4 h-4" />
                            )}
                            Refract for IEP
                        </button>
                    )}
                </div>
            )}

            {/* Refracted Text Display */}
            {refractedText && (
                <div className="glass-panel p-4 rounded-[24px] border-l-4 border-[#D4AF37]">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                        <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                            Professional Documentation
                        </span>
                    </div>
                    <p
                        className="text-sm leading-relaxed"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        {refractedText}
                    </p>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(refractedText);
                        }}
                        className="mt-3 flex items-center gap-2 text-xs text-[#4B0082] font-semibold"
                    >
                        <CheckCircle className="w-3 h-3" />
                        Copy to Clipboard
                    </button>
                </div>
            )}
        </div>
    );
};

export default VocalLedger;
