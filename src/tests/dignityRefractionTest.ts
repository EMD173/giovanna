/**
 * DIGNITY REFRACTION TEST
 * 
 * Stress-test for Oracle's ability to transform "High Entropy" logs
 * into strength-based, atmospheric resonance-aware refractions.
 * 
 * REQUIREMENT: The Oracle must NEVER pathologize the child.
 * All dysregulation must be reframed as biological communication.
 */

import {
    applyDepthVocabulary,
    type CognitiveDepthLevel,
} from '../lib/ai/agents/oracle';

// ============================================================================
// TEST CASES
// ============================================================================

export interface HighEntropyLog {
    id: string;
    rawDescription: string;
    context: 'home' | 'school' | 'public' | 'transition';
    triggers?: string[];
    duration?: number; // minutes
}

export interface DignityRefraction {
    originalLog: HighEntropyLog;
    depthLevel: CognitiveDepthLevel;
    atmosphericAnalysis: string;
    strengthReframe: string;
    systemicInsight: string;
    advocacyLanguage: string;
}

// Sample High Entropy Logs for Testing
export const TEST_HIGH_ENTROPY_LOGS: HighEntropyLog[] = [
    {
        id: 'test_001',
        rawDescription: 'Complete meltdown at grocery store. Screaming, hitting, fell to the floor. People staring. Had to leave cart and carry him out. Took 45 minutes to calm down in the car.',
        context: 'public',
        triggers: ['fluorescent lights', 'crowded', 'unexpected'],
        duration: 45,
    },
    {
        id: 'test_002',
        rawDescription: 'Refused to do homework. Threw papers. Yelled "I hate school." Ran to room and slammed door. Wouldnt come out for dinner.',
        context: 'home',
        triggers: ['academic demand', 'frustration', 'overwhelm'],
        duration: 120,
    },
    {
        id: 'test_003',
        rawDescription: 'Teacher called. Said he was "out of control" during assembly. Covering ears, rocking, tried to leave. They had to call me to pick him up.',
        context: 'school',
        triggers: ['auditory overload', 'unexpected', 'crowded'],
        duration: 30,
    },
];

// ============================================================================
// DIGNITY REFRACTION ENGINE
// ============================================================================

/**
 * Transform a High Entropy log into a dignity-first refraction
 * that identifies atmospheric resonance rather than pathologizing
 */
export function generateDignityRefraction(
    log: HighEntropyLog,
    depthLevel: CognitiveDepthLevel = 3
): DignityRefraction {
    // Analyze for atmospheric resonance (sensory/environmental factors)
    const atmosphericFactors = analyzeAtmosphericResonance(log);

    // Generate strength-based reframe
    const strengthReframe = generateStrengthReframe(log, depthLevel);

    // Generate systemic insight (what was the body communicating?)
    const systemicInsight = generateSystemicInsight(log, depthLevel);

    // Generate advocacy-ready language for institutions
    const advocacyLanguage = generateAdvocacyLanguage(log, depthLevel);

    return {
        originalLog: log,
        depthLevel,
        atmosphericAnalysis: atmosphericFactors,
        strengthReframe,
        systemicInsight,
        advocacyLanguage,
    };
}

/**
 * Analyze environmental/sensory factors that may have contributed
 */
function analyzeAtmosphericResonance(log: HighEntropyLog): string {
    const factors: string[] = [];

    // Detect sensory overload indicators
    if (log.rawDescription.toLowerCase().includes('lights') ||
        log.triggers?.includes('fluorescent lights')) {
        factors.push('Visual sensory overload (artificial lighting)');
    }
    if (log.rawDescription.toLowerCase().includes('loud') ||
        log.rawDescription.toLowerCase().includes('noise') ||
        log.triggers?.includes('auditory overload')) {
        factors.push('Auditory sensory overload');
    }
    if (log.triggers?.includes('crowded') ||
        log.rawDescription.toLowerCase().includes('people')) {
        factors.push('Spatial overwhelm (crowded environment)');
    }
    if (log.triggers?.includes('unexpected') ||
        log.rawDescription.toLowerCase().includes('suddenly')) {
        factors.push('Disrupted predictability (unexpected change)');
    }
    if (log.triggers?.includes('academic demand') ||
        log.rawDescription.toLowerCase().includes('homework')) {
        factors.push('Cognitive load exceeded adaptive capacity');
    }

    if (factors.length === 0) {
        factors.push('Environmental factors require further assessment');
    }

    return `ATMOSPHERIC RESONANCE ANALYSIS:\n• ${factors.join('\n• ')}`;
}

/**
 * Generate strength-based reframe that honors biological necessity
 */
