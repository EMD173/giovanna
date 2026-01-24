/**
 * VILLAGE KEYS: Secure Access Infrastructure
 * 
 * Generates and validates 'Sanctuary Keys' for secure, time-bound 
 * access to child data for practitioners and care team members.
 * 
 * B2B Infrastructure for the Village Tier.
 */

import {
    collection,
    doc,
    setDoc,
    getDoc,
    query,
    where,
    getDocs,
    Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';

// ============================================================================
// TYPES
// ============================================================================

export type VillagePermission =
    | 'view_passport_only'      // Read-only Digital Passport
    | 'view_observations'       // Read shared observations
    | 'view_care_plan'          // Read Sovereign Care Plan
    | 'view_iep_summary'        // Read IEP Bridge summaries
    | 'full_practitioner';      // All practitioner permissions

export interface SanctuaryKey {
    id: string;                           // The hashed key
    childId: string;                      // Child profile ID
    familyId: string;                     // Parent/Guardian user ID
    permissions: VillagePermission[];     // What this key grants access to

    // Time bounds
    createdAt: Date;
    expiresAt: Date;

    // Practitioner info
    practitionerEmail?: string;           // Optional: lock to specific email
    practitionerName?: string;            // Display name of practitioner
    institutionName?: string;             // School, clinic, etc.

    // Usage tracking
    accessCount: number;
    lastAccessedAt?: Date;

    // Status
    isActive: boolean;
    revokedAt?: Date;
    revokedReason?: string;
}

export interface VillageAccessLog {
    id: string;
    keyId: string;
    accessedAt: Date;
    accessorIP?: string;
    accessorEmail?: string;
    action: 'view_passport' | 'view_observations' | 'view_care_plan' | 'download';
}

// ============================================================================
// KEY GENERATION
// ============================================================================

/**
 * Generate a cryptographically secure Sanctuary Key
 * Uses Web Crypto API for secure random generation
 */
export function generateSecureKey(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);

    // Convert to URL-safe base64
    const base64 = btoa(String.fromCharCode(...array))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

    // Prefix with 'SK_' for Sanctuary Key identification
    return `SK_${base64}`;
}

/**
 * Hash a key for storage (never store raw keys)
 */
export async function hashKey(key: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(key);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ============================================================================
// FIRESTORE OPERATIONS
// ============================================================================

const VILLAGE_ACCESS_COLLECTION = 'village_access';
const ACCESS_LOGS_COLLECTION = 'village_access_logs';

/**
 * Create a new Sanctuary Key
 */
export async function createSanctuaryKey(
    familyId: string,
    childId: string,
    permissions: VillagePermission[],
    expiresInDays: number = 30,
    practitionerInfo?: {
        email?: string;
        name?: string;
        institution?: string;
    }
): Promise<{ key: string; keyData: SanctuaryKey }> {
    // Generate the raw key (this is what we share with the practitioner)
    const rawKey = generateSecureKey();

    // Hash for storage
    const hashedKey = await hashKey(rawKey);

    const now = new Date();
    const expiresAt = new Date(now.getTime() + expiresInDays * 24 * 60 * 60 * 1000);

    const keyData: SanctuaryKey = {
        id: hashedKey,
        childId,
        familyId,
        permissions,
        createdAt: now,
        expiresAt,
        practitionerEmail: practitionerInfo?.email,
        practitionerName: practitionerInfo?.name,
        institutionName: practitionerInfo?.institution,
        accessCount: 0,
        isActive: true,
    };

    // Store in Firestore
    await setDoc(doc(db, VILLAGE_ACCESS_COLLECTION, hashedKey), {
        ...keyData,
        createdAt: Timestamp.fromDate(keyData.createdAt),
        expiresAt: Timestamp.fromDate(keyData.expiresAt),
    });

    return { key: rawKey, keyData };
}

/**
 * Validate a Sanctuary Key and return access permissions
 */
export async function validateSanctuaryKey(
    rawKey: string
): Promise<{ valid: boolean; data?: SanctuaryKey; error?: string }> {
    try {
        const hashedKey = await hashKey(rawKey);
        const docRef = doc(db, VILLAGE_ACCESS_COLLECTION, hashedKey);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return { valid: false, error: 'Invalid key' };
        }

        const data = docSnap.data();
        const keyData: SanctuaryKey = {
            ...data,
            createdAt: data.createdAt.toDate(),
            expiresAt: data.expiresAt.toDate(),
            lastAccessedAt: data.lastAccessedAt?.toDate(),
            revokedAt: data.revokedAt?.toDate(),
        } as SanctuaryKey;

        // Check if active
        if (!keyData.isActive) {
            return { valid: false, error: 'Key has been revoked' };
        }

        // Check expiration
        if (keyData.expiresAt < new Date()) {
            return { valid: false, error: 'Key has expired' };
        }

        // Update access count
        await setDoc(docRef, {
            accessCount: (keyData.accessCount || 0) + 1,
            lastAccessedAt: Timestamp.fromDate(new Date()),
        }, { merge: true });

        return { valid: true, data: keyData };
    } catch (error) {
        console.error('Error validating sanctuary key:', error);
        return { valid: false, error: 'Validation failed' };
    }
}

