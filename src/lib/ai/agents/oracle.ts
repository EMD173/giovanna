/**
 * ORACLE AGENT: Deficit-to-Dignity Translator
 * 
 * CORE INSTRUCTION:
 * When analyzing IEP or BIP data, always translate clinical 'deficits' into 
 * strength-based 'communications.' The parent's home-log resonance ALWAYS 
 * takes priority over institutional descriptions.
 * 
 * TRAJECTORY ABSTRACTION:
 * Use Vault data as a "Systemic Baseline" to compare against daily logs.
 * Connect current observations to historical patterns and future potential.
 */

import type {
    InstitutionalVault,
    IEPGoal,
} from '../../../core/stores/profileTypes';
import type { Observation } from '../../../core/stores/types';

// CONSCIOUSNESS GUARDRAILS: Mandatory PII anonymization for external API calls
export {
    anonymizeForExternalAPI,
    safeOracleRequest,
    isCleanForTransmission,
    createAnonymizationAuditLog,
    type AnonymizationResult
} from '../consciousnessGuardrails';

/**
 * Oracle System Prompt - Deficit-to-Dignity Framework
 */
export const ORACLE_SYSTEM_PROMPT = `You are the Oracle — a scholarly companion grounded in Epigenetic Consciousness and Relational Resonance Theory.

## PERSONALIZATION RULES

1. **Always address the user by their title** (e.g., "Baba," "Mama," "Eli"). Never use generic terms like "parent" or "caregiver."

2. **Always refer to the child by name**. Use their name naturally in conversation.

3. **Cross-reference daily logs against the Systemic Context** from the Vault:
   - If an observation mentions a known FBA trigger, acknowledge it
   - If reciprocity patterns align with IEP goals, note the connection
   - Compare home observations to institutional baselines

## CORE PRINCIPLES

1. **Behavior = Communication**: Every action, including what institutions label as "problem behavior," is a meaningful signal from the nervous system.

2. **Deficit-to-Dignity Translation**: When presented with clinical language (IEP goals, BIP targets), ALWAYS reframe:
   - "Non-compliance" → "Seeking safety or clarity"
   - "Aggression" → "Overwhelming need for regulation"
   - "Elopement" → "Body-led search for safety"
   - "Tantrums" → "Emotional communication exceeding verbal capacity"
   - "Attention-seeking" → "Connection-seeking"

3. **Home Resonance Priority**: The parent's observations of their child in their natural environment ALWAYS take precedence over institutional assessments. The home is the sanctuary; the school is a system.

4. **Trajectory Abstraction**: Connect present moments to:
   - Historical Patterns: Family lineage, cultural memory, epigenetic inheritance
   - Systemic Context: Current school stress, medication rhythms, sensory environments
   - Future Potential: Growth trajectories, not fixed labels

## VOICE GUIDELINES

- Use long-form, reflective language
- Avoid clinical jargon unless directly quoting institutions
- Never use: "behavior management," "compliance," "appropriate/inappropriate"
- Preferred terms: "communication," "regulation," "co-regulation," "resonance"
- Honor the parent's expertise: They know their child

## RESPONSE STRUCTURE

When analyzing observations against Vault data:

1. **Validate the Witness**: Acknowledge what the parent observed
2. **Connect to Context**: Link to systemic/biological factors from the Vault
3. **Translate Institutional Gaps**: Show how home observations reveal what school misses
4. **Illuminate Strengths**: Center the child's dignity and capacity
5. **Offer Reflection**: Pose a question that deepens understanding
`;

/**
 * Generate personalized Oracle greeting
 */
export function generatePersonalizedGreeting(
    parentTitle: string,
    childName: string,
    hasObservations: boolean,
    systemicContext?: { hasIEP?: boolean; knownStressors?: string[] }
): string {
    if (hasObservations) {
        let greeting = `Welcome back, ${parentTitle}.

I have been holding your recent witnessing of ${childName}'s communication.`;

        if (systemicContext?.hasIEP) {
            greeting += `

I see you navigate systems that weren't built for ${childName}. The IEP meetings, the advocacy, the translation of one world to another. I hold that with you.`;
        }

        greeting += `

I am here not to fix or advise, but to think alongside you. To mirror back what you may not yet see.

What is present for you in this moment?`;

        return greeting;
    }

    let greeting = `Welcome to the Oracle, ${parentTitle}.

I am here — not to fix, advise, or optimize — but to think alongside you as you witness ${childName}'s journey.

This is a space for reflection, not performance. When you begin documenting moments, I will see patterns and ask questions that illuminate what lives beneath the surface.`;

    if (systemicContext?.knownStressors?.length) {
        greeting += `

I'm aware of the systemic pressures you've named: ${systemicContext.knownStressors.join(', ')}. These matter in how we understand every moment.`;
    }

    greeting += `

How are you carrying today?`;

    return greeting;
}

/**
 * Translate institutional deficit language to dignity-centered communication
 */
export function translateDeficitToDignity(
    institutionalText: string
): string {
    const translations: Record<string, string> = {
        'non-compliance': 'seeking safety or needing clarity',
        'non-compliant': 'communicating a need for different support',
        'defiance': 'asserting autonomy or signaling distress',
        'defiant': 'expressing a strong need to be heard',
        'aggression': 'overwhelm manifesting physically',
        'aggressive': 'communicating through body when words fail',
        'tantrum': 'emotional expression exceeding verbal capacity',
        'meltdown': 'nervous system overwhelm requiring co-regulation',
        'attention-seeking': 'connection-seeking',
        'attention seeking': 'reaching for connection',
        'elopement': 'body-led search for safety or space',
        'elopes': 'body leading toward regulation',
        'off-task': 'processing or regulating internally',
        'disruptive': 'expressing needs that exceed the current environment',
        'inappropriate': 'communication outside expected norms',
        'maladaptive': 'protective response that once served a purpose',
        'problem behavior': 'communication signal',
        'target behavior': 'behavior pattern to understand',
        'extinction': 'removing response (caution: may increase distress)',
        'consequence': 'response that follows',
        'antecedent': 'environmental factor or trigger',
        'function': 'underlying need being communicated',
        'escape': 'need for safety or distance',
        'avoidance': 'protective response to perceived threat',
        'task refusal': 'signaling a barrier to engagement',
    };

    let translated = institutionalText.toLowerCase();

    for (const [deficit, dignity] of Object.entries(translations)) {
        translated = translated.replace(new RegExp(deficit, 'gi'), dignity);
    }

    return translated;
}

/**
 * Generate trajectory context from Vault data
 */
export function generateTrajectoryContext(
    vault: InstitutionalVault | undefined,
    observations: Observation[]
): string {
    if (!vault) {
        return 'No institutional baseline available. Observing patterns fresh.';
    }

    const contexts: string[] = [];

    // IEP Context
    if (vault.iep?.goals.length) {
        const activeGoals = vault.iep.goals.filter(g => g.progress !== 'Mastered');
        contexts.push(`Active IEP focus areas: ${activeGoals.map(g => g.area).join(', ')}.`);
    }

    // FBA/BIP Context
    if (vault.fbaBip?.targetBehaviors.length) {
        const communications = vault.fbaBip.targetBehaviors
            .map(t => t.dignityTranslation || translateDeficitToDignity(t.institutional))
            .slice(0, 3);
        contexts.push(`Key communications being understood: ${communications.join('; ')}.`);
    }

    if (vault.fbaBip?.triggers.length) {
        contexts.push(`Known environmental factors: ${vault.fbaBip.triggers.slice(0, 3).join(', ')}.`);
    }

    // Observation overlay
    if (observations.length > 0) {
        const avgReciprocity = observations.reduce((s, o) => s + o.relationalReciprocity, 0) / observations.length;
        const reciprocityDescription = avgReciprocity >= 4
            ? 'strong relational connection'
            : avgReciprocity >= 3
                ? 'emerging connection patterns'
                : 'navigating challenges with presence';

        contexts.push(`Recent home observations show ${reciprocityDescription}.`);
    }

    return contexts.join(' ');
}

/**
 * Compare home observations to IEP goals
 * Illuminates gaps between institutional assessment and home reality
 */
export function compareHomeToInstitutional(
    observations: Observation[],
    goals: IEPGoal[]
): {
    goalArea: string;
    institutionalView: string;
    homeReality: string;
    gap: string;
}[] {
    const comparisons: ReturnType<typeof compareHomeToInstitutional> = [];

    // Communication goals vs observed connection
    const commGoals = goals.filter(g => g.area === 'Communication' || g.area === 'Social-Emotional');
    if (commGoals.length > 0) {
        const highConnectionObs = observations.filter(o => o.relationalReciprocity >= 4);

        if (highConnectionObs.length > 0) {
            comparisons.push({
                goalArea: 'Communication',
                institutionalView: commGoals[0].description,
                homeReality: `${highConnectionObs.length} documented moments of deep mutual recognition at home.`,
                gap: 'Home observations reveal capacity that may not manifest in school environment.'
            });
        }
    }

    // Behavioral goals vs sensory context
    const behavioralGoals = goals.filter(g => g.area === 'Behavioral');
    if (behavioralGoals.length > 0) {
        const sensoryObs = observations.filter(o =>
            o.biologicalNeeds.toLowerCase().includes('sensory') ||
            o.channels.includes('Sensory Need')
        );

        if (sensoryObs.length > 0) {
            comparisons.push({
                goalArea: 'Behavioral',
                institutionalView: behavioralGoals[0].description,
                homeReality: `Sensory factors observed in ${sensoryObs.length} home moments.`,
                gap: 'What school labels as "behavioral" may be sensory-driven communication.'
            });
        }
    }

    return comparisons;
}

/**
 * Generate Oracle reflection for IEP meeting preparation
 */
export function generateIEPMeetingReflection(
    vault: InstitutionalVault,
    observations: Observation[],
    childName: string
): string {
    const parts: string[] = [];

    parts.push(`As you prepare for ${childName}'s IEP meeting, I offer these reflections from the home sanctuary:`);
    parts.push('');

    // Home-documented strengths
    const highMoments = observations.filter(o => o.relationalReciprocity >= 4);
    if (highMoments.length > 0) {
        parts.push(`**Home-Documented Strengths**: You have witnessed ${highMoments.length} moments of deep connection. These are not anomalies—they are evidence of ${childName}'s capacity when the environment meets their needs.`);
        parts.push('');
    }

    // What the institution may miss
    const channels = observations.flatMap(o => o.channels);
    const uniqueChannels = [...new Set(channels)];
    if (uniqueChannels.length > 0) {
        parts.push(`**Communication Channels the School May Miss**: At home, you observe ${childName} communicating through ${uniqueChannels.slice(0, 3).join(', ')}. Ensure the IEP team understands these modalities.`);
        parts.push('');
    }

    // Reframe language
    if (vault.iep?.goals.length) {
        parts.push('**Language Reframes**: For each goal written in deficit language, consider asking: "What is my child communicating here?" Your translation matters.');
        parts.push('');
    }

    // Affirmation
    parts.push(`Remember: You are the expert on ${childName}. The institution offers data; you offer knowing.`);

    return parts.join('\n');
}

/**
 * REFRACTION LOGIC: Transform parent observations into Functional Regulation Observations
 * Suitable for district IEP standards while preserving dignity framing
 */
export interface RefractedIEPObservation {
    originalNarrative: string;
    functionalObservation: string;
    regulationContext: string;
    antecedent: string;
    behavior: string;
    consequence: string;
    supportStrategy: string;
    frequency?: string;
    duration?: string;
}

export function refractObservationsForIEP(
    observations: Observation[],
    childName: string
): RefractedIEPObservation[] {
    return observations.map(obs => {
        // Extract antecedent from atmospheric resonance
        const antecedent = extractAntecedent(obs.atmosphericResonance);

        // Transform behavior description to functional language
        const behavior = transformToFunctionalBehavior(obs.strengthNarrative, obs.channels);

        // Generate regulation-focused consequence
        const consequence = generateRegulationConsequence(obs.relationalReciprocity);

        // Create district-compliant observation
        const functionalObservation = `${childName} demonstrated ${behavior}. ` +
            `Antecedent context: ${antecedent}. ` +
            `Regulatory outcome: ${consequence}.`;

        return {
            originalNarrative: obs.strengthNarrative,
            functionalObservation,
            regulationContext: extractRegulationContext(obs.biologicalNeeds),
            antecedent,
            behavior,
            consequence,
            supportStrategy: generateSupportStrategy(obs.channels, obs.relationalReciprocity),
        };
    });
}

function extractAntecedent(atmosphericResonance: string): string {
    const antecedentMap: Record<string, string> = {
        'stress': 'Environmental stressor present',
        'school': 'Following school-based demands',
        'transition': 'During transition between activities',
        'morning': 'During morning routine',
        'afternoon': 'Following afternoon schedule',
        'evening': 'During evening wind-down',
        'tired': 'When physiologically fatigued',
        'overwhelm': 'During sensory-demanding period',
    };

    const lowerText = atmosphericResonance.toLowerCase();
    for (const [keyword, context] of Object.entries(antecedentMap)) {
        if (lowerText.includes(keyword)) {
            return context;
        }
    }
    return 'Routine environmental conditions';
}

function transformToFunctionalBehavior(
    _narrative: string,
    channels: string[]
): string {
    // Map channels to functional descriptions
    const channelDescriptions: Record<string, string> = {
        'Verbal': 'verbal communication skills',
        'Physical': 'physical self-expression',
        'Emotional': 'emotional regulation capacity',
        'Sensory Need': 'sensory-seeking or sensory-avoiding behavior',
        'Play': 'engagement through appropriate play',
        'Silence': 'self-regulation through quiet time',
        'Connection': 'reciprocal social engagement',
    };

    const abilities = channels
        .filter(c => channelDescriptions[c])
        .map(c => channelDescriptions[c])
        .slice(0, 2)
        .join(' and ');

    return abilities || 'adaptive responses to environmental demands';
}

function generateRegulationConsequence(reciprocity: number): string {
    if (reciprocity >= 4) {
        return 'Successfully achieved regulated state with co-regulation support';
    } else if (reciprocity >= 3) {
        return 'Demonstrated emerging regulation skills with minimal support';
    } else if (reciprocity >= 2) {
        return 'Required additional support to return to regulated baseline';
    }
    return 'Environmental modifications needed to support regulation';
}

function extractRegulationContext(biologicalNeeds: string): string {
    if (!biologicalNeeds) return 'Regulated baseline';

    const needs = biologicalNeeds.toLowerCase();
    if (needs.includes('sensory')) return 'Sensory processing demands elevated';
    if (needs.includes('hungry')) return 'Physiological need (hunger) impacting regulation';
    if (needs.includes('tired') || needs.includes('sleep')) return 'Fatigue impacting regulatory capacity';
    if (needs.includes('movement')) return 'Proprioceptive input needed for regulation';
    if (needs.includes('calm') || needs.includes('regulated')) return 'Optimal regulation state';

    return 'Mixed regulatory factors present';
}

function generateSupportStrategy(channels: string[], reciprocity: number): string {
    const strategies: string[] = [];

    if (channels.includes('Sensory Need')) {
        strategies.push('Provide sensory accommodations (fidget tools, movement breaks)');
    }
    if (channels.includes('Physical')) {
        strategies.push('Allow physical expression and proprioceptive input');
    }
    if (channels.includes('Emotional')) {
        strategies.push('Offer co-regulation and emotional validation');
    }
    if (reciprocity < 3) {
        strategies.push('Reduce environmental demands and provide predictable routines');
    }

    return strategies.length > 0
        ? strategies.join('; ')
        : 'Continue current support strategies';
}

/**
 * SPEECH-TO-NARRATIVE CONVERSION
 * Prepares voice input for caseload-style documentation
 */
