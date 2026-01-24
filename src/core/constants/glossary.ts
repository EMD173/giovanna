/**
 * GLOSSARY OF RECOGNITION: Educational Layer
 * 
 * Definitions for institutional, therapeutic, and philosophical terms
 * used throughout the Sanctuary. Each term is framed with dignity
 * and parental empowerment.
 * 
 * Category types:
 * - institutional: School/legal system terms
 * - therapeutic: Clinical terms reframed with dignity
 * - philosophical: Core Sanctuary framework concepts
 * - practical: Day-to-day caregiving terms
 */

export interface GlossaryEntry {
    term: string;
    definition: string;
    category: 'institutional' | 'therapeutic' | 'philosophical' | 'practical';
    dignityFraming?: string;
    relatedTerms?: string[];
}

export const GLOSSARY: Record<string, GlossaryEntry> = {
    // INSTITUTIONAL TERMS
    'IEP': {
        term: 'IEP',
        definition: 'Individualized Education Program — A legal instrument for the preservation of dignity and the orchestration of support within institutional structures.',
        category: 'institutional',
        dignityFraming: 'You have a legal seat at this table. This document is your child\'s constitutional right to dignity in education.',
        relatedTerms: ['BIP', 'FBA', '504 Plan', 'Legal Map'],
    },

    'BIP': {
        term: 'BIP',
        definition: 'Behavior Intervention Plan — A strategic roadmap for co-regulation; a response to systemic Atmospheric Resonance rather than a deficit-based behavior tracker.',
        category: 'institutional',
        dignityFraming: 'This plan must center your child\'s communication, not institutional compliance. You are the lead author of their regulation story.',
        relatedTerms: ['IEP', 'FBA', 'Antecedent', 'Atmospheric Resonance'],
    },

    'FBA': {
        term: 'FBA',
        definition: 'Functional Behavior Assessment — An analysis of what your child\'s behavior is communicating.',
        category: 'institutional',
        dignityFraming: 'Every "behavior" has a function. The FBA should seek to understand, not control.',
        relatedTerms: ['BIP', 'Antecedent', 'Trigger'],
    },

    '504 Plan': {
        term: '504 Plan',
        definition: 'A plan providing accommodations for students with disabilities to access education equally.',
        category: 'institutional',
        dignityFraming: 'Accommodations remove barriers. They are not special treatment — they are equity.',
        relatedTerms: ['IEP', 'Accommodations'],
    },

    // THERAPEUTIC TERMS (Reframed with Dignity)
    'Stimming': {
        term: 'Stimming',
        definition: 'Self-stimulatory behaviors — rhythmic movements or sounds that help regulate the nervous system.',
        category: 'therapeutic',
        dignityFraming: 'Essential Regulation Behaviors. These are NOT problems to eliminate.',
        relatedTerms: ['Sensory Need', 'Regulation'],
    },

    'Meltdown': {
        term: 'Meltdown',
        definition: 'A neurological response to overwhelm when the nervous system can no longer cope with demands.',
        category: 'therapeutic',
        dignityFraming: 'This is NOT a tantrum or manipulation. This is a system in crisis, calling for co-regulation.',
        relatedTerms: ['Dysregulation', 'Sensory Overload'],
    },

    'Dysregulation': {
        term: 'Dysregulation',
        definition: 'The nervous system\'s inability to return to a calm baseline without support.',
        category: 'therapeutic',
        dignityFraming: 'Dysregulation is a signal, not a failure. It indicates a need for co-regulation.',
        relatedTerms: ['Regulation', 'Co-regulation'],
    },

    'Sensory Overload': {
        term: 'Sensory Overload',
        definition: 'When sensory input exceeds the nervous system\'s ability to process, causing distress.',
        category: 'therapeutic',
        dignityFraming: 'The environment is too demanding. This is not a personal deficit.',
        relatedTerms: ['Stimming', 'Meltdown', 'Sensory Diet'],
    },

    'Sensory Diet': {
        term: 'Sensory Diet',
        definition: 'A personalized plan of sensory activities to maintain optimal regulation throughout the day.',
        category: 'therapeutic',
        dignityFraming: 'Like physical nourishment, sensory needs must be met proactively.',
        relatedTerms: ['Sensory Overload', 'Proprioceptive Input'],
    },

    'Proprioceptive Input': {
        term: 'Proprioceptive Input',
        definition: 'Deep pressure or heavy work that helps the body know where it is in space.',
        category: 'therapeutic',
        dignityFraming: 'This is brain food. Heavy lifting, tight hugs, and jumping meet this need.',
        relatedTerms: ['Sensory Diet', 'Stimming'],
    },

    // PHILOSOPHICAL TERMS (Sanctuary Framework)
    'Atmospheric Resonance': {
        term: 'Atmospheric Resonance',
        definition: 'The historical, systemic, and environmental pressures — including power dynamics and misrecognition — that impact a child\'s biological and emotional state.',
        category: 'philosophical',
        dignityFraming: 'Your child\'s nervous system is a seismograph of systemic forces. Context is never just background; it is felt in the body.',
        relatedTerms: ['Epigenetic Consciousness', 'Relational Reciprocity', 'Misrecognition'],
    },

    'Relational Reciprocity': {
        term: 'Relational Reciprocity',
        definition: 'The state of mutual recognition where power is balanced and healing remains alive through a sacred exchange of giving and receiving.',
        category: 'philosophical',
        dignityFraming: 'Connection is the medicine. When you see them fully, they can see themselves. This is the sacred exchange.',
        relatedTerms: ['Atmospheric Resonance', 'Co-regulation', 'Witnessing'],
    },

    'Epigenetic Consciousness': {
        term: 'Epigenetic Consciousness',
        definition: 'A theory of identity and healing as emergent processes shaped by history, biology, culture, spirit, and power.',
        category: 'philosophical',
        dignityFraming: 'Your child carries ancestral memory in their cells. Their identity is not fixed — it emerges through relationship, resilience, and witnessing.',
        relatedTerms: ['Atmospheric Resonance', 'Lineage', 'Emergence'],
    },

    'Deficit-to-Dignity': {
        term: 'Deficit-to-Dignity',
        definition: 'The practice of translating clinical "problem" language into strength-based, communication-centered framing.',
        category: 'philosophical',
        dignityFraming: 'Every "deficit" labeled by institutions is a communication to be understood.',
        relatedTerms: ['Behavior as Communication', 'Strength Narrative'],
    },

    'Behavior as Communication': {
        term: 'Behavior as Communication',
        definition: 'The principle that all behavior — especially "challenging" behavior — is meaningful communication from the nervous system.',
        category: 'philosophical',
        dignityFraming: 'There is no such thing as a "bad" behavior. Only unmet needs signaling for help.',
        relatedTerms: ['Deficit-to-Dignity', 'FBA'],
    },

    // PRACTICAL TERMS
    'Co-regulation': {
        term: 'Co-regulation',
        definition: 'The process of calming together — an adult lending their regulated nervous system to help a child regulate.',
        category: 'practical',
        dignityFraming: 'You cannot regulate alone when young. Co-regulation is not coddling — it is development.',
        relatedTerms: ['Dysregulation', 'Relational Reciprocity'],
    },

    'Antecedent': {
        term: 'Antecedent',
        definition: 'What happens immediately before a behavior — the trigger or environmental context.',
        category: 'practical',
        dignityFraming: 'Understanding antecedents means understanding what your child is responding to.',
        relatedTerms: ['FBA', 'BIP', 'Trigger'],
    },

    'Trigger': {
        term: 'Trigger',
        definition: 'An environmental factor, sensory input, or event that activates a stress response.',
        category: 'practical',
        dignityFraming: 'Triggers are data, not flaws. Knowing them is protective wisdom.',
        relatedTerms: ['Antecedent', 'FBA', 'Meltdown'],
    },

    'Strength Narrative': {
        term: 'Strength Narrative',
        definition: 'A description of an observation that centers the child\'s dignity, capacity, and communication.',
        category: 'practical',
        dignityFraming: 'How we name what we see shapes how we respond. Language creates reality.',
        relatedTerms: ['Deficit-to-Dignity', 'Behavior as Communication'],
    },

    'Accommodations': {
        term: 'Accommodations',
        definition: 'Environmental or instructional modifications that remove barriers to access.',
        category: 'practical',
        dignityFraming: 'Accommodations are not advantages. They are access. Every child deserves access.',
        relatedTerms: ['IEP', '504 Plan'],
    },

    'Regulation': {
        term: 'Regulation',
        definition: 'The nervous system\'s ability to maintain or return to a calm, alert state.',
        category: 'practical',
        dignityFraming: 'Regulation is learned, not expected. It develops through safe connection.',
        relatedTerms: ['Dysregulation', 'Co-regulation', 'Stimming'],
    },

    // NEURAL SYSTEMS TERMS (Complex Systems Lens)
    'Emergence': {
        term: 'Emergence',
        definition: 'When simple interactions between parts create complex, unpredicted outcomes that cannot be explained by examining parts alone.',
        category: 'philosophical',
        dignityFraming: 'Your child is not a collection of symptoms. They are an emerging whole greater than any diagnosis.',
        relatedTerms: ['Feedback Loop', 'Systemic Entropy', 'Node'],
    },

    'Feedback Loop': {
        term: 'Feedback Loop',
        definition: 'A process where the output of a system circles back as input, amplifying or dampening future responses.',
        category: 'philosophical',
        dignityFraming: 'Positive moments build on each other. Every witnessed connection strengthens the next.',
        relatedTerms: ['Emergence', 'Relational Reciprocity', 'Weighting'],
    },

    'Weighting': {
        term: 'Weighting',
        definition: 'How much importance or influence the system gives to a specific input, context, or pattern.',
        category: 'philosophical',
        dignityFraming: 'The Oracle learns what matters by listening to patterns in your observations.',
        relatedTerms: ['Feedback Loop', 'Edge', 'Atmospheric Resonance'],
    },

    'Systemic Entropy': {
        term: 'Systemic Entropy',
        definition: 'The degree of disorder, unpredictability, or disconnection within a complex system over time.',
        category: 'philosophical',
        dignityFraming: 'High entropy means the system is struggling. This is information, not judgment.',
        relatedTerms: ['Emergence', 'Regulation', 'Atmospheric Resonance'],
    },

    'Node': {
        term: 'Node',
        definition: 'A single observation or moment in the network of your child\'s lived experience.',
        category: 'philosophical',
        dignityFraming: 'Every log you create is a sacred data point in understanding the whole.',
        relatedTerms: ['Edge', 'Emergence', 'Trajectory'],
    },

    'Edge': {
        term: 'Edge',
        definition: 'The relationship or connection between two observations, contexts, or patterns.',
        category: 'philosophical',
        dignityFraming: 'The Oracle traces edges to reveal hidden connections in your child\'s story.',
        relatedTerms: ['Node', 'Weighting', 'Feedback Loop'],
    },

    'Hidden Variable': {
        term: 'Hidden Variable',
        definition: 'An underlying factor (biological, sensory, emotional) that influences outcomes but is not directly observed.',
        category: 'philosophical',
        dignityFraming: 'What you cannot see still matters. The body holds knowledge the mind may miss.',
        relatedTerms: ['Edge', 'Emergence', 'Biological State'],
    },

    'Trajectory': {
        term: 'Trajectory',
        definition: 'The directional path of change over time — not a fixed label but an evolving story.',
        category: 'philosophical',
        dignityFraming: 'Your child is not defined by any single moment. They are a trajectory, always becoming.',
        relatedTerms: ['Emergence', 'Node', 'Epigenetic Consciousness'],
    },

    'Biological State': {
        term: 'Biological State',
        definition: 'The body\'s current physiological condition: sensory load, fatigue, hunger, arousal level.',
        category: 'practical',
        dignityFraming: 'The body speaks first. Always check the biological before assuming the behavioral.',
        relatedTerms: ['Hidden Variable', 'Sensory Overload', 'Regulation'],
    },

    // ELITE SYSTEMS THEORY TERMS
    'Backpropagation': {
        term: 'Backpropagation',
        definition: 'The process of learning from past relational interactions to strengthen future pathways toward joy and reciprocity.',
        category: 'philosophical',
        dignityFraming: 'Every moment teaches. The sanctuary learns by tracing patterns of connection back to their roots.',
        relatedTerms: ['Feedback Loop', 'Emergence', 'Weighting', 'Relational Reciprocity'],
    },

    'Phase Transition': {
        term: 'Phase Transition',
        definition: 'A moment in a complex system when small changes in biological or atmospheric input lead to a total shift in regulation state.',
        category: 'philosophical',
        dignityFraming: 'The tipping point. Sometimes one small thing changes everything. This is why proactive witnessing matters.',
        relatedTerms: ['Systemic Entropy', 'Trigger', 'Meltdown', 'Atmospheric Resonance'],
    },

    'Systemic Bias': {
        term: 'Systemic Bias',
        definition: 'The institutional "weights" that default toward misrecognition — built-in assumptions that see deficits instead of communications.',
        category: 'philosophical',
        dignityFraming: 'Systems are not neutral. They were built with biases. Your witnessing corrects the record.',
        relatedTerms: ['Deficit-to-Dignity', 'Weighting', 'Institutional'],
    },

    'Attractor State': {
        term: 'Attractor State',
        definition: 'A stable pattern the nervous system tends to return to — whether regulated calm or dysregulated stress.',
        category: 'philosophical',
        dignityFraming: 'The goal is not to eliminate hard moments, but to widen the basin of the calm attractor.',
        relatedTerms: ['Regulation', 'Dysregulation', 'Phase Transition'],
    },

    'Perturbation': {
        term: 'Perturbation',
        definition: 'A disturbance to the system that tests its stability — sensory, emotional, or environmental.',
        category: 'philosophical',
        dignityFraming: 'Perturbations reveal the system\'s true state. They are diagnostic, not destructive.',
        relatedTerms: ['Trigger', 'Antecedent', 'Phase Transition'],
    },

    'Proactive Regulation': {
        term: 'Proactive Regulation',
        definition: 'Anticipating sensory or emotional needs before dysregulation occurs — prevention over intervention.',
        category: 'practical',
        dignityFraming: 'The Oracle predicts. You can prepare the environment before the storm.',
        relatedTerms: ['Sensory Diet', 'Regulation', 'Phase Transition'],
    },

    'Correction Requirement': {
        term: 'Correction Requirement',
        definition: 'An Oracle-predicted need for sensory, environmental, or relational adjustment to prevent disconnect.',
        category: 'practical',
        dignityFraming: 'This is not about fixing your child. It is about correcting the environment to meet their needs.',
        relatedTerms: ['Proactive Regulation', 'Phase Transition', 'Accommodations'],
    },

    // ESSENTIAL SENSORY INPUTS (Enhanced Framing)
    'Vestibular Input': {
        term: 'Vestibular Input',
        definition: 'Movement-based sensory input that helps the brain understand body position and motion — spinning, swinging, rocking.',
        category: 'therapeutic',
        dignityFraming: 'Essential Sensory Input. Movement is medicine for the nervous system.',
        relatedTerms: ['Proprioceptive Input', 'Sensory Diet', 'Stimming'],
    },

    // SYSTEMIC NOISE TERMS
    'Misrecognition': {
        term: 'Misrecognition',
        definition: 'When institutions see a child through deficit-based lenses, masking their true communication and strengths.',
        category: 'philosophical',
        dignityFraming: 'The systemic noise that masks your child\'s truth. Your witnessing cuts through this fog.',
        relatedTerms: ['Systemic Bias', 'Deficit-to-Dignity', 'Behavior as Communication'],
    },

    'Legal Map': {
        term: 'Legal Map',
        definition: 'Documents like IEPs and 504 Plans that establish legal rights and accommodations for your child\'s educational journey.',
        category: 'institutional',
        dignityFraming: 'Your seat at the table. These are not requests — they are legal mandates.',
        relatedTerms: ['IEP', 'BIP', '504 Plan', 'Accommodations'],
    },

    'Lineage': {
        term: 'Lineage',
        definition: 'The ancestral, cultural, and biological inheritance that shapes your child\'s nervous system and identity.',
        category: 'philosophical',
        dignityFraming: 'Your family\'s historical and biological lineage. Your child carries ancestors who survived.',
        relatedTerms: ['Epigenetic Consciousness', 'Atmospheric Resonance'],
    },

    'Sacred Summary': {
        term: 'Sacred Summary',
        definition: 'A dignified, strength-centered overview of your child for transitions and handoffs.',
        category: 'practical',
        dignityFraming: 'This is not a file to be passed around. It is a sacred document of witnessing.',
        relatedTerms: ['Digital Passport', 'Strength Narrative'],
    },

    'Digital Passport': {
        term: 'Digital Passport',
        definition: 'A secure, shareable profile containing your child\'s communication channels, regulation strategies, and dignity-centered identity.',
        category: 'practical',
        dignityFraming: 'A portable sanctuary. Carry your child\'s truth wherever they go.',
        relatedTerms: ['Sacred Summary', 'Accommodations'],
    },

    'Vocal Ledger': {
        term: 'Vocal Ledger',
        definition: 'Voice-captured observations that the Oracle can transform into professional documentation.',
        category: 'practical',
        dignityFraming: 'Speak your witnessing. The Oracle will translate for institutional ears.',
        relatedTerms: ['IEP Bridge', 'Strength Narrative'],
    },
};

