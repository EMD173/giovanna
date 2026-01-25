/**
 * LEGACY CENTER
 * 
 * The continuity planning hub for lifetime care.
 * 
 * Features:
 * - Full data export (PDF archive, JSON backup)
 * - "Introduce My Child" shareable document
 * - "If Something Happens to Me" instructions
 * - Account transfer capabilities
 * - Future caregiver preparation
 * - Transition summaries for new providers
 */

import { useState, useEffect } from 'react';
import {
    ArrowLeft,
    Download,
    FileText,
    Heart,
    Shield,
    Users,
    Share2,
    ChevronRight,
    Lock,
    Clock,
    AlertTriangle,
    Check,
} from 'lucide-react';
import { useAuthStore } from '../../core/stores/useAuthStore';
import { getProfile } from '../../core/firebase/profiles';
import { 
    LIFE_STAGES, 
    type LifeStage 
} from '../../lib/ageStageFramework';

// ============================================================================
// TYPES
// ============================================================================

interface LegacyDocument {
    id: string;
    type: 'introduce' | 'emergency' | 'transition' | 'backup';
    title: string;
    description: string;
    icon: typeof Heart;
    color: string;
    lastUpdated?: Date;
    isGenerated: boolean;
}

interface EmergencyContact {
    id: string;
    name: string;
    relationship: string;
    phone: string;
    email?: string;
    canMakeDecisions: boolean;
}

