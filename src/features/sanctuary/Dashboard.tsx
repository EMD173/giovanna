/**
 * DASHBOARD: Dynamic Materiality Sanctuary
 * 
 * The visual atmosphere responds to the child's pulse:
 * - High reciprocity → Gold Shimmer highlights
 * - Systemic stress → Deeper Regal Purple, increased glass opacity
 * 
 * Now personalized with user profile data.
 */

import { useEffect, useState } from 'react';
import { CloudSun, Battery, CalendarClock, ChevronRight, Sparkles, Heart, AlertTriangle, BookOpen, ToggleLeft, ToggleRight, BarChart3, Target, Brain, Stethoscope, Flame } from 'lucide-react';
import { useAuthStore } from '../../core/stores/useAuthStore';
import { useSanctuaryPulse } from '../../core/stores/useSanctuaryPulse';
import { RegulationGlow } from '../../design/atoms/RegulationGlow';
import { getProfile } from '../../core/firebase/profiles';
import { NotificationBell } from '../../components/NotificationBell';
import type { UserProfile } from '../../core/stores/profileTypes';

interface DashboardProps {
    onNavigate?: (view: string) => void;
}

export const Dashboard = ({ onNavigate }: DashboardProps) => {
    const { user } = useAuthStore();
    const pulse = useSanctuaryPulse();
    const [isLoaded, setIsLoaded] = useState(false);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [teacherMode, setTeacherMode] = useState(false);

    // Refresh sanctuary pulse and fetch profile on mount
    useEffect(() => {
        if (user) {
            pulse.refresh(user.uid).then(() => setIsLoaded(true));
            getProfile(user.uid).then(setProfile);
        }
    }, [user]);

    // Get time-based greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    // Dynamic materiality values
    const goldIntensity = pulse.getGoldIntensity();
    const purpleDepth = pulse.getPurpleDepth();
    const glassOpacity = pulse.getGlassOpacity();

    // Dynamic CSS styles based on pulse
    const dynamicGlassStyle = {
        backgroundColor: `rgba(255, 255, 255, ${glassOpacity})`,
        borderColor: goldIntensity > 0.5
            ? `rgba(212, 175, 55, ${goldIntensity * 0.6})`
            : 'rgba(255, 255, 255, 0.5)',
    };

    const dynamicPurpleGlow = {
        opacity: purpleDepth * 0.15,
    };

    // Determine pulse message based on state
    const getPulseMessage = () => {
        if (pulse.systemicStressDetected) {
            return { text: "Systems are weighing heavy. Remember to breathe.", icon: AlertTriangle, color: '#4B0082' };
        }
        if (pulse.averageReciprocity >= 4) {
            return { text: "Connection is flowing. Honor this rhythm.", icon: Heart, color: '#D4AF37' };
        }
        if (pulse.averageReciprocity <= 2) {
            return { text: "Disconnection is data, not failure. What does rest look like?", icon: Battery, color: '#4B0082' };
        }
        return { text: "The sanctuary is present. Witness what arises.", icon: Sparkles, color: '#4B0082' };
    };

    const pulseMessage = getPulseMessage();
    const parentTitle = profile?.parent?.title || 'Mama';
    const childName = profile?.childName;

    return (
        <div className="flex flex-col space-y-6 pt-8 pb-24 px-4 fade-in">

            {/* 0. REGULATION GLOW (Bio-Responsive Stats) */}
            <RegulationGlow />

            {/* 1. GREETING AREA - Personalized */}
            <header>
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold tracking-widest text-[#4B0082] uppercase opacity-80">
                        Current Atmosphere
                    </h2>
                    <NotificationBell />
                </div>
                <h1
                    className="text-4xl mt-1"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                >
                    {getGreeting()}, <br />
                    <span className="italic opacity-60">{parentTitle}</span>
                </h1>
                {childName && (
                    <p className="text-sm mt-2 opacity-60">
                        Witnessing {childName}'s journey
                    </p>
                )}
            </header>

            {/* TEACHER MODE TOGGLE */}
            <div className="glass-panel p-3 rounded-[20px] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl transition-colors ${teacherMode ? 'bg-[#D4AF37]/20' : 'bg-white/40'
                        }`}>
                        <BookOpen className={`w-5 h-5 ${teacherMode ? 'text-[#D4AF37]' : 'opacity-50'
                            }`} />
                    </div>
                    <div>
                        <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                            Educational Insights
                        </p>
                        <p className="text-xs opacity-60">
                            {teacherMode ? 'Tap highlighted terms to learn' : 'Enable to see term definitions'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setTeacherMode(!teacherMode)}
                    className={`p-1 rounded-full transition-all ${teacherMode
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] shadow-lg'
                        : 'bg-gray-200'
                        }`}
                >
                    {teacherMode ? (
                        <ToggleRight className="w-8 h-8 text-white" />
                    ) : (
                        <ToggleLeft className="w-8 h-8 text-gray-400" />
                    )}
                </button>
            </div>

            {/* 2. THE PULSE (Dynamic Materiality) */}
            <div
                className="glass-panel p-6 rounded-[32px] relative overflow-hidden transition-all duration-700"
                style={dynamicGlassStyle}
            >
                {/* Dynamic Purple Glow - deepens with stress */}
                <div
                    className="absolute top-0 right-0 w-40 h-40 bg-[#4B0082] blur-[80px] rounded-full -mr-10 -mt-10 pointer-events-none transition-opacity duration-700"
                    style={dynamicPurpleGlow}
                />

                {/* Gold Shimmer Overlay - appears with high reciprocity */}
                {goldIntensity > 0.3 && (
                    <div
                        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
                        style={{
                            background: `linear-gradient(135deg, rgba(212, 175, 55, ${goldIntensity * 0.1}) 0%, transparent 50%)`,
                            opacity: goldIntensity,
                        }}
                    />
                )}

                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                            <pulseMessage.icon
                                className="w-5 h-5 transition-colors duration-500"
                                style={{ color: pulseMessage.color }}
                            />
                            <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                                Sanctuary Pulse
                            </span>
                            {isLoaded && pulse.recentObservationCount > 0 && (
                                <span className="text-xs opacity-50 ml-2">
                                    ({pulse.recentObservationCount} witnessed)
                                </span>
                            )}
                        </div>
                        <p
                            className="text-lg leading-tight w-full"
                            style={{ color: 'var(--text-primary)', opacity: 0.8, fontFamily: 'var(--font-body)' }}
                        >
                            {pulseMessage.text}
                        </p>
                    </div>
                </div>

                {/* Reciprocity Indicator */}
                {isLoaded && (
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-xs uppercase tracking-wider opacity-50">Reciprocity</span>
                        <div className="flex-1 h-2 bg-white/30 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{
                                    width: `${(pulse.averageReciprocity / 5) * 100}%`,
                                    backgroundColor: goldIntensity > 0.5 ? '#D4AF37' : '#4B0082',
                                }}
                            />
                        </div>
                        <span
                            className="text-sm font-bold"
                            style={{ color: goldIntensity > 0.5 ? '#D4AF37' : '#4B0082' }}
                        >
                            {pulse.averageReciprocity.toFixed(1)}
                        </span>
                    </div>
                )}

                <div className="mt-6 flex space-x-3 relative z-10">
                    <button
                        onClick={() => onNavigate && onNavigate('Capture')}
                        className="flex-1 py-3 rounded-2xl text-sm font-bold shadow-lg active:scale-95 transition-all hover:opacity-90"
                        style={{
                            backgroundColor: goldIntensity > 0.5 ? '#D4AF37' : '#4B0082',
                            color: 'white',
                        }}
                    >
                        Witness Moment
                    </button>
                    <button
                        onClick={() => onNavigate && onNavigate('Journey')}
                        className="px-4 py-3 rounded-2xl bg-white/40 border border-white/50 font-bold text-sm active:scale-95 transition-all hover:bg-white/60"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        View Patterns
                    </button>
                </div>
            </div>

            {/* 3. THE FLOW (Up Next) */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wider opacity-50" style={{ color: 'var(--text-primary)' }}>
                        Up Next
                    </h3>
                    <button
                        onClick={() => alert('Full day view coming soon! For now, check the Journey page.')}
                        className="text-xs font-bold px-3 py-1 rounded-full hover:bg-white/50 active:scale-95 transition-all"
                        style={{ color: '#4B0082', backgroundColor: 'rgba(255,255,255,0.3)' }}
                    >
                        See Full Day
                    </button>
                </div>

                <button
                    onClick={() => onNavigate && onNavigate('Journey')}
                    className="backdrop-blur-xl p-5 rounded-[28px] flex items-center space-x-4 shadow-sm transition-all duration-500 w-full text-left hover:scale-[1.01] active:scale-[0.99]"
                    style={dynamicGlassStyle}
                >
                    <div className="h-12 w-12 rounded-2xl bg-[#FFE4E1] flex items-center justify-center text-[#D2691E]">
                        <CloudSun className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold" style={{ color: 'var(--text-primary)' }}>Sensory Break</h4>
                        <p className="text-sm opacity-60" style={{ color: 'var(--text-primary)' }}>4:30 PM • Living Room</p>
                    </div>
                    <ChevronRight className="w-5 h-5 opacity-30" style={{ color: 'var(--text-primary)' }} />
                </button>

                <button
                    onClick={() => onNavigate && onNavigate('Journey')}
                    className="backdrop-blur-xl p-5 rounded-[28px] flex items-center space-x-4 shadow-sm opacity-60 w-full text-left hover:opacity-80 active:scale-[0.99] transition-all"
                    style={dynamicGlassStyle}
                >
                    <div className="h-12 w-12 rounded-2xl bg-[#E6E6FA] flex items-center justify-center text-[#4B0082]">
                        <CalendarClock className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold" style={{ color: 'var(--text-primary)' }}>Speech Therapy</h4>
                        <p className="text-sm opacity-60" style={{ color: 'var(--text-primary)' }}>5:15 PM • Zoom</p>
                    </div>
                    <ChevronRight className="w-5 h-5 opacity-30" style={{ color: 'var(--text-primary)' }} />
                </button>
            </div>

            {/* 4. QUICK ACTIONS - Access Passport & Vault */}
            {onNavigate && (
                <div className="space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider opacity-50" style={{ color: 'var(--text-primary)' }}>
                        Quick Actions
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => onNavigate('Passport')}
                            className="glass-panel p-4 rounded-[20px] text-left hover:scale-[1.02] active:scale-[0.98] transition-transform"
                        >
                            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center mb-2">
                                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                            </div>
                            <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                                Digital Passport
                            </p>
                            <p className="text-xs opacity-60">Care transitions</p>
                        </button>

                        <button
                            onClick={() => onNavigate('Vault')}
                            className="glass-panel p-4 rounded-[20px] text-left hover:scale-[1.02] active:scale-[0.98] transition-transform"
                        >
                            <div className="w-10 h-10 rounded-xl bg-[#4B0082]/20 flex items-center justify-center mb-2">
                                <Battery className="w-5 h-5 text-[#4B0082]" />
                            </div>
                            <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                                Institutional Vault
                            </p>
                            <p className="text-xs opacity-60">IEP, FBA, Clinical</p>
                        </button>

                        <button
                            onClick={() => onNavigate('Skills')}
                            className="glass-panel p-4 rounded-[20px] text-left hover:scale-[1.02] active:scale-[0.98] transition-transform"
                        >
                            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center mb-2">
                                <Target className="w-5 h-5 text-green-600" />
                            </div>
                            <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                                Skills Tracker
                            </p>
                            <p className="text-xs opacity-60">Growth & Progress</p>
                        </button>

                        <button
                            onClick={() => onNavigate('Memory')}
                            className="glass-panel p-4 rounded-[20px] text-left hover:scale-[1.02] active:scale-[0.98] transition-transform"
                        >
                            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center mb-2">
                                <Brain className="w-5 h-5 text-purple-600" />
                            </div>
                            <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                                Memory
                            </p>
                            <p className="text-xs opacity-60">Learned Patterns</p>
                        </button>

                        <button
                            onClick={() => onNavigate('Progress')}
                            className="glass-panel p-4 rounded-[20px] text-left hover:scale-[1.02] active:scale-[0.98] transition-transform"
                        >
                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-2">
                                <BarChart3 className="w-5 h-5 text-blue-600" />
                            </div>
                            <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                                Progress
                            </p>
                            <p className="text-xs opacity-60">Reports & Analytics</p>
                        </button>

                        <button
                            onClick={() => onNavigate('Therapy')}
                            className="glass-panel p-4 rounded-[20px] text-left hover:scale-[1.02] active:scale-[0.98] transition-transform"
                        >
                            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center mb-2">
                                <Stethoscope className="w-5 h-5 text-teal-600" />
                            </div>
                            <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                                Therapy Prep
                            </p>
                            <p className="text-xs opacity-60">Session Bridge</p>
                        </button>

                        <button
                            onClick={() => onNavigate('Wellness')}
                            className="glass-panel p-4 rounded-[20px] text-left hover:scale-[1.02] active:scale-[0.98] transition-transform"
                        >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#EC4899]/20 to-[#8B5CF6]/20 flex items-center justify-center mb-2">
                                <Flame className="w-5 h-5 text-[#EC4899]" />
                            </div>
                            <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                                Wellness
                            </p>
                            <p className="text-xs opacity-60">Self-care & Support</p>
                        </button>

                        <button
                            onClick={() => onNavigate('About')}
                            className="glass-panel p-4 rounded-[20px] text-left hover:scale-[1.02] active:scale-[0.98] transition-transform"
                        >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4B0082]/20 to-[#D4AF37]/20 flex items-center justify-center mb-2">
                                <Heart className="w-5 h-5 text-[#4B0082]" />
                            </div>
                            <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                                The Visionary Story
                            </p>
                            <p className="text-xs opacity-60">Why this app exists • 30 years of service</p>
                        </button>

                        {/* Admin Dashboard - Hidden access for owner */}
                        <button
                            onClick={() => onNavigate('AdminDashboard')}
                            className="glass-panel p-4 rounded-[20px] text-left hover:scale-[1.02] active:scale-[0.98] transition-transform opacity-60 hover:opacity-100"
                        >
                            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center mb-2">
                                <BarChart3 className="w-5 h-5 text-[#D4AF37]" />
                            </div>
                            <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                                📊 Admin
                            </p>
                            <p className="text-xs opacity-60">Usage stats</p>
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};
