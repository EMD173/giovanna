/**
 * PATTERN DASHBOARD
 * 
 * Visual intelligence center for understanding your child.
 * 
 * Displays:
 * - Pattern cards with confidence indicators
 * - Growth milestones timeline
 * - What works insights
 * - Temporal rhythms visualization
 * - Connection trend graph
 */

import { useState, useEffect } from 'react';
import { 
    ArrowLeft,
    TrendingUp,
    TrendingDown,
    Minus,
    Brain,
    Sparkles,
    Clock,
    Heart,
    AlertTriangle,
    ChevronRight,
    Trophy,
    Lightbulb,
    RefreshCw,
} from 'lucide-react';
import { useAuthStore } from '../../core/stores/useAuthStore';
import { useTimelineStore, useInsightsSummary, useTopPatterns } from '../../core/stores/timelineStore';
import { getObservations } from '../../core/firebase/firestore';
import { getProfile } from '../../core/firebase/profiles';
import type { PatternMemory, GrowthMilestone } from '../../lib/ai/longitudinalMemory';

interface PatternDashboardProps {
    onBack: () => void;
}

export const PatternDashboard = ({ onBack }: PatternDashboardProps) => {
    const { user } = useAuthStore();
    const { 
        observations, 
        understanding,
        isLoading,
        isUpdatingMemory,
        setObservations,
        updateMemory,
    } = useTimelineStore();
    
    const insights = useInsightsSummary();
    const topPatterns = useTopPatterns(6);
    
    const [childName, setChildName] = useState('');
    const [initialized, setInitialized] = useState(false);
    
    // Load data on mount
    useEffect(() => {
        if (!user) return;
        
        const loadData = async () => {
            try {
                // Get profile for child name
                const profile = await getProfile(user.uid);
                if (profile?.childName) {
                    setChildName(profile.childName);
                }
                
                // Get all observations
                const obs = await getObservations(user.uid, 200);
                setObservations(obs);
                
                // Build understanding
                if (obs.length > 0 && profile?.childName) {
                    await updateMemory(user.uid, profile.childName);
                }
                
                setInitialized(true);
            } catch (error) {
                console.error('Failed to load pattern data:', error);
            }
        };
        
        loadData();
    }, [user, setObservations, updateMemory]);
    
    const getTrendIcon = () => {
        switch (insights.trend) {
            case 'rising': return <TrendingUp className="w-5 h-5 text-green-500" />;
            case 'declining': return <TrendingDown className="w-5 h-5 text-amber-500" />;
            default: return <Minus className="w-5 h-5 text-gray-400" />;
        }
    };
    
    const getTrendLabel = () => {
        switch (insights.trend) {
            case 'rising': return 'Strengthening';
            case 'declining': return 'Needs attention';
            default: return 'Stable';
        }
    };
    
    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-500">Please sign in to view patterns</p>
            </div>
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
                <div>
                    <h1 
                        className="text-2xl font-bold"
                        style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                    >
                        Pattern Intelligence
                    </h1>
                    <p className="text-sm opacity-70">
                        {childName ? `Understanding ${childName}` : 'Insights from your observations'}
                    </p>
                </div>
            </header>
            
            {/* Loading State */}
            {(isLoading || !initialized) && (
                <div className="flex flex-col items-center justify-center py-12">
                    <RefreshCw className="w-8 h-8 text-[#4B0082] animate-spin mb-4" />
                    <p className="text-sm opacity-70">Analyzing patterns...</p>
                </div>
            )}
            
            {/* Not enough data */}
            {initialized && observations.length < 5 && (
                <div className="glass-panel p-6 rounded-3xl text-center">
                    <Brain className="w-12 h-12 mx-auto mb-4 text-[#4B0082] opacity-40" />
                    <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                        Building Understanding
                    </h2>
                    <p className="text-sm opacity-70 mb-4">
                        Pattern detection needs at least 5 observations. 
                        You have {observations.length} so far.
                    </p>
                    <p className="text-xs opacity-50">
                        Keep witnessing moments in Capture — the patterns will emerge.
                    </p>
                </div>
            )}
            
            {/* Main Content */}
            {initialized && observations.length >= 5 && (
                <div className="space-y-4">
                    {/* Overview Cards */}
                    <div className="grid grid-cols-2 gap-3">
                        {/* Total Observations */}
                        <div className="glass-panel p-4 rounded-2xl">
                            <div className="flex items-center gap-2 mb-2">
                                <Brain className="w-4 h-4 text-[#4B0082]" />
                                <span className="text-xs font-bold opacity-70">Observations</span>
                            </div>
                            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                                {insights.totalObservations}
                            </p>
                            <p className="text-xs opacity-50">moments witnessed</p>
                        </div>
                        
                        {/* Connection Trend */}
                        <div className="glass-panel p-4 rounded-2xl">
                            <div className="flex items-center gap-2 mb-2">
                                {getTrendIcon()}
                                <span className="text-xs font-bold opacity-70">Connection</span>
                            </div>
                            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                                {insights.averageReciprocity.toFixed(1)}
                            </p>
                            <p className="text-xs opacity-50">{getTrendLabel()}</p>
                        </div>
                        
                        {/* Patterns Detected */}
                        <div className="glass-panel p-4 rounded-2xl">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                                <span className="text-xs font-bold opacity-70">Patterns</span>
                            </div>
                            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                                {insights.patternCount}
                            </p>
                            <p className="text-xs opacity-50">detected</p>
                        </div>
                        
                        {/* Milestones */}
                        <div className="glass-panel p-4 rounded-2xl">
                            <div className="flex items-center gap-2 mb-2">
                                <Trophy className="w-4 h-4 text-amber-500" />
                                <span className="text-xs font-bold opacity-70">Milestones</span>
                            </div>
                            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                                {insights.milestoneCount}
                            </p>
                            <p className="text-xs opacity-50">celebrated</p>
                        </div>
                    </div>
                    
                    {/* Top Channel & Strategy */}
                    {(insights.topChannel || insights.topStrategy) && (
                        <div className="glass-panel p-4 rounded-2xl">
                            <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                                💡 Quick Insights
                            </h3>
                            <div className="space-y-2">
                                {insights.topChannel && (
                                    <div className="flex items-start gap-2">
                                        <Heart className="w-4 h-4 text-pink-500 mt-0.5" />
                                        <p className="text-sm">
                                            <span className="font-medium">{childName || 'Your child'}</span> most often communicates through{' '}
                                            <span className="font-bold text-[#4B0082]">{insights.topChannel}</span>
                                        </p>
                                    </div>
                                )}
                                {insights.topStrategy && (
                                    <div className="flex items-start gap-2">
                                        <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5" />
                                        <p className="text-sm">
                                            <span className="font-bold text-[#4B0082]">{insights.topStrategy}</span>{' '}
                                            is associated with higher connection
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    
                    {/* Patterns Section */}
                    {topPatterns.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                                Detected Patterns
                            </h3>
                            <div className="space-y-2">
                                {topPatterns.map((pattern) => (
                                    <PatternCard key={pattern.id} pattern={pattern} />
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Temporal Rhythms */}
                    {understanding?.currentInsights.temporalRhythms && 
                     understanding.currentInsights.temporalRhythms.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                                <Clock className="w-4 h-4 text-[#4B0082]" />
                                Daily Rhythms
                            </h3>
                            <div className="space-y-2">
                                {understanding.currentInsights.temporalRhythms.slice(0, 4).map((rhythm, i) => (
                                    <div key={i} className="glass-panel p-3 rounded-xl">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium">{rhythm.timeWindow}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                rhythm.pattern === 'peak-connection' 
                                                    ? 'bg-green-100 text-green-700'
                                                    : rhythm.pattern === 'challenging'
                                                    ? 'bg-amber-100 text-amber-700'
                                                    : 'bg-gray-100 text-gray-600'
                                            }`}>
                                                {rhythm.pattern === 'peak-connection' ? '✨ Peak' : 
                                                 rhythm.pattern === 'challenging' ? '⚠️ Challenging' : 
                                                 '○ Variable'}
                                            </span>
                                        </div>
                                        <p className="text-xs opacity-60 mt-1">{rhythm.suggestedApproach}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Stress Predictors */}
                    {understanding?.currentInsights.stressPredictors && 
                     understanding.currentInsights.stressPredictors.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                                <AlertTriangle className="w-4 h-4 text-amber-500" />
                                Watch For
                            </h3>
                            <div className="space-y-2">
                                {understanding.currentInsights.stressPredictors.slice(0, 3).map((predictor, i) => (
                                    <div key={i} className="glass-panel p-3 rounded-xl border-l-4 border-amber-400">
                                        <p className="text-sm font-medium">{predictor.predictor}</p>
                                        <p className="text-xs opacity-70 mt-1">→ {predictor.usualResponse}</p>
                                        <p className="text-xs text-[#4B0082] mt-2">{predictor.preventiveAction}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Milestones */}
                    {understanding?.milestones && understanding.milestones.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                                <Trophy className="w-4 h-4 text-amber-500" />
                                Growth Milestones
                            </h3>
                            <div className="space-y-2">
                                {understanding.milestones.slice(0, 3).map((milestone) => (
                                    <MilestoneCard key={milestone.id} milestone={milestone} />
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Memory Update Indicator */}
                    {isUpdatingMemory && (
                        <div className="fixed bottom-20 left-4 right-4 glass-panel p-3 rounded-xl flex items-center gap-3">
                            <RefreshCw className="w-4 h-4 text-[#4B0082] animate-spin" />
                            <span className="text-sm">Updating memory...</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const PatternCard = ({ pattern }: { pattern: PatternMemory }) => {
    const [expanded, setExpanded] = useState(false);
    
    const getMemoryTypeBadge = () => {
        switch (pattern.memoryType) {
            case 'long-term':
                return <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">Confirmed</span>;
            case 'working':
                return <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Emerging</span>;
            default:
                return <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">New</span>;
        }
    };
    
    const confidenceWidth = `${pattern.confidence * 100}%`;
    
    return (
        <div 
            className="glass-panel p-3 rounded-xl cursor-pointer hover:bg-white/50 transition-colors"
            onClick={() => setExpanded(!expanded)}
        >
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {pattern.parentSummary}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                        {getMemoryTypeBadge()}
                        <span className="text-xs opacity-50">
                            Seen {pattern.confirmationCount}x
                        </span>
                    </div>
                </div>
                <ChevronRight className={`w-4 h-4 opacity-40 transition-transform ${expanded ? 'rotate-90' : ''}`} />
            </div>
            
            {/* Confidence bar */}
            <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-[#4B0082] transition-all"
                    style={{ width: confidenceWidth }}
                />
            </div>
            <p className="text-xs opacity-40 mt-1">
                {(pattern.confidence * 100).toFixed(0)}% confidence
            </p>
            
            {/* Expanded content */}
            {expanded && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs opacity-70">
                        <strong>Scientific view:</strong> {pattern.professionalSummary}
                    </p>
                    <p className="text-xs opacity-50 mt-2">
                        First detected: {pattern.firstDetected.toLocaleDateString()}
                    </p>
                </div>
            )}
        </div>
    );
};

const MilestoneCard = ({ milestone }: { milestone: GrowthMilestone }) => {
    const getTypeEmoji = () => {
        switch (milestone.type) {
            case 'connection': return '💜';
            case 'regulation': return '🌿';
            case 'communication': return '💬';
            case 'skill': return '⭐';
            case 'breakthrough': return '🌟';
            default: return '✨';
        }
    };
    
    return (
        <div className="glass-panel p-3 rounded-xl gold-leaf-border">
            <div className="flex items-start gap-3">
                <span className="text-2xl">{getTypeEmoji()}</span>
                <div>
                    <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                        {milestone.title}
                    </h4>
                    <p className="text-xs opacity-70 mt-1">{milestone.description}</p>
                    {milestone.percentageChange && (
                        <p className="text-xs text-green-600 mt-2">
                            📈 {milestone.percentageChange.toFixed(0)}% improvement
                        </p>
                    )}
                    <p className="text-xs opacity-40 mt-2">
                        {milestone.date.toLocaleDateString()}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PatternDashboard;
