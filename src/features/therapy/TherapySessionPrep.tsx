/**
 * THERAPY SESSION PREP
 *
 * Helps parents prepare for therapy sessions by:
 * - Tracking upcoming sessions across therapy types (ABA, OT, Speech, etc.)
 * - Auto-suggesting relevant observations and insights
 * - Capturing questions for therapists
 * - Recording session notes and home activities
 * - Tracking therapy goals progress
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Clock,
    Plus,
    ChevronRight,
    FileText,
    Target,
    MessageCircle,
    Video,
    Lightbulb,
    CheckCircle,
    XCircle,
    Edit3,
    Trash2,
    Loader2,
    ClipboardList,
    User,
    MapPin,
    Monitor,
} from 'lucide-react';
import { useAuthStore } from '../../core/stores/useAuthStore';
import {
    createSession,
    getUpcomingSessions,
    getPastSessions,
    updateSessionPrep,
    completeSession,
    cancelSession,
    deleteSession,
    getSessionPrepSuggestions,
    getActiveGoals,
    type TherapySession,
    type TherapyGoal,
    type TherapyType,
} from '../../core/firebase/therapy';
import { getObservation } from '../../core/firebase/firestore';
import type { Observation } from '../../core/stores/types';

interface TherapySessionPrepProps {
    onNavigate?: (view: string) => void;
}

type ViewMode = 'upcoming' | 'past' | 'goals';

const THERAPY_TYPES: { value: TherapyType; label: string; color: string }[] = [
    { value: 'ABA', label: 'ABA Therapy', color: 'bg-purple-100 text-purple-700' },
    { value: 'OT', label: 'Occupational', color: 'bg-blue-100 text-blue-700' },
    { value: 'Speech', label: 'Speech', color: 'bg-green-100 text-green-700' },
    { value: 'PT', label: 'Physical', color: 'bg-orange-100 text-orange-700' },
    { value: 'Counseling', label: 'Counseling', color: 'bg-pink-100 text-pink-700' },
    { value: 'Other', label: 'Other', color: 'bg-gray-100 text-gray-700' },
];

export const TherapySessionPrep = ({ onNavigate: _onNavigate }: TherapySessionPrepProps) => {
    const { user } = useAuthStore();
    const [viewMode, setViewMode] = useState<ViewMode>('upcoming');
    const [upcomingSessions, setUpcomingSessions] = useState<TherapySession[]>([]);
    const [pastSessions, setPastSessions] = useState<TherapySession[]>([]);
    const [goals, setGoals] = useState<TherapyGoal[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal states
    const [showNewSessionModal, setShowNewSessionModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState<TherapySession | null>(null);
    const [showPrepModal, setShowPrepModal] = useState(false);
    const [showNotesModal, setShowNotesModal] = useState(false);

    useEffect(() => {
        if (user) {
            loadData();
        }
    }, [user]);

    const loadData = async () => {
        if (!user) return;
        setIsLoading(true);

        try {
            const [upcoming, past, activeGoals] = await Promise.all([
                getUpcomingSessions(user.uid),
                getPastSessions(user.uid, 10),
                getActiveGoals(user.uid),
            ]);
            setUpcomingSessions(upcoming);
            setPastSessions(past);
            setGoals(activeGoals);
        } catch (error) {
            console.error('Failed to load therapy data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSessionCreated = () => {
        setShowNewSessionModal(false);
        loadData();
    };

    const handleOpenPrep = (session: TherapySession) => {
        setSelectedSession(session);
        setShowPrepModal(true);
    };

    const handleOpenNotes = (session: TherapySession) => {
        setSelectedSession(session);
        setShowNotesModal(true);
    };

    const handleCancelSession = async (sessionId: string) => {
        if (!user) return;
        if (!confirm('Cancel this session?')) return;

        try {
            await cancelSession(user.uid, sessionId);
            loadData();
        } catch (error) {
            console.error('Failed to cancel session:', error);
        }
    };

    const handleDeleteSession = async (sessionId: string) => {
        if (!user) return;
        if (!confirm('Delete this session? This cannot be undone.')) return;

        try {
            await deleteSession(user.uid, sessionId);
            loadData();
        } catch (error) {
            console.error('Failed to delete session:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-[#4B0082]" />
                <p className="text-sm opacity-60">Loading sessions...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col space-y-6 pt-8 pb-32 fade-in">
            {/* HEADER */}
            <header className="px-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-bold tracking-widest text-[#4B0082] uppercase opacity-80">
                            Session Bridge
                        </h2>
                        <h1 className="text-3xl font-serif text-[#1A1A1A] mt-1">
                            Therapy Prep
                        </h1>
                    </div>
                    <button
                        onClick={() => setShowNewSessionModal(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4B0082] text-white text-sm font-semibold"
                    >
                        <Plus className="w-4 h-4" />
                        New Session
                    </button>
                </div>
                <p className="text-sm opacity-60 mt-2">
                    Prepare for therapy and track progress
                </p>
            </header>

            {/* VIEW TABS */}
            <div className="px-4">
                <div className="glass-panel p-1 rounded-2xl flex">
                    {(['upcoming', 'past', 'goals'] as ViewMode[]).map((mode) => (
                        <button
                            key={mode}
                            onClick={() => setViewMode(mode)}
                            className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                                viewMode === mode
                                    ? 'bg-[#4B0082] text-white shadow-md'
                                    : 'text-[#1A1A1A]/60'
                            }`}
                        >
                            {mode === 'upcoming' ? 'Upcoming' : mode === 'past' ? 'Past' : 'Goals'}
                        </button>
                    ))}
                </div>
            </div>

            {/* CONTENT */}
            {viewMode === 'upcoming' && (
                <UpcomingSessionsList
                    sessions={upcomingSessions}
                    onOpenPrep={handleOpenPrep}
                    onCancel={handleCancelSession}
                />
            )}

            {viewMode === 'past' && (
                <PastSessionsList
                    sessions={pastSessions}
                    onOpenNotes={handleOpenNotes}
                    onDelete={handleDeleteSession}
                />
            )}

            {viewMode === 'goals' && (
                <GoalsList goals={goals} onRefresh={loadData} />
            )}

            {/* MODALS */}
            <AnimatePresence>
                {showNewSessionModal && (
                    <NewSessionModal
                        onClose={() => setShowNewSessionModal(false)}
                        onCreated={handleSessionCreated}
                    />
                )}

                {showPrepModal && selectedSession && (
                    <SessionPrepModal
                        session={selectedSession}
                        onClose={() => {
                            setShowPrepModal(false);
                            setSelectedSession(null);
                            loadData();
                        }}
                    />
                )}

                {showNotesModal && selectedSession && (
                    <SessionNotesModal
                        session={selectedSession}
                        onClose={() => {
                            setShowNotesModal(false);
                            setSelectedSession(null);
                            loadData();
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// =====================================================
// UPCOMING SESSIONS LIST
// =====================================================

interface UpcomingSessionsListProps {
    sessions: TherapySession[];
    onOpenPrep: (session: TherapySession) => void;
    onCancel: (sessionId: string) => void;
}

const UpcomingSessionsList = ({ sessions, onOpenPrep, onCancel }: UpcomingSessionsListProps) => {
    if (sessions.length === 0) {
        return (
            <div className="px-4">
                <div className="glass-panel p-8 rounded-[20px] text-center">
                    <Calendar className="w-12 h-12 text-[#4B0082]/30 mx-auto mb-4" />
                    <h3 className="font-semibold text-[#1A1A1A] mb-2">No Upcoming Sessions</h3>
                    <p className="text-sm text-[#1A1A1A]/60">
                        Schedule a therapy session to start preparing
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="px-4 space-y-3">
            {sessions.map((session) => (
                <SessionCard
                    key={session.id}
                    session={session}
                    onOpenPrep={() => onOpenPrep(session)}
                    onCancel={() => onCancel(session.id)}
                    showPrepButton
                />
            ))}
        </div>
    );
};

// =====================================================
// PAST SESSIONS LIST
// =====================================================

interface PastSessionsListProps {
    sessions: TherapySession[];
    onOpenNotes: (session: TherapySession) => void;
    onDelete: (sessionId: string) => void;
}

const PastSessionsList = ({ sessions, onOpenNotes, onDelete }: PastSessionsListProps) => {
    if (sessions.length === 0) {
        return (
            <div className="px-4">
                <div className="glass-panel p-8 rounded-[20px] text-center">
                    <ClipboardList className="w-12 h-12 text-[#4B0082]/30 mx-auto mb-4" />
                    <h3 className="font-semibold text-[#1A1A1A] mb-2">No Past Sessions</h3>
                    <p className="text-sm text-[#1A1A1A]/60">
                        Completed sessions will appear here
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="px-4 space-y-3">
            {sessions.map((session) => (
                <SessionCard
                    key={session.id}
                    session={session}
                    onOpenNotes={() => onOpenNotes(session)}
                    onDelete={() => onDelete(session.id)}
                    isPast
                />
            ))}
        </div>
    );
};

// =====================================================
// SESSION CARD
// =====================================================

interface SessionCardProps {
    session: TherapySession;
    onOpenPrep?: () => void;
    onOpenNotes?: () => void;
    onCancel?: () => void;
    onDelete?: () => void;
    showPrepButton?: boolean;
    isPast?: boolean;
}

const SessionCard = ({
    session,
    onOpenPrep,
    onOpenNotes,
    onCancel,
    onDelete,
    showPrepButton,
    isPast,
}: SessionCardProps) => {
    const therapyType = THERAPY_TYPES.find((t) => t.value === session.therapyType);
    const sessionDate = session.scheduledDate?.toDate?.();
    const dateStr = sessionDate?.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });
    const timeStr = sessionDate?.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
    });

    const hasPrepContent = !!(
        session.prepNotes ||
        (session.questionsForTherapist?.length ?? 0) > 0 ||
        (session.observationsToDiscuss?.length ?? 0) > 0
    );

    return (
        <div className="glass-panel rounded-[20px] overflow-hidden">
            <div className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${therapyType?.color}`}>
                                {therapyType?.label}
                            </span>
                            {session.status === 'prep_ready' && (
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                    Prep Ready
                                </span>
                            )}
                            {session.status === 'cancelled' && (
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                    Cancelled
                                </span>
                            )}
                        </div>
                        <h3 className="font-semibold text-[#1A1A1A]">{session.providerName}</h3>
                    </div>
                    {isPast ? (
                        <button
                            onClick={onDelete}
                            className="p-2 text-[#1A1A1A]/30 hover:text-red-500"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={onCancel}
                            className="p-2 text-[#1A1A1A]/30 hover:text-red-500"
                        >
                            <XCircle className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Details */}
                <div className="flex flex-wrap gap-3 text-sm text-[#1A1A1A]/60">
                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{dateStr}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{timeStr}</span>
                    </div>
                    {session.location && (
                        <div className="flex items-center gap-1">
                            {session.isVirtual ? (
                                <Monitor className="w-4 h-4" />
                            ) : (
                                <MapPin className="w-4 h-4" />
                            )}
                            <span>{session.location}</span>
                        </div>
                    )}
                </div>

                {/* Prep Summary */}
                {hasPrepContent && !isPast && (
                    <div className="mt-3 pt-3 border-t border-[#1A1A1A]/10 flex items-center gap-2 text-xs text-[#1A1A1A]/50">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>
                            {session.questionsForTherapist?.length || 0} questions,{' '}
                            {session.observationsToDiscuss?.length || 0} observations ready
                        </span>
                    </div>
                )}

                {/* Past Session Notes Preview */}
                {isPast && session.sessionNotes && (
                    <div className="mt-3 pt-3 border-t border-[#1A1A1A]/10">
                        <p className="text-sm text-[#1A1A1A]/60 line-clamp-2">
                            {session.sessionNotes}
                        </p>
                    </div>
                )}
            </div>

            {/* Action Button */}
            {showPrepButton && session.status !== 'cancelled' && (
                <button
                    onClick={onOpenPrep}
                    className="w-full px-4 py-3 bg-[#4B0082]/5 flex items-center justify-between text-[#4B0082] font-medium text-sm"
                >
                    <span className="flex items-center gap-2">
                        <Edit3 className="w-4 h-4" />
                        {hasPrepContent ? 'Edit Prep' : 'Prepare for Session'}
                    </span>
                    <ChevronRight className="w-5 h-5" />
                </button>
            )}

            {isPast && (
                <button
                    onClick={onOpenNotes}
                    className="w-full px-4 py-3 bg-[#4B0082]/5 flex items-center justify-between text-[#4B0082] font-medium text-sm"
                >
                    <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        {session.sessionNotes ? 'View Notes' : 'Add Session Notes'}
                    </span>
                    <ChevronRight className="w-5 h-5" />
                </button>
            )}
        </div>
    );
};

// =====================================================
// GOALS LIST
// =====================================================

interface GoalsListProps {
    goals: TherapyGoal[];
    onRefresh: () => void;
}

const GoalsList = ({ goals, onRefresh: _onRefresh }: GoalsListProps) => {
    if (goals.length === 0) {
        return (
            <div className="px-4">
                <div className="glass-panel p-8 rounded-[20px] text-center">
                    <Target className="w-12 h-12 text-[#4B0082]/30 mx-auto mb-4" />
                    <h3 className="font-semibold text-[#1A1A1A] mb-2">No Active Goals</h3>
                    <p className="text-sm text-[#1A1A1A]/60">
                        Goals from therapy sessions will appear here
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="px-4 space-y-3">
            {goals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
            ))}
        </div>
    );
};

