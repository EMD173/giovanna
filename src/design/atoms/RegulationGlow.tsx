/**
 * REGULATION GLOW: Bio-Responsive Neural Pulse Visualization
 * 
 * Now enhanced with Systemic Entropy visualization and Framer Motion physics:
 * - High Entropy (disconnect) → Erratic, irregular pulsing + surface vibration
 * - High Coherence (connected) → Steady, rhythmic Gold Shimmer
 * 
 * Physics: Liquid Glass surface that physically vibrates in response to trends
 * This is the visual heartbeat of the Sanctuary's Neural Core.
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, AlertTriangle, Activity, Waves } from 'lucide-react';
import { useAuthStore } from '../../core/stores/useAuthStore';
import { calculateRegulationState } from '../../core/firebase/profiles';
import { getObservations } from '../../core/firebase/firestore';
import { calculateSystemicEntropy, type SystemicState } from '../../lib/ai/agents/oracle';
import type { RegulationState } from '../../core/stores/profileTypes';

interface RegulationGlowProps {
    compact?: boolean;
}

export const RegulationGlow = ({ compact = false }: RegulationGlowProps) => {
    const { user } = useAuthStore();
    const [state, setState] = useState<RegulationState | null>(null);
    const [systemicState, setSystemicState] = useState<SystemicState | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchState = async () => {
            try {
                const [regulationResult, observations] = await Promise.all([
                    calculateRegulationState(user.uid),
                    getObservations(user.uid, 20),
                ]);
                setState(regulationResult);

                // Calculate systemic entropy from observations
                if (observations.length > 0) {
                    const entropy = calculateSystemicEntropy(observations);
                    setSystemicState(entropy);
                }
            } catch (error) {
                console.error('Failed to calculate regulation state:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchState();
    }, [user]);

    // Calculate visual properties based on state AND systemic entropy
    const getGlowStyles = () => {
        if (!state) {
            return {
                gradient: 'radial-gradient(circle at center, rgba(75, 0, 130, 0.2) 0%, rgba(253, 248, 243, 0) 70%)',
                blur: 60,
                pulseStyle: 'steady',
                pulseSpeed: 4,
                borderWidth: 0,
                erraticIntensity: 0,
            };
        }

        const { averageReciprocity, systemicStressLevel } = state;
        const entropy = systemicState?.entropy ?? 0.5;
        const coherence = systemicState?.coherence ?? 0.5;

        // High reciprocity = gold dominant
        // High stress = purple/ebony dominant
        const goldIntensity = (averageReciprocity - 1) / 4;  // 0-1 scale
        const purpleIntensity = systemicStressLevel;

        // Blend colors based on state
        const goldRgba = `rgba(212, 175, 55, ${0.15 + goldIntensity * 0.25})`;
        const purpleRgba = `rgba(75, 0, 130, ${0.15 + purpleIntensity * 0.25})`;
        const ebonyRgba = `rgba(26, 26, 26, ${purpleIntensity * 0.15})`;

        // High reciprocity = softer blur, high stress = sharper
        const blur = 60 - (purpleIntensity * 30);

        // NEURAL PULSE: Entropy affects pulse rhythm
        // High entropy = erratic, variable speed
        // High coherence = steady, rhythmic
        const erraticIntensity = entropy;
        const pulseStyle = entropy > 0.6 ? 'erratic' : coherence > 0.7 ? 'golden' : 'steady';

        // Base speed modified by entropy
        const pulseSpeed = entropy > 0.6
            ? 1.5 + (Math.random() * 1.5)  // Variable speed for high entropy
            : coherence > 0.7
                ? 3  // Slow, rhythmic for high coherence
                : 4 - (purpleIntensity * 2);

        // Border sharpness increases with stress
        const borderWidth = purpleIntensity * 2;

        let gradient: string;
        if (coherence > 0.7 && goldIntensity > 0.5) {
            // High coherence + high reciprocity = pure gold shimmer
            gradient = `radial-gradient(circle at center, rgba(255, 215, 0, 0.4) 0%, ${goldRgba} 30%, rgba(212, 175, 55, 0.1) 60%, rgba(253, 248, 243, 0) 80%)`;
        } else if (entropy > 0.6) {
            // High entropy = turbulent purple/gold mix
            gradient = `radial-gradient(ellipse at ${50 + Math.random() * 10}% ${50 + Math.random() * 10}%, ${purpleRgba} 0%, ${ebonyRgba} 30%, ${goldRgba} 60%, rgba(253, 248, 243, 0) 80%)`;
        } else if (goldIntensity > purpleIntensity) {
            // Gold dominant - thriving state
            gradient = `radial-gradient(circle at center, ${goldRgba} 0%, ${purpleRgba} 50%, rgba(253, 248, 243, 0) 80%)`;
        } else if (purpleIntensity > 0.5) {
            // High stress - ebony/purple
            gradient = `radial-gradient(circle at center, ${ebonyRgba} 0%, ${purpleRgba} 40%, rgba(253, 248, 243, 0) 70%)`;
        } else {
            // Balanced
            gradient = `radial-gradient(circle at center, ${purpleRgba} 0%, ${goldRgba} 50%, rgba(253, 248, 243, 0) 80%)`;
        }

        return { gradient, blur, pulseStyle, pulseSpeed, borderWidth, erraticIntensity };
    };

    const { gradient, blur, pulseStyle, pulseSpeed, borderWidth, erraticIntensity } = getGlowStyles();

    const getTrendIcon = () => {
        if (!systemicState) {
            if (!state) return null;
            if (state.trend === 'rising') return '↑';
            if (state.trend === 'declining') return '↓';
            return '→';
        }
        if (systemicState.momentum === 'rising') return '↑';
        if (systemicState.momentum === 'declining') return '↓';
        return '→';
    };

    const getStatusMessage = () => {
        if (!state || state.observationCount === 0) {
            return "Begin witnessing to reveal your sanctuary's pulse.";
        }

        // Use systemic state if available
        if (systemicState) {
            if (systemicState.entropy > 0.6) {
                return "The system is searching for rhythm. Hold steady.";
            }
            if (systemicState.coherence > 0.7 && state.averageReciprocity >= 4) {
                return "Deep coherence is emerging. The sanctuary resonates.";
            }
            if (systemicState.feedbackLoops.some(l => l.type === 'dampening')) {
                return "Connection is creating calm. A healing loop is forming.";
            }
        }

        if (state.systemicStressLevel > 0.5) {
            return "The sanctuary senses stress. Be gentle with yourself.";
        }

        if (state.averageReciprocity >= 4) {
            return "Deep connection is present. The sanctuary glows.";
        }

        if (state.averageReciprocity >= 3) {
            return "The sanctuary is steady. Continue witnessing.";
        }

        return "The sanctuary holds space for difficult moments.";
    };

    const getPulseIcon = () => {
        if (pulseStyle === 'golden') return <Sparkles className="w-8 h-8 text-white" />;
        if (pulseStyle === 'erratic') return <Activity className="w-8 h-8 text-white" />;
        if (state?.systemicStressLevel && state.systemicStressLevel > 0.5) {
            return <AlertTriangle className="w-8 h-8 text-white" />;
        }
        return <Heart className="w-8 h-8 text-white" />;
    };

    if (compact) {
        return (
            <div
                className="relative overflow-hidden rounded-2xl p-4"
                style={{
                    background: gradient,
                    filter: `blur(${blur * 0.1}px)`,
                }}
            >
                <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2">
                        {pulseStyle === 'erratic' ? (
                            <Activity className="w-4 h-4 text-[#4B0082]" />
                        ) : pulseStyle === 'golden' ? (
                            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                        ) : state?.systemicStressLevel && state.systemicStressLevel > 0.5 ? (
                            <AlertTriangle className="w-4 h-4 text-[#4B0082]" />
                        ) : (
                            <Heart className="w-4 h-4 text-[#D4AF37]" />
                        )}
                        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                            {state ? `${state.averageReciprocity}/5` : '—'}
                        </span>
                    </div>
                    <span className="text-xs opacity-60">
                        {systemicState ? (
                            systemicState.coherence > 0.7 ? 'Coherent' :
                                systemicState.entropy > 0.6 ? 'Seeking' : 'Steady'
                        ) : (
                            `${state?.observationCount ?? 0} observations`
                        )}
                    </span>
                </div>
            </div>
        );
    }

    // Framer Motion spring config based on entropy
    const springStiffness = systemicState?.coherence && systemicState.coherence > 0.7 ? 100 : 300;
    const springDamping = systemicState?.entropy && systemicState.entropy > 0.5 ? 5 : 15;

    // Physics-based vibration for Liquid Glass effect
    const vibrationIntensity = erraticIntensity * 4;

    return (
        <motion.div
            className="relative overflow-hidden rounded-[32px] mb-6"
            style={{
                border: borderWidth > 0 ? `${borderWidth}px solid rgba(75, 0, 130, 0.3)` : 'none',
            }}
            initial={{ scale: 1 }}
            animate={{
                scale: pulseStyle === 'erratic'
                    ? [1, 1.01, 0.99, 1.02, 1]
                    : pulseStyle === 'golden'
                        ? [1, 1.02, 1]
                        : 1,
                rotateX: pulseStyle === 'erratic' ? [0, vibrationIntensity, -vibrationIntensity, 0] : 0,
                rotateY: pulseStyle === 'erratic' ? [0, -vibrationIntensity, vibrationIntensity, 0] : 0,
            }}
            transition={{
                duration: pulseStyle === 'erratic' ? pulseSpeed : 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: pulseStyle === 'erratic' ? "easeInOut" : "easeOut",
                stiffness: springStiffness,
                damping: springDamping,
            }}
        >
            {/* Animated Glow Background - Now with Neural Pulse + Framer Motion */}
            <motion.div
                className="absolute inset-0"
                style={{
                    background: gradient,
                }}
                animate={{
                    opacity: pulseStyle === 'erratic'
                        ? [0.6, 1, 0.7, 0.9, 0.6]
                        : pulseStyle === 'golden'
                            ? [0.85, 1, 0.85]
                            : [0.8, 1, 0.8],
                    scale: pulseStyle === 'erratic'
                        ? [1, 1.02, 0.98, 1.01, 1]
                        : pulseStyle === 'golden'
                            ? [1, 1.03, 1]
                            : [1, 1.02, 1],
                }}
                transition={{
                    duration: pulseSpeed,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: pulseStyle === 'erratic' ? [0.25, 0.1, 0.25, 1] : "easeInOut",
                }}
            />

            {/* Erratic overlay for high entropy - Multi-chromatic Purple flickering */}
            {erraticIntensity > 0.5 && (
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: 'linear-gradient(45deg, rgba(75,0,130,0.1) 25%, transparent 25%, transparent 75%, rgba(75,0,130,0.1) 75%)',
                        backgroundSize: '20px 20px',
                        animation: `moveGrid 2s linear infinite`,
                        opacity: erraticIntensity * 0.5,
                    }}
                />
            )}

            {/* Content */}
            <div className="relative z-10 p-6 text-center">
                {loading ? (
                    <div className="py-8">
                        <Sparkles className="w-8 h-8 text-[#D4AF37] mx-auto animate-pulse" />
                        <p className="text-sm opacity-60 mt-2">Reading the sanctuary pulse...</p>
                    </div>
                ) : (
                    <>
                        {/* Main Indicator */}
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div
                                className={`w-16 h-16 rounded-full flex items-center justify-center ${pulseStyle === 'golden' ? 'animate-pulse' : ''
                                    }`}
                                style={{
                                    background: pulseStyle === 'golden'
                                        ? 'linear-gradient(135deg, #D4AF37, #FFD700, #D4AF37)'
                                        : pulseStyle === 'erratic'
                                            ? 'linear-gradient(135deg, #4B0082, #6B238E, #4B0082)'
                                            : state && state.systemicStressLevel > 0.5
                                                ? 'linear-gradient(135deg, #4B0082, #1A1A1A)'
                                                : 'linear-gradient(135deg, #D4AF37, #FFD700)',
                                    boxShadow: `0 0 ${blur}px ${pulseStyle === 'golden'
                                        ? 'rgba(255, 215, 0, 0.6)'
                                        : state && state.averageReciprocity >= 4
                                            ? 'rgba(212, 175, 55, 0.5)'
                                            : 'rgba(75, 0, 130, 0.3)'
                                        }`,
                                }}
                            >
                                {getPulseIcon()}
                            </div>

                            {/* Metrics */}
                            <div className="text-left">
                                <p
                                    className="text-3xl font-bold"
                                    style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                                >
                                    {state?.averageReciprocity?.toFixed(1) ?? '—'}
                                    <span className="text-lg opacity-60">/5</span>
                                </p>
                                <p className="text-xs opacity-60 flex items-center gap-1">
                                    <span>{state?.observationCount ?? 0} observations</span>
                                    <span>{getTrendIcon()}</span>
                                </p>
                                {/* Entropy indicator */}
                                {systemicState && (
                                    <p className="text-[10px] flex items-center gap-1 mt-1">
                                        <Waves className="w-3 h-3" />
                                        <span style={{
                                            color: systemicState.coherence > 0.7
                                                ? '#D4AF37'
                                                : systemicState.entropy > 0.6
                                                    ? '#4B0082'
                                                    : 'inherit',
                                            opacity: 0.8,
                                        }}>
                                            {systemicState.coherence > 0.7
                                                ? 'High Coherence'
                                                : systemicState.entropy > 0.6
                                                    ? 'High Entropy'
                                                    : 'Balanced'}
                                        </span>
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Status Message */}
                        <p
                            className="text-sm max-w-xs mx-auto"
                            style={{ color: 'var(--text-primary)', opacity: 0.8 }}
                        >
                            {getStatusMessage()}
                        </p>

                        {/* Feedback Loops */}
                        {systemicState?.feedbackLoops && systemicState.feedbackLoops.length > 0 && (
                            <div className="mt-3 flex flex-wrap justify-center gap-2">
                                {systemicState.feedbackLoops.slice(0, 2).map(loop => (
                                    <span
                                        key={loop.id}
                                        className={`text-[10px] px-2 py-1 rounded-full ${loop.type === 'amplifying'
                                            ? 'bg-[#4B0082]/20 text-[#4B0082]'
                                            : 'bg-[#D4AF37]/20 text-[#D4AF37]'
                                            }`}
                                    >
                                        {loop.type === 'amplifying' ? '🔄' : '⚖️'} {loop.description.split(' ').slice(0, 4).join(' ')}...
                                    </span>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Keyframes - Enhanced with Neural Pulse variations */}
            <style>{`
        @keyframes pulseGlow {
          0%, 100% {
            opacity: 0.8;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.02);
          }
        }
        
        @keyframes pulseGolden {
          0%, 100% {
            opacity: 0.9;
            transform: scale(1);
            filter: brightness(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.03);
            filter: brightness(1.1);
          }
        }
        
        @keyframes pulseErratic {
          0% {
            opacity: 0.7;
            transform: scale(1) skew(0deg);
          }
          25% {
            opacity: 0.9;
            transform: scale(1.01) skew(0.5deg);
          }
          50% {
            opacity: 0.6;
            transform: scale(0.99) skew(-0.5deg);
          }
          75% {
            opacity: 1;
            transform: scale(1.02) skew(0.3deg);
          }
          100% {
            opacity: 0.7;
            transform: scale(1) skew(0deg);
          }
        }
        
        @keyframes moveGrid {
          0% { transform: translate(0, 0); }
          100% { transform: translate(20px, 20px); }
        }
      `}</style>
        </motion.div>
    );
};
