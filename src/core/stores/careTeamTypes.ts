/**
 * Care Team Types - Village Tier Infrastructure
 * 
 * Multi-tenant care coordination with data sovereignty:
 * - Admin (Parent): Full access, encryption key holder
 * - Practitioner (Teacher/Therapist): View-only published narratives
 * 
 * Privacy Architecture:
 * - Private Reflections: Never leave parent's profile
 * - Refracted Narratives: Strength-based, actionable for educational settings
 */

import type { Timestamp } from 'firebase/firestore';

/**
 * Care Team Role Hierarchy
 */
export type CareTeamRole = 'Admin' | 'Practitioner';

/**
 * Care Team Member
 */
export interface CareTeamMember {
    userId?: string;              // Populated when account linked
    email: string;
    name: string;
    role: CareTeamRole;
    organization?: string;        // School/Clinic name
    title?: string;               // "OT Specialist", "4th Grade Teacher"
    status: 'invited' | 'active' | 'revoked';
    invitedAt: Timestamp;
    acceptedAt?: Timestamp;
    lastAccessedAt?: Timestamp;
}

/**
 * Care Team - Multi-tenant structure
 */
export interface CareTeam {
    id: string;
    name: string;                 // e.g., "Maya's Care Circle"

    // Child Information
    childId: string;              // Reference to child profile
    childName: string;

    // Ownership & Keys
    adminId: string;              // Parent user ID (encryption key holder)

    // Members
    members: CareTeamMember[];

    // Subscription
    tier: 'Free' | 'Village' | 'Professional';
    subscriptionActive: boolean;

    // Timestamps
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

/**
 * Published Observation - What practitioners can see
 * This is the "Refracted Narrative" - strength-based, actionable
 */
export interface PublishedObservation {
    id: string;
    originalId: string;           // Reference to private observation
    careTeamId: string;

    // Refracted Content (strength-based transformation)
    strengthNarrative: string;    // Published version (may be edited by parent)
    communicationChannels: string[];
    effectiveStrategies: string[];

    // Aggregated (no raw data)
    reciprocityLevel: 'Low' | 'Moderate' | 'High';
    biologicalContext: string;    // Generalized description

    // Metadata
    publishedAt: Timestamp;
    publishedBy: string;          // Admin user ID

    // Privacy
    isRedacted: boolean;          // Parent can redact at any time
}

/**
 * Refracted Narrative - Oracle-processed version for practitioners
 * Strips personal details, emphasizes strengths and actionable insights
 */
export interface RefractedNarrative {
    id: string;
    careTeamId: string;
    generatedAt: Timestamp;

    // Synthesized content (no raw observations)
    strengthsSummary: string;
    communicationPatterns: string[];
    effectiveApproaches: string[];
    environmentalConsiderations: string[];

    // Recommendations (action-oriented)
    classroomStrategies: string[];
    transitionSupports: string[];
    sensoryConsiderations: string[];

    // Metadata
    observationCount: number;
    dateRange: { start: Date; end: Date };
}

/**
 * Private Reflection - NEVER shared with care team
 * These stay in the parent's profile only
 */
export interface PrivateReflection {
    id: string;
    userId: string;               // Parent only
    timestamp: Timestamp;

    // Intimate content
    emotionalState: string;       // How parent is feeling
    struggles: string;            // Challenges being navigated
    hopes: string;                // Aspirations
    oracleConversation?: string;  // Private Oracle dialogue

    // Privacy flag
    neverShare: true;             // Enforced - cannot be published
}

/**
 * Data Sovereignty Settings
 */
export interface DataSovereigntySettings {
    userId: string;

    // Publishing defaults
    autoPublishEnabled: boolean;
    defaultRedactionLevel: 'none' | 'light' | 'strict';

    // Retention
    practitionerAccessDuration: number;  // Days before access expires

    // Audit
    lastAuditedAt: Timestamp;
}