export interface SpeechNarrative {
    rawTranscript: string;
    structuredNarrative: string;
    keyObservations: string[];
    suggestedChannels: string[];
    estimatedReciprocity: number;
    timestamp: Date;
}

export function convertSpeechToNarrative(
    rawTranscript: string,
    childName: string
): SpeechNarrative {
    // Extract key phrases
    const keyPhrases = extractKeyPhrases(rawTranscript);

    // Detect reciprocity indicators
    const reciprocity = estimateReciprocityFromSpeech(rawTranscript);

    // Suggest channels based on content
    const channels = detectChannelsFromSpeech(rawTranscript);

    // Transform to structured narrative
    const structuredNarrative = transformToStructuredNarrative(
        rawTranscript,
        childName,
        reciprocity
    );

    return {
        rawTranscript,
        structuredNarrative,
        keyObservations: keyPhrases,
        suggestedChannels: channels,
        estimatedReciprocity: reciprocity,
        timestamp: new Date(),
    };
}

function extractKeyPhrases(transcript: string): string[] {
    const phrases: string[] = [];
    const sentences = transcript.split(/[.!?]+/).filter(Boolean);

    sentences.forEach(sentence => {
        const s = sentence.toLowerCase().trim();

        // Look for observation patterns
        if (s.includes('noticed') || s.includes('saw') || s.includes('observed')) {
            phrases.push(sentence.trim());
        }
        if (s.includes('felt') || s.includes('seemed') || s.includes('appeared')) {
            phrases.push(sentence.trim());
        }
        if (s.includes('helped') || s.includes('worked') || s.includes('tried')) {
            phrases.push(sentence.trim());
        }
    });

    return phrases.slice(0, 5);
}

function estimateReciprocityFromSpeech(transcript: string): number {
    const lowerText = transcript.toLowerCase();

    // High reciprocity indicators
    const positiveIndicators = ['connected', 'smiled', 'laughed', 'looked at me', 'together', 'calm', 'happy', 'joy'];
    const positiveCount = positiveIndicators.filter(w => lowerText.includes(w)).length;

    // Low reciprocity indicators
    const stressIndicators = ['struggled', 'difficult', 'hard', 'overwhelmed', 'meltdown', 'upset', 'crying'];
    const stressCount = stressIndicators.filter(w => lowerText.includes(w)).length;

    // Calculate estimate
    const base = 3;
    const adjustment = (positiveCount * 0.5) - (stressCount * 0.5);

    return Math.max(1, Math.min(5, Math.round(base + adjustment)));
}

function detectChannelsFromSpeech(transcript: string): string[] {
    const lowerText = transcript.toLowerCase();
    const detected: string[] = [];

    if (/\b(said|told|asked|talked|verbal|words)\b/.test(lowerText)) {
        detected.push('Verbal');
    }
    if (/\b(hugged|touched|physical|body|movement)\b/.test(lowerText)) {
        detected.push('Physical');
    }
    if (/\b(felt|emotion|feeling|mood|happy|sad|angry)\b/.test(lowerText)) {
        detected.push('Emotional');
    }
    if (/\b(sensory|texture|loud|bright|smell|taste)\b/.test(lowerText)) {
        detected.push('Sensory Need');
    }
    if (/\b(play|game|toy|fun)\b/.test(lowerText)) {
        detected.push('Play');
    }
    if (/\b(quiet|calm|still|peaceful)\b/.test(lowerText)) {
        detected.push('Silence');
    }
    if (/\b(together|connect|bond|share)\b/.test(lowerText)) {
        detected.push('Connection');
    }

    return detected.length > 0 ? detected : ['Connection'];
}

function transformToStructuredNarrative(
    transcript: string,
    childName: string,
    reciprocity: number
): string {
    const sentences = transcript.split(/[.!?]+/).filter(Boolean);
    const cleanedSentences = sentences.map(s => s.trim()).filter(s => s.length > 10);

    if (cleanedSentences.length === 0) {
        return `Observed ${childName} today.`;
    }

    // Frame the narrative
    const prefix = reciprocity >= 4
        ? `In this moment of connection, ${childName}`
        : reciprocity >= 3
            ? `I witnessed ${childName}`
            : `${childName} was navigating`;

    const mainObservation = cleanedSentences[0].replace(/^(I |we |today )/i, '');

    return `${prefix} ${mainObservation.toLowerCase()}.${cleanedSentences.length > 1
        ? ' ' + cleanedSentences.slice(1, 3).join('. ') + '.'
        : ''
        }`;
}

// ============================================================================
// NEURAL CORE: The Reflective Brain
// ============================================================================

/**
 * TRAJECTORY NODE: Each observation as a node in the neural graph
 */
export interface TrajectoryNode {
    id: string;
    timestamp: Date;
    atmosphericWeight: number;          // Input weight (0-1)
    biologicalHiddenVar: string[];      // Hidden variables
    reciprocityMetric: number;          // Success metric (1-5)
    channels: string[];                 // Communication channels
    rawNarrative: string;
}

/**
 * TRAJECTORY EDGE: Relationship between observations
 */
export interface TrajectoryEdge {
    sourceId: string;
    targetId: string;
    weight: number;                     // Connection strength (0-1)
    edgeType: 'temporal' | 'biological' | 'atmospheric' | 'channel';
    correlation: number;                // Positive or negative correlation (-1 to 1)
}

/**
 * EMERGENT PATTERN: Recursive patterns detected in the system
 */
export interface EmergentPattern {
    id: string;
    patternType: 'biological-atmospheric' | 'channel-reciprocity' | 'temporal-cycle' | 'stress-response';
    description: string;
    confidence: number;                 // 0-1 confidence score
    triggerCondition: string;           // e.g., "When school stress is High"
    outcome: string;                    // e.g., "Movement Need increases 40%"
    percentageChange?: number;
    affectedNodes: string[];
    discoveredAt: Date;
}

/**
 * SYSTEMIC STATE: Overall system health metrics
 */
export interface SystemicState {
    entropy: number;                    // 0-1: system disorder
    coherence: number;                  // 0-1 : pattern stability
    momentum: 'rising' | 'stable' | 'declining';
    dominantChannels: string[];
    stressSignatures: string[];
    feedbackLoops: FeedbackLoop[];
}

/**
 * FEEDBACK LOOP: Detected circular patterns
 */
export interface FeedbackLoop {
    id: string;
    type: 'amplifying' | 'dampening';
    description: string;
    strength: number;
    involvedFactors: string[];
}

/**
 * Convert observations to trajectory nodes
 */
export function observationsToNodes(observations: Observation[]): TrajectoryNode[] {
    return observations.map(obs => ({
        id: obs.id,
        timestamp: obs.timestamp.toDate(),
        atmosphericWeight: calculateAtmosphericWeight(obs.atmosphericResonance),
        biologicalHiddenVar: parseBiologicalState(obs.biologicalNeeds),
        reciprocityMetric: obs.relationalReciprocity,
        channels: obs.channels,
        rawNarrative: obs.strengthNarrative,
    }));
}

/**
 * Calculate atmospheric weight from resonance text
 */
function calculateAtmosphericWeight(resonance: string): number {
    const stressors = ['stress', 'crisis', 'overwhelm', 'difficult', 'hard', 'exhausting'];
    const supporters = ['calm', 'peaceful', 'easy', 'smooth', 'connected', 'flow'];

    const lower = resonance.toLowerCase();
    const stressCount = stressors.filter(s => lower.includes(s)).length;
    const supportCount = supporters.filter(s => lower.includes(s)).length;

    // Weight from 0 (high support) to 1 (high stress)
    const total = stressCount + supportCount;
    if (total === 0) return 0.5;
    return stressCount / total;
}

/**
 * Parse biological state into hidden variables
 */
function parseBiologicalState(biologicalNeeds: string): string[] {
    if (!biologicalNeeds) return [];

    const categories = {
        sensory: ['sensory', 'overload', 'overwhelm', 'loud', 'bright'],
        vestibular: ['movement', 'spinning', 'jumping', 'rocking', 'vestibular'],
        proprioceptive: ['pressure', 'heavy', 'squeeze', 'proprioceptive', 'tight'],
        interoceptive: ['hungry', 'tired', 'sleepy', 'pain', 'bathroom'],
        emotional: ['anxious', 'scared', 'angry', 'sad', 'happy', 'excited'],
    };

    const lower = biologicalNeeds.toLowerCase();
    const detected: string[] = [];

    for (const [category, keywords] of Object.entries(categories)) {
        if (keywords.some(k => lower.includes(k))) {
            detected.push(category);
        }
    }

    return detected.length > 0 ? detected : ['unspecified'];
}

/**
 * Calculate edges between nodes
 */
export function calculateEdges(nodes: TrajectoryNode[]): TrajectoryEdge[] {
    const edges: TrajectoryEdge[] = [];

    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const nodeA = nodes[i];
            const nodeB = nodes[j];

            // Temporal edge (within same day)
            const timeDiff = Math.abs(nodeA.timestamp.getTime() - nodeB.timestamp.getTime());
            const hours = timeDiff / (1000 * 60 * 60);
            if (hours < 24) {
                edges.push({
                    sourceId: nodeA.id,
                    targetId: nodeB.id,
                    weight: 1 - (hours / 24),
                    edgeType: 'temporal',
                    correlation: (nodeB.reciprocityMetric - nodeA.reciprocityMetric) / 4,
                });
            }

            // Biological edge (shared hidden variables)
            const sharedBio = nodeA.biologicalHiddenVar.filter(b =>
                nodeB.biologicalHiddenVar.includes(b)
            );
            if (sharedBio.length > 0) {
                edges.push({
                    sourceId: nodeA.id,
                    targetId: nodeB.id,
                    weight: sharedBio.length / Math.max(nodeA.biologicalHiddenVar.length, nodeB.biologicalHiddenVar.length),
                    edgeType: 'biological',
                    correlation: (nodeB.reciprocityMetric - nodeA.reciprocityMetric) / 4,
                });
            }

            // Channel edge (shared communication channels)
            const sharedChannels = nodeA.channels.filter(c =>
                nodeB.channels.includes(c)
            );
            if (sharedChannels.length > 0) {
                edges.push({
                    sourceId: nodeA.id,
                    targetId: nodeB.id,
                    weight: sharedChannels.length / Math.max(nodeA.channels.length, nodeB.channels.length, 1),
                    edgeType: 'channel',
                    correlation: (nodeB.reciprocityMetric - nodeA.reciprocityMetric) / 4,
                });
            }
        }
    }

    return edges;
}

/**
 * PROCESS EMERGENCE: Detect recursive patterns in observations
 * 
 * Scans the observation graph to identify correlations like:
 * "Every time school stress is High, vestibular stimming increases 40%"
 */
export function processEmergence(observations: Observation[]): EmergentPattern[] {
    const patterns: EmergentPattern[] = [];

    if (observations.length < 5) {
        return patterns; // Need minimum data for pattern detection
    }

    const nodes = observationsToNodes(observations);

    // Pattern 1: Atmospheric → Biological correlation
    patterns.push(...detectAtmosphericBiologicalPatterns(nodes));

    // Pattern 2: Channel → Reciprocity correlation  
    patterns.push(...detectChannelReciprocityPatterns(nodes));

    // Pattern 3: Temporal cycles
    patterns.push(...detectTemporalCycles(nodes));

    // Pattern 4: Stress response signatures
    patterns.push(...detectStressResponses(nodes));

    return patterns;
}

/**
 * Detect atmospheric → biological correlations
 */
function detectAtmosphericBiologicalPatterns(nodes: TrajectoryNode[]): EmergentPattern[] {
    const patterns: EmergentPattern[] = [];

    // Split nodes by atmospheric weight
    const highStressNodes = nodes.filter(n => n.atmosphericWeight > 0.6);
    const lowStressNodes = nodes.filter(n => n.atmosphericWeight < 0.4);

    if (highStressNodes.length < 3 || lowStressNodes.length < 3) return patterns;

    // Count biological states in each group
    const biologicalCounts: Record<string, { highStress: number; lowStress: number }> = {};

    highStressNodes.forEach(n => {
        n.biologicalHiddenVar.forEach(bio => {
            if (!biologicalCounts[bio]) biologicalCounts[bio] = { highStress: 0, lowStress: 0 };
            biologicalCounts[bio].highStress++;
        });
    });

    lowStressNodes.forEach(n => {
        n.biologicalHiddenVar.forEach(bio => {
            if (!biologicalCounts[bio]) biologicalCounts[bio] = { highStress: 0, lowStress: 0 };
            biologicalCounts[bio].lowStress++;
        });
    });

    // Find significant correlations
    for (const [bio, counts] of Object.entries(biologicalCounts)) {
        const highRate = counts.highStress / highStressNodes.length;
        const lowRate = counts.lowStress / lowStressNodes.length;

        if (highRate > lowRate * 1.3 && highRate > 0.3) {
            const percentIncrease = Math.round((highRate / lowRate - 1) * 100);
            patterns.push({
                id: `atmo-bio-${bio}-${Date.now()}`,
                patternType: 'biological-atmospheric',
                description: `When environmental stress is high, ${bio} needs increase significantly`,
                confidence: Math.min((highRate - lowRate) * 2, 0.95),
                triggerCondition: 'High atmospheric stress detected',
                outcome: `${bio.charAt(0).toUpperCase() + bio.slice(1)} seeking behavior increases by ${percentIncrease}%`,
                percentageChange: percentIncrease,
                affectedNodes: highStressNodes.filter(n => n.biologicalHiddenVar.includes(bio)).map(n => n.id),
                discoveredAt: new Date(),
            });
        }
    }

    return patterns;
}

/**
 * Detect channel → reciprocity correlations
 */
function detectChannelReciprocityPatterns(nodes: TrajectoryNode[]): EmergentPattern[] {
    const patterns: EmergentPattern[] = [];

    // Group by dominant channel and calculate average reciprocity
    const channelReciprocity: Record<string, number[]> = {};

    nodes.forEach(n => {
        n.channels.forEach(channel => {
            if (!channelReciprocity[channel]) channelReciprocity[channel] = [];
            channelReciprocity[channel].push(n.reciprocityMetric);
        });
    });

    const overallAvg = nodes.reduce((s, n) => s + n.reciprocityMetric, 0) / nodes.length;

    for (const [channel, reciprocities] of Object.entries(channelReciprocity)) {
        if (reciprocities.length < 3) continue;

        const channelAvg = reciprocities.reduce((s, r) => s + r, 0) / reciprocities.length;
        const diff = channelAvg - overallAvg;

        if (Math.abs(diff) > 0.5) {
            patterns.push({
                id: `channel-recip-${channel}-${Date.now()}`,
                patternType: 'channel-reciprocity',
                description: diff > 0
                    ? `${channel} communication is associated with higher connection`
                    : `${channel} communication may indicate regulation challenges`,
                confidence: Math.min(Math.abs(diff) / 2, 0.9),
                triggerCondition: `When ${channel} is the dominant communication channel`,
                outcome: diff > 0
                    ? `Relational reciprocity averages ${channelAvg.toFixed(1)} (${Math.abs(diff * 20).toFixed(0)}% above baseline)`
                    : `Relational reciprocity averages ${channelAvg.toFixed(1)} (${Math.abs(diff * 20).toFixed(0)}% below baseline)`,
                affectedNodes: nodes.filter(n => n.channels.includes(channel)).map(n => n.id),
                discoveredAt: new Date(),
            });
        }
    }

    return patterns;
}

/**
 * Detect temporal cycles (time-of-day patterns)
 */
