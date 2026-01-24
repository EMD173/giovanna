/**
 * Notifications Service
 * 
 * Manages in-app notifications for village members when:
 * - Observations are shared with the care team
 * - New team members join
 * - Updates to shared content
 */

import {
    collection,
    doc,
    addDoc,
    getDocs,
    updateDoc,
    query,
    where,
    orderBy,
    limit,
    Timestamp,
    onSnapshot,
} from 'firebase/firestore';
import { db } from './config';
import { trackEvent } from '../../lib/analytics';

export type NotificationType =
    | 'observation_shared'
    | 'team_member_joined'
    | 'invite_accepted'
    | 'weekly_summary';

export interface VillageNotification {
    id: string;
    userId: string;          // Recipient
    type: NotificationType;
    title: string;
    message: string;
    data?: Record<string, string>;
    read: boolean;
    createdAt: Date;
}

/**
 * Create a notification for a user
 */
export async function createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    data?: Record<string, string>
): Promise<string> {
    const notificationsRef = collection(db, 'users', userId, 'notifications');

    const docRef = await addDoc(notificationsRef, {
        userId,
        type,
        title,
        message,
        data: data || {},
        read: false,
        createdAt: Timestamp.fromDate(new Date()),
    });

    trackEvent('notification_created', { type, recipientId: userId });

    return docRef.id;
}

/**
 * Notify all team members about a shared observation
 */
export async function notifyTeamOfSharedObservation(
    senderName: string,
    childName: string,
    teamMemberIds: string[],
    observationType: string = 'witnessing'
): Promise<void> {
    const title = `New ${observationType} shared`;
    const message = `${senderName} shared a new moment about ${childName}'s day.`;

    const promises = teamMemberIds.map(memberId =>
        createNotification(memberId, 'observation_shared', title, message, {
            senderName,
            childName,
        })
    );

    await Promise.all(promises);
    trackEvent('team_notified', { memberCount: teamMemberIds.length });
}

/**
 * Notify team admin that a member joined
 */
export async function notifyTeamMemberJoined(
    adminId: string,
    memberName: string,
    role: string,
    childName: string
): Promise<void> {
    const title = `${memberName} joined the village`;
    const message = `${memberName} (${role}) is now part of ${childName}'s care team.`;

    await createNotification(adminId, 'team_member_joined', title, message, {
        memberName,
        role,
    });
}

/**
 * Get notifications for a user
 */
export async function getNotifications(
    userId: string,
    maxCount: number = 20
): Promise<VillageNotification[]> {
    const notificationsRef = collection(db, 'users', userId, 'notifications');
    const q = query(
        notificationsRef,
        orderBy('createdAt', 'desc'),
        limit(maxCount)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            userId: data.userId,
            type: data.type,
            title: data.title,
            message: data.message,
            data: data.data,
            read: data.read,
            createdAt: data.createdAt?.toDate?.() || new Date(),
        };
    });
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(userId: string): Promise<number> {
    const notificationsRef = collection(db, 'users', userId, 'notifications');
    const q = query(notificationsRef, where('read', '==', false));
    const snapshot = await getDocs(q);
    return snapshot.size;
}

/**
 * Mark notification as read
 */
export async function markAsRead(
    userId: string,
    notificationId: string
): Promise<void> {
    const notificationRef = doc(db, 'users', userId, 'notifications', notificationId);
    await updateDoc(notificationRef, { read: true });
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead(userId: string): Promise<void> {
    const notificationsRef = collection(db, 'users', userId, 'notifications');
    const q = query(notificationsRef, where('read', '==', false));
    const snapshot = await getDocs(q);

    const promises = snapshot.docs.map(doc =>
        updateDoc(doc.ref, { read: true })
    );

    await Promise.all(promises);
}

/**
 * Subscribe to real-time notification updates
 */
export function subscribeToNotifications(
    userId: string,
    callback: (notifications: VillageNotification[]) => void
): () => void {
    const notificationsRef = collection(db, 'users', userId, 'notifications');
    const q = query(
        notificationsRef,
        orderBy('createdAt', 'desc'),
        limit(20)
    );

    return onSnapshot(q, (snapshot) => {
        const notifications = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                userId: data.userId,
                type: data.type as NotificationType,
                title: data.title,
                message: data.message,
                data: data.data,
                read: data.read,
                createdAt: data.createdAt?.toDate?.() || new Date(),
            };
        });
        callback(notifications);
    });
}
