/**
 * VISION AGENT: Video-Based Phase Transition Analysis
 * 
 * Neural video capture interface for identifying environmental 'weights'
 * (Atmospheric Resonance) that precede shifts in child regulation.
 * 
 * FEATURES:
 * - MediaRecorder API for hands-free video capture
 * - Phase Transition Detection: Identify regulation shifts
 * - Environmental Weight Analysis: Sensory, temporal, relational factors
 * 
 * PHILOSOPHY: The body speaks before words arrive. Video captures what
 * narratives cannot—the moment before the storm, the weight in the room.
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Video,
    Camera,
    StopCircle,
    RotateCcw,
    Brain,
    Sparkles,
    AlertTriangle,
    Trash2,
    Eye,
    Waves,
    ThermometerSun,
    Volume2,
    Users,
    Clock
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

export interface PhaseTransitionMarker {
    timestamp: number;           // Seconds into recording
    type: 'pre-shift' | 'shift' | 'post-shift' | 'regulation';
    environmentalWeights: EnvironmentalWeight[];
    confidence: number;          // 0-1 analysis confidence
    notes?: string;
}

export interface EnvironmentalWeight {
    category: WeightCategory;
    intensity: 'low' | 'moderate' | 'high';
    description: string;
}

export type WeightCategory =
    | 'sensory_visual'      // Lighting, movement, visual clutter
    | 'sensory_auditory'    // Noise levels, sudden sounds
    | 'sensory_tactile'     // Touch, texture, temperature
    | 'temporal'            // Transitions, time pressure, waiting
    | 'social'              // People present, demands, expectations
    | 'biological'          // Hunger, fatigue, medication timing
    | 'relational'          // Connection quality, rupture, repair
    | 'unknown';

export interface VideoAnalysis {
    id: string;
    videoBlob?: Blob;
    duration: number;
    markers: PhaseTransitionMarker[];
    overallAssessment: string;
    recommendedInterventions: string[];
    createdAt: Date;
}

// ============================================================================
// ENVIRONMENTAL WEIGHT DETECTION PATTERNS
// ============================================================================

const WEIGHT_PATTERNS: {
    category: WeightCategory;
    label: string;
    icon: React.ReactNode;
    description: string;
    color: string;
}[] = [
        {
            category: 'sensory_visual',
            label: 'Visual Environment',
            icon: <Eye className="w-4 h-4" />,
            description: 'Lighting changes, visual clutter, screens',
            color: '#F59E0B',
        },
        {
            category: 'sensory_auditory',
            label: 'Sound Environment',
            icon: <Volume2 className="w-4 h-4" />,
            description: 'Noise levels, sudden sounds, voices',
            color: '#3B82F6',
        },
        {
            category: 'temporal',
            label: 'Time Pressure',
            icon: <Clock className="w-4 h-4" />,
            description: 'Transitions, waiting, rushing',
            color: '#EF4444',
        },
        {
            category: 'social',
            label: 'Social Demand',
            icon: <Users className="w-4 h-4" />,
            description: 'People, expectations, interactions',
            color: '#8B5CF6',
        },
        {
            category: 'sensory_tactile',
            label: 'Tactile/Temperature',
            icon: <ThermometerSun className="w-4 h-4" />,
            description: 'Touch, clothing, temperature',
            color: '#10B981',
        },
        {
            category: 'relational',
            label: 'Relational State',
            icon: <Waves className="w-4 h-4" />,
            description: 'Connection, rupture, attunement',
            color: '#EC4899',
        },
    ];

// ============================================================================
// COMPONENT
// ============================================================================

export const VisionAgent = () => {
    // Media State
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isPreviewing, setIsPreviewing] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [recordingDuration, setRecordingDuration] = useState(0);

    // Analysis State
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<VideoAnalysis | null>(null);
    const [manualMarkers, setManualMarkers] = useState<PhaseTransitionMarker[]>([]);
    const [selectedWeights, setSelectedWeights] = useState<WeightCategory[]>([]);

    // Refs
    const videoRef = useRef<HTMLVideoElement>(null);
    const previewRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Request camera permission
    const requestPermission = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
                audio: true
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setHasPermission(true);
            setIsPreviewing(true);
        } catch (error) {
            console.error('Camera permission denied:', error);
            setHasPermission(false);
        }
    }, []);

    // Start recording
    const startRecording = useCallback(() => {
        if (!streamRef.current) return;

        const mediaRecorder = new MediaRecorder(streamRef.current, {
            mimeType: 'video/webm;codecs=vp9',
        });

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                setRecordedChunks(prev => [...prev, event.data]);
            }
        };

        mediaRecorder.onstop = () => {
            // Video will be processed in stopRecording
        };

        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start(1000); // Collect data every second
        setIsRecording(true);
        setRecordingDuration(0);

        // Start duration timer
        timerRef.current = setInterval(() => {
            setRecordingDuration(prev => prev + 1);
        }, 1000);
    }, []);

    // Stop recording
    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);

            if (timerRef.current) {
                clearInterval(timerRef.current);
            }

            // Stop the camera stream
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            setIsPreviewing(false);
        }
    }, [isRecording]);

    // Process recorded chunks into playable video
    useEffect(() => {
        if (recordedChunks.length > 0 && !isRecording) {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            setVideoUrl(url);
        }
    }, [recordedChunks, isRecording]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            if (videoUrl) {
                URL.revokeObjectURL(videoUrl);
            }
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [videoUrl]);

    // Format duration
    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Add manual marker at current time
    const addMarker = (type: PhaseTransitionMarker['type']) => {
        if (!previewRef.current) return;

        const currentTime = previewRef.current.currentTime;
        const marker: PhaseTransitionMarker = {
            timestamp: currentTime,
            type,
            environmentalWeights: selectedWeights.map(cat => ({
                category: cat,
                intensity: 'moderate',
                description: WEIGHT_PATTERNS.find(p => p.category === cat)?.label || cat,
            })),
            confidence: 0.7,
        };

        setManualMarkers(prev => [...prev, marker].sort((a, b) => a.timestamp - b.timestamp));
        setSelectedWeights([]);
    };

    // Simulate Phase Transition Analysis (in production, this would use ML)
    const analyzeVideo = async () => {
        setIsAnalyzing(true);

        // Simulated analysis delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        const analysisResult: VideoAnalysis = {
            id: `analysis_${Date.now()}`,
            duration: recordingDuration,
            markers: [
                ...manualMarkers,
                // Add simulated detected markers
                {
                    timestamp: recordingDuration * 0.3,
                    type: 'pre-shift',
                    environmentalWeights: [
                        { category: 'sensory_auditory', intensity: 'high', description: 'Increased ambient noise detected' },
                    ],
                    confidence: 0.65,
                },
            ],
            overallAssessment: `Analysis of ${formatDuration(recordingDuration)} video segment. ${manualMarkers.length} manual markers recorded. Environmental weight patterns suggest attention to auditory and temporal factors in the lead-up to regulation shifts.`,
            recommendedInterventions: [
                'Consider reducing auditory input during transitions',
                'Allow extra processing time before demands',
                'Use visual cues to signal upcoming changes',
            ],
            createdAt: new Date(),
        };

        setAnalysis(analysisResult);
        setIsAnalyzing(false);
    };

    // Reset everything
    const resetCapture = () => {
        setRecordedChunks([]);
        setVideoUrl(null);
        setAnalysis(null);
        setManualMarkers([]);
        setSelectedWeights([]);
        setRecordingDuration(0);
        setHasPermission(null);
    };

    // Toggle weight selection
    const toggleWeight = (category: WeightCategory) => {
        setSelectedWeights(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    // ========================================================================
    // RENDER
    // ========================================================================

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
                            background: 'linear-gradient(145deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                        }}
                    >
                        <Brain className="w-8 h-8" style={{ color: '#60A5FA' }} />
                    </div>
                    <h1
                        className="text-2xl font-bold mb-2"
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            color: 'var(--text-primary)',
                        }}
                    >
                        Vision Agent
                    </h1>
                    <p className="text-sm opacity-60 max-w-md mx-auto">
                        Capture the environment. Witness the phase transitions.
                        The body speaks before words arrive.
                    </p>
                </motion.div>

                {/* Permission Request */}
                {hasPermission === null && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-panel rounded-[24px] p-8 text-center"
                    >
                        <Camera className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <h3 className="font-bold text-lg mb-2">Camera Access Required</h3>
                        <p className="text-sm opacity-60 mb-6">
                            The Vision Agent uses your camera to capture environmental context
                            and identify phase transitions in real-time.
                        </p>
                        <button
                            onClick={requestPermission}
                            className="px-6 py-3 rounded-xl font-medium transition-all"
                            style={{
                                background: 'linear-gradient(145deg, rgba(59, 130, 246, 0.6) 0%, rgba(139, 92, 246, 0.8) 100%)',
                            }}
                        >
                            Enable Camera
                        </button>
                    </motion.div>
                )}

                {/* Permission Denied */}
                {hasPermission === false && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="glass-panel rounded-[24px] p-8 text-center"
                    >
                        <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-400" />
                        <h3 className="font-bold text-lg mb-2">Camera Access Denied</h3>
                        <p className="text-sm opacity-60">
                            Please enable camera access in your browser settings to use the Vision Agent.
                        </p>
                    </motion.div>
                )}

                {/* Live Preview / Recording */}
                {(isPreviewing || isRecording) && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-panel rounded-[24px] overflow-hidden mb-6"
                    >
                        <div className="relative">
                            <video
                                ref={videoRef}
                                autoPlay
                                muted
                                playsInline
                                className="w-full aspect-video bg-black"
                            />

                            {/* Recording Indicator */}
                            {isRecording && (
                                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/80">
                                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                    <span className="text-sm font-medium text-white">
                                        {formatDuration(recordingDuration)}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Controls */}
                        <div className="p-4 flex justify-center gap-4">
                            {!isRecording ? (
                                <button
                                    onClick={startRecording}
                                    className="p-4 rounded-full transition-all"
                                    style={{
                                        background: 'linear-gradient(145deg, rgba(239, 68, 68, 0.6) 0%, rgba(220, 38, 38, 0.8) 100%)',
                                    }}
                                >
                                    <Video className="w-6 h-6 text-white" />
                                </button>
                            ) : (
                                <button
                                    onClick={stopRecording}
                                    className="p-4 rounded-full bg-red-500"
                                >
                                    <StopCircle className="w-6 h-6 text-white" />
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Recorded Video Playback & Analysis */}
                {videoUrl && !isRecording && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Video Player */}
                        <div className="glass-panel rounded-[24px] overflow-hidden">
                            <video
                                ref={previewRef}
                                src={videoUrl}
                                controls
                                className="w-full aspect-video bg-black"
                            />

                            <div className="p-4 flex justify-between items-center">
                                <span className="text-sm opacity-60">
                                    Duration: {formatDuration(recordingDuration)}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={resetCapture}
                                        className="p-2 rounded-lg hover:bg-white/10"
                                    >
                                        <Trash2 className="w-4 h-4 opacity-60" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Environmental Weight Selector */}
                        <div className="glass-panel rounded-[24px] p-6">
                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                <Waves className="w-5 h-5" style={{ color: '#60A5FA' }} />
                                Mark Environmental Weights
                            </h3>
                            <p className="text-xs opacity-60 mb-4">
                                Pause the video, select weights present, then mark the phase.
                            </p>

                            <div className="grid grid-cols-2 gap-2 mb-4">
                                {WEIGHT_PATTERNS.map(pattern => (
                                    <button
                                        key={pattern.category}
                                        onClick={() => toggleWeight(pattern.category)}
                                        className="p-3 rounded-xl text-left flex items-center gap-2 transition-all"
                                        style={{
                                            background: selectedWeights.includes(pattern.category)
                                                ? `${pattern.color}30`
                                                : 'rgba(255,255,255,0.05)',
                                            border: selectedWeights.includes(pattern.category)
                                                ? `2px solid ${pattern.color}`
                                                : '2px solid transparent',
                                        }}
                                    >
                                        <span style={{ color: pattern.color }}>{pattern.icon}</span>
                                        <span className="text-sm">{pattern.label}</span>
                                    </button>
                                ))}
                            </div>

                            {selectedWeights.length > 0 && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => addMarker('pre-shift')}
                                        className="flex-1 py-2 rounded-lg text-sm font-medium"
                                        style={{ background: 'rgba(239, 68, 68, 0.3)' }}
                                    >
                                        Mark Pre-Shift
                                    </button>
                                    <button
                                        onClick={() => addMarker('shift')}
                                        className="flex-1 py-2 rounded-lg text-sm font-medium"
                                        style={{ background: 'rgba(245, 158, 11, 0.3)' }}
                                    >
                                        Mark Shift
                                    </button>
                                    <button
                                        onClick={() => addMarker('regulation')}
                                        className="flex-1 py-2 rounded-lg text-sm font-medium"
                                        style={{ background: 'rgba(34, 197, 94, 0.3)' }}
                                    >
                                        Mark Regulation
                                    </button>
                                </div>
                            )}

                            {/* Markers List */}
                            {manualMarkers.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <p className="text-xs opacity-60 mb-2">{manualMarkers.length} marker(s) recorded</p>
                                    <div className="space-y-2">
                                        {manualMarkers.map((marker, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center gap-2 text-sm"
                                            >
                                                <span className="opacity-50">{formatDuration(Math.floor(marker.timestamp))}</span>
                                                <span
                                                    className="px-2 py-0.5 rounded text-xs"
                                                    style={{
                                                        background: marker.type === 'regulation'
                                                            ? 'rgba(34,197,94,0.3)'
                                                            : marker.type === 'shift'
                                                                ? 'rgba(245,158,11,0.3)'
                                                                : 'rgba(239,68,68,0.3)',
                                                    }}
                                                >
                                                    {marker.type}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Analysis Button */}
                        {!analysis && (
                            <button
                                onClick={analyzeVideo}
                                disabled={isAnalyzing}
                                className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
                                style={{
                                    background: 'linear-gradient(145deg, rgba(59, 130, 246, 0.6) 0%, rgba(139, 92, 246, 0.8) 100%)',
                                }}
                            >
                                {isAnalyzing ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                        >
                                            <Brain className="w-5 h-5" />
                                        </motion.div>
                                        Analyzing Phase Transitions...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        Analyze Video
                                    </>
                                )}
                            </button>
                        )}

                        {/* Analysis Results */}
                        <AnimatePresence>
                            {analysis && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="glass-panel rounded-[24px] p-6"
                                    style={{
                                        border: '2px solid rgba(139, 92, 246, 0.3)',
                                    }}
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div
                                            className="p-2 rounded-xl"
                                            style={{ background: 'rgba(139, 92, 246, 0.2)' }}
                                        >
                                            <Brain className="w-5 h-5" style={{ color: '#A78BFA' }} />
                                        </div>
                                        <h3 className="font-bold">Phase Transition Analysis</h3>
                                    </div>

                                    <p className="text-sm opacity-80 mb-4">
                                        {analysis.overallAssessment}
                                    </p>

                                    <div className="space-y-2 mb-4">
                                        <p className="text-xs font-medium opacity-60">Recommended Interventions:</p>
                                        {analysis.recommendedInterventions.map((intervention, i) => (
                                            <div
                                                key={i}
                                                className="flex items-start gap-2 text-sm"
                                            >
                                                <span className="text-green-400">•</span>
                                                <span className="opacity-80">{intervention}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={resetCapture}
                                        className="w-full py-3 rounded-xl flex items-center justify-center gap-2 bg-white/10"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        Capture New Video
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default VisionAgent;
