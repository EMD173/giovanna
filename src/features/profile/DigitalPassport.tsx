/**
 * DIGITAL PASSPORT: Sovereign Identity for Care Transitions
 * 
 * Portable, strength-based documentation designed for:
 * - Social workers during placement
 * - Adopting/foster families during transition
 * - Medical providers during handoffs
 * 
 * TONE: All "behaviors" are reframed as Essential Regulation.
 * DESIGN: Liquid Glass with Sacred Summary view.
 */

import { useState, useEffect } from 'react';
import {
    Shield,
    Heart,
    Brain,
    Sparkles,
    Plus,
    Save,
    Share2,
    Download,
    Eye,
    Lock,
    ChevronDown,
    ChevronUp,
    Apple,
    Loader2,
    Star,
    Home,
    School,
    AlertCircle
} from 'lucide-react';
import { useAuthStore } from '../../core/stores/useAuthStore';
import { getProfile, updateProfile } from '../../core/firebase/profiles';
import type {
    SovereignPassport,
    BiologicalPassport,
    SensoryPassport,
    ContextualAbilities,
    StimmingPattern,
    UserProfile
} from '../../core/stores/profileTypes';

interface AccordionProps {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
    accentColor: string;
    children: React.ReactNode;
}

const Accordion = ({ title, subtitle, icon, isOpen, onToggle, accentColor, children }: AccordionProps) => (
    <div className="glass-panel rounded-[24px] mb-4 overflow-hidden">
        <button
            onClick={onToggle}
            className="w-full p-5 flex items-center justify-between text-left"
        >
            <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl" style={{ backgroundColor: `${accentColor}20` }}>
                    {icon}
                </div>
                <div>
                    <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
                    <p className="text-xs opacity-60">{subtitle}</p>
                </div>
            </div>
            {isOpen ? (
                <ChevronUp className="w-5 h-5 opacity-40" />
            ) : (
                <ChevronDown className="w-5 h-5 opacity-40" />
            )}
        </button>

        {isOpen && (
            <div className="px-5 pb-5 pt-2 border-t border-white/20 animate-slide-down">
                {children}
            </div>
        )}
    </div>
);

// Empty state creators
const emptyBiological: BiologicalPassport = {
    allergies: [],
    foodPreferences: [],
    textures: [],
};

const emptySensory: SensoryPassport = {
    stimmingPatterns: [],
    favoriteToys: [],
    regulationTriggers: [],
    safeSpaces: [],
};

const emptyAbilities: ContextualAbilities = {
    schoolExpectations: '',
    homeExpectations: '',
    reasonableAccommodations: '',
    strengthsInContext: [],
    communicationPreferences: '',
};

