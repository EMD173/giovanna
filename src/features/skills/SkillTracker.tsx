/**
 * SKILL TRACKER
 * 
 * Track developmental skills across 6 domains with:
 * - Visual progress indicators
 * - Celebration of milestones
 * - IEP goal linkage
 * - Dignity-centered language
 * 
 * Domains:
 * 1. Communication (verbal, AAC, gestures)
 * 2. Daily Living (self-care, routines)
 * 3. Social (connection, reciprocity)
 * 4. Academic (learning, cognitive)
 * 5. Motor (fine, gross, sensory-motor)
 * 6. Regulation (emotional, sensory, coping)
 */

import { useState, useEffect } from 'react';
import {
    ArrowLeft,
    Plus,
    ChevronRight,
    Check,
    Star,
    Sparkles,
    X,
} from 'lucide-react';
import { useAuthStore } from '../../core/stores/useAuthStore';
import { getProfile } from '../../core/firebase/profiles';

// ============================================================================
// TYPES
// ============================================================================

export type SkillDomain = 
    | 'communication'
    | 'daily_living'
    | 'social'
    | 'academic'
    | 'motor'
    | 'regulation';

export type SkillStatus = 
    | 'not_started'
    | 'emerging'
    | 'developing'
    | 'consistent'
    | 'mastered';

export interface Skill {
    id: string;
    domain: SkillDomain;
    name: string;
    dignityFraming: string;          // Strength-based description
    currentStatus: SkillStatus;
    targetDate?: Date;
    linkedIEPGoal?: string;
    notes: string;
    
    // Progress tracking  
    progressEntries: ProgressEntry[];
    createdAt: Date;
    lastUpdated: Date;
}

export interface ProgressEntry {
    id: string;
    date: Date;
    status: SkillStatus;
    notes?: string;
    celebratory?: boolean;           // Was this a win?
}

// ============================================================================
// DOMAIN METADATA
// ============================================================================

const DOMAIN_CONFIG: Record<SkillDomain, {
    label: string;
    emoji: string;
    color: string;
    bgColor: string;
    description: string;
    templateSkills: string[];
}> = {
    communication: {
        label: 'Communication',
        emoji: '💬',
        color: '#4B0082',
        bgColor: 'rgba(75, 0, 130, 0.1)',
        description: 'How they express needs, wants, and connections',
        templateSkills: [
            'Uses words to request',
            'Answers yes/no questions',
            'Initiates conversation',
            'Uses AAC device independently',
            'Makes eye contact when speaking',
            'Asks for help when needed',
        ],
    },
    daily_living: {
        label: 'Daily Living',
        emoji: '🏠',
        color: '#16A34A',
        bgColor: 'rgba(22, 163, 74, 0.1)',
        description: 'Self-care and independence skills',
        templateSkills: [
            'Dresses independently',
            'Brushes teeth with minimal support',
            'Uses utensils for eating',
            'Follows morning routine',
            'Washes hands independently',
            'Manages bathroom needs',
        ],
    },
    social: {
        label: 'Social',
        emoji: '🤝',
        color: '#EC4899',
        bgColor: 'rgba(236, 72, 153, 0.1)',
        description: 'Connection, play, and reciprocity',
        templateSkills: [
            'Takes turns in play',
            'Responds to greetings',
            'Shares toys with others',
            'Recognizes emotions in others',
            'Plays alongside peers',
            'Initiates play with others',
        ],
    },
    academic: {
        label: 'Academic',
        emoji: '📚',
        color: '#0EA5E9',
        bgColor: 'rgba(14, 165, 233, 0.1)',
        description: 'Learning, cognition, and school skills',
        templateSkills: [
            'Recognizes letters',
            'Counts to 20',
            'Writes first name',
            'Follows classroom instructions',
            'Stays on task for 10 minutes',
            'Completes simple puzzles',
        ],
    },
    motor: {
        label: 'Motor',
        emoji: '🏃',
        color: '#F59E0B',
        bgColor: 'rgba(245, 158, 11, 0.1)',
        description: 'Movement, coordination, and body awareness',
        templateSkills: [
            'Holds pencil with proper grip',
            'Cuts with scissors',
            'Catches a ball',
            'Rides a bike',
            'Buttons and zips clothing',
            'Navigates stairs independently',
        ],
    },
    regulation: {
        label: 'Regulation',
        emoji: '🌿',
        color: '#D4AF37',
        bgColor: 'rgba(212, 175, 55, 0.1)',
        description: 'Emotional and sensory self-management',
        templateSkills: [
            'Uses calming strategy when upset',
            'Identifies own emotions',
            'Accepts transitions with support',
            'Tolerates waiting',
            'Recovers from meltdown within 15 min',
            'Asks for sensory break',
        ],
    },
};

