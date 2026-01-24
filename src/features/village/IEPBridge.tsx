/**
 * IEP BRIDGE: Professional Data Synthesis + Neural Trajectory Analysis
 * 
 * Transforms home observations into dignity-centered,
 * data-driven summaries for professional care teams.
 * 
 * NEW: Recursive Trajectory Graphs & Systems-Informed Narratives
 * - Non-linear relationship analysis (Home ↔ School)
 * - Phase Transition detection
 * - Neural Glossary framing (Emergence, Feedback Loops, Weighting)
 * 
 * Tone: Professional, evidence-based, child-honoring, parent-as-expert
 */

import { useState, useEffect } from 'react';
import {
    FileText,
    Brain,
    Heart,
    Sparkles,
    Calendar,
    Download,
    Loader2,
    Shield,
    Zap,
    TrendingUp,
    GitBranch,
    Activity,
    AlertTriangle,
    BookOpen
} from 'lucide-react';
import { useAuthStore } from '../../core/stores/useAuthStore';
import { generateIEPSummary } from '../../core/firebase/teams';
import { getObservations } from '../../core/firebase/firestore';
import {
    processEmergence,
    calculateSystemicEntropy,
    generateIEPTrajectoryNarrative,
    detectPhaseTransitions,
    calculateIdentityEmergence,
    generateCarePlanNarrative,
    renderCarePlanToHTML,
    type EmergentPattern,
    type SystemicState,
    type PhaseTransition,
    type IdentityEmergenceLayer,
    type CarePlanNarrative
} from '../../lib/ai/agents/oracle';
import type { IEPSummary } from '../../core/stores/teamTypes';
import type { Observation } from '../../core/stores/types';