/**
 * Get a glossary entry by term (case-insensitive)
 */
export function getGlossaryEntry(term: string): GlossaryEntry | undefined {
    // Try exact match first
    if (GLOSSARY[term]) {
        return GLOSSARY[term];
    }

    // Try case-insensitive match
    const lowerTerm = term.toLowerCase();
    const key = Object.keys(GLOSSARY).find(k => k.toLowerCase() === lowerTerm);
    return key ? GLOSSARY[key] : undefined;
}

/**
 * Check if a term exists in the glossary
 */
export function hasGlossaryEntry(term: string): boolean {
    return getGlossaryEntry(term) !== undefined;
}

/**
 * Get all terms in a category
 */
export function getTermsByCategory(category: GlossaryEntry['category']): GlossaryEntry[] {
    return Object.values(GLOSSARY).filter(entry => entry.category === category);
}

/**
 * Get related terms for a given term
 */
export function getRelatedEntries(term: string): GlossaryEntry[] {
    const entry = getGlossaryEntry(term);
    if (!entry?.relatedTerms) return [];

    return entry.relatedTerms
        .map(t => getGlossaryEntry(t))
        .filter((e): e is GlossaryEntry => e !== undefined);
}

/**
 * All glossary terms as an array
 */
export const ALL_GLOSSARY_TERMS = Object.keys(GLOSSARY);

/**
 * Category display names
 */
export const CATEGORY_LABELS: Record<GlossaryEntry['category'], string> = {
    institutional: 'School & Legal',
    therapeutic: 'Clinical (Reframed)',
    philosophical: 'Sanctuary Framework',
    practical: 'Day-to-Day',
};
