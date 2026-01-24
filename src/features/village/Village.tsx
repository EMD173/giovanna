/**
 * VILLAGE: Care Team Coordination Hub
 * 
 * Features:
 * - Team member management with roles
 * - IEP Bridge access for professional synthesis
 * - Event calendar integration
 * - Premium Village tier with Gold Leaf visuals
 */

import { useState } from 'react';
import {
    Users,
    Calendar,
    FileText,
    Crown,
    UserPlus,
    ChevronRight,
    Sparkles
} from 'lucide-react';
import { IEPBridge } from './IEPBridge';

interface VillageProps {
    onNavigate?: (view: string) => void;
}

export const Village = ({ onNavigate }: VillageProps) => {
    const [showIEPBridge, setShowIEPBridge] = useState(false);
    const [isPremium] = useState(true); // TODO: Connect to actual tier

    const team = [
        { name: 'Dr. Alston', role: 'OT Specialist', online: true, tier: 'Viewer' },
        { name: 'Ms. Sarah', role: 'School Aide', online: false, tier: 'Viewer' },
        { name: 'Grandma', role: 'Support', online: true, tier: 'Contributor' },
    ];

    // Show IEP Bridge view
    if (showIEPBridge) {
        return (
            <div className="relative">
                <button
                    onClick={() => setShowIEPBridge(false)}
                    className="absolute top-6 left-4 z-10 px-3 py-1 rounded-lg text-sm font-semibold bg-white/40 hover:bg-white/60 transition-colors"
                >
                    ← Back
                </button>
                <IEPBridge />
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
                            The Village
                        </h2>
                        <h1
                            className="text-3xl mt-1"
                            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                        >
                            Care Coordination
                        </h1>
                    </div>
                    {isPremium && (
                        <div className="village-badge px-3 py-1 rounded-lg text-xs flex items-center gap-1">
                            <Crown className="w-3 h-3" />
                            Village Tier
                        </div>
                    )}
                </div>
            </header>

            {/* IEP BRIDGE CARD - Premium Feature */}
            <div className="px-4">
                <button
                    onClick={() => setShowIEPBridge(true)}
                    className={`w-full p-5 rounded-[24px] text-left transition-all ${isPremium
                        ? 'gold-leaf-border premium-glow hover:scale-[1.02]'
                        : 'glass-panel opacity-60'
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-xl ${isPremium ? 'bg-[#D4AF37]/20' : 'bg-white/40'}`}>
                                <FileText className={`w-6 h-6 ${isPremium ? 'text-[#D4AF37]' : 'text-gray-400'}`} />
                            </div>
                            <div>
                                <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                                    IEP Bridge
                                </h3>
                                <p className="text-xs opacity-60">
                                    Professional data synthesis for care teams
                                </p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 opacity-40" />
                    </div>
                    {isPremium && (
                        <div className="mt-3 flex items-center gap-2 text-xs" style={{ color: '#D4AF37' }}>
                            <Sparkles className="w-3 h-3" />
                            <span>Generate dignity-centered reports for IEP meetings</span>
                        </div>
                    )}
                </button>
            </div>

            {/* TEAM STATUS */}
            <div className="px-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider opacity-60">
                        Your Village
                    </h3>
                    <button className="flex items-center gap-1 text-xs font-semibold text-[#4B0082]">
                        <UserPlus className="w-3 h-3" />
                        Invite
                    </button>
                </div>
                <div className="flex space-x-4 overflow-x-auto pb-4 no-scrollbar">
                    <div className="flex flex-col items-center space-y-2">
                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#4B0082]/30 flex items-center justify-center">
                            <Users className="w-6 h-6 text-[#4B0082]" />
                        </div>
                        <span className="text-xs font-bold opacity-60">Manage</span>
                    </div>

                    {team.map((member, i) => (
                        <div key={i} className="flex flex-col items-center space-y-2 min-w-[64px]">
                            <div className={`w-16 h-16 rounded-full glass-panel flex items-center justify-center relative ${member.online ? 'border-2 border-[#4B0082]' : ''}`}>
                                <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                                    {member.name[0]}
                                </span>
                                {member.online && (
                                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
                                )}
                            </div>
                            <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                                {member.name.split(' ')[0]}
                            </span>
                            <span className="text-[10px] opacity-50">{member.tier}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* UPCOMING VILLAGE EVENTS */}
            <div className="px-4">
                <div className="glass-panel p-5 rounded-[28px] space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-[#1A1A1A]/5">
                        <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>This Week</h3>
                        <Calendar className="w-5 h-5 text-[#4B0082]" />
                    </div>

                    <div className="flex items-start space-x-4">
                        <div className="flex flex-col items-center">
                            <span className="text-xs font-bold opacity-50 uppercase">Tue</span>
                            <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>24</span>
                        </div>
                        <div className="flex-1 bg-white/40 p-3 rounded-xl border border-white/60">
                            <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>IEP Review Meeting</h4>
                            <p className="text-xs opacity-60 mt-1">9:00 AM • Zoom Link sent by Ms. Sarah</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-4">
                        <div className="flex flex-col items-center">
                            <span className="text-xs font-bold opacity-50 uppercase">Thu</span>
                            <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>26</span>
                        </div>
                        <div className="flex-1 bg-[#4B0082]/10 p-3 rounded-xl border border-[#4B0082]/20">
                            <h4 className="font-bold text-sm text-[#4B0082]">Speech Therapy</h4>
                            <p className="text-xs text-[#4B0082]/60 mt-1">3:30 PM • In-Home</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* PROFESSIONAL DASHBOARD LINK */}
            {onNavigate && (
                <div className="px-4">
                    <button
                        onClick={() => onNavigate('ProfessionalDashboard')}
                        className="w-full glass-panel p-4 rounded-[24px] flex items-center gap-3 hover:bg-white/50 transition-colors gold-leaf-border"
                    >
                        <div className="p-2 rounded-xl bg-[#D4AF37]/20">
                            <FileText className="w-5 h-5 text-[#D4AF37]" />
                        </div>
                        <div className="flex-1 text-left">
                            <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                                Professional Dashboard
                            </h4>
                            <p className="text-xs opacity-60">
                                View as a care team member
                            </p>
                        </div>
                        <ChevronRight className="w-5 h-5 opacity-40" />
                    </button>
                </div>
            )}

            {/* VILLAGE ONBOARDING CTA */}
            <div className="px-4">
                <button className="w-full glass-panel p-4 rounded-[24px] flex items-center gap-3 hover:bg-white/50 transition-colors">
                    <div className="p-2 rounded-xl bg-[#4B0082]/10">
                        <UserPlus className="w-5 h-5 text-[#4B0082]" />
                    </div>
                    <div className="flex-1 text-left">
                        <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                            Complete Your Village
                        </h4>
                        <p className="text-xs opacity-60">
                            Add teachers, therapists, and caregivers
                        </p>
                    </div>
                    <ChevronRight className="w-5 h-5 opacity-40" />
                </button>
            </div>

        </div>
    );
};
