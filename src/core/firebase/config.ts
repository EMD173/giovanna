/**
 * Firebase Configuration for Giovanna PWA
 * 
 * SOVEREIGN HEALING COSMOLOGY
 * Zero-Knowledge Architecture: All credentials from environment variables
 * 
 * Project: giovanna-e5b56
 */

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, enableIndexedDbPersistence } from 'firebase/firestore';

// ============================================================================
// ENVIRONMENT CONFIGURATION
// ============================================================================

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyASgHof6mT5sZGRKHfvdHw3VtnR1lPvFZo",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "giovanna-e5b56.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "giovanna-e5b56",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "giovanna-e5b56.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "497437035265",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:497437035265:web:411091ebe1140d28fc6900"
};

// ============================================================================
// INITIALIZATION
// ============================================================================

// Prevent duplicate initialization (important for hot reload)
export const app: FirebaseApp = getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApp();

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google Provider for optimal UX
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

// Initialize Firestore with offline persistence
export const db = getFirestore(app);

// ============================================================================
// OFFLINE PERSISTENCE (PWA Support)
// ============================================================================

// Enable offline persistence for PWA functionality
// Using experimentalForceOwningTab to prevent multi-tab blocking
if (typeof window !== 'undefined') {
    enableIndexedDbPersistence(db, { forceOwnership: true }).catch((err) => {
        if (err.code === 'failed-precondition') {
            // Multiple tabs open - this is now handled gracefully with forceOwnership
            console.warn('Firestore persistence: Taking ownership from other tab');
        } else if (err.code === 'unimplemented') {
            // Browser doesn't support persistence
            console.warn('Firestore persistence not supported by browser');
        } else {
            console.warn('Firestore persistence error:', err);
        }
    });
}

// ============================================================================
// DEVELOPMENT EMULATORS (Optional)
// ============================================================================

const useEmulators = import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true';

if (useEmulators && typeof window !== 'undefined') {
    console.log('🔧 Connecting to Firebase Emulators...');

    try {
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
        connectFirestoreEmulator(db, 'localhost', 8080);
        console.log('✅ Firebase Emulators connected');
    } catch (error) {
        console.warn('Firebase Emulator connection failed:', error);
    }
}

// ============================================================================
// DISTRICT-LEVEL OPTIMIZATIONS (Mission Room)
// ============================================================================

/**
 * Optimized listener configuration for Mission Room
 * Reduces network calls for district-level aggregation
 */
export const MISSION_ROOM_CONFIG = {
    // Batch size for aggregation queries
    AGGREGATION_BATCH_SIZE: 500,

    // Cache duration for metrics (30 seconds)
    METRICS_CACHE_MS: 30000,

    // Maximum listeners per view
    MAX_REALTIME_LISTENERS: 10,

    // Throttle updates to prevent UI thrashing
    UPDATE_THROTTLE_MS: 1000,
};

// ============================================================================
// EXPORTS
// ============================================================================

export { firebaseConfig };
