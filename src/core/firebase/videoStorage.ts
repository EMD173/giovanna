/**
 * VIDEO STORAGE SERVICE
 *
 * Handles video upload, download, and management in Firebase Storage.
 * Videos are stored under user-specific paths for privacy.
 *
 * Storage structure:
 * /users/{userId}/videos/{videoId}.webm
 * /users/{userId}/thumbnails/{videoId}.jpg
 */

import {
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject,
    type UploadTaskSnapshot,
} from 'firebase/storage';
import { storage } from './config';

/**
 * Video upload progress callback
 */
export type UploadProgressCallback = (progress: number) => void;

/**
 * Video metadata stored alongside the file
 */
export interface VideoMetadata {
    id: string;
    userId: string;
    filename: string;
    url: string;
    thumbnailUrl?: string;
    duration: number;        // seconds
    size: number;            // bytes
    mimeType: string;
    createdAt: Date;
}

/**
 * Upload result
 */
export interface UploadResult {
    success: boolean;
    videoUrl?: string;
    thumbnailUrl?: string;
    error?: string;
}

/**
 * Generate a unique video ID
 */
function generateVideoId(): string {
    return `vid_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Upload a video to Firebase Storage
 *
 * @param userId - The user's ID
 * @param videoBlob - The video blob to upload
 * @param onProgress - Optional progress callback (0-100)
 * @returns Upload result with video URL
 */
export async function uploadVideo(
    userId: string,
    videoBlob: Blob,
    onProgress?: UploadProgressCallback
): Promise<UploadResult> {
    const videoId = generateVideoId();
    const extension = getExtensionFromMimeType(videoBlob.type);
    const filename = `${videoId}.${extension}`;
    const storagePath = `users/${userId}/videos/${filename}`;

    try {
        const storageRef = ref(storage, storagePath);

        // Create upload task
        const uploadTask = uploadBytesResumable(storageRef, videoBlob, {
            contentType: videoBlob.type,
            customMetadata: {
                uploadedAt: new Date().toISOString(),
                userId: userId,
            },
        });

        // Return promise that resolves when upload completes
        return new Promise((resolve) => {
            uploadTask.on(
                'state_changed',
                (snapshot: UploadTaskSnapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    onProgress?.(Math.round(progress));
                },
                (error) => {
                    console.error('Video upload error:', error);
                    resolve({
                        success: false,
                        error: error.message,
                    });
                },
                async () => {
                    try {
                        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve({
                            success: true,
                            videoUrl: downloadUrl,
                        });
                    } catch (error) {
                        resolve({
                            success: false,
                            error: 'Failed to get download URL',
                        });
                    }
                }
            );
        });
    } catch (error) {
        console.error('Video upload failed:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Upload failed',
        };
    }
}

/**
 * Upload a thumbnail image for a video
 */
export async function uploadThumbnail(
    userId: string,
    videoId: string,
    thumbnailBlob: Blob
): Promise<string | null> {
    const storagePath = `users/${userId}/thumbnails/${videoId}.jpg`;

    try {
        const storageRef = ref(storage, storagePath);
        const uploadTask = uploadBytesResumable(storageRef, thumbnailBlob, {
            contentType: 'image/jpeg',
        });

        return new Promise((resolve) => {
            uploadTask.on(
                'state_changed',
                null,
                (error) => {
                    console.error('Thumbnail upload error:', error);
                    resolve(null);
                },
                async () => {
                    try {
                        const url = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve(url);
                    } catch {
                        resolve(null);
                    }
                }
            );
        });
    } catch (error) {
        console.error('Thumbnail upload failed:', error);
        return null;
    }
}

/**
 * Delete a video from storage
 */
export async function deleteVideo(
    _userId: string,
    videoUrl: string
): Promise<boolean> {
    try {
        // Extract the path from the URL
        const storageRef = ref(storage, videoUrl);
        await deleteObject(storageRef);
        return true;
    } catch (error) {
        console.error('Video deletion failed:', error);
        return false;
    }
}

/**
 * Generate a thumbnail from a video blob
 * Creates a canvas snapshot from the first frame
 */
export async function generateThumbnail(
    videoBlob: Blob,
    timestamp: number = 0.5
): Promise<Blob | null> {
    return new Promise((resolve) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.muted = true;
        video.playsInline = true;

        video.onloadedmetadata = () => {
            // Seek to the specified timestamp (or middle if longer)
            const seekTime = Math.min(timestamp, video.duration / 2);
            video.currentTime = seekTime;
        };

        video.onseeked = () => {
            // Create canvas and draw video frame
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                resolve(null);
                return;
            }

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert to blob
            canvas.toBlob(
                (blob) => {
                    URL.revokeObjectURL(video.src);
                    resolve(blob);
                },
                'image/jpeg',
                0.7
            );
        };

        video.onerror = () => {
            URL.revokeObjectURL(video.src);
            resolve(null);
        };

        video.src = URL.createObjectURL(videoBlob);
    });
}

/**
 * Get video duration from a blob
 */
export async function getVideoDuration(videoBlob: Blob): Promise<number> {
    return new Promise((resolve) => {
        const video = document.createElement('video');
        video.preload = 'metadata';

        video.onloadedmetadata = () => {
            URL.revokeObjectURL(video.src);
            resolve(video.duration);
        };

        video.onerror = () => {
            URL.revokeObjectURL(video.src);
            resolve(0);
        };

        video.src = URL.createObjectURL(videoBlob);
    });
}

/**
 * Compress a video blob (basic - reduces quality)
 * Note: True compression requires ffmpeg.wasm which is heavy
 * This is a placeholder for future enhancement
 */
export async function compressVideo(videoBlob: Blob): Promise<Blob> {
    // For now, return the original blob
    // In production, consider using ffmpeg.wasm or server-side compression
    return videoBlob;
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Format duration for display
 */
export function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Get file extension from MIME type
 */
function getExtensionFromMimeType(mimeType: string): string {
    const mimeMap: Record<string, string> = {
        'video/webm': 'webm',
        'video/mp4': 'mp4',
        'video/quicktime': 'mov',
        'video/x-matroska': 'mkv',
    };
    return mimeMap[mimeType] || 'webm';
}

/**
 * Check if video recording is supported
 */
export function isVideoRecordingSupported(): boolean {
    return !!(
        navigator.mediaDevices &&
        typeof navigator.mediaDevices.getUserMedia === 'function' &&
        typeof MediaRecorder !== 'undefined'
    );
}

/**
 * Get supported video MIME types
 */
export function getSupportedMimeType(): string {
    const types = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
        'video/mp4',
    ];

    for (const type of types) {
        if (MediaRecorder.isTypeSupported(type)) {
            return type;
        }
    }

    return 'video/webm';
}

/**
 * Maximum video duration in seconds (5 minutes)
 */
export const MAX_VIDEO_DURATION = 300;

/**
 * Maximum video file size in bytes (100MB)
 */
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024;
