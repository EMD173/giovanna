/**
 * SOS PULSE: Global Safety Footer
 * 
 * CRITICAL FEATURE: Provides 24/7 crisis resources on every screen.
 * Non-negotiable for an app serving stressed caregivers.
 * 
 * Features:
 * - 988 Suicide & Crisis Lifeline (US)
 * - Collapsible but always accessible
 * - Gentle pulse animation for visibility
 */

import { useState } from 'react';
import { Phone, Heart, ChevronUp, ChevronDown, ExternalLink, MessageCircle } from 'lucide-react';

interface SOSPulseProps {
    /** If true, show expanded by default */
    defaultExpanded?: boolean;
}

export const SOSPulse = ({ defaultExpanded = false }: SOSPulseProps) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    const crisisResources = [
        {
            name: '988 Suicide & Crisis Lifeline',
            phone: '988',
            description: 'Free, 24/7 support for mental health crises',
            icon: Phone,
        },
        {
            name: 'Crisis Text Line',
            phone: 'Text HOME to 741741',
            description: 'Free crisis counseling via text',
            icon: MessageCircle,
        },
    ];

    return (
        <div
            className="fixed bottom-0 left-0 right-0 z-50"
            role="complementary"
            aria-label="Crisis support resources"
        >
            {/* Collapsed Bar */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 text-xs font-medium transition-all"
                style={{
                    background: 'linear-gradient(135deg, rgba(75, 0, 130, 0.95) 0%, rgba(139, 92, 246, 0.95) 100%)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                }}
                aria-expanded={isExpanded}
                aria-controls="sos-expanded-panel"
            >
                <Heart className="w-3 h-3 animate-pulse" />
                <span>Need support? You're not alone.</span>
                {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                ) : (
                    <ChevronUp className="w-4 h-4" />
                )}
            </button>

            {/* Expanded Panel */}
            {isExpanded && (
                <div
                    id="sos-expanded-panel"
                    className="bg-white/95 backdrop-blur-lg border-t border-[#4B0082]/20 p-4 space-y-3"
                >
                    <p className="text-xs text-center opacity-70 mb-3">
                        If you're in crisis or need immediate support, please reach out:
                    </p>

                    {crisisResources.map((resource) => (
                        <a
                            key={resource.name}
                            href={resource.phone.startsWith('Text') ? undefined : `tel:${resource.phone}`}
                            className="flex items-center gap-3 p-3 rounded-xl bg-[#4B0082]/5 hover:bg-[#4B0082]/10 transition-colors"
                            aria-label={`${resource.name}: ${resource.phone}`}
                        >
                            <div className="p-2 rounded-full bg-[#4B0082]/10">
                                <resource.icon className="w-4 h-4 text-[#4B0082]" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-[#1A1A1A]">
                                    {resource.name}
                                </p>
                                <p className="text-xs text-[#4B0082] font-bold">
                                    {resource.phone}
                                </p>
                                <p className="text-xs opacity-60">
                                    {resource.description}
                                </p>
                            </div>
                            {!resource.phone.startsWith('Text') && (
                                <ExternalLink className="w-4 h-4 opacity-40" />
                            )}
                        </a>
                    ))}

                    <p className="text-xs text-center opacity-50 pt-2">
                        Giovanna is here to support you, but these resources are available 24/7.
                    </p>
                </div>
            )}
        </div>
    );
};

export default SOSPulse;
