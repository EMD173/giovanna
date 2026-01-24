/**
 * OBSERVABILITY: Analytics & Error Tracking
 * 
 * Lightweight analytics for understanding user behavior and errors.
 * Console-based in development, ready for Vercel Analytics or PostHog in production.
 */

// ============================================================================
// EVENT TYPES
// ============================================================================

export type EventCategory =
    | 'navigation'
    | 'oracle'
    | 'capture'
    | 'village'
    | 'auth'
    | 'error'
    | 'performance';

export interface AnalyticsEvent {
    category: EventCategory;
    action: string;
    label?: string;
    value?: number;
    metadata?: Record<string, unknown>;
    timestamp: Date;
}

// ============================================================================
// IN-MEMORY STORE (for batching)
// ============================================================================

const eventQueue: AnalyticsEvent[] = [];
const MAX_QUEUE_SIZE = 50;

// ============================================================================
// CORE TRACKING FUNCTIONS
// ============================================================================

/**
 * Track a custom event
 */
export function trackEvent(
    category: EventCategory,
    action: string,
    options?: {
        label?: string;
        value?: number;
        metadata?: Record<string, unknown>;
    }
): void {
    const event: AnalyticsEvent = {
        category,
        action,
        label: options?.label,
        value: options?.value,
        metadata: options?.metadata,
        timestamp: new Date(),
    };

    // Log in development
    if (import.meta.env.DEV) {
        console.log('[Analytics]', `${category}:${action}`, options || '');
    }

    // Queue for potential batch upload
    eventQueue.push(event);
    if (eventQueue.length > MAX_QUEUE_SIZE) {
        eventQueue.shift(); // Remove oldest
    }

    // TODO: In production, send to analytics service
    // sendToAnalyticsService(event);
}

/**
 * Track page view
 */
export function trackPageView(viewName: string): void {
    trackEvent('navigation', 'page_view', { label: viewName });
}

/**
 * Track Oracle interaction
 */
export function trackOracleQuery(queryType: string, responseTime?: number): void {
    trackEvent('oracle', 'query', {
        label: queryType,
        value: responseTime,
    });
}

/**
 * Track capture event
 */
export function trackCapture(captureType: 'voice' | 'text' | 'photo'): void {
    trackEvent('capture', 'observation_created', { label: captureType });
}

/**
 * Track error occurrence
 */
export function trackError(error: Error, context?: string): void {
    trackEvent('error', 'exception', {
        label: context || 'unknown',
        metadata: {
            message: error.message,
            stack: error.stack?.slice(0, 500),
        },
    });

    // Always log errors
    console.error('[Error]', context || '', error);
}

/**
 * Track performance metric
 */
export function trackPerformance(metric: string, durationMs: number): void {
    trackEvent('performance', metric, { value: durationMs });
}

// ============================================================================
// SESSION TRACKING
// ============================================================================

let sessionStart: Date | null = null;

export function startSession(): void {
    sessionStart = new Date();
    trackEvent('auth', 'session_start');
}

export function endSession(): void {
    if (sessionStart) {
        const durationMs = Date.now() - sessionStart.getTime();
        trackEvent('auth', 'session_end', { value: durationMs });
        sessionStart = null;
    }
}

export function getSessionDuration(): number | null {
    if (!sessionStart) return null;
    return Date.now() - sessionStart.getTime();
}

// ============================================================================
// EXPORT UTILITIES
// ============================================================================

export function getEventQueue(): AnalyticsEvent[] {
    return [...eventQueue];
}

export function clearEventQueue(): void {
    eventQueue.length = 0;
}

export default {
    trackEvent,
    trackPageView,
    trackOracleQuery,
    trackCapture,
    trackError,
    trackPerformance,
    startSession,
    endSession,
};