export const DigitalPassport = () => {
    const { user } = useAuthStore();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [openSection, setOpenSection] = useState<'bio' | 'sensory' | 'context' | 'sacred' | null>('bio');
    const [viewMode, setViewMode] = useState<'edit' | 'sacred'>('edit');

    // Form state
    const [biological, setBiological] = useState<BiologicalPassport>(emptyBiological);
    const [sensory, setSensory] = useState<SensoryPassport>(emptySensory);
    const [abilities, setAbilities] = useState<ContextualAbilities>(emptyAbilities);
    const [sacredSummary, setSacredSummary] = useState('');
    const [shareLevel, setShareLevel] = useState<'CareTeam' | 'CaseManager' | 'Anyone' | 'None'>('CareTeam');

    useEffect(() => {
        if (!user) return;

        const loadProfile = async () => {
            try {
                const p = await getProfile(user.uid);
                setProfile(p);

                if (p?.passport) {
                    setBiological(p.passport.biological || emptyBiological);
                    setSensory(p.passport.sensory || emptySensory);
                    setAbilities(p.passport.contextualAbilities || emptyAbilities);
                    setSacredSummary(p.passport.sacredSummary || '');
                    setShareLevel(p.passport.shareableWith || 'CareTeam');
                }
            } catch (error) {
                console.error('Failed to load profile:', error);
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [user]);

    const handleSave = async () => {
        if (!user || !profile) return;
        setSaving(true);

        try {
            const passport: SovereignPassport = {
                id: profile.passport?.id || `passport-${Date.now()}`,
                childId: profile.id,
                childName: profile.childName,
                biological,
                sensory,
                contextualAbilities: abilities,
                sacredSummary,
                shareableWith: shareLevel,
                lastUpdated: new Date(),
                createdBy: user.uid,
            };

            await updateProfile(user.uid, { passport });
        } catch (error) {
            console.error('Failed to save passport:', error);
        } finally {
            setSaving(false);
        }
    };

    // Stim pattern helpers
    const addStimmingPattern = () => {
        setSensory(prev => ({
            ...prev,
            stimmingPatterns: [...prev.stimmingPatterns, {
                behavior: '',
                dignityFraming: '',
                whenObserved: '',
                supportStrategy: '',
            }],
        }));
    };

    const updateStimmingPattern = (index: number, updates: Partial<StimmingPattern>) => {
        setSensory(prev => ({
            ...prev,
            stimmingPatterns: prev.stimmingPatterns.map((p, i) =>
                i === index ? { ...p, ...updates } : p
            ),
        }));
    };

    // Comfort object helpers
    const addComfortObject = () => {
        setSensory(prev => ({
            ...prev,
            favoriteToys: [...prev.favoriteToys, {
                name: '',
                type: '',
                importance: 'Important',
                neverSeparate: false,
            }],
        }));
    };

    // Trigger helpers
    const addTrigger = () => {
        setSensory(prev => ({
            ...prev,
            regulationTriggers: [...prev.regulationTriggers, {
                trigger: '',
                dignityFraming: '',
                intensity: 'Medium',
                effectiveResponse: '',
            }],
        }));
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'rgb(var(--glass-base))' }}>
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-[#D4AF37] mx-auto mb-4" />
                    <p className="text-sm opacity-70">Loading passport...</p>
                </div>
            </div>
        );
    }

    // SACRED SUMMARY VIEW
    if (viewMode === 'sacred') {
        return (
            <div className="min-h-screen pb-32 px-4 pt-6" style={{ backgroundColor: 'rgb(var(--glass-base))' }}>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => setViewMode('edit')}
                        className="text-sm font-semibold text-[#4B0082]"
                    >
                        ← Edit Passport
                    </button>
                    <div className="flex gap-2">
                        <button className="p-2 rounded-xl bg-white/30">
                            <Share2 className="w-5 h-5 text-[#4B0082]" />
                        </button>
                        <button className="p-2 rounded-xl bg-white/30">
                            <Download className="w-5 h-5 text-[#4B0082]" />
                        </button>
                    </div>
                </div>

                {/* Sacred Header */}
                <div className="glass-panel gold-leaf-border p-6 rounded-[32px] mb-6 text-center">
                    <Shield className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
                    <h1
                        className="text-3xl mb-2"
                        style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                    >
                        {profile?.childName}'s Passport
                    </h1>
                    <p className="text-sm opacity-70">
                        A sacred summary of who they are and how they communicate
                    </p>
                </div>

                {/* Sacred Summary */}
                {sacredSummary && (
                    <div className="glass-panel p-5 rounded-[24px] mb-6 border-l-4 border-[#D4AF37]">
                        <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                            <Heart className="w-4 h-4 text-[#D4AF37]" />
                            In Their Parent's Words
                        </h3>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-primary)' }}>
                            {sacredSummary}
                        </p>
                    </div>
                )}

                {/* Essential Regulation (Stims) */}
                {sensory.stimmingPatterns.length > 0 && (
                    <div className="glass-panel p-5 rounded-[24px] mb-6">
                        <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                            <Sparkles className="w-4 h-4 text-[#4B0082]" />
                            Essential Regulation Behaviors
                        </h3>
                        <div className="space-y-3">
                            {sensory.stimmingPatterns.map((pattern, i) => (
                                <div key={i} className="bg-white/30 rounded-xl p-3">
                                    <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                                        {pattern.behavior}
                                    </p>
                                    <p className="text-sm text-[#D4AF37] italic">{pattern.dignityFraming}</p>
                                    <p className="text-xs opacity-60 mt-1">
                                        When: {pattern.whenObserved} • Support: {pattern.supportStrategy}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Comfort Objects */}
                {sensory.favoriteToys.length > 0 && (
                    <div className="glass-panel p-5 rounded-[24px] mb-6">
                        <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                            <Star className="w-4 h-4 text-[#D4AF37]" />
                            Essential Comfort Objects
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {sensory.favoriteToys.map((obj, i) => (
                                <span
                                    key={i}
                                    className={`px-3 py-2 rounded-xl text-sm ${obj.neverSeparate
                                        ? 'bg-[#D4AF37]/20 text-[#D4AF37] font-bold'
                                        : 'bg-white/30'
                                        }`}
                                    style={{ color: obj.neverSeparate ? undefined : 'var(--text-primary)' }}
                                >
                                    {obj.name} {obj.neverSeparate && '❤️'}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Triggers */}
                {sensory.regulationTriggers.length > 0 && (
                    <div className="glass-panel p-5 rounded-[24px] mb-6">
                        <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                            <AlertCircle className="w-4 h-4 text-[#4B0082]" />
                            Regulation Triggers
                        </h3>
                        <div className="space-y-3">
                            {sensory.regulationTriggers.map((trigger, i) => (
                                <div key={i} className="bg-white/30 rounded-xl p-3">
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                                            {trigger.trigger}
                                        </p>
                                        <span className={`text-xs px-2 py-1 rounded-lg ${trigger.intensity === 'High' ? 'bg-red-100 text-red-700' :
                                            trigger.intensity === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-green-100 text-green-700'
                                            }`}>
                                            {trigger.intensity}
                                        </span>
                                    </div>
                                    <p className="text-sm text-[#D4AF37] italic">{trigger.dignityFraming}</p>
                                    <p className="text-xs opacity-60 mt-1">Effective response: {trigger.effectiveResponse}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Context */}
                <div className="glass-panel p-5 rounded-[24px] mb-6">
                    <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        <Brain className="w-4 h-4 text-[#4B0082]" />
                        Contextual Abilities
                    </h3>
                    <div className="space-y-4">
                        {abilities.homeExpectations && (
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider opacity-60 flex items-center gap-1">
                                    <Home className="w-3 h-3" /> At Home
                                </p>
                                <p className="text-sm mt-1" style={{ color: 'var(--text-primary)' }}>
                                    {abilities.homeExpectations}
                                </p>
                            </div>
                        )}
                        {abilities.schoolExpectations && (
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider opacity-60 flex items-center gap-1">
                                    <School className="w-3 h-3" /> At School
                                </p>
                                <p className="text-sm mt-1" style={{ color: 'var(--text-primary)' }}>
                                    {abilities.schoolExpectations}
                                </p>
                            </div>
                        )}
                        {abilities.reasonableAccommodations && (
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider opacity-60">Accommodations Needed</p>
                                <p className="text-sm mt-1" style={{ color: 'var(--text-primary)' }}>
                                    {abilities.reasonableAccommodations}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <p className="text-xs text-center opacity-50 flex items-center justify-center gap-2">
                    <Lock className="w-3 h-3" />
                    This passport is sovereign. The parent controls all access.
                </p>
            </div>
        );
    }

    // EDIT MODE
    return (
        <div className="min-h-screen pb-32 px-4 pt-6" style={{ backgroundColor: 'rgb(var(--glass-base))' }}>
            {/* Header */}
            <header className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-bold tracking-widest text-[#D4AF37] uppercase opacity-80">
                            Sovereign Identity
                        </h2>
                        <h1
                            className="text-3xl mt-1"
                            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                        >
                            Digital Passport
                        </h1>
                    </div>
                    <button
                        onClick={() => setViewMode('sacred')}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-semibold text-sm"
                    >
                        <Eye className="w-4 h-4" />
                        Preview
                    </button>
                </div>
                <p className="text-sm mt-2 opacity-70">
                    Create a portable, strength-based summary for care transitions.
                </p>
            </header>

            {/* BIOLOGICAL SECTION */}
            <Accordion
                title="Physical Needs"
                subtitle="Allergies, food preferences, textures"
                icon={<Apple className="w-5 h-5 text-green-600" />}
                isOpen={openSection === 'bio'}
                onToggle={() => setOpenSection(openSection === 'bio' ? null : 'bio')}
                accentColor="#22c55e"
            >
                <div className="space-y-4 mt-2">
                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2 block">
                            Allergies
                        </label>
                        <textarea
                            value={biological.allergies.join('\n')}
                            onChange={(e) => setBiological(prev => ({ ...prev, allergies: e.target.value.split('\n').filter(Boolean) }))}
                            placeholder="One allergy per line..."
                            className="w-full p-3 rounded-xl bg-white/40 border border-white/60 text-sm resize-none focus:outline-none"
                            style={{ color: 'var(--text-primary)' }}
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2 block">
                            Food Preferences
                        </label>
                        <textarea
                            value={biological.foodPreferences.join('\n')}
                            onChange={(e) => setBiological(prev => ({ ...prev, foodPreferences: e.target.value.split('\n').filter(Boolean) }))}
                            placeholder="Foods they love, foods they avoid..."
                            className="w-full p-3 rounded-xl bg-white/40 border border-white/60 text-sm resize-none focus:outline-none"
                            style={{ color: 'var(--text-primary)' }}
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2 block">
                            Texture Sensitivities
                        </label>
                        <textarea
                            value={biological.textures.join('\n')}
                            onChange={(e) => setBiological(prev => ({ ...prev, textures: e.target.value.split('\n').filter(Boolean) }))}
                            placeholder="Fabrics, foods, surfaces they avoid..."
                            className="w-full p-3 rounded-xl bg-white/40 border border-white/60 text-sm resize-none focus:outline-none"
                            style={{ color: 'var(--text-primary)' }}
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2 block">
                            Sleep Routine
                        </label>
                        <input
                            type="text"
                            value={biological.sleepRoutine || ''}
                            onChange={(e) => setBiological(prev => ({ ...prev, sleepRoutine: e.target.value }))}
                            placeholder="Bedtime rituals, sleep aids, wake patterns..."
                            className="w-full p-3 rounded-xl bg-white/40 border border-white/60 text-sm focus:outline-none"
                            style={{ color: 'var(--text-primary)' }}
                        />
                    </div>
                </div>
            </Accordion>

            {/* SENSORY SECTION */}
            <Accordion
                title="Essential Regulation"
                subtitle="Stims, comfort objects, triggers"
                icon={<Sparkles className="w-5 h-5 text-[#4B0082]" />}
                isOpen={openSection === 'sensory'}
                onToggle={() => setOpenSection(openSection === 'sensory' ? null : 'sensory')}
                accentColor="#4B0082"
            >
                <div className="space-y-4 mt-2">
                    {/* Stimming Patterns */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-xs font-bold uppercase tracking-wider opacity-60">
                                Essential Regulation Behaviors
                            </label>
                            <button
                                onClick={addStimmingPattern}
                                className="flex items-center gap-1 text-xs font-semibold text-[#4B0082]"
                            >
                                <Plus className="w-3 h-3" />
                                Add
                            </button>
                        </div>
                        <p className="text-xs opacity-60 mb-3 italic">
                            Reframe "stims" as Essential Regulation — these behaviors help your child stay regulated.
                        </p>

                        {sensory.stimmingPatterns.map((pattern, i) => (
                            <div key={i} className="bg-white/30 rounded-xl p-3 mb-3 space-y-2">
                                <input
                                    type="text"
                                    value={pattern.behavior}
                                    onChange={(e) => updateStimmingPattern(i, { behavior: e.target.value })}
                                    placeholder="What they do (e.g., rocks, flaps hands)"
                                    className="w-full p-2 rounded-lg bg-white/40 border border-white/60 text-sm focus:outline-none"
                                    style={{ color: 'var(--text-primary)' }}
                                />
                                <input
                                    type="text"
                                    value={pattern.dignityFraming}
                                    onChange={(e) => updateStimmingPattern(i, { dignityFraming: e.target.value })}
                                    placeholder="Strength-based framing (e.g., 'Self-soothes through movement')"
                                    className="w-full p-2 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-sm focus:outline-none"
                                    style={{ color: 'var(--text-primary)' }}
                                />
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={pattern.whenObserved}
                                        onChange={(e) => updateStimmingPattern(i, { whenObserved: e.target.value })}
                                        placeholder="When observed"
                                        className="flex-1 p-2 rounded-lg bg-white/40 border border-white/60 text-sm focus:outline-none"
                                        style={{ color: 'var(--text-primary)' }}
                                    />
                                    <input
                                        type="text"
                                        value={pattern.supportStrategy}
                                        onChange={(e) => updateStimmingPattern(i, { supportStrategy: e.target.value })}
                                        placeholder="How to support"
                                        className="flex-1 p-2 rounded-lg bg-white/40 border border-white/60 text-sm focus:outline-none"
                                        style={{ color: 'var(--text-primary)' }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Comfort Objects */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-xs font-bold uppercase tracking-wider opacity-60">
                                Comfort Objects
                            </label>
                            <button
                                onClick={addComfortObject}
                                className="flex items-center gap-1 text-xs font-semibold text-[#4B0082]"
                            >
                                <Plus className="w-3 h-3" />
                                Add
                            </button>
                        </div>

                        {sensory.favoriteToys.map((obj, i) => (
                            <div key={i} className="bg-white/30 rounded-xl p-3 mb-2 flex items-center gap-2">
                                <input
                                    type="text"
                                    value={obj.name}
                                    onChange={(e) => {
                                        const updated = [...sensory.favoriteToys];
                                        updated[i] = { ...updated[i], name: e.target.value };
                                        setSensory(prev => ({ ...prev, favoriteToys: updated }));
                                    }}
                                    placeholder="Name"
                                    className="flex-1 p-2 rounded-lg bg-white/40 border border-white/60 text-sm focus:outline-none"
                                    style={{ color: 'var(--text-primary)' }}
                                />
                                <label className="flex items-center gap-1 text-xs">
                                    <input
                                        type="checkbox"
                                        checked={obj.neverSeparate}
                                        onChange={(e) => {
                                            const updated = [...sensory.favoriteToys];
                                            updated[i] = { ...updated[i], neverSeparate: e.target.checked };
                                            setSensory(prev => ({ ...prev, favoriteToys: updated }));
                                        }}
                                        className="rounded"
                                    />
                                    Essential
                                </label>
                            </div>
                        ))}
                    </div>

                    {/* Triggers */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-xs font-bold uppercase tracking-wider opacity-60">
                                Regulation Triggers
                            </label>
                            <button
                                onClick={addTrigger}
                                className="flex items-center gap-1 text-xs font-semibold text-[#4B0082]"
                            >
                                <Plus className="w-3 h-3" />
                                Add
                            </button>
                        </div>

                        {sensory.regulationTriggers.map((trigger, i) => (
                            <div key={i} className="bg-white/30 rounded-xl p-3 mb-2 space-y-2">
                                <input
                                    type="text"
                                    value={trigger.trigger}
                                    onChange={(e) => {
                                        const updated = [...sensory.regulationTriggers];
                                        updated[i] = { ...updated[i], trigger: e.target.value };
                                        setSensory(prev => ({ ...prev, regulationTriggers: updated }));
                                    }}
                                    placeholder="What triggers dysregulation"
                                    className="w-full p-2 rounded-lg bg-white/40 border border-white/60 text-sm focus:outline-none"
                                    style={{ color: 'var(--text-primary)' }}
                                />
                                <input
                                    type="text"
                                    value={trigger.dignityFraming}
                                    onChange={(e) => {
                                        const updated = [...sensory.regulationTriggers];
                                        updated[i] = { ...updated[i], dignityFraming: e.target.value };
                                        setSensory(prev => ({ ...prev, regulationTriggers: updated }));
                                    }}
                                    placeholder="Strength-based reframe"
                                    className="w-full p-2 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-sm focus:outline-none"
                                    style={{ color: 'var(--text-primary)' }}
                                />
                                <input
                                    type="text"
                                    value={trigger.effectiveResponse}
                                    onChange={(e) => {
                                        const updated = [...sensory.regulationTriggers];
                                        updated[i] = { ...updated[i], effectiveResponse: e.target.value };
                                        setSensory(prev => ({ ...prev, regulationTriggers: updated }));
                                    }}
                                    placeholder="What helps when this happens"
                                    className="w-full p-2 rounded-lg bg-white/40 border border-white/60 text-sm focus:outline-none"
                                    style={{ color: 'var(--text-primary)' }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Safe Spaces */}
                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2 block">
                            Safe Spaces
                        </label>
                        <textarea
                            value={sensory.safeSpaces.join('\n')}
                            onChange={(e) => setSensory(prev => ({ ...prev, safeSpaces: e.target.value.split('\n').filter(Boolean) }))}
                            placeholder="Places where they feel calm..."
                            className="w-full p-3 rounded-xl bg-white/40 border border-white/60 text-sm resize-none focus:outline-none"
                            style={{ color: 'var(--text-primary)' }}
                            rows={3}
                        />
                    </div>
                </div>
            </Accordion>

            {/* CONTEXTUAL ABILITIES */}
            <Accordion
                title="Contextual Abilities"
                subtitle="What they can do in different settings"
                icon={<Brain className="w-5 h-5 text-[#D4AF37]" />}
                isOpen={openSection === 'context'}
                onToggle={() => setOpenSection(openSection === 'context' ? null : 'context')}
                accentColor="#D4AF37"
            >
                <div className="space-y-4 mt-2">
                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2 block flex items-center gap-1">
                            <Home className="w-3 h-3" /> At Home
                        </label>
                        <textarea
                            value={abilities.homeExpectations}
                            onChange={(e) => setAbilities(prev => ({ ...prev, homeExpectations: e.target.value }))}
                            placeholder="What they can do in their home environment..."
                            className="w-full p-3 rounded-xl bg-white/40 border border-white/60 text-sm resize-none focus:outline-none"
                            style={{ color: 'var(--text-primary)' }}
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2 block flex items-center gap-1">
                            <School className="w-3 h-3" /> At School
                        </label>
                        <textarea
                            value={abilities.schoolExpectations}
                            onChange={(e) => setAbilities(prev => ({ ...prev, schoolExpectations: e.target.value }))}
                            placeholder="What the school expects (may differ from home)..."
                            className="w-full p-3 rounded-xl bg-white/40 border border-white/60 text-sm resize-none focus:outline-none"
                            style={{ color: 'var(--text-primary)' }}
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2 block">
                            Reasonable Accommodations
                        </label>
                        <textarea
                            value={abilities.reasonableAccommodations}
                            onChange={(e) => setAbilities(prev => ({ ...prev, reasonableAccommodations: e.target.value }))}
                            placeholder="What they need to succeed in any environment..."
                            className="w-full p-3 rounded-xl bg-white/40 border border-white/60 text-sm resize-none focus:outline-none"
                            style={{ color: 'var(--text-primary)' }}
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2 block">
                            Communication Style
                        </label>
                        <input
                            type="text"
                            value={abilities.communicationPreferences}
                            onChange={(e) => setAbilities(prev => ({ ...prev, communicationPreferences: e.target.value }))}
                            placeholder="How they express needs (verbal, AAC, gestures, etc.)"
                            className="w-full p-3 rounded-xl bg-white/40 border border-white/60 text-sm focus:outline-none"
                            style={{ color: 'var(--text-primary)' }}
                        />
                    </div>
                </div>
            </Accordion>

            {/* SACRED SUMMARY */}
            <Accordion
                title="Sacred Summary"
                subtitle="Your words about your child"
                icon={<Heart className="w-5 h-5 text-red-500" />}
                isOpen={openSection === 'sacred'}
                onToggle={() => setOpenSection(openSection === 'sacred' ? null : 'sacred')}
                accentColor="#ef4444"
            >
                <div className="space-y-4 mt-2">
                    <p className="text-xs opacity-60 italic">
                        This is your chance to tell their story in your own words.
                        What would you want a new caregiver to know about who they really are?
                    </p>
                    <textarea
                        value={sacredSummary}
                        onChange={(e) => setSacredSummary(e.target.value)}
                        placeholder="Tell us about your child. Their joys. Their struggles. What makes them magical..."
                        className="w-full p-4 rounded-xl bg-white/40 border border-white/60 text-sm resize-none focus:outline-none"
                        style={{ color: 'var(--text-primary)' }}
                        rows={8}
                    />
                </div>
            </Accordion>

            {/* SAVE BUTTON */}
            <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-4 rounded-full font-bold bg-gradient-to-r from-[#4B0082] to-[#D4AF37] text-white flex items-center justify-center gap-2 hover:shadow-xl transition-all disabled:opacity-50"
            >
                {saving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <Save className="w-5 h-5" />
                )}
                {saving ? 'Saving Passport...' : 'Save Passport'}
            </button>

            <p className="text-xs opacity-50 text-center mt-4 flex items-center justify-center gap-2">
                <Shield className="w-3 h-3" />
                This passport is sovereign. You control all access.
            </p>

            <style>{`
        .animate-slide-down {
          animation: slideDown 0.3s ease-out forwards;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};

export default DigitalPassport;