/**
 * Revoke a Sanctuary Key
 */
export async function revokeSanctuaryKey(
    familyId: string,
    keyId: string,
    reason: string = 'Manually revoked'
): Promise<boolean> {
    try {
        const docRef = doc(db, VILLAGE_ACCESS_COLLECTION, keyId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return false;
        }

        const data = docSnap.data();

        // Verify ownership
        if (data.familyId !== familyId) {
            console.error('Unauthorized: Cannot revoke key for another family');
            return false;
        }

        await setDoc(docRef, {
            isActive: false,
            revokedAt: Timestamp.fromDate(new Date()),
            revokedReason: reason,
        }, { merge: true });

        return true;
    } catch (error) {
        console.error('Error revoking sanctuary key:', error);
        return false;
    }
}

/**
 * Get all active keys for a family
 */
export async function getActiveKeysForFamily(
    familyId: string
): Promise<SanctuaryKey[]> {
    try {
        const q = query(
            collection(db, VILLAGE_ACCESS_COLLECTION),
            where('familyId', '==', familyId),
            where('isActive', '==', true)
        );

        const querySnapshot = await getDocs(q);
        const keys: SanctuaryKey[] = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            keys.push({
                ...data,
                createdAt: data.createdAt.toDate(),
                expiresAt: data.expiresAt.toDate(),
                lastAccessedAt: data.lastAccessedAt?.toDate(),
            } as SanctuaryKey);
        });

        return keys;
    } catch (error) {
        console.error('Error fetching keys:', error);
        return [];
    }
}

/**
 * Log an access event
 */
export async function logAccess(
    keyId: string,
    action: VillageAccessLog['action'],
    accessorEmail?: string
): Promise<void> {
    try {
        const logId = `${keyId}_${Date.now()}`;
        await setDoc(doc(db, ACCESS_LOGS_COLLECTION, logId), {
            id: logId,
            keyId,
            accessedAt: Timestamp.fromDate(new Date()),
            accessorEmail,
            action,
        });
    } catch (error) {
        console.error('Error logging access:', error);
    }
}

/**
 * Generate a shareable URL with the Sanctuary Key
 */
export function generateShareableURL(key: string): string {
    const baseUrl = typeof window !== 'undefined'
        ? window.location.origin
        : 'https://giovanna.app';
    return `${baseUrl}/portal?key=${encodeURIComponent(key)}`;
}

/**
 * Parse a Sanctuary Key from URL
 */
export function parseKeyFromURL(url: string): string | null {
    try {
        const urlObj = new URL(url);
        return urlObj.searchParams.get('key');
    } catch {
        return null;
    }
}
