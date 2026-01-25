/**
 * SKILLS TRACKING: Growth & Progress
 *
 * ABA-informed skill tracking with dignity-centered framing.
 * Tracks daily progress, celebrates milestones, and visualizes growth.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Target,
    TrendingUp,
    CheckCircle,
    X,
    Sparkles,
    Flame,
    Award,
    Loader2,
    BookOpen,
} from 'lucide-react';
import { useAuthStore } from '../../core/stores/useAuthStore';
import {
    getSkills,
    getSkillsSummary,
    getSkillProgress,
    createSkill,
    createSkillFromTemplate,
    logSkillEntry,
    getTodaysEntries,
    SKILL_TEMPLATES,
} from '../../core/firebase/skills';
import type {
    Skill,
    SkillEntry,
    SkillCategory,
    MasteryLevel,
} from '../../core/stores/types';

interface SkillsProps {
    onNavigate?: (view: string) => void;
}

type ViewMode = 'overview' | 'category' | 'tracking';

// Category colors and icons
const CATEGORY_STYLES: Record<SkillCategory, { bg: string; text: string; icon: string }> = {
    Communication: { bg: 'bg-blue-100', text: 'text-blue-700', icon: '💬' },
    'Daily Living': { bg: 'bg-green-100', text: 'text-green-700', icon: '🏠' },
    Social: { bg: 'bg-purple-100', text: 'text-purple-700', icon: '👥' },
    Academic: { bg: 'bg-amber-100', text: 'text-amber-700', icon: '📚' },
    Motor: { bg: 'bg-red-100', text: 'text-red-700', icon: '🏃' },
    'Self-Regulation': { bg: 'bg-teal-100', text: 'text-teal-700', icon: '🧘' },
};

// Mastery level colors
const MASTERY_COLORS: Record<MasteryLevel, string> = {
    Emerging: 'bg-gray-200',
    Developing: 'bg-yellow-300',
    Practicing: 'bg-blue-400',
    Mastered: 'bg-green-500',
};

export const Skills = ({ onNavigate: _onNavigate }: SkillsProps) => {
    const { user } = useAuthStore();
    const [skills, setSkills] = useState<Skill[]>([]);
    const [summary, setSummary] = useState<{
        totalActiveSkills: number;
        masteredSkills: number;
        skillsByCategory: Record<SkillCategory, number>;
        todaysProgress: number;
    } | null>(null);
    const [todaysEntries, setTodaysEntries] = useState<SkillEntry[]>([]);
    const [skillProgress, setSkillProgress] = useState<Record<string, {
        successRate: number;
        recentTrend: 'improving' | 'stable' | 'declining';
        streakDays: number;
    }>>({});

    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<ViewMode>('overview');
    const [selectedCategory, setSelectedCategory] = useState<SkillCategory | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showTrackingModal, setShowTrackingModal] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

    // Load data
    useEffect(() => {
        if (!user) return;
        loadData();
    }, [user]);

    const loadData = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            const [skillsData, summaryData, entriesData] = await Promise.all([
                getSkills(user.uid, true),
                getSkillsSummary(user.uid),
                getTodaysEntries(user.uid),
            ]);

            setSkills(skillsData);
            setSummary(summaryData);
            setTodaysEntries(entriesData);

            // Load progress for each skill
            const progressPromises = skillsData.map(async (skill) => {
                const progress = await getSkillProgress(user.uid, skill.id);
                return { id: skill.id, progress };
            });

            const progressResults = await Promise.all(progressPromises);
            const progressMap: Record<string, typeof skillProgress[string]> = {};
            progressResults.forEach(({ id, progress }) => {
                progressMap[id] = {
                    successRate: progress.successRate,
                    recentTrend: progress.recentTrend,
                    streakDays: progress.streakDays,
                };
            });
            setSkillProgress(progressMap);
        } catch (error) {
            console.error('Error loading skills:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickLog = async (skill: Skill) => {
        setSelectedSkill(skill);
        setShowTrackingModal(true);
    };

    const handleLogEntry = async (
        skillId: string,
        successCount: number,
        attemptCount: number,
        promptLevel?: 'full' | 'partial' | 'minimal' | 'independent',
        notes?: string
    ) => {
        if (!user) return;

        try {
            await logSkillEntry(user.uid, {
                skillId,
                date: new Date(),
                successCount,
                attemptCount,
                promptLevel,
                notes,
            });

            setShowTrackingModal(false);
            setSelectedSkill(null);
            loadData();
        } catch (error) {
            console.error('Error logging entry:', error);
        }
    };

    const getSkillsToTrack = () => {
        const trackedIds = new Set(todaysEntries.map((e) => e.skillId));
        return skills.filter(
            (s) => s.targetFrequency === 'daily' && !trackedIds.has(s.id)
        );
    };

    const categories = Object.keys(CATEGORY_STYLES) as SkillCategory[];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#FDF8F3] to-[#F5E6D3] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 text-[#4B0082] animate-spin mx-auto mb-3" />
                    <p className="text-[#1A1A1A]/60">Loading skills...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#FDF8F3] to-[#F5E6D3] pb-24">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#4B0082] to-[#6B2FAA] text-white p-6 pt-12">
                <div className="max-w-lg mx-auto">
                    <h1 className="text-2xl font-bold mb-2">Growth & Progress</h1>
                    <p className="text-white/80 text-sm">
                        Track skills, celebrate wins, witness growth
                    </p>

                    {/* Summary Stats */}
                    {summary && (
                        <div className="grid grid-cols-3 gap-3 mt-6">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                                <div className="text-2xl font-bold">{summary.totalActiveSkills}</div>
                                <div className="text-xs text-white/70">Active Skills</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                                <div className="text-2xl font-bold">{summary.masteredSkills}</div>
                                <div className="text-xs text-white/70">Mastered</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                                <div className="text-2xl font-bold">{Math.round(summary.todaysProgress)}%</div>
                                <div className="text-xs text-white/70">Today</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-lg mx-auto p-4">
                {/* Quick Track Section */}
                {getSkillsToTrack().length > 0 && (
                    <section className="mb-6">
                        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-3 flex items-center gap-2">
                            <Target className="w-5 h-5 text-[#4B0082]" />
                            Track Today
                        </h2>
                        <div className="space-y-2">
                            {getSkillsToTrack().slice(0, 3).map((skill) => (
                                <motion.button
                                    key={skill.id}
                                    onClick={() => handleQuickLog(skill)}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    className="w-full bg-white rounded-xl p-4 shadow-sm border border-[#4B0082]/10 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">
                                            {CATEGORY_STYLES[skill.category].icon}
                                        </span>
                                        <div className="text-left">
                                            <div className="font-medium text-[#1A1A1A]">
                                                {skill.name}
                                            </div>
                                            <div className="text-xs text-[#1A1A1A]/50">
                                                {skill.category}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {skillProgress[skill.id]?.streakDays > 0 && (
                                            <div className="flex items-center gap-1 text-orange-500 text-sm">
                                                <Flame className="w-4 h-4" />
                                                {skillProgress[skill.id].streakDays}
                                            </div>
                                        )}
                                        <Plus className="w-5 h-5 text-[#4B0082]" />
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </section>
                )}

                {/* Categories Grid */}
                <section className="mb-6">
                    <h2 className="text-lg font-semibold text-[#1A1A1A] mb-3 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-[#4B0082]" />
                        Categories
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                        {categories.map((category) => {
                            const style = CATEGORY_STYLES[category];
                            const count = summary?.skillsByCategory[category] || 0;

                            return (
                                <motion.button
                                    key={category}
                                    onClick={() => {
                                        setSelectedCategory(category);
                                        setViewMode('category');
                                    }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`${style.bg} rounded-xl p-4 text-left`}
                                >
                                    <span className="text-2xl">{style.icon}</span>
                                    <div className={`font-medium ${style.text} mt-2`}>
                                        {category}
                                    </div>
                                    <div className="text-xs text-[#1A1A1A]/50">
                                        {count} skill{count !== 1 ? 's' : ''}
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                </section>

                {/* All Skills List */}
                {skills.length > 0 && (
                    <section className="mb-6">
                        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-3 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-[#4B0082]" />
                            All Active Skills
                        </h2>
                        <div className="space-y-3">
                            {skills.map((skill) => (
                                <SkillCard
                                    key={skill.id}
                                    skill={skill}
                                    progress={skillProgress[skill.id]}
                                    onTrack={() => handleQuickLog(skill)}
                                    isTrackedToday={todaysEntries.some(
                                        (e) => e.skillId === skill.id
                                    )}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Empty State */}
                {skills.length === 0 && (
                    <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                        <Target className="w-12 h-12 text-[#4B0082]/30 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
                            Start Tracking Growth
                        </h3>
                        <p className="text-[#1A1A1A]/60 text-sm mb-6">
                            Add skills to track your child's progress and celebrate their wins.
                        </p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-6 py-3 bg-[#4B0082] text-white rounded-full font-medium"
                        >
                            Add First Skill
                        </button>
                    </div>
                )}

                {/* Add Skill FAB */}
                <motion.button
                    onClick={() => setShowAddModal(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="fixed bottom-24 right-6 w-14 h-14 bg-[#D4AF37] rounded-full shadow-lg flex items-center justify-center"
                >
                    <Plus className="w-6 h-6 text-white" />
                </motion.button>
            </div>

            {/* Add Skill Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <AddSkillModal
                        onClose={() => setShowAddModal(false)}
                        onAdd={async (data) => {
                            if (!user) return;
                            if (data.templateId) {
                                await createSkillFromTemplate(user.uid, data.templateId);
                            } else {
                                await createSkill(user.uid, {
                                    name: data.name!,
                                    description: data.description,
                                    category: data.category!,
                                    targetFrequency: data.targetFrequency || 'daily',
                                    targetCount: data.targetCount || 3,
                                });
                            }
                            setShowAddModal(false);
                            loadData();
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Tracking Modal */}
            <AnimatePresence>
                {showTrackingModal && selectedSkill && (
                    <TrackingModal
                        skill={selectedSkill}
                        onClose={() => {
                            setShowTrackingModal(false);
                            setSelectedSkill(null);
                        }}
                        onLog={handleLogEntry}
                    />
                )}
            </AnimatePresence>

            {/* Category View Modal */}
            <AnimatePresence>
                {viewMode === 'category' && selectedCategory && (
                    <CategoryView
                        category={selectedCategory}
                        skills={skills.filter((s) => s.category === selectedCategory)}
                        skillProgress={skillProgress}
                        todaysEntries={todaysEntries}
                        onClose={() => {
                            setViewMode('overview');
                            setSelectedCategory(null);
                        }}
                        onTrack={(skill) => handleQuickLog(skill)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// =====================================================
// SUB-COMPONENTS
// =====================================================

interface SkillCardProps {
    skill: Skill;
    progress?: {
        successRate: number;
        recentTrend: 'improving' | 'stable' | 'declining';
        streakDays: number;
    };
    onTrack: () => void;
    isTrackedToday: boolean;
}

const SkillCard = ({ skill, progress, onTrack, isTrackedToday }: SkillCardProps) => {
    const style = CATEGORY_STYLES[skill.category];

    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-[#4B0082]/5"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                            {skill.category}
                        </span>
                        {skill.currentMastery === 'Mastered' && (
                            <Award className="w-4 h-4 text-[#D4AF37]" />
                        )}
                    </div>
                    <h3 className="font-medium text-[#1A1A1A] mb-1">{skill.name}</h3>

                    {/* Progress Bar */}
                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${MASTERY_COLORS[skill.currentMastery]} transition-all`}
                                style={{
                                    width: `${(progress?.successRate || 0) * 100}%`,
                                }}
                            />
                        </div>
                        <span className="text-xs text-[#1A1A1A]/50">
                            {Math.round((progress?.successRate || 0) * 100)}%
                        </span>
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center gap-3 mt-2 text-xs text-[#1A1A1A]/50">
                        <span className="capitalize">{skill.currentMastery}</span>
                        {progress && progress.streakDays > 0 && (
                            <span className="flex items-center gap-1 text-orange-500">
                                <Flame className="w-3 h-3" />
                                {progress.streakDays} day streak
                            </span>
                        )}
                        {progress && progress.recentTrend === 'improving' && (
                            <span className="flex items-center gap-1 text-green-500">
                                <TrendingUp className="w-3 h-3" />
                                Improving
                            </span>
                        )}
                    </div>
                </div>

                {/* Track Button */}
                <button
                    onClick={onTrack}
                    disabled={isTrackedToday}
                    className={`p-2 rounded-full ${
                        isTrackedToday
                            ? 'bg-green-100 text-green-600'
                            : 'bg-[#4B0082]/10 text-[#4B0082]'
                    }`}
                >
                    {isTrackedToday ? (
                        <CheckCircle className="w-5 h-5" />
                    ) : (
                        <Plus className="w-5 h-5" />
                    )}
                </button>
            </div>
        </motion.div>
    );
};

// Add Skill Modal
interface AddSkillModalProps {
    onClose: () => void;
    onAdd: (data: {
        templateId?: string;
        name?: string;
        description?: string;
        category?: SkillCategory;
        targetFrequency?: 'daily' | 'weekly';
        targetCount?: number;
    }) => Promise<void>;
}

const AddSkillModal = ({ onClose, onAdd }: AddSkillModalProps) => {
    const [mode, setMode] = useState<'templates' | 'custom'>('templates');
    const [selectedCategory, setSelectedCategory] = useState<SkillCategory | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Custom form state
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<SkillCategory>('Communication');
    const [targetFrequency, setTargetFrequency] = useState<'daily' | 'weekly'>('daily');
    const [targetCount, setTargetCount] = useState(3);

    const categories = Object.keys(CATEGORY_STYLES) as SkillCategory[];

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await onAdd({
                name,
                description,
                category,
                targetFrequency,
                targetCount,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTemplateSelect = async (templateId: string) => {
        setIsSubmitting(true);
        try {
            await onAdd({ templateId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredTemplates = selectedCategory
        ? SKILL_TEMPLATES.filter((t) => t.category === selectedCategory)
        : SKILL_TEMPLATES;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-t-3xl w-full max-w-lg max-h-[85vh] overflow-hidden"
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-[#1A1A1A]">Add Skill</h2>
                        <button onClick={onClose} className="p-2">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Mode Toggle */}
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setMode('templates')}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
                                mode === 'templates'
                                    ? 'bg-white shadow text-[#4B0082]'
                                    : 'text-[#1A1A1A]/50'
                            }`}
                        >
                            Templates
                        </button>
                        <button
                            onClick={() => setMode('custom')}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
                                mode === 'custom'
                                    ? 'bg-white shadow text-[#4B0082]'
                                    : 'text-[#1A1A1A]/50'
                            }`}
                        >
                            Custom
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {mode === 'templates' ? (
                        <>
                            {/* Category Filter */}
                            <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                                        !selectedCategory
                                            ? 'bg-[#4B0082] text-white'
                                            : 'bg-gray-100 text-[#1A1A1A]/60'
                                    }`}
                                >
                                    All
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                                            selectedCategory === cat
                                                ? 'bg-[#4B0082] text-white'
                                                : 'bg-gray-100 text-[#1A1A1A]/60'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            {/* Templates List */}
                            <div className="space-y-2">
                                {filteredTemplates.map((template) => (
                                    <button
                                        key={template.id}
                                        onClick={() => handleTemplateSelect(template.id)}
                                        disabled={isSubmitting}
                                        className="w-full text-left p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition disabled:opacity-50"
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <span>
                                                {CATEGORY_STYLES[template.category].icon}
                                            </span>
                                            <span className="font-medium text-[#1A1A1A]">
                                                {template.name}
                                            </span>
                                        </div>
                                        <p className="text-sm text-[#1A1A1A]/60">
                                            {template.description}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        /* Custom Form */
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                                    Skill Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g., Make eye contact when speaking"
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:border-[#4B0082] focus:ring-1 focus:ring-[#4B0082] outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                                    Description (optional)
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Additional details..."
                                    rows={2}
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:border-[#4B0082] focus:ring-1 focus:ring-[#4B0082] outline-none resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                                    Category
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setCategory(cat)}
                                            className={`p-3 rounded-xl text-left text-sm ${
                                                category === cat
                                                    ? 'bg-[#4B0082] text-white'
                                                    : 'bg-gray-100 text-[#1A1A1A]'
                                            }`}
                                        >
                                            {CATEGORY_STYLES[cat].icon} {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                                        Frequency
                                    </label>
                                    <select
                                        value={targetFrequency}
                                        onChange={(e) =>
                                            setTargetFrequency(e.target.value as 'daily' | 'weekly')
                                        }
                                        className="w-full p-3 rounded-xl border border-gray-200"
                                    >
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                                        Target Count
                                    </label>
                                    <input
                                        type="number"
                                        value={targetCount}
                                        onChange={(e) => setTargetCount(Number(e.target.value))}
                                        min={1}
                                        max={20}
                                        className="w-full p-3 rounded-xl border border-gray-200"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={!name || isSubmitting}
                                className="w-full py-3 bg-[#4B0082] text-white rounded-xl font-medium disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                                ) : (
                                    'Add Skill'
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

// Tracking Modal
interface TrackingModalProps {
    skill: Skill;
    onClose: () => void;
    onLog: (
        skillId: string,
        successCount: number,
        attemptCount: number,
        promptLevel?: 'full' | 'partial' | 'minimal' | 'independent',
        notes?: string
    ) => Promise<void>;
}

const TrackingModal = ({ skill, onClose, onLog }: TrackingModalProps) => {
    const [successCount, setSuccessCount] = useState(0);
    const [attemptCount, setAttemptCount] = useState(0);
    const [promptLevel, setPromptLevel] = useState<'full' | 'partial' | 'minimal' | 'independent'>('partial');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await onLog(skill.id, successCount, attemptCount, promptLevel, notes || undefined);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-t-3xl w-full max-w-lg"
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-[#1A1A1A]">Log Progress</h2>
                            <p className="text-sm text-[#1A1A1A]/60">{skill.name}</p>
                        </div>
                        <button onClick={onClose} className="p-2">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                    {/* Counters */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                                Successful
                            </label>
                            <div className="flex items-center justify-center gap-3">
                                <button
                                    onClick={() => setSuccessCount(Math.max(0, successCount - 1))}
                                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl"
                                >
                                    -
                                </button>
                                <span className="text-3xl font-bold text-green-600 w-12">
                                    {successCount}
                                </span>
                                <button
                                    onClick={() => setSuccessCount(successCount + 1)}
                                    className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xl"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <div className="text-center">
                            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                                Attempts
                            </label>
                            <div className="flex items-center justify-center gap-3">
                                <button
                                    onClick={() => setAttemptCount(Math.max(0, attemptCount - 1))}
                                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl"
                                >
                                    -
                                </button>
                                <span className="text-3xl font-bold text-[#4B0082] w-12">
                                    {attemptCount}
                                </span>
                                <button
                                    onClick={() => setAttemptCount(attemptCount + 1)}
                                    className="w-10 h-10 rounded-full bg-[#4B0082]/10 text-[#4B0082] flex items-center justify-center text-xl"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Prompt Level */}
                    <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                            Support Level
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {(['full', 'partial', 'minimal', 'independent'] as const).map((level) => (
                                <button
                                    key={level}
                                    onClick={() => setPromptLevel(level)}
                                    className={`py-2 px-2 rounded-lg text-xs font-medium capitalize ${
                                        promptLevel === level
                                            ? 'bg-[#4B0082] text-white'
                                            : 'bg-gray-100 text-[#1A1A1A]/60'
                                    }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                            Notes (optional)
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="What worked well? Any challenges?"
                            rows={2}
                            className="w-full p-3 rounded-xl border border-gray-200 focus:border-[#4B0082] outline-none resize-none"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        disabled={attemptCount === 0 || isSubmitting}
                        className="w-full py-4 bg-[#D4AF37] text-white rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                Log Progress
                            </>
                        )}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

// Category View
interface CategoryViewProps {
    category: SkillCategory;
    skills: Skill[];
    skillProgress: Record<string, {
        successRate: number;
        recentTrend: 'improving' | 'stable' | 'declining';
        streakDays: number;
    }>;
    todaysEntries: SkillEntry[];
    onClose: () => void;
    onTrack: (skill: Skill) => void;
}

const CategoryView = ({
    category,
    skills,
    skillProgress,
    todaysEntries,
    onClose,
    onTrack,
}: CategoryViewProps) => {
    const style = CATEGORY_STYLES[category];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#FDF8F3]"
        >
            {/* Header */}
            <div className={`${style.bg} p-6 pt-12`}>
                <div className="flex items-center gap-4 mb-4">
                    <button onClick={onClose} className="p-2 rounded-full bg-white/50">
                        <X className="w-5 h-5" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-3xl">{style.icon}</span>
                            <h1 className={`text-2xl font-bold ${style.text}`}>{category}</h1>
                        </div>
                        <p className="text-sm text-[#1A1A1A]/60">
                            {skills.length} skill{skills.length !== 1 ? 's' : ''} tracked
                        </p>
                    </div>
                </div>
            </div>

            {/* Skills List */}
            <div className="p-4 space-y-3 max-h-[calc(100vh-150px)] overflow-y-auto pb-24">
                {skills.length === 0 ? (
                    <div className="text-center py-12">
                        <Target className="w-12 h-12 text-[#1A1A1A]/20 mx-auto mb-3" />
                        <p className="text-[#1A1A1A]/50">No skills in this category yet</p>
                    </div>
                ) : (
                    skills.map((skill) => (
                        <SkillCard
                            key={skill.id}
                            skill={skill}
                            progress={skillProgress[skill.id]}
                            onTrack={() => onTrack(skill)}
                            isTrackedToday={todaysEntries.some((e) => e.skillId === skill.id)}
                        />
                    ))
                )}
            </div>
        </motion.div>
    );
};

export default Skills;
