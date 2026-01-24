/**
 * RECOGNITION RITE: The Sacred Onboarding
 * 
 * Multi-step Liquid Glass wizard that gathers:
 * 1. Names - Parent's Title and Child's Name
 * 2. Biological Context - Sensory profile and rhythms
 * 3. Systemic Context - School, IEP, family lineage
 * 
 * Design: Playfair Display headers, glass panels, gentle transitions
 */

import { useState } from 'react';
import {
    ChevronRight,
    ChevronLeft,
    Sparkles,
    Heart,
    Brain,
    School,
    Users,
    Check,
    Loader2
} from 'lucide-react';
import { useAuthStore } from '../../core/stores/useAuthStore';
import {
    createProfile,
    updateBiologicalContext,
    updateSystemicContext
} from '../../core/firebase/profiles';
import type { PhysicalRhythm } from '../../core/stores/profileTypes';

interface RecognitionRiteProps {
    onComplete: () => void;
}

const PHYSICAL_RHYTHMS: PhysicalRhythm[] = [
    'Morning Regulator',
    'Afternoon Crash',
    'Evening Wind-down',
    'Night Owl',
    'Early Riser',
    'Irregular Sleep',
];

const SENSORY_SEEKERS = [
    'Movement', 'Deep Pressure', 'Spinning', 'Loud Sounds',
    'Bright Lights', 'Strong Flavors', 'Textures'
];

const SENSORY_AVOIDERS = [
    'Loud Sounds', 'Bright Lights', 'Certain Textures',
    'Crowds', 'Strong Smells', 'Touch', 'Tags/Seams'
];

const IEP_SERVICES = [
    'Speech Therapy', 'Occupational Therapy', 'Physical Therapy',
    'Behavioral Support', 'Social Skills', 'Academic Support'
];

const COMMON_DIAGNOSES = [
    'Autism Spectrum', 'ADHD', 'Sensory Processing', 'Anxiety',
    'Learning Disability', 'Speech/Language Delay', 'Other'
];

const FBA_TRIGGERS = [
    'Transitions', 'Loud Environments', 'Unexpected Changes',
    'Demand Overload', 'Social Overwhelm', 'Sensory Overload',
    'Hunger/Fatigue', 'Waiting', 'Unfamiliar Situations'
];