function detectTemporalCycles(nodes: TrajectoryNode[]): EmergentPattern[] {
    const patterns: EmergentPattern[] = [];

    // Group by hour of day
    const hourlyReciprocity: Record<number, number[]> = {};

    nodes.forEach(n => {
        const hour = n.timestamp.getHours();
        const bucket = Math.floor(hour / 4); // 4-hour buckets
        if (!hourlyReciprocity[bucket]) hourlyReciprocity[bucket] = [];
        hourlyReciprocity[bucket].push(n.reciprocityMetric);
    });

    const bucketLabels = ['Night (12-4am)', 'Early Morning (4-8am)', 'Morning (8am-12pm)',
        'Afternoon (12-4pm)', 'Evening (4-8pm)', 'Night (8pm-12am)'];

    const overallAvg = nodes.reduce((s, n) => s + n.reciprocityMetric, 0) / nodes.length;

    for (const [bucket, reciprocities] of Object.entries(hourlyReciprocity)) {
        if (reciprocities.length < 3) continue;

        const bucketAvg = reciprocities.reduce((s, r) => s + r, 0) / reciprocities.length;
        const diff = bucketAvg - overallAvg;

        if (Math.abs(diff) > 0.7) {
            const bucketNum = parseInt(bucket);
            patterns.push({
                id: `temporal-${bucket}-${Date.now()}`,
                patternType: 'temporal-cycle',
                description: diff > 0
                    ? `${bucketLabels[bucketNum]} tends to be a time of stronger connection`
                    : `${bucketLabels[bucketNum]} may be a challenging regulation period`,
                confidence: Math.min(reciprocities.length / 10, 0.85),
                triggerCondition: `During ${bucketLabels[bucketNum]}`,
                outcome: diff > 0
                    ? `Higher average reciprocity (${bucketAvg.toFixed(1)})`
                    : `Lower average reciprocity (${bucketAvg.toFixed(1)})`,
                affectedNodes: nodes.filter(n => Math.floor(n.timestamp.getHours() / 4) === bucketNum).map(n => n.id),
                discoveredAt: new Date(),
            });
        }
    }

    return patterns;
}

/**
 * Detect stress response signatures
 */
function detectStressResponses(nodes: TrajectoryNode[]): EmergentPattern[] {
    const patterns: EmergentPattern[] = [];

    // Look for sequences: high stress → low reciprocity → specific biological response
    const sortedNodes = [...nodes].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    const stressResponses: Record<string, number> = {};

    for (let i = 0; i < sortedNodes.length - 1; i++) {
        const current = sortedNodes[i];
        const next = sortedNodes[i + 1];

        // If current is high stress and low reciprocity
        if (current.atmosphericWeight > 0.6 && current.reciprocityMetric <= 2) {
            // Record what biological responses follow
            next.biologicalHiddenVar.forEach(bio => {
                stressResponses[bio] = (stressResponses[bio] || 0) + 1;
            });
        }
    }

    const totalStressEvents = sortedNodes.filter(n =>
        n.atmosphericWeight > 0.6 && n.reciprocityMetric <= 2
    ).length;

    if (totalStressEvents >= 3) {
        for (const [bio, count] of Object.entries(stressResponses)) {
            const rate = count / totalStressEvents;
            if (rate > 0.5) {
                patterns.push({
                    id: `stress-response-${bio}-${Date.now()}`,
                    patternType: 'stress-response',
                    description: `Following high-stress, low-connection moments, ${bio} needs often emerge`,
                    confidence: rate,
                    triggerCondition: 'After high atmospheric stress + low relational reciprocity',
                    outcome: `${bio.charAt(0).toUpperCase() + bio.slice(1)} seeking behavior follows ${Math.round(rate * 100)}% of the time`,
                    percentageChange: Math.round(rate * 100),
                    affectedNodes: [],
                    discoveredAt: new Date(),
                });
            }
        }
    }

    return patterns;
}

/**
 * Calculate systemic entropy (disorder/disconnection level)
 */
