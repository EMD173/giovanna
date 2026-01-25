/**
 * THERAPY SESSION FIRESTORE OPERATIONS
 *
 * CRUD operations for therapy session prep, notes, and goal tracking.
 * Helps parents prepare for sessions and document outcomes.
 *
 * Firestore Structure:
 * /users/{userId}/therapySessions/{sessionId}
 * /users/{userId}/therapyGoals/{goalId}
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

// =====================================================
// TYPES
// =====================================================

export type TherapyType = 'ABA' | 'OT' | 'Speech' | 'PT' | 'Counseling' | 'Other';
export type SessionStatus = 'scheduled' | 'prep_ready' | 'completed' | 'cancelled';
export type GoalStatus = 'active' | 'achieved' | 'paused' | 'discontinued';

export interface TherapyProvider {
    id: string;
    name: string;
    type: TherapyType;
    organization?: string;
    email?: string;
    phone?: string;
    notes?: string;
}

export interface TherapySession {
    id: string;
    userId: string;
    providerId?: string;
    providerName: string;
    therapyType: TherapyType;

    // Scheduling
    scheduledDate: Timestamp;
    duration?: number; // minutes
    location?: string;
    isVirtual?: boolean;
    status: SessionStatus;

    // Prep Content
    prepNotes?: string;
    questionsForTherapist?: string[];
    observationsToDiscuss?: string[]; // observation IDs
    insightsToShare?: string[]; // insight IDs
    videosToShow?: string[]; // video URLs

    // Session Notes (after session)
    sessionNotes?: string;
    therapistFeedback?: string;
    homeActivities?: string[];
    nextSteps?: string[];

    // Goals discussed
    goalsDiscussed?: string[]; // goal IDs
    goalUpdates?: { goalId: string; note: string; progressChange?: number }[];

    // Metadata
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface TherapyGoal {
    id: string;
    userId: string;
    therapyType: TherapyType;
    providerId?: string;

    // Goal content
    title: string;
    description: string;
    targetBehavior?: string;
    measurementCriteria?: string;

    // Progress
    status: GoalStatus;
    currentProgress: number; // 0-100
    startDate: Timestamp;
    targetDate?: Timestamp;
    achievedDate?: Timestamp;

    // Updates
    progressNotes: { date: Timestamp; note: string; progress: number }[];

    // IEP Integration
    iepGoalId?: string;
    relatedSkillIds?: string[];

    createdAt: Timestamp;
    updatedAt: Timestamp;
}

// =====================================================
// COLLECTION REFERENCES
// =====================================================

const getSessionsRef = (userId: string) =>
    collection(db, 'users', userId, 'therapySessions');
const getGoalsRef = (userId: string) =>
    collection(db, 'users', userId, 'therapyGoals');
const getProvidersRef = (userId: string) =>
    collection(db, 'users', userId, 'therapyProviders');

// =====================================================
// PROVIDER OPERATIONS
// =====================================================

/**
 * Add a therapy provider
 */
