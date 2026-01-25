/**
 * Village Portal Utilities
 * 
 * Secure share link generation for passport sharing.
 */

export interface ShareLink {
    id: string;
    token: string;
    expiresAt: Date;
    accessCount: number;
    maxAccess: number;
    createdAt: Date;
}

/**
 * Generate a secure, time-bound share token
 */
export function generateShareToken(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Create a share link with expiration
 */
export function createShareLink(
    _passportId: string,
    expirationHours: number = 24,
    maxAccess: number = 5
): ShareLink {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + expirationHours * 60 * 60 * 1000);

    return {
        id: `share_${Date.now()}`,
        token: generateShareToken(),
        expiresAt,
        accessCount: 0,
        maxAccess,
        createdAt: now,
    };
}
