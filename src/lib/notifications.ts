/**
 * NOTIFICATIONS: Push Notification Infrastructure
 * 
 * Firebase Cloud Messaging setup for:
 * - Daily mantra reminders
 * - Oracle check-in prompts
 * - Village activity notifications
 */

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export type NotificationType =
    | 'mantra_reminder'
    | 'oracle_checkin'
    | 'village_activity'
    | 'milestone'
    | 'system';

export interface NotificationPayload {
    type: NotificationType;
    title: string;
    body: string;
    icon?: string;
    data?: Record<string, string>;
    clickAction?: string;
}

// ============================================================================
// PERMISSION MANAGEMENT
// ============================================================================

export async function requestNotificationPermission(): Promise<boolean> {
    // Check if notifications are supported
    if (!('Notification' in window)) {
        console.warn('[Notifications] Not supported in this browser');
        return false;
    }

    // Check current permission status
    if (Notification.permission === 'granted') {
        return true;
    }

    if (Notification.permission === 'denied') {
        console.warn('[Notifications] Permission was denied');
        return false;
    }

    // Request permission
    try {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    } catch (error) {
        console.error('[Notifications] Permission request failed:', error);
        return false;
    }
}

export function getNotificationPermissionStatus(): NotificationPermission | 'unsupported' {
    if (!('Notification' in window)) {
        return 'unsupported';
    }
    return Notification.permission;
}

// ============================================================================
// LOCAL NOTIFICATIONS (Basic Implementation)
// ============================================================================

export function showLocalNotification(payload: NotificationPayload): void {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
        console.warn('[Notifications] Cannot show notification - permission not granted');
        return;
    }

    const notification = new Notification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        tag: payload.type,
        data: payload.data,
    });

    notification.onclick = () => {
        if (payload.clickAction) {
            window.location.href = payload.clickAction;
        }
        notification.close();
    };
}

// ============================================================================
// SCHEDULED NOTIFICATIONS (Using localStorage + Service Worker)
// ============================================================================

interface ScheduledNotification {
    id: string;
    payload: NotificationPayload;
    scheduledTime: number; // Unix timestamp
    recurring?: 'daily' | 'weekly';
}

const SCHEDULED_STORAGE_KEY = 'giovanna_scheduled_notifications';

function getScheduledNotifications(): ScheduledNotification[] {
    try {
        const stored = localStorage.getItem(SCHEDULED_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

function saveScheduledNotifications(notifications: ScheduledNotification[]): void {
    try {
        localStorage.setItem(SCHEDULED_STORAGE_KEY, JSON.stringify(notifications));
    } catch {
        // Ignore storage errors
    }
}

export function scheduleNotification(
    payload: NotificationPayload,
    scheduledTime: Date,
    recurring?: 'daily' | 'weekly'
): string {
    const id = `notif_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    const notifications = getScheduledNotifications();
    notifications.push({
        id,
        payload,
        scheduledTime: scheduledTime.getTime(),
        recurring,
    });
    saveScheduledNotifications(notifications);

    console.log('[Notifications] Scheduled:', id, 'for', scheduledTime.toISOString());
    return id;
}

export function cancelScheduledNotification(id: string): void {
    const notifications = getScheduledNotifications();
    const filtered = notifications.filter((n) => n.id !== id);
    saveScheduledNotifications(filtered);
}

export function cancelAllScheduledNotifications(): void {
    localStorage.removeItem(SCHEDULED_STORAGE_KEY);
}

// ============================================================================
// PRESET NOTIFICATIONS
// ============================================================================

export function scheduleDailyMantraReminder(hour: number = 8): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(hour, 0, 0, 0);

    return scheduleNotification(
        {
            type: 'mantra_reminder',
            title: 'Morning Mantra',
            body: 'Take a moment to set your intention for today.',
            clickAction: '/?view=Journey',
        },
        tomorrow,
        'daily'
    );
}

export function scheduleOracleCheckin(hour: number = 19): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(hour, 0, 0, 0);

    return scheduleNotification(
        {
            type: 'oracle_checkin',
            title: 'Evening Reflection',
            body: 'The Oracle is ready when you are. How was today?',
            clickAction: '/?view=Oracle',
        },
        tomorrow,
        'daily'
    );
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
    requestNotificationPermission,
    getNotificationPermissionStatus,
    showLocalNotification,
    scheduleNotification,
    cancelScheduledNotification,
    cancelAllScheduledNotifications,
    scheduleDailyMantraReminder,
    scheduleOracleCheckin,
};
