/**
 * AGENTIC DOCUMENTER: Talk-to-Text Refraction Engine
 * 
 * Takes raw audio/text input and refracts it into:
 * - Version A: Parent's Long-form Reflection (Sacred)
 * - Version B: Structured Legal/Social Service Report (Professional)
 * 
 * Configurable 'Organization Style' for different professional contexts.
 */

import type { Observation } from '../../../core/stores/types';
import type { UserProfile } from '../../../core/stores/profileTypes';

/**
 * Organization Style Configuration
 * Determines the format and tone of professional documentation
 */
export type OrganizationStyle =
    | 'Social Services'
    | 'Foster Care Agency'
    | 'Adoption Agency'
    | 'Medical Provider'
    | 'School District'
    | 'Legal/Court'
    | 'Therapy Provider';

/**
 * Refracted Output Structure
 */
export interface RefractedDocument {
    id: string;
    sourceType: 'audio' | 'text';
    rawInput: string;
    timestamp: Date;

    // Version A: Sacred (Parent's Voice)
    sacredReflection: {
        title: string;
        content: string;
        emotionalTone: string;
        keyInsights: string[];
    };

    // Version B: Professional (Configurable)
    professionalReport: {
        organizationStyle: OrganizationStyle;
        summary: string;
        observations: string[];
        recommendations: string[];
        contextualFactors: string[];
        strengthsIdentified: string[];
        supportsNeeded: string[];
    };

    // Metadata
    childName: string;
    parentTitle: string;
}

/**
 * Documenter System Prompt
 */
export const DOCUMENTER_SYSTEM_PROMPT = `You are the Documenter — an agentic assistant that transforms raw parent observations into two distinct outputs.

## YOUR DUAL PURPOSE

1. **Sacred Reflection (Version A)**: Preserve the parent's authentic voice. Expand their raw thoughts into a flowing, long-form narrative that honors their experience as the primary witness.

2. **Professional Report (Version B)**: Translate the same content into structured, strength-based documentation suitable for professional contexts (social services, schools, medical providers).

## CORE PRINCIPLES

- **Deficit-to-Dignity**: Never use deficit language. Transform all "problem behaviors" into communications.
- **Parent as Expert**: The parent's observations are primary data, not interpretations to be corrected.
- **Context-Aware**: Adjust professional tone based on Organization Style while maintaining dignity.

## SACRED REFLECTION GUIDELINES

- Write in second person ("You witnessed...")
- Use poetic, reflective language
- Honor the emotional weight of caregiving
- Extract key insights without clinical reduction

## PROFESSIONAL REPORT GUIDELINES

- Use clear, structured formatting
- Lead with strengths, not deficits
- Translate behaviors into needs
- Include specific, actionable supports
- Follow organization-specific conventions
`;

/**
 * Refract raw input into dual outputs
 */
export async function refractDocumentation(
    rawInput: string,
    profile: UserProfile,
    organizationStyle: OrganizationStyle,
    observations?: Observation[]
): Promise<RefractedDocument> {
    const childName = profile.childName;
    const parentTitle = profile.parent?.title || 'Parent';

    // Generate Sacred Reflection
    const sacredReflection = generateSacredReflection(rawInput, childName, parentTitle);

    // Generate Professional Report
    const professionalReport = generateProfessionalReport(
        rawInput,
        childName,
        organizationStyle,
        observations
    );

    return {
        id: `doc-${Date.now()}`,
        sourceType: 'text',
        rawInput,
        timestamp: new Date(),
        sacredReflection,
        professionalReport,
        childName,
        parentTitle,
    };
}

/**
 * Generate Sacred Reflection (Version A)
 * Preserves parent's authentic voice in long-form narrative
 */
function generateSacredReflection(
    rawInput: string,
    childName: string,
    parentTitle: string
): RefractedDocument['sacredReflection'] {
    // Extract emotional indicators
    const emotionalKeywords = {
        joy: ['happy', 'laughed', 'smiled', 'joy', 'excited', 'proud'],
        struggle: ['hard', 'difficult', 'frustrated', 'tired', 'overwhelmed', 'crying'],
        connection: ['together', 'looked at me', 'held', 'shared', 'connected'],
        growth: ['first time', 'new', 'learned', 'tried', 'progress'],
    };

    let emotionalTone = 'reflective';
    for (const [emotion, keywords] of Object.entries(emotionalKeywords)) {
        if (keywords.some(k => rawInput.toLowerCase().includes(k))) {
            emotionalTone = emotion;
            break;
        }
    }

    // Generate expanded narrative
    const content = `${parentTitle}, you documented a moment with ${childName}.

${expandToReflection(rawInput, childName)}

This witnessing matters. Not because it changes anything immediately, but because it creates a record of presence — proof that ${childName} is seen, known, and held in your awareness.

What you observed today becomes part of ${childName}'s story. A story written not by institutions, but by the one who knows them most intimately.`;

    // Extract key insights
    const keyInsights = extractKeyInsights(rawInput, childName);

    return {
        title: `Reflection on ${childName}: ${new Date().toLocaleDateString()}`,
        content,
        emotionalTone,
        keyInsights,
    };
}