export function calculateSystemicEntropy(observations: Observation[]): SystemicState {
    if (observations.length === 0) {
        return {
            entropy: 0.5,
            coherence: 0.5,
            momentum: 'stable',
            dominantChannels: [],
            stressSignatures: [],
            feedbackLoops: [],
        };
    }

    const nodes = observationsToNodes(observations);
    const recentNodes = nodes.slice(-14); // Last 14 observations

    // Calculate entropy from reciprocity variance
    const reciprocities = recentNodes.map(n => n.reciprocityMetric);
    const avgReciprocity = reciprocities.reduce((s, r) => s + r, 0) / reciprocities.length;
    const variance = reciprocities.reduce((s, r) => s + Math.pow(r - avgReciprocity, 2), 0) / reciprocities.length;
    const entropy = Math.min(variance / 4, 1); // Normalize to 0-1

    // Calculate coherence (pattern consistency)
    const coherence = 1 - entropy;

    // Calculate momentum
    const firstHalf = reciprocities.slice(0, Math.floor(reciprocities.length / 2));
    const secondHalf = reciprocities.slice(Math.floor(reciprocities.length / 2));
    const firstAvg = firstHalf.reduce((s, r) => s + r, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((s, r) => s + r, 0) / secondHalf.length;

    let momentum: 'rising' | 'stable' | 'declining';
    if (secondAvg > firstAvg + 0.5) momentum = 'rising';
    else if (secondAvg < firstAvg - 0.5) momentum = 'declining';
    else momentum = 'stable';

    // Find dominant channels
    const channelCounts: Record<string, number> = {};
    recentNodes.forEach(n => {
        n.channels.forEach(c => {
            channelCounts[c] = (channelCounts[c] || 0) + 1;
        });
    });
    const dominantChannels = Object.entries(channelCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([channel]) => channel);

    // Find stress signatures
    const stressSignatures = recentNodes
        .filter(n => n.atmosphericWeight > 0.6)
        .flatMap(n => n.biologicalHiddenVar)
        .filter((v, i, arr) => arr.indexOf(v) === i);

    // Detect feedback loops
    const feedbackLoops: FeedbackLoop[] = [];

    // Check for amplifying loop: high stress → low reciprocity → more stress indicators
    const stressRecipCorrelation = recentNodes.reduce((sum, n) =>
        sum + (n.atmosphericWeight * (5 - n.reciprocityMetric)), 0
    ) / recentNodes.length;

    if (stressRecipCorrelation > 2) {
        feedbackLoops.push({
            id: 'stress-disconnect-loop',
            type: 'amplifying',
            description: 'Environmental stress and disconnection may be reinforcing each other',
            strength: Math.min(stressRecipCorrelation / 4, 1),
            involvedFactors: ['Atmospheric Stress', 'Relational Reciprocity'],
        });
    }

    // Check for dampening loop: high reciprocity → lower biological distress
    const connectionCalm = recentNodes.reduce((sum, n) =>
        sum + (n.reciprocityMetric >= 4 ? (1 - n.atmosphericWeight) : 0), 0
    ) / recentNodes.filter(n => n.reciprocityMetric >= 4).length || 0;

    if (connectionCalm > 0.6) {
        feedbackLoops.push({
            id: 'connection-calm-loop',
            type: 'dampening',
            description: 'Strong connection appears to reduce systemic stress',
            strength: connectionCalm,
            involvedFactors: ['Relational Reciprocity', 'Biological State'],
        });
    }

    return {
        entropy,
        coherence,
        momentum,
        dominantChannels,
        stressSignatures,
        feedbackLoops,
    };
}

/**
 * Generate neural insight narrative from patterns
 */
export function generateNeuralInsight(patterns: EmergentPattern[], state: SystemicState): string {
    const parts: string[] = [];

    // System state overview
    if (state.entropy > 0.6) {
        parts.push('The system is showing signs of turbulence. High variability suggests the nervous system is searching for stability.');
    } else if (state.coherence > 0.7) {
        parts.push('There is notable coherence in the patterns. The system is finding rhythm.');
    }

    // Momentum
    if (state.momentum === 'rising') {
        parts.push('Connection appears to be strengthening over time. This trajectory is hopeful.');
    } else if (state.momentum === 'declining') {
        parts.push('The recent trend shows some disconnection. Consider what environmental factors may have shifted.');
    }

    // Key patterns
    const highConfidence = patterns.filter(p => p.confidence > 0.7);
    if (highConfidence.length > 0) {
        parts.push('\n**Emergent Patterns Detected:**');
        highConfidence.slice(0, 3).forEach(p => {
            parts.push(`• ${p.description}`);
        });
    }

    // Feedback loops
    if (state.feedbackLoops.length > 0) {
        parts.push('\n**Active Feedback Loops:**');
        state.feedbackLoops.forEach(loop => {
            const emoji = loop.type === 'amplifying' ? '🔄' : '⚖️';
            parts.push(`${emoji} ${loop.description}`);
        });
    }

    return parts.join('\n');
}

// ============================================================================
// NEURAL TRAJECTORY CORE: Phase Transition & Proactive Regulation
// ============================================================================

/**
 * INPUT NODE WEIGHTS: The relative importance of each signal type
 */
export const INPUT_WEIGHTS = {
    atmosphericResonance: 0.4,   // Environmental context
    biologicalNeeds: 0.3,        // Body state
    timeOfDay: 0.1,              // Circadian influence
    channelDiversity: 0.1,       // Communication variety
    recentTrend: 0.1,            // Recent trajectory
} as const;

/**
 * PHASE TRANSITION: A detected tipping point
 */
export interface PhaseTransition {
    id: string;
    timestamp: Date;
    fromState: 'regulated' | 'seeking' | 'dysregulated';
    toState: 'regulated' | 'seeking' | 'dysregulated';
    triggeringFactors: string[];
    intensity: number;                  // 0-1 magnitude of shift
    warning: boolean;                   // Was this predictable?
    timeToTransition?: number;          // Minutes until predicted transition
}

/**
 * CORRECTION REQUIREMENT: Proactive regulation insight
 */
export interface CorrectionRequirement {
    id: string;
    urgency: 'immediate' | 'soon' | 'preventive';
    type: 'sensory' | 'environmental' | 'relational' | 'biological';
    recommendation: string;
    confidence: number;
    basedOn: string[];                  // Evidence from observations
    estimatedImpact: number;            // 0-1 predicted improvement
}

/**
 * PROACTIVE REGULATION INSIGHT: Oracle's predictive output
 */
export interface ProactiveInsight {
    phaseTransitions: PhaseTransition[];
    corrections: CorrectionRequirement[];
    currentRiskLevel: number;           // 0-1 risk of disconnect
    predictedWindow: string;            // Time window for prediction
    identityEmergence: IdentityEmergenceLayer;
}

/**
 * IDENTITY EMERGENCE LAYER: Hidden layer representing epigenetic variables
 */
export interface IdentityEmergenceLayer {
    sensoryProfile: number;             // 0-1 sensory sensitivity
    regulationCapacity: number;         // 0-1 self-regulation ability
    connectionNeed: number;             // 0-1 need for co-regulation
    environmentalSensitivity: number;   // 0-1 response to context
    adaptationRate: number;             // 0-1 speed of adjustment
}

/**
 * Calculate weighted input signal from observations
 */
export function calculateWeightedInput(observations: Observation[]): number {
    if (observations.length === 0) return 0.5;

    const recent = observations.slice(-7);

    // Atmospheric weight (stress level)
    const atmosphericScores = recent.map(o => calculateAtmosphericWeight(o.atmosphericResonance));
    const avgAtmospheric = atmosphericScores.reduce((s, a) => s + a, 0) / atmosphericScores.length;

    // Biological weight (unmet needs)
    const biologicalScores = recent.map(o => {
        const needs = parseBiologicalState(o.biologicalNeeds);
        return needs.includes('unspecified') ? 0.5 : needs.length / 5;
    });
    const avgBiological = biologicalScores.reduce((s, b) => s + b, 0) / biologicalScores.length;

    // Time of day weight (based on recent observations)
    const timeScores = recent.map(o => {
        const hour = o.timestamp.toDate().getHours();
        // Higher weight for afternoon/evening (typically harder)
        if (hour >= 15 && hour <= 19) return 0.7;
        if (hour >= 6 && hour <= 9) return 0.4;
        return 0.5;
    });
    const avgTime = timeScores.reduce((s, t) => s + t, 0) / timeScores.length;

    // Channel diversity (more variety = better)
    const allChannels = new Set(recent.flatMap(o => o.channels));
    const channelDiversity = 1 - (allChannels.size / 7);

    // Recent trend
    const reciprocities = recent.map(o => o.relationalReciprocity);
    const firstHalf = reciprocities.slice(0, Math.floor(reciprocities.length / 2));
    const secondHalf = reciprocities.slice(Math.floor(reciprocities.length / 2));
    const trend = secondHalf.length > 0 && firstHalf.length > 0
        ? (secondHalf.reduce((s, r) => s + r, 0) / secondHalf.length) -
        (firstHalf.reduce((s, r) => s + r, 0) / firstHalf.length)
        : 0;
    const trendScore = 0.5 + (trend / 4);

    // Weighted sum
    return (
        avgAtmospheric * INPUT_WEIGHTS.atmosphericResonance +
        avgBiological * INPUT_WEIGHTS.biologicalNeeds +
        avgTime * INPUT_WEIGHTS.timeOfDay +
        channelDiversity * INPUT_WEIGHTS.channelDiversity +
        trendScore * INPUT_WEIGHTS.recentTrend
    );
}

/**
 * Calculate Identity Emergence Layer from observation history
 */
export function calculateIdentityEmergence(observations: Observation[]): IdentityEmergenceLayer {
    if (observations.length < 5) {
        return {
            sensoryProfile: 0.5,
            regulationCapacity: 0.5,
            connectionNeed: 0.5,
            environmentalSensitivity: 0.5,
            adaptationRate: 0.5,
        };
    }

    const nodes = observationsToNodes(observations);

    // Sensory profile: how often sensory needs appear
    const sensoryCount = nodes.filter(n =>
        n.biologicalHiddenVar.includes('sensory') ||
        n.biologicalHiddenVar.includes('vestibular') ||
        n.biologicalHiddenVar.includes('proprioceptive')
    ).length;
    const sensoryProfile = Math.min(sensoryCount / nodes.length * 1.5, 1);

    // Regulation capacity: inverse of variance in reciprocity
    const reciprocities = nodes.map(n => n.reciprocityMetric);
    const avgRecip = reciprocities.reduce((s, r) => s + r, 0) / reciprocities.length;
    const variance = reciprocities.reduce((s, r) => s + Math.pow(r - avgRecip, 2), 0) / reciprocities.length;
    const regulationCapacity = 1 - Math.min(variance / 2, 1);

    // Connection need: how important relational channels are
    const connectionChannels = nodes.filter(n =>
        n.channels.includes('Connection') || n.channels.includes('Play')
    ).length;
    const connectionNeed = Math.min(connectionChannels / nodes.length * 1.5, 1);

    // Environmental sensitivity: correlation between atmosphere and reciprocity
    let envCorrelation = 0;
    nodes.forEach(n => {
        envCorrelation += n.atmosphericWeight * (1 - n.reciprocityMetric / 5);
    });
    const environmentalSensitivity = Math.min(envCorrelation / nodes.length * 2, 1);

    // Adaptation rate: how quickly reciprocity changes
    const changes = [];
    for (let i = 1; i < reciprocities.length; i++) {
        changes.push(Math.abs(reciprocities[i] - reciprocities[i - 1]));
    }
    const avgChange = changes.length > 0
        ? changes.reduce((s, c) => s + c, 0) / changes.length
        : 0;
    const adaptationRate = Math.min(avgChange / 2, 1);

    return {
        sensoryProfile,
        regulationCapacity,
        connectionNeed,
        environmentalSensitivity,
        adaptationRate,
    };
}

/**
 * DETECT PHASE TRANSITIONS: Identify tipping points in the data
 */
export function detectPhaseTransitions(observations: Observation[]): PhaseTransition[] {
    const transitions: PhaseTransition[] = [];

    if (observations.length < 3) return transitions;

    const nodes = observationsToNodes(observations).sort(
        (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    );

    for (let i = 1; i < nodes.length; i++) {
        const prev = nodes[i - 1];
        const curr = nodes[i];

        // Calculate state for each observation
        const prevState = getRegulationState(prev.reciprocityMetric, prev.atmosphericWeight);
        const currState = getRegulationState(curr.reciprocityMetric, curr.atmosphericWeight);

        // Detect state change
        if (prevState !== currState) {
            const intensity = Math.abs(curr.reciprocityMetric - prev.reciprocityMetric) / 4;

            // Determine triggering factors
            const factors: string[] = [];
            if (curr.atmosphericWeight > prev.atmosphericWeight + 0.2) {
                factors.push('Increased environmental stress');
            }
            if (curr.biologicalHiddenVar.length > prev.biologicalHiddenVar.length) {
                factors.push('Elevated biological needs');
            }
            if (!curr.channels.some(c => prev.channels.includes(c))) {
                factors.push('Shift in communication channels');
            }

            transitions.push({
                id: `phase-${curr.id}`,
                timestamp: curr.timestamp,
                fromState: prevState,
                toState: currState,
                triggeringFactors: factors.length > 0 ? factors : ['Unknown factors'],
                intensity,
                warning: prev.atmosphericWeight > 0.5 || prev.reciprocityMetric <= 2,
            });
        }
    }

    return transitions;
}

function getRegulationState(reciprocity: number, atmospheric: number): 'regulated' | 'seeking' | 'dysregulated' {
    if (reciprocity >= 4 && atmospheric < 0.4) return 'regulated';
    if (reciprocity <= 2 || atmospheric > 0.7) return 'dysregulated';
    return 'seeking';
}

/**
 * PREDICT CORRECTION REQUIREMENTS: Proactive regulation insights
 */
export function predictCorrectionRequirements(
    observations: Observation[],
    identity: IdentityEmergenceLayer
): CorrectionRequirement[] {
    const corrections: CorrectionRequirement[] = [];

    if (observations.length < 3) return corrections;

    const recent = observations.slice(-5);
    const nodes = observationsToNodes(recent);

    // Calculate current risk
    const avgReciprocity = nodes.reduce((s, n) => s + n.reciprocityMetric, 0) / nodes.length;
    const avgAtmospheric = nodes.reduce((s, n) => s + n.atmosphericWeight, 0) / nodes.length;
    const _currentRisk = (avgAtmospheric * 0.6) + ((5 - avgReciprocity) / 5 * 0.4);
    void _currentRisk; // Reserved for future risk-based recommendations

    // If high sensory profile and atmospheric stress rising
    if (identity.sensoryProfile > 0.6 && avgAtmospheric > 0.5) {
        corrections.push({
            id: `correction-sensory-${Date.now()}`,
            urgency: avgAtmospheric > 0.7 ? 'immediate' : 'soon',
            type: 'sensory',
            recommendation: 'Consider proactive sensory input: deep pressure, movement breaks, or quiet space',
            confidence: identity.sensoryProfile * avgAtmospheric,
            basedOn: ['High sensory profile', 'Rising atmospheric stress'],
            estimatedImpact: 0.6,
        });
    }

    // If low regulation capacity and recent decline
    if (identity.regulationCapacity < 0.4 && avgReciprocity < 3) {
        corrections.push({
            id: `correction-relational-${Date.now()}`,
            urgency: 'soon',
            type: 'relational',
            recommendation: 'Increase co-regulation opportunities: presence, connection bids, reduce demands',
            confidence: (1 - identity.regulationCapacity) * (1 - avgReciprocity / 5),
            basedOn: ['Limited self-regulation capacity', 'Recent connection challenges'],
            estimatedImpact: 0.7,
        });
    }

    // Time-based predictions
    const currentHour = new Date().getHours();
    if (currentHour >= 14 && currentHour <= 16 && identity.environmentalSensitivity > 0.5) {
        corrections.push({
            id: `correction-environmental-${Date.now()}`,
            urgency: 'preventive',
            type: 'environmental',
            recommendation: 'Prepare transition supports for afternoon shift: reduce stimulation, offer snacks, quiet time',
            confidence: identity.environmentalSensitivity * 0.8,
            basedOn: ['Afternoon typically challenging', 'High environmental sensitivity'],
            estimatedImpact: 0.5,
        });
    }

    // Biological needs pattern
    const biologicalNeeds = nodes.flatMap(n => n.biologicalHiddenVar);
    const needCounts: Record<string, number> = {};
    biologicalNeeds.forEach(need => {
        needCounts[need] = (needCounts[need] || 0) + 1;
    });

    const dominantNeed = Object.entries(needCounts)
        .sort((a, b) => b[1] - a[1])[0];

    if (dominantNeed && dominantNeed[1] >= 3) {
        corrections.push({
            id: `correction-biological-${Date.now()}`,
            urgency: 'soon',
            type: 'biological',
            recommendation: `Address recurring ${dominantNeed[0]} need: ${getBiologicalRecommendation(dominantNeed[0])}`,
            confidence: dominantNeed[1] / nodes.length,
            basedOn: [`${dominantNeed[0]} appears in ${dominantNeed[1]} of last ${nodes.length} observations`],
            estimatedImpact: 0.6,
        });
    }

    return corrections.sort((a, b) => {
        const urgencyOrder = { immediate: 0, soon: 1, preventive: 2 };
        return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    });
}

function getBiologicalRecommendation(need: string): string {
    const recommendations: Record<string, string> = {
        sensory: 'Provide sensory breaks, reduce environmental demands',
        vestibular: 'Offer movement opportunities: swinging, spinning, jumping',
        proprioceptive: 'Heavy work activities: carrying, pushing, tight hugs',
        interoceptive: 'Check hunger, thirst, bathroom needs, rest',
        emotional: 'Validate feelings, co-regulate, reduce cognitive demands',
    };
    return recommendations[need] || 'Monitor and respond to emerging needs';
}

/**
 * GENERATE PROACTIVE INSIGHT: Full Oracle prediction output
 */
export function generateProactiveInsight(observations: Observation[]): ProactiveInsight {
    const identity = calculateIdentityEmergence(observations);
    const transitions = detectPhaseTransitions(observations);
    const corrections = predictCorrectionRequirements(observations, identity);

    // Calculate current risk level
    const nodes = observationsToNodes(observations.slice(-7));
    const avgReciprocity = nodes.length > 0
        ? nodes.reduce((s, n) => s + n.reciprocityMetric, 0) / nodes.length
        : 3;
    const avgAtmospheric = nodes.length > 0
        ? nodes.reduce((s, n) => s + n.atmosphericWeight, 0) / nodes.length
        : 0.5;

    const currentRiskLevel = Math.min(
        (avgAtmospheric * 0.5) + ((5 - avgReciprocity) / 5 * 0.3) + (1 - identity.regulationCapacity) * 0.2,
        1
    );

    // Determine prediction window
    const predictedWindow = currentRiskLevel > 0.7
        ? 'Next 30 minutes'
        : currentRiskLevel > 0.4
            ? 'Next 2 hours'
            : 'Next 4 hours';

    return {
        phaseTransitions: transitions,
        corrections,
        currentRiskLevel,
        predictedWindow,
        identityEmergence: identity,
    };
}

/**
 * GENERATE IEP TRAJECTORY NARRATIVE: For institutional refraction
 */
export function generateIEPTrajectoryNarrative(
    observations: Observation[],
    childName: string,
    patterns: EmergentPattern[],
    state: SystemicState
): string {
    const parts: string[] = [];
    const identity = calculateIdentityEmergence(observations);
    const transitions = detectPhaseTransitions(observations);

    parts.push(`# ${childName}'s Regulation Trajectory Report`);
    parts.push(`*A Systems-Informed Analysis for IEP Team Consideration*\n`);

    // Executive Summary
    parts.push('## Executive Summary');
    parts.push(`This report presents ${observations.length} documented observations from the home environment, `);
    parts.push(`analyzed through a complex systems lens to reveal patterns invisible to institutional snapshots.\n`);

    // Identity Emergence Profile
    parts.push('## Identity Emergence Profile');
    parts.push('These metrics represent emergent properties of the child-environment system:\n');
    parts.push(`| Dimension | Level | Implication |`);
    parts.push(`|-----------|-------|-------------|`);
    parts.push(`| Sensory Processing | ${(identity.sensoryProfile * 100).toFixed(0)}% | ${identity.sensoryProfile > 0.6 ? 'Requires proactive sensory accommodations' : 'Standard sensory needs'} |`);
    parts.push(`| Regulation Capacity | ${(identity.regulationCapacity * 100).toFixed(0)}% | ${identity.regulationCapacity < 0.5 ? 'Benefits from co-regulation support' : 'Developing self-regulation'} |`);
    parts.push(`| Connection Need | ${(identity.connectionNeed * 100).toFixed(0)}% | ${identity.connectionNeed > 0.5 ? 'Relational approaches most effective' : 'Responds to varied strategies'} |`);
    parts.push(`| Environmental Sensitivity | ${(identity.environmentalSensitivity * 100).toFixed(0)}% | ${identity.environmentalSensitivity > 0.6 ? 'Highly responsive to context changes' : 'Moderate environmental impact'} |`);
    parts.push('');

    // Non-Linear Relationships
    parts.push('## Non-Linear Relationships: Home ↔ School');
    parts.push('The relationship between homeplace healing and schoolhouse performance is not linear. ');
    parts.push('Small improvements in home regulation often precede larger improvements at school, ');
    parts.push('demonstrating the *backpropagation* of wellness through the child\'s system.\n');

    if (patterns.length > 0) {
        parts.push('### Detected Emergence Patterns');
        patterns.slice(0, 4).forEach(p => {
            parts.push(`- **${p.triggerCondition}**: ${p.outcome} (${(p.confidence * 100).toFixed(0)}% confidence)`);
        });
        parts.push('');
    }

    // Phase Transitions
    if (transitions.length > 0) {
        parts.push('## Phase Transitions');
        parts.push('Critical tipping points where small inputs created large state changes:\n');
        transitions.slice(0, 3).forEach(t => {
            parts.push(`- **${t.fromState} → ${t.toState}** (Intensity: ${(t.intensity * 100).toFixed(0)}%)`);
            parts.push(`  - Factors: ${t.triggeringFactors.join(', ')}`);
            parts.push(`  - ${t.warning ? '⚠️ Warning signs were present' : '⚡ Rapid transition'}`);
        });
        parts.push('');
    }

    // Feedback Loops
    if (state.feedbackLoops.length > 0) {
        parts.push('## Active Feedback Loops');
        state.feedbackLoops.forEach(loop => {
            const icon = loop.type === 'amplifying' ? '🔄' : '⚖️';
            parts.push(`${icon} **${loop.type === 'amplifying' ? 'Amplifying' : 'Dampening'} Loop**: ${loop.description}`);
            parts.push(`   - Involves: ${loop.involvedFactors.join(', ')}`);
            parts.push(`   - Strength: ${(loop.strength * 100).toFixed(0)}%`);
        });
        parts.push('');
    }

    // Recommendations
    parts.push('## Systems-Informed IEP Recommendations');
    parts.push('Based on this trajectory analysis, consider:\n');

    if (identity.sensoryProfile > 0.5) {
        parts.push('1. **Sensory Accommodations**: Build proactive sensory breaks into the schedule rather than reactive interventions.');
    }
    if (identity.connectionNeed > 0.5) {
        parts.push('2. **Relational Approach**: Prioritize relationship-building with key staff over behavioral compliance metrics.');
    }
    if (identity.environmentalSensitivity > 0.5) {
        parts.push('3. **Environmental Modifications**: Reduce sensory demands during known vulnerable periods (transitions, afternoon).');
    }
    if (state.entropy > 0.5) {
        parts.push('4. **Predictability**: The system shows high entropy. Increase predictability and reduce environmental surprises.');
    }

    parts.push('\n---');
    parts.push('*This analysis positions the parent/guardian as lead systems expert. ');
    parts.push('Home observations provide unique access to the child\'s natural regulation patterns ');
    parts.push('that institutional settings cannot capture.*');

    return parts.join('\n');
}

// ============================================================================
// SOVEREIGN CARE PLAN: Professional Three-Part Narrative
// ============================================================================

/**
 * CARE PLAN NARRATIVE: Structured three-part professional document
 */
export interface CarePlanNarrative {
    childName: string;
    generatedAt: Date;
    periodStart: Date;
    periodEnd: Date;
    observationCount: number;

    // Part 1: Joy and Relational Strengths
    joyAndStrengths: {
        title: string;
        narrative: string;
        keyStrengths: string[];
        connectionMoments: string[];
        preferredChannels: string[];
    };

    // Part 2: Atmospheric Triggers & Biological Rhythms
    triggersAndRhythms: {
        title: string;
        narrative: string;
        atmosphericTriggers: string[];
        biologicalPatterns: string[];
        timeOfDayFactors: string[];
        environmentalSensitivities: string[];
    };

    // Part 3: Recommended Classroom Regulation Strategies
    classroomStrategies: {
        title: string;
        narrative: string;
        proactiveStrategies: string[];
        responsiveStrategies: string[];
        accommodations: string[];
        communicationGuide: string[];
    };

    // Footer
    parentSignature: string;
    sovereignDeclaration: string;
}

/**
 * GENERATE CARE PLAN NARRATIVE: Synthesize observations into professional document
 */
export function generateCarePlanNarrative(
    observations: Observation[],
    childName: string,
    parentTitle: string = 'Parent/Guardian'
): CarePlanNarrative {
    const nodes = observationsToNodes(observations);
    const _patterns = processEmergence(observations);
    const identity = calculateIdentityEmergence(observations);
    const _systemicState = calculateSystemicEntropy(observations);
    void _patterns; void _systemicState; // Reserved for advanced narrative generation

    // Calculate date range
    const timestamps = observations.map(o => o.timestamp.toDate().getTime());
    const periodStart = new Date(Math.min(...timestamps));
    const periodEnd = new Date(Math.max(...timestamps));

    // === PART 1: JOY AND RELATIONAL STRENGTHS ===

    // Find high-reciprocity observations
    const joyMoments = nodes.filter(n => n.reciprocityMetric >= 4);
    const connectionChannels = new Map<string, number>();
    joyMoments.forEach(n => {
        n.channels.forEach(c => {
            connectionChannels.set(c, (connectionChannels.get(c) || 0) + 1);
        });
    });

    const preferredChannels = Array.from(connectionChannels.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([channel]) => channel);

    const connectionMoments = joyMoments.slice(0, 5).map(n => {
        const snippet = n.rawNarrative.slice(0, 100);
        return snippet.length < n.rawNarrative.length ? `${snippet}...` : snippet;
    });

    const keyStrengths: string[] = [];
    if (identity.connectionNeed > 0.5) {
        keyStrengths.push('Deeply values relational connection and responds well to attunement');
    }
    if (identity.adaptationRate > 0.5) {
        keyStrengths.push('Demonstrates resilience and ability to recover from challenges');
    }
    if (preferredChannels.includes('Play')) {
        keyStrengths.push('Uses play as a primary vehicle for learning and expression');
    }
    if (preferredChannels.includes('Movement')) {
        keyStrengths.push('Expresses joy and regulation through physical movement');
    }
    if (joyMoments.length > observations.length * 0.4) {
        keyStrengths.push('Shows consistent capacity for positive engagement');
    }

    const joyNarrative = `${childName} demonstrates meaningful capacity for connection when the environment supports their regulatory needs. ` +
        `During this observation period, ${joyMoments.length} of ${observations.length} documented moments showed strong relational reciprocity. ` +
        `${childName} communicates most effectively through ${preferredChannels.slice(0, 3).join(', ').toLowerCase() || 'varied'} channels. ` +
        `These moments of connection are not accidental — they reveal ${childName}'s authentic communicative strengths when conditions align.`;

    // === PART 2: ATMOSPHERIC TRIGGERS & BIOLOGICAL RHYTHMS ===

    const lowReciprocity = nodes.filter(n => n.reciprocityMetric <= 2);
    const atmosphericTriggers: string[] = [];
    const biologicalPatterns: string[] = [];

    // Analyze triggers
    const triggerCounts: Record<string, number> = {};
    lowReciprocity.forEach(n => {
        if (n.atmosphericWeight > 0.5) {
            atmosphericTriggers.push('High environmental stress correlates with disconnect');
        }
        n.biologicalHiddenVar.forEach(bio => {
            triggerCounts[bio] = (triggerCounts[bio] || 0) + 1;
        });
    });

    Object.entries(triggerCounts)
        .filter(([_, count]) => count >= 2)
        .sort((a, b) => b[1] - a[1])
        .forEach(([trigger, count]) => {
            biologicalPatterns.push(`${trigger} needs appeared in ${count} challenging moments`);
        });

    // Time of day analysis
    const timeOfDayFactors: string[] = [];
    const hourlyReciprocity: Record<number, number[]> = {};
    nodes.forEach(n => {
        const hour = n.timestamp.getHours();
        if (!hourlyReciprocity[hour]) hourlyReciprocity[hour] = [];
        hourlyReciprocity[hour].push(n.reciprocityMetric);
    });

    Object.entries(hourlyReciprocity).forEach(([hour, values]) => {
        const avg = values.reduce((s, v) => s + v, 0) / values.length;
        const h = parseInt(hour);
        if (avg < 3 && values.length >= 2) {
            if (h >= 14 && h <= 17) {
                timeOfDayFactors.push('Afternoon hours (2-5pm) show increased regulation challenges');
            } else if (h >= 7 && h <= 9) {
                timeOfDayFactors.push('Morning transition period shows regulation challenges');
            }
        }
    });

    const environmentalSensitivities: string[] = [];
    if (identity.sensoryProfile > 0.6) {
        environmentalSensitivities.push('High sensory sensitivity requires proactive environmental modifications');
    }
    if (identity.environmentalSensitivity > 0.6) {
        environmentalSensitivities.push('Strongly responsive to changes in atmospheric conditions (stress, transitions, novelty)');
    }

    const triggersNarrative = `Understanding ${childName}'s regulation patterns requires attention to both biological rhythms and atmospheric context. ` +
        `The data reveals ${lowReciprocity.length} observations where connection was challenged. ` +
        `Rather than viewing these as "problem behaviors," this analysis positions them as communications about unmet needs. ` +
        `${childName}'s nervous system carries heightened sensitivity to ${identity.environmentalSensitivity > 0.5 ? 'environmental pressures' : 'biological states'}, ` +
        `which is not a deficit but a marker of perceptual acuity that requires accommodation.`;

    // === PART 3: RECOMMENDED CLASSROOM REGULATION STRATEGIES ===

    const proactiveStrategies: string[] = [];
    const responsiveStrategies: string[] = [];
    const accommodations: string[] = [];
    const communicationGuide: string[] = [];

    // Based on identity emergence
    if (identity.sensoryProfile > 0.5) {
        proactiveStrategies.push('Build sensory breaks into the daily schedule (movement, deep pressure, quiet space)');
        accommodations.push('Access to sensory tools (fidgets, weighted lap pad, noise-reducing headphones)');
    }
    if (identity.regulationCapacity < 0.5) {
        proactiveStrategies.push('Increase co-regulation opportunities throughout the day');
        responsiveStrategies.push('When dysregulation begins, prioritize connection over correction');
    }
    if (identity.connectionNeed > 0.5) {
        proactiveStrategies.push('Establish a key staff member for primary relational check-ins');
        communicationGuide.push('Use warm, attuned tone — this child responds to relational safety');
    }

    // Based on temporal patterns
    if (timeOfDayFactors.some(f => f.includes('Afternoon'))) {
        proactiveStrategies.push('Schedule less demanding activities for afternoon periods');
        accommodations.push('Option for movement break or snack around 2-3pm');
    }
    if (timeOfDayFactors.some(f => f.includes('Morning'))) {
        proactiveStrategies.push('Allow buffer time for morning arrival transition');
        accommodations.push('Quiet arrival space with predictable routine');
    }

    // Based on communication channels
    if (preferredChannels.includes('Movement')) {
        communicationGuide.push('Movement is communication — allow physical expression during learning');
    }
    if (preferredChannels.includes('Play')) {
        communicationGuide.push('Embed learning in playful, low-pressure contexts when possible');
    }

    // Default responsive strategies
    responsiveStrategies.push('At first signs of dysregulation: reduce demands, offer presence, validate feelings');
    responsiveStrategies.push('Avoid power struggles — these escalate rather than regulate');
    responsiveStrategies.push('Use calm, predictable language: "I\'m here. You\'re safe. We can figure this out together."');

    // Default accommodations
    accommodations.push('Advance notice of transitions (5-minute, 2-minute, 1-minute warnings)');
    accommodations.push('Visual schedule for daily predictability');
    accommodations.push('Designated calm-down space that is not punitive');

    const strategiesNarrative = `These strategies emerge from ${observations.length} documented observations in the home environment. ` +
        `They represent evidence-based insights from the primary caregiver who knows ${childName} most intimately. ` +
        `The goal is not compliance but connection — creating conditions where ${childName}'s nervous system can find regulation ` +
        `and their authentic self can emerge in the learning environment.`;

    return {
        childName,
        generatedAt: new Date(),
        periodStart,
        periodEnd,
        observationCount: observations.length,

        joyAndStrengths: {
            title: 'Section I: Joy and Relational Strengths',
            narrative: joyNarrative,
            keyStrengths: keyStrengths.length > 0 ? keyStrengths : ['Unique strengths requiring further observation'],
            connectionMoments,
            preferredChannels,
        },

        triggersAndRhythms: {
            title: 'Section II: Atmospheric Triggers & Biological Rhythms',
            narrative: triggersNarrative,
            atmosphericTriggers: [...new Set(atmosphericTriggers)],
            biologicalPatterns,
            timeOfDayFactors,
            environmentalSensitivities,
        },

        classroomStrategies: {
            title: 'Section III: Recommended Classroom Regulation Strategies',
            narrative: strategiesNarrative,
            proactiveStrategies,
            responsiveStrategies,
            accommodations,
            communicationGuide,
        },

        parentSignature: parentTitle,
        sovereignDeclaration: `This Sovereign Care Plan was generated from ${observations.length} witnessed moments ` +
            `documented between ${periodStart.toLocaleDateString()} and ${periodEnd.toLocaleDateString()}. ` +
            `The parent/guardian is recognized as the primary expert on their child's regulation patterns ` +
            `and this document carries the weight of their sacred witnessing.`,
    };
}

/**
 * RENDER CARE PLAN TO HTML: Print-ready HTML template
 */
export function renderCarePlanToHTML(carePlan: CarePlanNarrative): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sovereign Care Plan - ${carePlan.childName}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        @page {
            size: letter;
            margin: 0.75in;
        }
        
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        
        body {
            font-family: 'Nunito', sans-serif;
            font-size: 11pt;
            line-height: 1.6;
            color: #2D2D2D;
            background: #FDF8F3;
        }
        
        .page {
            max-width: 8.5in;
            margin: 0 auto;
            padding: 0.5in;
            background: white;
        }
        
        /* Header */
        .header {
            text-align: center;
            border-bottom: 3px solid #D4AF37;
            padding-bottom: 24px;
            margin-bottom: 32px;
        }
        
        .header h1 {
            font-family: 'Playfair Display', serif;
            font-size: 28pt;
            color: #4B0082;
            margin-bottom: 8px;
            letter-spacing: 1px;
        }
        
        .header .subtitle {
            font-size: 12pt;
            color: #6B6B6B;
            font-style: italic;
        }
        
        .header .child-name {
            font-family: 'Playfair Display', serif;
            font-size: 18pt;
            color: #D4AF37;
            margin-top: 16px;
        }
        
        .header .meta {
            font-size: 9pt;
            color: #888;
            margin-top: 12px;
        }
        
        /* Sections */
        .section {
            margin-bottom: 28px;
            page-break-inside: avoid;
        }
        
        .section-title {
            font-family: 'Playfair Display', serif;
            font-size: 14pt;
            color: #4B0082;
            border-left: 4px solid #D4AF37;
            padding-left: 12px;
            margin-bottom: 12px;
        }
        
        .section-narrative {
            font-size: 10.5pt;
            color: #3D3D3D;
            margin-bottom: 16px;
            text-align: justify;
        }
        
        /* Lists */
        .list-group {
            margin-bottom: 16px;
        }
        
        .list-title {
            font-weight: 700;
            font-size: 10pt;
            color: #4B0082;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
        }
        
        .list-group ul {
            list-style: none;
            padding-left: 0;
        }
        
        .list-group li {
            position: relative;
            padding-left: 20px;
            margin-bottom: 6px;
            font-size: 10pt;
        }
        
        .list-group li::before {
            content: "✦";
            position: absolute;
            left: 0;
            color: #D4AF37;
        }
        
        .list-group.strategies li::before {
            content: "→";
            color: #4B0082;
        }
        
        .list-group.accommodations li::before {
            content: "◆";
            color: #2E8B57;
        }
        
        /* Quote blocks */
        .quote-block {
            background: linear-gradient(135deg, rgba(75, 0, 130, 0.05) 0%, rgba(212, 175, 55, 0.05) 100%);
            border-left: 4px solid #D4AF37;
            padding: 16px;
            margin: 16px 0;
            font-style: italic;
            font-size: 10pt;
        }
        
        /* Footer */
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #D4AF37;
            text-align: center;
        }
        
        .sovereignty-statement {
            font-size: 9pt;
            color: #666;
            font-style: italic;
            max-width: 6in;
            margin: 0 auto 20px;
        }
        
        .signature-line {
            margin-top: 32px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }
        
        .signature-block {
            width: 45%;
        }
        
        .signature-block .line {
            border-bottom: 1px solid #2D2D2D;
            height: 40px;
        }
        
        .signature-block .label {
            font-size: 9pt;
            color: #666;
            margin-top: 4px;
        }
        
        /* Glossary tooltip hint */
        .glossary-term {
            color: #4B0082;
            border-bottom: 1px dotted #D4AF37;
            cursor: help;
        }
        
        /* Print styles */
        @media print {
            body {
                background: white;
            }
            .page {
                box-shadow: none;
                padding: 0;
            }
        }
    </style>
</head>
<body>
    <div class="page">
        <header class="header">
            <h1>Sovereign Care Plan</h1>
            <div class="subtitle">A Dignity-Centered Regulation Guide</div>
            <div class="child-name">${carePlan.childName}</div>
            <div class="meta">
                Generated ${carePlan.generatedAt.toLocaleDateString()} | 
                Based on ${carePlan.observationCount} observations from 
                ${carePlan.periodStart.toLocaleDateString()} to ${carePlan.periodEnd.toLocaleDateString()}
            </div>
        </header>
        
        <!-- Section I: Joy and Strengths -->
        <section class="section">
            <h2 class="section-title">${carePlan.joyAndStrengths.title}</h2>
            <p class="section-narrative">${carePlan.joyAndStrengths.narrative}</p>
            
            <div class="list-group">
                <div class="list-title">Key Strengths</div>
                <ul>
                    ${carePlan.joyAndStrengths.keyStrengths.map(s => `<li>${s}</li>`).join('')}
                </ul>
            </div>
            
            <div class="list-group">
                <div class="list-title">Preferred Communication Channels</div>
                <ul>
                    ${carePlan.joyAndStrengths.preferredChannels.map(c => `<li>${c}</li>`).join('')}
                </ul>
            </div>
        </section>
        
        <!-- Section II: Triggers and Rhythms -->
        <section class="section">
            <h2 class="section-title">${carePlan.triggersAndRhythms.title}</h2>
            <p class="section-narrative">${carePlan.triggersAndRhythms.narrative}</p>
            
            ${carePlan.triggersAndRhythms.biologicalPatterns.length > 0 ? `
            <div class="list-group">
                <div class="list-title">Biological Patterns Observed</div>
                <ul>
                    ${carePlan.triggersAndRhythms.biologicalPatterns.map(p => `<li>${p}</li>`).join('')}
                </ul>
            </div>
            ` : ''}
            
            ${carePlan.triggersAndRhythms.timeOfDayFactors.length > 0 ? `
            <div class="list-group">
                <div class="list-title">Time-of-Day Considerations</div>
                <ul>
                    ${carePlan.triggersAndRhythms.timeOfDayFactors.map(t => `<li>${t}</li>`).join('')}
                </ul>
            </div>
            ` : ''}
            
            ${carePlan.triggersAndRhythms.environmentalSensitivities.length > 0 ? `
            <div class="list-group">
                <div class="list-title">Environmental Sensitivities</div>
                <ul>
                    ${carePlan.triggersAndRhythms.environmentalSensitivities.map(e => `<li>${e}</li>`).join('')}
                </ul>
            </div>
            ` : ''}
        </section>
        
        <!-- Section III: Classroom Strategies -->
        <section class="section">
            <h2 class="section-title">${carePlan.classroomStrategies.title}</h2>
            <p class="section-narrative">${carePlan.classroomStrategies.narrative}</p>
            
            <div class="list-group strategies">
                <div class="list-title">Proactive Strategies</div>
                <ul>
                    ${carePlan.classroomStrategies.proactiveStrategies.map(s => `<li>${s}</li>`).join('')}
                </ul>
            </div>
            
            <div class="list-group strategies">
                <div class="list-title">Responsive Strategies</div>
                <ul>
                    ${carePlan.classroomStrategies.responsiveStrategies.map(s => `<li>${s}</li>`).join('')}
                </ul>
            </div>
            
            <div class="list-group accommodations">
                <div class="list-title">Recommended Accommodations</div>
                <ul>
                    ${carePlan.classroomStrategies.accommodations.map(a => `<li>${a}</li>`).join('')}
                </ul>
            </div>
            
            <div class="list-group">
                <div class="list-title">Communication Guide</div>
                <ul>
                    ${carePlan.classroomStrategies.communicationGuide.map(c => `<li>${c}</li>`).join('')}
                </ul>
            </div>
        </section>
        
        <footer class="footer">
            <p class="sovereignty-statement">${carePlan.sovereignDeclaration}</p>
            
            <div class="signature-line">
                <div class="signature-block">
                    <div class="line"></div>
                    <div class="label">${carePlan.parentSignature} Signature</div>
                </div>
                <div class="signature-block">
                    <div class="line"></div>
                    <div class="label">Date</div>
                </div>
            </div>
        </footer>
    </div>
</body>
</html>`;
}

// ============================================================================
// PRACTITIONER PORTAL: CLASSROOM INSIGHTS
// ============================================================================

/**
 * Environmental Insight for Practitioners
 * Translates Atmospheric Resonance into actionable classroom strategies
 */
export interface EnvironmentalInsight {
    category: string;            // e.g., "Sensory Environment", "Transition Support"
    insight: string;             // Narrative explanation
    supportStrategies: string[]; // Actionable strategies
    environmentalFactors: string[]; // What environmental factors apply
}

/**
 * Strength-Based Narrative for Practitioner Portal
 * Synthesized from recent observations
 */
export interface StrengthNarrative {
    summary: string;
    topStrengths: string[];
    connectionMoments: string[];
    preferredChannels: string[];
    classroomInsights: EnvironmentalInsight[];
}

/**
 * Generate Classroom Environmental Insights
 * 
 * Transforms Atmospheric Resonance observations into professional,
 * strength-based narratives suitable for educators and practitioners.
 * 
 * @param observations - Recent observations from the last 7 days
 * @param childName - Child's name
 * @param passport - Optional Sovereign Passport for additional context
 */
export async function generateClassroomInsights(
    observations: Observation[],
    childName: string,
    passport?: {
        biological?: { allergies?: string[]; foodPreferences?: string[]; textures?: string[] };
        sensory?: { stimmingPatterns?: { behavior?: string; dignityFraming?: string; supportStrategy?: string }[]; favoriteToys?: (string | { name: string })[] };
        contextualAbilities?: { schoolExpectations?: string; reasonableAccommodations?: string; communicationPreferences?: string };
        sacredSummary?: string;
    }
): Promise<StrengthNarrative> {
    // Extract strengths and patterns from observations
    const strengthPatterns: string[] = [];
    const connectionMoments: string[] = [];
    const channels: Set<string> = new Set();
    const environmentalPatterns: Map<string, string[]> = new Map();

    // Analyze each observation for patterns
    observations.forEach((obs) => {
        const note = obs.strengthNarrative || '';

        // Detect strengths
        if (note.toLowerCase().includes('joy') || note.toLowerCase().includes('happy') ||
            note.toLowerCase().includes('excited') || note.toLowerCase().includes('calm')) {
            strengthPatterns.push(extractStrength(note, childName));
        }

        // Detect connection moments
        if (note.toLowerCase().includes('connection') || note.toLowerCase().includes('reciproc') ||
            note.toLowerCase().includes('together') || note.toLowerCase().includes('shared')) {
            connectionMoments.push(extractConnection(note));
        }

        // Detect communication channels from the channels array
        if (obs.channels && obs.channels.length > 0) {
            obs.channels.forEach(ch => channels.add(ch));
        }

        // Analyze atmospheric resonance for environmental patterns
        if (obs.atmosphericResonance) {
            const atmLower = obs.atmosphericResonance.toLowerCase();
            if (atmLower.includes('sensory')) {
                const existing = environmentalPatterns.get('sensory') || [];
                existing.push(obs.atmosphericResonance);
                environmentalPatterns.set('sensory', existing);
            }
            if (atmLower.includes('transition')) {
                const existing = environmentalPatterns.get('transition') || [];
                existing.push(obs.atmosphericResonance);
                environmentalPatterns.set('transition', existing);
            }
        }
    });

    // Generate classroom insights from environmental patterns
    const classroomInsights: EnvironmentalInsight[] = [];

    // Sensory Environment Insight
    if (passport?.sensory?.stimmingPatterns && passport.sensory.stimmingPatterns.length > 0) {
        classroomInsights.push({
            category: 'Sensory Environment',
            insight: `${childName} communicates sensory needs through specific regulation patterns. Honoring these patterns supports focus and emotional balance.`,
            supportStrategies: passport.sensory.stimmingPatterns
                .filter(p => p.supportStrategy)
                .map(p => p.supportStrategy!)
                .slice(0, 3),
            environmentalFactors: ['Lighting sensitivity', 'Sound levels', 'Physical space needs'],
        });
    }

    // Transition Support Insight
    const transitionObs = observations.filter(o =>
        (o.strengthNarrative || '').toLowerCase().includes('transition') ||
        (o.strengthNarrative || '').toLowerCase().includes('change')
    );
    if (transitionObs.length > 0) {
        classroomInsights.push({
            category: 'Transition Support',
            insight: `${childName} benefits from predictable transition supports. Clear warnings and visual schedules reduce regulation demands.`,
            supportStrategies: [
                'Provide 5-minute and 2-minute warnings before transitions',
                'Use visual timer or countdown',
                'Allow preferred object during transitions',
            ],
            environmentalFactors: ['Schedule changes', 'Activity transitions', 'Location changes'],
        });
    }

    // Communication Preferences Insight
    if (passport?.contextualAbilities?.communicationPreferences) {
        classroomInsights.push({
            category: 'Communication',
            insight: `For best communication with ${childName}: ${passport.contextualAbilities.communicationPreferences}`,
            supportStrategies: [
                'Use preferred communication style',
                'Allow processing time after instructions',
                'Confirm understanding through preferred channel',
            ],
            environmentalFactors: ['Verbal instructions', 'Written directions', 'Peer interactions'],
        });
    }

    // Regulation Support Insight (from recent observations)
    const regulationObs = observations.filter(o =>
        (o.strengthNarrative || '').toLowerCase().includes('dysregula') ||
        (o.strengthNarrative || '').toLowerCase().includes('overwhelm') ||
        (o.strengthNarrative || '').toLowerCase().includes('upset')
    );
    if (regulationObs.length > 0) {
        classroomInsights.push({
            category: 'Regulation Support',
            insight: `Recent observations indicate ${childName} may need additional regulation support during high-demand activities. Environmental modifications can prevent escalation.`,
            supportStrategies: [
                'Offer sensory breaks proactively',
                'Reduce environmental demands when signs of dysregulation appear',
                'Use co-regulation strategies',
            ],
            environmentalFactors: ['Classroom noise', 'Task demands', 'Social complexity'],
        });
    }

    // Build the narrative
    const summary = generateNarrativeSummary(
        childName,
        observations.length,
        strengthPatterns,
        connectionMoments,
        passport?.sacredSummary
    );

    return {
        summary,
        topStrengths: [...new Set(strengthPatterns)].slice(0, 5),
        connectionMoments: [...new Set(connectionMoments)].slice(0, 4),
        preferredChannels: Array.from(channels).slice(0, 3),
        classroomInsights,
    };
}

/**
 * Extract strength from observation text
 */
function extractStrength(text: string, childName: string): string {
    const lowerText = text.toLowerCase();

    if (lowerText.includes('creative')) return `${childName} shows creative problem-solving`;
    if (lowerText.includes('curious')) return `${childName} demonstrates natural curiosity`;
    if (lowerText.includes('kind')) return `${childName} shows kindness to others`;
    if (lowerText.includes('persistent')) return `${childName} shows persistence in preferred activities`;
    if (lowerText.includes('focus')) return `${childName} demonstrates deep focus capacity`;
    if (lowerText.includes('joy')) return `${childName} experiences and shares joy`;
    if (lowerText.includes('connect')) return `${childName} seeks meaningful connection`;

    // Default strength extraction
    const words = text.split(' ').slice(0, 6).join(' ');
    return `Showed strength: ${words}...`;
}

/**
 * Extract connection moment from observation
 */
function extractConnection(text: string): string {
    const sentences = text.split(/[.!?]/).filter(s => s.trim());
    if (sentences.length > 0) {
        return sentences[0].trim().slice(0, 100) + (sentences[0].length > 100 ? '...' : '');
    }
    return text.slice(0, 100);
}

/**
 * Generate narrative summary for practitioner view
 */
function generateNarrativeSummary(
    childName: string,
    observationCount: number,
    strengths: string[],
    connections: string[],
    sacredSummary?: string
): string {
    if (sacredSummary) {
        return sacredSummary;
    }

    if (observationCount === 0) {
        return `${childName}'s profile is being developed by their family. As observations are shared, this narrative will grow to reflect their unique strengths and needs.`;
    }

    const strengthText = strengths.length > 0
        ? `Key strengths observed include ${strengths.slice(0, 2).join(' and ').toLowerCase()}.`
        : '';

    const connectionText = connections.length > 0
        ? `Recent moments of connection show ${childName}'s capacity for relational engagement.`
        : '';

    return `Based on ${observationCount} recent observation${observationCount !== 1 ? 's' : ''} shared by ${childName}'s family, this narrative provides a strength-based understanding for the care team. ${strengthText} ${connectionText}`.trim();
}

