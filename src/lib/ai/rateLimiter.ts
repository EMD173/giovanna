/**
 * ORACLE RATE LIMITER
 * 
 * Prevents abuse and controls costs by limiting Oracle API calls.
 * Uses localStorage for persistence across sessions.
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

export const RATE_LIMIT_CONFIG = {
    /** Maximum Oracle calls per day */
    MAX_DAILY_CALLS: 50,

    /** Maximum Oracle calls per hour */
    MAX_HOURLY_CALLS: 20,

    /** Reset interval check (ms) */
    CLEANUP_INTERVAL_MS: 60 * 1000, // 1 minute

    /** Storage key prefix */
    STORAGE_KEY: 'giovanna_oracle_rate_limit',
};

// ============================================================================
// TYPES
// ============================================================================

interface RateLimitState {
    dailyCalls: number;
    hourlyCalls: number;
    lastDailyReset: number;
    lastHourlyReset: number;
    lastCallTimestamp: number;
}

interface RateLimitResult {
    allowed: boolean;
    remainingDaily: number;
    remainingHourly: number;
    resetInMs?: number;
    message?: string;
}

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

function getState(): RateLimitState {
    try {
        const stored = localStorage.getItem(RATE_LIMIT_CONFIG.STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch {
        // Ignore parse errors
    }

    return {
        dailyCalls: 0,
        hourlyCalls: 0,
        lastDailyReset: Date.now(),
        lastHourlyReset: Date.now(),
        lastCallTimestamp: 0,
    };
}

function setState(state: RateLimitState): void {
    try {
        localStorage.setItem(RATE_LIMIT_CONFIG.STORAGE_KEY, JSON.stringify(state));
    } catch {
        // Ignore storage errors
    }
}

// ============================================================================
// CORE FUNCTIONS
// ============================================================================

/**
 * Check and reset counters if time windows have passed
 */
function checkAndResetWindows(state: RateLimitState): RateLimitState {
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const oneHourMs = 60 * 60 * 1000;

    // Reset daily counter
    if (now - state.lastDailyReset >= oneDayMs) {
        state.dailyCalls = 0;
        state.lastDailyReset = now;
    }

    // Reset hourly counter
    if (now - state.lastHourlyReset >= oneHourMs) {
        state.hourlyCalls = 0;
        state.lastHourlyReset = now;
    }

    return state;
}

/**
 * Check if an Oracle call is allowed
 */
export function checkRateLimit(): RateLimitResult {
    let state = getState();
    state = checkAndResetWindows(state);

    const remainingDaily = RATE_LIMIT_CONFIG.MAX_DAILY_CALLS - state.dailyCalls;
    const remainingHourly = RATE_LIMIT_CONFIG.MAX_HOURLY_CALLS - state.hourlyCalls;

    // Hourly limit exceeded
    if (remainingHourly <= 0) {
        const resetInMs = (state.lastHourlyReset + 60 * 60 * 1000) - Date.now();
        return {
            allowed: false,
            remainingDaily,
            remainingHourly: 0,
            resetInMs,
            message: `Hourly limit reached. The Oracle needs rest. Available again in ${Math.ceil(resetInMs / 60000)} minutes.`,
        };
    }

    // Daily limit exceeded
    if (remainingDaily <= 0) {
        const resetInMs = (state.lastDailyReset + 24 * 60 * 60 * 1000) - Date.now();
        return {
            allowed: false,
            remainingDaily: 0,
            remainingHourly,
            resetInMs,
            message: `Daily wisdom quota reached. The Oracle returns at midnight.`,
        };
    }

    return {
        allowed: true,
        remainingDaily,
        remainingHourly,
    };
}

/**
 * Record an Oracle call (call this after successful API response)
 */
export function recordOracleCall(): void {
    let state = getState();
    state = checkAndResetWindows(state);

    state.dailyCalls++;
    state.hourlyCalls++;
    state.lastCallTimestamp = Date.now();

    setState(state);
}

/**
 * Get current rate limit status (for UI display)
 */
export function getRateLimitStatus(): {
    dailyUsed: number;
    dailyLimit: number;
    hourlyUsed: number;
    hourlyLimit: number;
    percentUsed: number;
} {
    let state = getState();
    state = checkAndResetWindows(state);

    return {
        dailyUsed: state.dailyCalls,
        dailyLimit: RATE_LIMIT_CONFIG.MAX_DAILY_CALLS,
        hourlyUsed: state.hourlyCalls,
        hourlyLimit: RATE_LIMIT_CONFIG.MAX_HOURLY_CALLS,
        percentUsed: Math.round((state.dailyCalls / RATE_LIMIT_CONFIG.MAX_DAILY_CALLS) * 100),
    };
}

/**
 * Reset rate limits (admin function)
 */
export function resetRateLimits(): void {
    localStorage.removeItem(RATE_LIMIT_CONFIG.STORAGE_KEY);
}

export default {
    checkRateLimit,
    recordOracleCall,
    getRateLimitStatus,
    resetRateLimits,
};
