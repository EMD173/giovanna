/**
 * Notification Bell Component
 * 
 * Shows notification count badge and dropdown with recent notifications.
 * Subscribes to real-time updates from Firebase.
 */

import { useState, useEffect, useRef } from 'react';
import { Bell, X, Share2, Users, FileText, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../core/stores/useAuthStore';
import {
    subscribeToNotifications,
    markAsRead,
    markAllAsRead,
    type VillageNotification,
    type NotificationType,
} from '../core/firebase/notifications';

const NOTIFICATION_ICONS: Record<NotificationType, typeof Bell> = {
    observation_shared: Share2,
    team_member_joined: Users,
    invite_accepted: Check,
    weekly_summary: FileText,
};

const NOTIFICATION_COLORS: Record<NotificationType, string> = {
    observation_shared: '#4B0082',
    team_member_joined: '#22c55e',
    invite_accepted: '#D4AF37',
    weekly_summary: '#3b82f6',
};

export const NotificationBell = () => {
    const { user } = useAuthStore();
    const [notifications, setNotifications] = useState<VillageNotification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.read).length;

    // Subscribe to real-time notifications
    useEffect(() => {
        if (!user) return;

        const unsubscribe = subscribeToNotifications(user.uid, setNotifications);
        return () => unsubscribe();
    }, [user]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = async (notification: VillageNotification) => {
        if (!user || notification.read) return;
        await markAsRead(user.uid, notification.id);
    };

    const handleMarkAllRead = async () => {
        if (!user) return;
        await markAllAsRead(user.uid);
    };

    const formatTime = (date: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-xl bg-white/30 hover:bg-white/50 transition-colors"
            >
                <Bell className="w-5 h-5 text-[#4B0082]" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-12 w-80 max-h-[70vh] bg-white rounded-2xl shadow-xl overflow-hidden z-50"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="font-bold text-[#1A1A1A]">Notifications</h3>
                            <div className="flex items-center gap-2">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={handleMarkAllRead}
                                        className="text-xs text-[#4B0082] font-semibold hover:underline"
                                    >
                                        Mark all read
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 rounded-lg hover:bg-gray-100"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Notification List */}
                        <div className="max-h-[50vh] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center">
                                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                    <p className="text-sm opacity-60">No notifications yet</p>
                                    <p className="text-xs opacity-40 mt-1">
                                        You'll see updates when team members share or join
                                    </p>
                                </div>
                            ) : (
                                notifications.map((notification) => {
                                    const Icon = NOTIFICATION_ICONS[notification.type] || Bell;
                                    const color = NOTIFICATION_COLORS[notification.type] || '#4B0082';

                                    return (
                                        <button
                                            key={notification.id}
                                            onClick={() => handleNotificationClick(notification)}
                                            className={`w-full p-4 text-left border-b hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-[#4B0082]/5' : ''
                                                }`}
                                        >
                                            <div className="flex gap-3">
                                                <div
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                                    style={{ backgroundColor: `${color}15` }}
                                                >
                                                    <Icon className="w-5 h-5" style={{ color }} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <p className={`text-sm font-semibold ${!notification.read ? 'text-[#1A1A1A]' : 'text-gray-600'}`}>
                                                            {notification.title}
                                                        </p>
                                                        {!notification.read && (
                                                            <span className="w-2 h-2 rounded-full bg-[#4B0082] shrink-0" />
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {formatTime(notification.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