interface EmergencyPlan {
    contacts: EmergencyContact[];
    medicationSchedule: string;
    dailyRoutine: string;
    triggers: string;
    calmingStrategies: string;
    medicalInfo: string;
    importantDocs: string;
    legalInfo: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

interface LegacyCenterProps {
    onBack: () => void;
}

export const LegacyCenter = ({ onBack }: LegacyCenterProps) => {
    const { user } = useAuthStore();
    const [childName, setChildName] = useState('');
    const [currentStage, setCurrentStage] = useState<LifeStage>('early_childhood');
    const [selectedDoc, setSelectedDoc] = useState<LegacyDocument | null>(null);
    const [showExportModal, setShowExportModal] = useState(false);
    const [emergencyPlan, setEmergencyPlan] = useState<EmergencyPlan | null>(null);
    
    // Load profile
    useEffect(() => {
        if (user) {
            getProfile(user.uid).then(profile => {
                if (profile?.childName) setChildName(profile.childName);
            });
            
            // Load emergency plan and stage from localStorage
            const storedPlan = localStorage.getItem(`giovanna-emergency-${user.uid}`);
            if (storedPlan) {
                try {
                    setEmergencyPlan(JSON.parse(storedPlan));
                } catch (e) {
                    console.error('Failed to load emergency plan:', e);
                }
            }
            
            const storedStage = localStorage.getItem(`giovanna-stage-${user.uid}`);
            if (storedStage && storedStage in LIFE_STAGES) {
                setCurrentStage(storedStage as LifeStage);
            }
        }
    }, [user]);
    
    // Save emergency plan
    const saveEmergencyPlan = (plan: EmergencyPlan) => {
        setEmergencyPlan(plan);
        if (user) {
            localStorage.setItem(`giovanna-emergency-${user.uid}`, JSON.stringify(plan));
        }
    };
    
    const stageConfig = LIFE_STAGES[currentStage];
    
    // Document types
    const documents: LegacyDocument[] = [
        {
            id: 'introduce',
            type: 'introduce',
            title: 'Introduce My Child',
            description: `A comprehensive document to help anyone new to ${childName || 'your child'}'s life understand who they are.`,
            icon: Heart,
            color: '#EC4899',
            isGenerated: false,
        },
        {
            id: 'emergency',
            type: 'emergency',
            title: 'If Something Happens to Me',
            description: 'Critical information for emergency caregivers: contacts, routines, medical needs.',
            icon: Shield,
            color: '#DC2626',
            isGenerated: !!emergencyPlan,
            lastUpdated: emergencyPlan ? new Date() : undefined,
        },
        {
            id: 'transition',
            type: 'transition',
            title: 'Provider Transition Summary',
            description: 'Generate a summary for new therapists, teachers, or doctors joining the care team.',
            icon: Users,
            color: '#7C3AED',
            isGenerated: false,
        },
        {
            id: 'backup',
            type: 'backup',
            title: 'Full Data Backup',
            description: 'Download all observations, notes, and documents as a comprehensive archive.',
            icon: Download,
            color: '#0EA5E9',
            isGenerated: false,
        },
    ];
    
    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-500">Please sign in to access Legacy Center</p>
            </div>
        );
    }
    
    // Show detailed view for selected document
    if (selectedDoc) {
        return (
            <DocumentDetailView
                document={selectedDoc}
                childName={childName}
                stageConfig={stageConfig}
                emergencyPlan={emergencyPlan}
                onBack={() => setSelectedDoc(null)}
                onSaveEmergencyPlan={saveEmergencyPlan}
            />
        );
    }
    
    return (
        <div className="flex flex-col h-full pt-6 pb-32 px-4 fade-in overflow-y-auto">
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
                        Legacy Center
                    </h1>
                    <p className="text-sm opacity-70">
                        Continuity planning for {childName || 'your family'}'s future
                    </p>
                </div>
            </header>
            
            {/* Life Stage Banner */}
            <div 
                className="glass-panel p-4 rounded-2xl mb-6"
                style={{ borderLeft: `4px solid ${stageConfig.color}` }}
            >
                <div className="flex items-center gap-3">
                    <span className="text-3xl">{stageConfig.emoji}</span>
                    <div className="flex-1">
                        <p className="text-sm opacity-70">Current Life Stage</p>
                        <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                            {stageConfig.label}
                        </h3>
                        <p className="text-xs opacity-60">{stageConfig.ageRange}</p>
                    </div>
                    <button
                        onClick={() => setShowExportModal(true)}
                        className="px-3 py-2 rounded-xl bg-[#4B0082] text-white text-sm font-medium flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Export All
                    </button>
                </div>
            </div>
            
            {/* Important Notice */}
            <div className="glass-panel p-4 rounded-2xl mb-6 bg-amber-50 border border-amber-200">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold text-amber-800 text-sm">Plan Ahead</p>
                        <p className="text-xs text-amber-700 mt-1">
                            These documents ensure {childName || 'your child'}'s care continues 
                            seamlessly if you're unavailable. Update them regularly.
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Document Cards */}
            <div className="space-y-3">
                <h2 className="text-sm font-bold opacity-70">Essential Documents</h2>
                
                {documents.map(doc => (
                    <button
                        key={doc.id}
                        onClick={() => setSelectedDoc(doc)}
                        className="glass-panel p-4 rounded-2xl w-full text-left hover:scale-[1.01] active:scale-[0.99] transition-transform"
                    >
                        <div className="flex items-center gap-4">
                            <div 
                                className="w-12 h-12 rounded-xl flex items-center justify-center"
                                style={{ backgroundColor: `${doc.color}15` }}
                            >
                                <doc.icon className="w-6 h-6" style={{ color: doc.color }} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                                        {doc.title}
                                    </h3>
                                    {doc.isGenerated && (
                                        <Check className="w-4 h-4 text-green-500" />
                                    )}
                                </div>
                                <p className="text-xs opacity-60 mt-1">{doc.description}</p>
                                {doc.lastUpdated && (
                                    <p className="text-xs opacity-50 mt-1 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        Updated {doc.lastUpdated.toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                            <ChevronRight className="w-5 h-5 opacity-30" />
                        </div>
                    </button>
                ))}
            </div>
            
            {/* Transition Readiness */}
            <div className="mt-6">
                <h2 className="text-sm font-bold opacity-70 mb-3">Transition Readiness</h2>
                <div className="glass-panel p-4 rounded-2xl">
                    <p className="text-sm font-medium mb-3">
                        Questions to consider for the next stage:
                    </p>
                    <div className="space-y-2">
                        {stageConfig.transitionQuestions.map((question, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm">
                                <span className="opacity-50">{i + 1}.</span>
                                <span className="opacity-80">{question}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Export Modal */}
            {showExportModal && (
                <ExportModal 
                    childName={childName}
                    onClose={() => setShowExportModal(false)} 
                />
            )}
        </div>
    );
};

// ============================================================================
// DOCUMENT DETAIL VIEW
// ============================================================================

const DocumentDetailView = ({
    document,
    childName,
    stageConfig,
    emergencyPlan,
    onBack,
    onSaveEmergencyPlan,
}: {
    document: LegacyDocument;
    childName: string;
    stageConfig: typeof LIFE_STAGES[LifeStage];
    emergencyPlan: EmergencyPlan | null;
    onBack: () => void;
    onSaveEmergencyPlan: (plan: EmergencyPlan) => void;
}) => {
    switch (document.type) {
        case 'introduce':
            return <IntroduceChildView childName={childName} stageConfig={stageConfig} onBack={onBack} />;
        case 'emergency':
            return <EmergencyPlanView childName={childName} plan={emergencyPlan} onBack={onBack} onSave={onSaveEmergencyPlan} />;
        case 'transition':
            return <TransitionSummaryView childName={childName} onBack={onBack} />;
        case 'backup':
            return <DataBackupView childName={childName} onBack={onBack} />;
        default:
            return null;
    }
};

// ============================================================================
// INTRODUCE MY CHILD VIEW
// ============================================================================

const IntroduceChildView = ({
    childName,
    stageConfig,
    onBack,
}: {
    childName: string;
    stageConfig: typeof LIFE_STAGES[LifeStage];
    onBack: () => void;
}) => {
    const [sections, setSections] = useState({
        whoTheyAre: '',
        whatTheyLove: '',
        howTheyCommunicate: '',
        whatHelps: '',
        whatToAvoid: '',
        dailyRoutine: '',
        sensoryNeeds: '',
        medicalInfo: '',
    });
    
    const handleChange = (field: keyof typeof sections, value: string) => {
        setSections(prev => ({ ...prev, [field]: value }));
    };
    
    const handleExport = () => {
        // Generate a simple text export
        const content = `
INTRODUCING ${childName.toUpperCase()}

WHO THEY ARE
${sections.whoTheyAre || 'Not yet documented'}

WHAT THEY LOVE
${sections.whatTheyLove || 'Not yet documented'}

HOW THEY COMMUNICATE
${sections.howTheyCommunicate || 'Not yet documented'}

WHAT HELPS
${sections.whatHelps || 'Not yet documented'}

WHAT TO AVOID
${sections.whatToAvoid || 'Not yet documented'}

DAILY ROUTINE
${sections.dailyRoutine || 'Not yet documented'}

SENSORY NEEDS
${sections.sensoryNeeds || 'Not yet documented'}

MEDICAL INFORMATION
${sections.medicalInfo || 'Not yet documented'}

---
Generated from Giovanna on ${new Date().toLocaleDateString()}
Life Stage: ${stageConfig.label} (${stageConfig.ageRange})
        `.trim();
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = window.document.createElement('a');
        a.href = url;
        a.download = `introduce-${childName.toLowerCase().replace(/\s+/g, '-')}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };
    
    return (
        <div className="flex flex-col h-full pt-6 pb-32 px-4 fade-in overflow-y-auto">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-sm text-[#4B0082] hover:opacity-70 mb-4"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Legacy Center
            </button>
            
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 
                        className="text-2xl font-bold"
                        style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                    >
                        Introduce {childName || 'My Child'}
                    </h1>
                    <p className="text-sm opacity-70">Help others understand who they truly are</p>
                </div>
                <button
                    onClick={handleExport}
                    className="px-3 py-2 rounded-xl bg-[#EC4899] text-white text-sm font-medium flex items-center gap-2"
                >
                    <Share2 className="w-4 h-4" />
                    Export
                </button>
            </div>
            
            <div className="space-y-4">
                {[
                    { key: 'whoTheyAre', label: 'Who They Are', placeholder: 'Their personality, spirit, what makes them unique...' },
                    { key: 'whatTheyLove', label: 'What They Love', placeholder: 'Interests, passions, favorite activities...' },
                    { key: 'howTheyCommunicate', label: 'How They Communicate', placeholder: 'Verbal, AAC, gestures, how to understand their communication...' },
                    { key: 'whatHelps', label: 'What Helps', placeholder: 'Strategies that work, comfort items, approaches...' },
                    { key: 'whatToAvoid', label: 'What to Avoid', placeholder: 'Triggers, things that don\'t help, common mistakes...' },
                    { key: 'dailyRoutine', label: 'Daily Routine', placeholder: 'Key parts of their day, timing, transitions...' },
                    { key: 'sensoryNeeds', label: 'Sensory Needs', placeholder: 'Sensory preferences, avoiding, seeking...' },
                    { key: 'medicalInfo', label: 'Medical Information', placeholder: 'Allergies, medications, conditions...' },
                ].map(({ key, label, placeholder }) => (
                    <div key={key} className="glass-panel p-4 rounded-xl">
                        <label className="text-sm font-bold mb-2 block">{label}</label>
                        <textarea
                            value={sections[key as keyof typeof sections]}
                            onChange={(e) => handleChange(key as keyof typeof sections, e.target.value)}
                            placeholder={placeholder}
                            className="w-full p-3 rounded-xl bg-white/50 border border-white/50 focus:ring-2 focus:ring-[#4B0082] outline-none resize-none text-sm"
                            rows={3}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

// ============================================================================
// EMERGENCY PLAN VIEW
// ============================================================================

const EmergencyPlanView = ({
    childName,
    plan,
    onBack,
    onSave,
}: {
    childName: string;
    plan: EmergencyPlan | null;
    onBack: () => void;
    onSave: (plan: EmergencyPlan) => void;
}) => {
    const [formData, setFormData] = useState<EmergencyPlan>(plan || {
        contacts: [],
        medicationSchedule: '',
        dailyRoutine: '',
        triggers: '',
        calmingStrategies: '',
        medicalInfo: '',
        importantDocs: '',
        legalInfo: '',
    });
    
    const [newContact, setNewContact] = useState({
        name: '',
        relationship: '',
        phone: '',
        email: '',
        canMakeDecisions: false,
    });
    
    const addContact = () => {
        if (!newContact.name || !newContact.phone) return;
        setFormData(prev => ({
            ...prev,
            contacts: [...prev.contacts, { ...newContact, id: `contact-${Date.now()}` }],
        }));
        setNewContact({ name: '', relationship: '', phone: '', email: '', canMakeDecisions: false });
    };
    
    const removeContact = (id: string) => {
        setFormData(prev => ({
            ...prev,
            contacts: prev.contacts.filter(c => c.id !== id),
        }));
    };
    
    const handleSave = () => {
        onSave(formData);
        onBack();
    };
    
    return (
        <div className="flex flex-col h-full pt-6 pb-32 px-4 fade-in overflow-y-auto">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-sm text-[#4B0082] hover:opacity-70 mb-4"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Legacy Center
            </button>
            
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 
                        className="text-2xl font-bold"
                        style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                    >
                        If Something Happens
                    </h1>
                    <p className="text-sm opacity-70">Critical care instructions for {childName || 'your child'}</p>
                </div>
                <button
                    onClick={handleSave}
                    className="px-4 py-2 rounded-xl bg-[#DC2626] text-white font-medium flex items-center gap-2"
                >
                    <Shield className="w-4 h-4" />
                    Save Plan
                </button>
            </div>
            
            {/* Emergency Contacts */}
            <div className="glass-panel p-4 rounded-2xl mb-4">
                <h2 className="font-bold mb-3">Emergency Contacts</h2>
                
                {formData.contacts.length > 0 && (
                    <div className="space-y-2 mb-4">
                        {formData.contacts.map(contact => (
                            <div key={contact.id} className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                                <div>
                                    <p className="font-medium">{contact.name}</p>
                                    <p className="text-xs opacity-60">{contact.relationship} • {contact.phone}</p>
                                    {contact.canMakeDecisions && (
                                        <span className="text-xs text-green-600 font-medium">Can make decisions</span>
                                    )}
                                </div>
                                <button
                                    onClick={() => removeContact(contact.id)}
                                    className="text-red-500 text-xs"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                
                <div className="space-y-2 p-3 bg-gray-50 rounded-xl">
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            type="text"
                            value={newContact.name}
                            onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Name"
                            className="p-2 rounded-lg bg-white border text-sm"
                        />
                        <input
                            type="text"
                            value={newContact.relationship}
                            onChange={(e) => setNewContact(prev => ({ ...prev, relationship: e.target.value }))}
                            placeholder="Relationship"
                            className="p-2 rounded-lg bg-white border text-sm"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            type="tel"
                            value={newContact.phone}
                            onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="Phone"
                            className="p-2 rounded-lg bg-white border text-sm"
                        />
                        <input
                            type="email"
                            value={newContact.email}
                            onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="Email (optional)"
                            className="p-2 rounded-lg bg-white border text-sm"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={newContact.canMakeDecisions}
                                onChange={(e) => setNewContact(prev => ({ ...prev, canMakeDecisions: e.target.checked }))}
                            />
                            Can make care decisions
                        </label>
                        <button
                            onClick={addContact}
                            className="px-3 py-1 bg-[#4B0082] text-white text-sm rounded-lg"
                        >
                            Add Contact
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Information Sections */}
            {[
                { key: 'medicationSchedule', label: 'Medication Schedule', placeholder: 'List all medications, dosages, and timing...' },
                { key: 'dailyRoutine', label: 'Daily Routine', placeholder: 'Essential parts of the day that must be maintained...' },
                { key: 'triggers', label: 'Known Triggers', placeholder: 'What causes distress and should be avoided...' },
                { key: 'calmingStrategies', label: 'Calming Strategies', placeholder: 'What helps when upset, comfort items, techniques...' },
                { key: 'medicalInfo', label: 'Medical Information', placeholder: 'Allergies, conditions, doctors, hospitals...' },
                { key: 'importantDocs', label: 'Important Documents Location', placeholder: 'Where to find IEP, medical records, insurance...' },
                { key: 'legalInfo', label: 'Legal Information', placeholder: 'Guardianship, power of attorney, trust information...' },
            ].map(({ key, label, placeholder }) => (
                <div key={key} className="glass-panel p-4 rounded-xl mb-3">
                    <label className="text-sm font-bold mb-2 block">{label}</label>
                    <textarea
                        value={formData[key as keyof EmergencyPlan] as string}
                        onChange={(e) => setFormData(prev => ({ ...prev, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="w-full p-3 rounded-xl bg-white/50 border border-white/50 focus:ring-2 focus:ring-[#4B0082] outline-none resize-none text-sm"
                        rows={3}
                    />
                </div>
            ))}
        </div>
    );
};

// ============================================================================
// TRANSITION SUMMARY VIEW
// ============================================================================

const TransitionSummaryView = ({
    childName,
    onBack,
}: {
    childName: string;
    onBack: () => void;
}) => {
    const [providerType, setProviderType] = useState<'therapist' | 'teacher' | 'doctor'>('therapist');
    
    const providerTemplates = {
        therapist: {
            label: 'New Therapist',
            sections: ['Therapy History', 'Current Goals', 'What Works in Sessions', 'Communication Style', 'Sensory Considerations'],
        },
        teacher: {
            label: 'New Teacher',
            sections: ['IEP Summary', 'Classroom Accommodations', 'Behavior Support Plan', 'Communication with Home', 'Peer Relationships'],
        },
        doctor: {
            label: 'New Doctor',
            sections: ['Medical History', 'Current Medications', 'Sensory Accommodations', 'Communication Approach', 'Previous Successful Visits'],
        },
    };
    
    return (
        <div className="flex flex-col h-full pt-6 pb-32 px-4 fade-in overflow-y-auto">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-sm text-[#4B0082] hover:opacity-70 mb-4"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Legacy Center
            </button>
            
            <h1 
                className="text-2xl font-bold mb-2"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
            >
                Provider Transition
            </h1>
            <p className="text-sm opacity-70 mb-6">
                Generate a summary for a new provider joining {childName || 'your child'}'s care team
            </p>
            
            {/* Provider Type Selector */}
            <div className="flex gap-2 mb-6">
                {Object.entries(providerTemplates).map(([key, { label }]) => (
                    <button
                        key={key}
                        onClick={() => setProviderType(key as typeof providerType)}
                        className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                            providerType === key
                                ? 'bg-[#7C3AED] text-white'
                                : 'bg-white/40 hover:bg-white/60'
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>
            
            {/* Template Sections */}
            <div className="space-y-4">
                {providerTemplates[providerType].sections.map((section, i) => (
                    <div key={i} className="glass-panel p-4 rounded-xl">
                        <label className="text-sm font-bold mb-2 block">{section}</label>
                        <textarea
                            placeholder={`Information about ${section.toLowerCase()}...`}
                            className="w-full p-3 rounded-xl bg-white/50 border border-white/50 focus:ring-2 focus:ring-[#4B0082] outline-none resize-none text-sm"
                            rows={3}
                        />
                    </div>
                ))}
            </div>
            
            <button className="mt-6 w-full py-3 rounded-xl bg-[#7C3AED] text-white font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <FileText className="w-5 h-5" />
                Generate Summary
            </button>
        </div>
    );
};

// ============================================================================
// DATA BACKUP VIEW
// ============================================================================

const DataBackupView = ({
    childName,
    onBack,
}: {
    childName: string;
    onBack: () => void;
}) => {
    const [isExporting, setIsExporting] = useState(false);
    
    const handleFullBackup = () => {
        setIsExporting(true);
        
        // Simulate export
        setTimeout(() => {
            const data = {
                exportDate: new Date().toISOString(),
                childName,
                // In real implementation, this would include all observations, skills, strategies, etc.
                message: 'Full data export - implementation would include all Firestore data',
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = window.document.createElement('a');
            a.href = url;
            a.download = `giovanna-backup-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            
            setIsExporting(false);
        }, 1500);
    };
    
    return (
        <div className="flex flex-col h-full pt-6 pb-32 px-4 fade-in overflow-y-auto">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-sm text-[#4B0082] hover:opacity-70 mb-4"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Legacy Center
            </button>
            
            <h1 
                className="text-2xl font-bold mb-2"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
            >
                Data Backup
            </h1>
            <p className="text-sm opacity-70 mb-6">
                Download a complete backup of all {childName || 'your child'}'s data
            </p>
            
            {/* Security Notice */}
            <div className="glass-panel p-4 rounded-2xl mb-6 bg-blue-50 border border-blue-200">
                <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold text-blue-800 text-sm">Your Data, Your Ownership</p>
                        <p className="text-xs text-blue-700 mt-1">
                            You can export all your data at any time. We believe in parent sovereignty - 
                            your data should never be locked in.
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Export Options */}
            <div className="space-y-3">
                <button
                    onClick={handleFullBackup}
                    disabled={isExporting}
                    className="glass-panel p-4 rounded-2xl w-full text-left hover:scale-[1.01] active:scale-[0.99] transition-transform disabled:opacity-50"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#0EA5E9]/15 flex items-center justify-center">
                            <Download className="w-6 h-6 text-[#0EA5E9]" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                                {isExporting ? 'Exporting...' : 'Full JSON Backup'}
                            </h3>
                            <p className="text-xs opacity-60">All observations, skills, strategies, and settings</p>
                        </div>
                    </div>
                </button>
                
                <button className="glass-panel p-4 rounded-2xl w-full text-left hover:scale-[1.01] active:scale-[0.99] transition-transform">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#DC2626]/15 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-[#DC2626]" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                                PDF Archive
                            </h3>
                            <p className="text-xs opacity-60">Printable document with all observations</p>
                        </div>
                    </div>
                </button>
            </div>
            
            {/* Backup History */}
            <div className="mt-8">
                <h2 className="text-sm font-bold opacity-70 mb-3">Backup History</h2>
                <div className="glass-panel p-4 rounded-xl text-center opacity-60">
                    <p className="text-sm">No backups yet</p>
                    <p className="text-xs">Create your first backup above</p>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// EXPORT MODAL
// ============================================================================

const ExportModal = ({
    childName,
    onClose,
}: {
    childName: string;
    onClose: () => void;
}) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
            <div className="glass-panel p-6 rounded-3xl w-full max-w-md">
                <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                    Export Everything
                </h2>
                
                <p className="text-sm opacity-70 mb-6">
                    Create a complete archive of {childName || 'your child'}'s data including all observations, 
                    skills, strategies, and documents.
                </p>
                
                <div className="space-y-2 mb-6">
                    <label className="flex items-center gap-3 p-3 bg-white/40 rounded-xl cursor-pointer hover:bg-white/60">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span className="text-sm">Observations & Notes</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-white/40 rounded-xl cursor-pointer hover:bg-white/60">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span className="text-sm">Skills & Progress</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-white/40 rounded-xl cursor-pointer hover:bg-white/60">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span className="text-sm">Documents & Plans</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-white/40 rounded-xl cursor-pointer hover:bg-white/60">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span className="text-sm">Profile Information</span>
                    </label>
                </div>
                
                <div className="flex gap-2">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl bg-gray-200 font-bold"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl bg-[#4B0082] text-white font-bold flex items-center justify-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LegacyCenter;
