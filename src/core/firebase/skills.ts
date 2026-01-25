/**
 * SKILL TRACKING FIRESTORE OPERATIONS
 *
 * CRUD operations for skill tracking with ABA-informed structure.
 * Supports daily/weekly tracking, progress visualization, and IEP integration.
 *
 * Firestore Structure:
 * /users/{userId}/skills/{skillId}
 * /users/{userId}/skillEntries/{entryId}
 */

import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import type {
    Skill,
    SkillEntry,
    SkillCategory,
    MasteryLevel,
    SkillTemplate,
} from '../stores/types';

// Collection references
const getSkillsRef = (userId: string) =>
    collection(db, 'users', userId, 'skills');
const getEntriesRef = (userId: string) =>
    collection(db, 'users', userId, 'skillEntries');

/**
 * Create a new skill to track
 */
export async function createSkill(
    userId: string,
    data: {
        name: string;
        description?: string;
        category: SkillCategory;
        targetFrequency?: 'daily' | 'weekly';
        targetCount?: number;
        iepGoalId?: string;
        childName?: string;
    }
): Promise<string> {
    const skillsRef = getSkillsRef(userId);

    const skill = {
        userId,
        ...data,
        currentMastery: 'Emerging' as MasteryLevel,
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(skillsRef, skill);
    return docRef.id;
}

/**
 * Get all skills for a user
 */
export async function getSkills(
    userId: string,
    activeOnly: boolean = true
): Promise<Skill[]> {
    const skillsRef = getSkillsRef(userId);

    let q;
    if (activeOnly) {
        q = query(
            skillsRef,
            where('isActive', '==', true),
            orderBy('createdAt', 'desc')
        );
    } else {
        q = query(skillsRef, orderBy('createdAt', 'desc'));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Skill[];
}

/**
 * Get skills by category
 */
export async function getSkillsByCategory(
    userId: string,
    category: SkillCategory
): Promise<Skill[]> {
    const skillsRef = getSkillsRef(userId);
    const q = query(
        skillsRef,
        where('category', '==', category),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Skill[];
}

/**
 * Get a single skill by ID
 */
export async function getSkill(
    userId: string,
    skillId: string
): Promise<Skill | null> {
    const skillsRef = getSkillsRef(userId);
    const docRef = doc(skillsRef, skillId);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) return null;

    return {
        id: snapshot.id,
        ...snapshot.data(),
    } as Skill;
}

/**
 * Update a skill
 */
export async function updateSkill(
    userId: string,
    skillId: string,
    updates: Partial<Omit<Skill, 'id' | 'userId' | 'createdAt'>>
): Promise<void> {
    const skillsRef = getSkillsRef(userId);
    const docRef = doc(skillsRef, skillId);

    await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
    });
}

/**
 * Update skill mastery level
 */
export async function updateSkillMastery(
    userId: string,
    skillId: string,
    newMastery: MasteryLevel
): Promise<void> {
    const skillsRef = getSkillsRef(userId);
    const docRef = doc(skillsRef, skillId);

    const updates: Record<string, unknown> = {
        currentMastery: newMastery,
        updatedAt: serverTimestamp(),
    };

    if (newMastery === 'Mastered') {
        updates.masteredAt = serverTimestamp();
    }

    await updateDoc(docRef, updates);
}

/**
 * Archive a skill (soft delete)
 */
export async function archiveSkill(
    userId: string,
    skillId: string
): Promise<void> {
    await updateSkill(userId, skillId, { isActive: false });
}

/**
 * Delete a skill permanently
 */
export async function deleteSkill(
    userId: string,
    skillId: string
): Promise<void> {
    const skillsRef = getSkillsRef(userId);
    const docRef = doc(skillsRef, skillId);
    await deleteDoc(docRef);
}

// =====================================================
// SKILL ENTRIES (Daily/Weekly Tracking)
// =====================================================

/**
 * Log a skill entry (daily tracking)
 */
