/**
 * INSTITUTIONAL VAULT: Expert Empowerment UI
 * 
 * Elite institutional data in the parent's hands.
 * Design: Liquid Glass accordion with empowering language.
 * 
 * Sections:
 * - School-House Map (IEP)
 * - Understanding Communication (FBA/BIP)
 * - Healing Team (Clinical)
 */

import { useState } from 'react';
import {
    ChevronDown,
    ChevronUp,
    School,
    Brain,
    Heart,
    Plus,
    Trash2,
    Save,
    Shield,
    Target,
    Clock,
    Users,
    Pill,
    AlertCircle,
    Sparkles,
    Loader2
} from 'lucide-react';
import type {
    IEPVault,
    IEPGoal,
    FBABIPVault,
    TargetBehavior,
    BIPStrategy,
    ClinicalVault,
    Specialist,
    Diagnosis,
    Medication
} from '../../core/stores/profileTypes';

interface AccordionSectionProps {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
    isPremium?: boolean;
    children: React.ReactNode;
}

const AccordionSection = ({
    title,
    subtitle,
    icon,
    isOpen,
    onToggle,
    isPremium,
    children
}: AccordionSectionProps) => (
    <div className={`glass-panel rounded-[24px] mb-4 overflow-hidden ${isPremium ? 'gold-leaf-border' : ''}`}>
        <button
            onClick={onToggle}
            className="w-full p-5 flex items-center justify-between text-left"
        >
            <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${isPremium ? 'bg-[#D4AF37]/20' : 'bg-[#4B0082]/10'}`}>
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
            <div className="px-5 pb-5 pt-0 border-t border-white/20 animate-fade-in">
                {children}
            </div>
        )}
    </div>
);

const GOAL_AREAS = ['Academic', 'Behavioral', 'Social-Emotional', 'Communication', 'Motor', 'Life Skills'] as const;
const PROGRESS_LEVELS = ['Not Started', 'Emerging', 'Progressing', 'Mastered'] as const;
const STRATEGY_TYPES = ['Prevention', 'Teaching', 'Response'] as const;
const EFFECTIVENESS_LEVELS = ['Effective', 'Partially', 'Not Effective', 'Unknown'] as const;

export const InstitutionalVault = () => {
    const [openSection, setOpenSection] = useState<'iep' | 'fba' | 'clinical' | null>('iep');
    const [saving, setSaving] = useState(false);

    // IEP State
    const [iep, setIep] = useState<IEPVault>({
        goals: [],
        accommodations: [],
        modifications: [],
        serviceMinutes: [],
    });

    // FBA/BIP State
    const [fbaBip, setFbaBip] = useState<FBABIPVault>({
        targetBehaviors: [],
        triggers: [],
        settings: [],
        functions: [],
        currentStrategies: [],
    });

    // Clinical State
    const [clinical, setClinical] = useState<ClinicalVault>({
        specialists: [],
        diagnoses: [],
        therapies: [],
    });

    // Helpers
    const addGoal = () => {
        const newGoal: IEPGoal = {
            id: `goal-${Date.now()}`,
            area: 'Academic',
            description: '',
            progress: 'Not Started',
        };
        setIep(prev => ({ ...prev, goals: [...prev.goals, newGoal] }));
    };

    const updateGoal = (id: string, updates: Partial<IEPGoal>) => {
        setIep(prev => ({
            ...prev,
            goals: prev.goals.map(g => g.id === id ? { ...g, ...updates } : g)
        }));
    };

    const removeGoal = (id: string) => {
        setIep(prev => ({ ...prev, goals: prev.goals.filter(g => g.id !== id) }));
    };

    const addTargetBehavior = () => {
        const newBehavior: TargetBehavior = {
            institutional: '',
            dignityTranslation: '',
        };
        setFbaBip(prev => ({ ...prev, targetBehaviors: [...prev.targetBehaviors, newBehavior] }));
    };

    const addStrategy = () => {
        const newStrategy: BIPStrategy = {
            type: 'Prevention',
            description: '',
            effectiveness: 'Unknown',
        };
        setFbaBip(prev => ({ ...prev, currentStrategies: [...prev.currentStrategies, newStrategy] }));
    };

    const addSpecialist = () => {
        const newSpec: Specialist = { name: '', specialty: '' };
        setClinical(prev => ({ ...prev, specialists: [...prev.specialists, newSpec] }));
    };

    const addDiagnosis = () => {
        const newDiag: Diagnosis = { name: '' };
        setClinical(prev => ({ ...prev, diagnoses: [...prev.diagnoses, newDiag] }));
    };

    const addMedication = () => {
        const newMed: Medication = { name: '', dosage: '', timing: '' };
        setClinical(prev => ({
            ...prev,
            medicationRhythm: {
                ...prev.medicationRhythm,
                medications: [...(prev.medicationRhythm?.medications || []), newMed]
            }
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        // TODO: Save to Firestore
        await new Promise(r => setTimeout(r, 1000));
        setSaving(false);
    };

    return (
        <div className="flex flex-col h-full pt-6 pb-32 px-4 fade-in overflow-y-auto">
            {/* HEADER */}
            <header className="mb-6">
                <h2 className="text-sm font-bold tracking-widest text-[#4B0082] uppercase opacity-80">
                    Expert Empowerment
                </h2>
                <h1
                    className="text-3xl mt-1"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                >
                    Institutional Vault
                </h1>
                <p className="text-sm mt-2 opacity-70" style={{ color: 'var(--text-secondary)' }}>
                    Elite data, translated into dignity.
                </p>
            </header>

            {/* DATA SOVEREIGNTY NOTICE */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 mb-6 text-xs">
                <Shield className="w-4 h-4 text-[#D4AF37]" />
                <span style={{ color: 'var(--text-primary)' }}>
                    This vault is <strong>encrypted and sovereign</strong>. You control what is shared.
                </span>
            </div>

            {/* IEP SECTION - SCHOOL-HOUSE MAP */}
            <AccordionSection
                title="School-House Map"
                subtitle="IEP Goals, Accommodations, Services"
                icon={<School className="w-5 h-5 text-[#4B0082]" />}
                isOpen={openSection === 'iep'}
                onToggle={() => setOpenSection(openSection === 'iep' ? null : 'iep')}
                isPremium
            >
                {/* IEP Goals */}
                <div className="mt-4">
                    <div className="flex items-center justify-between mb-3">
                        <label className="text-xs font-bold uppercase tracking-wider opacity-60 flex items-center gap-2">
                            <Target className="w-3 h-3" />
                            IEP Goals
                        </label>
                        <button
                            onClick={addGoal}
                            className="flex items-center gap-1 text-xs font-semibold text-[#4B0082] hover:text-[#6B238E]"
                        >
                            <Plus className="w-3 h-3" />
                            Add Goal
                        </button>
                    </div>

                    {iep.goals.length === 0 ? (
                        <p className="text-sm opacity-50 italic p-4 text-center bg-white/20 rounded-xl">
                            No goals yet. Add your IEP goals to track progress.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {iep.goals.map(goal => (
                                <div key={goal.id} className="bg-white/30 rounded-xl p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <select
                                            value={goal.area}
                                            onChange={(e) => updateGoal(goal.id, { area: e.target.value as any })}
                                            className="text-xs font-bold uppercase tracking-wider bg-[#4B0082]/10 text-[#4B0082] px-2 py-1 rounded-lg border-0"
                                        >
                                            {GOAL_AREAS.map(area => (
                                                <option key={area} value={area}>{area}</option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={() => removeGoal(goal.id)}
                                            className="p-1 text-red-400 hover:text-red-600"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div>
                                        <label className="text-xs opacity-60 block mb-1">Institutional Language</label>
                                        <textarea
                                            value={goal.description}
                                            onChange={(e) => updateGoal(goal.id, { description: e.target.value })}
                                            placeholder="Paste the goal from your IEP document..."
                                            className="w-full p-3 rounded-xl bg-white/40 border border-white/60 text-sm resize-none focus:outline-none focus:border-[#4B0082]/50"
                                            style={{ color: 'var(--text-primary)' }}
                                            rows={2}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs opacity-60 block mb-1 flex items-center gap-1">
                                            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                                            Dignity Translation
                                        </label>
                                        <textarea
                                            value={goal.dignityTranslation || ''}
                                            onChange={(e) => updateGoal(goal.id, { dignityTranslation: e.target.value })}
                                            placeholder="What this means for your child's growth..."
                                            className="w-full p-3 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-sm resize-none focus:outline-none"
                                            style={{ color: 'var(--text-primary)' }}
                                            rows={2}
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <label className="text-xs opacity-60">Progress:</label>
                                        <select
                                            value={goal.progress}
                                            onChange={(e) => updateGoal(goal.id, { progress: e.target.value as any })}
                                            className="text-xs bg-white/40 px-2 py-1 rounded-lg border border-white/60"
                                            style={{ color: 'var(--text-primary)' }}
                                        >
                                            {PROGRESS_LEVELS.map(level => (
                                                <option key={level} value={level}>{level}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Accommodations */}
                <div className="mt-6">
                    <label className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2 block">
                        Accommodations
                    </label>
                    <textarea
                        value={iep.accommodations.join('\n')}
                        onChange={(e) => setIep(prev => ({ ...prev, accommodations: e.target.value.split('\n').filter(Boolean) }))}
                        placeholder="One accommodation per line...&#10;Extended time&#10;Preferential seating&#10;Sensory breaks"
                        className="w-full p-3 rounded-xl bg-white/40 border border-white/60 text-sm resize-none focus:outline-none focus:border-[#4B0082]/50"
                        style={{ color: 'var(--text-primary)' }}
                        rows={4}
                    />
                </div>

                {/* Case Manager */}
                <div className="mt-4">
                    <label className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2 block">
                        Case Manager
                    </label>
                    <input
                        type="text"
                        value={iep.caseManager || ''}
                        onChange={(e) => setIep(prev => ({ ...prev, caseManager: e.target.value }))}
                        placeholder="Who coordinates your child's services?"
                        className="w-full p-3 rounded-xl bg-white/40 border border-white/60 text-sm focus:outline-none focus:border-[#4B0082]/50"
                        style={{ color: 'var(--text-primary)' }}
                    />
                </div>
            </AccordionSection>

            {/* FBA/BIP SECTION - UNDERSTANDING COMMUNICATION */}
            <AccordionSection
                title="Understanding Communication"
                subtitle="FBA/BIP Triggers, Strategies, Functions"
                icon={<Brain className="w-5 h-5 text-[#4B0082]" />}
                isOpen={openSection === 'fba'}
                onToggle={() => setOpenSection(openSection === 'fba' ? null : 'fba')}
            >
                {/* Target Behaviors */}
                <div className="mt-4">
                    <div className="flex items-center justify-between mb-3">
                        <label className="text-xs font-bold uppercase tracking-wider opacity-60 flex items-center gap-2">
                            <AlertCircle className="w-3 h-3" />
                            Target Behaviors → Communication
                        </label>
                        <button
                            onClick={addTargetBehavior}
                            className="flex items-center gap-1 text-xs font-semibold text-[#4B0082] hover:text-[#6B238E]"
                        >
                            <Plus className="w-3 h-3" />
                            Add
                        </button>
                    </div>

                    <p className="text-xs opacity-60 mb-3 italic">
                        Translate institutional "deficit" language into dignified communication.
                    </p>

                    {fbaBip.targetBehaviors.map((behavior, i) => (
                        <div key={i} className="bg-white/30 rounded-xl p-4 mb-3 space-y-3">
                            <div>
                                <label className="text-xs opacity-60 block mb-1">Institutional Label</label>
                                <input
                                    type="text"
                                    value={behavior.institutional}
                                    onChange={(e) => {
                                        const updated = [...fbaBip.targetBehaviors];
                                        updated[i] = { ...updated[i], institutional: e.target.value };
                                        setFbaBip(prev => ({ ...prev, targetBehaviors: updated }));
                                    }}
                                    placeholder="What they call it..."
                                    className="w-full p-2 rounded-lg bg-white/40 border border-white/60 text-sm focus:outline-none"
                                    style={{ color: 'var(--text-primary)' }}
                                />
                            </div>
                            <div>
                                <label className="text-xs opacity-60 block mb-1 flex items-center gap-1">
                                    <Heart className="w-3 h-3 text-[#D4AF37]" />
                                    Dignity Translation
                                </label>
                                <input
                                    type="text"
                                    value={behavior.dignityTranslation}
                                    onChange={(e) => {
                                        const updated = [...fbaBip.targetBehaviors];
                                        updated[i] = { ...updated[i], dignityTranslation: e.target.value };
                                        setFbaBip(prev => ({ ...prev, targetBehaviors: updated }));
                                    }}
                                    placeholder="What this communication really means..."
                                    className="w-full p-2 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-sm focus:outline-none"
                                    style={{ color: 'var(--text-primary)' }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Triggers */}
                <div className="mt-4">
                    <label className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2 block">
                        Known Triggers (Antecedents)
                    </label>
                    <textarea
                        value={fbaBip.triggers.join('\n')}
                        onChange={(e) => setFbaBip(prev => ({ ...prev, triggers: e.target.value.split('\n').filter(Boolean) }))}
                        placeholder="One trigger per line..."
                        className="w-full p-3 rounded-xl bg-white/40 border border-white/60 text-sm resize-none focus:outline-none"
                        style={{ color: 'var(--text-primary)' }}
                        rows={3}
                    />
                </div>

                {/* Current Strategies */}
                <div className="mt-4">
                    <div className="flex items-center justify-between mb-3">
                        <label className="text-xs font-bold uppercase tracking-wider opacity-60">
                            Current Strategies
                        </label>
                        <button
                            onClick={addStrategy}
                            className="flex items-center gap-1 text-xs font-semibold text-[#4B0082] hover:text-[#6B238E]"
                        >
                            <Plus className="w-3 h-3" />
                            Add Strategy
                        </button>
                    </div>

                    {fbaBip.currentStrategies.map((strategy, i) => (
                        <div key={i} className="bg-white/30 rounded-xl p-3 mb-2 flex items-center gap-3">
                            <select
                                value={strategy.type}
                                onChange={(e) => {
                                    const updated = [...fbaBip.currentStrategies];
                                    updated[i] = { ...updated[i], type: e.target.value as any };
                                    setFbaBip(prev => ({ ...prev, currentStrategies: updated }));
                                }}
                                className="text-xs bg-[#4B0082]/10 text-[#4B0082] px-2 py-1 rounded-lg border-0"
                            >
                                {STRATEGY_TYPES.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                            <input
                                type="text"
                                value={strategy.description}
                                onChange={(e) => {
                                    const updated = [...fbaBip.currentStrategies];
                                    updated[i] = { ...updated[i], description: e.target.value };
                                    setFbaBip(prev => ({ ...prev, currentStrategies: updated }));
                                }}
                                placeholder="Describe the strategy..."
                                className="flex-1 p-2 rounded-lg bg-white/40 border border-white/60 text-sm focus:outline-none"
                                style={{ color: 'var(--text-primary)' }}
                            />
                            <select
                                value={strategy.effectiveness}
                                onChange={(e) => {
                                    const updated = [...fbaBip.currentStrategies];
                                    updated[i] = { ...updated[i], effectiveness: e.target.value as any };
                                    setFbaBip(prev => ({ ...prev, currentStrategies: updated }));
                                }}
                                className="text-xs bg-white/40 px-2 py-1 rounded-lg border border-white/60"
                                style={{ color: 'var(--text-primary)' }}
                            >
                                {EFFECTIVENESS_LEVELS.map(level => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>
            </AccordionSection>

            {/* CLINICAL SECTION - HEALING TEAM */}
            <AccordionSection
                title="Healing Team"
                subtitle="Specialists, Diagnoses, Medications"
                icon={<Heart className="w-5 h-5 text-[#D4AF37]" />}
                isOpen={openSection === 'clinical'}
                onToggle={() => setOpenSection(openSection === 'clinical' ? null : 'clinical')}
            >
                {/* Primary Doctor */}
                <div className="mt-4">
                    <label className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2 block flex items-center gap-2">
                        <Users className="w-3 h-3" />
                        Primary Doctor
                    </label>
                    <input
                        type="text"
                        value={clinical.primaryDoctor || ''}
                        onChange={(e) => setClinical(prev => ({ ...prev, primaryDoctor: e.target.value }))}
                        placeholder="Pediatrician or primary care provider"
                        className="w-full p-3 rounded-xl bg-white/40 border border-white/60 text-sm focus:outline-none"
                        style={{ color: 'var(--text-primary)' }}
                    />
                </div>

                {/* Specialists */}
                <div className="mt-4">
                    <div className="flex items-center justify-between mb-3">
                        <label className="text-xs font-bold uppercase tracking-wider opacity-60">
                            Specialists
                        </label>
                        <button
                            onClick={addSpecialist}
                            className="flex items-center gap-1 text-xs font-semibold text-[#4B0082] hover:text-[#6B238E]"
                        >
                            <Plus className="w-3 h-3" />
                            Add
                        </button>
                    </div>

                    {clinical.specialists.map((spec, i) => (
                        <div key={i} className="bg-white/30 rounded-xl p-3 mb-2 flex items-center gap-3">
                            <input
                                type="text"
                                value={spec.name}
                                onChange={(e) => {
                                    const updated = [...clinical.specialists];
                                    updated[i] = { ...updated[i], name: e.target.value };
                                    setClinical(prev => ({ ...prev, specialists: updated }));
                                }}
                                placeholder="Name"
                                className="flex-1 p-2 rounded-lg bg-white/40 border border-white/60 text-sm focus:outline-none"
                                style={{ color: 'var(--text-primary)' }}
                            />
                            <input
                                type="text"
                                value={spec.specialty}
                                onChange={(e) => {
                                    const updated = [...clinical.specialists];
                                    updated[i] = { ...updated[i], specialty: e.target.value };
                                    setClinical(prev => ({ ...prev, specialists: updated }));
                                }}
                                placeholder="Specialty"
                                className="flex-1 p-2 rounded-lg bg-white/40 border border-white/60 text-sm focus:outline-none"
                                style={{ color: 'var(--text-primary)' }}
                            />
                        </div>
                    ))}
                </div>

                {/* Diagnoses */}
                <div className="mt-4">
                    <div className="flex items-center justify-between mb-3">
                        <label className="text-xs font-bold uppercase tracking-wider opacity-60">
                            Diagnoses
                        </label>
                        <button
                            onClick={addDiagnosis}
                            className="flex items-center gap-1 text-xs font-semibold text-[#4B0082] hover:text-[#6B238E]"
                        >
                            <Plus className="w-3 h-3" />
                            Add
                        </button>
                    </div>

                    {clinical.diagnoses.map((diag, i) => (
                        <div key={i} className="bg-white/30 rounded-xl p-3 mb-2">
                            <input
                                type="text"
                                value={diag.name}
                                onChange={(e) => {
                                    const updated = [...clinical.diagnoses];
                                    updated[i] = { ...updated[i], name: e.target.value };
                                    setClinical(prev => ({ ...prev, diagnoses: updated }));
                                }}
                                placeholder="Diagnosis name"
                                className="w-full p-2 rounded-lg bg-white/40 border border-white/60 text-sm focus:outline-none"
                                style={{ color: 'var(--text-primary)' }}
                            />
                        </div>
                    ))}
                </div>

                {/* Medications */}
                <div className="mt-4">
                    <div className="flex items-center justify-between mb-3">
                        <label className="text-xs font-bold uppercase tracking-wider opacity-60 flex items-center gap-2">
                            <Pill className="w-3 h-3" />
                            Medication Rhythm
                        </label>
                        <button
                            onClick={addMedication}
                            className="flex items-center gap-1 text-xs font-semibold text-[#4B0082] hover:text-[#6B238E]"
                        >
                            <Plus className="w-3 h-3" />
                            Add
                        </button>
                    </div>

                    {clinical.medicationRhythm?.medications.map((med, i) => (
                        <div key={i} className="bg-white/30 rounded-xl p-3 mb-2 flex items-center gap-2">
                            <input
                                type="text"
                                value={med.name}
                                onChange={(e) => {
                                    const updated = [...(clinical.medicationRhythm?.medications || [])];
                                    updated[i] = { ...updated[i], name: e.target.value };
                                    setClinical(prev => ({ ...prev, medicationRhythm: { ...prev.medicationRhythm, medications: updated } }));
                                }}
                                placeholder="Medication"
                                className="flex-1 p-2 rounded-lg bg-white/40 border border-white/60 text-sm focus:outline-none"
                                style={{ color: 'var(--text-primary)' }}
                            />
                            <input
                                type="text"
                                value={med.dosage}
                                onChange={(e) => {
                                    const updated = [...(clinical.medicationRhythm?.medications || [])];
                                    updated[i] = { ...updated[i], dosage: e.target.value };
                                    setClinical(prev => ({ ...prev, medicationRhythm: { ...prev.medicationRhythm, medications: updated } }));
                                }}
                                placeholder="Dosage"
                                className="w-24 p-2 rounded-lg bg-white/40 border border-white/60 text-sm focus:outline-none"
                                style={{ color: 'var(--text-primary)' }}
                            />
                            <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3 opacity-40" />
                                <input
                                    type="text"
                                    value={med.timing}
                                    onChange={(e) => {
                                        const updated = [...(clinical.medicationRhythm?.medications || [])];
                                        updated[i] = { ...updated[i], timing: e.target.value };
                                        setClinical(prev => ({ ...prev, medicationRhythm: { ...prev.medicationRhythm, medications: updated } }));
                                    }}
                                    placeholder="When"
                                    className="w-24 p-2 rounded-lg bg-white/40 border border-white/60 text-sm focus:outline-none"
                                    style={{ color: 'var(--text-primary)' }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </AccordionSection>

            {/* SAVE BUTTON */}
            <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-4 rounded-full font-bold bg-gradient-to-r from-[#4B0082] to-[#6B238E] text-white flex items-center justify-center gap-2 hover:shadow-xl transition-all disabled:opacity-50"
            >
                {saving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <Save className="w-5 h-5" />
                )}
                {saving ? 'Securing Vault...' : 'Save to Vault'}
            </button>

            {/* DIGNITY AFFIRMATION */}
            <p className="text-xs opacity-50 text-center mt-4 flex items-center justify-center gap-2">
                <Shield className="w-3 h-3" />
                Your expertise as a parent is the primary lens. Institutions inform, they do not define.
            </p>

            <style>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
        </div>
    );
};

export default InstitutionalVault;