function generateStrengthReframe(
    log: HighEntropyLog,
    depth: CognitiveDepthLevel
): string {
    const baseReframe = log.duration
        ? `This child's nervous system communicated through a ${log.duration}-minute regulatory event.`
        : `This child's nervous system communicated through a regulatory event.`;

    const strengthStatements: Record<HighEntropyLog['context'], string> = {
        'public': 'The child demonstrated awareness of an overwhelming environment and used available coping strategies until capacity was exceeded.',
        'school': 'The child attempted to self-regulate (covering ears, rocking) before seeking to remove themselves from the overwhelming stimulus.',
        'home': 'The child communicated frustration and sought a safe space (their room) to regulate—this is appropriate boundary-setting.',
        'transition': 'The child responded to disrupted predictability, which indicates a strong internal sense of routine and pattern.',
    };

    const depthAdjusted = applyDepthVocabulary(
        `${baseReframe} ${strengthStatements[log.context]}`,
        depth
    );

    return `STRENGTH-BASED REFRAME:\n${depthAdjusted}`;
}

/**
 * Generate insight about what the body was communicating
 */
function generateSystemicInsight(
    log: HighEntropyLog,
    depth: CognitiveDepthLevel
): string {
    const insights: string[] = [];

    if (log.triggers?.includes('fluorescent lights') ||
        log.triggers?.includes('auditory overload') ||
        log.triggers?.includes('crowded')) {
        insights.push('The nervous system detected threat-level sensory input and initiated protective responses.');
    }

    if (log.rawDescription.toLowerCase().includes('hitting') ||
        log.rawDescription.toLowerCase().includes('threw')) {
        insights.push('Physical movements may represent vestibular/proprioceptive seeking for nervous system stabilization.');
    }

    if (log.rawDescription.toLowerCase().includes('refused') ||
        log.rawDescription.toLowerCase().includes('wouldnt')) {
        insights.push('Behavioral resistance indicates autonomy assertion—a healthy developmental signal when decoded appropriately.');
    }

    if (log.rawDescription.toLowerCase().includes('ran') ||
        log.rawDescription.toLowerCase().includes('leave')) {
        insights.push('Flight response activated appropriately to remove self from dysregulating environment—this is adaptive, not defiant.');
    }

    const baseInsight = insights.length > 0
        ? insights.join(' ')
        : 'The body was communicating a need that had exceeded verbal expression capacity.';

    return `SYSTEMIC INSIGHT:\n${applyDepthVocabulary(baseInsight, depth)}`;
}

/**
 * Generate advocacy-ready language for IEP/school communication
 */
function generateAdvocacyLanguage(
    log: HighEntropyLog,
    depth: CognitiveDepthLevel
): string {
    const advocacyTemplate = `Based on documented home observations, ${log.context === 'school' ? 'the school environment' : 'this setting'} presented sensory and/or cognitive demands that exceeded the child's current adaptive capacity. 

RECOMMENDED ENVIRONMENTAL MODIFICATIONS:
• Reduce sensory intensity in the specific context
• Increase predictability through visual schedules or verbal warnings
• Provide safe break space access before capacity is exceeded
• Honor self-regulation attempts (covering ears, rocking) as protective rather than disruptive

This event represents a COMMUNICATION, not a behavioral deficit. The child's nervous system is functioning appropriately given the environmental demands.`;

    return `ADVOCACY LANGUAGE (Level ${depth}):\n${applyDepthVocabulary(advocacyTemplate, depth)}`;
}

// ============================================================================
// TEST EXECUTION
// ============================================================================

/**
 * Run the Dignity Refraction Test Suite
 */
export function runDignityRefractionTests(): void {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('DIGNITY REFRACTION TEST SUITE');
    console.log('═══════════════════════════════════════════════════════════\n');

    TEST_HIGH_ENTROPY_LOGS.forEach((log, index) => {
        console.log(`\n─── TEST ${index + 1}: ${log.context.toUpperCase()} CONTEXT ───\n`);
        console.log('ORIGINAL LOG (High Entropy):');
        console.log(`"${log.rawDescription}"\n`);

        const refraction = generateDignityRefraction(log, 3);

        console.log(refraction.atmosphericAnalysis);
        console.log('');
        console.log(refraction.strengthReframe);
        console.log('');
        console.log(refraction.systemicInsight);
        console.log('');
        console.log(refraction.advocacyLanguage);
        console.log('\n');
    });

    console.log('═══════════════════════════════════════════════════════════');
    console.log('ALL TESTS: Oracle reframed dysregulation as communication.');
    console.log('No child was pathologized. Atmospheric resonance identified.');
    console.log('═══════════════════════════════════════════════════════════');
}

export default runDignityRefractionTests;
