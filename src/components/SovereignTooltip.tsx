/**
 * SOVEREIGN TOOLTIP: Dynamic Definition Adjustment
 * 
 * Tooltips that adapt their complexity based on the user's selected
 * cognitive depth preference. The same concept can be explained
 * simply or with full theoretical rigor.
 * 
 * PHILOSOPHY: Knowledge should never be gatekept by jargon.
 * The same truth can be spoken in many registers.
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Info, BookOpen } from 'lucide-react';

// Import type from Oracle - this is defined in both places for redundancy
export type CognitiveDepthLevel = 1 | 2 | 3 | 4 | 5;

// ============================================================================
// TYPES
// ============================================================================

export interface TooltipDefinition {
    concept: string;
    definitions: Record<CognitiveDepthLevel, string>;
}

interface SovereignTooltipProps {
    concept: string;
    depthLevel: CognitiveDepthLevel;
    children: React.ReactNode;
    placement?: 'top' | 'bottom' | 'left' | 'right';
}

// ============================================================================
// CONCEPT DEFINITIONS LIBRARY
// ============================================================================

const CONCEPT_DEFINITIONS: Record<string, Record<CognitiveDepthLevel, string>> = {
    'regulation': {
        1: "When your child's body feels calm and they can think clearly.",
        2: "Your child's ability to manage their emotions and stay calm.",
        3: "The capacity for emotional and behavioral self-regulation.",
        4: "Autonomic nervous system modulation across sympathetic/parasympathetic states.",
        5: "Polyvagal state modulation via ventral vagal engagement for window of tolerance maintenance.",
    },
    'dysregulation': {
        1: "When big feelings take over and it's hard to calm down.",
        2: "When your child feels overwhelmed and their body reacts strongly.",
        3: "A state where the nervous system shifts out of the window of tolerance.",
        4: "Sympathetic or dorsal vagal activation exceeding adaptive thresholds.",
        5: "Allostatic overload triggering amygdala hijack and polyvagal ladder descent.",
    },
    'reciprocity': {
        1: "The back-and-forth moments of connection between you and your child.",
        2: "When you and your child respond to each other in a give-and-take way.",
        3: "Bidirectional relational exchanges that build attachment security.",
        4: "Dyadic attunement patterns indicative of secure attachment dynamics.",
        5: "Recursive relational reciprocity as the fundamental unit of consciousness transmission.",
    },
    'sanctuary': {
        1: "A safe, calm space where your child feels protected.",
        2: "An environment designed to help your child feel secure and regulated.",
        3: "A therapeutic environment optimized for nervous system co-regulation.",
        4: "A neurodiverse-affirming holding environment honoring biological necessity.",
        5: "An epigenetically-resonant holding environment enabling recursive witnessing and emergent selfhood.",
    },
    'oracle': {
        1: "The helper that looks at your notes and gives you ideas.",
        2: "Our AI system that analyzes your observations and provides guidance.",
        3: "The pattern recognition engine that generates intervention suggestions.",
        4: "The recursive pattern emergence system that surfaces latent behavioral schemas.",
        5: "The phenomenological oracle that refracts parent witnessing into strength-based institutional language.",
    },
    'stim': {
        1: "Movements that help your child's body feel better, like rocking or hand-flapping.",
        2: "Self-stimulating behaviors that help your child regulate their nervous system.",
        3: "Stimming behaviors serving regulatory and sensory integration functions.",
        4: "Biological necessity movements providing proprioceptive/vestibular regulation.",
        5: "Biological necessity phenomena as autonomous nervous system modulation strategies.",
    },
    'entropy': {
        1: "When there's too much change and things feel confusing or unpredictable.",
        2: "The inconsistency in responses that can increase your child's stress.",
        3: "Response variability that increases cognitive load for the child.",
        4: "Systemic entropy in caregiver responses correlating with regulation challenges.",
        5: "Communicative entropy disrupting predictive encoding and phase-locking in the parent-child dyad.",
    },
    'anchor phrase': {
        1: "A family saying you use the same way every time, like 'You know mommy said no.'",
        2: "A consistent phrase that creates predictability for your child.",
        3: "A rhythmic anchor that reduces cognitive load through predictable phrasing.",
        4: "A consistency anchor functioning as a systemic entropy reduction mechanism.",
        5: "A phase-locking verbal anchor that reduces systemic entropy and enables predictive encoding.",
    },
    'IEP': {
        1: "The plan your child's school uses to help them learn.",
        2: "A school document that describes the extra support your child receives.",
        3: "Individualized Education Program—legally binding accommodations and goals.",
        4: "The institutional documentation framework for legally mandated educational supports.",
        5: "The institutional bridge documentation translating parental phenomenological witnessing into systemic advocacy.",
    },
    'co-regulation': {
        1: "When you calm down together with your child.",
        2: "Helping your child regulate by being calm and connected yourself.",
        3: "The process of supporting a child's regulation through caregiver attunement.",
        4: "Dyadic regulation via prosodic attunement and nervous system synchronization.",
        5: "Dyadic consciousness synchronization enabling top-down prefrontal modulation via relational container.",
    },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get definition for a concept at a specific depth level
 */
