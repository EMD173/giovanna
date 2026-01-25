/**
 * PROFESSIONAL DASHBOARD: Practitioner View (Village Tier)
 * 
 * Design: Liquid Glass with Gold Leaf premium accents
 * Function: View-only access to:
 * - Regulation Glow stats
 * - Published strength narratives
 * - IEP Bridge Care Plans (downloadable)
 * 
 * Data Sovereignty: Only sees Refracted Narratives, never private reflections.
 */

import { useState, useEffect } from 'react';
import {
    Shield,
    Download,
    FileText,
    Heart,
    Users,
    Calendar,
    ChevronRight,
    Loader2,
    Eye,
    Lock,
    Sparkles,
    Brain,
    MessageCircle
} from 'lucide-react';
import type { CareTeam, PublishedObservation, RefractedNarrative } from '../../core/stores/careTeamTypes';

interface ProfessionalDashboardProps {
    careTeamId: string;
    practitionerName: string;
    childName: string;
}

// Mock data for prototype
const mockCareTeam: CareTeam = {
    id: 'team-1',
    name: "Maya's Care Circle",
    childId: 'child-1',
    childName: 'Maya',
    adminId: 'parent-1',
    members: [
        { email: 'teacher@school.edu', name: 'Ms. Sarah', role: 'Practitioner', title: '4th Grade Teacher', status: 'active', invitedAt: {} as any },
        { email: 'ot@clinic.com', name: 'Dr. Alston', role: 'Practitioner', title: 'OT Specialist', organization: 'Pediatric Therapy Associates', status: 'active', invitedAt: {} as any },
    ],
    tier: 'Village',
    subscriptionActive: true,
    createdAt: {} as any,
    updatedAt: {} as any,
};

const mockNarrative: RefractedNarrative = {
    id: 'narrative-1',
    careTeamId: 'team-1',
    generatedAt: {} as any,
    strengthsSummary: 'Maya demonstrates remarkable capacity for deep connection when given appropriate sensory support. Over 8 documented moments of mutual recognition show her ability to engage meaningfully with caregivers who recognize her communication style.',
    communicationPatterns: ['Seeking Safety (5 times)', 'Sensory Need (4 times)', 'Connection Bid (3 times)'],
    effectiveApproaches: ['Responsive co-regulation', 'Recognition of body-based communication', 'Quiet transition warnings'],
    environmentalConsiderations: ['Transitions require additional support', 'Loud environments increase dysregulation', 'Morning routines are anchoring'],
    classroomStrategies: ['Provide visual schedules', 'Offer sensory breaks proactively', 'Use calm, predictable voice', 'Allow processing time'],
    transitionSupports: ['5-minute and 1-minute warnings', 'Transition object (purple stone)', 'Movement break before major transitions'],
    sensoryConsiderations: ['Seeks deep pressure', 'Avoids sudden loud sounds', 'Benefits from weighted lap pad'],
    observationCount: 12,
    dateRange: { start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), end: new Date() },
};

const mockPublished: PublishedObservation[] = [
    {
        id: '1',
        originalId: 'obs-1',
        careTeamId: 'team-1',
        strengthNarrative: 'During a challenging transition, Maya communicated her need for space by moving to the quiet corner. When I acknowledged her signal and gave her time, she rejoined the activity with full engagement.',
        communicationChannels: ['Seeking Safety', 'Body Wisdom'],
        effectiveStrategies: ['Verbal acknowledgment', 'Allowed self-regulation'],
        reciprocityLevel: 'High',
        biologicalContext: 'Post-lunch energy shift',
        publishedAt: {} as any,
        publishedBy: 'parent-1',
        isRedacted: false,
    },
    {
        id: '2',
        originalId: 'obs-2',
        careTeamId: 'team-1',
        strengthNarrative: 'Maya showed connection through parallel play with her sister. No words exchanged, but deep co-presence. She shared her weighted blanket—a significant gesture of trust.',
        communicationChannels: ['Connection Bid', 'Joy Expression'],
        effectiveStrategies: ['No verbal demands', 'Presence without pressure'],
        reciprocityLevel: 'High',
        biologicalContext: 'Regulated state',
        publishedAt: {} as any,
        publishedBy: 'parent-1',
        isRedacted: false,
    },
];