/**
 * Generate Professional Report (Version B)
 */
function generateProfessionalReport(
    rawInput: string,
    childName: string,
    organizationStyle: OrganizationStyle,
    observations?: Observation[]
): RefractedDocument['professionalReport'] {
    // Parse input for structured extraction
    const summary = generateProfessionalSummary(rawInput, childName, organizationStyle);
    const observationsList = extractObservations(rawInput, childName);
    const strengths = extractStrengths(rawInput, childName);
    const supports = identifySupports(rawInput);
    const recommendations = generateRecommendations(rawInput, organizationStyle);
    const context = extractContextualFactors(rawInput, observations);

    return {
        organizationStyle,
        summary,
        observations: observationsList,
        recommendations,
        contextualFactors: context,
        strengthsIdentified: strengths,
        supportsNeeded: supports,
    };
}

/**
 * Expand raw input to reflective narrative
 */
function expandToReflection(rawInput: string, childName: string): string {
    // Simple expansion logic - in production, this would use AI
    const sentences = rawInput.split(/[.!?]+/).filter(Boolean);

    return sentences.map(sentence => {
        const trimmed = sentence.trim();
        if (!trimmed) return '';

        // Add reflective framing
        if (trimmed.toLowerCase().includes('struggle') || trimmed.toLowerCase().includes('hard')) {
            return `You witnessed ${childName} navigating challenge: ${trimmed}. This is not failure — this is the nervous system communicating a need.`;
        }

        if (trimmed.toLowerCase().includes('happy') || trimmed.toLowerCase().includes('joy')) {
            return `There was joy in this moment: ${trimmed}. These golden threads are the evidence of connection.`;
        }

        return `You observed: ${trimmed}. Every detail you notice is data that only a parent can gather.`;
    }).join('\n\n');
}

/**
 * Extract key insights from raw input
 */
function extractKeyInsights(rawInput: string, childName: string): string[] {
    const insights: string[] = [];

    if (rawInput.toLowerCase().includes('first time')) {
        insights.push(`${childName} demonstrated new capacity or skill`);
    }
    if (rawInput.toLowerCase().includes('calm') || rawInput.toLowerCase().includes('regulated')) {
        insights.push('Successful regulation observed');
    }
    if (rawInput.toLowerCase().includes('trigger') || rawInput.toLowerCase().includes('upset')) {
        insights.push('Regulation trigger identified for future reference');
    }
    if (rawInput.toLowerCase().includes('connect') || rawInput.toLowerCase().includes('together')) {
        insights.push('Moment of relational connection documented');
    }

    if (insights.length === 0) {
        insights.push('Observation captured for pattern tracking');
    }

    return insights;
}

/**
 * Generate professional summary based on organization style
 */
function generateProfessionalSummary(
    _rawInput: string,
    childName: string,
    style: OrganizationStyle
): string {
    const styleIntros: Record<OrganizationStyle, string> = {
        'Social Services': `Documentation submitted for ${childName}. The following parent-reported observation provides insight into the child's daily functioning and support needs.`,
        'Foster Care Agency': `Transition documentation for ${childName}. Parent observations indicate the following patterns and preferences to support placement continuity.`,
        'Adoption Agency': `Child profile documentation for ${childName}. The following reflects authentic parent knowledge essential for matching and transition planning.`,
        'Medical Provider': `Caregiver report for ${childName}. Parent-observed behaviors and patterns are documented below to inform clinical care.`,
        'School District': `Parent communication regarding ${childName}. The following observations may inform educational planning and support strategies.`,
        'Legal/Court': `Documented observation regarding ${childName}. This record reflects caregiver observations during the specified date/time.`,
        'Therapy Provider': `Session preparation notes for ${childName}. Caregiver observations between sessions are documented below.`,
    };

    return styleIntros[style] || `Documentation for ${childName}.`;
}

/**
 * Extract observations in professional format
 */
function extractObservations(rawInput: string, childName: string): string[] {
    const sentences = rawInput.split(/[.!?]+/).filter(Boolean);
    return sentences.map(s => `${childName} ${translateToStrengthBased(s.trim())}`);
}

/**
 * Extract identified strengths
 */
function extractStrengths(rawInput: string, _childName: string): string[] {
    const strengths: string[] = [];
    const input = rawInput.toLowerCase();

    if (input.includes('calm')) strengths.push('Demonstrates self-regulation capacity');
    if (input.includes('creative') || input.includes('built') || input.includes('made')) {
        strengths.push('Shows creative problem-solving');
    }
    if (input.includes('helped') || input.includes('shared')) {
        strengths.push('Displays prosocial behaviors');
    }
    if (input.includes('tried') || input.includes('attempt')) {
        strengths.push('Shows persistence and effort');
    }
    if (input.includes('communicate') || input.includes('told') || input.includes('said')) {
        strengths.push('Engages in functional communication');
    }

    if (strengths.length === 0) {
        strengths.push('Continues to develop coping strategies');
    }

    return strengths;
}