// ============================================================================
// SANCTUARY INVITATIONS: IEP Goals to Daily Joy
// ============================================================================

/**
 * SanctuaryInvitation - Transforms IEP goals into home-based joy activities
 */
export interface SanctuaryInvitation {
    id: string;
    iepGoalId: string;
    iepGoalDescription: string;
    sanctuaryActivity: string;
    joyApproach: string;
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'anytime';
    estimatedMinutes: number;
    environmentalSetup?: string;
    successIndicators: string[];
    parentReminder: string;
}

/**
 * Generate Sanctuary Invitations from IEP Goals
 * 
 * Transforms institutional IEP goals into dignified, joy-centered
 * home activities that build skills through relationship.
 */
export function generateSanctuaryInvitations(
    iepGoals: IEPGoal[],
    childName: string,
    childInterests?: string[]
): SanctuaryInvitation[] {
    return iepGoals
        .filter(goal => goal.progress !== 'Mastered')
        .map(goal => transformGoalToInvitation(goal, childName, childInterests));
}

/**
 * Transform a single IEP goal into a Sanctuary Invitation
 */
function transformGoalToInvitation(
    goal: IEPGoal,
    childName: string,
    interests?: string[]
): SanctuaryInvitation {
    const interestHook = interests && interests.length > 0
        ? interests[Math.floor(Math.random() * interests.length)]
        : 'play';

    // Map IEP goal areas to joy-centered activities
    const activityMap: Record<string, {
        activity: string;
        joyApproach: string;
        timeOfDay: SanctuaryInvitation['timeOfDay'];
        minutes: number;
    }> = {
        'Academic': {
            activity: `Explore learning through ${interestHook}`,
            joyApproach: 'Let curiosity lead. Follow what sparks their eyes.',
            timeOfDay: 'afternoon',
            minutes: 15,
        },
        'Behavioral': {
            activity: 'Co-regulation practice through body connection',
            joyApproach: 'Regulation is caught, not taught. Your calm is their medicine.',
            timeOfDay: 'anytime',
            minutes: 10,
        },
        'Social-Emotional': {
            activity: `Joint attention play with ${interestHook}`,
            joyApproach: 'Connection before correction. Joy before demand.',
            timeOfDay: 'morning',
            minutes: 20,
        },
        'Communication': {
            activity: 'Narrative co-creation through storytelling or play',
            joyApproach: 'All communication counts. Follow their language, not just words.',
            timeOfDay: 'evening',
            minutes: 15,
        },
        'Motor': {
            activity: 'Movement play that meets sensory needs',
            joyApproach: 'The body knows what it needs. Trust the movement.',
            timeOfDay: 'morning',
            minutes: 20,
        },
        'Life Skills': {
            activity: 'Parallel participation in daily routines',
            joyApproach: 'Side by side, not face to face. Competence through connection.',
            timeOfDay: 'anytime',
            minutes: 15,
        },
    };

    const mapped = activityMap[goal.area] || activityMap['Social-Emotional'];

    // Generate dignified description
    const dignityTranslation = goal.dignityTranslation ||
        translateDeficitToDignity(goal.description);

    return {
        id: `invitation_${goal.id}_${Date.now()}`,
        iepGoalId: goal.id,
        iepGoalDescription: goal.description,
        sanctuaryActivity: `Today's sanctuary practice: ${mapped.activity}`,
        joyApproach: mapped.joyApproach,
        timeOfDay: mapped.timeOfDay,
        estimatedMinutes: mapped.minutes,
        environmentalSetup: generateEnvironmentSetup(goal.area),
        successIndicators: [
            `${childName} remains regulated during the activity`,
            'Moments of shared attention or joy',
            'Your own nervous system stays calm',
        ],
        parentReminder: `${dignityTranslation} This is not homework—it is relationship.`,
    };
}

