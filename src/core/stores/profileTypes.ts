/**
 * Profile Types - Personalization Engine Schema
 * 
 * Bridges 'Storage' memory (Firestore) with 'Experience' memory (UI state)
 * to create deeply personalized sanctuary experiences.
 */

import type { Timestamp } from 'firebase/firestore';

/**
 * Parent Profile - The primary caregiver
 */
export interface ParentProfile {
    title: string;            // e.g., "Mama", "Eli", "Daddy"
    displayName?: string;     // Full name if desired
}

/**
 * Child Biological Context
 * Sensory profile and physical rhythms
 */
export interface BiologicalContext {
    sensoryProfile: SensoryProfile;
    physicalRhythms: PhysicalRhythm[];
    regulationStrategies: string[];     // What works at home
}

export type SensoryProfile = {
    seekers: string[];        // Sensory-seeking areas
    avoiders: string[];       // Sensory-avoiding areas
    notes?: string;
};

export type PhysicalRhythm =
    | 'Morning Regulator'
    | 'Afternoon Crash'
    | 'Evening Wind-down'
    | 'Night Owl'
    | 'Early Riser'
    | 'Irregular Sleep';

/**
 * Systemic Context
 * School, IEP, and family history/lineage
 */
export interface SystemicContext {
    // School Environment
    schoolName?: string;
    schoolType?: 'Public' | 'Private' | 'Homeschool' | 'Charter';
    gradeLevel?: string;

    // IEP Status
    hasIEP: boolean;
    iepServices?: string[];       // e.g., "Speech", "OT", "Behavioral"

    // Family Context
    familyStructure?: string;     // e.g., "Two-parent", "Single-parent"
    culturalLineage?: string;     // Honoring ancestry
    languagesSpoken?: string[];

    // Systemic Stressors (known triggers)
    knownStressors?: string[];
}

/**
 * INSTITUTIONAL VAULT - Expert Empowerment
 * Elite institutional data in the parent's hands
 */

/**
 * IEP Vault - School-House Map
 */
export interface IEPVault {
    goals: IEPGoal[];
    accommodations: string[];
    modifications: string[];
    serviceMinutes: ServiceMinutes[];
    endDate?: Date;
    nextReviewDate?: Date;
    caseManager?: string;
}

export interface IEPGoal {
    id: string;
    area: 'Academic' | 'Behavioral' | 'Social-Emotional' | 'Communication' | 'Motor' | 'Life Skills';
    description: string;                    // The institutional language
    dignityTranslation?: string;            // Our strength-based translation
    progress: 'Not Started' | 'Emerging' | 'Progressing' | 'Mastered';
    targetDate?: Date;
}

export interface ServiceMinutes {
    service: string;                        // "Speech", "OT", "Resource"
    minutesPerWeek: number;
    provider?: string;
}

/**
 * FBA/BIP Vault - Understanding Communication
 */
export interface FBABIPVault {
    targetBehaviors: TargetBehavior[];
    triggers: string[];                     // What the institution calls "antecedents"
    settings: string[];                     // Environmental factors
    functions: BehaviorFunction[];
    currentStrategies: BIPStrategy[];
    crisisProtocol?: string;
}

export interface TargetBehavior {
    institutional: string;                  // Deficit language from reports
    dignityTranslation: string;             // Our communication-centered translation
    frequency?: string;
}

export type BehaviorFunction =
    | 'Escape/Avoidance'
    | 'Attention'
    | 'Access to Tangibles'
    | 'Sensory Regulation'
    | 'Communication';

export interface BIPStrategy {
    type: 'Prevention' | 'Teaching' | 'Response';
    description: string;
    effectiveness: 'Effective' | 'Partially' | 'Not Effective' | 'Unknown';
}

/**
 * Clinical Vault - Healing Team
 */
export interface ClinicalVault {
    primaryDoctor?: string;
    specialists: Specialist[];
    diagnoses: Diagnosis[];
    medicationRhythm?: MedicationRhythm;
    therapies: TherapyRecord[];
    notes?: string;
}

export interface Specialist {
    name: string;
    specialty: string;
    organization?: string;
    phone?: string;
    lastVisit?: Date;
}

export interface Diagnosis {
    name: string;
    diagnosedDate?: Date;
    diagnosedBy?: string;
    notes?: string;
}

export interface MedicationRhythm {
    medications: Medication[];
    notes?: string;
}

export interface Medication {
    name: string;
    dosage: string;
    timing: string;                         // "Morning", "With meals", etc.
    purpose?: string;
    startDate?: Date;
}

export interface TherapyRecord {
    type: string;                           // "OT", "Speech", "ABA", "Play Therapy"
    provider: string;
    frequency: string;
    startDate?: Date;
    notes?: string;
}

/**
 * Complete Institutional Vault
 */
