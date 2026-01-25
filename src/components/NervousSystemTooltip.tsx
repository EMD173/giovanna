/**
 * NERVOUS SYSTEM TOOLTIP
 * 
 * Educational tooltip that explains what a strategy does to the body
 * and nervous system. Uses Polyvagal-informed language.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconInfoCircle } from '@tabler/icons-react';
import type { NervousSystemEffect, NervousSystemBranch } from '../features/journey/strategyData';
import { getNervousSystemIcon, getNervousSystemLabel } from '../features/journey/strategyData';

interface NervousSystemTooltipProps {
    effect: NervousSystemEffect;
    compact?: boolean;
}

const SYSTEM_COLORS: Record<NervousSystemBranch, { bg: string; text: string; border: string }> = {
    parasympathetic: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    sympathetic: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    social_engagement: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' }
};

export const NervousSystemTooltip = ({ effect, compact = false }: NervousSystemTooltipProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const colors = SYSTEM_COLORS[effect.primarySystem];

    if (compact) {
        // Just show the indicator badge
        return (
            <span 
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}
                title={effect.action}
            >
                {getNervousSystemIcon(effect.primarySystem)}
                {getNervousSystemLabel(effect.primarySystem)}
            </span>
        );
    }

    return (
        <div className="relative">
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${colors.bg} ${colors.border} ${colors.text} hover:shadow-md`}
            >
                <span className="text-lg">{getNervousSystemIcon(effect.primarySystem)}</span>
                <div className="text-left">
                    <p className="text-xs font-bold uppercase tracking-wide opacity-70">Nervous System</p>
                    <p className="text-sm font-semibold">{getNervousSystemLabel(effect.primarySystem)}</p>
                </div>
                <IconInfoCircle className="w-4 h-4 opacity-50" />
            </button>

            {/* Tooltip Popover */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        
                        {/* Tooltip Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className={`absolute left-0 right-0 top-full mt-2 z-50 p-4 rounded-2xl border shadow-xl ${colors.bg} ${colors.border}`}
                        >
                            {/* Header */}
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-2xl">{getNervousSystemIcon(effect.primarySystem)}</span>
                                <h4 className={`font-bold ${colors.text}`}>
                                    {getNervousSystemLabel(effect.primarySystem)} Response
                                </h4>
                            </div>

                            {/* Action */}
                            <div className="mb-3">
                                <p className="text-xs font-bold uppercase tracking-wide opacity-60 mb-1">What It Does</p>
                                <p className={`text-sm ${colors.text}`}>{effect.action}</p>
                            </div>

                            {/* Body Effect */}
                            <div className="mb-3">
                                <p className="text-xs font-bold uppercase tracking-wide opacity-60 mb-1">In Your Body</p>
                                <p className={`text-sm ${colors.text}`}>{effect.bodyEffect}</p>
                            </div>

                            {/* Education */}
                            <div className={`p-3 rounded-xl bg-white/50 border ${colors.border}`}>
                                <p className="text-xs font-bold uppercase tracking-wide opacity-60 mb-2">🧠 The Science</p>
                                <p className="text-xs leading-relaxed opacity-80">{effect.tooltipEducation}</p>
                            </div>

                            {/* Close hint */}
                            <p className="text-center text-xs opacity-50 mt-3">Tap anywhere to close</p>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

// Lens Badge Component
interface LensBadgeProps {
    lens: string;
    small?: boolean;
}

const LENS_COLORS: Record<string, string> = {
    polyvagal: 'bg-[#4B0082]/10 text-[#4B0082]',
    epigenetic: 'bg-[#D4AF37]/10 text-[#D4AF37]',
    somatic: 'bg-emerald-100 text-emerald-700',
    spiritual: 'bg-purple-100 text-purple-700',
    intergenerational: 'bg-amber-100 text-amber-700',
    aba_alternative: 'bg-teal-100 text-teal-700'
};

const LENS_LABELS: Record<string, string> = {
    polyvagal: 'Polyvagal',
    epigenetic: 'Epigenetic',
    somatic: 'Somatic',
    spiritual: 'Spiritual',
    intergenerational: 'Intergenerational',
    aba_alternative: 'Naturalistic'
};

export const LensBadge = ({ lens, small = false }: LensBadgeProps) => {
    const color = LENS_COLORS[lens] || 'bg-gray-100 text-gray-700';
    const label = LENS_LABELS[lens] || lens;

    return (
        <span className={`inline-block rounded-full font-medium ${color} ${small ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'}`}>
            {label}
        </span>
    );
};