export async function addProvider(
    userId: string,
    data: Omit<TherapyProvider, 'id'>
): Promise<string> {
    const providersRef = getProvidersRef(userId);
    const docRef = await addDoc(providersRef, {
        ...data,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
}

/**
 * Get all providers
 */
export async function getProviders(userId: string): Promise<TherapyProvider[]> {
    const providersRef = getProvidersRef(userId);
    const snapshot = await getDocs(providersRef);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as TherapyProvider[];
}

// =====================================================
// SESSION OPERATIONS
// =====================================================

/**
 * Create a new therapy session
 */
export async function createSession(
    userId: string,
    data: {
        providerName: string;
        therapyType: TherapyType;
        scheduledDate: Date;
        duration?: number;
        location?: string;
        isVirtual?: boolean;
        providerId?: string;
    }
): Promise<string> {
    const sessionsRef = getSessionsRef(userId);

    const session = {
        userId,
        ...data,
        scheduledDate: Timestamp.fromDate(data.scheduledDate),
        status: 'scheduled' as SessionStatus,
        questionsForTherapist: [],
        observationsToDiscuss: [],
        insightsToShare: [],
        videosToShow: [],
        homeActivities: [],
        nextSteps: [],
        goalsDiscussed: [],
        goalUpdates: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(sessionsRef, session);
    return docRef.id;
}

/**
 * Get upcoming sessions
 */
export async function getUpcomingSessions(
    userId: string,
    limitCount: number = 10
): Promise<TherapySession[]> {
    const sessionsRef = getSessionsRef(userId);
    const now = Timestamp.now();

    const q = query(
        sessionsRef,
        where('scheduledDate', '>=', now),
        where('status', 'in', ['scheduled', 'prep_ready']),
        orderBy('scheduledDate', 'asc'),
        limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as TherapySession[];
}

/**
 * Get past sessions
 */
export async function getPastSessions(
    userId: string,
    limitCount: number = 20
): Promise<TherapySession[]> {
    const sessionsRef = getSessionsRef(userId);

    const q = query(
        sessionsRef,
        where('status', '==', 'completed'),
        orderBy('scheduledDate', 'desc'),
        limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as TherapySession[];
}

/**
 * Get a single session
 */
export async function getSession(
    userId: string,
    sessionId: string
): Promise<TherapySession | null> {
    const sessionsRef = getSessionsRef(userId);
    const docRef = doc(sessionsRef, sessionId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    return {
        id: docSnap.id,
        ...docSnap.data(),
    } as TherapySession;
}

/**
 * Update session prep content
 */
export async function updateSessionPrep(
    userId: string,
    sessionId: string,
    prep: {
        prepNotes?: string;
        questionsForTherapist?: string[];
        observationsToDiscuss?: string[];
        insightsToShare?: string[];
        videosToShow?: string[];
    }
): Promise<void> {
    const sessionsRef = getSessionsRef(userId);
    const docRef = doc(sessionsRef, sessionId);

    await updateDoc(docRef, {
        ...prep,
        status: 'prep_ready',
        updatedAt: serverTimestamp(),
    });
}

/**
 * Add session notes after completion
 */
export async function completeSession(
    userId: string,
    sessionId: string,
    notes: {
        sessionNotes?: string;
        therapistFeedback?: string;
        homeActivities?: string[];
        nextSteps?: string[];
        goalUpdates?: { goalId: string; note: string; progressChange?: number }[];
    }
): Promise<void> {
    const sessionsRef = getSessionsRef(userId);
    const docRef = doc(sessionsRef, sessionId);

    await updateDoc(docRef, {
        ...notes,
        status: 'completed',
        updatedAt: serverTimestamp(),
    });

    // Update goal progress if provided
    if (notes.goalUpdates) {
        for (const update of notes.goalUpdates) {
            await addGoalProgressNote(userId, update.goalId, update.note, update.progressChange);
        }
    }
}

/**
 * Cancel a session
 */
export async function cancelSession(
    userId: string,
    sessionId: string
): Promise<void> {
    const sessionsRef = getSessionsRef(userId);
    const docRef = doc(sessionsRef, sessionId);

    await updateDoc(docRef, {
        status: 'cancelled',
        updatedAt: serverTimestamp(),
    });
}

/**
 * Delete a session
 */
export async function deleteSession(
    userId: string,
    sessionId: string
): Promise<void> {
    const sessionsRef = getSessionsRef(userId);
    const docRef = doc(sessionsRef, sessionId);
    await deleteDoc(docRef);
}

// =====================================================
// GOAL OPERATIONS
// =====================================================

/**
 * Create a therapy goal
 */
export async function createGoal(
    userId: string,
    data: {
        therapyType: TherapyType;
        title: string;
        description: string;
        targetBehavior?: string;
        measurementCriteria?: string;
        targetDate?: Date;
        providerId?: string;
        iepGoalId?: string;
        relatedSkillIds?: string[];
    }
): Promise<string> {
    const goalsRef = getGoalsRef(userId);

    const goal = {
        userId,
        ...data,
        status: 'active' as GoalStatus,
        currentProgress: 0,
        startDate: serverTimestamp(),
        targetDate: data.targetDate ? Timestamp.fromDate(data.targetDate) : null,
        progressNotes: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(goalsRef, goal);
    return docRef.id;
}

/**
 * Get active goals
 */
export async function getActiveGoals(
    userId: string,
    therapyType?: TherapyType
): Promise<TherapyGoal[]> {
    const goalsRef = getGoalsRef(userId);

    let q;
    if (therapyType) {
        q = query(
            goalsRef,
            where('status', '==', 'active'),
            where('therapyType', '==', therapyType),
            orderBy('createdAt', 'desc')
        );
    } else {
        q = query(
            goalsRef,
            where('status', '==', 'active'),
            orderBy('createdAt', 'desc')
        );
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as TherapyGoal[];
}

/**
 * Get all goals (including achieved)
 */
export async function getAllGoals(userId: string): Promise<TherapyGoal[]> {
    const goalsRef = getGoalsRef(userId);

    const q = query(goalsRef, orderBy('createdAt', 'desc'));

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as TherapyGoal[];
}

/**
 * Update goal progress
 */
export async function updateGoalProgress(
    userId: string,
    goalId: string,
    progress: number,
    status?: GoalStatus
): Promise<void> {
    const goalsRef = getGoalsRef(userId);
    const docRef = doc(goalsRef, goalId);

    const updates: Record<string, unknown> = {
        currentProgress: Math.min(100, Math.max(0, progress)),
        updatedAt: serverTimestamp(),
    };

    if (status) {
        updates.status = status;
        if (status === 'achieved') {
            updates.achievedDate = serverTimestamp();
        }
    }

    await updateDoc(docRef, updates);
}

/**
 * Add a progress note to a goal
 */
export async function addGoalProgressNote(
    userId: string,
    goalId: string,
    note: string,
    progressChange?: number
): Promise<void> {
    const goalsRef = getGoalsRef(userId);
    const docRef = doc(goalsRef, goalId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return;

    const goal = docSnap.data() as TherapyGoal;
    const newProgress = progressChange
        ? Math.min(100, Math.max(0, goal.currentProgress + progressChange))
        : goal.currentProgress;

    const progressNotes = [
        ...(goal.progressNotes || []),
        {
            date: Timestamp.now(),
            note,
            progress: newProgress,
        },
    ];

    await updateDoc(docRef, {
        progressNotes,
        currentProgress: newProgress,
        updatedAt: serverTimestamp(),
    });
}

/**
 * Archive/complete a goal
 */
export async function archiveGoal(
    userId: string,
    goalId: string,
    status: 'achieved' | 'discontinued'
): Promise<void> {
    const goalsRef = getGoalsRef(userId);
    const docRef = doc(goalsRef, goalId);

    const updates: Record<string, unknown> = {
        status,
        updatedAt: serverTimestamp(),
    };

    if (status === 'achieved') {
        updates.achievedDate = serverTimestamp();
        updates.currentProgress = 100;
    }

    await updateDoc(docRef, updates);
}

// =====================================================
// PREP HELPERS
// =====================================================

/**
 * Get suggested content for session prep
 * Returns recent observations, insights, and videos relevant to the therapy type
 */
export async function getSessionPrepSuggestions(
    userId: string,
    therapyType: TherapyType,
    daysSince: number = 14
): Promise<{
    observationIds: string[];
    insightIds: string[];
    videoUrls: string[];
    goals: TherapyGoal[];
}> {
    // Import here to avoid circular dependencies
    const { getObservations } = await import('./firestore');
    const { getMemoryInsights } = await import('./memory');

    // Get recent observations
    const observations = await getObservations(userId, 50);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysSince);

    const recentObs = observations.filter((obs) => {
        const obsDate = obs.timestamp?.toDate?.();
        return obsDate && obsDate >= cutoffDate;
    });

    // Filter observations relevant to therapy type
    const relevantChannels = getRelevantChannels(therapyType);
    const relevantObs = recentObs.filter((obs) =>
        obs.channels?.some((c) => relevantChannels.includes(c))
    );

    // Get videos from observations
    const videoUrls: string[] = [];
    recentObs.forEach((obs) => {
        obs.media?.forEach((m) => {
            if (m.type === 'video' && m.url) {
                videoUrls.push(m.url);
            }
        });
    });

    // Get relevant insights
    const insights = await getMemoryInsights(userId);
    const relevantCategories = getRelevantInsightCategories(therapyType);
    const relevantInsights = insights.filter((i) =>
        relevantCategories.includes(i.category)
    );

    // Get active goals for this therapy type
    const goals = await getActiveGoals(userId, therapyType);

    return {
        observationIds: relevantObs.slice(0, 10).map((o) => o.id),
        insightIds: relevantInsights.slice(0, 5).map((i) => i.id),
        videoUrls: videoUrls.slice(0, 5),
        goals,
    };
}

/**
 * Get relevant channels for a therapy type
 */
function getRelevantChannels(therapyType: TherapyType): string[] {
    switch (therapyType) {
        case 'ABA':
            return ['Seeking Safety', 'Connection Bid', 'Joy Expression', 'Transition Signal'];
        case 'OT':
            return ['Sensory Need', 'Body Wisdom'];
        case 'Speech':
            return ['Connection Bid', 'Joy Expression'];
        case 'PT':
            return ['Body Wisdom', 'Sensory Need'];
        case 'Counseling':
            return ['Seeking Safety', 'Connection Bid', 'Joy Expression'];
        default:
            return ['Seeking Safety', 'Sensory Need', 'Connection Bid', 'Transition Signal', 'Body Wisdom', 'Joy Expression'];
    }
}

/**
 * Get relevant insight categories for a therapy type
 */
function getRelevantInsightCategories(therapyType: TherapyType): string[] {
    switch (therapyType) {
        case 'ABA':
            return ['trigger', 'calming', 'communication', 'strength'];
        case 'OT':
            return ['sensory', 'calming', 'environment'];
        case 'Speech':
            return ['communication', 'strength', 'connection'];
        case 'PT':
            return ['sensory', 'strength'];
        case 'Counseling':
            return ['trigger', 'calming', 'connection', 'strength'];
        default:
            return ['trigger', 'calming', 'sensory', 'communication', 'strength'];
    }
}
