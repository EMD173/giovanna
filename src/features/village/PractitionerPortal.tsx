/**
 * PRACTITIONER PORTAL: Secure Care Team View
 * 
 * Auth-guarded, read-only view of child's Digital Passport
 * and Strength-Based Narrative for practitioners.
 * 
 * ACCESS: Via Sanctuary Key validation
 * DESIGN: Liquid Glass with Gold Leaf premium border
 * TONE: Professional, dignity-first, strength-based
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Shield,
    Heart,
    Sparkles,
    Brain,
    Lock,
    Eye,
    Clock,
    Sun,
    Cloud,
    Home,
    School,
    Star,
    Loader2,
    Key,
    FileText,
    CheckCircle,
    XCircle
} from 'lucide-react';
import {
    validateSanctuaryKey,
    logAccess,
    type SanctuaryKey
} from '../../core/utils/villageKeys';
import { getProfile } from '../../core/firebase/profiles';
import { getObservations } from '../../core/firebase/firestore';
import type {
    SovereignPassport,
    UserProfile
} from '../../core/stores/profileTypes';
import type { Observation } from '../../core/stores/types';
import { generateClassroomInsights } from '../../lib/ai/agents/oracle';

// ============================================================================
// TYPES
// ============================================================================

interface EnvironmentalInsight {
    category: string;
    insight: string;
    supportStrategies: string[];
    environmentalFactors: string[];
}

interface StrengthNarrative {
    summary: string;
    topStrengths: string[];
    connectionMoments: string[];
    preferredChannels: string[];
    classroomInsights: EnvironmentalInsight[];
}

// ============================================================================
// PRACTITIONER PORTAL COMPONENT
// ============================================================================

const PractitionerPortal = () => {
    // Parse key from URL natively (avoiding react-router-dom dependency)
    const keyParam = typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('key')
        : null;

    // State
    const [validationStatus, setValidationStatus] = useState<'loading' | 'valid' | 'invalid' | 'expired'>('loading');
    const [keyData, setKeyData] = useState<SanctuaryKey | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [observations, setObservations] = useState<Observation[]>([]);
    const [narrative, setNarrative] = useState<StrengthNarrative | null>(null);
    const [isLoadingNarrative, setIsLoadingNarrative] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    // Validate key on mount
    useEffect(() => {
        const validateAndLoad = async () => {
            if (!keyParam) {
                setValidationStatus('invalid');
                setErrorMessage('No access key provided');
                return;
            }

            try {
                const validation = await validateSanctuaryKey(keyParam);

                if (!validation.valid || !validation.data) {
                    setValidationStatus(validation.error?.includes('expired') ? 'expired' : 'invalid');
                    setErrorMessage(validation.error || 'Invalid key');
                    return;
                }

                setKeyData(validation.data);
                setValidationStatus('valid');

                // Log the access
                await logAccess(validation.data.id, 'view_passport');

                // Load profile data
                const profileData = await getProfile(validation.data.familyId);
                if (profileData) {
                    setProfile(profileData);

                    // Load recent observations if permitted
                    if (validation.data.permissions.includes('view_observations') ||
                        validation.data.permissions.includes('full_practitioner')) {
                        const sevenDaysAgo = new Date();
                        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

                        // Get observations for this family/user
                        const obs = await getObservations(validation.data.familyId, 50);

                        // Filter to last 7 days
                        const recentObs = obs.filter((o: Observation) => {
                            const ts = o.timestamp;
                            // Handle Firestore Timestamp
                            const obsDate = ts && typeof ts.toDate === 'function'
                                ? ts.toDate()
                                : ts instanceof Date
                                    ? ts
                                    : new Date(ts as unknown as string);
                            return obsDate >= sevenDaysAgo;
                        });

                        setObservations(recentObs);

                        // Generate classroom insights if we have observations
                        if (recentObs.length > 0) {
                            setIsLoadingNarrative(true);
                            try {
                                const insights = await generateClassroomInsights(
                                    recentObs,
                                    profileData.childName || 'this child',
                                    profileData.passport
                                );
                                setNarrative(insights);
                            } catch (err) {
                                console.error('Failed to generate narrative:', err);
                            } finally {
                                setIsLoadingNarrative(false);
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Validation error:', error);
                setValidationStatus('invalid');
                setErrorMessage('Failed to validate access key');
            }
        };

        validateAndLoad();
    }, [keyParam]);

    // Render based on validation status
    if (validationStatus === 'loading') {
        return <LoadingState />;
    }

    if (validationStatus === 'invalid' || validationStatus === 'expired') {
        return <InvalidKeyState status={validationStatus} message={errorMessage} />;
    }

    return (
        <div
            className="min-h-screen py-8 px-4"
            style={{
                background: 'linear-gradient(145deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
            }}
        >
            <div className="max-w-4xl mx-auto">
                {/* Header with Gold Leaf Border */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel rounded-[32px] p-6 mb-6"
                    style={{
                        border: '2px solid rgba(212, 175, 55, 0.4)',
                        boxShadow: '0 8px 32px rgba(212, 175, 55, 0.15)',
                    }}
                >
                    {/* Gold Accent Line */}
                    <div
                        className="absolute top-0 left-8 right-8 h-1 -translate-y-[2px] rounded-full"
                        style={{
                            background: 'linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%)',
                        }}
                    />

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div
                                className="p-3 rounded-2xl"
                                style={{
                                    background: 'linear-gradient(145deg, rgba(212, 175, 55, 0.3) 0%, rgba(212, 175, 55, 0.1) 100%)',
                                    border: '1px solid rgba(212, 175, 55, 0.4)',
                                }}
                            >
                                <Shield className="w-6 h-6" style={{ color: '#D4AF37' }} />
                            </div>
                            <div>
                                <h1
                                    className="text-xl font-bold"
                                    style={{
                                        fontFamily: "'Playfair Display', serif",
                                        color: 'var(--text-primary)',
                                    }}
                                >
                                    Practitioner Portal
                                </h1>
                                <p className="text-sm opacity-60">
                                    Secure access for {keyData?.institutionName || 'Care Team'}
                                </p>
                            </div>
                        </div>

                        {/* Access Status Badge */}
                        <div
                            className="flex items-center gap-2 py-2 px-4 rounded-full"
                            style={{
                                background: 'rgba(76, 175, 80, 0.15)',
                                border: '1px solid rgba(76, 175, 80, 0.3)',
                            }}
                        >
                            <CheckCircle className="w-4 h-4" style={{ color: '#4CAF50' }} />
                            <span className="text-sm font-medium" style={{ color: '#4CAF50' }}>
                                Verified Access
                            </span>
                        </div>
                    </div>

                    {/* Access Info */}
                    <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/10 text-sm opacity-60">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>
                                Expires: {keyData && new Date(keyData.expiresAt).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            <span>
                                Access #{(keyData?.accessCount || 0) + 1}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            <span>Read-only</span>
                        </div>
                    </div>
                </motion.div>

                {/* Child Info Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-panel rounded-[24px] p-6 mb-6"
                >
                    <div className="flex items-center gap-4">
                        <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold"
                            style={{
                                background: 'linear-gradient(145deg, rgba(167, 139, 250, 0.3) 0%, rgba(139, 92, 246, 0.2) 100%)',
                                border: '1px solid rgba(167, 139, 250, 0.3)',
                            }}
                        >
                            {profile?.childName?.charAt(0) || '?'}
                        </div>
                        <div>
                            <h2
                                className="text-2xl font-bold"
                                style={{
                                    fontFamily: "'Playfair Display', serif",
                                    color: 'var(--text-primary)',
                                }}
                            >
                                {profile?.childName || 'Child'}
                            </h2>
                            <p className="text-sm opacity-60">
                                Digital Passport • Strength-Based Profile
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Digital Passport Section */}
                {profile?.passport && (
                    <PassportSection passport={profile.passport} />
                )}

                {/* Strength-Based Narrative */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-panel rounded-[24px] p-6 mb-6"
                    style={{
                        border: '2px solid rgba(212, 175, 55, 0.25)',
                    }}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div
                            className="p-2 rounded-xl"
                            style={{ background: 'rgba(212, 175, 55, 0.2)' }}
                        >
                            <Sparkles className="w-5 h-5" style={{ color: '#D4AF37' }} />
                        </div>
                        <div>
                            <h3 className="font-bold">Strength-Based Narrative</h3>
                            <p className="text-xs opacity-60">
                                Based on observations from the last 7 days
                            </p>
                        </div>
                    </div>

                    {isLoadingNarrative ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="flex items-center gap-3">
                                <Loader2 className="w-5 h-5 animate-spin opacity-60" />
                                <span className="opacity-60">Synthesizing insights...</span>
                            </div>
                        </div>
                    ) : narrative ? (
                        <NarrativeDisplay narrative={narrative} />
                    ) : observations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <FileText className="w-12 h-12 opacity-20 mb-3" />
                            <p className="font-medium opacity-60">No Recent Observations</p>
                            <p className="text-sm opacity-40 mt-1">
                                Narrative will appear when observations are shared
                            </p>
                        </div>
                    ) : (
                        <div className="p-4 rounded-xl bg-white/5">
                            <p className="opacity-60 text-sm">
                                {observations.length} observations from the past 7 days.
                                Narrative generation unavailable.
                            </p>
                        </div>
                    )}
                </motion.div>

                {/* Footer */}
                <div className="text-center text-xs opacity-40 py-4">
                    <p>This portal is provided by the child's family via Giovanna.</p>
                    <p className="mt-1">All information is shared with dignity-first framing.</p>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const LoadingState = () => (
    <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--bg-primary)' }}
    >
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel rounded-[32px] p-12 text-center"
        >
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="inline-block mb-4"
            >
                <Key className="w-12 h-12" style={{ color: '#D4AF37' }} />
            </motion.div>
            <h2 className="text-xl font-bold mb-2">Validating Access Key</h2>
            <p className="text-sm opacity-60">Verifying your Sanctuary Key...</p>
        </motion.div>
    </div>
);

