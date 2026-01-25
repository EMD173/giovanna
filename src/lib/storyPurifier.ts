/**
 * Story Purifier: Anonymization and Strength-Based Reframing
 * 
 * Transforms private logs into anonymized, strength-based insights
 * for community sharing.
 */

export interface StoryPurification {
    originalExcerpt: string;
    purifiedVersion: string;
    removedIdentifiers: string[];
    strengthReframe: string;
}

/**
 * Story Purifier: Transform private log into anonymized, strength-based insight
 */
export function purifyStory(privateLog: string, childName?: string): StoryPurification {
    let purified = privateLog;
    const removedIdentifiers: string[] = [];

    // Remove child name if provided
    if (childName) {
        const nameRegex = new RegExp(childName, 'gi');
        if (nameRegex.test(purified)) {
            purified = purified.replace(nameRegex, 'my child');
            removedIdentifiers.push(childName);
        }
    }

    // Remove common identifying patterns
    const identifyingPatterns: [RegExp, string, string][] = [
        [/\b(my son|my daughter|my boy|my girl)\b/gi, 'my child', 'gendered reference'],
        [/\b\d{1,2}[- ]?(year|yr|yo)[s -]?(old)?\b/gi, '', 'age'],
        [/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi, 'one day', 'day name'],
        [/\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/gi, '', 'month name'],
        [/\b(dr\.?\s+\w+|doctor\s+\w+)\b/gi, 'their doctor', 'doctor name'],
        [/\b(\w+\s+elementary|\w+\s+middle|\w+\s+high|\w+\s+school)\b/gi, 'their school', 'school name'],
        [/\b(he|him|his|she|her|hers)\b/gi, 'they', 'pronouns'],
    ];

    for (const [pattern, replacement, type] of identifyingPatterns) {
        if (pattern.test(purified)) {
            purified = purified.replace(pattern, replacement);
            removedIdentifiers.push(type);
        }
    }

    // Clean up extra spaces
    purified = purified.replace(/\s+/g, ' ').trim();

    // Generate strength reframe
    const strengthReframe = generateStrengthReframe(purified);

    return {
        originalExcerpt: privateLog.substring(0, 50) + '...',
        purifiedVersion: purified,
        removedIdentifiers: [...new Set(removedIdentifiers)],
        strengthReframe,
    };
}

/**
 * Generate a strength-based reframe of the narrative
 */
function generateStrengthReframe(content: string): string {
    // Look for deficit language and reframe
    const reframes: [RegExp, string][] = [
        [/couldn't|can't/gi, 'was working on'],
        [/refused|won't/gi, 'needed support to'],
        [/failed|failing/gi, 'is building capacity for'],
        [/struggle|struggling/gi, 'is developing'],
        [/problem|issue/gi, 'communication pattern'],
        [/meltdown/gi, 'intense regulation moment'],
        [/tantrum/gi, 'emotional expression'],
    ];

    let reframed = content;
    let wasReframed = false;

    for (const [pattern, replacement] of reframes) {
        if (pattern.test(reframed)) {
            reframed = reframed.replace(pattern, replacement);
            wasReframed = true;
        }
    }

    return wasReframed
        ? "This story has been reframed through a strength-based lens."
        : "This story already centers strengths and wisdom.";
}
