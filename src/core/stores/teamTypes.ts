/**
 * Team Types - Institutional Village Schema
 * 
 * Enables care-team synchronization with role-based access:
 * - Owner (Parent): Full control, invites, publishes
 * - Contributor (Nanny/Partner): Can add observations
 * - Viewer (Teacher/Therapist): Read-only IEP data
 */

import type { Timestamp } from 'firebase/firestore';

/**
 * Team Types
 */
export type TeamType = 'School' | 'Clinic' | 'Family';

/**
 * Role Hierarchy
 * Owner > Contributor > Viewer
 */
export type TeamRole = 'Owner' | 'Contributor' | 'Viewer';

/**
 * Invitation Status
 */
export type InviteStatus = 'pending' | 'accepted' | 'declined';

/**
 * Team Member
 */
export interface TeamMember {
    userId?: string;          // Populated when accepted
    email: string;
    name: string;
    role: TeamRole;
    status: InviteStatus;
    invitedAt: Timestamp;
    acceptedAt?: Timestamp;
}

/**
 * Team - A care coordination group
 */
export interface Team {
    id: string;
    name: string;               // e.g., "Maya's Village"
    type: TeamType;

    // Child Information
    childName: string;
    childAge?: number;

    // Ownership
    ownerId: string;            // Parent user ID

    // Members
    members: TeamMember[];

    // Premium Status
    tier: 'Free' | 'Village' | 'Professional';

    // Timestamps
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

/**
 * Village Contact - Pre-invite contact collection
 * Used during onboarding before formal invites
 */
export interface VillageContact {
    name: string;
    email: string;
    relationship: 'Teacher' | 'Therapist' | 'Nanny' | 'Partner' | 'Grandparent' | 'Other';
    organization?: string;      // School name, clinic name
}

/**
 * IEP Summary - Synthesized data for professional sharing
 */
export interface IEPSummary {
    id: string;
    teamId: string;
    generatedAt: Timestamp;
    dateRange: {
        start: Date;
        end: Date;
    };

    // Synthesized Patterns
    atmosphericTriggers: string[];     // Common systemic stressors
    biologicalRhythms: string[];       // Sleep/sensory patterns
    effectiveStrategies: string[];     // What works at home
    communicationChannels: string[];   // Primary channels observed

    // Metrics
    averageReciprocity: number;
    observationCount: number;

    // Professional Summary (AI-generated placeholder)
    narrativeSummary: string;
}
