/**
 * Analytics - Firebase Analytics wrapper
 * 
 * Simple helpers for tracking user actions throughout the app.
 * All events are sent to Firebase Analytics for insights.
 */

import { getAnalytics, logEvent, setUserId, setUserProperties } from 'firebase/analytics';
import type { Analytics } from 'firebase/analytics';
import { app } from '../core/firebase/config';

let analytics: Analytics | null = null;

// Initialize analytics (only in browser)
export const initAnalytics = () => {
    if (typeof window !== 'undefined' && !analytics) {
        try {
            analytics = getAnalytics(app);
            console.log('📊 Firebase Analytics initialized');
        } catch (error) {
            console.warn('Analytics initialization failed:', error);
        }
    }
    return analytics;
};

// Track a custom event
export const trackEvent = (eventName: string, params?: Record<string, string | number | boolean>) => {
    if (!analytics) {
        analytics = initAnalytics();
    }
    if (analytics) {
        logEvent(analytics, eventName, params);
    }
};

// Set user ID for tracking
export const setAnalyticsUser = (userId: string) => {
    if (!analytics) {
        analytics = initAnalytics();
    }
    if (analytics) {
        setUserId(analytics, userId);
    }
};

// Set user properties
export const setAnalyticsUserProperties = (properties: Record<string, string>) => {
    if (!analytics) {
        analytics = initAnalytics();
    }
    if (analytics) {
        setUserProperties(analytics, properties);
    }
};

// Pre-defined events for consistency
export const Events = {
    // Auth
    SIGN_UP: 'sign_up',
    LOGIN: 'login',
    LOGOUT: 'logout',

    // Features
    VIEW_DASHBOARD: 'view_dashboard',
    VIEW_ORACLE: 'view_oracle',
    VIEW_CAPTURE: 'view_capture',
    VIEW_VILLAGE: 'view_village',
    VIEW_JOURNEY: 'view_journey',

    // Actions
    LOG_OBSERVATION: 'log_observation',
    ORACLE_MESSAGE: 'oracle_message',
    ORACLE_VOICE_INPUT: 'oracle_voice_input',
    FEEDBACK_SUBMITTED: 'feedback_submitted',
    APP_INSTALLED: 'app_installed',

    // Engagement
    SESSION_START: 'session_start',
    FEATURE_DISCOVERY: 'feature_discovery',
};

export default {
    initAnalytics,
    trackEvent,
    setAnalyticsUser,
    setAnalyticsUserProperties,
    Events,
};
