/**
 * AGE-STAGE FRAMEWORK
 * 
 * Supports the child's journey from diagnosis through adulthood.
 * 
 * Life Stages:
 * 1. Early Childhood (0-5) - Early intervention focus
 * 2. School Age (6-12) - IEP, social, academic
 * 3. Adolescence (13-17) - Independence, puberty, identity
 * 4. Transition (18-21) - Adult services, employment, higher ed
 * 5. Adulthood (22+) - Independent living, employment, relationships
 * 
 * Features:
 * - Stage-appropriate UI language
 * - Relevant goal templates per stage
 * - Transition planning tools
 * - Age-based milestones
 */

// ============================================================================
// TYPES
// ============================================================================

export type LifeStage = 
    | 'early_childhood'     // 0-5
    | 'school_age'          // 6-12
    | 'adolescence'         // 13-17
    | 'transition'          // 18-21
    | 'adulthood';          // 22+

export interface StageConfig {
    id: LifeStage;
    label: string;
    ageRange: string;
    emoji: string;
    color: string;
    bgColor: string;
    description: string;
    focusAreas: string[];
    keyMilestones: string[];
    transitionQuestions: string[];      // Questions to consider before next stage
    suggestedGoals: SuggestedGoal[];
    language: StageLanguage;            // Stage-appropriate terminology
}

export interface SuggestedGoal {
    category: string;
    goals: string[];
}

export interface StageLanguage {
    childTerm: string;                  // "child" vs "teen" vs "young adult"
    parentTerm: string;                 // "parent" vs "caregiver" vs "support person"
    goals: string;                      // "goals" vs "objectives" vs "aspirations"
    challenges: string;                 // "challenges" vs "struggles" vs "areas of growth"
}

// ============================================================================
// STAGE CONFIGURATIONS
// ============================================================================