export function getConceptDefinition(
    concept: string,
    depthLevel: CognitiveDepthLevel
): string {
    const normalizedConcept = concept.toLowerCase().trim();
    const definitions = CONCEPT_DEFINITIONS[normalizedConcept];

    if (definitions) {
        return definitions[depthLevel];
    }

    // Fallback if concept not in our library
    return `${concept}: Definition varies by depth level.`;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const SovereignTooltip = ({
    concept,
    depthLevel,
    children,
    placement = 'top'
}: SovereignTooltipProps) => {
    const [isVisible, setIsVisible] = useState(false);

    const definition = getConceptDefinition(concept, depthLevel);

    const showTooltip = useCallback(() => setIsVisible(true), []);
    const hideTooltip = useCallback(() => setIsVisible(false), []);

    const getPlacementStyles = () => {
        switch (placement) {
            case 'top': return { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '8px' };
            case 'bottom': return { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '8px' };
            case 'left': return { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: '8px' };
            case 'right': return { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: '8px' };
        }
    };

    return (
        <span
            className="relative inline-flex items-center"
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
            onFocus={showTooltip}
            onBlur={hideTooltip}
        >
            {children}

            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 w-64 p-4 rounded-xl glass-panel"
                        style={{
                            ...getPlacementStyles(),
                            background: 'linear-gradient(145deg, rgba(30,30,40,0.95), rgba(20,20,30,0.98))',
                            border: '1px solid rgba(139, 92, 246, 0.3)',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                        }}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="w-4 h-4" style={{ color: '#A78BFA' }} />
                            <span className="text-xs font-bold uppercase tracking-wide opacity-60">
                                {concept}
                            </span>
                        </div>
                        <p className="text-sm text-white/80 leading-relaxed">
                            {definition}
                        </p>
                        <div className="mt-2 text-xs opacity-40">
                            Depth Level {depthLevel}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </span>
    );
};

// ============================================================================
// INLINE HELP ICON
// ============================================================================

interface HelpIconProps {
    concept: string;
    depthLevel: CognitiveDepthLevel;
}

export const HelpIcon = ({ concept, depthLevel }: HelpIconProps) => (
    <SovereignTooltip concept={concept} depthLevel={depthLevel}>
        <button
            className="inline-flex items-center justify-center w-4 h-4 rounded-full ml-1 opacity-40 hover:opacity-100 transition-opacity"
            style={{ background: 'rgba(139, 92, 246, 0.2)' }}
        >
            <HelpCircle className="w-3 h-3" style={{ color: '#A78BFA' }} />
        </button>
    </SovereignTooltip>
);

// ============================================================================
// INFO BADGE
// ============================================================================

interface InfoBadgeProps {
    concept: string;
    depthLevel: CognitiveDepthLevel;
    label?: string;
}

export const InfoBadge = ({ concept, depthLevel, label }: InfoBadgeProps) => (
    <SovereignTooltip concept={concept} depthLevel={depthLevel}>
        <span
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs cursor-help"
            style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#A78BFA' }}
        >
            <Info className="w-3 h-3" />
            {label || concept}
        </span>
    </SovereignTooltip>
);

export default SovereignTooltip;
