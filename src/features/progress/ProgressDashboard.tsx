/**
 * PROGRESS DASHBOARD
 *
 * Visual analytics dashboard showing child's progress over time.
 * Aggregates skills, observations, and memory insights into
 * shareable reports for therapists and schools.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TrendingUp,
    TrendingDown,
    Minus,
    Download,
    Share2,
    ChevronRight,
    Sparkles,
    Heart,
    Brain,
    Target,
    Award,
    BarChart3,
    Loader2,
    Star,
    Zap,
    Users,
} from 'lucide-react';
import { useAuthStore } from '../../core/stores/useAuthStore';
import { getProfile } from '../../core/firebase/profiles';
import {
    generateProgressReport,
    createPeriod,
    type ProgressReport,
    type SkillProgressSummary,
} from '../../lib/progress/progressAnalytics';
import type { UserProfile } from '../../core/stores/profileTypes';

interface ProgressDashboardProps {
    onNavigate?: (view: string) => void;
}

type PeriodType = 'week' | 'month' | 'quarter';

export const ProgressDashboard = ({ onNavigate: _onNavigate }: ProgressDashboardProps) => {
    const { user } = useAuthStore();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [report, setReport] = useState<ProgressReport | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('month');
    const [expandedSection, setExpandedSection] = useState<string | null>('overview');

    useEffect(() => {
        if (user) {
            loadData();
        }
    }, [user, selectedPeriod]);

    const loadData = async () => {
        if (!user) return;
        setIsLoading(true);

        try {
            const [userProfile] = await Promise.all([
                getProfile(user.uid),
            ]);
            setProfile(userProfile);

            const period = createPeriod(selectedPeriod);
            const progressReport = await generateProgressReport(
                user.uid,
                userProfile?.childName || 'Child',
                period
            );
            setReport(progressReport);
        } catch (error) {
            console.error('Failed to load progress data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleShare = async () => {
        if (!report) return;

        const shareText = `${report.childName}'s Progress Report\n\n${report.narrativeSummary}\n\nCelebrations:\n${report.celebrationPoints.map(c => `• ${c}`).join('\n')}`;

        if (navigator.share) {
            await navigator.share({
                title: `${report.childName}'s Progress Report`,
                text: shareText,
            });
        } else {
            await navigator.clipboard.writeText(shareText);
            alert('Report copied to clipboard!');
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-[#4B0082]" />
                <p className="text-sm opacity-60">Analyzing progress...</p>
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
                            Growth Journey
                        </h2>
                        <h1 className="text-3xl font-serif text-[#1A1A1A] mt-1">
                            Progress
                        </h1>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleShare}
                            className="p-2 rounded-xl bg-white/60 border border-white/50 text-[#4B0082]"
                        >
                            <Share2 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => {/* TODO: PDF export */}}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4B0082] text-white text-sm font-semibold"
                        >
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                </div>
                <p className="text-sm opacity-60 mt-2">
                    {profile?.childName || 'Your child'}'s growth over time
                </p>
            </header>

            {/* PERIOD SELECTOR */}
            <div className="px-4">
                <div className="glass-panel p-1 rounded-2xl flex">
                    {(['week', 'month', 'quarter'] as PeriodType[]).map((period) => (
                        <button
                            key={period}
                            onClick={() => setSelectedPeriod(period)}
                            className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                                selectedPeriod === period
                                    ? 'bg-[#4B0082] text-white shadow-md'
                                    : 'text-[#1A1A1A]/60'
                            }`}
                        >
                            {period === 'week' ? '7 Days' : period === 'month' ? '30 Days' : '3 Months'}
                        </button>
                    ))}
                </div>
            </div>

            {report && (
                <>
                    {/* OVERVIEW CARDS */}
                    <div className="px-4 grid grid-cols-2 gap-3">
                        <StatCard
                            icon={Target}
                            label="Skills Practiced"
                            value={report.skillSummaries.filter(s => s.practiceCount > 0).length}
                            subtext="active skills"
                            color="purple"
                        />
                        <StatCard
                            icon={Heart}
                            label="Observations"
                            value={report.observationStats.periodCount}
                            subtext={`avg ${report.observationStats.averageReciprocity.toFixed(1)}/5 connection`}
                            color="gold"
                        />
                        <StatCard
                            icon={TrendingUp}
                            label="Improving"
                            value={report.topImprovingSkills.length}
                            subtext="skills growing"
                            color="green"
                        />
                        <StatCard
                            icon={Sparkles}
                            label="Joy Moments"
                            value={report.observationStats.joyMoments}
                            subtext="captured"
                            color="amber"
                        />
                    </div>

                    {/* CELEBRATION POINTS */}
                    {report.celebrationPoints.length > 0 && (
                        <section className="px-4">
                            <SectionCard
                                title="Celebrations"
                                icon={Award}
                                iconColor="text-amber-500"
                                expanded={expandedSection === 'celebrations'}
                                onToggle={() => setExpandedSection(
                                    expandedSection === 'celebrations' ? null : 'celebrations'
                                )}
                            >
                                <div className="space-y-2">
                                    {report.celebrationPoints.map((point, i) => (
                                        <div
                                            key={i}
                                            className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl"
                                        >
                                            <Star className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-sm text-[#1A1A1A]">{point}</span>
                                        </div>
                                    ))}
                                </div>
                            </SectionCard>
                        </section>
                    )}

                    {/* NARRATIVE SUMMARY */}
                    <section className="px-4">
                        <SectionCard
                            title="Summary"
                            icon={Brain}
                            iconColor="text-purple-500"
                            expanded={expandedSection === 'overview'}
                            onToggle={() => setExpandedSection(
                                expandedSection === 'overview' ? null : 'overview'
                            )}
                        >
                            <p className="text-sm text-[#1A1A1A]/80 leading-relaxed">
                                {report.narrativeSummary}
                            </p>
                        </SectionCard>
                    </section>

                    {/* SKILL PROGRESS */}
                    <section className="px-4">
                        <SectionCard
                            title="Skill Progress"
                            icon={BarChart3}
                            iconColor="text-blue-500"
                            expanded={expandedSection === 'skills'}
                            onToggle={() => setExpandedSection(
                                expandedSection === 'skills' ? null : 'skills'
                            )}
                            badge={`${report.skillSummaries.length} skills`}
                        >
                            <div className="space-y-3">
                                {report.skillSummaries.slice(0, 8).map((skill) => (
                                    <SkillProgressRow key={skill.skillId} skill={skill} />
                                ))}
                                {report.skillSummaries.length > 8 && (
                                    <p className="text-xs text-center text-[#1A1A1A]/50 pt-2">
                                        + {report.skillSummaries.length - 8} more skills
                                    </p>
                                )}
                            </div>
                        </SectionCard>
                    </section>

                    {/* STRENGTHS */}
                    {report.strengthHighlights.length > 0 && (
                        <section className="px-4">
                            <SectionCard
                                title="Strengths Observed"
                                icon={Zap}
                                iconColor="text-amber-500"
                                expanded={expandedSection === 'strengths'}
                                onToggle={() => setExpandedSection(
                                    expandedSection === 'strengths' ? null : 'strengths'
                                )}
                            >
                                <div className="flex flex-wrap gap-2">
                                    {report.strengthHighlights.map((strength, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm"
                                        >
                                            {strength.strength}
                                        </span>
                                    ))}
                                </div>
                            </SectionCard>
                        </section>
                    )}

                    {/* FOR THERAPIST */}
                    {report.recommendationsForTherapist.length > 0 && (
                        <section className="px-4">
                            <SectionCard
                                title="For Therapist"
                                icon={Users}
                                iconColor="text-blue-500"
                                expanded={expandedSection === 'therapist'}
                                onToggle={() => setExpandedSection(
                                    expandedSection === 'therapist' ? null : 'therapist'
                                )}
                            >
                                <ul className="space-y-2">
                                    {report.recommendationsForTherapist.map((rec, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start gap-2 text-sm text-[#1A1A1A]/80"
                                        >
                                            <span className="text-[#4B0082] mt-1">•</span>
                                            <span>{rec}</span>
                                        </li>
                                    ))}
                                </ul>
                            </SectionCard>
                        </section>
                    )}

                    {/* FOR SCHOOL */}
                    {report.recommendationsForSchool.length > 0 && (
                        <section className="px-4">
                            <SectionCard
                                title="For School"
                                icon={Users}
                                iconColor="text-green-500"
                                expanded={expandedSection === 'school'}
                                onToggle={() => setExpandedSection(
                                    expandedSection === 'school' ? null : 'school'
                                )}
                            >
                                <ul className="space-y-2">
                                    {report.recommendationsForSchool.map((rec, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start gap-2 text-sm text-[#1A1A1A]/80"
                                        >
                                            <span className="text-green-600 mt-1">•</span>
                                            <span>{rec}</span>
                                        </li>
                                    ))}
                                </ul>
                            </SectionCard>
                        </section>
                    )}

                    {/* COMMUNICATION PATTERNS */}
                    {report.observationStats.dominantChannels.length > 0 && (
                        <section className="px-4">
                            <SectionCard
                                title="Communication Patterns"
                                icon={Heart}
                                iconColor="text-pink-500"
                                expanded={expandedSection === 'communication'}
                                onToggle={() => setExpandedSection(
                                    expandedSection === 'communication' ? null : 'communication'
                                )}
                            >
                                <div className="space-y-3">
                                    {report.observationStats.dominantChannels.map((channel, i) => {
                                        const count = report.observationStats.channelDistribution[channel] || 0;
                                        const percentage = report.observationStats.periodCount > 0
                                            ? Math.round((count / report.observationStats.periodCount) * 100)
                                            : 0;
                                        return (
                                            <div key={i} className="flex items-center gap-3">
                                                <span className="text-sm text-[#1A1A1A] flex-1">{channel}</span>
                                                <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-[#4B0082] rounded-full"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-[#1A1A1A]/50 w-10 text-right">
                                                    {percentage}%
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </SectionCard>
                        </section>
                    )}
                </>
            )}
        </div>
    );
};

// Stat Card Component
interface StatCardProps {
    icon: typeof TrendingUp;
    label: string;
    value: number;
    subtext: string;
    color: 'purple' | 'gold' | 'green' | 'amber';
}

const StatCard = ({ icon: Icon, label, value, subtext, color }: StatCardProps) => {
    const colors = {
        purple: 'bg-[#4B0082]/10 text-[#4B0082]',
        gold: 'bg-[#D4AF37]/10 text-[#D4AF37]',
        green: 'bg-green-100 text-green-600',
        amber: 'bg-amber-100 text-amber-600',
    };

    return (
        <div className="glass-panel p-4 rounded-[20px]">
            <div className={`w-10 h-10 rounded-xl ${colors[color]} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-[#1A1A1A]">{value}</p>
            <p className="text-xs text-[#1A1A1A]/60 font-medium">{label}</p>
            <p className="text-[10px] text-[#1A1A1A]/40 mt-1">{subtext}</p>
        </div>
    );
};

// Section Card Component
interface SectionCardProps {
    title: string;
    icon: typeof Brain;
    iconColor: string;
    expanded: boolean;
    onToggle: () => void;
    badge?: string;
    children: React.ReactNode;
}

const SectionCard = ({
    title,
    icon: Icon,
    iconColor,
    expanded,
    onToggle,
    badge,
    children,
}: SectionCardProps) => {
    return (
        <div className="glass-panel rounded-[20px] overflow-hidden">
            <button
                onClick={onToggle}
                className="w-full p-4 flex items-center justify-between"
            >
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gray-100`}>
                        <Icon className={`w-5 h-5 ${iconColor}`} />
                    </div>
                    <span className="font-semibold text-[#1A1A1A]">{title}</span>
                    {badge && (
                        <span className="px-2 py-0.5 bg-[#4B0082]/10 text-[#4B0082] rounded-full text-xs">
                            {badge}
                        </span>
                    )}
                </div>
                <motion.div
                    animate={{ rotate: expanded ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronRight className="w-5 h-5 text-[#1A1A1A]/30" />
                </motion.div>
            </button>
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="px-4 pb-4">{children}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Skill Progress Row Component
interface SkillProgressRowProps {
    skill: SkillProgressSummary;
}

const SkillProgressRow = ({ skill }: SkillProgressRowProps) => {
    const TrendIcon = skill.trend === 'improving' ? TrendingUp :
        skill.trend === 'declining' ? TrendingDown : Minus;

    const trendColor = skill.trend === 'improving' ? 'text-green-500' :
        skill.trend === 'declining' ? 'text-red-500' : 'text-gray-400';

    const levelPercentage = (skill.currentLevel / 5) * 100;

    return (
        <div className="flex items-center gap-3 py-2">
            <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-[#1A1A1A]">{skill.skillName}</span>
                    <div className="flex items-center gap-1">
                        <TrendIcon className={`w-4 h-4 ${trendColor}`} />
                        <span className="text-xs text-[#1A1A1A]/50">
                            {skill.currentLevel.toFixed(1)}/5
                        </span>
                    </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-[#4B0082] to-[#D4AF37] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${levelPercentage}%` }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    />
                </div>
            </div>
            <span className="text-[10px] text-[#1A1A1A]/40 w-16 text-right">
                {skill.practiceCount} sessions
            </span>
        </div>
    );
};

export default ProgressDashboard;
