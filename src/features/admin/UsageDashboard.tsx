/**
 * Usage Dashboard: Admin Analytics View
 * 
 * Shows key usage metrics from Firestore for the app owner.
 * This is a simple in-app dashboard to track growth and engagement.
 */

import { useState, useEffect } from 'react';
import {
    BarChart3,
    Users,
    MessageCircle,
    ClipboardList,
    Calendar,
    RefreshCw,
    TrendingUp,
    Home,
} from 'lucide-react';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../../core/firebase/config';
import { useAuthStore } from '../../core/stores/useAuthStore';

interface DashboardStats {
    totalUsers: number;
    totalObservations: number;
    totalConversations: number;
    thisWeekObservations: number;
    thisWeekConversations: number;
    usersWithProfiles: number;
}

interface UsageDashboardProps {
    onBack?: () => void;
}

export const UsageDashboard = ({ onBack }: UsageDashboardProps) => {
    const { user } = useAuthStore();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

    const fetchStats = async () => {
        if (!user) return;

        setLoading(true);
        try {
            // Get all users
            const usersSnap = await getDocs(collection(db, 'users'));
            const totalUsers = usersSnap.size;

            // Count users with profiles (have childName set)
            let usersWithProfiles = 0;
            usersSnap.docs.forEach(doc => {
                if (doc.data().childName) {
                    usersWithProfiles++;
                }
            });

            // Get all observations across all users
            let totalObservations = 0;
            let thisWeekObservations = 0;
            const oneWeekAgo = Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));

            for (const userDoc of usersSnap.docs) {
                const obsRef = collection(db, 'users', userDoc.id, 'observations');
                const allObsSnap = await getDocs(obsRef);
                totalObservations += allObsSnap.size;

                // Count this week's observations
                const weekObsQuery = query(obsRef, where('timestamp', '>=', oneWeekAgo));
                const weekObsSnap = await getDocs(weekObsQuery);
                thisWeekObservations += weekObsSnap.size;
            }

            // Get all Oracle conversations
            let totalConversations = 0;
            let thisWeekConversations = 0;

            for (const userDoc of usersSnap.docs) {
                const convRef = collection(db, 'users', userDoc.id, 'oracleConversations');
                const allConvSnap = await getDocs(convRef);
                totalConversations += allConvSnap.size;

                // Count this week's conversations
                const weekConvQuery = query(convRef, where('createdAt', '>=', oneWeekAgo));
                const weekConvSnap = await getDocs(weekConvQuery);
                thisWeekConversations += weekConvSnap.size;
            }

            setStats({
                totalUsers,
                totalObservations,
                totalConversations,
                thisWeekObservations,
                thisWeekConversations,
                usersWithProfiles,
            });

            setLastRefresh(new Date());
        } catch (error) {
            console.error('Failed to fetch dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [user]);

    const StatCard = ({
        icon: Icon,
        label,
        value,
        subValue,
        color
    }: {
        icon: typeof Users;
        label: string;
        value: number | string;
        subValue?: string;
        color: string;
    }) => (
        <div className="glass-panel p-4 rounded-[20px]">
            <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-xl`} style={{ backgroundColor: `${color}20` }}>
                    <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider opacity-60">{label}</span>
            </div>
            <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {value}
            </p>
            {subValue && (
                <p className="text-xs opacity-60 mt-1">{subValue}</p>
            )}
        </div>
    );

    return (
        <div className="min-h-screen pb-32 px-4 pt-6 fade-in" style={{ backgroundColor: 'rgb(var(--glass-base))' }}>
            {/* Header */}
            <header className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        {onBack && (
                            <button
                                onClick={onBack}
                                className="text-sm font-semibold text-[#4B0082] mb-2 flex items-center gap-1"
                            >
                                <Home className="w-4 h-4" />
                                Back to Home
                            </button>
                        )}
                        <h2 className="text-sm font-bold tracking-widest text-[#D4AF37] uppercase opacity-80">
                            Admin Only
                        </h2>
                        <h1
                            className="text-3xl mt-1"
                            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                        >
                            Usage Dashboard
                        </h1>
                    </div>
                    <button
                        onClick={fetchStats}
                        disabled={loading}
                        className="p-3 rounded-xl bg-white/40 hover:bg-white/60 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-5 h-5 text-[#4B0082] ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
                <p className="text-xs opacity-60 mt-2">
                    Last refreshed: {lastRefresh.toLocaleTimeString()}
                </p>
            </header>

            {loading && !stats ? (
                <div className="flex items-center justify-center py-20">
                    <RefreshCw className="w-8 h-8 animate-spin text-[#4B0082]" />
                </div>
            ) : stats ? (
                <div className="space-y-6">
                    {/* Main Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <StatCard
                            icon={Users}
                            label="Total Users"
                            value={stats.totalUsers}
                            subValue={`${stats.usersWithProfiles} with profiles`}
                            color="#4B0082"
                        />
                        <StatCard
                            icon={ClipboardList}
                            label="Observations"
                            value={stats.totalObservations}
                            subValue={`${stats.thisWeekObservations} this week`}
                            color="#22c55e"
                        />
                        <StatCard
                            icon={MessageCircle}
                            label="Oracle Chats"
                            value={stats.totalConversations}
                            subValue={`${stats.thisWeekConversations} this week`}
                            color="#D4AF37"
                        />
                        <StatCard
                            icon={TrendingUp}
                            label="Engagement"
                            value={stats.totalUsers > 0
                                ? Math.round((stats.usersWithProfiles / stats.totalUsers) * 100) + '%'
                                : '0%'
                            }
                            subValue="Profile completion"
                            color="#ef4444"
                        />
                    </div>

                    {/* Weekly Activity */}
                    <div className="glass-panel p-5 rounded-[24px]">
                        <div className="flex items-center gap-2 mb-4">
                            <Calendar className="w-5 h-5 text-[#4B0082]" />
                            <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                                This Week
                            </h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm opacity-70">New Observations</span>
                                <span className="font-bold text-[#22c55e]">+{stats.thisWeekObservations}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm opacity-70">Oracle Conversations</span>
                                <span className="font-bold text-[#D4AF37]">+{stats.thisWeekConversations}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm opacity-70">Avg Obs/User</span>
                                <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                                    {stats.totalUsers > 0
                                        ? (stats.totalObservations / stats.totalUsers).toFixed(1)
                                        : '0'
                                    }
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Insights */}
                    <div className="glass-panel p-5 rounded-[24px]">
                        <div className="flex items-center gap-2 mb-4">
                            <BarChart3 className="w-5 h-5 text-[#D4AF37]" />
                            <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                                Quick Insights
                            </h3>
                        </div>
                        <div className="space-y-2 text-sm">
                            {stats.totalUsers === 0 ? (
                                <p className="opacity-60">No users yet. Share your app!</p>
                            ) : (
                                <>
                                    <p className="opacity-70">
                                        • {stats.usersWithProfiles} out of {stats.totalUsers} users have set up their child's profile
                                    </p>
                                    <p className="opacity-70">
                                        • Average of {(stats.totalObservations / Math.max(1, stats.totalUsers)).toFixed(1)} observations per user
                                    </p>
                                    <p className="opacity-70">
                                        • {stats.thisWeekObservations > 0 ? `Active week with ${stats.thisWeekObservations} new observations! 🎉` : 'Encourage users to log observations'}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Firebase Console Link */}
                    <div className="text-center">
                        <a
                            href="https://console.firebase.google.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-[#4B0082] underline"
                        >
                            View detailed analytics in Firebase Console →
                        </a>
                    </div>
                </div>
            ) : (
                <p className="text-center opacity-60">Failed to load stats</p>
            )}
        </div>
    );
};