export const LIFE_STAGES: Record<LifeStage, StageConfig> = {
    early_childhood: {
        id: 'early_childhood',
        label: 'Early Childhood',
        ageRange: '0-5 years',
        emoji: '🌱',
        color: '#16A34A',
        bgColor: 'rgba(22, 163, 74, 0.1)',
        description: 'The foundation years: early intervention, diagnosis, and discovering your child\'s unique world.',
        focusAreas: [
            'Early intervention services',
            'Speech and language development',
            'Sensory processing understanding',
            'Play skills and social foundations',
            'Feeding and sleep',
            'Family adjustment and support',
        ],
        keyMilestones: [
            'Receives comprehensive evaluation',
            'Begins early intervention services',
            'Develops functional communication system',
            'Participates in play with support',
            'Establishes sleep and feeding routines',
            'Family connects with support community',
        ],
        transitionQuestions: [
            'Does your child have a communication system that works for them?',
            'Have you connected with your school district about kindergarten transition?',
            'Are current therapies meeting your child\'s needs?',
            'Do you have documentation ready for the school district?',
        ],
        suggestedGoals: [
            {
                category: 'Communication',
                goals: [
                    'Uses 10+ words or signs consistently',
                    'Points to request or share attention',
                    'Responds to name within 3 attempts',
                    'Expresses basic needs (hungry, tired, help)',
                ],
            },
            {
                category: 'Sensory & Regulation',
                goals: [
                    'Tolerates 3+ different textures',
                    'Accepts transitions with visual support',
                    'Has identified calming strategies',
                    'Participates in sensory-friendly haircuts/medical visits',
                ],
            },
            {
                category: 'Daily Living',
                goals: [
                    'Assists with dressing',
                    'Attempts self-feeding',
                    'Shows interest in toilet training readiness',
                    'Follows simple 1-step routines',
                ],
            },
        ],
        language: {
            childTerm: 'child',
            parentTerm: 'parent',
            goals: 'goals',
            challenges: 'challenges',
        },
    },

    school_age: {
        id: 'school_age',
        label: 'School Age',
        ageRange: '6-12 years',
        emoji: '📚',
        color: '#0EA5E9',
        bgColor: 'rgba(14, 165, 233, 0.1)',
        description: 'The learning years: navigating school, IEPs, friendships, and discovering strengths.',
        focusAreas: [
            'IEP development and advocacy',
            'Academic accommodations',
            'Social skills and friendships',
            'Extracurricular inclusion',
            'Self-regulation at school',
            'Bullying prevention',
        ],
        keyMilestones: [
            'Has appropriate IEP with meaningful goals',
            'Uses accommodations successfully',
            'Has at least one peer connection',
            'Participates in preferred extracurricular',
            'Can self-identify as needing a break',
            'Understands their autism identity positively',
        ],
        transitionQuestions: [
            'Is your child developing self-advocacy skills?',
            'Are they included in IEP meetings (at least partially)?',
            'Do they understand their learning differences?',
            'Have you begun discussing puberty and body changes?',
        ],
        suggestedGoals: [
            {
                category: 'Academic',
                goals: [
                    'Uses classroom accommodations independently',
                    'Completes assignments with minimal support',
                    'Asks for help when needed',
                    'Organizes materials for class',
                ],
            },
            {
                category: 'Social',
                goals: [
                    'Maintains one ongoing peer friendship',
                    'Participates in group activities',
                    'Recognizes basic emotions in others',
                    'Uses appropriate greetings',
                ],
            },
            {
                category: 'Self-Advocacy',
                goals: [
                    'States own needs to trusted adults',
                    'Identifies overwhelm before meltdown',
                    'Uses break card or signal',
                    'Attends portion of IEP meeting',
                ],
            },
        ],
        language: {
            childTerm: 'child',
            parentTerm: 'parent',
            goals: 'goals',
            challenges: 'challenges',
        },
    },

    adolescence: {
        id: 'adolescence',
        label: 'Adolescence',
        ageRange: '13-17 years',
        emoji: '🌊',
        color: '#7C3AED',
        bgColor: 'rgba(124, 58, 237, 0.1)',
        description: 'The identity years: puberty, independence, self-discovery, and preparing for adulthood.',
        focusAreas: [
            'Puberty and body changes',
            'Identity and autism acceptance',
            'Executive function and independence',
            'Social relationships and dating',
            'Mental health awareness',
            'Transition planning introduction',
        ],
        keyMilestones: [
            'Understands and manages puberty changes',
            'Has positive autism identity',
            'Leads portions of IEP meetings',
            'Has meaningful peer relationships',
            'Manages daily routines with minimal support',
            'Begins exploring post-school interests',
        ],
        transitionQuestions: [
            'Does your teen participate fully in IEP/transition planning?',
            'Have they explored career/education interests?',
            'Do they have independent living skills (cooking, laundry)?',
            'Have you discussed adult services and guardianship options?',
        ],
        suggestedGoals: [
            {
                category: 'Independence',
                goals: [
                    'Manages personal hygiene routine',
                    'Prepares simple meals',
                    'Does own laundry',
                    'Manages personal schedule/calendar',
                ],
            },
            {
                category: 'Self-Advocacy',
                goals: [
                    'Leads IEP meeting discussion',
                    'Explains own learning needs',
                    'Requests accommodations from teachers',
                    'Advocates in community settings',
                ],
            },
            {
                category: 'Future Planning',
                goals: [
                    'Explores career interests',
                    'Shadows or volunteers in interest area',
                    'Researches post-secondary options',
                    'Understands supported employment options',
                ],
            },
        ],
        language: {
            childTerm: 'teen',
            parentTerm: 'parent',
            goals: 'objectives',
            challenges: 'areas of growth',
        },
    },

    transition: {
        id: 'transition',
        label: 'Transition',
        ageRange: '18-21 years',
        emoji: '🚀',
        color: '#D97706',
        bgColor: 'rgba(217, 119, 6, 0.1)',
        description: 'The bridge years: navigating the shift from school services to adult life.',
        focusAreas: [
            'Transition IEP completion',
            'Adult services eligibility',
            'Employment or higher education',
            'Guardianship and supported decision-making',
            'Housing and living arrangements',
            'Healthcare transition',
        ],
        keyMilestones: [
            'Completes transition IEP goals',
            'Enrolled in adult services (if applicable)',
            'Has post-secondary plan (work/school)',
            'Healthcare providers transitioned to adult care',
            'Guardianship/SDM established if needed',
            'Living arrangement identified',
        ],
        transitionQuestions: [
            'Are all adult services applications submitted?',
            'Is there a clear post-school plan in place?',
            'Have you established healthcare and legal supports?',
            'Does your young adult have a support network beyond family?',
        ],
        suggestedGoals: [
            {
                category: 'Employment/Education',
                goals: [
                    'Completes job training program',
                    'Maintains employment or enrollment',
                    'Uses workplace/school accommodations',
                    'Navigates job application process',
                ],
            },
            {
                category: 'Independent Living',
                goals: [
                    'Manages own finances with support',
                    'Uses public transportation',
                    'Maintains living space',
                    'Schedules own appointments',
                ],
            },
            {
                category: 'Legal/Healthcare',
                goals: [
                    'Understands own healthcare needs',
                    'Has established adult medical providers',
                    'Understands legal supports in place',
                    'Can communicate with healthcare providers',
                ],
            },
        ],
        language: {
            childTerm: 'young adult',
            parentTerm: 'support person',
            goals: 'objectives',
            challenges: 'areas for support',
        },
    },

    adulthood: {
        id: 'adulthood',
        label: 'Adulthood',
        ageRange: '22+ years',
        emoji: '🌟',
        color: '#D4AF37',
        bgColor: 'rgba(212, 175, 55, 0.1)',
        description: 'The flourishing years: living a fulfilling adult life with appropriate supports.',
        focusAreas: [
            'Meaningful employment or day activities',
            'Living arrangements and housing stability',
            'Relationships and community connection',
            'Physical and mental health',
            'Financial management',
            'Aging and future planning',
        ],
        keyMilestones: [
            'Has stable living arrangement',
            'Engaged in meaningful daily activities',
            'Has community connections and relationships',
            'Health needs are addressed',
            'Financial stability with appropriate support',
            'Long-term support plan in place',
        ],
        transitionQuestions: [
            'Is the support team stable and reliable?',
            'Are there backup plans for emergencies?',
            'Is there a long-term financial plan?',
            'Are aging-related needs being considered?',
        ],
        suggestedGoals: [
            {
                category: 'Quality of Life',
                goals: [
                    'Engages in preferred activities weekly',
                    'Maintains important relationships',
                    'Has sense of purpose and contribution',
                    'Expresses and achieves personal goals',
                ],
            },
            {
                category: 'Health & Wellness',
                goals: [
                    'Attends regular health checkups',
                    'Manages daily health routines',
                    'Engages in physical activity',
                    'Has mental health support as needed',
                ],
            },
            {
                category: 'Community',
                goals: [
                    'Participates in community activities',
                    'Has social connections outside family',
                    'Contributes to community in some way',
                    'Feels sense of belonging',
                ],
            },
        ],
        language: {
            childTerm: 'individual',
            parentTerm: 'support person',
            goals: 'aspirations',
            challenges: 'areas for growth',
        },
    },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Determine life stage from birth date
 */
export function getLifeStageFromBirthDate(birthDate: Date): LifeStage {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    if (age <= 5) return 'early_childhood';
    if (age <= 12) return 'school_age';
    if (age <= 17) return 'adolescence';
    if (age <= 21) return 'transition';
    return 'adulthood';
}

/**
 * Get the next life stage
 */
export function getNextStage(currentStage: LifeStage): LifeStage | null {
    const order: LifeStage[] = ['early_childhood', 'school_age', 'adolescence', 'transition', 'adulthood'];
    const currentIndex = order.indexOf(currentStage);
    if (currentIndex === -1 || currentIndex === order.length - 1) return null;
    return order[currentIndex + 1];
}

/**
 * Get stage-appropriate language for a term
 */
export function getStageLanguage(stage: LifeStage): StageLanguage {
    return LIFE_STAGES[stage].language;
}

/**
 * Calculate approximate age for stage transitions
 */
export function getStageAgeRange(stage: LifeStage): { min: number; max: number } {
    switch (stage) {
        case 'early_childhood': return { min: 0, max: 5 };
        case 'school_age': return { min: 6, max: 12 };
        case 'adolescence': return { min: 13, max: 17 };
        case 'transition': return { min: 18, max: 21 };
        case 'adulthood': return { min: 22, max: 100 };
    }
}

/**
 * Calculate progress through current stage
 */
export function getStageProgress(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    const stage = getLifeStageFromBirthDate(birthDate);
    const range = getStageAgeRange(stage);
    const stageYears = range.max - range.min + 1;
    const yearsInStage = age - range.min;
    
    return Math.min(100, Math.max(0, (yearsInStage / stageYears) * 100));
}

export default LIFE_STAGES;