export async function logSkillEntry(
    userId: string,
    data: {
        skillId: string;
        date: Date;
        successCount: number;
        attemptCount: number;
        promptLevel?: 'full' | 'partial' | 'minimal' | 'independent';
        setting?: string;
        notes?: string;
        isMilestone?: boolean;
    }
): Promise<string> {
    const entriesRef = getEntriesRef(userId);

    const entry = {
        userId,
        ...data,
        date: Timestamp.fromDate(data.date),
        createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(entriesRef, entry);
    return docRef.id;
}

/**
 * Get entries for a specific skill
 */
export async function getSkillEntries(
    userId: string,
    skillId: string,
    limitCount: number = 30
): Promise<SkillEntry[]> {
    const entriesRef = getEntriesRef(userId);
    const q = query(
        entriesRef,
        where('skillId', '==', skillId),
        orderBy('date', 'desc'),
        limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as SkillEntry[];
}

/**
 * Get all entries for a date range
 */
export async function getEntriesForDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
): Promise<SkillEntry[]> {
    const entriesRef = getEntriesRef(userId);
    const q = query(
        entriesRef,
        where('date', '>=', Timestamp.fromDate(startDate)),
        where('date', '<=', Timestamp.fromDate(endDate)),
        orderBy('date', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as SkillEntry[];
}

/**
 * Get today's entries
 */
export async function getTodaysEntries(userId: string): Promise<SkillEntry[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return getEntriesForDateRange(userId, today, tomorrow);
}

/**
 * Update a skill entry
 */
export async function updateSkillEntry(
    userId: string,
    entryId: string,
    updates: Partial<Omit<SkillEntry, 'id' | 'userId' | 'skillId' | 'createdAt'>>
): Promise<void> {
    const entriesRef = getEntriesRef(userId);
    const docRef = doc(entriesRef, entryId);

    const updateData: Record<string, unknown> = { ...updates };
    if (updates.date && updates.date instanceof Date) {
        updateData.date = Timestamp.fromDate(updates.date as unknown as Date);
    }

    await updateDoc(docRef, updateData);
}

/**
 * Delete a skill entry
 */
export async function deleteSkillEntry(
    userId: string,
    entryId: string
): Promise<void> {
    const entriesRef = getEntriesRef(userId);
    const docRef = doc(entriesRef, entryId);
    await deleteDoc(docRef);
}

// =====================================================
// ANALYTICS & PROGRESS
// =====================================================

/**
 * Calculate skill progress statistics
 */
export async function getSkillProgress(
    userId: string,
    skillId: string
): Promise<{
    totalEntries: number;
    totalSuccesses: number;
    totalAttempts: number;
    successRate: number;
    recentTrend: 'improving' | 'stable' | 'declining';
    lastEntry?: Date;
    streakDays: number;
}> {
    const entries = await getSkillEntries(userId, skillId, 100);

    if (entries.length === 0) {
        return {
            totalEntries: 0,
            totalSuccesses: 0,
            totalAttempts: 0,
            successRate: 0,
            recentTrend: 'stable',
            streakDays: 0,
        };
    }

    const totalSuccesses = entries.reduce((sum, e) => sum + e.successCount, 0);
    const totalAttempts = entries.reduce((sum, e) => sum + e.attemptCount, 0);
    const successRate = totalAttempts > 0 ? totalSuccesses / totalAttempts : 0;

    // Calculate recent trend (last 7 vs previous 7)
    const recentEntries = entries.slice(0, 7);
    const olderEntries = entries.slice(7, 14);

    const recentRate =
        recentEntries.length > 0
            ? recentEntries.reduce((sum, e) => sum + e.successCount, 0) /
              Math.max(recentEntries.reduce((sum, e) => sum + e.attemptCount, 0), 1)
            : 0;

    const olderRate =
        olderEntries.length > 0
            ? olderEntries.reduce((sum, e) => sum + e.successCount, 0) /
              Math.max(olderEntries.reduce((sum, e) => sum + e.attemptCount, 0), 1)
            : 0;

    let recentTrend: 'improving' | 'stable' | 'declining' = 'stable';
    if (recentRate > olderRate + 0.1) recentTrend = 'improving';
    else if (recentRate < olderRate - 0.1) recentTrend = 'declining';

    // Calculate streak
    let streakDays = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const entry of entries) {
        const entryDate = entry.date.toDate();
        entryDate.setHours(0, 0, 0, 0);

        const expectedDate = new Date(today);
        expectedDate.setDate(expectedDate.getDate() - streakDays);

        if (entryDate.getTime() === expectedDate.getTime()) {
            streakDays++;
        } else if (entryDate < expectedDate) {
            break;
        }
    }

    return {
        totalEntries: entries.length,
        totalSuccesses,
        totalAttempts,
        successRate,
        recentTrend,
        lastEntry: entries[0]?.date.toDate(),
        streakDays,
    };
}

/**
 * Get overall skill summary for dashboard
 */
export async function getSkillsSummary(userId: string): Promise<{
    totalActiveSkills: number;
    masteredSkills: number;
    skillsByCategory: Record<SkillCategory, number>;
    todaysProgress: number; // percentage of skills tracked today
}> {
    const skills = await getSkills(userId, true);
    const todaysEntries = await getTodaysEntries(userId);

    const skillsByCategory: Record<SkillCategory, number> = {
        Communication: 0,
        'Daily Living': 0,
        Social: 0,
        Academic: 0,
        Motor: 0,
        'Self-Regulation': 0,
    };

    let masteredCount = 0;

    for (const skill of skills) {
        skillsByCategory[skill.category]++;
        if (skill.currentMastery === 'Mastered') {
            masteredCount++;
        }
    }

    const trackedSkillIds = new Set(todaysEntries.map((e) => e.skillId));
    const dailySkills = skills.filter((s) => s.targetFrequency === 'daily');
    const todaysProgress =
        dailySkills.length > 0
            ? (dailySkills.filter((s) => trackedSkillIds.has(s.id)).length /
                  dailySkills.length) *
              100
            : 0;

    return {
        totalActiveSkills: skills.length,
        masteredSkills: masteredCount,
        skillsByCategory,
        todaysProgress,
    };
}

// =====================================================
// SKILL TEMPLATES
// =====================================================

/**
 * Pre-defined skill templates for quick setup
 */
export const SKILL_TEMPLATES: SkillTemplate[] = [
    // Communication
    {
        id: 'comm-1',
        name: 'Request help using words or AAC',
        description: 'Child asks for assistance when needed',
        category: 'Communication',
        ageRange: '3-12',
        suggestedTargetCount: 5,
    },
    {
        id: 'comm-2',
        name: 'Greet familiar adults',
        description: 'Says hi, waves, or acknowledges when seeing someone',
        category: 'Communication',
        ageRange: '2-8',
        suggestedTargetCount: 3,
    },
    {
        id: 'comm-3',
        name: 'Answer "what" questions',
        description: 'Responds to questions about objects, activities',
        category: 'Communication',
        ageRange: '3-10',
        suggestedTargetCount: 5,
    },

    // Daily Living
    {
        id: 'daily-1',
        name: 'Brush teeth independently',
        description: 'Complete tooth brushing routine with minimal prompts',
        category: 'Daily Living',
        ageRange: '4-12',
        suggestedTargetCount: 2,
    },
    {
        id: 'daily-2',
        name: 'Put on shoes independently',
        description: 'Put on and fasten shoes without help',
        category: 'Daily Living',
        ageRange: '3-8',
        suggestedTargetCount: 2,
    },
    {
        id: 'daily-3',
        name: 'Use toilet independently',
        description: 'Complete bathroom routine with minimal support',
        category: 'Daily Living',
        ageRange: '3-10',
        suggestedTargetCount: 4,
    },

    // Social
    {
        id: 'social-1',
        name: 'Take turns in play',
        description: 'Wait for turn and share during games',
        category: 'Social',
        ageRange: '3-10',
        suggestedTargetCount: 3,
    },
    {
        id: 'social-2',
        name: 'Make eye contact during conversation',
        description: 'Look at speaker when being addressed',
        category: 'Social',
        ageRange: '2-12',
        suggestedTargetCount: 5,
    },
    {
        id: 'social-3',
        name: 'Join peers in play',
        description: 'Approach and engage with other children',
        category: 'Social',
        ageRange: '3-12',
        suggestedTargetCount: 2,
    },

    // Self-Regulation
    {
        id: 'reg-1',
        name: 'Identify own emotions',
        description: 'Name feeling when asked "How do you feel?"',
        category: 'Self-Regulation',
        ageRange: '4-12',
        suggestedTargetCount: 3,
    },
    {
        id: 'reg-2',
        name: 'Use calming strategy when upset',
        description: 'Apply a regulation technique when dysregulated',
        category: 'Self-Regulation',
        ageRange: '4-12',
        suggestedTargetCount: 2,
    },
    {
        id: 'reg-3',
        name: 'Transition between activities',
        description: 'Move from one activity to next with support',
        category: 'Self-Regulation',
        ageRange: '3-12',
        suggestedTargetCount: 4,
    },

    // Motor
    {
        id: 'motor-1',
        name: 'Hold pencil/crayon correctly',
        description: 'Use appropriate grip for writing/drawing',
        category: 'Motor',
        ageRange: '3-8',
        suggestedTargetCount: 3,
    },
    {
        id: 'motor-2',
        name: 'Catch a ball',
        description: 'Catch a gently thrown ball with hands',
        category: 'Motor',
        ageRange: '4-10',
        suggestedTargetCount: 5,
    },

    // Academic
    {
        id: 'acad-1',
        name: 'Recognize own written name',
        description: 'Identify name when seeing it written',
        category: 'Academic',
        ageRange: '3-6',
        suggestedTargetCount: 3,
    },
    {
        id: 'acad-2',
        name: 'Count objects 1-10',
        description: 'Touch and count objects accurately',
        category: 'Academic',
        ageRange: '3-7',
        suggestedTargetCount: 3,
    },
];

/**
 * Create skill from template
 */
export async function createSkillFromTemplate(
    userId: string,
    templateId: string,
    overrides?: Partial<{
        name: string;
        description: string;
        targetFrequency: 'daily' | 'weekly';
        targetCount: number;
    }>
): Promise<string | null> {
    const template = SKILL_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return null;

    return createSkill(userId, {
        name: overrides?.name || template.name,
        description: overrides?.description || template.description,
        category: template.category,
        targetFrequency: overrides?.targetFrequency || 'daily',
        targetCount: overrides?.targetCount || template.suggestedTargetCount || 3,
    });
}
