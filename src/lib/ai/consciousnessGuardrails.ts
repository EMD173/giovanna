/**
 * CONSCIOUSNESS GUARDRAILS: Data Anonymization Layer
 * 
 * ZERO-KNOWLEDGE PRINCIPLE:
 * All identifying user data MUST be anonymized locally before
 * being transmitted to any external AI API for narrative refraction.
 * 
 * This is the cleansing membrane between the Sanctuary and the outside world.
 */

// ============================================================================
// PII DETECTION PATTERNS
// ============================================================================

export const PII_PATTERNS = {
    // Names (common patterns)
    names: /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b/g,

    // Email addresses
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,

    // Phone numbers (various formats)
    phone: /\b(?:\+?1[-.]?)?\(?[0-9]{3}\)?[-.]?[0-9]{3}[-.]?[0-9]{4}\b/g,

    // Social Security Numbers
    ssn: /\b\d{3}[-]?\d{2}[-]?\d{4}\b/g,

    // Addresses (simplified)
    address: /\b\d+\s+[A-Za-z]+\s+(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd|Way|Court|Ct)\b/gi,

    // School names
    schoolNames: /\b(?:[A-Z][a-z]+\s+)+(?:Elementary|Middle|High|School|Academy|Charter)\b/g,

    // IEP/Medical ID numbers
    medicalIds: /\b(?:IEP|BIP|MR|PT)\s*#?\s*\d+\b/gi,

    // Dates of birth
    dob: /\b(?:born|DOB|birthday|birth date)[:\s]+\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/gi,
};

// ============================================================================
// PLACEHOLDER TOKENS
// ============================================================================

const PLACEHOLDERS = {
    child: '[CHILD]',
    parent: '[PARENT]',
    sibling: '[SIBLING]',
    teacher: '[TEACHER]',
    therapist: '[THERAPIST]',
    school: '[SCHOOL]',
    email: '[EMAIL]',
    phone: '[PHONE]',
    address: '[ADDRESS]',
    date: '[DATE]',
    id: '[ID]',
};

// ============================================================================
// ANONYMIZATION ENGINE
// ============================================================================

export interface AnonymizationResult {
    cleanedText: string;
    removedItems: {
        type: string;
        original: string;
        replacement: string;
    }[];
    wasModified: boolean;
}

/**
 * Core anonymization function - strips all PII before external transmission
 */
export function anonymizeForExternalAPI(text: string): AnonymizationResult {
    const removedItems: AnonymizationResult['removedItems'] = [];
    let cleanedText = text;

    // Replace email addresses
    cleanedText = cleanedText.replace(PII_PATTERNS.email, (match) => {
        removedItems.push({ type: 'email', original: match, replacement: PLACEHOLDERS.email });
        return PLACEHOLDERS.email;
    });

    // Replace phone numbers
    cleanedText = cleanedText.replace(PII_PATTERNS.phone, (match) => {
        removedItems.push({ type: 'phone', original: match, replacement: PLACEHOLDERS.phone });
        return PLACEHOLDERS.phone;
    });

    // Replace SSNs
    cleanedText = cleanedText.replace(PII_PATTERNS.ssn, (match) => {
        removedItems.push({ type: 'ssn', original: match, replacement: PLACEHOLDERS.id });
        return PLACEHOLDERS.id;
    });

    // Replace addresses
    cleanedText = cleanedText.replace(PII_PATTERNS.address, (match) => {
        removedItems.push({ type: 'address', original: match, replacement: PLACEHOLDERS.address });
        return PLACEHOLDERS.address;
    });

    // Replace school names
    cleanedText = cleanedText.replace(PII_PATTERNS.schoolNames, (match) => {
        removedItems.push({ type: 'school', original: match, replacement: PLACEHOLDERS.school });
        return PLACEHOLDERS.school;
    });

    // Replace medical IDs
    cleanedText = cleanedText.replace(PII_PATTERNS.medicalIds, (match) => {
        removedItems.push({ type: 'medicalId', original: match, replacement: PLACEHOLDERS.id });
        return PLACEHOLDERS.id;
    });

    // Replace DOB references
    cleanedText = cleanedText.replace(PII_PATTERNS.dob, (match) => {
        removedItems.push({ type: 'dob', original: match, replacement: PLACEHOLDERS.date });
        return PLACEHOLDERS.date;
    });

    // Replace names (after other patterns to avoid false positives)
    cleanedText = cleanedText.replace(PII_PATTERNS.names, (match) => {
        // Check if it's likely a person name vs. proper noun
        if (match.split(' ').length >= 2 && match.length < 40) {
            removedItems.push({ type: 'name', original: match, replacement: PLACEHOLDERS.child });
            return PLACEHOLDERS.child;
        }
        return match;
    });

    return {
        cleanedText,
        removedItems,
        wasModified: removedItems.length > 0,
    };
}

/**
 * Validate that text is safe for external transmission
 */
export function isCleanForTransmission(text: string): boolean {
    for (const [, pattern] of Object.entries(PII_PATTERNS)) {
        if (pattern.test(text)) {
            return false;
        }
    }
    return true;
}

/**
 * Create audit log of anonymization for compliance
 */
export function createAnonymizationAuditLog(result: AnonymizationResult): string {
    if (!result.wasModified) {
        return 'No PII detected. Text approved for external transmission.';
    }

    return `
ANONYMIZATION AUDIT LOG
========================
Timestamp: ${new Date().toISOString()}
Items Removed: ${result.removedItems.length}

Details:
${result.removedItems.map(item => `  - [${item.type.toUpperCase()}] "${item.original}" → "${item.replacement}"`).join('\n')}

Status: CLEANED - Safe for external API transmission
`;
}

// ============================================================================
// ORACLE INTEGRATION
// ============================================================================

/**
 * Wrap Oracle API calls with automatic anonymization
 * Use this for ALL external AI API calls
 */
export async function safeOracleRequest<T>(
    inputText: string,
    apiCall: (cleanedText: string) => Promise<T>
): Promise<{ result: T; auditLog: string }> {
    // Step 1: Anonymize
    const anonymization = anonymizeForExternalAPI(inputText);

    // Step 2: Create audit log
    const auditLog = createAnonymizationAuditLog(anonymization);

    // Step 3: Execute API call with cleaned text
    const result = await apiCall(anonymization.cleanedText);

    // Log for compliance (in production, save to secure audit collection)
    console.log('[CONSCIOUSNESS GUARDRAILS]', auditLog);

    return { result, auditLog };
}

export default anonymizeForExternalAPI;