/**
 * Identify supports needed
 */
function identifySupports(rawInput: string): string[] {
    const supports: string[] = [];
    const input = rawInput.toLowerCase();

    if (input.includes('transition') || input.includes('change')) {
        supports.push('Transition warnings and preparation time');
    }
    if (input.includes('sensory') || input.includes('loud') || input.includes('bright')) {
        supports.push('Sensory-friendly environment modifications');
    }
    if (input.includes('overwhelm') || input.includes('meltdown')) {
        supports.push('Access to quiet space for regulation');
    }
    if (input.includes('sleep') || input.includes('tired')) {
        supports.push('Rest and energy management support');
    }

    return supports;
}

/**
 * Generate recommendations based on organization style
 */
function generateRecommendations(
    _rawInput: string,
    style: OrganizationStyle
): string[] {
    const baseRecommendations = [
        'Continue caregiver documentation of daily patterns',
        'Maintain consistent routines and predictable environments',
    ];

    const styleSpecific: Partial<Record<OrganizationStyle, string[]>> = {
        'Foster Care Agency': [
            'Provide transition object from previous placement',
            'Schedule gradual introductions to new caregivers',
        ],
        'School District': [
            'Consider sensory accommodations in classroom setting',
            'Maintain home-school communication log',
        ],
        'Medical Provider': [
            'Monitor for patterns related to medication timing',
            'Screen for sensory processing considerations',
        ],
    };

    return [...baseRecommendations, ...(styleSpecific[style] || [])];
}

/**
 * Extract contextual factors
 */
function extractContextualFactors(
    _rawInput: string,
    observations?: Observation[]
): string[] {
    const factors: string[] = [];

    // Time-based context
    const hour = new Date().getHours();
    if (hour < 12) factors.push('Observation occurred during morning hours');
    else if (hour < 17) factors.push('Observation occurred during afternoon hours');
    else factors.push('Observation occurred during evening hours');

    // Historical context from observations
    if (observations && observations.length > 0) {
        const avgReciprocity = observations.reduce((s, o) => s + o.relationalReciprocity, 0) / observations.length;
        if (avgReciprocity >= 4) {
            factors.push('Recent pattern shows strong caregiver-child connection');
        } else if (avgReciprocity < 2.5) {
            factors.push('Recent pattern indicates increased support needs');
        }
    }

    return factors;
}

/**
 * Translate behavior descriptions to strength-based language
 */
function translateToStrengthBased(text: string): string {
    const translations: Record<string, string> = {
        'had a meltdown': 'experienced nervous system overwhelm and needed co-regulation',
        'threw': 'communicated distress through physical expression',
        'refused': 'signaled a boundary or need for different support',
        'screamed': 'vocalized intense emotional experience',
        'hit': 'communicated through body when verbal capacity was exceeded',
        'ran away': 'sought safety or space through body movement',
        "wouldn't": 'indicated a barrier to engagement',
        "can't": 'is developing capacity with appropriate support',
    };

    let result = text.toLowerCase();
    for (const [deficit, dignity] of Object.entries(translations)) {
        result = result.replace(new RegExp(deficit, 'gi'), dignity);
    }

    return result;
}

/**
 * Format output for display
 */
export function formatForDisplay(doc: RefractedDocument): {
    sacred: string;
    professional: string;
} {
    const sacred = `# ${doc.sacredReflection.title}

${doc.sacredReflection.content}

---
*Emotional Tone: ${doc.sacredReflection.emotionalTone}*
*Key Insights: ${doc.sacredReflection.keyInsights.join(', ')}*`;

    const professional = `# Professional Documentation

**Subject:** ${doc.childName}
**Date:** ${doc.timestamp.toLocaleDateString()}
**Organization Style:** ${doc.professionalReport.organizationStyle}

## Summary
${doc.professionalReport.summary}

## Observations
${doc.professionalReport.observations.map(o => `- ${o}`).join('\n')}

## Strengths Identified
${doc.professionalReport.strengthsIdentified.map(s => `- ${s}`).join('\n')}

## Supports Needed
${doc.professionalReport.supportsNeeded.length > 0
            ? doc.professionalReport.supportsNeeded.map(s => `- ${s}`).join('\n')
            : '- Ongoing monitoring and support continuity'}

## Recommendations
${doc.professionalReport.recommendations.map(r => `- ${r}`).join('\n')}

## Contextual Factors
${doc.professionalReport.contextualFactors.map(c => `- ${c}`).join('\n')}

---
*Documentation generated from caregiver observation. Parent expertise is primary data source.*`;

    return { sacred, professional };
}
