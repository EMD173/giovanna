/**
 * WISDOM VAULT: Spiritual and Psychological Anchors Registry
 * 
 * A sacred repository of wisdom from diverse traditions,
 * activated when relational reciprocity is low to offer
 * strength and presence to the caregiver.
 * 
 * TRADITIONS:
 * - Bible (Trials & Strength)
 * - Gabor Maté (Trauma-Informed)
 * - Eckhart Tolle (Presence)
 * - Buddhism (Compassion)
 * - Hinduism (Dharma)
 */

// ============================================================================
// TYPES
// ============================================================================

export type WisdomAnchor =
    | 'bible'
    | 'gabor_mate'
    | 'eckhart_tolle'
    | 'buddhism'
    | 'hinduism'
    | 'secular';

export interface WisdomEntry {
    id: string;
    anchor: WisdomAnchor;
    category: string;          // e.g., "Trials", "Compassion", "Presence"
    quote: string;
    source: string;            // e.g., "Philippians 4:13", "The Body Keeps the Score"
    reflection: string;        // Oracle's contextual interpretation
    contexts: string[];        // When to surface (e.g., "low_reciprocity", "dysregulation")
}

export interface WisdomRefraction {
    entry: WisdomEntry;
    personalizedReflection: string;  // Tailored to the current moment
    readBackText: string;            // For TTS vocalization
}

// ============================================================================
// WISDOM REGISTRY
// ============================================================================