interface GoalCardProps {
    goal: TherapyGoal;
}

const GoalCard = ({ goal }: GoalCardProps) => {
    const therapyType = THERAPY_TYPES.find((t) => t.value === goal.therapyType);

    return (
        <div className="glass-panel p-4 rounded-[20px]">
            <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${therapyType?.color}`}>
                        {therapyType?.label}
                    </span>
                    <h3 className="font-semibold text-[#1A1A1A] mt-2">{goal.title}</h3>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-bold text-[#4B0082]">{goal.currentProgress}%</span>
                </div>
            </div>

            <p className="text-sm text-[#1A1A1A]/60 mb-3">{goal.description}</p>

            {/* Progress Bar */}
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-[#4B0082] to-[#D4AF37] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${goal.currentProgress}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            {/* Latest Note */}
            {goal.progressNotes?.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[#1A1A1A]/10">
                    <p className="text-xs text-[#1A1A1A]/50 mb-1">Latest Update</p>
                    <p className="text-sm text-[#1A1A1A]/70">
                        {goal.progressNotes[goal.progressNotes.length - 1].note}
                    </p>
                </div>
            )}
        </div>
    );
};

// =====================================================
// NEW SESSION MODAL
// =====================================================

interface NewSessionModalProps {
    onClose: () => void;
    onCreated: () => void;
}

const NewSessionModal = ({ onClose, onCreated }: NewSessionModalProps) => {
    const { user } = useAuthStore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [providerName, setProviderName] = useState('');
    const [therapyType, setTherapyType] = useState<TherapyType>('ABA');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [duration, setDuration] = useState('60');
    const [location, setLocation] = useState('');
    const [isVirtual, setIsVirtual] = useState(false);

    const handleSubmit = async () => {
        if (!user || !providerName || !date || !time) return;

        setIsSubmitting(true);
        try {
            const scheduledDate = new Date(`${date}T${time}`);
            await createSession(user.uid, {
                providerName,
                therapyType,
                scheduledDate,
                duration: parseInt(duration),
                location: location || undefined,
                isVirtual,
            });
            onCreated();
        } catch (error) {
            console.error('Failed to create session:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="w-full max-w-lg bg-white rounded-t-[24px] sm:rounded-[24px] max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">Schedule Session</h2>

                    <div className="space-y-4">
                        {/* Provider Name */}
                        <div>
                            <label className="block text-sm font-medium text-[#1A1A1A]/70 mb-1">
                                Therapist/Provider Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/30" />
                                <input
                                    type="text"
                                    value={providerName}
                                    onChange={(e) => setProviderName(e.target.value)}
                                    placeholder="e.g., Dr. Smith, Ms. Johnson"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#1A1A1A]/10 focus:border-[#4B0082] focus:ring-1 focus:ring-[#4B0082] outline-none"
                                />
                            </div>
                        </div>

                        {/* Therapy Type */}
                        <div>
                            <label className="block text-sm font-medium text-[#1A1A1A]/70 mb-1">
                                Therapy Type
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {THERAPY_TYPES.map((type) => (
                                    <button
                                        key={type.value}
                                        onClick={() => setTherapyType(type.value)}
                                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                                            therapyType === type.value
                                                ? 'bg-[#4B0082] text-white'
                                                : 'bg-gray-100 text-[#1A1A1A]/60'
                                        }`}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Date and Time */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-[#1A1A1A]/70 mb-1">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-[#1A1A1A]/10 focus:border-[#4B0082] focus:ring-1 focus:ring-[#4B0082] outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1A1A1A]/70 mb-1">
                                    Time
                                </label>
                                <input
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-[#1A1A1A]/10 focus:border-[#4B0082] focus:ring-1 focus:ring-[#4B0082] outline-none"
                                />
                            </div>
                        </div>

                        {/* Duration */}
                        <div>
                            <label className="block text-sm font-medium text-[#1A1A1A]/70 mb-1">
                                Duration (minutes)
                            </label>
                            <select
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-[#1A1A1A]/10 focus:border-[#4B0082] focus:ring-1 focus:ring-[#4B0082] outline-none"
                            >
                                <option value="30">30 minutes</option>
                                <option value="45">45 minutes</option>
                                <option value="60">1 hour</option>
                                <option value="90">1.5 hours</option>
                                <option value="120">2 hours</option>
                            </select>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium text-[#1A1A1A]/70 mb-1">
                                Location (optional)
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/30" />
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="e.g., Clinic name, address"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#1A1A1A]/10 focus:border-[#4B0082] focus:ring-1 focus:ring-[#4B0082] outline-none"
                                />
                            </div>
                        </div>

                        {/* Virtual Toggle */}
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isVirtual}
                                onChange={(e) => setIsVirtual(e.target.checked)}
                                className="w-5 h-5 rounded border-[#1A1A1A]/10 text-[#4B0082] focus:ring-[#4B0082]"
                            />
                            <span className="text-sm text-[#1A1A1A]">This is a virtual/telehealth session</span>
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl border border-[#1A1A1A]/10 text-[#1A1A1A]/60 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!providerName || !date || !time || isSubmitting}
                            className="flex-1 py-3 rounded-xl bg-[#4B0082] text-white font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <Plus className="w-5 h-5" />
                                    Schedule
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// =====================================================
// SESSION PREP MODAL
// =====================================================

interface SessionPrepModalProps {
    session: TherapySession;
    onClose: () => void;
}

const SessionPrepModal = ({ session, onClose }: SessionPrepModalProps) => {
    const { user } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Prep content
    const [prepNotes, setPrepNotes] = useState(session.prepNotes || '');
    const [questions, setQuestions] = useState<string[]>(session.questionsForTherapist || []);
    const [newQuestion, setNewQuestion] = useState('');
    const [selectedObservations, setSelectedObservations] = useState<string[]>(
        session.observationsToDiscuss || []
    );
    const [selectedVideos, setSelectedVideos] = useState<string[]>(session.videosToShow || []);

    // Suggestions
    const [suggestedObservations, setSuggestedObservations] = useState<Observation[]>([]);
    const [suggestedVideoUrls, setSuggestedVideoUrls] = useState<string[]>([]);
    const [suggestedGoals, setSuggestedGoals] = useState<TherapyGoal[]>([]);

    useEffect(() => {
        loadSuggestions();
    }, []);

    const loadSuggestions = async () => {
        if (!user) return;
        setIsLoading(true);

        try {
            const suggestions = await getSessionPrepSuggestions(
                user.uid,
                session.therapyType
            );

            // Load full observation data for suggested observations
            const obsPromises = suggestions.observationIds.map((id) =>
                getObservation(id)
            );
            const observations = (await Promise.all(obsPromises)).filter(
                (o): o is Observation => o !== null
            );

            setSuggestedObservations(observations);
            setSuggestedVideoUrls(suggestions.videoUrls);
            setSuggestedGoals(suggestions.goals);
        } catch (error) {
            console.error('Failed to load suggestions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddQuestion = () => {
        if (!newQuestion.trim()) return;
        setQuestions([...questions, newQuestion.trim()]);
        setNewQuestion('');
    };

    const handleRemoveQuestion = (index: number) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const toggleObservation = (obsId: string) => {
        setSelectedObservations((prev) =>
            prev.includes(obsId) ? prev.filter((id) => id !== obsId) : [...prev, obsId]
        );
    };

    const toggleVideo = (url: string) => {
        setSelectedVideos((prev) =>
            prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
        );
    };

    const handleSave = async () => {
        if (!user) return;
        setIsSaving(true);

        try {
            await updateSessionPrep(user.uid, session.id, {
                prepNotes,
                questionsForTherapist: questions,
                observationsToDiscuss: selectedObservations,
                videosToShow: selectedVideos,
            });
            onClose();
        } catch (error) {
            console.error('Failed to save prep:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="w-full max-w-lg bg-white rounded-t-[24px] sm:rounded-[24px] max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <h2 className="text-xl font-bold text-[#1A1A1A] mb-1">Prepare for Session</h2>
                    <p className="text-sm text-[#1A1A1A]/60 mb-6">
                        {session.providerName} - {session.therapyType}
                    </p>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-[#4B0082]" />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Prep Notes */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-[#1A1A1A]/70 mb-2">
                                    <FileText className="w-4 h-4" />
                                    Session Prep Notes
                                </label>
                                <textarea
                                    value={prepNotes}
                                    onChange={(e) => setPrepNotes(e.target.value)}
                                    placeholder="What do you want to focus on this session?"
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl border border-[#1A1A1A]/10 focus:border-[#4B0082] focus:ring-1 focus:ring-[#4B0082] outline-none resize-none"
                                />
                            </div>

                            {/* Questions for Therapist */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-[#1A1A1A]/70 mb-2">
                                    <MessageCircle className="w-4 h-4" />
                                    Questions for Therapist
                                </label>
                                <div className="space-y-2 mb-2">
                                    {questions.map((q, i) => (
                                        <div
                                            key={i}
                                            className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl"
                                        >
                                            <span className="text-sm text-[#1A1A1A] flex-1">{q}</span>
                                            <button
                                                onClick={() => handleRemoveQuestion(i)}
                                                className="text-[#1A1A1A]/30 hover:text-red-500"
                                            >
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newQuestion}
                                        onChange={(e) => setNewQuestion(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddQuestion()}
                                        placeholder="Add a question..."
                                        className="flex-1 px-4 py-2 rounded-xl border border-[#1A1A1A]/10 focus:border-[#4B0082] outline-none text-sm"
                                    />
                                    <button
                                        onClick={handleAddQuestion}
                                        className="px-4 py-2 rounded-xl bg-[#4B0082] text-white"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Suggested Observations */}
                            {suggestedObservations.length > 0 && (
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-[#1A1A1A]/70 mb-2">
                                        <Lightbulb className="w-4 h-4" />
                                        Observations to Discuss
                                    </label>
                                    <p className="text-xs text-[#1A1A1A]/50 mb-2">
                                        Recent observations relevant to {session.therapyType}
                                    </p>
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {suggestedObservations.map((obs) => (
                                            <button
                                                key={obs.id}
                                                onClick={() => toggleObservation(obs.id)}
                                                className={`w-full text-left p-3 rounded-xl border transition-all ${
                                                    selectedObservations.includes(obs.id)
                                                        ? 'border-[#4B0082] bg-[#4B0082]/5'
                                                        : 'border-[#1A1A1A]/10'
                                                }`}
                                            >
                                                <div className="flex items-start gap-2">
                                                    <div
                                                        className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center ${
                                                            selectedObservations.includes(obs.id)
                                                                ? 'bg-[#4B0082] text-white'
                                                                : 'border border-[#1A1A1A]/20'
                                                        }`}
                                                    >
                                                        {selectedObservations.includes(obs.id) && (
                                                            <CheckCircle className="w-4 h-4" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm text-[#1A1A1A] line-clamp-2">
                                                            {obs.strengthNarrative}
                                                        </p>
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            {obs.channels?.slice(0, 2).map((ch) => (
                                                                <span
                                                                    key={ch}
                                                                    className="text-[10px] px-2 py-0.5 bg-[#4B0082]/10 text-[#4B0082] rounded-full"
                                                                >
                                                                    {ch}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Videos to Show */}
                            {suggestedVideoUrls.length > 0 && (
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-[#1A1A1A]/70 mb-2">
                                        <Video className="w-4 h-4" />
                                        Videos to Show
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {suggestedVideoUrls.map((url, i) => (
                                            <button
                                                key={i}
                                                onClick={() => toggleVideo(url)}
                                                className={`px-3 py-2 rounded-xl text-sm transition-all ${
                                                    selectedVideos.includes(url)
                                                        ? 'bg-[#4B0082] text-white'
                                                        : 'bg-gray-100 text-[#1A1A1A]/60'
                                                }`}
                                            >
                                                <Video className="w-4 h-4 inline mr-1" />
                                                Video {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Related Goals */}
                            {suggestedGoals.length > 0 && (
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-[#1A1A1A]/70 mb-2">
                                        <Target className="w-4 h-4" />
                                        Related Goals
                                    </label>
                                    <div className="space-y-2">
                                        {suggestedGoals.slice(0, 3).map((goal) => (
                                            <div
                                                key={goal.id}
                                                className="p-3 bg-gray-50 rounded-xl"
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-sm font-medium text-[#1A1A1A]">
                                                        {goal.title}
                                                    </span>
                                                    <span className="text-xs text-[#4B0082] font-semibold">
                                                        {goal.currentProgress}%
                                                    </span>
                                                </div>
                                                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-[#4B0082] rounded-full"
                                                        style={{ width: `${goal.currentProgress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl border border-[#1A1A1A]/10 text-[#1A1A1A]/60 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex-1 py-3 rounded-xl bg-[#4B0082] text-white font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSaving ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <CheckCircle className="w-5 h-5" />
                                    Save Prep
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// =====================================================
// SESSION NOTES MODAL
// =====================================================

interface SessionNotesModalProps {
    session: TherapySession;
    onClose: () => void;
}

const SessionNotesModal = ({ session, onClose }: SessionNotesModalProps) => {
    const { user } = useAuthStore();
    const [isSaving, setIsSaving] = useState(false);

    const [sessionNotes, setSessionNotes] = useState(session.sessionNotes || '');
    const [therapistFeedback, setTherapistFeedback] = useState(session.therapistFeedback || '');
    const [homeActivities, setHomeActivities] = useState<string[]>(session.homeActivities || []);
    const [newActivity, setNewActivity] = useState('');
    const [nextSteps, setNextSteps] = useState<string[]>(session.nextSteps || []);
    const [newStep, setNewStep] = useState('');

    const handleAddActivity = () => {
        if (!newActivity.trim()) return;
        setHomeActivities([...homeActivities, newActivity.trim()]);
        setNewActivity('');
    };

    const handleRemoveActivity = (index: number) => {
        setHomeActivities(homeActivities.filter((_, i) => i !== index));
    };

    const handleAddStep = () => {
        if (!newStep.trim()) return;
        setNextSteps([...nextSteps, newStep.trim()]);
        setNewStep('');
    };

    const handleRemoveStep = (index: number) => {
        setNextSteps(nextSteps.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        if (!user) return;
        setIsSaving(true);

        try {
            await completeSession(user.uid, session.id, {
                sessionNotes,
                therapistFeedback,
                homeActivities,
                nextSteps,
            });
            onClose();
        } catch (error) {
            console.error('Failed to save notes:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="w-full max-w-lg bg-white rounded-t-[24px] sm:rounded-[24px] max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <h2 className="text-xl font-bold text-[#1A1A1A] mb-1">Session Notes</h2>
                    <p className="text-sm text-[#1A1A1A]/60 mb-6">
                        {session.providerName} - {session.scheduledDate?.toDate?.().toLocaleDateString()}
                    </p>

                    <div className="space-y-6">
                        {/* Session Notes */}
                        <div>
                            <label className="block text-sm font-medium text-[#1A1A1A]/70 mb-2">
                                Session Summary
                            </label>
                            <textarea
                                value={sessionNotes}
                                onChange={(e) => setSessionNotes(e.target.value)}
                                placeholder="What happened during the session?"
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl border border-[#1A1A1A]/10 focus:border-[#4B0082] focus:ring-1 focus:ring-[#4B0082] outline-none resize-none"
                            />
                        </div>

                        {/* Therapist Feedback */}
                        <div>
                            <label className="block text-sm font-medium text-[#1A1A1A]/70 mb-2">
                                Therapist Feedback
                            </label>
                            <textarea
                                value={therapistFeedback}
                                onChange={(e) => setTherapistFeedback(e.target.value)}
                                placeholder="Key feedback from the therapist"
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl border border-[#1A1A1A]/10 focus:border-[#4B0082] focus:ring-1 focus:ring-[#4B0082] outline-none resize-none"
                            />
                        </div>

                        {/* Home Activities */}
                        <div>
                            <label className="block text-sm font-medium text-[#1A1A1A]/70 mb-2">
                                Home Activities
                            </label>
                            <div className="space-y-2 mb-2">
                                {homeActivities.map((activity, i) => (
                                    <div
                                        key={i}
                                        className="flex items-start gap-2 p-3 bg-green-50 rounded-xl"
                                    >
                                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                        <span className="text-sm text-[#1A1A1A] flex-1">{activity}</span>
                                        <button
                                            onClick={() => handleRemoveActivity(i)}
                                            className="text-[#1A1A1A]/30 hover:text-red-500"
                                        >
                                            <XCircle className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newActivity}
                                    onChange={(e) => setNewActivity(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddActivity()}
                                    placeholder="Add a home activity..."
                                    className="flex-1 px-4 py-2 rounded-xl border border-[#1A1A1A]/10 focus:border-[#4B0082] outline-none text-sm"
                                />
                                <button
                                    onClick={handleAddActivity}
                                    className="px-4 py-2 rounded-xl bg-green-500 text-white"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Next Steps */}
                        <div>
                            <label className="block text-sm font-medium text-[#1A1A1A]/70 mb-2">
                                Next Steps
                            </label>
                            <div className="space-y-2 mb-2">
                                {nextSteps.map((step, i) => (
                                    <div
                                        key={i}
                                        className="flex items-start gap-2 p-3 bg-blue-50 rounded-xl"
                                    >
                                        <span className="text-xs font-bold text-blue-500 mt-0.5">
                                            {i + 1}
                                        </span>
                                        <span className="text-sm text-[#1A1A1A] flex-1">{step}</span>
                                        <button
                                            onClick={() => handleRemoveStep(i)}
                                            className="text-[#1A1A1A]/30 hover:text-red-500"
                                        >
                                            <XCircle className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newStep}
                                    onChange={(e) => setNewStep(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddStep()}
                                    placeholder="Add a next step..."
                                    className="flex-1 px-4 py-2 rounded-xl border border-[#1A1A1A]/10 focus:border-[#4B0082] outline-none text-sm"
                                />
                                <button
                                    onClick={handleAddStep}
                                    className="px-4 py-2 rounded-xl bg-blue-500 text-white"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl border border-[#1A1A1A]/10 text-[#1A1A1A]/60 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex-1 py-3 rounded-xl bg-[#4B0082] text-white font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSaving ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <CheckCircle className="w-5 h-5" />
                                    Save Notes
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default TherapySessionPrep;
