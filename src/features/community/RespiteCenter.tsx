/**
 * RESPITE CENTER
 * 
 * Tools and resources for caregiver respite and emergency support.
 * 
 * Features:
 * - Respite care locator (conceptual)
 * - Emergency backup planning
 * - Quick care guides for respite providers
 * - Self-care during respite
 * - Returning home transitions
 */

import { useState, useEffect } from 'react';
import {
    ArrowLeft,
    Heart,
    Clock,
    MapPin,
    Users,
    FileText,
    Check,
    AlertTriangle,
    Sparkles,
    ChevronRight,
    Phone,
    Download,
} from 'lucide-react';
import { useAuthStore } from '../../core/stores/useAuthStore';
import { getProfile } from '../../core/firebase/profiles';

// ============================================================================
// TYPES
// ============================================================================

interface RespiteProvider {
    id: string;
    name: string;
    relationship: string;
    phone: string;
    email?: string;
    availability: string;
    experience: string;
    notes: string;
    isEmergency: boolean;
}

interface RespiteEvent {
    id: string;
    providerId: string;
    date: Date;
    duration: string;
    notes: string;
    usedSelfCare: string[];
}

// ============================================================================
// COMPONENT
// ============================================================================

interface RespiteCenterProps {
    onBack: () => void;
}

