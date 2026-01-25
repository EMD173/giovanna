/**
 * OBSERVATIONS TIMELINE: Witnessing Archive
 *
 * A chronological view of all parent observations with:
 * - Search and filter capabilities
 * - Individual observation detail view
 * - PDF export (single and batch)
 * - Share functionality
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Download,
    Share2,
    ChevronRight,
    X,
    FileText,
    Calendar,
    Heart,
    Sparkles,
    Loader2,
    CheckCircle,
    Video,
} from 'lucide-react';
import { formatDuration } from '../../core/firebase/videoStorage';
import { VideoAnalysisView } from '../../components/VideoAnalysisView';
import { useAuthStore } from '../../core/stores/useAuthStore';
import { getObservations, saveVideoAnalysis } from '../../core/firebase/firestore';
import { getProfile } from '../../core/firebase/profiles';
import {
    generateSingleObservationPDF,
    generateSummaryPDF,
    sharePDF,
    type DocumentTemplate,
    type ExportOptions,
} from '../../lib/export/pdfExport';
import type { Observation, ResonanceChannel, VideoAnalysis } from '../../core/stores/types';
import type { UserProfile } from '../../core/stores/profileTypes';

interface ObservationsTimelineProps {
    onNavigate?: (view: string) => void;
}

export const ObservationsTimeline = ({ onNavigate }: ObservationsTimelineProps) => {
    const { user } = useAuthStore();
    const [observations, setObservations] = useState<Observation[]>([]);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedChannel, setSelectedChannel] = useState<ResonanceChannel | 'All'>('All');
    const [selectedObservation, setSelectedObservation] = useState<Observation | null>(null);
    const [showExportModal, setShowExportModal] = useState(false);
    const [selectedForExport, setSelectedForExport] = useState<Set<string>>(new Set());
    const [isExporting, setIsExporting] = useState(false);
    const [exportSuccess, setExportSuccess] = useState(false);

    // Fetch observations and profile
    useEffect(() => {
        if (user) {
            Promise.all([
                getObservations(user.uid, 100),
                getProfile(user.uid),
            ]).then(([obs, prof]) => {
                setObservations(obs);
                setProfile(prof);
                setIsLoading(false);
            }).catch((error) => {
                console.error('Failed to load observations:', error);
                setIsLoading(false);
            });
        }
    }, [user]);

    // Filter observations
    const filteredObservations = observations.filter((obs) => {
        const matchesSearch =
            searchQuery === '' ||
            obs.strengthNarrative?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            obs.atmosphericResonance?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesChannel =
            selectedChannel === 'All' ||
            obs.channels?.includes(selectedChannel);

        return matchesSearch && matchesChannel;
    });

    // Group observations by date
    const groupedObservations = groupByDate(filteredObservations);

    // Handle single observation export
    const handleExportSingle = async (obs: Observation, template: DocumentTemplate) => {
        setIsExporting(true);
        try {
            const doc = generateSingleObservationPDF(obs, profile, template);
            const childName = profile?.childName || 'Child';
            const date = formatDateShort(obs.timestamp?.toDate?.() || new Date());
            const filename = `${childName}-observation-${date}.pdf`;

            await sharePDF(doc, filename, `${childName}'s Observation`);
            setExportSuccess(true);
            setTimeout(() => setExportSuccess(false), 2000);
        } catch (error) {
            console.error('Export failed:', error);
        } finally {
            setIsExporting(false);
        }
    };

    // Handle batch export
    const handleExportBatch = async (template: DocumentTemplate) => {
        setIsExporting(true);
        try {
            const toExport = selectedForExport.size > 0
                ? observations.filter((o) => selectedForExport.has(o.id))
                : filteredObservations;

            const options: ExportOptions = {
                template,
                includeRecommendations: true,
                includeStrengths: true,
                includeSupports: true,
                childName: profile?.childName || 'Child',
                parentTitle: profile?.parent?.title || 'Parent',
            };

            const doc = generateSummaryPDF(toExport, profile, options);
            const childName = profile?.childName || 'Child';
            const filename = `${childName}-observations-summary-${formatDateShort(new Date())}.pdf`;

            await sharePDF(doc, filename, `${childName}'s Observation Summary`);
            setExportSuccess(true);
            setSelectedForExport(new Set());
            setTimeout(() => {
                setExportSuccess(false);
                setShowExportModal(false);
            }, 2000);
        } catch (error) {
            console.error('Export failed:', error);
        } finally {
            setIsExporting(false);
        }
    };

    // Toggle selection for batch export
    const toggleSelection = (id: string) => {
        const newSet = new Set(selectedForExport);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedForExport(newSet);
    };

    const channels: (ResonanceChannel | 'All')[] = [
        'All',
        'Seeking Safety',
        'Sensory Need',
        'Connection Bid',
        'Transition Signal',
        'Body Wisdom',
        'Joy Expression',
    ];

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-[#4B0082]" />
                <p className="text-sm opacity-60">Loading your observations...</p>
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
                            Witnessing Archive
                        </h2>
                        <h1 className="text-3xl font-serif text-[#1A1A1A] mt-1">
                            Observations
                        </h1>
                    </div>
                    <button
                        onClick={() => setShowExportModal(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4B0082] text-white text-sm font-semibold hover:bg-[#3a006b] transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
                <p className="text-sm opacity-60 mt-2">
                    {observations.length} moments witnessed
                </p>
            </header>

            {/* SEARCH & FILTER */}
            <div className="px-4 space-y-3">
                {/* Search Bar */}
                <div className="glass-panel p-3 rounded-2xl flex items-center space-x-3">
                    <Search className="w-5 h-5 text-[#1A1A1A]/40" />
                    <input
                        type="text"
                        placeholder="Search observations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent w-full focus:outline-none text-[#1A1A1A] placeholder-[#1A1A1A]/40"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')}>
                            <X className="w-4 h-4 text-[#1A1A1A]/40" />
                        </button>
                    )}
                </div>

                {/* Channel Filters */}
                <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-1">
                    {channels.map((channel) => (
                        <button
                            key={channel}
                            onClick={() => setSelectedChannel(channel)}
                            className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                                selectedChannel === channel
                                    ? 'bg-[#4B0082] text-white shadow-md'
                                    : 'bg-white/40 text-[#1A1A1A]/70 border border-white/50'
                            }`}
                        >
                            {channel}
                        </button>
                    ))}
                </div>
            </div>

            {/* OBSERVATIONS LIST */}
            {filteredObservations.length === 0 ? (
                <div className="px-4 py-12 text-center">
                    <Sparkles className="w-12 h-12 mx-auto text-[#4B0082]/30 mb-4" />
                    <h3 className="text-lg font-semibold text-[#1A1A1A]">No observations yet</h3>
                    <p className="text-sm text-[#1A1A1A]/60 mt-2">
                        Your witnessed moments will appear here
                    </p>
                    <button
                        onClick={() => onNavigate?.('Capture')}
                        className="mt-4 px-6 py-3 bg-[#4B0082] text-white rounded-xl font-semibold"
                    >
                        Witness a Moment
                    </button>
                </div>
            ) : (
                <div className="px-4 space-y-6">
                    {Object.entries(groupedObservations).map(([date, obs]) => (
                        <div key={date}>
                            {/* Date Header */}
                            <div className="flex items-center gap-3 mb-3">
                                <Calendar className="w-4 h-4 text-[#4B0082]" />
                                <span className="text-sm font-bold text-[#1A1A1A]/60">
                                    {date}
                                </span>
                                <div className="flex-1 h-px bg-[#1A1A1A]/10" />
                            </div>

                            {/* Observation Cards */}
                            <div className="space-y-3">
                                {obs.map((observation) => (
                                    <ObservationCard
                                        key={observation.id}
                                        observation={observation}
                                        isSelected={selectedForExport.has(observation.id)}
                                        onSelect={() => toggleSelection(observation.id)}
                                        onView={() => setSelectedObservation(observation)}
                                        selectionMode={selectedForExport.size > 0}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Selection Mode Banner */}
            <AnimatePresence>
                {selectedForExport.size > 0 && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-24 left-4 right-4 glass-panel p-4 rounded-2xl shadow-lg flex items-center justify-between"
                    >
                        <div>
                            <p className="font-semibold text-[#1A1A1A]">
                                {selectedForExport.size} selected
                            </p>
                            <p className="text-xs text-[#1A1A1A]/60">
                                Tap observations to select more
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSelectedForExport(new Set())}
                                className="px-4 py-2 rounded-xl bg-white/60 text-[#1A1A1A] text-sm font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setShowExportModal(true)}
                                className="px-4 py-2 rounded-xl bg-[#4B0082] text-white text-sm font-semibold flex items-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Export Selected
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* OBSERVATION DETAIL MODAL */}
            <AnimatePresence>
                {selectedObservation && (
                    <ObservationDetailModal
                        observation={selectedObservation}
                        profile={profile}
                        onClose={() => setSelectedObservation(null)}
                        onExport={(template) => handleExportSingle(selectedObservation, template)}
                        isExporting={isExporting}
                        onAnalysisSaved={(obsId, mediaIndex, analysis) => {
                            // Update local state with the new analysis
                            setObservations((prev) =>
                                prev.map((obs) => {
                                    if (obs.id === obsId && obs.media) {
                                        const updatedMedia = [...obs.media];
                                        updatedMedia[mediaIndex] = {
                                            ...updatedMedia[mediaIndex],
                                            analysis,
                                        };
                                        return { ...obs, media: updatedMedia };
                                    }
                                    return obs;
                                })
                            );
                            // Update selected observation too
                            if (selectedObservation?.id === obsId && selectedObservation.media) {
                                const updatedMedia = [...selectedObservation.media];
                                updatedMedia[mediaIndex] = {
                                    ...updatedMedia[mediaIndex],
                                    analysis,
                                };
                                setSelectedObservation({ ...selectedObservation, media: updatedMedia });
                            }
                        }}
                    />
                )}
            </AnimatePresence>

            {/* EXPORT MODAL */}
            <AnimatePresence>
                {showExportModal && (
                    <ExportModal
                        onClose={() => setShowExportModal(false)}
                        onExport={handleExportBatch}
                        isExporting={isExporting}
                        exportSuccess={exportSuccess}
                        count={
                            selectedForExport.size > 0
                                ? selectedForExport.size
                                : filteredObservations.length
                        }
                        childName={profile?.childName || 'Child'}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// Observation Card Component
interface ObservationCardProps {
    observation: Observation;
    isSelected: boolean;
    onSelect: () => void;
    onView: () => void;
    selectionMode: boolean;
}

const ObservationCard = ({
    observation,
    isSelected,
    onSelect,
    onView,
    selectionMode,
}: ObservationCardProps) => {
    const time = observation.timestamp?.toDate?.()
        ? observation.timestamp.toDate().toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
          })
        : '';

    const reciprocityColor =
        observation.relationalReciprocity >= 4
            ? 'text-[#D4AF37]'
            : observation.relationalReciprocity <= 2
            ? 'text-[#4B0082]'
            : 'text-[#1A1A1A]/60';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-panel p-4 rounded-[20px] transition-all ${
                isSelected ? 'ring-2 ring-[#4B0082] bg-[#4B0082]/5' : ''
            }`}
        >
            <div className="flex items-start gap-3">
                {/* Selection Checkbox (when in selection mode) */}
                {selectionMode && (
                    <button
                        onClick={onSelect}
                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                            isSelected
                                ? 'bg-[#4B0082] text-white'
                                : 'border-2 border-[#1A1A1A]/20'
                        }`}
                    >
                        {isSelected && <CheckCircle className="w-4 h-4" />}
                    </button>
                )}

                {/* Main Content */}
                <button
                    onClick={selectionMode ? onSelect : onView}
                    className="flex-1 text-left"
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-[#1A1A1A]/50">{time}</span>
                            {/* Video indicator */}
                            {observation.media && observation.media.length > 0 && (
                                <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-[#4B0082]/10 text-[#4B0082]">
                                    <Video className="w-3 h-3" />
                                    {observation.media.length}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1">
                            <Heart className={`w-3 h-3 ${reciprocityColor}`} />
                            <span className={`text-xs font-semibold ${reciprocityColor}`}>
                                {observation.relationalReciprocity}/5
                            </span>
                        </div>
                    </div>

                    <p className="text-sm text-[#1A1A1A] line-clamp-2 mb-2">
                        {observation.strengthNarrative || 'No narrative recorded'}
                    </p>

                    {/* Channels */}
                    {observation.channels && observation.channels.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {observation.channels.slice(0, 2).map((channel) => (
                                <span
                                    key={channel}
                                    className="text-[10px] px-2 py-0.5 rounded-full bg-[#4B0082]/10 text-[#4B0082]"
                                >
                                    {channel}
                                </span>
                            ))}
                            {observation.channels.length > 2 && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1A1A1A]/5 text-[#1A1A1A]/50">
                                    +{observation.channels.length - 2}
                                </span>
                            )}
                        </div>
                    )}
                </button>

                {/* View Arrow */}
                {!selectionMode && (
                    <button onClick={onView} className="p-2 -mr-2">
                        <ChevronRight className="w-5 h-5 text-[#1A1A1A]/30" />
                    </button>
                )}
            </div>
        </motion.div>
    );
};

// Observation Detail Modal
interface ObservationDetailModalProps {
    observation: Observation;
    profile: UserProfile | null;
    onClose: () => void;
    onExport: (template: DocumentTemplate) => void;
    isExporting: boolean;
    onAnalysisSaved?: (observationId: string, mediaIndex: number, analysis: VideoAnalysis) => void;
}

const ObservationDetailModal = ({
    observation,
    profile,
    onClose,
    onExport,
    isExporting,
    onAnalysisSaved,
}: ObservationDetailModalProps) => {
    const [showExportOptions, setShowExportOptions] = useState(false);

    const date = observation.timestamp?.toDate?.()
        ? observation.timestamp.toDate().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          })
        : 'Date not recorded';

    const time = observation.timestamp?.toDate?.()
        ? observation.timestamp.toDate().toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
          })
        : '';

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="w-full max-w-lg bg-white rounded-t-[32px] p-6 pb-10 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div className="mb-6">
                    <p className="text-sm text-[#4B0082] font-medium">{date}</p>
                    <p className="text-xs text-[#1A1A1A]/50">{time}</p>
                </div>

                {/* Media Attachments */}
                {observation.media && observation.media.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-[#1A1A1A]/60 uppercase tracking-wide mb-2">
                            Attached Media
                        </h3>
                        <div className="space-y-4">
                            {observation.media.map((media, index) => (
                                <div key={index} className="space-y-3">
                                    <div className="rounded-xl overflow-hidden bg-black">
                                        {media.type === 'video' ? (
                                            <div className="relative">
                                                <video
                                                    src={media.url}
                                                    controls
                                                    playsInline
                                                    className="w-full aspect-video"
                                                    poster={media.thumbnailUrl}
                                                />
                                                {media.duration && (
                                                    <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/60 text-white text-xs">
                                                        {formatDuration(media.duration)}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <img
                                                src={media.url}
                                                alt="Observation attachment"
                                                className="w-full"
                                            />
                                        )}
                                    </div>
                                    {/* Video Analysis for video attachments */}
                                    {media.type === 'video' && (
                                        <VideoAnalysisView
                                            media={media}
                                            observationNarrative={observation.strengthNarrative}
                                            childName={profile?.childName}
                                            existingAnalysis={media.analysis}
                                            onAnalysisComplete={async (analysis) => {
                                                // Save to Firestore
                                                try {
                                                    await saveVideoAnalysis(observation.id, index, analysis);
                                                    // Update local state
                                                    onAnalysisSaved?.(observation.id, index, analysis);
                                                } catch (err) {
                                                    console.error('Failed to save analysis:', err);
                                                }
                                            }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Narrative */}
                <div className="mb-6">
                    <h3 className="text-sm font-bold text-[#1A1A1A]/60 uppercase tracking-wide mb-2">
                        What Was Witnessed
                    </h3>
                    <p className="text-[#1A1A1A] leading-relaxed">
                        {observation.strengthNarrative || 'No narrative recorded'}
                    </p>
                </div>

                {/* Channels */}
                {observation.channels && observation.channels.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-[#1A1A1A]/60 uppercase tracking-wide mb-2">
                            Communication Channels
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {observation.channels.map((channel) => (
                                <span
                                    key={channel}
                                    className="px-3 py-1 rounded-full bg-[#4B0082]/10 text-[#4B0082] text-sm"
                                >
                                    {channel}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Environmental Context */}
                {observation.atmosphericResonance && (
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-[#1A1A1A]/60 uppercase tracking-wide mb-2">
                            Environmental Context
                        </h3>
                        <p className="text-[#1A1A1A]/80 text-sm">
                            {observation.atmosphericResonance}
                        </p>
                    </div>
                )}

                {/* Connection Level */}
                <div className="mb-6">
                    <h3 className="text-sm font-bold text-[#1A1A1A]/60 uppercase tracking-wide mb-2">
                        Relational Connection
                    </h3>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all"
                                style={{
                                    width: `${(observation.relationalReciprocity / 5) * 100}%`,
                                    backgroundColor:
                                        observation.relationalReciprocity >= 4
                                            ? '#D4AF37'
                                            : '#4B0082',
                                }}
                            />
                        </div>
                        <span className="text-sm font-bold text-[#4B0082]">
                            {observation.relationalReciprocity}/5
                        </span>
                    </div>
                </div>

                {/* Biological Needs */}
                {observation.biologicalNeeds && (
                    <div className="mb-8">
                        <h3 className="text-sm font-bold text-[#1A1A1A]/60 uppercase tracking-wide mb-2">
                            Physical/Sensory State
                        </h3>
                        <p className="text-[#1A1A1A]/80 text-sm">
                            {observation.biologicalNeeds}
                        </p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                    {showExportOptions ? (
                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-[#1A1A1A] mb-3">
                                Choose document format:
                            </p>
                            {(['school', 'medical', 'therapy', 'careTeam', 'personal'] as DocumentTemplate[]).map(
                                (template) => (
                                    <button
                                        key={template}
                                        onClick={() => onExport(template)}
                                        disabled={isExporting}
                                        className="w-full py-3 px-4 rounded-xl bg-white border border-[#1A1A1A]/10 text-[#1A1A1A] text-sm font-medium text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                                    >
                                        <span className="capitalize">{template.replace(/([A-Z])/g, ' $1')}</span>
                                        <ChevronRight className="w-4 h-4 opacity-40" />
                                    </button>
                                )
                            )}
                            <button
                                onClick={() => setShowExportOptions(false)}
                                className="w-full py-2 text-sm text-[#1A1A1A]/60"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowExportOptions(true)}
                                disabled={isExporting}
                                className="flex-1 py-3 px-4 bg-[#4B0082] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#3a006b] transition-colors"
                            >
                                {isExporting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <FileText className="w-5 h-5" />
                                )}
                                {isExporting ? 'Creating PDF...' : 'Export as PDF'}
                            </button>
                            <button
                                onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({
                                            title: 'Observation',
                                            text: observation.strengthNarrative || '',
                                        });
                                    } else {
                                        navigator.clipboard.writeText(
                                            observation.strengthNarrative || ''
                                        );
                                        alert('Copied to clipboard!');
                                    }
                                }}
                                className="py-3 px-4 bg-gray-100 text-[#1A1A1A] rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                            >
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

// Export Modal for Batch Export
interface ExportModalProps {
    onClose: () => void;
    onExport: (template: DocumentTemplate) => void;
    isExporting: boolean;
    exportSuccess: boolean;
    count: number;
    childName: string;
}

const ExportModal = ({
    onClose,
    onExport,
    isExporting,
    exportSuccess,
    count,
    childName,
}: ExportModalProps) => {
    const templates: { id: DocumentTemplate; label: string; description: string }[] = [
        {
            id: 'school',
            label: 'School / IEP',
            description: 'Formatted for educators and IEP meetings',
        },
        {
            id: 'medical',
            label: 'Medical Provider',
            description: 'Clinical format for doctors and specialists',
        },
        {
            id: 'therapy',
            label: 'Therapy Provider',
            description: 'Between-session notes for therapists',
        },
        {
            id: 'careTeam',
            label: 'Care Team',
            description: 'General sharing with care team members',
        },
        {
            id: 'personal',
            label: 'Personal Journal',
            description: 'Your own records and reflection',
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-md bg-white rounded-[24px] p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {exportSuccess ? (
                    <div className="text-center py-8">
                        <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
                        <h2 className="text-xl font-bold text-[#1A1A1A] mb-2">
                            Export Complete!
                        </h2>
                        <p className="text-sm text-[#1A1A1A]/60">
                            Your PDF is ready to share
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-[#1A1A1A]">
                                    Export Observations
                                </h2>
                                <p className="text-sm text-[#1A1A1A]/60">
                                    {count} observations for {childName}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-gray-100"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-sm text-[#1A1A1A]/70 mb-4">
                            Choose a format based on who you're sharing with:
                        </p>

                        <div className="space-y-2 mb-6">
                            {templates.map((template) => (
                                <button
                                    key={template.id}
                                    onClick={() => onExport(template.id)}
                                    disabled={isExporting}
                                    className="w-full p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left flex items-center gap-4"
                                >
                                    <div className="w-10 h-10 rounded-full bg-[#4B0082]/10 flex items-center justify-center flex-shrink-0">
                                        <FileText className="w-5 h-5 text-[#4B0082]" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-[#1A1A1A]">
                                            {template.label}
                                        </p>
                                        <p className="text-xs text-[#1A1A1A]/60">
                                            {template.description}
                                        </p>
                                    </div>
                                    {isExporting ? (
                                        <Loader2 className="w-5 h-5 animate-spin text-[#4B0082]" />
                                    ) : (
                                        <ChevronRight className="w-5 h-5 text-[#1A1A1A]/30" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <p className="text-xs text-center text-[#1A1A1A]/50">
                            All exports use strength-based, dignity-centered language
                        </p>
                    </>
                )}
            </motion.div>
        </motion.div>
    );
};

// Helper functions
function groupByDate(observations: Observation[]): Record<string, Observation[]> {
    const groups: Record<string, Observation[]> = {};

    for (const obs of observations) {
        const date = obs.timestamp?.toDate?.()
            ? obs.timestamp.toDate().toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
              })
            : 'Unknown Date';

        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(obs);
    }

    return groups;
}

function formatDateShort(date: Date): string {
    return date.toISOString().split('T')[0];
}

export default ObservationsTimeline;
