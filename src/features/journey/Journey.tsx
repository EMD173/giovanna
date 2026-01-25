/**
 * JOURNEY: Enhanced Regulation Library
 * 
 * Multi-lens therapeutic strategy system featuring:
 * - Research-backed strategies with nervous system education
 * - Multiple therapeutic lenses (Polyvagal, Epigenetic, Somatic, Spiritual)
 * - Personalized recommendations
 * - User-contributed strategies
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    IconSearch, 
    IconX, 
    IconCheck, 
    IconShare, 
    IconPlus,
    IconBook,
    IconBrain,
    IconHeart,
    IconAlertCircle,
    IconQuote,
    IconExternalLink,
    IconChevronDown,
    IconFilter
} from '@tabler/icons-react';
import { 
    STRATEGIES, 
    LENS_INFO, 
    CATEGORY_INFO,
    getNervousSystemIcon,
    getNervousSystemLabel,
    getRelatedStrategies,
    type EnhancedStrategy, 
    type TherapeuticLens,
    type StrategyCategory
} from './strategyData';
import { NervousSystemTooltip, LensBadge } from '../../components/NervousSystemTooltip';

// Tab types for the detail modal
type DetailTab = 'how' | 'why' | 'research';

export const Journey = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLens, setSelectedLens] = useState<TherapeuticLens | 'all'>('all');
    const [selectedCategory, setSelectedCategory] = useState<StrategyCategory | 'all'>('all');
    const [selectedStrategy, setSelectedStrategy] = useState<EnhancedStrategy | null>(null);
    const [detailTab, setDetailTab] = useState<DetailTab>('how');
    const [showAddForm, setShowAddForm] = useState(false);
    const [showLensDropdown, setShowLensDropdown] = useState(false);

    // Filter strategies
    const filteredStrategies = STRATEGIES.filter(strategy => {
        const matchesSearch = 
            strategy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            strategy.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLens = selectedLens === 'all' || strategy.lenses.includes(selectedLens);
        const matchesCategory = selectedCategory === 'all' || strategy.category === selectedCategory;
        return matchesSearch && matchesLens && matchesCategory;
    });

    // Get related strategies for the selected one
    const relatedStrategies = selectedStrategy ? getRelatedStrategies(selectedStrategy) : [];

    return (
        <div className="flex flex-col space-y-5 pt-8 pb-32 px-4 fade-in">

            {/* HEADER */}
            <header>
                <h2 className="text-sm font-bold tracking-widest text-[#4B0082] uppercase opacity-80">
                    Regulation Library
                </h2>
                <h1 
                    className="text-3xl mt-1"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                >
                    Strategies
                </h1>
                <p className="text-sm mt-1 opacity-60">
                    Research-backed tools for nervous system regulation
                </p>
            </header>

            {/* SEARCH BAR */}
            <div className="glass-panel p-3 rounded-2xl flex items-center gap-3">
                <IconSearch className="w-5 h-5 text-[#1A1A1A]/40" />
                <input
                    type="text"
                    placeholder="Search strategies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent w-full focus:outline-none text-[#1A1A1A] placeholder-[#1A1A1A]/40"
                />
                {searchQuery && (
                    <button onClick={() => setSearchQuery('')}>
                        <IconX className="w-4 h-4 opacity-40" />
                    </button>
                )}
            </div>

            {/* APPROACH FILTER - Glass Dropdown */}
            <div className="relative">
                <button
                    onClick={() => setShowLensDropdown(!showLensDropdown)}
                    className="glass-panel w-full p-3 rounded-2xl flex items-center justify-between gap-2 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center gap-2">
                        <IconFilter className="w-4 h-4 text-[#4B0082]" />
                        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {selectedLens === 'all' ? 'All Approaches' : LENS_INFO[selectedLens].simpleLabel}
                        </span>
                    </div>
                    <IconChevronDown className={`w-4 h-4 text-[#4B0082] transition-transform ${showLensDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                    {showLensDropdown && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-40"
                                onClick={() => setShowLensDropdown(false)}
                            />
                            {/* Dropdown Panel */}
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute left-0 right-0 top-full mt-2 z-50 glass-panel rounded-2xl p-2 shadow-xl border border-white/30"
                            >
                                {/* All Option */}
                                <button
                                    onClick={() => { setSelectedLens('all'); setShowLensDropdown(false); }}
                                    className={`w-full p-3 rounded-xl text-left transition-all ${
                                        selectedLens === 'all' ? 'bg-[#4B0082]/10' : 'hover:bg-white/50'
                                    }`}
                                >
                                    <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>All Approaches</p>
                                    <p className="text-xs opacity-60">Show all regulation strategies</p>
                                </button>
                                
                                {/* Lens Options */}
                                {(Object.keys(LENS_INFO) as TherapeuticLens[]).map(lens => (
                                    <button
                                        key={lens}
                                        onClick={() => { setSelectedLens(lens); setShowLensDropdown(false); }}
                                        className={`w-full p-3 rounded-xl text-left transition-all ${
                                            selectedLens === lens ? 'bg-[#4B0082]/10' : 'hover:bg-white/50'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                                                {LENS_INFO[lens].simpleLabel}
                                            </p>
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/50 text-[#4B0082] font-medium">
                                                {LENS_INFO[lens].label}
                                            </span>
                                        </div>
                                        <p className="text-xs opacity-60 mt-0.5">{LENS_INFO[lens].description}</p>
                                    </button>
                                ))}
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>

            {/* CATEGORY FILTER */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
                <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                        selectedCategory === 'all'
                            ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30'
                            : 'bg-white/30 text-[#1A1A1A]/60 border border-white/40'
                    }`}
                >
                    All
                </button>
                {(Object.keys(CATEGORY_INFO) as StrategyCategory[]).map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                            selectedCategory === cat
                                ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30'
                                : 'bg-white/30 text-[#1A1A1A]/60 border border-white/40'
                        }`}
                    >
                        {CATEGORY_INFO[cat].icon} {CATEGORY_INFO[cat].label}
                    </button>
                ))}
            </div>

            {/* STRATEGY GRID */}
            <div className="grid grid-cols-2 gap-3">
                {filteredStrategies.map(strategy => (
                    <button
                        key={strategy.id}
                        onClick={() => {
                            setSelectedStrategy(strategy);
                            setDetailTab('how');
                        }}
                        className="glass-panel p-4 rounded-[20px] flex flex-col items-center text-center gap-2 active:scale-95 transition-transform hover:shadow-lg"
                    >
                        {/* Icon */}
                        <div className={`w-14 h-14 rounded-2xl ${strategy.color} flex items-center justify-center text-white shadow-lg text-2xl`}>
                            {strategy.icon}
                        </div>
                        
                        {/* Title */}
                        <h3 className="font-bold text-sm text-[#1A1A1A] leading-tight">{strategy.title}</h3>
                        
                        {/* Nervous System Indicator */}
                        <div className={`flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                            strategy.nervousSystemEffect.primarySystem === 'parasympathetic' ? 'bg-emerald-100 text-emerald-700' :
                            strategy.nervousSystemEffect.primarySystem === 'social_engagement' ? 'bg-purple-100 text-purple-700' :
                            'bg-orange-100 text-orange-700'
                        }`}>
                            {getNervousSystemIcon(strategy.nervousSystemEffect.primarySystem)}
                            {getNervousSystemLabel(strategy.nervousSystemEffect.primarySystem)}
                        </div>

                        {/* Top Lens Badge */}
                        <div className="flex gap-1 flex-wrap justify-center">
                            {strategy.lenses.slice(0, 2).map(lens => (
                                <LensBadge key={lens} lens={lens} small />
                            ))}
                        </div>
                    </button>
                ))}

                {/* ADD NEW CARD */}
                <button
                    onClick={() => setShowAddForm(true)}
                    className="border-2 border-dashed border-[#1A1A1A]/20 rounded-[20px] flex flex-col items-center justify-center text-center gap-2 min-h-[160px] active:bg-black/5 transition-colors hover:border-[#4B0082]/40"
                >
                    <div className="w-12 h-12 rounded-full bg-[#1A1A1A]/5 flex items-center justify-center">
                        <IconPlus className="w-6 h-6 text-[#1A1A1A]/40" />
                    </div>
                    <span className="text-sm font-bold text-[#1A1A1A]/40">Add Strategy</span>
                </button>
            </div>

            {/* No results */}
            {filteredStrategies.length === 0 && (
                <div className="text-center py-8 opacity-50">
                    <p>No strategies found matching your filters.</p>
                    <button 
                        onClick={() => { setSelectedLens('all'); setSelectedCategory('all'); setSearchQuery(''); }}
                        className="text-[#4B0082] font-semibold mt-2"
                    >
                        Clear filters
                    </button>
                </div>
            )}

            {/* ========== STRATEGY DETAIL MODAL ========== */}
            <AnimatePresence>
                {selectedStrategy && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
                        onClick={() => setSelectedStrategy(null)}
                    >
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="w-full max-w-lg bg-white rounded-t-[32px] max-h-[90vh] overflow-hidden flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Fixed Header */}
                            <div className="p-6 pb-4 border-b border-gray-100">
                                {/* Close button */}
                                <button
                                    onClick={() => setSelectedStrategy(null)}
                                    className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 z-10"
                                >
                                    <IconX size={20} />
                                </button>

                                {/* Title Section */}
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={`w-16 h-16 rounded-2xl ${selectedStrategy.color} flex items-center justify-center text-white shadow-lg text-3xl`}>
                                        {selectedStrategy.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold text-[#1A1A1A]">
                                            {selectedStrategy.title}
                                        </h2>
                                        <p className="text-sm text-[#4B0082] font-medium capitalize">
                                            {selectedStrategy.category.replace('-', ' ')}
                                        </p>
                                    </div>
                                </div>

                                {/* Lens Badges */}
                                <div className="flex gap-2 flex-wrap mb-4">
                                    {selectedStrategy.lenses.map(lens => (
                                        <LensBadge key={lens} lens={lens} />
                                    ))}
                                </div>

                                {/* Tab Navigation */}
                                <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                                    <button
                                        onClick={() => setDetailTab('how')}
                                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-1 ${
                                            detailTab === 'how' ? 'bg-white shadow-sm text-[#4B0082]' : 'text-gray-500'
                                        }`}
                                    >
                                        <IconBook size={16} />
                                        How To
                                    </button>
                                    <button
                                        onClick={() => setDetailTab('why')}
                                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-1 ${
                                            detailTab === 'why' ? 'bg-white shadow-sm text-[#4B0082]' : 'text-gray-500'
                                        }`}
                                    >
                                        <IconBrain size={16} />
                                        Why It Works
                                    </button>
                                    <button
                                        onClick={() => setDetailTab('research')}
                                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-1 ${
                                            detailTab === 'research' ? 'bg-white shadow-sm text-[#4B0082]' : 'text-gray-500'
                                        }`}
                                    >
                                        <IconQuote size={16} />
                                        Sources
                                    </button>
                                </div>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto p-6 pt-4">
                                
                                {/* HOW TO TAB */}
                                {detailTab === 'how' && (
                                    <div className="space-y-6">
                                        {/* Description */}
                                        <p className="text-[#1A1A1A]/80 leading-relaxed">
                                            {selectedStrategy.description}
                                        </p>

                                        {/* Steps */}
                                        <div>
                                            <h3 className="font-bold text-[#1A1A1A] mb-3 flex items-center gap-2">
                                                <IconCheck size={18} className="text-[#4B0082]" />
                                                Steps
                                            </h3>
                                            <div className="space-y-3">
                                                {selectedStrategy.howToUse.map((step, i) => (
                                                    <div key={i} className="flex items-start gap-3">
                                                        <div className="w-6 h-6 rounded-full bg-[#4B0082]/10 flex items-center justify-center shrink-0 mt-0.5">
                                                            <span className="text-xs font-bold text-[#4B0082]">{i + 1}</span>
                                                        </div>
                                                        <p className="text-[#1A1A1A]/80">{step}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* When to Use */}
                                        <div>
                                            <h3 className="font-bold text-[#1A1A1A] mb-3 flex items-center gap-2">
                                                <IconHeart size={18} className="text-emerald-600" />
                                                Best For
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedStrategy.whenToUse.map((when, i) => (
                                                    <span key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
                                                        {when}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Contraindications */}
                                        {selectedStrategy.contraindications && selectedStrategy.contraindications.length > 0 && (
                                            <div>
                                                <h3 className="font-bold text-[#1A1A1A] mb-3 flex items-center gap-2">
                                                    <IconAlertCircle size={18} className="text-amber-600" />
                                                    Use Caution If
                                                </h3>
                                                <div className="space-y-2">
                                                    {selectedStrategy.contraindications.map((contra, i) => (
                                                        <p key={i} className="text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-xl">
                                                            ⚠️ {contra}
                                                        </p>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* WHY IT WORKS TAB */}
                                {detailTab === 'why' && (
                                    <div className="space-y-6">
                                        {/* Nervous System Tooltip */}
                                        <NervousSystemTooltip effect={selectedStrategy.nervousSystemEffect} />

                                        {/* Body Effect */}
                                        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#4B0082]/5 to-[#D4AF37]/5 border border-[#4B0082]/10">
                                            <h4 className="font-bold text-[#1A1A1A] mb-2">In Your Body</h4>
                                            <p className="text-[#1A1A1A]/80">
                                                {selectedStrategy.nervousSystemEffect.bodyEffect}
                                            </p>
                                        </div>

                                        {/* The Science */}
                                        <div>
                                            <h3 className="font-bold text-[#1A1A1A] mb-3 flex items-center gap-2">
                                                <IconBrain size={18} className="text-[#4B0082]" />
                                                The Science
                                            </h3>
                                            <p className="text-[#1A1A1A]/80 leading-relaxed">
                                                {selectedStrategy.nervousSystemEffect.tooltipEducation}
                                            </p>
                                        </div>

                                        {/* Related Strategies */}
                                        {relatedStrategies.length > 0 && (
                                            <div>
                                                <h3 className="font-bold text-[#1A1A1A] mb-3">Related Strategies</h3>
                                                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                                                    {relatedStrategies.map(rel => (
                                                        <button
                                                            key={rel.id}
                                                            onClick={() => {
                                                                setSelectedStrategy(rel);
                                                                setDetailTab('how');
                                                            }}
                                                            className="flex items-center gap-2 px-3 py-2 bg-white/50 border border-gray-200 rounded-xl whitespace-nowrap hover:bg-white/80"
                                                        >
                                                            <span>{rel.icon}</span>
                                                            <span className="text-sm font-medium">{rel.title}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* RESEARCH TAB */}
                                {detailTab === 'research' && (
                                    <div className="space-y-4">
                                        {selectedStrategy.researchSources.map((source, i) => (
                                            <div key={i} className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-[#4B0082]/10 flex items-center justify-center shrink-0">
                                                        <IconQuote size={14} className="text-[#4B0082]" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-bold text-[#1A1A1A]">{source.author}</p>
                                                        <p className="text-sm text-[#4B0082] italic">{source.work}</p>
                                                        {source.quote && (
                                                            <p className="mt-2 text-sm text-[#1A1A1A]/70 italic border-l-2 border-[#D4AF37] pl-3">
                                                                "{source.quote}"
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Learn More Link */}
                                        <a
                                            href={`https://www.google.com/search?q=${encodeURIComponent(selectedStrategy.title + ' regulation technique research')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 text-[#4B0082] font-semibold py-3 hover:underline"
                                        >
                                            <IconExternalLink size={16} />
                                            Learn More
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Fixed Footer Actions */}
                            <div className="p-4 border-t border-gray-100 flex gap-3">
                                <button
                                    onClick={() => setSelectedStrategy(null)}
                                    className="flex-1 py-3 px-4 bg-[#4B0082] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#3a006b] transition-colors"
                                >
                                    <IconCheck size={18} />
                                    Try This Now
                                </button>
                                <button
                                    onClick={() => {
                                        if (navigator.share) {
                                            navigator.share({
                                                title: selectedStrategy.title,
                                                text: selectedStrategy.description,
                                            });
                                        } else {
                                            navigator.clipboard.writeText(
                                                `${selectedStrategy.title}: ${selectedStrategy.description}`
                                            );
                                            alert('Strategy copied to clipboard!');
                                        }
                                    }}
                                    className="py-3 px-4 bg-gray-100 text-[#1A1A1A] rounded-xl font-semibold flex items-center justify-center hover:bg-gray-200 transition-colors"
                                >
                                    <IconShare size={18} />
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ========== ADD STRATEGY MODAL ========== */}
            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                        onClick={() => setShowAddForm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-md bg-white rounded-3xl p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-xl font-bold text-[#1A1A1A] mb-2">Add Your Strategy</h2>
                            <p className="text-sm text-[#1A1A1A]/60 mb-4">
                                Share what works for your family. Your strategies help others.
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-semibold text-[#1A1A1A] block mb-1">Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Counting to 10"
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:border-[#4B0082] focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-[#1A1A1A] block mb-1">Description</label>
                                    <textarea
                                        placeholder="What does this strategy do? When do you use it?"
                                        rows={3}
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:border-[#4B0082] focus:outline-none resize-none"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowAddForm(false)}
                                    className="flex-1 py-3 bg-gray-100 text-[#1A1A1A] rounded-xl font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        alert('Custom strategies will be saved to your profile in a future update!');
                                        setShowAddForm(false);
                                    }}
                                    className="flex-1 py-3 bg-[#4B0082] text-white rounded-xl font-semibold"
                                >
                                    Save Strategy
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};