export const IEPBridge = () => {
    const { user } = useAuthStore();
    const [summary, setSummary] = useState<IEPSummary | null>(null);
    const [loading, setLoading] = useState(false);
    const [observations, setObservations] = useState<Observation[]>([]);
    const [patterns, setPatterns] = useState<EmergentPattern[]>([]);
    const [systemicState, setSystemicState] = useState<SystemicState | null>(null);
    const [transitions, setTransitions] = useState<PhaseTransition[]>([]);
    const [identity, setIdentity] = useState<IdentityEmergenceLayer | null>(null);
    const [trajectoryNarrative, setTrajectoryNarrative] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'summary' | 'trajectory' | 'export'>('summary');

    // Care Plan generation state
    const [_carePlan, setCarePlan] = useState<CarePlanNarrative | null>(null);
    const [isGeneratingCarePlan, setIsGeneratingCarePlan] = useState(false);
    const [showVillageModal, setShowVillageModal] = useState(false);

    const [dateRange] = useState({
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        end: new Date()
    });

    const handleGenerate = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const [result, obs] = await Promise.all([
                generateIEPSummary(user.uid, 'current', dateRange),
                getObservations(user.uid, 50)
            ]);
            setSummary(result);
            setObservations(obs);

            // Neural Core Analysis
            if (obs.length >= 5) {
                const emergentPatterns = processEmergence(obs);
                setPatterns(emergentPatterns);

                const entropy = calculateSystemicEntropy(obs);
                setSystemicState(entropy);

                const phaseTransitions = detectPhaseTransitions(obs);
                setTransitions(phaseTransitions);

                const identityLayer = calculateIdentityEmergence(obs);
                setIdentity(identityLayer);

                // Generate trajectory narrative
                const narrative = generateIEPTrajectoryNarrative(
                    obs,
                    'Your Child', // Would come from profile
                    emergentPatterns,
                    entropy
                );
                setTrajectoryNarrative(narrative);
            }
        } catch (error) {
            console.error('Failed to generate IEP summary:', error);
        } finally {
            setLoading(false);
        }
    };

    // Auto-generate on mount
    useEffect(() => {
        if (user) {
            handleGenerate();
        }
    }, [user]);

    // Export to clipboard (would be PDF in production)
    const handleExportTrajectory = () => {
        navigator.clipboard.writeText(trajectoryNarrative);
        alert('Trajectory Report copied to clipboard! In production, this would generate a PDF.');
    };

    // Generate Sovereign Care Plan and open print dialog
    const handleGenerateCarePlan = async () => {
        if (observations.length < 5) {
            setShowVillageModal(true);
            return;
        }

        setIsGeneratingCarePlan(true);

        // Simulate processing with shimmer animation
        await new Promise(r => setTimeout(r, 1500));

        try {
            const plan = generateCarePlanNarrative(
                observations,
                'Your Child', // Would come from profile
                'Parent/Guardian'
            );
            setCarePlan(plan);

            // Render to HTML and open print dialog
            const html = renderCarePlanToHTML(plan);
            const printWindow = window.open('', '_blank');
            if (printWindow) {
                printWindow.document.write(html);
                printWindow.document.close();
                printWindow.focus();
                // Auto-print after a brief delay for fonts to load
                setTimeout(() => printWindow.print(), 500);
            }
        } catch (error) {
            console.error('Failed to generate care plan:', error);
        } finally {
            setIsGeneratingCarePlan(false);
        }
    };

    return (
        <div className="flex flex-col h-full pt-6 pb-32 px-4 fade-in overflow-y-auto">

            {/* HEADER */}
            <header className="mb-6">
                <h2 className="text-sm font-bold tracking-widest text-[#4B0082] uppercase opacity-80">
                    IEP Bridge
                </h2>
                <h1
                    className="text-3xl mt-1"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                >
                    Neural Trajectory Analysis
                </h1>
                <p className="text-sm mt-2 opacity-70" style={{ color: 'var(--text-secondary)' }}>
                    Systems-informed insights that position you as the lead expert.
                </p>
            </header>

            {/* TAB NAVIGATION */}
            <div className="flex gap-2 mb-4">
                {(['summary', 'trajectory', 'export'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-2 px-3 rounded-xl text-sm font-semibold transition-all ${activeTab === tab
                            ? 'bg-[#4B0082] text-white'
                            : 'bg-white/40 text-[#4B0082] hover:bg-white/60'
                            }`}
                    >
                        {tab === 'summary' && 'Summary'}
                        {tab === 'trajectory' && 'Neural Analysis'}
                        {tab === 'export' && 'Export'}
                    </button>
                ))}
            </div>

            {/* DATE RANGE SELECTOR */}
            <div className="glass-panel p-4 rounded-[24px] mb-4">
                <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-[#4B0082]" />
                    <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                        Observation Period
                    </span>
                </div>
                <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                    Last 30 days ({dateRange.start.toLocaleDateString()} - {dateRange.end.toLocaleDateString()})
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs opacity-60">
                    <span>{observations.length} observations analyzed</span>
                    {patterns.length > 0 && <span>• {patterns.length} patterns detected</span>}
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="mt-3 px-4 py-2 rounded-xl text-sm font-semibold bg-[#4B0082] text-white hover:bg-[#6B238E] transition-colors disabled:opacity-50"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Analyzing Neural Patterns...
                        </span>
                    ) : (
                        'Refresh Analysis'
                    )}
                </button>
            </div>

            {/* LOADING STATE */}
            {loading && !summary && (
                <div className="glass-panel p-8 rounded-[24px] text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-[#4B0082] mx-auto mb-4" />
                    <p className="text-sm opacity-70">Synthesizing observation patterns...</p>
                    <p className="text-xs opacity-50 mt-2">Detecting emergence, feedback loops, and phase transitions...</p>
                </div>
            )}

            {/* SUMMARY TAB */}
            {activeTab === 'summary' && summary && (
                <>
                    {/* NARRATIVE SUMMARY */}
                    <div className="glass-panel p-4 rounded-[24px] mb-4 border-l-4 border-[#D4AF37]">
                        <div className="flex items-center gap-2 mb-3">
                            <FileText className="w-4 h-4 text-[#D4AF37]" />
                            <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                                Professional Summary
                            </span>
                        </div>
                        <p
                            className="text-base leading-relaxed"
                            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
                        >
                            {summary.narrativeSummary}
                        </p>
                        <div className="mt-3 flex items-center gap-4 text-xs opacity-60">
                            <span>{summary.observationCount} observations</span>
                            <span>•</span>
                            <span>Avg. Reciprocity: {summary.averageReciprocity}/5</span>
                        </div>
                    </div>

                    {/* ATMOSPHERIC TRIGGERS */}
                    <div className="glass-panel p-4 rounded-[24px] mb-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Zap className="w-4 h-4 text-[#4B0082]" />
                            <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                                Atmospheric Resonance
                            </span>
                        </div>
                        <p className="text-xs opacity-60 mb-3">
                            Systemic factors observed in challenging moments
                        </p>
                        {summary.atmosphericTriggers.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {summary.atmosphericTriggers.map((trigger, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200"
                                    >
                                        {trigger}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm opacity-50 italic">No distinct patterns identified</p>
                        )}
                    </div>

                    {/* BIOLOGICAL RHYTHMS */}
                    <div className="glass-panel p-4 rounded-[24px] mb-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Brain className="w-4 h-4 text-[#4B0082]" />
                            <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                                Biological Rhythms
                            </span>
                        </div>
                        <p className="text-xs opacity-60 mb-3">
                            Sensory and physical patterns observed
                        </p>
                        {summary.biologicalRhythms.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {summary.biologicalRhythms.map((rhythm, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 rounded-lg text-sm bg-blue-50 text-blue-700 border border-blue-200"
                                    >
                                        {rhythm}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm opacity-50 italic">Insufficient data for patterns</p>
                        )}
                    </div>

                    {/* EFFECTIVE STRATEGIES */}
                    <div className="glass-panel p-4 rounded-[24px] mb-4 border-l-4 border-green-500">
                        <div className="flex items-center gap-2 mb-3">
                            <Heart className="w-4 h-4 text-green-600" />
                            <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                                What Works at Home
                            </span>
                        </div>
                        {summary.effectiveStrategies.length > 0 ? (
                            <ul className="space-y-2">
                                {summary.effectiveStrategies.map((strategy, i) => (
                                    <li
                                        key={i}
                                        className="flex items-start gap-2 text-sm"
                                        style={{ color: 'var(--text-primary)' }}
                                    >
                                        <Shield className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                        {strategy}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm opacity-50 italic">
                                Continue documenting moments of connection to identify effective strategies
                            </p>
                        )}
                    </div>
                </>
            )}

            {/* TRAJECTORY TAB */}
            {activeTab === 'trajectory' && (
                <>
                    {/* IDENTITY EMERGENCE PROFILE */}
                    {identity && (
                        <div className="glass-panel p-4 rounded-[24px] mb-4 border-l-4 border-[#D4AF37]">
                            <div className="flex items-center gap-2 mb-3">
                                <GitBranch className="w-4 h-4 text-[#D4AF37]" />
                                <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                                    Identity Emergence Profile
                                </span>
                            </div>
                            <p className="text-xs opacity-60 mb-3">
                                Hidden layer variables representing emergent identity properties
                            </p>
                            <div className="space-y-3">
                                {[
                                    { label: 'Sensory Processing', value: identity.sensoryProfile, color: '#4B0082' },
                                    { label: 'Regulation Capacity', value: identity.regulationCapacity, color: '#2E8B57' },
                                    { label: 'Connection Need', value: identity.connectionNeed, color: '#D4AF37' },
                                    { label: 'Environmental Sensitivity', value: identity.environmentalSensitivity, color: '#4682B4' },
                                    { label: 'Adaptation Rate', value: identity.adaptationRate, color: '#6B238E' },
                                ].map((dim, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span>{dim.label}</span>
                                            <span style={{ color: dim.color }}>{(dim.value * 100).toFixed(0)}%</span>
                                        </div>
                                        <div className="h-2 bg-black/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all"
                                                style={{
                                                    width: `${dim.value * 100}%`,
                                                    backgroundColor: dim.color,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* EMERGENT PATTERNS */}
                    {patterns.length > 0 && (
                        <div className="glass-panel p-4 rounded-[24px] mb-4">
                            <div className="flex items-center gap-2 mb-3">
                                <TrendingUp className="w-4 h-4 text-[#4B0082]" />
                                <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                                    Emergent Patterns
                                </span>
                            </div>
                            <p className="text-xs opacity-60 mb-3">
                                Recursive patterns detected through neural analysis
                            </p>
                            <div className="space-y-3">
                                {patterns.slice(0, 4).map((pattern) => (
                                    <div
                                        key={pattern.id}
                                        className="p-3 rounded-xl bg-white/30 border-l-3"
                                        style={{ borderLeftWidth: 3, borderLeftColor: getPatternColor(pattern.patternType) }}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                                    {pattern.description}
                                                </p>
                                                <p className="text-xs opacity-60 mt-1">
                                                    <strong>Trigger:</strong> {pattern.triggerCondition}
                                                </p>
                                                <p className="text-xs opacity-60">
                                                    <strong>Outcome:</strong> {pattern.outcome}
                                                </p>
                                            </div>
                                            <span
                                                className="text-xs px-2 py-1 rounded-full"
                                                style={{
                                                    backgroundColor: `${getPatternColor(pattern.patternType)}20`,
                                                    color: getPatternColor(pattern.patternType),
                                                }}
                                            >
                                                {(pattern.confidence * 100).toFixed(0)}%
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* PHASE TRANSITIONS */}
                    {transitions.length > 0 && (
                        <div className="glass-panel p-4 rounded-[24px] mb-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Activity className="w-4 h-4 text-[#4B0082]" />
                                <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                                    Phase Transitions
                                </span>
                            </div>
                            <p className="text-xs opacity-60 mb-3">
                                Tipping points where small changes created large state shifts
                            </p>
                            <div className="space-y-2">
                                {transitions.slice(0, 3).map((t) => (
                                    <div key={t.id} className="flex items-center gap-3 p-2 rounded-lg bg-white/20">
                                        <div className="flex items-center gap-1 text-xs">
                                            <span className={`px-2 py-0.5 rounded ${getStateStyle(t.fromState)}`}>
                                                {t.fromState}
                                            </span>
                                            <span>→</span>
                                            <span className={`px-2 py-0.5 rounded ${getStateStyle(t.toState)}`}>
                                                {t.toState}
                                            </span>
                                        </div>
                                        <div className="flex-1 text-xs opacity-60">
                                            {t.triggeringFactors[0]}
                                        </div>
                                        {t.warning && (
                                            <AlertTriangle className="w-3 h-3 text-amber-500" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SYSTEMIC STATE */}
                    {systemicState && (
                        <div className="glass-panel p-4 rounded-[24px] mb-4">
                            <div className="flex items-center gap-2 mb-3">
                                <BookOpen className="w-4 h-4 text-[#4B0082]" />
                                <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                                    Systemic State
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="text-center p-3 rounded-xl bg-white/30">
                                    <p className="text-2xl font-bold" style={{ color: systemicState.entropy > 0.6 ? '#4B0082' : '#D4AF37' }}>
                                        {(systemicState.entropy * 100).toFixed(0)}%
                                    </p>
                                    <p className="text-xs opacity-60">Entropy</p>
                                </div>
                                <div className="text-center p-3 rounded-xl bg-white/30">
                                    <p className="text-2xl font-bold" style={{ color: systemicState.coherence > 0.7 ? '#D4AF37' : '#4B0082' }}>
                                        {(systemicState.coherence * 100).toFixed(0)}%
                                    </p>
                                    <p className="text-xs opacity-60">Coherence</p>
                                </div>
                                <div className="text-center p-3 rounded-xl bg-white/30">
                                    <p className="text-2xl font-bold" style={{ color: getMomentumColor(systemicState.momentum) }}>
                                        {systemicState.momentum === 'rising' ? '↑' : systemicState.momentum === 'declining' ? '↓' : '→'}
                                    </p>
                                    <p className="text-xs opacity-60">Momentum</p>
                                </div>
                            </div>

                            {/* Feedback Loops */}
                            {systemicState.feedbackLoops.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-xs font-semibold opacity-60 mb-2">Active Feedback Loops</p>
                                    {systemicState.feedbackLoops.map(loop => (
                                        <div
                                            key={loop.id}
                                            className={`flex items-center gap-2 p-2 rounded-lg mb-2 ${loop.type === 'amplifying' ? 'bg-[#4B0082]/10' : 'bg-[#D4AF37]/10'
                                                }`}
                                        >
                                            <span>{loop.type === 'amplifying' ? '🔄' : '⚖️'}</span>
                                            <span className="text-xs flex-1">{loop.description}</span>
                                            <span className="text-xs opacity-60">{(loop.strength * 100).toFixed(0)}%</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* EXPORT TAB */}
            {activeTab === 'export' && (
                <>
                    <div className="glass-panel p-4 rounded-[24px] mb-4 border-l-4 border-[#D4AF37]">
                        <div className="flex items-center gap-2 mb-3">
                            <FileText className="w-4 h-4 text-[#D4AF37]" />
                            <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                                IEP Trajectory Report
                            </span>
                        </div>
                        <p className="text-xs opacity-60 mb-3">
                            A systems-informed analysis for your IEP team meeting. Uses the Neural Glossary
                            (Emergence, Feedback Loops, Weighting, Phase Transitions) to position you as
                            the lead systems expert.
                        </p>

                        {trajectoryNarrative ? (
                            <div
                                className="p-3 rounded-xl bg-white/30 text-xs max-h-64 overflow-y-auto"
                                style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}
                            >
                                {trajectoryNarrative.slice(0, 500)}...
                            </div>
                        ) : (
                            <p className="text-sm opacity-50 italic">
                                Needs at least 5 observations to generate trajectory report
                            </p>
                        )}
                    </div>

                    {/* EXPORT ACTIONS */}
                    <div className="flex flex-col gap-3 mb-4">
                        <button
                            onClick={handleExportTrajectory}
                            disabled={!trajectoryNarrative}
                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl gold-leaf-border font-semibold hover:scale-[1.02] transition-all disabled:opacity-50"
                            style={{
                                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(75, 0, 130, 0.1) 100%)',
                                color: '#D4AF37',
                            }}
                        >
                            <Download className="w-4 h-4" />
                            Export Neural Trajectory Report (PDF)
                        </button>

                        <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#4B0082] text-white font-semibold hover:bg-[#6B238E] transition-colors">
                            <Download className="w-4 h-4" />
                            Export Standard Summary
                        </button>

                        <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/40 border border-white/60 font-semibold hover:bg-white/60 transition-colors">
                            <Sparkles className="w-4 h-4 text-[#4B0082]" />
                            Share with Care Team
                        </button>
                    </div>

                    {/* NEURAL GLOSSARY REMINDER */}
                    <div className="glass-panel p-4 rounded-[24px] mb-4">
                        <div className="flex items-center gap-2 mb-3">
                            <BookOpen className="w-4 h-4 text-[#4B0082]" />
                            <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                                Neural Glossary Terms Used
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {['Emergence', 'Feedback Loop', 'Weighting', 'Phase Transition', 'Backpropagation', 'Systemic Bias'].map(term => (
                                <span
                                    key={term}
                                    className="px-2 py-1 rounded-lg text-xs bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20"
                                >
                                    {term}
                                </span>
                            ))}
                        </div>
                        <p className="text-xs opacity-50 mt-3">
                            These terms help frame your observations as sophisticated systems analysis,
                            positioning you as the lead expert on your child's nervous system.
                        </p>
                    </div>

                    {/* DIGNITY STATEMENT */}
                    <p className="text-xs opacity-50 text-center flex items-center justify-center gap-2">
                        <Shield className="w-3 h-3" />
                        This data centers your child's dignity and unique communication style.
                    </p>
                </>
            )}

            {/* SOVEREIGN CARE PLAN: PREMIUM FEATURE */}
            <div className="mt-6 p-5 rounded-[28px] gold-leaf-border relative overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(75, 0, 130, 0.08) 100%)',
                }}
            >
                {/* Progress Shimmer */}
                {isGeneratingCarePlan && (
                    <div className="absolute inset-0 overflow-hidden">
                        <div
                            className="absolute inset-0 -translate-x-full animate-shimmer"
                            style={{
                                background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.3), transparent)',
                            }}
                        />
                    </div>
                )}

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-full bg-[#D4AF37]/20">
                            <FileText className="w-6 h-6 text-[#D4AF37]" />
                        </div>
                        <div>
                            <h3
                                className="font-bold text-lg"
                                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                            >
                                Sovereign Care Plan
                            </h3>
                            <p className="text-xs opacity-60">
                                Printable professional document for IEP meetings
                            </p>
                        </div>
                    </div>

                    <p className="text-sm opacity-70 mb-4" style={{ color: 'var(--text-primary)' }}>
                        Generate a three-part comprehensive care plan featuring:
                    </p>

                    <ul className="space-y-2 mb-5">
                        {[
                            'Joy and Relational Strengths',
                            'Atmospheric Triggers & Biological Rhythms',
                            'Recommended Classroom Regulation Strategies',
                        ].map((item, i) => (
                            <li
                                key={i}
                                className="flex items-center gap-2 text-sm"
                                style={{ color: 'var(--text-primary)' }}
                            >
                                <span className="text-[#D4AF37]">✦</span>
                                {item}
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={handleGenerateCarePlan}
                        disabled={isGeneratingCarePlan}
                        className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white flex items-center justify-center gap-2 hover:shadow-xl transition-all disabled:opacity-70"
                    >
                        {isGeneratingCarePlan ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Oracle is Synthesizing...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                Generate Individualized Care Plan
                            </>
                        )}
                    </button>

                    <p className="text-xs opacity-50 text-center mt-3">
                        Opens print-ready document with Playfair Display typography
                    </p>
                </div>
            </div>

            {/* VILLAGE SUBSCRIPTION MODAL */}
            {showVillageModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div
                        className="w-full max-w-md glass-panel rounded-[32px] p-6"
                        style={{ background: 'rgba(253, 248, 243, 0.98)' }}
                    >
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mx-auto mb-4">
                                <Heart className="w-8 h-8 text-[#D4AF37]" />
                            </div>
                            <h3
                                className="text-xl font-bold"
                                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                            >
                                Join the Village
                            </h3>
                            <p className="text-sm opacity-60 mt-2">
                                Premium features that bridge home and school
                            </p>
                        </div>

                        <div className="space-y-3 mb-6">
                            {[
                                'Unlimited Sovereign Care Plan exports',
                                'IEP Bridge with professional formatting',
                                'Team sharing and collaboration',
                                'Historical trajectory analysis',
                            ].map((feature, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-2 text-sm"
                                    style={{ color: 'var(--text-primary)' }}
                                >
                                    <span className="text-[#D4AF37]">✓</span>
                                    {feature}
                                </div>
                            ))}
                        </div>

                        <p className="text-xs opacity-60 text-center mb-4">
                            You need at least 5 observations to generate a Care Plan.
                            Continue capturing moments to unlock this feature.
                        </p>

                        <button
                            onClick={() => setShowVillageModal(false)}
                            className="w-full py-3 rounded-xl font-semibold bg-[#4B0082] text-white hover:bg-[#6B238E] transition-colors"
                        >
                            Continue Witnessing
                        </button>

                        <button
                            onClick={() => setShowVillageModal(false)}
                            className="w-full mt-2 py-2 text-sm opacity-60 hover:opacity-100"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}</style>

        </div>
    );
};

// Helper functions
function getPatternColor(type: EmergentPattern['patternType']): string {
    switch (type) {
        case 'biological-atmospheric': return '#4B0082';
        case 'channel-reciprocity': return '#D4AF37';
        case 'temporal-cycle': return '#4682B4';
        case 'stress-response': return '#DC2626';
        default: return '#4B0082';
    }
}

function getStateStyle(state: 'regulated' | 'seeking' | 'dysregulated'): string {
    switch (state) {
        case 'regulated': return 'bg-green-100 text-green-700';
        case 'seeking': return 'bg-amber-100 text-amber-700';
        case 'dysregulated': return 'bg-red-100 text-red-700';
    }
}

function getMomentumColor(momentum: 'rising' | 'stable' | 'declining'): string {
    switch (momentum) {
        case 'rising': return '#22C55E';
        case 'stable': return '#4B0082';
        case 'declining': return '#DC2626';
    }
}