export const ProfessionalDashboard = ({
    careTeamId: _careTeamId,
    practitionerName,
    childName
}: ProfessionalDashboardProps) => {
    const [loading, setLoading] = useState(true);
    const [careTeam] = useState<CareTeam>(mockCareTeam);
    const [narrative] = useState<RefractedNarrative>(mockNarrative);
    const [published] = useState<PublishedObservation[]>(mockPublished);
    const [activeTab, setActiveTab] = useState<'overview' | 'narratives' | 'strategies'>('overview');

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'rgb(var(--glass-base))' }}>
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-[#D4AF37] mx-auto mb-4" />
                    <p className="text-sm opacity-70">Loading care plan...</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen pb-8"
            style={{ backgroundColor: 'rgb(var(--glass-base))' }}
        >
            {/* PREMIUM HEADER */}
            <header className="gold-leaf-border p-6 m-4 rounded-[24px]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-[#D4AF37]/20">
                            <Shield className="w-6 h-6 text-[#D4AF37]" />
                        </div>
                        <div>
                            <h1
                                className="text-2xl"
                                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                            >
                                {childName}'s Care Plan
                            </h1>
                            <p className="text-xs opacity-60">
                                Shared with {practitionerName} • {careTeam.members.length} team members
                            </p>
                        </div>
                    </div>
                    <div className="village-badge px-3 py-1 rounded-lg text-xs">
                        Village Tier
                    </div>
                </div>

                {/* DATA SOVEREIGNTY NOTICE */}
                <div className="flex items-center gap-2 p-3 rounded-xl bg-white/30 text-xs">
                    <Lock className="w-4 h-4 text-[#4B0082]" />
                    <span style={{ color: 'var(--text-primary)' }}>
                        You are viewing <strong>published strength narratives</strong> only.
                        Private reflections remain with the family.
                    </span>
                </div>
            </header>

            {/* REGULATION GLOW SUMMARY */}
            <div className="mx-4 mb-4 p-6 rounded-[24px] glass-panel premium-glow">
                <div className="flex items-center gap-2 mb-4">
                    <Heart className="w-5 h-5 text-[#D4AF37]" />
                    <h2 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                        Regulation Overview
                    </h2>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 rounded-xl bg-white/30">
                        <p className="text-2xl font-bold text-[#D4AF37]">{narrative.observationCount}</p>
                        <p className="text-xs opacity-60">Observations</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/30">
                        <p className="text-2xl font-bold text-[#4B0082]">
                            {published.filter(p => p.reciprocityLevel === 'High').length}
                        </p>
                        <p className="text-xs opacity-60">High Connection</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/30">
                        <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>30</p>
                        <p className="text-xs opacity-60">Day Window</p>
                    </div>
                </div>
            </div>

            {/* TAB NAVIGATION */}
            <div className="flex gap-2 mx-4 mb-4">
                {[
                    { id: 'overview', label: 'Strengths', icon: Sparkles },
                    { id: 'narratives', label: 'Narratives', icon: MessageCircle },
                    { id: 'strategies', label: 'Strategies', icon: Brain },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${activeTab === tab.id
                            ? 'bg-[#4B0082] text-white'
                            : 'bg-white/30 text-[#1A1A1A]/70'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* TAB CONTENT */}
            <div className="mx-4">
                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <div className="space-y-4 fade-in">
                        {/* Strengths Summary */}
                        <div className="glass-panel p-5 rounded-[24px] border-l-4 border-[#D4AF37]">
                            <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                                <Heart className="w-4 h-4 text-[#D4AF37]" />
                                Strengths Summary
                            </h3>
                            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                                {narrative.strengthsSummary}
                            </p>
                        </div>

                        {/* Communication Patterns */}
                        <div className="glass-panel p-5 rounded-[24px]">
                            <h3 className="font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                                Communication Patterns
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {narrative.communicationPatterns.map((pattern, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 rounded-lg text-sm bg-[#4B0082]/10 text-[#4B0082] border border-[#4B0082]/20"
                                    >
                                        {pattern}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Environmental Considerations */}
                        <div className="glass-panel p-5 rounded-[24px]">
                            <h3 className="font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                                Environmental Considerations
                            </h3>
                            <ul className="space-y-2">
                                {narrative.environmentalConsiderations.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-primary)' }}>
                                        <Brain className="w-4 h-4 text-[#4B0082] shrink-0 mt-0.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* NARRATIVES TAB */}
                {activeTab === 'narratives' && (
                    <div className="space-y-4 fade-in">
                        {published.map(obs => (
                            <div key={obs.id} className="glass-panel p-5 rounded-[24px]">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Eye className="w-4 h-4 text-[#4B0082]" />
                                        <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                                            Published Observation
                                        </span>
                                    </div>
                                    <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${obs.reciprocityLevel === 'High'
                                        ? 'bg-[#D4AF37]/20 text-[#D4AF37]'
                                        : 'bg-[#4B0082]/10 text-[#4B0082]'
                                        }`}>
                                        {obs.reciprocityLevel} Connection
                                    </span>
                                </div>

                                <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-primary)' }}>
                                    {obs.strengthNarrative}
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {obs.communicationChannels.map((channel, i) => (
                                        <span
                                            key={i}
                                            className="px-2 py-1 rounded-lg text-xs bg-white/40"
                                        >
                                            {channel}
                                        </span>
                                    ))}
                                </div>

                                {obs.effectiveStrategies.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-white/20">
                                        <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2">
                                            Effective Approaches
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {obs.effectiveStrategies.map((strategy, i) => (
                                                <span
                                                    key={i}
                                                    className="px-2 py-1 rounded-lg text-xs bg-green-50 text-green-700 border border-green-200"
                                                >
                                                    {strategy}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* STRATEGIES TAB */}
                {activeTab === 'strategies' && (
                    <div className="space-y-4 fade-in">
                        {/* Classroom Strategies */}
                        <div className="glass-panel p-5 rounded-[24px] border-l-4 border-green-500">
                            <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                                <Shield className="w-4 h-4 text-green-600" />
                                Classroom Strategies
                            </h3>
                            <ul className="space-y-2">
                                {narrative.classroomStrategies.map((strategy, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-primary)' }}>
                                        <ChevronRight className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                                        {strategy}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Transition Supports */}
                        <div className="glass-panel p-5 rounded-[24px]">
                            <h3 className="font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                                Transition Supports
                            </h3>
                            <ul className="space-y-2">
                                {narrative.transitionSupports.map((support, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-primary)' }}>
                                        <Calendar className="w-4 h-4 text-[#4B0082] shrink-0 mt-0.5" />
                                        {support}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Sensory Considerations */}
                        <div className="glass-panel p-5 rounded-[24px]">
                            <h3 className="font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                                Sensory Considerations
                            </h3>
                            <ul className="space-y-2">
                                {narrative.sensoryConsiderations.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-primary)' }}>
                                        <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            {/* DOWNLOAD IEP BRIDGE */}
            <div className="mx-4 mt-6">
                <button className="w-full gold-leaf-border p-4 rounded-[24px] flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform premium-glow">
                    <Download className="w-5 h-5 text-[#D4AF37]" />
                    <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                        Download IEP Bridge Care Plan
                    </span>
                    <FileText className="w-5 h-5 text-[#D4AF37]" />
                </button>
                <p className="text-xs text-center opacity-50 mt-2">
                    PDF formatted for IEP meetings and care coordination
                </p>
            </div>

            {/* TEAM MEMBERS */}
            <div className="mx-4 mt-6 glass-panel p-5 rounded-[24px]">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        <Users className="w-4 h-4 text-[#4B0082]" />
                        Care Team
                    </h3>
                    <span className="text-xs opacity-60">{careTeam.members.length} members</span>
                </div>
                <div className="space-y-3">
                    {careTeam.members.map((member, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#4B0082]/10 flex items-center justify-center">
                                <span className="font-bold text-[#4B0082]">{member.name[0]}</span>
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                                    {member.name}
                                </p>
                                <p className="text-xs opacity-60">{member.title || member.role}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-lg text-xs ${member.status === 'active'
                                ? 'bg-green-50 text-green-700'
                                : 'bg-yellow-50 text-yellow-700'
                                }`}>
                                {member.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* DATA SOVEREIGNTY FOOTER */}
            <div className="mx-4 mt-6 text-center">
                <p className="text-xs opacity-50 flex items-center justify-center gap-2">
                    <Lock className="w-3 h-3" />
                    Data sovereignty protected. Private reflections never shared.
                </p>
            </div>
        </div>
    );
};

// Default export for preview
export default function ProfessionalDashboardPreview() {
    return (
        <ProfessionalDashboard
            careTeamId="team-1"
            practitionerName="Ms. Sarah"
            childName="Maya"
        />
    );
}
