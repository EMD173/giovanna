/**
 * Concept Definitions Library
 * 
 * Provides definitions for concepts at different cognitive depth levels.
 * Used by SovereignTooltip components.
 */

export type CognitiveDepthLevel = 1 | 2 | 3 | 4 | 5;

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
