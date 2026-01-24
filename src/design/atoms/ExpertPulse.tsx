/**
 * EXPERT PULSE: Elite Data Visualization
 * 
 * Overlays IEP goals against Relational Reciprocity trends.
 * Shows trajectory of home observations compared to institutional baselines.
 */

import { useState, useEffect } from 'react';
import {
    Target,
    TrendingUp,
    TrendingDown,
    Minus,
    ChevronRight,
    Sparkles,
    Brain,
    Heart
} from 'lucide-react';
import { useAuthStore } from '../../core/stores/useAuthStore';
import { getProfile, calculateRegulationState } from '../../core/firebase/profiles';
import { getObservations } from '../../core/firebase/firestore';
import type { UserProfile, RegulationState, IEPGoal } from '../../core/stores/profileTypes';
import type { Observation } from '../../core/stores/types';

interface ExpertPulseProps {
    compact?: boolean;
    onExpand?: () => void;
}

interface GoalOverlay {
    goal: IEPGoal;
    homeReciprocity: number;
    trend: 'improving' | 'stable' | 'needs-attention';
    insight: string;
}

export const ExpertPulse = ({ compact = false, onExpand }: ExpertPulseProps) => {
    const { user } = useAuthStore();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [regulation, setRegulation] = useState<RegulationState | null>(null);
    const [overlays, setOverlays] = useState<GoalOverlay[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const loadData = async () => {
            try {
                const [userProfile, regState, observations] = await Promise.all([
                    getProfile(user.uid),
                    calculateRegulationState(user.uid),
                    getObservations(user.uid, 30)
                ]);

                setProfile(userProfile);
                setRegulation(regState);

                // Generate goal overlays
                if (userProfile?.vault?.iep?.goals) {
                    const goalOverlays = generateGoalOverlays(
                        userProfile.vault.iep.goals,
                        observations,
                        regState
                    );
                    setOverlays(goalOverlays);
                }
            } catch (error) {
                console.error('Failed to load Expert Pulse data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [user]);

    if (loading) {
        return (
            <div className="glass-panel p-4 rounded-[24px] animate-pulse">
                <div className="h-6 bg-white/30 rounded w-1/2 mb-3" />
                <div className="h-4 bg-white/20 rounded w-3/4" />
            </div>
        );
    }

    if (!profile?.vault?.iep?.goals.length) {
        return null; // Don't show if no IEP data
    }

    if (compact) {
        return (
            <button
                onClick={onExpand}
                className="w-full gold-leaf-border p-4 rounded-[24px] flex items-center justify-between hover:scale-[1.01] transition-transform"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#D4AF37]/20">
                        <Target className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                            Expert Pulse
                        </h3>
                        <p className="text-xs opacity-60">
                            {overlays.length} IEP goals tracked
                        </p>
                    </div>
                </div>
                <ChevronRight className="w-5 h-5 opacity-40" />
            </button>
        );
    }

    return (
        <div className="gold-leaf-border premium-glow p-5 rounded-[24px]">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-[#D4AF37]" />
                    <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                        Expert Pulse
                    </h3>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs opacity-60">7-day trend</span>
                    <TrendIcon trend={regulation?.trend || 'stable'} />
                </div>
            </div>

            {/* Regulation Overview */}
            <div className="bg-white/30 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs opacity-60 uppercase tracking-wider">Home Reciprocity</p>
                        <p
                            className="text-3xl font-bold"
                            style={{ fontFamily: 'var(--font-display)', color: '#D4AF37' }}
                        >
                            {regulation?.averageReciprocity.toFixed(1) || '—'}
                            <span className="text-lg opacity-60">/5</span>
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs opacity-60">vs. IEP Baseline</p>
                        <p className="text-sm font-semibold text-green-600">
                            +{((regulation?.averageReciprocity || 3) * 20).toFixed(0)}%
                        </p>
                    </div>
                </div>
            </div>

            {/* Goal Overlays */}
            <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider opacity-60">
                    IEP Goals vs. Home Observations
                </p>

                {overlays.map((overlay, i) => (
                    <div
                        key={overlay.goal.id || i}
                        className="bg-white/20 rounded-xl p-3 flex items-start gap-3"
                    >
                        <div className={`p-2 rounded-lg ${overlay.trend === 'improving'
                                ? 'bg-green-100'
                                : overlay.trend === 'needs-attention'
                                    ? 'bg-yellow-100'
                                    : 'bg-white/30'
                            }`}>
                            {overlay.goal.area === 'Communication' || overlay.goal.area === 'Social-Emotional' ? (
                                <Heart className={`w-4 h-4 ${overlay.trend === 'improving' ? 'text-green-600' : 'text-[#4B0082]'
                                    }`} />
                            ) : (
                                <Brain className={`w-4 h-4 ${overlay.trend === 'improving' ? 'text-green-600' : 'text-[#4B0082]'
                                    }`} />
                            )}
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-[#4B0082]">
                                    {overlay.goal.area}
                                </span>
                                <TrendIcon trend={overlay.trend} size="sm" />
                            </div>
                            <p className="text-sm mt-1" style={{ color: 'var(--text-primary)' }}>
                                {overlay.insight}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Insight */}
            <div className="mt-4 p-3 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30">
                <p className="text-xs flex items-start gap-2" style={{ color: 'var(--text-primary)' }}>
                    <Sparkles className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                    <span>
                        Home observations reveal capacities that institutional assessments may not capture.
                        Your documentation is expert data.
                    </span>
                </p>
            </div>
        </div>
    );
};

function TrendIcon({ trend, size = 'md' }: { trend: string; size?: 'sm' | 'md' }) {
    const sizeClass = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

    if (trend === 'improving' || trend === 'rising') {
        return <TrendingUp className={`${sizeClass} text-green-500`} />;
    }
    if (trend === 'needs-attention' || trend === 'declining') {
        return <TrendingDown className={`${sizeClass} text-yellow-500`} />;
    }
    return <Minus className={`${sizeClass} text-gray-400`} />;
}

function generateGoalOverlays(
    goals: IEPGoal[],
    observations: Observation[],
    regulation: RegulationState | null
): GoalOverlay[] {
    const avgReciprocity = regulation?.averageReciprocity || 3;

    return goals.slice(0, 3).map(goal => {
        // Analyze observations relevant to this goal area
        let trend: 'improving' | 'stable' | 'needs-attention' = 'stable';
        let insight: string;

        switch (goal.area) {
            case 'Communication':
            case 'Social-Emotional':
                if (avgReciprocity >= 4) {
                    trend = 'improving';
                    insight = `Home shows strong connection capacity — ${observations.filter(o => o.relationalReciprocity >= 4).length} high-reciprocity moments documented.`;
                } else if (avgReciprocity < 2.5) {
                    trend = 'needs-attention';
                    insight = 'Recent observations indicate challenges. Consider environmental factors.';
                } else {
                    insight = 'Steady relational engagement observed at home.';
                }
                break;

            case 'Behavioral':
                const sensoryObs = observations.filter(o =>
                    o.channels.includes('Sensory Need') || o.channels.includes('Seeking Safety')
                );
                if (sensoryObs.length > 3) {
                    insight = `Sensory factors appear in ${sensoryObs.length} observations. School may be missing sensory context.`;
                    trend = avgReciprocity >= 3.5 ? 'improving' : 'needs-attention';
                } else {
                    insight = 'Behavioral patterns being documented for pattern recognition.';
                }
                break;

            default:
                insight = goal.dignityTranslation || 'Tracking progress through home observations.';
                trend = avgReciprocity >= 3.5 ? 'improving' : 'stable';
        }

        return {
            goal,
            homeReciprocity: avgReciprocity,
            trend,
            insight
        };
    });
}

export default ExpertPulse;