const InvalidKeyState = ({ status, message }: { status: string; message: string }) => (
    <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: 'var(--bg-primary)' }}
    >
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel rounded-[32px] p-12 text-center max-w-md"
        >
            <div
                className="inline-flex p-4 rounded-2xl mb-4"
                style={{
                    background: status === 'expired'
                        ? 'rgba(255, 152, 0, 0.2)'
                        : 'rgba(244, 67, 54, 0.2)',
                }}
            >
                {status === 'expired' ? (
                    <Clock className="w-12 h-12" style={{ color: '#FF9800' }} />
                ) : (
                    <XCircle className="w-12 h-12" style={{ color: '#F44336' }} />
                )}
            </div>
            <h2 className="text-xl font-bold mb-2">
                {status === 'expired' ? 'Access Expired' : 'Access Denied'}
            </h2>
            <p className="text-sm opacity-60 mb-6">{message}</p>
            <p className="text-xs opacity-40">
                {status === 'expired'
                    ? 'Please request a new access key from the family.'
                    : 'This link is no longer valid.'}
            </p>
        </motion.div>
    </div>
);

const PassportSection = ({ passport }: { passport: SovereignPassport }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-panel rounded-[24px] p-6 mb-6"
    >
        <div className="flex items-center gap-3 mb-4">
            <div
                className="p-2 rounded-xl"
                style={{ background: 'rgba(139, 92, 246, 0.2)' }}
            >
                <Heart className="w-5 h-5" style={{ color: '#8B5CF6' }} />
            </div>
            <h3 className="font-bold">Strengths & Sensory Profile</h3>
        </div>

        {/* Sacred Summary if available */}
        {passport.sacredSummary && (
            <div
                className="p-4 rounded-xl mb-4"
                style={{
                    background: 'linear-gradient(145deg, rgba(212, 175, 55, 0.1) 0%, rgba(255,255,255,0.02) 100%)',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                }}
            >
                <p className="text-sm italic opacity-80 leading-relaxed">
                    "{passport.sacredSummary}"
                </p>
            </div>
        )}

        {/* Sensory Patterns */}
        {passport.sensory?.stimmingPatterns && passport.sensory.stimmingPatterns.length > 0 && (
            <div className="mb-4">
                <h4 className="text-sm font-semibold opacity-70 mb-2 flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    Essential Regulation Patterns
                </h4>
                <div className="space-y-2">
                    {passport.sensory.stimmingPatterns.map((pattern, i) => (
                        <div
                            key={i}
                            className="p-3 rounded-xl"
                            style={{ background: 'rgba(255,255,255,0.05)' }}
                        >
                            <p className="font-medium text-sm">{pattern.dignityFraming || pattern.behavior}</p>
                            {pattern.supportStrategy && (
                                <p className="text-xs opacity-60 mt-1">
                                    Support: {pattern.supportStrategy}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Comfort Objects */}
        {passport.sensory?.favoriteToys && passport.sensory.favoriteToys.length > 0 && (
            <div className="mb-4">
                <h4 className="text-sm font-semibold opacity-70 mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Comfort & Joy Sources
                </h4>
                <div className="flex flex-wrap gap-2">
                    {passport.sensory.favoriteToys.map((item, i) => (
                        <span
                            key={i}
                            className="px-3 py-1.5 rounded-full text-sm"
                            style={{ background: 'rgba(167, 139, 250, 0.2)' }}
                        >
                            {typeof item === 'string' ? item : item.name}
                        </span>
                    ))}
                </div>
            </div>
        )}

        {/* Contextual Abilities */}
        {passport.contextualAbilities && (
            <div className="grid md:grid-cols-2 gap-4">
                {passport.contextualAbilities.schoolExpectations && (
                    <ContextCard
                        icon={<School className="w-4 h-4" />}
                        title="School Context"
                        content={passport.contextualAbilities.schoolExpectations}
                    />
                )}
                {passport.contextualAbilities.homeExpectations && (
                    <ContextCard
                        icon={<Home className="w-4 h-4" />}
                        title="Home Context"
                        content={passport.contextualAbilities.homeExpectations}
                    />
                )}
            </div>
        )}
    </motion.div>
);

const ContextCard = ({
    icon,
    title,
    content
}: {
    icon: React.ReactNode;
    title: string;
    content: string;
}) => (
    <div
        className="p-4 rounded-xl"
        style={{ background: 'rgba(255,255,255,0.05)' }}
    >
        <div className="flex items-center gap-2 mb-2">
            <span className="opacity-60">{icon}</span>
            <span className="text-sm font-medium">{title}</span>
        </div>
        <p className="text-sm opacity-70">{content}</p>
    </div>
);

const NarrativeDisplay = ({ narrative }: { narrative: StrengthNarrative }) => (
    <div className="space-y-6">
        {/* Summary */}
        <div
            className="p-4 rounded-xl"
            style={{
                background: 'linear-gradient(145deg, rgba(212, 175, 55, 0.1) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
            }}
        >
            <p className="text-sm leading-relaxed">{narrative.summary}</p>
        </div>

        {/* Top Strengths */}
        {narrative.topStrengths.length > 0 && (
            <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4" style={{ color: '#D4AF37' }} />
                    Recognized Strengths
                </h4>
                <div className="flex flex-wrap gap-2">
                    {narrative.topStrengths.map((strength, i) => (
                        <span
                            key={i}
                            className="px-3 py-1.5 rounded-full text-sm"
                            style={{
                                background: 'rgba(212, 175, 55, 0.15)',
                                border: '1px solid rgba(212, 175, 55, 0.3)',
                            }}
                        >
                            {strength}
                        </span>
                    ))}
                </div>
            </div>
        )}

        {/* Connection Moments */}
        {narrative.connectionMoments.length > 0 && (
            <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Heart className="w-4 h-4" style={{ color: '#A78BFA' }} />
                    Recent Connection Moments
                </h4>
                <ul className="space-y-2">
                    {narrative.connectionMoments.map((moment, i) => (
                        <li
                            key={i}
                            className="flex items-start gap-2 text-sm"
                        >
                            <span className="opacity-40">•</span>
                            <span className="opacity-80">{moment}</span>
                        </li>
                    ))}
                </ul>
            </div>
        )}

        {/* Classroom Insights */}
        {narrative.classroomInsights.length > 0 && (
            <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Sun className="w-4 h-4" style={{ color: '#FF9800' }} />
                    Classroom Environmental Insights
                </h4>
                <div className="space-y-3">
                    {narrative.classroomInsights.map((insight, i) => (
                        <div
                            key={i}
                            className="p-4 rounded-xl"
                            style={{ background: 'rgba(255,255,255,0.05)' }}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <Cloud className="w-4 h-4 opacity-60" />
                                <span className="text-sm font-medium">{insight.category}</span>
                            </div>
                            <p className="text-sm opacity-70 mb-3">{insight.insight}</p>

                            {insight.supportStrategies.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {insight.supportStrategies.map((strategy, j) => (
                                        <span
                                            key={j}
                                            className="px-2 py-1 rounded-lg text-xs"
                                            style={{ background: 'rgba(76, 175, 80, 0.2)' }}
                                        >
                                            {strategy}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
);

export default PractitionerPortal;