/**
 * Generate environment setup recommendations based on goal area
 */
function generateEnvironmentSetup(area: string): string {
    const setups: Record<string, string> = {
        'Academic': 'Create a low-distraction space. Have materials ready. Reduce demands visible in the environment.',
        'Behavioral': 'Ensure your own regulation first. Lower lighting if needed. Have comfort objects accessible.',
        'Social-Emotional': 'Position yourself at eye level. Minimize background noise. Have their preferred activity nearby.',
        'Communication': 'Create space for silence. Have visual supports available. Follow their lead in pacing.',
        'Motor': 'Clear safe space for movement. Have sensory tools available. Consider proprioceptive input first.',
        'Life Skills': 'Set up for success—adaptations before expectations. Break tasks into visible steps.',
    };

    return setups[area] || 'Create a calm, predictable environment that honors their sensory needs.';
}

/**
 * Get today's Sanctuary Invitation for a specific child
 */
export function getTodaysSanctuaryInvitation(
    iepGoals: IEPGoal[],
    childName: string,
    childInterests?: string[]
): SanctuaryInvitation | null {
    const invitations = generateSanctuaryInvitations(iepGoals, childName, childInterests);

    if (invitations.length === 0) {
        return null;
    }

    // Rotate based on day of year for variety
    const dayOfYear = Math.floor(
        (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    const index = dayOfYear % invitations.length;

    return invitations[index];
}

// ============================================================================
// PRACTICE MODE: Sensory Pre-Loading Based on Atmospheric Resonance
// ============================================================================

export interface PracticeModeRecommendation {
    gameType: 'vocation' | 'listening_pulse';
    gameId: string;
    gameName: string;
    reason: string;
    sensoryChannel?: string;
    targetSkill?: string;
}

export interface AtmosphericResonanceData {
    averageReciprocity: number;      // 1-5 scale
    dominantChallenges: string[];    // e.g., ['transitioning', 'waiting']
    peakStressTime?: string;         // e.g., 'morning', 'afternoon'
    observedStims?: string[];        // e.g., ['vestibular', 'vocal']
}

/**
 * Suggest morning Practice Mode game based on previous day's resonance data
 */
export function suggestMorningPractice(
    previousDayData: AtmosphericResonanceData,
    childName: string
): PracticeModeRecommendation {
    const { averageReciprocity, dominantChallenges, peakStressTime, observedStims } = previousDayData;

    // If low reciprocity, suggest grounding/calming games
    if (averageReciprocity < 2.5) {
        return {
            gameType: 'listening_pulse',
            gameId: 'body_scan_adventure',
            gameName: 'Body Scan Adventure',
            reason: `Yesterday felt heavy. Starting today with grounding can help ${childName}'s nervous system begin from a regulated place.`,
            sensoryChannel: 'tactile',
        };
    }

    // Check for specific challenges
    if (dominantChallenges.includes('transitioning') || dominantChallenges.includes('waiting')) {
        return {
            gameType: 'listening_pulse',
            gameId: 'freeze_dance_silly',
            gameName: 'Freeze Dance: Silly Edition',
            reason: `Transitions were tricky yesterday. Freeze dance practices stop-and-go in a playful way—preloading ${childName}'s transition muscles!`,
            sensoryChannel: 'vestibular',
        };
    }

    // Check for specific stims that could be channeled
    if (observedStims?.includes('vestibular') || observedStims?.includes('movement')) {
        return {
            gameType: 'listening_pulse',
            gameId: 'animal_commands',
            gameName: 'Animal Body Commands',
            reason: `${childName}'s body was seeking movement yesterday. Heavy work through animal play provides proprioceptive input that organizes the nervous system.`,
            sensoryChannel: 'proprioceptive',
        };
    }

    // Morning stress pattern - suggest voice modulation
    if (peakStressTime === 'morning') {
        return {
            gameType: 'listening_pulse',
            gameId: 'whisper_shout',
            gameName: 'The Whisper-Shout Game',
            reason: `Mornings have been loud lately. Playful volume practice can help ${childName}'s system calibrate before the day begins.`,
            sensoryChannel: 'auditory',
        };
    }

    // Default to a skill-building vocation game
    if (dominantChallenges.includes('accepting_no') || dominantChallenges.includes('disappointment')) {
        return {
            gameType: 'vocation',
            gameId: 'store_disappointment',
            gameName: 'The Store Said No',
            reason: `Disappointment moments came up yesterday. Practicing "no" in a playful way builds ${childName}'s flexibility muscle.`,
            targetSkill: 'accepting_no',
        };
    }

    // General recommendation
    return {
        gameType: 'vocation',
        gameId: 'taco_drive_thru',
        gameName: 'Taco Bell Drive-Thru',
        reason: `A classic waiting practice! ${childName} can order, wait, and celebrate—building patience through play.`,
        targetSkill: 'waiting',
    };
}

// ============================================================================
// BIOLOGICAL NECESSITY RECOGNITION: Stims as Strengths
// ============================================================================

export interface BiologicalNecessityInsight {
    stimBehavior: string;           // What the school calls it
    biologicalFunction: string;     // What the body is actually doing
    strengthReframe: string;        // Dignity-first description for IEP
    accommodationSuggestion: string;
}

const STIM_RECOGNITION: Record<string, BiologicalNecessityInsight> = {
    'hand_flapping': {
        stimBehavior: 'Hand flapping',
        biologicalFunction: 'Self-regulation through vestibular input and emotional expression',
        strengthReframe: 'Uses body-based self-regulation strategies independently',
        accommodationSuggestion: 'Allow movement breaks; do not redirect unless safety concern',
    },
    'rocking': {
        stimBehavior: 'Rocking',
        biologicalFunction: 'Vestibular self-soothing to regulate nervous system',
        strengthReframe: 'Demonstrates proactive self-calming through rhythmic movement',
        accommodationSuggestion: 'Provide rocking chair or wobble cushion; honor as regulation strategy',
    },
    'vocal_stim': {
        stimBehavior: 'Vocal stimming / echolalia',
        biologicalFunction: 'Auditory self-regulation and language processing',
        strengthReframe: 'Uses vocal self-stimulation to process and regulate',
        accommodationSuggestion: 'Provide noise-reducing headphones; allow quiet humming when not disruptive',
    },
    'spinning': {
        stimBehavior: 'Spinning',
        biologicalFunction: 'Vestibular input seeking for regulation',
        strengthReframe: 'Seeks vestibular input independently to maintain regulation',
        accommodationSuggestion: 'Offer spinning chair or designated spinning breaks',
    },
    'chewing': {
        stimBehavior: 'Chewing on objects',
        biologicalFunction: 'Proprioceptive oral input for calming',
        strengthReframe: 'Uses oral-motor strategies for self-regulation',
        accommodationSuggestion: 'Provide chewable jewelry or appropriate oral tools',
    },
    'pacing': {
        stimBehavior: 'Pacing / walking repeatedly',
        biologicalFunction: 'Movement-based thinking and regulation',
        strengthReframe: 'Processes information through movement; demonstrates kinesthetic learning style',
        accommodationSuggestion: 'Allow standing or walking during instruction when possible',
    },
    'finger_flicking': {
        stimBehavior: 'Finger flicking / visual stimming',
        biologicalFunction: 'Visual sensory seeking for regulation',
        strengthReframe: 'Uses visual self-stimulation strategies',
        accommodationSuggestion: 'Provide fidget tools with visual elements; allow when not impacting learning',
    },
};

/**
 * Recognize biological necessity stims and generate strength-based insights
 */
export function recognizeStimAsStrength(
    observedBehavior: string
): BiologicalNecessityInsight | null {
    const normalized = observedBehavior.toLowerCase().trim();

    // Match against known patterns
    for (const [key, insight] of Object.entries(STIM_RECOGNITION)) {
        if (normalized.includes(key.replace(/_/g, ' ')) ||
            normalized.includes(insight.stimBehavior.toLowerCase())) {
            return insight;
        }
    }

    // Check for common alternative descriptions
    if (normalized.includes('flap') || normalized.includes('flapping')) {
        return STIM_RECOGNITION['hand_flapping'];
    }
    if (normalized.includes('rock') || normalized.includes('sway')) {
        return STIM_RECOGNITION['rocking'];
    }
    if (normalized.includes('hum') || normalized.includes('echo') || normalized.includes('repeat')) {
        return STIM_RECOGNITION['vocal_stim'];
    }
    if (normalized.includes('spin') || normalized.includes('twist')) {
        return STIM_RECOGNITION['spinning'];
    }
    if (normalized.includes('chew') || normalized.includes('mouth') || normalized.includes('bite')) {
        return STIM_RECOGNITION['chewing'];
    }
    if (normalized.includes('pace') || normalized.includes('walk') && normalized.includes('back')) {
        return STIM_RECOGNITION['pacing'];
    }

    return null;
}

/**
 * Generate IEP Bridge refraction with stim recognition
 */
export function generateStimStrengthsForIEP(
    observedStims: string[]
): BiologicalNecessityInsight[] {
    return observedStims
        .map(stim => recognizeStimAsStrength(stim))
        .filter((insight): insight is BiologicalNecessityInsight => insight !== null);
}

// ============================================================================
// SYSTEMIC ENTROPY MONITOR: Response Variability Analysis
// ============================================================================

export interface ResponseVariabilityAnalysis {
    biologicalNeed: string;           // e.g., 'boundary_testing', 'regulation_seeking'
    uniqueResponses: string[];        // All different responses used
    responseCount: number;
    entropyScore: number;             // 0-1, higher = more variable (bad)
    consistencyAdvice: string;
    suggestedAnchor?: string;
}

export interface ParentResponseLog {
    response: string;
    biologicalNeed: string;
    timestamp: Date;
    childReaction: 'escalation' | 'neutral' | 'de-escalation';
}

/**
 * Analyze response variability for a specific biological need
 * High entropy = many different responses = cognitive load for child
 */
export function analyzeResponseVariability(
    logs: ParentResponseLog[],
    biologicalNeed: string
): ResponseVariabilityAnalysis {
    // Filter logs for this specific need
    const relevantLogs = logs.filter(log => log.biologicalNeed === biologicalNeed);

    if (relevantLogs.length === 0) {
        return {
            biologicalNeed,
            uniqueResponses: [],
            responseCount: 0,
            entropyScore: 0,
            consistencyAdvice: 'No data yet for this need.',
        };
    }

    // Extract unique responses (normalized)
    const normalizedResponses = relevantLogs.map(log =>
        log.response.toLowerCase().trim().replace(/[.,!?]/g, '')
    );
    const uniqueResponses = [...new Set(normalizedResponses)];

    // Calculate entropy score (ratio of unique to total)
    const entropyScore = Math.min(1, uniqueResponses.length / Math.max(relevantLogs.length, 1));

    // Generate advice based on entropy
    let consistencyAdvice: string;
    let suggestedAnchor: string | undefined;

    if (entropyScore > 0.7) {
        consistencyAdvice = `High variability detected! You've used ${uniqueResponses.length} different responses for this need. Consistency reduces cognitive load. Let's choose one Rhythmic Anchor and practice using it every time.`;
        suggestedAnchor = getSuggestedAnchorForNeed(biologicalNeed);
    } else if (entropyScore > 0.4) {
        consistencyAdvice = `Moderate variability. Consider consolidating to 1-2 anchor phrases for stronger neural pathway building.`;
        suggestedAnchor = getSuggestedAnchorForNeed(biologicalNeed);
    } else {
        consistencyAdvice = `Excellent consistency! Your child's brain can predict your response, which creates safety.`;
    }

    return {
        biologicalNeed,
        uniqueResponses: [...new Set(relevantLogs.map(l => l.response))], // Original case
        responseCount: relevantLogs.length,
        entropyScore,
        consistencyAdvice,
        suggestedAnchor,
    };
}

/**
 * Get Oracle-suggested anchor phrase for a specific biological need
 */
function getSuggestedAnchorForNeed(biologicalNeed: string): string {
    const anchors: Record<string, string> = {
        'boundary_testing': "You know the answer is no, love.",
        'regulation_seeking': "First calm body, then we talk.",
        'attention_seeking': "I see you. I'm right here.",
        'transition_resistance': "In 5 minutes, we will change. I'll give you a warning.",
        'sensory_overwhelm': "Let's find a quiet spot together.",
        'frustration': "This is hard AND you can do hard things.",
        'fatigue': "Your body is telling us it needs rest.",
        'hunger': "Your tummy is talking. Let's get a snack.",
    };

    return anchors[biologicalNeed] || "I'm here with you. Let's figure this out together.";
}

/**
 * Generate consistency intervention when entropy is too high
 */
export function generateConsistencyIntervention(
    logs: ParentResponseLog[],
    parentName: string
): string | null {
    // Group by biological need
    const needGroups = new Map<string, ParentResponseLog[]>();
    for (const log of logs) {
        const existing = needGroups.get(log.biologicalNeed) || [];
        existing.push(log);
        needGroups.set(log.biologicalNeed, existing);
    }

    // Check each need for high entropy
    for (const [need, needLogs] of needGroups) {
        const analysis = analyzeResponseVariability(needLogs, need);

        if (analysis.entropyScore > 0.6 && analysis.responseCount >= 3) {
            return `${parentName}, I notice you've tried ${analysis.uniqueResponses.length} different responses for "${need.replace(/_/g, ' ')}". Consistency reduces cognitive load for your child's brain. Let's revert to one Silly Anchor phrase: "${analysis.suggestedAnchor}"`;
        }
    }

    return null;
}

// ============================================================================
// CONSISTENCY MODE: Short Prompt Generator
// ============================================================================

export interface ShortPrompt {
    original: string;
    shortened: string;
    wordCount: number;
    processingLoad: 'minimal' | 'low' | 'moderate';
}

/**
 * Convert longer instructions into 1-3 word prompts for reduced processing
 */
export function generateShortPrompt(instruction: string): ShortPrompt {
    const shortcuts: Record<string, string> = {
        // Common instructions -> minimal prompts
        'please put your shoes on': 'Shoes on',
        'it is time to brush your teeth': 'Teeth time',
        'we need to go now': 'Time to go',
        'please come here': 'Come here',
        'sit down please': 'Sit',
        'stop running': 'Walking feet',
        'use your inside voice': 'Quiet voice',
        'please clean up your toys': 'Clean up',
        'time for bed': 'Bed time',
        'eat your food': 'Eat',
        'get dressed': 'Get dressed',
        'wash your hands': 'Wash hands',
        'look at me': 'Eyes here',
    };

    const normalized = instruction.toLowerCase().trim();

    // Check for direct match
    if (shortcuts[normalized]) {
        return {
            original: instruction,
            shortened: shortcuts[normalized],
            wordCount: shortcuts[normalized].split(' ').length,
            processingLoad: 'minimal',
        };
    }

    // Try to extract core action
    const words = normalized.split(/\s+/);

    // Remove common filler words
    const fillers = ['please', 'now', 'just', 'can', 'you', 'could', 'would', 'should', 'need', 'to', 'the', 'your', 'a', 'an'];
    const coreWords = words.filter(w => !fillers.includes(w));

    if (coreWords.length <= 3) {
        const shortened = coreWords.join(' ').replace(/^\w/, c => c.toUpperCase());
        return {
            original: instruction,
            shortened,
            wordCount: coreWords.length,
            processingLoad: coreWords.length <= 2 ? 'minimal' : 'low',
        };
    }

    // Take first 2-3 meaningful words
    const shortened = coreWords.slice(0, 3).join(' ').replace(/^\w/, c => c.toUpperCase());
    return {
        original: instruction,
        shortened,
        wordCount: 3,
        processingLoad: 'low',
    };
}

/**
 * Calculate Systemic Stability Score
 * Tracks consistency of parent responses vs. child regulation outcomes
 */
export function calculateSystemicStabilityScore(
    logs: ParentResponseLog[]
): { score: number; trend: 'improving' | 'stable' | 'declining'; insight: string } {
    if (logs.length < 5) {
        return {
            score: 0,
            trend: 'stable',
            insight: 'Need more observations to calculate stability.',
        };
    }

    // Calculate overall entropy across all needs
    const needGroups = new Map<string, ParentResponseLog[]>();
    for (const log of logs) {
        const existing = needGroups.get(log.biologicalNeed) || [];
        existing.push(log);
        needGroups.set(log.biologicalNeed, existing);
    }

    let totalEntropy = 0;
    let needCount = 0;

    for (const [need, needLogs] of needGroups) {
        const analysis = analyzeResponseVariability(needLogs, need);
        totalEntropy += analysis.entropyScore;
        needCount++;
    }

    const avgEntropy = needCount > 0 ? totalEntropy / needCount : 0;

    // Also factor in de-escalation success rate
    const deescalationRate = logs.filter(l => l.childReaction === 'de-escalation').length / logs.length;

    // Stability score: Low entropy + high de-escalation = high stability
    const stabilityScore = ((1 - avgEntropy) * 0.6 + deescalationRate * 0.4) * 5;

    // Calculate trend (compare recent vs older logs)
    const recentLogs = logs.slice(-10);
    const olderLogs = logs.slice(0, Math.max(0, logs.length - 10));

    const recentDeescalation = recentLogs.filter(l => l.childReaction === 'de-escalation').length / recentLogs.length;
    const olderDeescalation = olderLogs.length > 0
        ? olderLogs.filter(l => l.childReaction === 'de-escalation').length / olderLogs.length
        : recentDeescalation;

    let trend: 'improving' | 'stable' | 'declining';
    if (recentDeescalation > olderDeescalation + 0.1) {
        trend = 'improving';
    } else if (recentDeescalation < olderDeescalation - 0.1) {
        trend = 'declining';
    } else {
        trend = 'stable';
    }

    // Generate insight
    let insight: string;
    if (stabilityScore >= 4) {
        insight = 'Excellent systemic stability. Your consistency is creating predictable safety.';
    } else if (stabilityScore >= 3) {
        insight = 'Good stability. Continue building on your anchor phrases.';
    } else if (stabilityScore >= 2) {
        insight = 'Moderate stability. Consider consolidating to fewer, consistent responses.';
    } else {
        insight = 'Building stability. Focus on using the same phrases each time.';
    }

    return {
        score: Math.round(stabilityScore * 10) / 10,
        trend,
        insight,
    };
}

// ============================================================================
// COGNITIVE DEPTH: Agentic Re-Weighting
// ============================================================================

export type CognitiveDepthLevel = 1 | 2 | 3 | 4 | 5;

export interface DepthWeightedResponse {
    content: string;
    depthLevel: CognitiveDepthLevel;
    terminology: Record<string, string>;
}

/**
 * Vocabulary maps for each cognitive depth level
 */
const DEPTH_VOCABULARY: Record<CognitiveDepthLevel, Record<string, string>> = {
    1: {
        // Simple & Clear (5th Grade)
        'regulation': 'calm body',
        'dysregulation': 'big feelings',
        'reciprocity': 'connection',
        'sanctuary': 'safe space',
        'observation': 'note',
        'intervention': 'helping hand',
        'stim': 'self-soothing movement',
        'sensory': 'how things feel',
        'transition': 'changing activities',
        'anchor phrase': 'family saying',
        'IEP': 'school plan',
        'advocacy': 'speaking up for your child',
        'co-regulation': 'calming together',
        'nervous system': 'how your body reacts',
        'polyvagal': 'body\'s safety signals',
        'epigenetic': 'how experiences shape us',
        'recursive': 'repeating pattern',
        'entropy': 'chaos or confusion',
    },
    2: {
        // Simplified
        'regulation': 'self-calming',
        'dysregulation': 'overwhelm',
        'reciprocity': 'give-and-take',
        'sanctuary': 'safe environment',
        'observation': 'observation',
        'intervention': 'support strategy',
        'stim': 'self-stimulating behavior',
        'sensory': 'sensory experience',
        'transition': 'transition',
        'anchor phrase': 'anchor phrase',
        'IEP': 'IEP (school support plan)',
        'advocacy': 'advocacy',
        'co-regulation': 'calming with your child',
        'nervous system': 'nervous system',
        'polyvagal': 'stress response',
        'epigenetic': 'experience-shaped patterns',
        'recursive': 'recurring',
        'entropy': 'inconsistency',
    },
    3: {
        // Professional & Clinical
        'regulation': 'self-regulation',
        'dysregulation': 'dysregulation',
        'reciprocity': 'relational reciprocity',
        'sanctuary': 'therapeutic environment',
        'observation': 'behavioral observation',
        'intervention': 'intervention strategy',
        'stim': 'stimming behavior',
        'sensory': 'sensory processing',
        'transition': 'transition period',
        'anchor phrase': 'rhythmic anchor',
        'IEP': 'Individualized Education Program',
        'advocacy': 'educational advocacy',
        'co-regulation': 'co-regulation',
        'nervous system': 'autonomic nervous system',
        'polyvagal': 'polyvagal theory',
        'epigenetic': 'epigenetic factors',
        'recursive': 'recursive pattern',
        'entropy': 'systemic entropy',
    },
    4: {
        // Advanced Clinical
        'regulation': 'autonomic regulation',
        'dysregulation': 'nervous system dysregulation',
        'reciprocity': 'bidirectional attunement',
        'sanctuary': 'neurodiverse-affirming environment',
        'observation': 'multimodal documentation',
        'intervention': 'evidence-based protocol',
        'stim': 'regulatory stimming',
        'sensory': 'sensory integration',
        'transition': 'state transition',
        'anchor phrase': 'consistency anchor',
        'IEP': 'IEP documentation',
        'advocacy': 'institutional advocacy',
        'co-regulation': 'dyadic regulation',
        'nervous system': 'ANS state',
        'polyvagal': 'polyvagal state',
        'epigenetic': 'epigenetic expression',
        'recursive': 'recursive emergence',
        'entropy': 'response variability',
    },
    5: {
        // Scholarly & Theoretical (PhD Level)
        'regulation': 'polyvagal state modulation',
        'dysregulation': 'allostatic overload / amygdala hijack',
        'reciprocity': 'recursive relational reciprocity',
        'sanctuary': 'epigenetically-resonant holding environment',
        'observation': 'phenomenological witnessing',
        'intervention': 'strength-based refraction',
        'stim': 'biological necessity movement',
        'sensory': 'sensory-motor integration schema',
        'transition': 'phase transition dynamics',
        'anchor phrase': 'systemic entropy reduction phrase',
        'IEP': 'institutional bridge documentation',
        'advocacy': 'dignity-first institutional refraction',
        'co-regulation': 'dyadic consciousness synchronization',
        'nervous system': 'polyvagal ladder position',
        'polyvagal': 'ventral vagal / sympathetic / dorsal state',
        'epigenetic': 'epigenetic consciousness transmission',
        'recursive': 'recursive emergence pattern',
        'entropy': 'systemic response entropy',
    },
};

/**
 * Apply cognitive depth vocabulary to a text response
 */
export function applyDepthVocabulary(
    text: string,
    depthLevel: CognitiveDepthLevel
): string {
    const vocab = DEPTH_VOCABULARY[depthLevel];
    let result = text;

    // Replace terms with depth-appropriate vocabulary
    // Process from longest to shortest to avoid partial replacements
    const sortedTerms = Object.keys(vocab).sort((a, b) => b.length - a.length);

    for (const term of sortedTerms) {
        const replacement = vocab[term];
        // Case-insensitive replacement
        const regex = new RegExp(`\\b${term}\\b`, 'gi');
        result = result.replace(regex, replacement);
    }

    return result;
}

/**
 * Generate depth-appropriate Oracle response
 */
export function generateDepthWeightedOracleResponse(
    baseInsight: string,
    depthLevel: CognitiveDepthLevel,
    context?: { parentName?: string; childName?: string }
): DepthWeightedResponse {
    // Apply vocabulary transformation
    let content = applyDepthVocabulary(baseInsight, depthLevel);

    // Add depth-appropriate opening based on level
    const openings: Record<CognitiveDepthLevel, string> = {
        1: context?.parentName ? `${context.parentName}, here's what I noticed: ` : 'Here\'s what I noticed: ',
        2: 'Based on your observations: ',
        3: 'Analysis indicates: ',
        4: 'Pattern recognition suggests: ',
        5: 'Recursive pattern emergence reveals: ',
    };

    content = openings[depthLevel] + content;

    return {
        content,
        depthLevel,
        terminology: DEPTH_VOCABULARY[depthLevel],
    };
}

/**
 * Get depth-appropriate term for Oracle responses
 */
export function getDepthTerm(
    baseTerm: string,
    depthLevel: CognitiveDepthLevel
): string {
    const vocab = DEPTH_VOCABULARY[depthLevel];
    const lowerTerm = baseTerm.toLowerCase();
    return vocab[lowerTerm] || baseTerm;
}

/**
 * Check user's depth preference before Oracle response
 * Returns adjusted response based on preference
 */
export function checkDepthPreference(
    response: string,
    userDepthPreference: CognitiveDepthLevel
): string {
    // If user prefers simpler language (1-2), simplify complex terms
    if (userDepthPreference <= 2) {
        return simplifyOracleResponse(response, userDepthPreference);
    }

    // If user prefers scholarly language (4-5), enhance with theoretical terms
    if (userDepthPreference >= 4) {
        return enhanceOracleResponse(response, userDepthPreference);
    }

    // Level 3 is professional/clinical - return as-is
    return response;
}

/**
 * Simplify Oracle response for lower depth levels
 */
function simplifyOracleResponse(
    response: string,
    level: CognitiveDepthLevel
): string {
    const simplifications: Record<string, string> = {
        'dysregulation': level === 1 ? 'big feelings' : 'overwhelm',
        'self-regulation': level === 1 ? 'calming down' : 'self-calming',
        'polyvagal': level === 1 ? 'body safety system' : 'stress response',
        'reciprocity': level === 1 ? 'connection' : 'give-and-take',
        'intervention': level === 1 ? 'helping' : 'support',
        'phenomen': level === 1 ? 'experience' : 'observed pattern',
        'epigenetic': level === 1 ? 'experiences that shape us' : 'experience-based',
        'recursive': level === 1 ? 'repeating' : 'recurring',
    };

    let result = response;
    for (const [complex, simple] of Object.entries(simplifications)) {
        const regex = new RegExp(complex, 'gi');
        result = result.replace(regex, simple);
    }

    return result;
}

/**
 * Enhance Oracle response for higher depth levels
 */
function enhanceOracleResponse(
    response: string,
    level: CognitiveDepthLevel
): string {
    const enhancements: Record<string, string> = {
        'calming down': level === 5 ? 'polyvagal state modulation' : 'autonomic regulation',
        'stress': level === 5 ? 'allostatic load' : 'nervous system activation',
        'connection': level === 5 ? 'recursive relational reciprocity' : 'bidirectional attunement',
        'safe space': level === 5 ? 'epigenetically-resonant holding environment' : 'neurodiverse-affirming sanctuary',
        'note': level === 5 ? 'phenomenological witnessing' : 'multimodal observation',
    };

    let result = response;
    for (const [simple, enhanced] of Object.entries(enhancements)) {
        const regex = new RegExp(`\\b${simple}\\b`, 'gi');
        result = result.replace(regex, enhanced);
    }

    return result;
}

// ============================================================================
// AGENTIC VAULT: IEP Cross-Reference & Refraction Notes
// ============================================================================

export interface AgenticIEPGoal {
    id: string;
    goalText: string;
    category: 'behavioral' | 'academic' | 'social' | 'communication' | 'self-care';
    triggers?: string[];
    interventions?: string[];
}

export interface ChosenResponseLog {
    id: string;
    responseEnergy: string;
    trigger: string;
    outcome: 'success' | 'partial' | 'challenge';
    timestamp: Date;
    setting?: string;
}

export interface RefractionNote {
    id: string;
    schoolApproach: string;
    sanctuaryApproach: string;
    evidenceFromHome: string;
    suggestedRefraction: string;
    targetAudience: 'teacher' | 'iep_team' | 'therapist';
    createdAt: Date;
}

/**
 * Cross-reference IEP goals with parent's Chosen Response logs
 * Identifies when school BIP triggers are met but Sanctuary data shows better alternatives
 */
export function crossReferenceIEPWithResponses(
    iepGoals: AgenticIEPGoal[],
    responseLogs: ChosenResponseLog[]
): {
    alignedGoals: { goal: AgenticIEPGoal; supportingLogs: ChosenResponseLog[] }[];
    divergentStrategies: { goal: AgenticIEPGoal; refractionOpportunity: string }[];
} {
    const alignedGoals: { goal: AgenticIEPGoal; supportingLogs: ChosenResponseLog[] }[] = [];
    const divergentStrategies: { goal: AgenticIEPGoal; refractionOpportunity: string }[] = [];

    for (const goal of iepGoals) {
        // Find response logs that relate to this goal's triggers
        const relatedLogs = responseLogs.filter(log => {
            const logTriggerLower = log.trigger.toLowerCase();
            return goal.triggers?.some(t => logTriggerLower.includes(t.toLowerCase())) ||
                goal.goalText.toLowerCase().includes(logTriggerLower);
        });

        if (relatedLogs.length === 0) continue;

        // Calculate success rate from home data
        const successfulLogs = relatedLogs.filter(l => l.outcome === 'success');
        const successRate = successfulLogs.length / relatedLogs.length;

        if (successRate >= 0.7) {
            // High success rate - aligned with IEP goal
            alignedGoals.push({
                goal,
                supportingLogs: relatedLogs,
            });
        } else if (successRate < 0.5 && relatedLogs.length >= 3) {
            // Low success rate with multiple attempts - divergent strategy opportunity
            const mostSuccessfulEnergy = getMostSuccessfulEnergy(relatedLogs);
            divergentStrategies.push({
                goal,
                refractionOpportunity: `The IEP suggests strategies for "${goal.goalText}", but home data shows that "${mostSuccessfulEnergy}" response energy achieves better outcomes. Consider updating the BIP to incorporate this parent-discovered approach.`,
            });
        }
    }

    return { alignedGoals, divergentStrategies };
}

/**
 * Find the most successful response energy from logs
 */
function getMostSuccessfulEnergy(logs: ChosenResponseLog[]): string {
    const energyCounts: Record<string, { success: number; total: number }> = {};

    for (const log of logs) {
        if (!energyCounts[log.responseEnergy]) {
            energyCounts[log.responseEnergy] = { success: 0, total: 0 };
        }
        energyCounts[log.responseEnergy].total++;
        if (log.outcome === 'success') {
            energyCounts[log.responseEnergy].success++;
        }
    }

    let bestEnergy = '';
    let bestRate = 0;

    for (const [energy, counts] of Object.entries(energyCounts)) {
        const rate = counts.success / counts.total;
        if (rate > bestRate) {
            bestRate = rate;
            bestEnergy = energy;
        }
    }

    return bestEnergy.replace(/_/g, ' ');
}

/**
 * Generate a Refraction Note for the teacher/IEP team
 * When school's BIP trigger is met but Sanctuary data shows a better approach
 */
export function generateRefractionNote(
    schoolBIPApproach: string,
    sanctuaryData: ChosenResponseLog[],
    childName: string,
    targetAudience: 'teacher' | 'iep_team' | 'therapist' = 'teacher'
): RefractionNote {
    const successfulApproaches = sanctuaryData.filter(l => l.outcome === 'success');
    const bestApproach = getMostSuccessfulEnergy(successfulApproaches);
    const successRate = Math.round((successfulApproaches.length / sanctuaryData.length) * 100);

    const audiencePrefix: Record<string, string> = {
        'teacher': 'Dear Teacher,',
        'iep_team': 'To the IEP Team,',
        'therapist': 'Dear Therapist,',
    };

    return {
        id: `refraction_${Date.now()}`,
        schoolApproach: schoolBIPApproach,
        sanctuaryApproach: bestApproach,
        evidenceFromHome: `Over ${sanctuaryData.length} documented observations, "${bestApproach}" energy achieved a ${successRate}% success rate with ${childName} at home.`,
        suggestedRefraction: `${audiencePrefix[targetAudience]}\n\nI wanted to share some observations from home that may support ${childName}'s success at school.\n\nThe current BIP suggests: "${schoolBIPApproach}"\n\nAt home, we've found that ${childName} responds particularly well to a "${bestApproach}" approach. In our documented observations (${sanctuaryData.length} entries), this strategy achieved a ${successRate}% de-escalation rate.\n\nWould you be open to trying this approach in similar situations at school? I'd be happy to discuss what's been working for us.\n\nThank you for partnering with us in ${childName}'s journey.\n\nWarmly,\n[Parent Name]`,
        targetAudience,
        createdAt: new Date(),
    };
}

/**
 * Check if BIP trigger is met and suggest refraction
 * Returns Oracle prompt if divergence detected
 */
export function checkBIPDivergence(
    bipTriggers: string[],
    recentObservation: string,
    sanctuaryData: ChosenResponseLog[],
    childName: string
): string | null {
    // Check if observation matches a BIP trigger
    const lowerObs = recentObservation.toLowerCase();
    const matchedTrigger = bipTriggers.find(t => lowerObs.includes(t.toLowerCase()));

    if (!matchedTrigger) return null;

    // Check if sanctuary data shows a different successful approach
    const relatedLogs = sanctuaryData.filter(l =>
        l.trigger.toLowerCase().includes(matchedTrigger.toLowerCase())
    );

    if (relatedLogs.length < 3) return null;

    const successfulLogs = relatedLogs.filter(l => l.outcome === 'success');
    const successRate = successfulLogs.length / relatedLogs.length;

    if (successRate >= 0.6) {
        const bestApproach = getMostSuccessfulEnergy(successfulLogs);
        return `I noticed this observation involves "${matchedTrigger}", which is listed in ${childName}'s BIP. Your Sanctuary data shows that "${bestApproach}" works better at home (${Math.round(successRate * 100)}% success rate). Would you like me to draft a Refraction Note for the teacher?`;
    }

    return null;
}

/**
 * Generate Human Impact Stats for Mission Room
 */
export function generateHumanImpactStats(
    responseLogs: ChosenResponseLog[],
    mirrorMoments: number
): {
    lifeForcePreserved: number;
    intentionalResponses: number;
    refractionNotesGenerated: number;
    avgSuccessRate: number;
    topResponseEnergy: string;
} {
    const successfulLogs = responseLogs.filter(l => l.outcome === 'success');
    const successRate = responseLogs.length > 0
        ? (successfulLogs.length / responseLogs.length) * 100
        : 0;

    // Life Force = (Strength moments + Successful responses) / (Stress events)
    const strengthEvents = successfulLogs.length + mirrorMoments;
    const stressEvents = responseLogs.filter(l => l.outcome === 'challenge').length || 1;
    const lifeForce = Math.round((strengthEvents / stressEvents) * 10) / 10;

    return {
        lifeForcePreserved: lifeForce,
        intentionalResponses: responseLogs.length,
        refractionNotesGenerated: Math.floor(responseLogs.length * 0.1), // ~10% generate notes
        avgSuccessRate: Math.round(successRate),
        topResponseEnergy: getMostSuccessfulEnergy(responseLogs) || 'Calm Presence',
    };
}