const STATUS_CONFIG: Record<SkillStatus, {
    label: string;
    emoji: string;
    color: string;
    percentage: number;
}> = {
    not_started: { label: 'Not Started', emoji: '○', color: '#9CA3AF', percentage: 0 },
    emerging: { label: 'Emerging', emoji: '◐', color: '#F59E0B', percentage: 25 },
    developing: { label: 'Developing', emoji: '◑', color: '#0EA5E9', percentage: 50 },
    consistent: { label: 'Consistent', emoji: '◕', color: '#16A34A', percentage: 75 },
    mastered: { label: 'Mastered', emoji: '●', color: '#D4AF37', percentage: 100 },
};

// ============================================================================
// COMPONENT
// ============================================================================

interface SkillTrackerProps {
    onBack: () => void;
}

export const SkillTracker = ({ onBack }: SkillTrackerProps) => {
    const { user } = useAuthStore();
    const [childName, setChildName] = useState('');
    const [skills, setSkills] = useState<Skill[]>([]);
    const [selectedDomain, setSelectedDomain] = useState<SkillDomain | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showProgressModal, setShowProgressModal] = useState<Skill | null>(null);
    const [celebrationSkill, setCelebrationSkill] = useState<Skill | null>(null);
    
    // Load profile
    useEffect(() => {
        if (user) {
            getProfile(user.uid).then(profile => {
                if (profile?.childName) setChildName(profile.childName);
            });
            
            // Load skills from localStorage for now
            const stored = localStorage.getItem(`giovanna-skills-${user.uid}`);
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    // Reconstruct dates
                    const restored = parsed.map((s: Skill) => ({
                        ...s,
                        createdAt: new Date(s.createdAt),
                        lastUpdated: new Date(s.lastUpdated),
                        targetDate: s.targetDate ? new Date(s.targetDate) : undefined,
                        progressEntries: s.progressEntries.map((p: ProgressEntry) => ({
                            ...p,
                            date: new Date(p.date),
                        })),
                    }));
                    setSkills(restored);
                } catch (e) {
                    console.error('Failed to load skills:', e);
                }
            }
        }
    }, [user]);
    
    // Save skills to localStorage
    useEffect(() => {
        if (user && skills.length > 0) {
            localStorage.setItem(`giovanna-skills-${user.uid}`, JSON.stringify(skills));
        }
    }, [skills, user]);
    
    // Calculate domain stats
    const getDomainStats = (domain: SkillDomain) => {
        const domainSkills = skills.filter(s => s.domain === domain);
        if (domainSkills.length === 0) return { total: 0, progress: 0, mastered: 0 };
        
        const total = domainSkills.length;
        const mastered = domainSkills.filter(s => s.currentStatus === 'mastered').length;
        const avgProgress = domainSkills.reduce((sum, s) => 
            sum + STATUS_CONFIG[s.currentStatus].percentage, 0
        ) / total;
        
        return { total, progress: Math.round(avgProgress), mastered };
    };
    
    // Add a new skill
    const addSkill = (skillData: { name: string; domain: SkillDomain; dignityFraming: string }) => {
        const newSkill: Skill = {
            id: `skill-${Date.now()}`,
            domain: skillData.domain,
            name: skillData.name,
            dignityFraming: skillData.dignityFraming,
            currentStatus: 'not_started',
            notes: '',
            progressEntries: [],
            createdAt: new Date(),
            lastUpdated: new Date(),
        };
        setSkills(prev => [...prev, newSkill]);
        setShowAddModal(false);
    };
    
    // Update skill progress
    const updateProgress = (skillId: string, newStatus: SkillStatus, notes?: string) => {
        setSkills(prev => prev.map(skill => {
            if (skill.id !== skillId) return skill;
            
            const isMastered = newStatus === 'mastered' && skill.currentStatus !== 'mastered';
            
            const updatedSkill = {
                ...skill,
                currentStatus: newStatus,
                lastUpdated: new Date(),
                progressEntries: [
                    ...skill.progressEntries,
                    {
                        id: `progress-${Date.now()}`,
                        date: new Date(),
                        status: newStatus,
                        notes,
                        celebratory: isMastered,
                    },
                ],
            };
            
            // Trigger celebration if mastered
            if (isMastered) {
                setCelebrationSkill(updatedSkill);
                setTimeout(() => setCelebrationSkill(null), 3000);
            }
            
            return updatedSkill;
        }));
        setShowProgressModal(null);
    };
    
    // Quick-add from template
    const quickAddFromTemplate = (domain: SkillDomain, skillName: string) => {
        addSkill({
            domain,
            name: skillName,
            dignityFraming: `${childName || 'Child'} is learning to ${skillName.toLowerCase()}`,
        });
    };
    
    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-500">Please sign in to track skills</p>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col h-full pt-6 pb-32 px-4 fade-in overflow-y-auto">
            {/* Celebration Animation */}
            {celebrationSkill && (
                <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
                    <div className="text-center animate-bounce">
                        <div className="text-6xl mb-4">🎉</div>
                        <div 
                            className="glass-panel p-6 rounded-3xl gold-leaf-border"
                            style={{ pointerEvents: 'auto' }}
                        >
                            <Sparkles className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
                            <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                                Skill Mastered!
                            </h2>
                            <p className="text-lg mt-2">{celebrationSkill.name}</p>
                            <p className="text-sm opacity-70 mt-1">
                                {childName || 'Your child'} has achieved this milestone!
                            </p>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Header */}
            <header className="flex items-center gap-3 mb-6">
                <button 
                    onClick={onBack}
                    className="p-2 rounded-full bg-white/40 hover:bg-white/60 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-[#4B0082]" />
                </button>
                <div className="flex-1">
                    <h1 
                        className="text-2xl font-bold"
                        style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                    >
                        Skill Tracker
                    </h1>
                    <p className="text-sm opacity-70">
                        {childName ? `Celebrating ${childName}'s growth` : 'Track developmental milestones'}
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="p-3 rounded-full bg-[#4B0082] text-white shadow-lg hover:scale-105 transition-transform"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </header>
            
            {/* Domain Overview or Detail View */}
            {!selectedDomain ? (
                <div className="space-y-3">
                    {(Object.keys(DOMAIN_CONFIG) as SkillDomain[]).map(domain => {
                        const config = DOMAIN_CONFIG[domain];
                        const stats = getDomainStats(domain);
                        
                        return (
                            <button
                                key={domain}
                                onClick={() => setSelectedDomain(domain)}
                                className="glass-panel p-4 rounded-2xl w-full text-left hover:scale-[1.01] active:scale-[0.99] transition-transform"
                            >
                                <div className="flex items-center gap-4">
                                    <div 
                                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                                        style={{ backgroundColor: config.bgColor }}
                                    >
                                        {config.emoji}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                                                {config.label}
                                            </h3>
                                            <ChevronRight className="w-5 h-5 opacity-30" />
                                        </div>
                                        <p className="text-xs opacity-60">{config.description}</p>
                                        
                                        {stats.total > 0 && (
                                            <div className="mt-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div 
                                                            className="h-full rounded-full transition-all"
                                                            style={{ 
                                                                width: `${stats.progress}%`,
                                                                backgroundColor: config.color 
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-bold" style={{ color: config.color }}>
                                                        {stats.progress}%
                                                    </span>
                                                </div>
                                                <p className="text-xs opacity-50 mt-1">
                                                    {stats.total} skill{stats.total !== 1 ? 's' : ''} • {stats.mastered} mastered
                                                </p>
                                            </div>
                                        )}
                                        
                                        {stats.total === 0 && (
                                            <p className="text-xs text-[#4B0082] mt-2">
                                                Tap to add skills →
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            ) : (
                <DomainDetail
                    domain={selectedDomain}
                    skills={skills.filter(s => s.domain === selectedDomain)}
                    config={DOMAIN_CONFIG[selectedDomain]}
                    onBack={() => setSelectedDomain(null)}
                    onAddSkill={(name) => quickAddFromTemplate(selectedDomain, name)}
                    onUpdateProgress={(skill) => setShowProgressModal(skill)}
                    childName={childName}
                />
            )}
            
            {/* Add Skill Modal */}
            {showAddModal && (
                <AddSkillModal
                    onClose={() => setShowAddModal(false)}
                    onAdd={addSkill}
                    childName={childName}
                />
            )}
            
            {/* Progress Update Modal */}
            {showProgressModal && (
                <ProgressModal
                    skill={showProgressModal}
                    onClose={() => setShowProgressModal(null)}
                    onUpdate={updateProgress}
                />
            )}
        </div>
    );
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const DomainDetail = ({
    domain: _domain,
    skills,
    config,
    onBack,
    onAddSkill,
    onUpdateProgress,
    childName,
}: {
    domain: SkillDomain;
    skills: Skill[];
    config: typeof DOMAIN_CONFIG[SkillDomain];
    onBack: () => void;
    onAddSkill: (name: string) => void;
    onUpdateProgress: (skill: Skill) => void;
    childName: string;
}) => {
    const unusedTemplates = config.templateSkills.filter(
        t => !skills.some(s => s.name === t)
    );
    
    return (
        <div className="space-y-4">
            {/* Back Button */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-sm text-[#4B0082] hover:opacity-70"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to domains
            </button>
            
            {/* Domain Header */}
            <div 
                className="glass-panel p-4 rounded-2xl"
                style={{ borderLeft: `4px solid ${config.color}` }}
            >
                <div className="flex items-center gap-3">
                    <span className="text-3xl">{config.emoji}</span>
                    <div>
                        <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                            {config.label}
                        </h2>
                        <p className="text-sm opacity-70">{config.description}</p>
                    </div>
                </div>
            </div>
            
            {/* Current Skills */}
            {skills.length > 0 && (
                <div>
                    <h3 className="text-sm font-bold mb-2 opacity-70">
                        {childName ? `${childName}'s Skills` : 'Active Skills'}
                    </h3>
                    <div className="space-y-2">
                        {skills.map(skill => (
                            <SkillCard 
                                key={skill.id} 
                                skill={skill}
                                onUpdate={() => onUpdateProgress(skill)}
                            />
                        ))}
                    </div>
                </div>
            )}
            
            {/* Quick Add Templates */}
            {unusedTemplates.length > 0 && (
                <div>
                    <h3 className="text-sm font-bold mb-2 opacity-70">
                        Quick Add Suggestions
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {unusedTemplates.map(template => (
                            <button
                                key={template}
                                onClick={() => onAddSkill(template)}
                                className="px-3 py-2 rounded-xl text-sm bg-white/40 border border-dashed border-gray-300 hover:bg-white/60 transition-colors flex items-center gap-1"
                            >
                                <Plus className="w-3 h-3" />
                                {template}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Empty State */}
            {skills.length === 0 && unusedTemplates.length === 0 && (
                <div className="text-center py-8 opacity-60">
                    <p>No skills added yet</p>
                </div>
            )}
        </div>
    );
};

const SkillCard = ({
    skill,
    onUpdate,
}: {
    skill: Skill;
    onUpdate: () => void;
}) => {
    const statusConfig = STATUS_CONFIG[skill.currentStatus];
    
    return (
        <button
            onClick={onUpdate}
            className="glass-panel p-4 rounded-xl w-full text-left hover:bg-white/50 transition-colors"
        >
            <div className="flex items-center gap-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        {skill.currentStatus === 'mastered' && (
                            <Star className="w-4 h-4 text-[#D4AF37]" />
                        )}
                        <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                            {skill.name}
                        </h4>
                    </div>
                    <p className="text-xs opacity-60 mt-1">{skill.dignityFraming}</p>
                </div>
                <div className="text-right">
                    <div 
                        className="text-xs font-bold px-2 py-1 rounded-full"
                        style={{ 
                            backgroundColor: `${statusConfig.color}20`,
                            color: statusConfig.color,
                        }}
                    >
                        {statusConfig.emoji} {statusConfig.label}
                    </div>
                    <div className="mt-2 w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                            className="h-full rounded-full transition-all"
                            style={{ 
                                width: `${statusConfig.percentage}%`,
                                backgroundColor: statusConfig.color,
                            }}
                        />
                    </div>
                </div>
            </div>
        </button>
    );
};

const AddSkillModal = ({
    onClose,
    onAdd,
    childName,
}: {
    onClose: () => void;
    onAdd: (data: { name: string; domain: SkillDomain; dignityFraming: string }) => void;
    childName: string;
}) => {
    const [name, setName] = useState('');
    const [domain, setDomain] = useState<SkillDomain>('communication');
    const [dignityFraming, setDignityFraming] = useState('');
    
    const handleSubmit = () => {
        if (!name.trim()) return;
        onAdd({
            name: name.trim(),
            domain,
            dignityFraming: dignityFraming.trim() || `${childName || 'Child'} is learning to ${name.toLowerCase()}`,
        });
    };
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
            <div className="glass-panel p-6 rounded-3xl w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                        Add New Skill
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-white/50">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="space-y-4">
                    {/* Domain Selector */}
                    <div>
                        <label className="text-sm font-bold opacity-70 mb-2 block">Domain</label>
                        <div className="grid grid-cols-3 gap-2">
                            {(Object.keys(DOMAIN_CONFIG) as SkillDomain[]).map(d => (
                                <button
                                    key={d}
                                    onClick={() => setDomain(d)}
                                    className={`p-2 rounded-xl text-center transition-all ${
                                        domain === d 
                                            ? 'ring-2 ring-[#4B0082] bg-white/60' 
                                            : 'bg-white/30 hover:bg-white/50'
                                    }`}
                                >
                                    <span className="text-xl">{DOMAIN_CONFIG[d].emoji}</span>
                                    <p className="text-xs mt-1">{DOMAIN_CONFIG[d].label}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {/* Skill Name */}
                    <div>
                        <label className="text-sm font-bold opacity-70 mb-2 block">Skill Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Uses words to request items"
                            className="w-full p-3 rounded-xl bg-white/50 border border-white/50 focus:ring-2 focus:ring-[#4B0082] outline-none"
                        />
                    </div>
                    
                    {/* Dignity Framing (Optional) */}
                    <div>
                        <label className="text-sm font-bold opacity-70 mb-2 block">
                            Strength-Based Description <span className="font-normal">(optional)</span>
                        </label>
                        <input
                            type="text"
                            value={dignityFraming}
                            onChange={(e) => setDignityFraming(e.target.value)}
                            placeholder={`${childName || 'Child'} is learning to...`}
                            className="w-full p-3 rounded-xl bg-white/50 border border-white/50 focus:ring-2 focus:ring-[#4B0082] outline-none"
                        />
                    </div>
                    
                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        disabled={!name.trim()}
                        className="w-full py-3 rounded-xl bg-[#4B0082] text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                    >
                        Add Skill
                    </button>
                </div>
            </div>
        </div>
    );
};

const ProgressModal = ({
    skill,
    onClose,
    onUpdate,
}: {
    skill: Skill;
    onClose: () => void;
    onUpdate: (skillId: string, newStatus: SkillStatus, notes?: string) => void;
}) => {
    const [selectedStatus, setSelectedStatus] = useState<SkillStatus>(skill.currentStatus);
    const [notes, setNotes] = useState('');
    
    const handleSubmit = () => {
        onUpdate(skill.id, selectedStatus, notes.trim() || undefined);
    };
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
            <div className="glass-panel p-6 rounded-3xl w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                            Update Progress
                        </h2>
                        <p className="text-sm opacity-70">{skill.name}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-white/50">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="space-y-4">
                    {/* Status Selector */}
                    <div className="space-y-2">
                        {(Object.keys(STATUS_CONFIG) as SkillStatus[]).map(status => {
                            const config = STATUS_CONFIG[status];
                            const isSelected = selectedStatus === status;
                            const isCurrent = skill.currentStatus === status;
                            
                            return (
                                <button
                                    key={status}
                                    onClick={() => setSelectedStatus(status)}
                                    className={`w-full p-3 rounded-xl text-left transition-all flex items-center gap-3 ${
                                        isSelected
                                            ? 'ring-2 ring-[#4B0082] bg-white/60'
                                            : 'bg-white/30 hover:bg-white/50'
                                    }`}
                                >
                                    <span 
                                        className="text-2xl"
                                        style={{ color: config.color }}
                                    >
                                        {config.emoji}
                                    </span>
                                    <div className="flex-1">
                                        <p className="font-medium">{config.label}</p>
                                        <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1">
                                            <div 
                                                className="h-full rounded-full"
                                                style={{ 
                                                    width: `${config.percentage}%`,
                                                    backgroundColor: config.color,
                                                }}
                                            />
                                        </div>
                                    </div>
                                    {isCurrent && (
                                        <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                                            Current
                                        </span>
                                    )}
                                    {isSelected && !isCurrent && (
                                        <Check className="w-5 h-5 text-[#4B0082]" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                    
                    {/* Notes */}
                    <div>
                        <label className="text-sm font-bold opacity-70 mb-2 block">Notes (optional)</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="What did you observe? Any context to remember?"
                            className="w-full p-3 rounded-xl bg-white/50 border border-white/50 focus:ring-2 focus:ring-[#4B0082] outline-none resize-none"
                            rows={3}
                        />
                    </div>
                    
                    {/* Submit */}
                    <div className="flex gap-2">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl bg-gray-200 font-bold hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="flex-1 py-3 rounded-xl bg-[#4B0082] text-white font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                        >
                            {selectedStatus === 'mastered' && <Star className="w-4 h-4" />}
                            Update
                        </button>
                    </div>
                    
                    {/* Progress History */}
                    {skill.progressEntries.length > 0 && (
                        <div className="pt-4 border-t border-gray-200">
                            <p className="text-xs font-bold opacity-50 mb-2">PROGRESS HISTORY</p>
                            <div className="space-y-1 max-h-24 overflow-y-auto">
                                {skill.progressEntries.slice().reverse().slice(0, 5).map(entry => (
                                    <div key={entry.id} className="flex items-center gap-2 text-xs">
                                        <span style={{ color: STATUS_CONFIG[entry.status].color }}>
                                            {STATUS_CONFIG[entry.status].emoji}
                                        </span>
                                        <span className="opacity-50">
                                            {entry.date.toLocaleDateString()}
                                        </span>
                                        <span>{STATUS_CONFIG[entry.status].label}</span>
                                        {entry.celebratory && <span>🎉</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SkillTracker;
