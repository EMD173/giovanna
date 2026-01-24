/**
 * SOVEREIGN TOOLTIP: Educational Liquid Glass Component
 * 
 * A touch-friendly tooltip using the Sanctuary's glass physics:
 * - 40px blur backdrop
 * - Deep Ebony text (#1A1A1A)
 * - Smooth fade-in/out transitions
 * - Mobile-friendly tap behavior
 * 
 * Design: Appears on tap/hover, dismisses on outside tap
 */

import { useState, useRef, useEffect, type ReactNode } from 'react';
import { Info, Sparkles } from 'lucide-react';
import { getGlossaryEntry, hasGlossaryEntry, CATEGORY_LABELS, type GlossaryEntry } from '../../core/constants/glossary';

interface SovereignTooltipProps {
    term: string;
    children: ReactNode;
    showIndicator?: boolean;       // Show underline/indicator for glossary terms
    teacherMode?: boolean;         // Enhanced visibility when Teacher Mode is on
}

export const SovereignTooltip = ({
    term,
    children,
    showIndicator = true,
    teacherMode = false
}: SovereignTooltipProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLSpanElement>(null);
    const [position, setPosition] = useState<'top' | 'bottom'>('top');

    const entry = getGlossaryEntry(term);

    // If no glossary entry, just render children
    if (!entry) {
        return <>{children}</>;
    }

    // Close on outside click
    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
            if (
                tooltipRef.current &&
                !tooltipRef.current.contains(e.target as Node) &&
                triggerRef.current &&
                !triggerRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
            document.addEventListener('touchstart', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('touchstart', handleOutsideClick);
        };
    }, [isOpen]);

    // Calculate position
    useEffect(() => {
        if (isOpen && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            const spaceAbove = rect.top;
            const spaceBelow = window.innerHeight - rect.bottom;

            setPosition(spaceAbove > spaceBelow ? 'top' : 'bottom');
        }
    }, [isOpen]);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const getCategoryColor = (category: GlossaryEntry['category']) => {
        switch (category) {
            case 'institutional': return '#4B0082';   // Regal Purple
            case 'therapeutic': return '#2E8B57';     // Sea Green
            case 'philosophical': return '#D4AF37';   // Gold
            case 'practical': return '#4682B4';       // Steel Blue
            default: return '#4B0082';
        }
    };

    return (
        <span className="relative inline-block">
            {/* Trigger */}
            <span
                ref={triggerRef}
                onClick={handleToggle}
                className={`cursor-pointer transition-all duration-200 ${showIndicator || teacherMode
                    ? 'border-b border-dotted hover:border-solid'
                    : ''
                    } ${teacherMode
                        ? 'border-[#D4AF37] gold-shimmer-text'
                        : 'border-[#4B0082]/40 hover:border-[#4B0082]'
                    }`}
                style={{
                    ...(teacherMode && {
                        textDecoration: 'underline',
                        textDecorationStyle: 'dotted',
                        textUnderlineOffset: '3px',
                    })
                }}
            >
                {children}
                {teacherMode && (
                    <Sparkles
                        className="inline-block w-3 h-3 ml-0.5 text-[#D4AF37] opacity-70"
                    />
                )}
            </span>

            {/* Tooltip Panel */}
            {isOpen && (
                <div
                    ref={tooltipRef}
                    className={`absolute z-50 w-72 sm:w-80 animate-tooltip-fade ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
                        } left-1/2 -translate-x-1/2`}
                >
                    <div
                        className="glass-panel p-4 rounded-[16px] shadow-xl"
                        style={{
                            backdropFilter: 'blur(40px)',
                            WebkitBackdropFilter: 'blur(40px)',
                            borderLeft: `3px solid ${getCategoryColor(entry.category)}`,
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <h4
                                    className="font-bold text-sm"
                                    style={{ color: '#1A1A1A' }}
                                >
                                    {entry.term}
                                </h4>
                                <span
                                    className="text-[10px] uppercase tracking-wider font-semibold"
                                    style={{ color: getCategoryColor(entry.category) }}
                                >
                                    {CATEGORY_LABELS[entry.category]}
                                </span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 rounded-lg hover:bg-black/5 transition-colors"
                            >
                                <span className="text-xs opacity-40">✕</span>
                            </button>
                        </div>

                        {/* Definition */}
                        <p
                            className="text-sm leading-relaxed mb-3"
                            style={{ color: '#1A1A1A' }}
                        >
                            {entry.definition}
                        </p>

                        {/* Dignity Framing */}
                        {entry.dignityFraming && (
                            <div
                                className="p-2 rounded-lg mb-2"
                                style={{
                                    backgroundColor: `${getCategoryColor(entry.category)}10`,
                                }}
                            >
                                <p
                                    className="text-xs italic"
                                    style={{ color: getCategoryColor(entry.category) }}
                                >
                                    💜 {entry.dignityFraming}
                                </p>
                            </div>
                        )}

                        {/* Related Terms */}
                        {entry.relatedTerms && entry.relatedTerms.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-2 border-t border-black/5">
                                <span className="text-[10px] opacity-40 mr-1">Related:</span>
                                {entry.relatedTerms.map((related, i) => (
                                    <span
                                        key={i}
                                        className="text-[10px] px-1.5 py-0.5 rounded-md bg-black/5"
                                        style={{ color: '#1A1A1A' }}
                                    >
                                        {related}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Arrow */}
                    <div
                        className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 ${position === 'top' ? '-bottom-1.5' : '-top-1.5'
                            }`}
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(40px)',
                        }}
                    />
                </div>
            )}

            {/* Animation Styles */}
            <style>{`
        @keyframes tooltipFade {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(${position === 'top' ? '8px' : '-8px'});
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        .animate-tooltip-fade {
          animation: tooltipFade 0.2s ease-out forwards;
        }
        .gold-shimmer-text {
          background: linear-gradient(90deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmerText 3s ease-in-out infinite;
        }
        @keyframes shimmerText {
          0%, 100% { background-position: 0% center; }
          50% { background-position: 100% center; }
        }
      `}</style>
        </span>
    );
};

/**
 * withGlossary Utility - Wraps text in tooltip if glossary entry exists
 */
export function withGlossary(
    label: string,
    options?: { teacherMode?: boolean; showIndicator?: boolean }
): ReactNode {
    if (hasGlossaryEntry(label)) {
        return (
            <SovereignTooltip
                term={label}
                teacherMode={options?.teacherMode}
                showIndicator={options?.showIndicator ?? true}
            >
                {label}
            </SovereignTooltip>
        );
    }
    return label;
}

/**
 * GlossaryText - Component version for inline use
 */
interface GlossaryTextProps {
    children: string;
    teacherMode?: boolean;
}

export const GlossaryText = ({ children, teacherMode = false }: GlossaryTextProps) => {
    return <>{withGlossary(children, { teacherMode })}</>;
};

/**
 * GlossaryLabel - For form labels with info icon
 */
interface GlossaryLabelProps {
    term: string;
    className?: string;
    teacherMode?: boolean;
}

export const GlossaryLabel = ({ term, className = '', teacherMode = false }: GlossaryLabelProps) => {
    const hasEntry = hasGlossaryEntry(term);

    return (
        <span className={`flex items-center gap-1 ${className}`}>
            {hasEntry ? (
                <SovereignTooltip term={term} teacherMode={teacherMode}>
                    <span className="flex items-center gap-1">
                        {term}
                        <Info className="w-3 h-3 opacity-40" />
                    </span>
                </SovereignTooltip>
            ) : (
                term
            )}
        </span>
    );
};

export default SovereignTooltip;