export const RecognitionRite = ({ onComplete }: RecognitionRiteProps) => {
    const { user } = useAuthStore();
    const [step, setStep] = useState(1);
    const [saving, setSaving] = useState(false);

    // Step 1: Names
    const [parentTitle, setParentTitle] = useState('');
    const [childName, setChildName] = useState('');
    const [childAge, setChildAge] = useState<number | undefined>();

    // Step 2: Biological Context + Vault Data
    const [seekers, setSeekers] = useState<string[]>([]);
    const [avoiders, setAvoiders] = useState<string[]>([]);
    const [customSeeker, setCustomSeeker] = useState('');
    const [customAvoider, setCustomAvoider] = useState('');
    const [rhythms, setRhythms] = useState<PhysicalRhythm[]>([]);
    const [strategies, setStrategies] = useState('');
    const [diagnoses, setDiagnoses] = useState<string[]>([]);
    const [fbaTriggers, setFbaTriggers] = useState<string[]>([]);


    // Step 3: Systemic Context
    const [schoolName, setSchoolName] = useState('');
    const [hasIEP, setHasIEP] = useState<boolean | null>(null);
    const [iepServices, setIepServices] = useState<string[]>([]);
    const [lineage, setLineage] = useState('');

    const toggleArray = <T,>(arr: T[], item: T, setter: (arr: T[]) => void) => {
        setter(arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item]);
    };

    const handleNext = async () => {
        if (!user) return;
        setSaving(true);

        try {
            if (step === 1) {
                await createProfile(user.uid, { parentTitle, childName, childAge });
                setStep(2);
            } else if (step === 2) {
                await updateBiologicalContext(user.uid, {
                    sensoryProfile: { seekers, avoiders },
                    physicalRhythms: rhythms,
                    regulationStrategies: strategies.split(',').map(s => s.trim()).filter(Boolean),
                });
                setStep(3);
            } else if (step === 3) {
                await updateSystemicContext(user.uid, {
                    schoolName: schoolName || undefined,
                    hasIEP: hasIEP ?? false,
                    iepServices: hasIEP ? iepServices : [],
                    culturalLineage: lineage || undefined,
                });
                onComplete();
            }
        } catch (error) {
            console.error('Recognition Rite error:', error);
        } finally {
            setSaving(false);
        }
    };

    const canProceed = () => {
        if (step === 1) return parentTitle.trim() && childName.trim();
        if (step === 2) return true; // Optional
        if (step === 3) return hasIEP !== null;
        return false;
    };

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center p-6"
            style={{ backgroundColor: 'rgb(var(--glass-base))' }}
        >
            {/* Progress Dots */}
            <div className="flex gap-2 mb-8">
                {[1, 2, 3].map(s => (
                    <div
                        key={s}
                        className={`w-3 h-3 rounded-full transition-all ${s === step
                            ? 'bg-[#4B0082] scale-125'
                            : s < step
                                ? 'bg-[#D4AF37]'
                                : 'bg-white/40'
                            }`}
                    />
                ))}
            </div>

            {/* Step 1: Names */}
            {step === 1 && (
                <div className="glass-panel p-8 rounded-[32px] max-w-md w-full animate-fade-in">
                    <div className="text-center mb-8">
                        <Sparkles className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
                        <h1
                            className="text-3xl mb-2"
                            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                        >
                            The Recognition Rite
                        </h1>
                        <p className="text-sm opacity-70">
                            Let us learn the sacred names of your home.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2 block">
                                What shall we call you?
                            </label>
                            <input
                                type="text"
                                value={parentTitle}
                                onChange={(e) => setParentTitle(e.target.value)}
                                placeholder="e.g., Mama, Eli, Daddy, Auntie"
                                className="w-full p-4 rounded-xl bg-white/30 border border-white/40 focus:border-[#4B0082]/50 focus:outline-none transition-colors"
                                style={{ color: 'var(--text-primary)' }}
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2 block">
                                And the child you witness?
                            </label>
                            <input
                                type="text"
                                value={childName}
                                onChange={(e) => setChildName(e.target.value)}
                                placeholder="Their name"
                                className="w-full p-4 rounded-xl bg-white/30 border border-white/40 focus:border-[#4B0082]/50 focus:outline-none transition-colors"
                                style={{ color: 'var(--text-primary)' }}
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2 block">
                                Age (optional)
                            </label>
                            <input
                                type="number"
                                value={childAge ?? ''}
                                onChange={(e) => setChildAge(e.target.value ? parseInt(e.target.value) : undefined)}
                                placeholder="Years"
                                className="w-full p-4 rounded-xl bg-white/30 border border-white/40 focus:border-[#4B0082]/50 focus:outline-none transition-colors"
                                style={{ color: 'var(--text-primary)' }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Step 2: Biological Context */}
            {step === 2 && (
                <div className="glass-panel p-8 rounded-[32px] max-w-md w-full animate-fade-in max-h-[80vh] overflow-y-auto">
                    <div className="text-center mb-6">
                        <Brain className="w-12 h-12 text-[#4B0082] mx-auto mb-4" />
                        <h1
                            className="text-3xl mb-2"
                            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                        >
                            The Body Knows
                        </h1>
                        <p className="text-sm opacity-70">
                            Tell us about {childName}'s sensory world.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider opacity-60 mb-3 block">
                                Sensory Seeking (select all)
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {SENSORY_SEEKERS.map(item => (
                                    <button
                                        key={item}
                                        onClick={() => toggleArray(seekers, item, setSeekers)}
                                        className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${seekers.includes(item)
                                            ? 'bg-[#4B0082] text-white'
                                            : 'bg-white/30 border border-white/40'
                                            }`}
                                    >
                                        {item}
                                    </button>
                                ))}
                                {/* Show custom seekers */}
                                {seekers.filter(s => !SENSORY_SEEKERS.includes(s)).map(item => (
                                    <button
                                        key={item}
                                        onClick={() => toggleArray(seekers, item, setSeekers)}
                                        className="px-3 py-2 rounded-xl text-sm font-semibold bg-[#4B0082] text-white"
                                    >
                                        {item} ✕
                                    </button>
                                ))}
                            </div>
                            {/* Add custom seeker */}
                            <div className="flex gap-2 mt-2">
                                <input
                                    type="text"
                                    value={customSeeker}
                                    onChange={(e) => setCustomSeeker(e.target.value)}
                                    placeholder="Add your own..."
                                    className="flex-1 px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/40 focus:border-[#4B0082]/50 focus:outline-none"
                                    style={{ color: 'var(--text-primary)' }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && customSeeker.trim()) {
                                            setSeekers([...seekers, customSeeker.trim()]);
                                            setCustomSeeker('');
                                        }
                                    }}
                                />
                                <button
                                    onClick={() => {
                                        if (customSeeker.trim()) {
                                            setSeekers([...seekers, customSeeker.trim()]);
                                            setCustomSeeker('');
                                        }
                                    }}
                                    className="px-3 py-2 rounded-xl text-sm font-semibold bg-[#4B0082] text-white"
                                >
                                    + Add
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider opacity-60 mb-3 block">
                                Sensory Avoiding (select all)
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {SENSORY_AVOIDERS.map(item => (
                                    <button
                                        key={item}
                                        onClick={() => toggleArray(avoiders, item, setAvoiders)}
                                        className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${avoiders.includes(item)
                                            ? 'bg-[#D4AF37] text-white'
                                            : 'bg-white/30 border border-white/40'
                                            }`}
                                    >
                                        {item}
                                    </button>
                                ))}
                                {/* Show custom avoiders */}
                                {avoiders.filter(a => !SENSORY_AVOIDERS.includes(a)).map(item => (
                                    <button
                                        key={item}
                                        onClick={() => toggleArray(avoiders, item, setAvoiders)}
                                        className="px-3 py-2 rounded-xl text-sm font-semibold bg-[#D4AF37] text-white"
                                    >
                                        {item} ✕
                                    </button>
                                ))}
                            </div>
                            {/* Add custom avoider */}
                            <div className="flex gap-2 mt-2">
                                <input
                                    type="text"
                                    value={customAvoider}
                                    onChange={(e) => setCustomAvoider(e.target.value)}
                                    placeholder="Add your own..."
                                    className="flex-1 px-3 py-2 rounded-xl text-sm bg-white/30 border border-white/40 focus:border-[#D4AF37]/50 focus:outline-none"
                                    style={{ color: 'var(--text-primary)' }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && customAvoider.trim()) {
                                            setAvoiders([...avoiders, customAvoider.trim()]);
                                            setCustomAvoider('');
                                        }
                                    }}
                                />
                                <button
                                    onClick={() => {
                                        if (customAvoider.trim()) {
                                            setAvoiders([...avoiders, customAvoider.trim()]);
                                            setCustomAvoider('');
                                        }
                                    }}
                                    className="px-3 py-2 rounded-xl text-sm font-semibold bg-[#D4AF37] text-white"
                                >
                                    + Add
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider opacity-60 mb-3 block">
                                Physical Rhythms
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {PHYSICAL_RHYTHMS.map(item => (
                                    <button
                                        key={item}
                                        onClick={() => toggleArray(rhythms, item, setRhythms)}
                                        className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${rhythms.includes(item)
                                            ? 'bg-[#4B0082] text-white'
                                            : 'bg-white/30 border border-white/40'
                                            }`}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2 block">
                                What helps {childName} regulate?
                            </label>
                            <input
                                type="text"
                                value={strategies}
                                onChange={(e) => setStrategies(e.target.value)}
                                placeholder="e.g., deep pressure, quiet space, movement"
                                className="w-full p-4 rounded-xl bg-white/30 border border-white/40 focus:border-[#4B0082]/50 focus:outline-none transition-colors"
                                style={{ color: 'var(--text-primary)' }}
                            />
                        </div>

                        {/* VAULT DATA: Diagnoses */}
                        <div className="pt-4 border-t border-white/20">
                            <label className="text-xs font-bold uppercase tracking-wider opacity-60 mb-3 block text-[#D4AF37]">
                                📋 Official Diagnoses (Vault)
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {COMMON_DIAGNOSES.map(item => (
                                    <button
                                        key={item}
                                        onClick={() => toggleArray(diagnoses, item, setDiagnoses)}
                                        className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${diagnoses.includes(item)
                                            ? 'bg-[#D4AF37] text-white'
                                            : 'bg-white/30 border border-white/40'
                                            }`}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* VAULT DATA: FBA/BIP Triggers */}
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider opacity-60 mb-3 block text-[#D4AF37]">
                                ⚡ Known Triggers (FBA/BIP)
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {FBA_TRIGGERS.map(item => (
                                    <button
                                        key={item}
                                        onClick={() => toggleArray(fbaTriggers, item, setFbaTriggers)}
                                        className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${fbaTriggers.includes(item)
                                            ? 'bg-[#4B0082] text-white'
                                            : 'bg-white/30 border border-white/40'
                                            }`}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 3: Systemic Context */}
            {step === 3 && (
                <div className="glass-panel p-8 rounded-[32px] max-w-md w-full animate-fade-in max-h-[80vh] overflow-y-auto">
                    <div className="text-center mb-6">
                        <School className="w-12 h-12 text-[#4B0082] mx-auto mb-4" />
                        <h1
                            className="text-3xl mb-2"
                            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                        >
                            The Village Context
                        </h1>
                        <p className="text-sm opacity-70">
                            Help us understand {childName}'s world.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2 block">
                                School Name (optional)
                            </label>
                            <input
                                type="text"
                                value={schoolName}
                                onChange={(e) => setSchoolName(e.target.value)}
                                placeholder="Where they learn"
                                className="w-full p-4 rounded-xl bg-white/30 border border-white/40 focus:border-[#4B0082]/50 focus:outline-none transition-colors"
                                style={{ color: 'var(--text-primary)' }}
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider opacity-60 mb-3 block">
                                Does {childName} have an IEP?
                            </label>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setHasIEP(true)}
                                    className={`flex-1 py-3 rounded-xl font-semibold transition-all ${hasIEP === true
                                        ? 'bg-[#4B0082] text-white'
                                        : 'bg-white/30 border border-white/40'
                                        }`}
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={() => setHasIEP(false)}
                                    className={`flex-1 py-3 rounded-xl font-semibold transition-all ${hasIEP === false
                                        ? 'bg-[#4B0082] text-white'
                                        : 'bg-white/30 border border-white/40'
                                        }`}
                                >
                                    No
                                </button>
                            </div>
                        </div>

                        {hasIEP && (
                            <div className="animate-fade-in">
                                <label className="text-xs font-bold uppercase tracking-wider opacity-60 mb-3 block">
                                    IEP Services
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {IEP_SERVICES.map(service => (
                                        <button
                                            key={service}
                                            onClick={() => toggleArray(iepServices, service, setIepServices)}
                                            className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${iepServices.includes(service)
                                                ? 'bg-[#D4AF37] text-white'
                                                : 'bg-white/30 border border-white/40'
                                                }`}
                                        >
                                            {service}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2 block flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Cultural Lineage (optional)
                            </label>
                            <input
                                type="text"
                                value={lineage}
                                onChange={(e) => setLineage(e.target.value)}
                                placeholder="Honor your family's roots"
                                className="w-full p-4 rounded-xl bg-white/30 border border-white/40 focus:border-[#4B0082]/50 focus:outline-none transition-colors"
                                style={{ color: 'var(--text-primary)' }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <div className="flex gap-4 mt-8">
                {step > 1 && (
                    <button
                        onClick={() => setStep(step - 1)}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/40 font-semibold hover:bg-white/60 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                    </button>
                )}

                <button
                    onClick={handleNext}
                    disabled={!canProceed() || saving}
                    className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all ${canProceed() && !saving
                        ? 'bg-[#4B0082] text-white hover:bg-[#6B238E]'
                        : 'bg-gray-300/50 text-gray-500'
                        }`}
                >
                    {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : step === 3 ? (
                        <Check className="w-4 h-4" />
                    ) : (
                        <ChevronRight className="w-4 h-4" />
                    )}
                    {saving ? 'Saving...' : step === 3 ? 'Enter the Sanctuary' : 'Continue'}
                </button>
            </div>

            {/* Affirmation */}
            <p className="text-xs opacity-50 text-center mt-8 flex items-center justify-center gap-2">
                <Heart className="w-3 h-3" />
                This information stays in your sanctuary.
            </p>

            <style>{`
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
        </div>
    );
};