export interface InstitutionalVault {
    iep?: IEPVault;
    fbaBip?: FBABIPVault;
    clinical?: ClinicalVault;
    lastUpdated?: Date;
}

/**
 * SOVEREIGN PASSPORT - Digital Identity for Care Transitions
 * 
 * Portable, strength-based documentation designed for:
 * - Social workers during placement
 * - Adopting/foster families during transition
 * - Medical providers during handoffs
 * 
 * All "behaviors" are reframed as Essential Regulation.
 */

/**
 * Biological Passport - Physical needs and preferences
 */
export interface BiologicalPassport {
    allergies: string[];
    foodPreferences: string[];
    textures: string[];                      // Foods, fabrics, etc.
    medicationSchedule?: string;
    sleepRoutine?: string;
    emergencyProtocol?: string;
}

/**
 * Sensory Passport - Regulation patterns (stims = Essential Regulation)
 */
export interface SensoryPassport {
    stimmingPatterns: StimmingPattern[];     // "Essential Regulation Behaviors"
    favoriteToys: ComfortObject[];
    regulationTriggers: RegulationTrigger[];
    safeSpaces: string[];                    // Where they feel calm
    sensoryDiet?: string;                    // Daily sensory needs
}

export interface StimmingPattern {
    behavior: string;                        // What they do
    dignityFraming: string;                  // Strength-based description
    whenObserved: string;                    // Context (tired, excited, etc.)
    supportStrategy: string;                 // How to support
}

export interface ComfortObject {
    name: string;
    type: string;                            // Toy, blanket, music, etc.
    importance: 'Essential' | 'Important' | 'Helpful';
    neverSeparate: boolean;
}

export interface RegulationTrigger {
    trigger: string;
    dignityFraming: string;                  // Strength-based reframe
    intensity: 'Low' | 'Medium' | 'High';
    effectiveResponse: string;
}

/**
 * Contextual Abilities - What they can do in different settings
 */
export interface ContextualAbilities {
    schoolExpectations: string;              // What school expects
    homeExpectations: string;                // What they do at home
    reasonableAccommodations: string;        // What they need to succeed
    strengthsInContext: string[];            // What they excel at
    communicationPreferences: string;        // How they express needs
}

/**
 * Complete Sovereign Passport
 */
export interface SovereignPassport {
    id: string;
    childId: string;
    childName: string;

    biological: BiologicalPassport;
    sensory: SensoryPassport;
    contextualAbilities: ContextualAbilities;

    // Sacred Summary - The parent's voice
    sacredSummary?: string;                  // Long-form reflection
    knowledgeOnlyParentKnows?: string;       // Intimate details

    // Access Control
    shareableWith: 'CareTeam' | 'CaseManager' | 'Anyone' | 'None';
    lastUpdated: Date;
    createdBy: string;
}

/**
 * Case Manager Role - For multi-passport caseloads
 */
export interface CaseManagerProfile {
    userId: string;
    organization: string;
    role: 'CaseManager' | 'Supervisor' | 'IntakeWorker';
    caseLoad: CaseReference[];
    accessLevel: 'ReadOnly' | 'ReadWrite' | 'Admin';
}

export interface CaseReference {
    passportId: string;
    childName: string;
    status: 'Active' | 'Closed' | 'Transitioning';
    assignedDate: Date;
    lastReviewedAt?: Date;
    notes?: string;
}

/**
 * Complete User Profile
 */
export interface UserProfile {
    id: string;
    userId: string;

    // Core Identity
    parent: ParentProfile;
    childName: string;
    childAge?: number;

    // Contexts
    biologicalContext?: BiologicalContext;
    systemicContext?: SystemicContext;

    // Institutional Vault (Expert Empowerment)
    vault?: InstitutionalVault;

    // Sovereign Passport (Portable Identity)
    passport?: SovereignPassport;

    // ========================================================================
    // DEEP PERSONALIZATION - Divine Neural Sanctuary
    // ========================================================================

    /** Parent's history and journey (for empathetic Oracle responses) */
    parentHistory?: string;

    /** Favorite color for UI personalization */
    favoriteColor?: string;

    /** Spiritual/psychological anchors for Wisdom Vault refractions */
    spiritualAnchors?: ('bible' | 'gabor_mate' | 'eckhart_tolle' | 'buddhism' | 'hinduism' | 'secular')[];

    // ========================================================================

    // Onboarding Status
    onboardingComplete: boolean;
    onboardingStep: number;

    // Timestamps
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

/**
 * Regulation State - Calculated from observations
 */
export interface RegulationState {
    averageReciprocity: number;     // 1-5 scale
    systemicStressLevel: number;    // 0-1 scale
    observationCount: number;
    lastUpdated: Date;
    trend: 'rising' | 'stable' | 'declining';
}