export const WISDOM_REGISTRY: WisdomEntry[] = [
    // BIBLE - Trials & Strength
    {
        id: 'bible-001',
        anchor: 'bible',
        category: 'Trials',
        quote: "I can do all things through Christ who strengthens me.",
        source: "Philippians 4:13",
        reflection: "Your strength in this moment is not manufactured—it flows from a source deeper than exhaustion.",
        contexts: ['low_reciprocity', 'exhaustion', 'overwhelm'],
    },
    {
        id: 'bible-002',
        anchor: 'bible',
        category: 'Strength',
        quote: "Come to me, all you who are weary and burdened, and I will give you rest.",
        source: "Matthew 11:28",
        reflection: "The weight you carry for your child is seen. Rest is not abandonment—it is replenishment.",
        contexts: ['caregiver_fatigue', 'low_reciprocity', 'burnout'],
    },
    {
        id: 'bible-003',
        anchor: 'bible',
        category: 'Peace',
        quote: "Be still, and know that I am God.",
        source: "Psalm 46:10",
        reflection: "In the chaos of dysregulation, stillness is not passivity—it is profound trust.",
        contexts: ['dysregulation', 'anxiety', 'storm'],
    },
    {
        id: 'bible-004',
        anchor: 'bible',
        category: 'Purpose',
        quote: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you a hope and a future.",
        source: "Jeremiah 29:11",
        reflection: "Your child's trajectory is not defined by today's storm. There is a future being woven.",
        contexts: ['despair', 'low_reciprocity', 'diagnosis'],
    },

    // GABOR MATÉ - Trauma-Informed
    {
        id: 'mate-001',
        anchor: 'gabor_mate',
        category: 'Trauma',
        quote: "The question is never 'What's wrong with you?' but 'What happened to you?'",
        source: "Dr. Gabor Maté, The Wisdom of Trauma",
        reflection: "Your child's behavior is not defiance—it is the body remembering what the mind may not.",
        contexts: ['behavioral_storm', 'misrecognition', 'institutional_pressure'],
    },
    {
        id: 'mate-002',
        anchor: 'gabor_mate',
        category: 'Authenticity',
        quote: "The two most important things children need from their parents are attachment and authenticity.",
        source: "Dr. Gabor Maté",
        reflection: "You do not need to be perfect. Your presence—real and imperfect—is the medicine.",
        contexts: ['parenting_guilt', 'low_reciprocity', 'perfectionism'],
    },
    {
        id: 'mate-003',
        anchor: 'gabor_mate',
        category: 'Connection',
        quote: "Safe relationships are the most powerful healing process we know.",
        source: "Dr. Gabor Maté",
        reflection: "The connection you're building with your child—even through rupture—is the healing.",
        contexts: ['disconnection', 'repair', 'low_reciprocity'],
    },

    // ECKHART TOLLE - Presence
    {
        id: 'tolle-001',
        anchor: 'eckhart_tolle',
        category: 'Presence',
        quote: "Realize deeply that the present moment is all you ever have.",
        source: "Eckhart Tolle, The Power of Now",
        reflection: "This breath. This moment with your child. It is complete in itself.",
        contexts: ['anxiety', 'future_worry', 'overwhelm'],
    },
    {
        id: 'tolle-002',
        anchor: 'eckhart_tolle',
        category: 'Stillness',
        quote: "Stillness is the language God speaks, and everything else is a bad translation.",
        source: "Eckhart Tolle",
        reflection: "Beyond the noise of diagnosis and behavior, there is a stillness where truth lives.",
        contexts: ['mental_noise', 'institutional_overwhelm', 'clarity'],
    },
    {
        id: 'tolle-003',
        anchor: 'eckhart_tolle',
        category: 'Acceptance',
        quote: "Whatever the present moment contains, accept it as if you had chosen it.",
        source: "Eckhart Tolle",
        reflection: "Resistance multiplies suffering. Acceptance does not mean agreement—it means presence.",
        contexts: ['resistance', 'low_reciprocity', 'dysregulation'],
    },

    // BUDDHISM - Compassion
    {
        id: 'buddhism-001',
        anchor: 'buddhism',
        category: 'Compassion',
        quote: "If you want others to be happy, practice compassion. If you want to be happy, practice compassion.",
        source: "Dalai Lama",
        reflection: "Compassion for your child begins with compassion for yourself. You cannot pour from empty.",
        contexts: ['self_criticism', 'caregiver_fatigue', 'low_reciprocity'],
    },
    {
        id: 'buddhism-002',
        anchor: 'buddhism',
        category: 'Impermanence',
        quote: "This too shall pass.",
        source: "Buddhist Teaching",
        reflection: "The storm is real. Its permanence is illusion. The calm will return.",
        contexts: ['crisis', 'dysregulation', 'despair'],
    },
    {
        id: 'buddhism-003',
        anchor: 'buddhism',
        category: 'Suffering',
        quote: "Pain is inevitable. Suffering is optional.",
        source: "Buddhist Teaching",
        reflection: "You cannot remove your child's pain. But you can be present with them in it.",
        contexts: ['helplessness', 'pain', 'low_reciprocity'],
    },
    {
        id: 'buddhism-004',
        anchor: 'buddhism',
        category: 'Loving-Kindness',
        quote: "May I be happy. May I be healthy. May I be safe. May I live with ease.",
        source: "Metta Prayer",
        reflection: "Before you can hold your child, hold yourself with this same tenderness.",
        contexts: ['self_care', 'burnout', 'caregiver_fatigue'],
    },

    // HINDUISM - Dharma
    {
        id: 'hinduism-001',
        anchor: 'hinduism',
        category: 'Dharma',
        quote: "You have the right to work, but never to the fruit of work.",
        source: "Bhagavad Gita 2:47",
        reflection: "Your role is to show up fully. The outcome is not yours to control.",
        contexts: ['outcome_anxiety', 'perfectionism', 'letting_go'],
    },
    {
        id: 'hinduism-002',
        anchor: 'hinduism',
        category: 'Inner Self',
        quote: "The soul is neither born, and nor does it die.",
        source: "Bhagavad Gita 2:20",
        reflection: "Your child's essence is eternal. The behaviors are waves; the ocean remains.",
        contexts: ['identity_crisis', 'diagnosis', 'grief'],
    },
    {
        id: 'hinduism-003',
        anchor: 'hinduism',
        category: 'Equanimity',
        quote: "Be steadfast in yoga, O Arjuna. Perform your duty and abandon all attachment to success or failure.",
        source: "Bhagavad Gita 2:48",
        reflection: "Steadiness in the storm is its own victory. Your presence is the practice.",
        contexts: ['instability', 'low_reciprocity', 'crisis'],
    },

    // SECULAR - Universal Wisdom
    {
        id: 'secular-001',
        anchor: 'secular',
        category: 'Resilience',
        quote: "You are not responsible for your child's every emotion. You are responsible for your presence.",
        source: "Giovanna Oracle",
        reflection: "Regulation is contagious. Your calm, however imperfect, is a gift.",
        contexts: ['responsibility_overwhelm', 'guilt', 'co_regulation'],
    },
    {
        id: 'secular-002',
        anchor: 'secular',
        category: 'Self-Compassion',
        quote: "You are doing harder things than most people can see.",
        source: "Giovanna Oracle",
        reflection: "The invisible labor of caregiving is real. Let yourself be witnessed.",
        contexts: ['isolation', 'invisibility', 'low_reciprocity'],
    },
    {
        id: 'secular-003',
        anchor: 'secular',
        category: 'Repair',
        quote: "Rupture followed by repair builds stronger bonds than no rupture at all.",
        source: "Attachment Theory",
        reflection: "The moments you 'fail' and return are the moments trust deepens.",
        contexts: ['rupture', 'guilt', 'repair'],
    },
];