export const RespiteCenter = ({ onBack }: RespiteCenterProps) => {
    const { user } = useAuthStore();
    const [childName, setChildName] = useState('');
    const [providers, setProviders] = useState<RespiteProvider[]>([]);
    const [events, setEvents] = useState<RespiteEvent[]>([]);
    const [showAddProvider, setShowAddProvider] = useState(false);
    const [showQuickGuide, setShowQuickGuide] = useState(false);
    const [showSelfCareIdeas, setShowSelfCareIdeas] = useState(false);
    
    // Load data
    useEffect(() => {
        if (user) {
            getProfile(user.uid).then(profile => {
                if (profile?.childName) setChildName(profile.childName);
            });
            
            // Load from localStorage
            const storedProviders = localStorage.getItem(`giovanna-respite-providers-${user.uid}`);
            if (storedProviders) {
                try {
                    setProviders(JSON.parse(storedProviders));
                } catch (e) {
                    console.error('Failed to load respite providers:', e);
                }
            }
            
            const storedEvents = localStorage.getItem(`giovanna-respite-events-${user.uid}`);
            if (storedEvents) {
                try {
                    const parsed = JSON.parse(storedEvents);
                    setEvents(parsed.map((e: RespiteEvent) => ({
                        ...e,
                        date: new Date(e.date),
                    })));
                } catch (e) {
                    console.error('Failed to load respite events:', e);
                }
            }
        }
    }, [user]);
    
    // Save providers
    useEffect(() => {
        if (user && providers.length > 0) {
            localStorage.setItem(`giovanna-respite-providers-${user.uid}`, JSON.stringify(providers));
        }
    }, [providers, user]);
    
    // Add provider
    const addProvider = (provider: Omit<RespiteProvider, 'id'>) => {
        const newProvider: RespiteProvider = {
            ...provider,
            id: `provider-${Date.now()}`,
        };
        setProviders(prev => [...prev, newProvider]);
        setShowAddProvider(false);
    };
    
    // Calculate stats
    const emergencyContacts = providers.filter(p => p.isEmergency).length;
    const totalRespiteHours = events.reduce((sum, e) => {
        const hours = parseFloat(e.duration) || 0;
        return sum + hours;
    }, 0);
    
    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-500">Please sign in to access Respite Center</p>
            </div>
        );
    }
    
    if (showAddProvider) {
        return (
            <AddProviderView 
                onBack={() => setShowAddProvider(false)} 
                onAdd={addProvider}
            />
        );
    }
    
    if (showQuickGuide) {
        return (
            <QuickGuideView 
                childName={childName}
                onBack={() => setShowQuickGuide(false)}
            />
        );
    }
    
    if (showSelfCareIdeas) {
        return <SelfCareIdeasView onBack={() => setShowSelfCareIdeas(false)} />;
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
                        Respite Center
                    </h1>
                    <p className="text-sm opacity-70">
                        Taking breaks is essential, not selfish
                    </p>
                </div>
            </header>
            
            {/* Affirmation Banner */}
            <div className="glass-panel p-4 rounded-2xl mb-6 bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                <div className="flex items-start gap-3">
                    <Heart className="w-6 h-6 text-[#D4AF37] shrink-0" />
                    <div>
                        <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                            You Cannot Pour From an Empty Cup
                        </p>
                        <p className="text-xs opacity-70 mt-1">
                            Respite care isn't giving up—it's showing up better for your child 
                            by taking care of yourself first.
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="glass-panel p-3 rounded-xl text-center">
                    <Users className="w-5 h-5 mx-auto mb-1 text-[#4B0082]" />
                    <p className="text-xl font-bold">{providers.length}</p>
                    <p className="text-xs opacity-60">Providers</p>
                </div>
                <div className="glass-panel p-3 rounded-xl text-center">
                    <AlertTriangle className="w-5 h-5 mx-auto mb-1 text-[#DC2626]" />
                    <p className="text-xl font-bold">{emergencyContacts}</p>
                    <p className="text-xs opacity-60">Emergency</p>
                </div>
                <div className="glass-panel p-3 rounded-xl text-center">
                    <Clock className="w-5 h-5 mx-auto mb-1 text-[#16A34A]" />
                    <p className="text-xl font-bold">{totalRespiteHours}h</p>
                    <p className="text-xs opacity-60">Logged</p>
                </div>
            </div>
            
            {/* Action Cards */}
            <div className="space-y-3 mb-6">
                <button
                    onClick={() => setShowAddProvider(true)}
                    className="glass-panel p-4 rounded-2xl w-full text-left gold-leaf-border hover:scale-[1.01] transition-transform"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#4B0082]/15 flex items-center justify-center">
                            <Users className="w-6 h-6 text-[#4B0082]" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                                Add Respite Provider
                            </h3>
                            <p className="text-xs opacity-60">
                                Build your support network
                            </p>
                        </div>
                        <ChevronRight className="w-5 h-5 opacity-30" />
                    </div>
                </button>
                
                <button
                    onClick={() => setShowQuickGuide(true)}
                    className="glass-panel p-4 rounded-2xl w-full text-left hover:scale-[1.01] transition-transform"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#0EA5E9]/15 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-[#0EA5E9]" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                                Quick Care Guide
                            </h3>
                            <p className="text-xs opacity-60">
                                Generate a guide for respite providers
                            </p>
                        </div>
                        <ChevronRight className="w-5 h-5 opacity-30" />
                    </div>
                </button>
                
                <button
                    onClick={() => setShowSelfCareIdeas(true)}
                    className="glass-panel p-4 rounded-2xl w-full text-left hover:scale-[1.01] transition-transform"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#EC4899]/15 flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-[#EC4899]" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                                Self-Care During Respite
                            </h3>
                            <p className="text-xs opacity-60">
                                Ideas for actually resting
                            </p>
                        </div>
                        <ChevronRight className="w-5 h-5 opacity-30" />
                    </div>
                </button>
            </div>
            
            {/* Provider List */}
            {providers.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-sm font-bold opacity-70 mb-3">Your Support Network</h2>
                    <div className="space-y-2">
                        {providers.map(provider => (
                            <div 
                                key={provider.id}
                                className={`glass-panel p-4 rounded-xl ${
                                    provider.isEmergency ? 'border border-red-200 bg-red-50' : ''
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                        provider.isEmergency ? 'bg-red-100' : 'bg-[#4B0082]/10'
                                    }`}>
                                        {provider.isEmergency ? (
                                            <AlertTriangle className="w-5 h-5 text-red-600" />
                                        ) : (
                                            <Users className="w-5 h-5 text-[#4B0082]" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-sm">{provider.name}</p>
                                            {provider.isEmergency && (
                                                <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700">
                                                    Emergency
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs opacity-60">{provider.relationship}</p>
                                    </div>
                                    <a 
                                        href={`tel:${provider.phone}`}
                                        className="p-2 rounded-full bg-[#4B0082]/10 hover:bg-[#4B0082]/20"
                                    >
                                        <Phone className="w-4 h-4 text-[#4B0082]" />
                                    </a>
                                </div>
                                {provider.availability && (
                                    <p className="text-xs mt-2 opacity-60">
                                        📅 {provider.availability}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Empty State */}
            {providers.length === 0 && (
                <div className="glass-panel p-6 rounded-2xl text-center">
                    <Users className="w-12 h-12 mx-auto mb-3 text-[#4B0082] opacity-50" />
                    <p className="font-bold mb-2">Build Your Support Network</p>
                    <p className="text-sm opacity-60 mb-4">
                        Add trusted people who can help when you need a break
                    </p>
                    <button
                        onClick={() => setShowAddProvider(true)}
                        className="px-4 py-2 rounded-xl bg-[#4B0082] text-white font-medium text-sm"
                    >
                        Add First Provider
                    </button>
                </div>
            )}
            
            {/* Resources Section */}
            <div className="mb-6">
                <h2 className="text-sm font-bold opacity-70 mb-3">Finding Respite Care</h2>
                <div className="glass-panel p-4 rounded-xl space-y-3">
                    <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 mt-1 text-[#4B0082]" />
                        <div>
                            <p className="text-sm font-medium">ARCH National Respite Network</p>
                            <p className="text-xs opacity-60">archrespite.org - Find local respite services</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 mt-1 text-[#4B0082]" />
                        <div>
                            <p className="text-sm font-medium">State Respite Programs</p>
                            <p className="text-xs opacity-60">Many states offer funded respite - ask your case manager</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 mt-1 text-[#4B0082]" />
                        <div>
                            <p className="text-sm font-medium">Local Arc Chapters</p>
                            <p className="text-xs opacity-60">thearc.org - Many offer respite programs</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Returning Home Card */}
            <div className="glass-panel p-4 rounded-2xl bg-[#16A34A]/5 border border-[#16A34A]/10">
                <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#16A34A]" />
                    Returning Home
                </h3>
                <ul className="text-xs opacity-70 space-y-1">
                    <li>• Give yourself transition time before jumping into caregiving</li>
                    <li>• Ask about how things went - celebrate the provider's efforts</li>
                    <li>• Don't expect perfection from yourself or the respite experience</li>
                    <li>• Notice: do you feel even slightly renewed? That counts</li>
                </ul>
            </div>
        </div>
    );
};

// ============================================================================
// ADD PROVIDER VIEW
// ============================================================================

const AddProviderView = ({
    onBack,
    onAdd,
}: {
    onBack: () => void;
    onAdd: (provider: Omit<RespiteProvider, 'id'>) => void;
}) => {
    const [formData, setFormData] = useState({
        name: '',
        relationship: '',
        phone: '',
        email: '',
        availability: '',
        experience: '',
        notes: '',
        isEmergency: false,
    });
    
    const handleSubmit = () => {
        if (!formData.name || !formData.phone) return;
        onAdd(formData);
    };
    
    return (
        <div className="flex flex-col h-full pt-6 pb-32 px-4 fade-in overflow-y-auto">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-sm text-[#4B0082] hover:opacity-70 mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back
            </button>
            
            <h1 className="text-xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                Add Respite Provider
            </h1>
            
            <div className="space-y-4">
                <div className="glass-panel p-4 rounded-xl">
                    <label className="text-sm font-bold mb-2 block">Name *</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Grandma Jane"
                        className="w-full p-3 rounded-xl bg-white/50 border border-white/50 focus:ring-2 focus:ring-[#4B0082] outline-none text-sm"
                    />
                </div>
                
                <div className="glass-panel p-4 rounded-xl">
                    <label className="text-sm font-bold mb-2 block">Relationship</label>
                    <input
                        type="text"
                        value={formData.relationship}
                        onChange={(e) => setFormData(prev => ({ ...prev, relationship: e.target.value }))}
                        placeholder="e.g., Grandmother, Neighbor, Paid caregiver"
                        className="w-full p-3 rounded-xl bg-white/50 border border-white/50 focus:ring-2 focus:ring-[#4B0082] outline-none text-sm"
                    />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                    <div className="glass-panel p-4 rounded-xl">
                        <label className="text-sm font-bold mb-2 block">Phone *</label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="555-555-5555"
                            className="w-full p-3 rounded-xl bg-white/50 border border-white/50 focus:ring-2 focus:ring-[#4B0082] outline-none text-sm"
                        />
                    </div>
                    <div className="glass-panel p-4 rounded-xl">
                        <label className="text-sm font-bold mb-2 block">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="Optional"
                            className="w-full p-3 rounded-xl bg-white/50 border border-white/50 focus:ring-2 focus:ring-[#4B0082] outline-none text-sm"
                        />
                    </div>
                </div>
                
                <div className="glass-panel p-4 rounded-xl">
                    <label className="text-sm font-bold mb-2 block">Availability</label>
                    <input
                        type="text"
                        value={formData.availability}
                        onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                        placeholder="e.g., Weekends, Every other Tuesday"
                        className="w-full p-3 rounded-xl bg-white/50 border border-white/50 focus:ring-2 focus:ring-[#4B0082] outline-none text-sm"
                    />
                </div>
                
                <div className="glass-panel p-4 rounded-xl">
                    <label className="text-sm font-bold mb-2 block">Experience with your child</label>
                    <textarea
                        value={formData.experience}
                        onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                        placeholder="What do they know? What training have they had?"
                        className="w-full p-3 rounded-xl bg-white/50 border border-white/50 focus:ring-2 focus:ring-[#4B0082] outline-none resize-none text-sm"
                        rows={2}
                    />
                </div>
                
                <div className="glass-panel p-4 rounded-xl">
                    <label className="text-sm font-bold mb-2 block">Notes</label>
                    <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Any other important information..."
                        className="w-full p-3 rounded-xl bg-white/50 border border-white/50 focus:ring-2 focus:ring-[#4B0082] outline-none resize-none text-sm"
                        rows={2}
                    />
                </div>
                
                <div className="glass-panel p-4 rounded-xl bg-red-50 border border-red-200">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.isEmergency}
                            onChange={(e) => setFormData(prev => ({ ...prev, isEmergency: e.target.checked }))}
                            className="w-5 h-5 accent-red-600"
                        />
                        <div>
                            <p className="font-bold text-sm text-red-800">Emergency Contact</p>
                            <p className="text-xs text-red-600">Can be called in urgent situations</p>
                        </div>
                    </label>
                </div>
            </div>
            
            <button
                onClick={handleSubmit}
                disabled={!formData.name || !formData.phone}
                className="mt-6 w-full py-4 rounded-xl bg-[#4B0082] text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
                Add Provider
            </button>
        </div>
    );
};

// ============================================================================
// QUICK GUIDE VIEW
// ============================================================================

const QuickGuideView = ({
    childName,
    onBack,
}: {
    childName: string;
    onBack: () => void;
}) => {
    const [sections, setSections] = useState({
        basicInfo: '',
        routine: '',
        communication: '',
        triggers: '',
        calming: '',
        medical: '',
        emergency: '',
        meals: '',
    });
    
    const handleExport = () => {
        const content = `
QUICK CARE GUIDE FOR ${childName.toUpperCase()}
Generated: ${new Date().toLocaleDateString()}

BASIC INFO
${sections.basicInfo || 'Please fill in'}

DAILY ROUTINE
${sections.routine || 'Please fill in'}

COMMUNICATION
${sections.communication || 'Please fill in'}

WHAT TO AVOID (TRIGGERS)
${sections.triggers || 'Please fill in'}

CALMING STRATEGIES
${sections.calming || 'Please fill in'}

MEALS & SNACKS
${sections.meals || 'Please fill in'}

MEDICAL INFORMATION
${sections.medical || 'Please fill in'}

EMERGENCY CONTACTS
${sections.emergency || 'Please fill in'}

---
Generated by Giovanna - Your Child's Living Story
        `.trim();
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = window.document.createElement('a');
        a.href = url;
        a.download = `care-guide-${childName.toLowerCase().replace(/\s+/g, '-')}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };
    
    return (
        <div className="flex flex-col h-full pt-6 pb-32 px-4 fade-in overflow-y-auto">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-sm text-[#4B0082] hover:opacity-70 mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back
            </button>
            
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                        Quick Care Guide
                    </h1>
                    <p className="text-sm opacity-70">For respite providers caring for {childName || 'your child'}</p>
                </div>
                <button
                    onClick={handleExport}
                    className="px-3 py-2 rounded-xl bg-[#4B0082] text-white text-sm font-medium flex items-center gap-2"
                >
                    <Download className="w-4 h-4" />
                    Export
                </button>
            </div>
            
            <div className="space-y-4">
                {[
                    { key: 'basicInfo', label: 'Basic Info', placeholder: 'Age, diagnosis, general personality...' },
                    { key: 'routine', label: 'Daily Routine', placeholder: 'Key times: meals, naps, bedtime, activities...' },
                    { key: 'communication', label: 'Communication', placeholder: 'How they communicate, signs to watch for...' },
                    { key: 'triggers', label: 'What to Avoid', placeholder: 'Known triggers, things that cause distress...' },
                    { key: 'calming', label: 'Calming Strategies', placeholder: 'What works when upset, comfort items...' },
                    { key: 'meals', label: 'Meals & Snacks', placeholder: 'Food preferences, restrictions, timing...' },
                    { key: 'medical', label: 'Medical Info', placeholder: 'Medications, allergies, conditions...' },
                    { key: 'emergency', label: 'Emergency Contacts', placeholder: 'Who to call, in what order...' },
                ].map(({ key, label, placeholder }) => (
                    <div key={key} className="glass-panel p-4 rounded-xl">
                        <label className="text-sm font-bold mb-2 block">{label}</label>
                        <textarea
                            value={sections[key as keyof typeof sections]}
                            onChange={(e) => setSections(prev => ({ ...prev, [key]: e.target.value }))}
                            placeholder={placeholder}
                            className="w-full p-3 rounded-xl bg-white/50 border border-white/50 focus:ring-2 focus:ring-[#4B0082] outline-none resize-none text-sm"
                            rows={2}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

// ============================================================================
// SELF-CARE IDEAS VIEW
// ============================================================================

const SelfCareIdeasView = ({
    onBack,
}: {
    onBack: () => void;
}) => {
    const ideas = [
        { time: '30 min', ideas: ['Take a shower without rushing', 'Sit in your car in silence', 'Watch one episode of something', 'Call a friend'] },
        { time: '1 hour', ideas: ['Get a coffee alone', 'Walk without a destination', 'Browse a store slowly', 'Sit in nature'] },
        { time: '2-3 hours', ideas: ['Get a massage or haircut', 'See a movie', 'Have lunch with a friend', 'Nap uninterrupted'] },
        { time: 'Half day', ideas: ['Go to a spa', 'Have a date with your partner', 'Take a class (yoga, pottery, etc.)', 'Explore a new neighborhood'] },
        { time: 'Full day', ideas: ['Stay in bed late with coffee and books', 'Go on a solo adventure', 'Visit a museum or exhibit', 'Do absolutely nothing'] },
    ];
    
    return (
        <div className="flex flex-col h-full pt-6 pb-32 px-4 fade-in overflow-y-auto">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-sm text-[#4B0082] hover:opacity-70 mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back
            </button>
            
            <h1 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                Self-Care During Respite
            </h1>
            <p className="text-sm opacity-70 mb-6">
                Guilt-free ideas for actually resting
            </p>
            
            {/* Permission Statement */}
            <div className="glass-panel p-4 rounded-2xl mb-6 bg-[#EC4899]/5 border border-[#EC4899]/10">
                <p className="text-center text-sm italic">
                    "If you have respite, you have permission to REST. Not catch up on chores. REST."
                </p>
            </div>
            
            <div className="space-y-4">
                {ideas.map((category, i) => (
                    <div key={i} className="glass-panel p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-3">
                            <Clock className="w-4 h-4 text-[#4B0082]" />
                            <h3 className="font-bold text-sm">If You Have {category.time}:</h3>
                        </div>
                        <div className="space-y-2">
                            {category.ideas.map((idea, j) => (
                                <div key={j} className="flex items-center gap-2 text-sm">
                                    <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                                    <span>{idea}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Reminder */}
            <div className="mt-6 glass-panel p-4 rounded-2xl text-center">
                <p className="text-sm opacity-80">
                    Remember: Chores can wait. The laundry will still be there. 
                    <span className="font-bold"> You deserve rest.</span>
                </p>
            </div>
        </div>
    );
};

export default RespiteCenter;
