/**
 * VIDEO CAPTURE COMPONENT
 *
 * Allows parents to record video moments of their child.
 * Uses MediaRecorder API for browser-native recording.
 *
 * Features:
 * - Camera preview
 * - Recording with timer
 * - Playback before saving
 * - Upload progress indicator
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    Video,
    StopCircle,
    Play,
    RotateCcw,
    Check,
    X,
    Loader2,
    Camera,
    Clock,
    AlertCircle,
} from 'lucide-react';
import {
    uploadVideo,
    generateThumbnail,
    uploadThumbnail,
    getVideoDuration,
    formatDuration,
    formatFileSize,
    isVideoRecordingSupported,
    getSupportedMimeType,
    MAX_VIDEO_DURATION,
    MAX_VIDEO_SIZE,
} from '../core/firebase/videoStorage';

interface VideoCaptureProps {
    userId: string;
    onCapture: (videoUrl: string, thumbnailUrl?: string, duration?: number) => void;
    onCancel: () => void;
    maxDuration?: number;
}

type CaptureState = 'idle' | 'preview' | 'recording' | 'recorded' | 'uploading';

export const VideoCapture = ({
    userId,
    onCapture,
    onCancel,
    maxDuration = MAX_VIDEO_DURATION,
}: VideoCaptureProps) => {
    const [state, setState] = useState<CaptureState>('idle');
    const [error, setError] = useState<string | null>(null);
    const [recordingTime, setRecordingTime] = useState(0);
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

    const videoRef = useRef<HTMLVideoElement>(null);
    const playbackRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<number | null>(null);

    // Check browser support
    useEffect(() => {
        if (!isVideoRecordingSupported()) {
            setError('Video recording is not supported in this browser.');
        }
    }, []);

    // Start camera preview
    const startPreview = useCallback(async () => {
        try {
            setError(null);
            setState('preview');

            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode,
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                },
                audio: true,
            });

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
        } catch (err) {
            console.error('Camera access error:', err);
            if (err instanceof Error) {
                if (err.name === 'NotAllowedError') {
                    setError('Camera access denied. Please allow camera permissions.');
                } else if (err.name === 'NotFoundError') {
                    setError('No camera found on this device.');
                } else {
                    setError('Failed to access camera: ' + err.message);
                }
            }
            setState('idle');
        }
    }, [facingMode]);

    // Stop camera stream
    const stopStream = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
    }, []);

    // Start recording
    const startRecording = useCallback(() => {
        if (!streamRef.current) return;

        try {
            const mimeType = getSupportedMimeType();
            const mediaRecorder = new MediaRecorder(streamRef.current, {
                mimeType,
                videoBitsPerSecond: 2500000, // 2.5 Mbps
            });

            chunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: mimeType });

                // Check file size
                if (blob.size > MAX_VIDEO_SIZE) {
                    setError(`Video too large (${formatFileSize(blob.size)}). Maximum is ${formatFileSize(MAX_VIDEO_SIZE)}.`);
                    setState('preview');
                    return;
                }

                setRecordedBlob(blob);
                const url = URL.createObjectURL(blob);
                setPreviewUrl(url);
                setState('recorded');
                stopStream();
            };

            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.start(1000); // Collect data every second

            setState('recording');
            setRecordingTime(0);

            // Start timer
            timerRef.current = window.setInterval(() => {
                setRecordingTime((prev) => {
                    const newTime = prev + 1;
                    if (newTime >= maxDuration) {
                        stopRecording();
                    }
                    return newTime;
                });
            }, 1000);
        } catch (err) {
            console.error('Recording error:', err);
            setError('Failed to start recording');
        }
    }, [maxDuration, stopStream]);

    // Stop recording
    const stopRecording = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
    }, []);

    // Retake video
    const retake = useCallback(() => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setRecordedBlob(null);
        setPreviewUrl(null);
        setRecordingTime(0);
        setIsPlaying(false);
        startPreview();
    }, [previewUrl, startPreview]);

    // Save and upload video
    const saveVideo = useCallback(async () => {
        if (!recordedBlob) return;

        setState('uploading');
        setUploadProgress(0);

        try {
            // Upload video
            const result = await uploadVideo(userId, recordedBlob, (progress) => {
                setUploadProgress(progress);
            });

            if (!result.success || !result.videoUrl) {
                throw new Error(result.error || 'Upload failed');
            }

            // Generate and upload thumbnail
            let thumbnailUrl: string | undefined;
            const thumbnailBlob = await generateThumbnail(recordedBlob);
            if (thumbnailBlob) {
                const videoId = result.videoUrl.split('/').pop()?.split('.')[0] || 'unknown';
                thumbnailUrl = await uploadThumbnail(userId, videoId, thumbnailBlob) || undefined;
            }

            // Get duration
            const duration = await getVideoDuration(recordedBlob);

            // Notify parent
            onCapture(result.videoUrl, thumbnailUrl, duration);
        } catch (err) {
            console.error('Upload error:', err);
            setError(err instanceof Error ? err.message : 'Upload failed');
            setState('recorded');
        }
    }, [recordedBlob, userId, onCapture]);

    // Toggle playback
    const togglePlayback = useCallback(() => {
        if (!playbackRef.current) return;

        if (isPlaying) {
            playbackRef.current.pause();
        } else {
            playbackRef.current.play();
        }
        setIsPlaying(!isPlaying);
    }, [isPlaying]);

    // Switch camera
    const switchCamera = useCallback(() => {
        stopStream();
        setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
    }, [stopStream]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopStream();
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [stopStream, previewUrl]);

    // Restart preview when facing mode changes
    useEffect(() => {
        if (state === 'preview') {
            startPreview();
        }
    }, [facingMode]);

    // Handle playback ended
    useEffect(() => {
        const playback = playbackRef.current;
        if (!playback) return;

        const handleEnded = () => setIsPlaying(false);
        playback.addEventListener('ended', handleEnded);
        return () => playback.removeEventListener('ended', handleEnded);
    }, [previewUrl]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col"
        >
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
                <button
                    onClick={onCancel}
                    className="p-2 rounded-full bg-white/20 backdrop-blur-sm"
                >
                    <X className="w-6 h-6 text-white" />
                </button>

                {state === 'recording' && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500 text-white">
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        <span className="font-mono font-bold">
                            {formatDuration(recordingTime)} / {formatDuration(maxDuration)}
                        </span>
                    </div>
                )}

                {state === 'preview' && (
                    <button
                        onClick={switchCamera}
                        className="p-2 rounded-full bg-white/20 backdrop-blur-sm"
                    >
                        <RotateCcw className="w-6 h-6 text-white" />
                    </button>
                )}
            </div>

            {/* Video Preview/Playback */}
            <div className="flex-1 relative">
                {(state === 'idle' || state === 'preview' || state === 'recording') && (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                        style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
                    />
                )}

                {(state === 'recorded' || state === 'uploading') && previewUrl && (
                    <video
                        ref={playbackRef}
                        src={previewUrl}
                        playsInline
                        className="w-full h-full object-cover"
                        onClick={togglePlayback}
                    />
                )}

                {/* Play/Pause overlay for recorded video */}
                {state === 'recorded' && (
                    <button
                        onClick={togglePlayback}
                        className="absolute inset-0 flex items-center justify-center bg-black/20"
                    >
                        {!isPlaying && (
                            <div className="p-4 rounded-full bg-white/30 backdrop-blur-sm">
                                <Play className="w-12 h-12 text-white" fill="white" />
                            </div>
                        )}
                    </button>
                )}

                {/* Upload Progress */}
                {state === 'uploading' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
                        <Loader2 className="w-12 h-12 text-white animate-spin mb-4" />
                        <p className="text-white text-lg font-semibold mb-2">Uploading...</p>
                        <div className="w-48 h-2 bg-white/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#D4AF37] transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                        <p className="text-white/60 text-sm mt-2">{uploadProgress}%</p>
                    </div>
                )}

                {/* Error Display */}
                {error && (
                    <div className="absolute top-20 left-4 right-4 p-4 rounded-xl bg-red-500/90 text-white flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold">Error</p>
                            <p className="text-sm opacity-90">{error}</p>
                        </div>
                        <button onClick={() => setError(null)} className="ml-auto">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Idle State - Start Button */}
                {state === 'idle' && !error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
                        <Camera className="w-16 h-16 text-white/60 mb-4" />
                        <h2 className="text-white text-xl font-semibold mb-2">
                            Record a Moment
                        </h2>
                        <p className="text-white/60 text-sm mb-6 text-center px-8">
                            Capture up to {formatDuration(maxDuration)} of video to attach to your observation
                        </p>
                        <button
                            onClick={startPreview}
                            className="px-8 py-4 bg-[#4B0082] text-white rounded-full font-semibold flex items-center gap-2"
                        >
                            <Video className="w-5 h-5" />
                            Open Camera
                        </button>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="absolute bottom-0 left-0 right-0 z-20 p-6 pb-10 bg-gradient-to-t from-black/80 to-transparent">
                {state === 'preview' && (
                    <div className="flex items-center justify-center">
                        <button
                            onClick={startRecording}
                            className="w-20 h-20 rounded-full bg-red-500 border-4 border-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                        >
                            <div className="w-8 h-8 rounded-full bg-white" />
                        </button>
                    </div>
                )}

                {state === 'recording' && (
                    <div className="flex items-center justify-center">
                        <button
                            onClick={stopRecording}
                            className="w-20 h-20 rounded-full bg-red-500 border-4 border-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                        >
                            <StopCircle className="w-10 h-10 text-white" />
                        </button>
                    </div>
                )}

                {state === 'recorded' && (
                    <div className="flex items-center justify-center gap-6">
                        <button
                            onClick={retake}
                            className="flex flex-col items-center gap-1"
                        >
                            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <RotateCcw className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-white text-xs">Retake</span>
                        </button>

                        <button
                            onClick={saveVideo}
                            className="flex flex-col items-center gap-1"
                        >
                            <div className="w-14 h-14 rounded-full bg-[#D4AF37] flex items-center justify-center shadow-lg">
                                <Check className="w-7 h-7 text-white" />
                            </div>
                            <span className="text-white text-xs">Use Video</span>
                        </button>
                    </div>
                )}

                {/* Video info */}
                {state === 'recorded' && recordedBlob && (
                    <div className="mt-4 flex items-center justify-center gap-4 text-white/60 text-sm">
                        <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDuration(recordingTime)}
                        </span>
                        <span>{formatFileSize(recordedBlob.size)}</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default VideoCapture;
