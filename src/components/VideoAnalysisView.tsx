/**
 * VIDEO ANALYSIS VIEW
 *
 * Displays AI-powered analysis of a video attached to an observation.
 * Shows strengths, communication notes, and strategies.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    Brain,
    MessageCircle,
    Lightbulb,
    TreeDeciduous,
    ChevronDown,
    ChevronUp,
    Loader2,
    AlertCircle,
    CheckCircle,
    Eye,
} from 'lucide-react';
import { analyzeVideo } from '../lib/ai/videoAnalysis';
import type { VideoAnalysis, MediaAttachment } from '../core/stores/types';

interface VideoAnalysisViewProps {
    media: MediaAttachment;
    observationNarrative?: string;
    childName?: string;
    knownTriggers?: string[];
    knownStrategies?: string[];
    existingAnalysis?: VideoAnalysis;
    onAnalysisComplete?: (analysis: VideoAnalysis) => void;
}

export const VideoAnalysisView = ({
    media,
    observationNarrative,
    childName,
    knownTriggers,
    knownStrategies,
    existingAnalysis,
    onAnalysisComplete,
}: VideoAnalysisViewProps) => {
    const [analysis, setAnalysis] = useState<VideoAnalysis | null>(existingAnalysis || null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        setError(null);

        try {
            const result = await analyzeVideo(media.url, {
                observationNarrative,
                childName,
                knownTriggers,
                knownStrategies,
            });

            setAnalysis(result);
            onAnalysisComplete?.(result);

            if (result.status === 'failed') {
                setError('Analysis could not be completed. Please try again.');
            }
        } catch (err) {
            console.error('Analysis error:', err);
            setError('An error occurred during analysis.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Not yet analyzed
    if (!analysis && !isAnalyzing) {
        return (
            <div className="bg-gradient-to-r from-[#4B0082]/5 to-[#D4AF37]/5 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#4B0082]/10">
                            <Brain className="w-5 h-5 text-[#4B0082]" />
                        </div>
                        <div>
                            <h4 className="font-medium text-[#1A1A1A]">Video Analysis</h4>
                            <p className="text-xs text-[#1A1A1A]/50">
                                Get AI-powered insights about this moment
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleAnalyze}
                        className="px-4 py-2 bg-[#4B0082] text-white rounded-lg text-sm font-medium flex items-center gap-2"
                    >
                        <Eye className="w-4 h-4" />
                        Analyze
                    </button>
                </div>
            </div>
        );
    }

    // Currently analyzing
    if (isAnalyzing) {
        return (
            <div className="bg-gradient-to-r from-[#4B0082]/5 to-[#D4AF37]/5 rounded-xl p-6">
                <div className="flex flex-col items-center justify-center py-4">
                    <Loader2 className="w-8 h-8 text-[#4B0082] animate-spin mb-3" />
                    <p className="text-sm font-medium text-[#1A1A1A]">Analyzing video...</p>
                    <p className="text-xs text-[#1A1A1A]/50 mt-1">
                        Looking for strengths and communication patterns
                    </p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="bg-red-50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <div className="flex-1">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                    <button
                        onClick={handleAnalyze}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Analysis complete
    if (analysis) {
        return (
            <div className="bg-white rounded-xl border border-[#4B0082]/10 overflow-hidden">
                {/* Header */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full p-4 flex items-center justify-between bg-gradient-to-r from-[#4B0082]/5 to-transparent"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-100">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="text-left">
                            <h4 className="font-medium text-[#1A1A1A]">Analysis Complete</h4>
                            <p className="text-xs text-[#1A1A1A]/50">
                                {analysis.strengthsObserved.length} strengths • {analysis.suggestedStrategies.length} strategies
                            </p>
                        </div>
                    </div>
                    {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-[#1A1A1A]/30" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-[#1A1A1A]/30" />
                    )}
                </button>

                {/* Summary (always visible) */}
                <div className="px-4 pb-4">
                    <p className="text-sm text-[#1A1A1A]/80 leading-relaxed">
                        {analysis.summary}
                    </p>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="px-4 pb-4 space-y-4">
                                {/* Strengths */}
                                <AnalysisSection
                                    icon={Sparkles}
                                    iconColor="text-amber-500"
                                    iconBg="bg-amber-50"
                                    title="Strengths Observed"
                                    items={analysis.strengthsObserved}
                                />

                                {/* Communication */}
                                <AnalysisSection
                                    icon={MessageCircle}
                                    iconColor="text-blue-500"
                                    iconBg="bg-blue-50"
                                    title="Communication Notes"
                                    items={analysis.communicationNotes}
                                />

                                {/* Environmental Factors */}
                                {analysis.environmentalFactors.length > 0 && (
                                    <AnalysisSection
                                        icon={TreeDeciduous}
                                        iconColor="text-green-500"
                                        iconBg="bg-green-50"
                                        title="Environmental Factors"
                                        items={analysis.environmentalFactors}
                                    />
                                )}

                                {/* Strategies */}
                                <AnalysisSection
                                    icon={Lightbulb}
                                    iconColor="text-purple-500"
                                    iconBg="bg-purple-50"
                                    title="Suggested Strategies"
                                    items={analysis.suggestedStrategies}
                                />

                                {/* Detected Elements */}
                                {analysis.elements.length > 0 && (
                                    <div className="pt-3 border-t border-gray-100">
                                        <h5 className="text-xs font-semibold text-[#1A1A1A]/50 uppercase tracking-wide mb-2">
                                            Detected Patterns
                                        </h5>
                                        <div className="flex flex-wrap gap-2">
                                            {analysis.elements.map((element, i) => (
                                                <span
                                                    key={i}
                                                    className="px-2 py-1 bg-gray-100 rounded-full text-xs text-[#1A1A1A]/70"
                                                    title={element.description}
                                                >
                                                    {element.label}
                                                    <span className="ml-1 text-[#1A1A1A]/40">
                                                        {Math.round(element.confidence * 100)}%
                                                    </span>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Re-analyze button */}
                                <button
                                    onClick={handleAnalyze}
                                    className="w-full py-2 text-sm text-[#4B0082] hover:bg-[#4B0082]/5 rounded-lg transition-colors"
                                >
                                    Re-analyze with current context
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    return null;
};

// Section component for consistent styling
interface AnalysisSectionProps {
    icon: typeof Sparkles;
    iconColor: string;
    iconBg: string;
    title: string;
    items: string[];
}

const AnalysisSection = ({
    icon: Icon,
    iconColor,
    iconBg,
    title,
    items,
}: AnalysisSectionProps) => {
    if (items.length === 0) return null;

    return (
        <div>
            <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-lg ${iconBg}`}>
                    <Icon className={`w-4 h-4 ${iconColor}`} />
                </div>
                <h5 className="text-sm font-medium text-[#1A1A1A]">{title}</h5>
            </div>
            <ul className="space-y-1.5 ml-8">
                {items.map((item, i) => (
                    <li
                        key={i}
                        className="text-sm text-[#1A1A1A]/70 flex items-start gap-2"
                    >
                        <span className="text-[#4B0082] mt-1.5">•</span>
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default VideoAnalysisView;