// ============================================================================
// WISDOM SELECTION LOGIC
// ============================================================================

/**
 * Get wisdom entries for a specific anchor tradition
 */
export function getWisdomByAnchor(anchor: WisdomAnchor): WisdomEntry[] {
    return WISDOM_REGISTRY.filter(w => w.anchor === anchor);
}

/**
 * Get wisdom entries matching a specific context
 */
export function getWisdomByContext(context: string): WisdomEntry[] {
    return WISDOM_REGISTRY.filter(w =>
        w.contexts.some(c => c.includes(context) || context.includes(c))
    );
}

/**
 * Get a wisdom refraction based on reciprocity level and user's spiritual anchor
 * 
 * @param reciprocityLevel - The current relational reciprocity (1-5)
 * @param preferredAnchors - User's chosen spiritual/psychological anchors
 * @param context - Optional context string for more specific matching
 */
export function getWisdomRefraction(
    reciprocityLevel: number,
    preferredAnchors: WisdomAnchor[] = ['secular'],
    context?: string
): WisdomRefraction | null {
    // Only trigger wisdom when reciprocity is low (< 2)
    if (reciprocityLevel >= 2) {
        return null;
    }

    // Build context string
    const contextStr = context || 'low_reciprocity';

    // Filter by preferred anchors first, then by context
    let candidates = WISDOM_REGISTRY.filter(w =>
        preferredAnchors.includes(w.anchor) &&
        w.contexts.some(c => c.includes(contextStr) || contextStr.includes(c) || c === 'low_reciprocity')
    );

    // If no matches with preferred anchors, fall back to secular
    if (candidates.length === 0) {
        candidates = WISDOM_REGISTRY.filter(w =>
            w.anchor === 'secular' &&
            w.contexts.some(c => c.includes('low_reciprocity'))
        );
    }

    // If still no matches, get any low_reciprocity entry
    if (candidates.length === 0) {
        candidates = WISDOM_REGISTRY.filter(w =>
            w.contexts.includes('low_reciprocity')
        );
    }

    if (candidates.length === 0) {
        return null;
    }

    // Select a random entry from candidates
    const entry = candidates[Math.floor(Math.random() * candidates.length)];

    // Generate personalized reflection and read-back text
    const personalizedReflection = generatePersonalizedReflection(entry, reciprocityLevel);
    const readBackText = generateReadBackText(entry);

    return {
        entry,
        personalizedReflection,
        readBackText,
    };
}

/**
 * Generate a personalized reflection based on the entry and current state
 */
function generatePersonalizedReflection(entry: WisdomEntry, reciprocityLevel: number): string {
    const intensityPrefix = reciprocityLevel === 1
        ? "In this moment of deep disconnection, "
        : "As you navigate this challenge, ";

    return `${intensityPrefix}${entry.reflection}`;
}

/**
 * Generate text optimized for Text-to-Speech read-back
 */
function generateReadBackText(entry: WisdomEntry): string {
    const anchorIntro = getAnchorIntro(entry.anchor);

    return `${anchorIntro}... "${entry.quote}"... ${entry.reflection}`;
}

/**
 * Get the introductory phrase for each anchor tradition
 */
function getAnchorIntro(anchor: WisdomAnchor): string {
    switch (anchor) {
        case 'bible':
            return "From scripture";
        case 'gabor_mate':
            return "Dr. Gabor Maté reminds us";
        case 'eckhart_tolle':
            return "Eckhart Tolle teaches";
        case 'buddhism':
            return "The Buddhist tradition offers";
        case 'hinduism':
            return "From the Bhagavad Gita";
        case 'secular':
            return "A moment of wisdom";
        default:
            return "A reflection for you";
    }
}

/**
 * Get all available anchor options for user selection
 */
export function getAvailableAnchors(): { value: WisdomAnchor; label: string; description: string }[] {
    return [
        {
            value: 'bible',
            label: 'Scripture (Bible)',
            description: 'Find strength in trials through Biblical wisdom'
        },
        {
            value: 'gabor_mate',
            label: 'Trauma-Informed (Gabor Maté)',
            description: 'Understand behavior as communication'
        },
        {
            value: 'eckhart_tolle',
            label: 'Presence (Eckhart Tolle)',
            description: 'Return to the present moment'
        },
        {
            value: 'buddhism',
            label: 'Buddhism',
            description: 'Practice compassion and impermanence'
        },
        {
            value: 'hinduism',
            label: 'Hinduism (Bhagavad Gita)',
            description: 'Embrace dharma and equanimity'
        },
        {
            value: 'secular',
            label: 'Universal Wisdom',
            description: 'Non-religious reflections on caregiving'
        },
    ];
}
