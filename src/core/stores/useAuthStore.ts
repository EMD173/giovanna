/**
 * Auth Store (Zustand)
 * 
 * Self-contained authentication state management.
 * Automatically subscribes to Firebase auth state changes.
 * 
 * Usage:
 *   const { user, loading, signInWithGoogle } = useAuthStore();
 */

import { create } from 'zustand';
import {
    type User,
    signInWithPopup,
    signInAnonymously,
    signOut as firebaseSignOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';

interface AuthState {
    // State
    user: User | null;
    loading: boolean;
    error: string | null;
    initialized: boolean;

    // Actions
    signInWithGoogle: () => Promise<void>;
    signInAsGuest: () => Promise<void>;
    signOut: () => Promise<void>;
    clearError: () => void;

    // Internal
    _unsubscribe: (() => void) | null;
    _initialize: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    // Initial state
    user: null,
    loading: true,
    error: null,
    initialized: false,
    _unsubscribe: null,

    // Initialize Firebase auth listener
    _initialize: () => {
        // Only initialize once
        if (get().initialized) return;

        const unsubscribe = onAuthStateChanged(
            auth,
            (user) => {
                set({
                    user,
                    loading: false,
                    initialized: true
                });
            },
            (error) => {
                console.error('Auth state error:', error);
                set({
                    error: error.message,
                    loading: false,
                    initialized: true
                });
            }
        );

        set({ _unsubscribe: unsubscribe });
    },

    // Sign in with Google
    signInWithGoogle: async () => {
        set({ loading: true, error: null });
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Google sign-in failed';
            console.error('Google sign-in error:', error);
            set({ error: message, loading: false });
            throw error;
        }
    },

    // Sign in anonymously (Guest)
    signInAsGuest: async () => {
        set({ loading: true, error: null });
        try {
            await signInAnonymously(auth);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Guest sign-in failed';
            console.error('Anonymous sign-in error:', error);
            set({ error: message, loading: false });
            throw error;
        }
    },

    // Sign out
    signOut: async () => {
        set({ loading: true, error: null });
        try {
            await firebaseSignOut(auth);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Sign-out failed';
            console.error('Sign-out error:', error);
            set({ error: message, loading: false });
            throw error;
        }
    },

    // Clear any error
    clearError: () => set({ error: null }),
}));

// Auto-initialize the auth listener when the store is first accessed
// This runs once when the module is imported
useAuthStore.getState()._initialize();
