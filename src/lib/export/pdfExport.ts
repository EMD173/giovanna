/**
 * PDF EXPORT SERVICE: Professional Documentation Generator
 *
 * Transforms parent observations into dignity-centered PDF documents
 * suitable for sharing with schools, medical providers, and care teams.
 *
 * All output uses strength-based language - no deficit framing.
 */

import { jsPDF } from 'jspdf';
import type { Observation, ResonanceChannel } from '../../core/stores/types';
import type { UserProfile } from '../../core/stores/profileTypes';
import type { ProgressReport, SkillProgressSummary } from '../progress/progressAnalytics';

/**
 * Document template types for different professional contexts
 */
export type DocumentTemplate =
    | 'school'      // IEP meetings, teacher communication
    | 'medical'     // Doctor visits, therapy updates
    | 'therapy'     // Behavioral/OT/Speech providers
    | 'legal'       // Court, custody, advocacy
    | 'careTeam'    // General care team sharing
    | 'personal';   // Parent's own records

/**
 * Export options configuration
 */
export interface ExportOptions {
    template: DocumentTemplate;
    includeRecommendations: boolean;
    includeStrengths: boolean;
    includeSupports: boolean;
    childName: string;
    parentTitle: string;
    dateRange?: { start: Date; end: Date };
}

/**
 * Colors matching the Liquid Glass design system
 */
const COLORS = {
    regalPurple: '#4B0082',
    gold: '#D4AF37',
    textPrimary: '#1A1A1A',
    textSecondary: '#666666',
    warmCream: '#FDF8F3',
    borderLight: '#E5E5E5',
};

/**
 * Channel descriptions for professional contexts
 */
const CHANNEL_DESCRIPTIONS: Record<ResonanceChannel, string> = {
    'Seeking Safety': 'Child communicated a need for security and predictability',
    'Sensory Need': 'Child expressed sensory processing requirements',
    'Connection Bid': 'Child initiated relational connection with caregiver',
    'Transition Signal': 'Child communicated about environmental or routine changes',
    'Body Wisdom': 'Child demonstrated physical self-regulation strategies',
    'Joy Expression': 'Child displayed positive emotional engagement',
};

/**
 * Template-specific headers and introductions
 */
const TEMPLATE_CONFIG: Record<DocumentTemplate, {
    title: string;
    introduction: string;
    footer: string;
}> = {
    school: {
        title: 'Parent Observation Report',
        introduction: 'The following parent-documented observations provide insight into the child\'s daily functioning, communication patterns, and support needs. This information is shared to support educational planning and collaborative care.',
        footer: 'Documentation reflects caregiver observations. Parent expertise is a primary data source for understanding the whole child.',
    },
    medical: {
        title: 'Caregiver Observation Summary',
        introduction: 'This report documents parent-observed behaviors, patterns, and communication signals observed in the home environment. These observations may inform clinical care and treatment planning.',
        footer: 'Parent observations documented using the Giovanna therapeutic intelligence platform.',
    },
    therapy: {
        title: 'Between-Session Observation Notes',
        introduction: 'The following observations were documented by the primary caregiver between therapy sessions. They represent real-world functioning and may inform treatment goals.',
        footer: 'Observations captured in natural environment by primary caregiver.',
    },
    legal: {
        title: 'Documented Caregiver Observations',
        introduction: 'This document contains timestamped observations recorded by the child\'s primary caregiver. All entries are contemporaneous records of the child\'s daily experiences and needs.',
        footer: 'Records generated from Giovanna - a secure, privacy-first documentation platform.',
    },
    careTeam: {
        title: 'Care Team Update',
        introduction: 'Sharing recent observations to keep our care team informed about our child\'s current patterns, wins, and support needs.',
        footer: 'Shared with care team members as part of collaborative support.',
    },
    personal: {
        title: 'Personal Observation Journal',
        introduction: 'A record of witnessed moments, captured with love and intention.',
        footer: 'Your witnessing matters. These moments tell the story of your child\'s journey.',
    },
};

/**
 * Generate a PDF for a single observation
 */
export function generateSingleObservationPDF(
    observation: Observation,
    profile: UserProfile | null,
    template: DocumentTemplate = 'careTeam'
): jsPDF {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    const config = TEMPLATE_CONFIG[template];
    const childName = profile?.childName || 'Child';
    const parentTitle = profile?.parent?.title || 'Parent';
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let y = margin;

    // Header
    doc.setFillColor(COLORS.regalPurple);
    doc.rect(0, 0, pageWidth, 35, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(config.title, margin, 15);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Child: ${childName}`, margin, 23);
    doc.text(`Date: ${formatDate(observation.timestamp?.toDate?.() || new Date())}`, margin, 29);

    y = 45;

    // Introduction
    doc.setTextColor(COLORS.textSecondary);
    doc.setFontSize(9);
    const introLines = doc.splitTextToSize(config.introduction, contentWidth);
    doc.text(introLines, margin, y);
    y += introLines.length * 4 + 8;

    // Divider
    doc.setDrawColor(COLORS.borderLight);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // Observation Content
    doc.setTextColor(COLORS.textPrimary);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Observation', margin, y);
    y += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    const narrativeLines = doc.splitTextToSize(observation.strengthNarrative || 'No narrative recorded.', contentWidth);
    doc.text(narrativeLines, margin, y);
    y += narrativeLines.length * 5 + 10;

    // Communication Channels
    if (observation.channels && observation.channels.length > 0) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Communication Channels Observed', margin, y);
        y += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        for (const channel of observation.channels) {
            doc.setTextColor(COLORS.regalPurple);
            doc.text(`• ${channel}`, margin + 2, y);
            y += 5;
            doc.setTextColor(COLORS.textSecondary);
            const desc = doc.splitTextToSize(CHANNEL_DESCRIPTIONS[channel], contentWidth - 10);
            doc.text(desc, margin + 6, y);
            y += desc.length * 4 + 3;
        }
        y += 5;
    }

    // Environmental Context
    if (observation.atmosphericResonance) {
        doc.setTextColor(COLORS.textPrimary);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Environmental Context', margin, y);
        y += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const envLines = doc.splitTextToSize(observation.atmosphericResonance, contentWidth);
        doc.text(envLines, margin, y);
        y += envLines.length * 4 + 10;
    }

    // Connection Quality
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Relational Connection', margin, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const reciprocityDesc = getReciprocityDescription(observation.relationalReciprocity);
    doc.text(`Level: ${observation.relationalReciprocity}/5 - ${reciprocityDesc}`, margin, y);
    y += 8;

    // Biological Needs
    if (observation.biologicalNeeds) {
        y += 5;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Physical/Sensory State', margin, y);
        y += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const bioLines = doc.splitTextToSize(observation.biologicalNeeds, contentWidth);
        doc.text(bioLines, margin, y);
        y += bioLines.length * 4 + 10;
    }

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 20;
    doc.setDrawColor(COLORS.borderLight);
    doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

    doc.setFontSize(8);
    doc.setTextColor(COLORS.textSecondary);
    const footerLines = doc.splitTextToSize(config.footer, contentWidth);
    doc.text(footerLines, margin, footerY);

    doc.setTextColor(COLORS.gold);
    doc.text(`Documented by ${parentTitle} | Giovanna Sovereign Healing`, margin, footerY + 8);

    return doc;
}

/**
 * Generate a summary PDF for multiple observations
 */
export function generateSummaryPDF(
    observations: Observation[],
    _profile: UserProfile | null,
    options: ExportOptions
): jsPDF {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    const config = TEMPLATE_CONFIG[options.template];
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let y = margin;

    // Header
    doc.setFillColor(COLORS.regalPurple);
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(`${options.childName}'s Observation Summary`, margin, 18);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    const dateRangeText = options.dateRange
        ? `${formatDate(options.dateRange.start)} - ${formatDate(options.dateRange.end)}`
        : `Last ${observations.length} observations`;
    doc.text(dateRangeText, margin, 28);
    doc.text(`Prepared for: ${getTemplateAudience(options.template)}`, margin, 35);

    y = 50;

    // Introduction
    doc.setTextColor(COLORS.textSecondary);
    doc.setFontSize(9);
    const introLines = doc.splitTextToSize(config.introduction, contentWidth);
    doc.text(introLines, margin, y);
    y += introLines.length * 4 + 10;

    // Summary Statistics
    doc.setFillColor(COLORS.warmCream);
    doc.roundedRect(margin, y, contentWidth, 30, 3, 3, 'F');

    doc.setTextColor(COLORS.textPrimary);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary at a Glance', margin + 5, y + 8);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const avgReciprocity = observations.reduce((sum, o) => sum + o.relationalReciprocity, 0) / observations.length;
    const channelCounts = countChannels(observations);
    const topChannels = Object.entries(channelCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([channel]) => channel);

    doc.text(`Total Observations: ${observations.length}`, margin + 5, y + 16);
    doc.text(`Average Connection: ${avgReciprocity.toFixed(1)}/5`, margin + 5, y + 22);
    doc.text(`Primary Patterns: ${topChannels.join(', ') || 'Varied'}`, margin + 80, y + 16);

    y += 40;

    // Strengths Identified
    if (options.includeStrengths) {
        doc.setTextColor(COLORS.textPrimary);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Strengths Demonstrated', margin, y);
        y += 8;

        const strengths = extractStrengthsFromObservations(observations, options.childName);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        for (const strength of strengths.slice(0, 5)) {
            if (y > pageHeight - 40) {
                doc.addPage();
                y = margin;
            }
            doc.setTextColor(COLORS.gold);
            doc.text('✓', margin, y);
            doc.setTextColor(COLORS.textPrimary);
            doc.text(strength, margin + 6, y);
            y += 6;
        }
        y += 10;
    }

    // Support Needs
    if (options.includeSupports) {
        if (y > pageHeight - 60) {
            doc.addPage();
            y = margin;
        }

        doc.setTextColor(COLORS.textPrimary);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Support Strategies That Help', margin, y);
        y += 8;

        const supports = extractSupportsFromObservations(observations);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        for (const support of supports.slice(0, 5)) {
            if (y > pageHeight - 40) {
                doc.addPage();
                y = margin;
            }
            doc.text(`• ${support}`, margin + 2, y);
            y += 6;
        }
        y += 10;
    }

    // Individual Observations
    doc.setTextColor(COLORS.textPrimary);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Detailed Observations', margin, y);
    y += 10;

    for (const [index, obs] of observations.entries()) {
        if (y > pageHeight - 50) {
            doc.addPage();
            y = margin;
        }

        // Observation card
        doc.setDrawColor(COLORS.borderLight);
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(margin, y, contentWidth, 35, 2, 2, 'FD');

        doc.setFontSize(9);
        doc.setTextColor(COLORS.regalPurple);
        doc.setFont('helvetica', 'bold');
        const obsDate = formatDate(obs.timestamp?.toDate?.() || new Date());
        doc.text(`${index + 1}. ${obsDate}`, margin + 3, y + 6);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(COLORS.textPrimary);
        doc.setFontSize(9);
        const shortNarrative = truncateText(obs.strengthNarrative || 'No details', 150);
        const narLines = doc.splitTextToSize(shortNarrative, contentWidth - 10);
        doc.text(narLines, margin + 3, y + 13);

        doc.setTextColor(COLORS.textSecondary);
        doc.setFontSize(8);
        const channels = obs.channels?.slice(0, 2).join(', ') || 'General';
        doc.text(`Channels: ${channels} | Connection: ${obs.relationalReciprocity}/5`, margin + 3, y + 30);

        y += 40;
    }

    // Footer on last page
    addFooter(doc, config.footer, options.parentTitle);

    return doc;
}

/**
 * Generate a child profile PDF (for care transitions)
 */
export function generateProfilePDF(
    profile: UserProfile,
    observations: Observation[]
): jsPDF {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let y = margin;

    const childName = profile.childName || 'Child';
    const parentTitle = profile.parent?.title || 'Parent';

    // Cover Header
    doc.setFillColor(COLORS.regalPurple);
    doc.rect(0, 0, pageWidth, 50, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(`Meet ${childName}`, margin, 25);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('A Strength-Based Profile', margin, 35);
    doc.text(`Prepared by ${parentTitle}`, margin, 43);

    y = 60;

    // Introduction
    doc.setTextColor(COLORS.textPrimary);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'italic');
    const intro = `This profile captures ${childName} as seen through the eyes of the person who knows them best - their parent. It is designed to help anyone supporting ${childName} understand not just their needs, but their strengths, joys, and the strategies that help them thrive.`;
    const introLines = doc.splitTextToSize(intro, contentWidth);
    doc.text(introLines, margin, y);
    y += introLines.length * 5 + 15;

    // Basic Info
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('About ' + childName, margin, y);
    y += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    if (profile.childAge) {
        doc.text(`Age: ${profile.childAge}`, margin, y);
        y += 6;
    }

    if (profile.systemicContext?.schoolName) {
        doc.text(`School: ${profile.systemicContext.schoolName}`, margin, y);
        y += 6;
    }

    if (profile.systemicContext?.gradeLevel) {
        doc.text(`Grade: ${profile.systemicContext.gradeLevel}`, margin, y);
        y += 6;
    }

    y += 10;

    // Sensory Profile
    if (profile.biologicalContext?.sensoryProfile) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('Sensory Profile', margin, y);
        y += 8;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);

        const sensory = profile.biologicalContext.sensoryProfile;
        if (sensory.seekers?.length > 0) {
            doc.setTextColor(COLORS.gold);
            doc.text('Seeks:', margin, y);
            doc.setTextColor(COLORS.textPrimary);
            doc.text(sensory.seekers.join(', '), margin + 20, y);
            y += 6;
        }

        if (sensory.avoiders?.length > 0) {
            doc.setTextColor(COLORS.regalPurple);
            doc.text('Avoids:', margin, y);
            doc.setTextColor(COLORS.textPrimary);
            doc.text(sensory.avoiders.join(', '), margin + 20, y);
            y += 6;
        }

        y += 10;
    }

    // Regulation Strategies
    if (profile.biologicalContext?.regulationStrategies?.length) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(COLORS.textPrimary);
        doc.text('What Helps Them Regulate', margin, y);
        y += 8;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        for (const strategy of profile.biologicalContext.regulationStrategies) {
            doc.text(`• ${strategy}`, margin + 2, y);
            y += 6;
        }
        y += 10;
    }

    // Pattern Analysis from Observations
    if (observations.length > 0) {
        const channelCounts = countChannels(observations);
        const topChannels = Object.entries(channelCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('Communication Patterns (from recent observations)', margin, y);
        y += 8;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        for (const [channel, count] of topChannels) {
            doc.text(`• ${channel}: observed ${count} times`, margin + 2, y);
            y += 6;
        }
        y += 10;
    }

    // Parent's Voice
    if (profile.passport?.sacredSummary) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text("In Their Parent's Words", margin, y);
        y += 8;

        doc.setFont('helvetica', 'italic');
        doc.setFontSize(10);
        const summaryLines = doc.splitTextToSize(`"${profile.passport.sacredSummary}"`, contentWidth);
        doc.text(summaryLines, margin, y);
        y += summaryLines.length * 5 + 10;
    }

    // Footer
    addFooter(doc, `Profile prepared with love by ${parentTitle}. ${childName} is more than any document can capture.`, parentTitle);

    return doc;
}

/**
 * Generate a progress report PDF
 */
export function generateProgressReportPDF(
    report: ProgressReport,
    template: 'therapist' | 'school' | 'personal' = 'personal'
): jsPDF {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let y = margin;

    const templateConfig = {
        therapist: {
            title: 'Progress Report for Therapy Provider',
            intro: 'This report summarizes the child\'s progress based on parent observations and skill tracking. It is designed to inform therapy goals and treatment planning.',
        },
        school: {
            title: 'Progress Report for Educational Team',
            intro: 'This report documents the child\'s developmental progress as observed by their primary caregiver. It is shared to support educational planning and IEP meetings.',
        },
        personal: {
            title: 'Progress Report',
            intro: 'A summary of growth and achievements during this period.',
        },
    };

    const config = templateConfig[template];

    // Header
    doc.setFillColor(COLORS.regalPurple);
    doc.rect(0, 0, pageWidth, 45, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(config.title, margin, 18);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Child: ${report.childName}`, margin, 28);
    doc.text(`Period: ${report.period.label}`, margin, 35);
    doc.text(`Generated: ${formatDate(report.generatedAt)}`, margin, 42);

    y = 55;

    // Introduction
    doc.setTextColor(COLORS.textSecondary);
    doc.setFontSize(9);
    const introLines = doc.splitTextToSize(config.intro, contentWidth);
    doc.text(introLines, margin, y);
    y += introLines.length * 4 + 8;

    // Divider
    doc.setDrawColor(COLORS.borderLight);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // Summary Section
    doc.setTextColor(COLORS.textPrimary);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary', margin, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const summaryLines = doc.splitTextToSize(report.narrativeSummary, contentWidth);
    doc.text(summaryLines, margin, y);
    y += summaryLines.length * 4 + 10;

    // Celebrations Section
    if (report.celebrationPoints.length > 0) {
        y = checkPageBreak(doc, y, 40);

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(COLORS.gold);
        doc.text('Celebrations', margin, y);
        y += 7;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(COLORS.textPrimary);
        for (const celebration of report.celebrationPoints) {
            const celebLines = doc.splitTextToSize(`★ ${celebration}`, contentWidth - 5);
            doc.text(celebLines, margin + 2, y);
            y += celebLines.length * 4 + 3;
        }
        y += 5;
    }

    // Skills Progress Section
    if (report.skillSummaries.length > 0) {
        y = checkPageBreak(doc, y, 50);

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(COLORS.regalPurple);
        doc.text('Skills Progress', margin, y);
        y += 8;

        // Group skills by trend
        const improving = report.skillSummaries.filter(s => s.trend === 'improving');
        const stable = report.skillSummaries.filter(s => s.trend === 'stable');
        const declining = report.skillSummaries.filter(s => s.trend === 'declining');

        if (improving.length > 0) {
            y = addSkillGroup(doc, 'Improving Skills', improving, margin, y, contentWidth);
        }
        if (stable.length > 0) {
            y = addSkillGroup(doc, 'Stable Skills', stable, margin, y, contentWidth);
        }
        if (declining.length > 0) {
            y = addSkillGroup(doc, 'Skills Needing Support', declining, margin, y, contentWidth);
        }
    }

    // Strengths Section
    if (report.strengthHighlights.length > 0) {
        y = checkPageBreak(doc, y, 40);

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(COLORS.textPrimary);
        doc.text('Strengths Observed', margin, y);
        y += 7;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        for (const strength of report.strengthHighlights.slice(0, 6)) {
            doc.text(`• ${strength.strength}`, margin + 2, y);
            y += 5;
        }
        y += 5;
    }

    // Recommendations Section
    if (template === 'therapist' && report.recommendationsForTherapist.length > 0) {
        y = checkPageBreak(doc, y, 40);

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(COLORS.regalPurple);
        doc.text('Recommendations for Therapy', margin, y);
        y += 7;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(COLORS.textPrimary);
        for (const rec of report.recommendationsForTherapist) {
            const recLines = doc.splitTextToSize(`• ${rec}`, contentWidth - 5);
            doc.text(recLines, margin + 2, y);
            y += recLines.length * 4 + 2;
        }
        y += 5;
    }

    if (template === 'school' && report.recommendationsForSchool.length > 0) {
        y = checkPageBreak(doc, y, 40);

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(COLORS.regalPurple);
        doc.text('Recommendations for Educational Team', margin, y);
        y += 7;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(COLORS.textPrimary);
        for (const rec of report.recommendationsForSchool) {
            const recLines = doc.splitTextToSize(`• ${rec}`, contentWidth - 5);
            doc.text(recLines, margin + 2, y);
            y += recLines.length * 4 + 2;
        }
        y += 5;
    }

    // Communication Patterns Section
    if (report.observationStats.dominantChannels.length > 0) {
        y = checkPageBreak(doc, y, 40);

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(COLORS.textPrimary);
        doc.text('Communication Patterns', margin, y);
        y += 7;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        for (const channel of report.observationStats.dominantChannels) {
            const count = report.observationStats.channelDistribution[channel] || 0;
            const percentage = report.observationStats.periodCount > 0
                ? Math.round((count / report.observationStats.periodCount) * 100)
                : 0;
            doc.text(`• ${channel}: ${percentage}% of observations`, margin + 2, y);
            y += 5;
        }
        y += 5;
    }

    // Footer on all pages
    addProgressFooter(doc, report.childName);

    return doc;
}

// Helper functions for progress report PDF

function checkPageBreak(doc: jsPDF, y: number, requiredSpace: number): number {
    const pageHeight = doc.internal.pageSize.getHeight();
    if (y + requiredSpace > pageHeight - 25) {
        doc.addPage();
        return 25;
    }
    return y;
}

function addSkillGroup(
    doc: jsPDF,
    title: string,
    skills: SkillProgressSummary[],
    margin: number,
    y: number,
    _contentWidth: number
): number {
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLORS.textSecondary);
    doc.text(title, margin + 2, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(COLORS.textPrimary);
    doc.setFontSize(9);

    for (const skill of skills.slice(0, 5)) {
        if (y > pageHeight - 30) {
            doc.addPage();
            y = 25;
        }

        const levelText = `${skill.currentLevel.toFixed(1)}/5`;
        const changeText = skill.levelChange >= 0 ? `+${skill.levelChange.toFixed(1)}` : skill.levelChange.toFixed(1);
        doc.text(`• ${skill.skillName} (${levelText}, ${changeText})`, margin + 4, y);
        y += 4;

        if (skill.practiceCount > 0) {
            doc.setTextColor(COLORS.textSecondary);
            doc.text(`  ${skill.practiceCount} practice sessions`, margin + 6, y);
            doc.setTextColor(COLORS.textPrimary);
            y += 4;
        }
    }

    return y + 3;
}

function addProgressFooter(doc: jsPDF, childName: string): void {
    const pageCount = doc.internal.pages.length - 1;
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;

    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);

        doc.setDrawColor(COLORS.borderLight);
        doc.line(margin, pageHeight - 18, pageWidth - margin, pageHeight - 18);

        doc.setFontSize(8);
        doc.setTextColor(COLORS.textSecondary);
        doc.text(`Progress report for ${childName}`, margin, pageHeight - 12);

        doc.setTextColor(COLORS.gold);
        doc.text(`Giovanna | Page ${i} of ${pageCount}`, pageWidth - margin - 40, pageHeight - 12);
    }
}

/**
 * Download a PDF document
 */
export function downloadPDF(doc: jsPDF, filename: string): void {
    doc.save(filename);
}

/**
 * Share a PDF via native share API (mobile) or download (desktop)
 */
export async function sharePDF(doc: jsPDF, filename: string, title: string): Promise<void> {
    const blob = doc.output('blob');
    const file = new File([blob], filename, { type: 'application/pdf' });

    if (navigator.share && navigator.canShare?.({ files: [file] })) {
        try {
            await navigator.share({
                title,
                files: [file],
            });
        } catch (error) {
            // User cancelled or share failed - fall back to download
            if ((error as Error).name !== 'AbortError') {
                downloadPDF(doc, filename);
            }
        }
    } else {
        // Fallback for desktop
        downloadPDF(doc, filename);
    }
}

// Helper functions

function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

function getReciprocityDescription(level: number): string {
    const descriptions: Record<number, string> = {
        1: 'Disconnection observed - additional support may be needed',
        2: 'Limited connection - working toward regulation',
        3: 'Moderate connection - stable engagement',
        4: 'Strong connection - positive relational exchange',
        5: 'Deep mutual recognition - flourishing connection',
    };
    return descriptions[level] || 'Connection documented';
}

function getTemplateAudience(template: DocumentTemplate): string {
    const audiences: Record<DocumentTemplate, string> = {
        school: 'Educational Team',
        medical: 'Healthcare Provider',
        therapy: 'Therapy Provider',
        legal: 'Legal/Advocacy Purposes',
        careTeam: 'Care Team Members',
        personal: 'Personal Records',
    };
    return audiences[template];
}

function countChannels(observations: Observation[]): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const obs of observations) {
        for (const channel of obs.channels || []) {
            counts[channel] = (counts[channel] || 0) + 1;
        }
    }
    return counts;
}

function extractStrengthsFromObservations(observations: Observation[], childName: string): string[] {
    const strengths: string[] = [];
    const seen = new Set<string>();

    for (const obs of observations) {
        const text = (obs.strengthNarrative || '').toLowerCase();

        if (text.includes('calm') && !seen.has('regulation')) {
            strengths.push(`${childName} demonstrates self-regulation capacity`);
            seen.add('regulation');
        }
        if ((text.includes('creative') || text.includes('built') || text.includes('made')) && !seen.has('creative')) {
            strengths.push(`${childName} shows creative problem-solving abilities`);
            seen.add('creative');
        }
        if ((text.includes('helped') || text.includes('shared')) && !seen.has('prosocial')) {
            strengths.push(`${childName} displays prosocial behaviors`);
            seen.add('prosocial');
        }
        if ((text.includes('tried') || text.includes('attempt')) && !seen.has('persistence')) {
            strengths.push(`${childName} shows persistence and effort`);
            seen.add('persistence');
        }
        if ((text.includes('said') || text.includes('told') || text.includes('asked')) && !seen.has('communication')) {
            strengths.push(`${childName} engages in functional communication`);
            seen.add('communication');
        }
        if ((text.includes('happy') || text.includes('joy') || text.includes('laugh')) && !seen.has('joy')) {
            strengths.push(`${childName} experiences and expresses joy`);
            seen.add('joy');
        }
    }

    if (strengths.length === 0) {
        strengths.push(`${childName} is developing skills with caregiver support`);
    }

    return strengths;
}

function extractSupportsFromObservations(observations: Observation[]): string[] {
    const supports: string[] = [];
    const seen = new Set<string>();

    for (const obs of observations) {
        const text = ((obs.strengthNarrative || '') + ' ' + (obs.atmosphericResonance || '') + ' ' + (obs.biologicalNeeds || '')).toLowerCase();

        if ((text.includes('transition') || text.includes('change')) && !seen.has('transition')) {
            supports.push('Transition warnings and preparation time');
            seen.add('transition');
        }
        if ((text.includes('sensory') || text.includes('loud') || text.includes('bright') || text.includes('texture')) && !seen.has('sensory')) {
            supports.push('Sensory-friendly environment modifications');
            seen.add('sensory');
        }
        if ((text.includes('overwhelm') || text.includes('meltdown') || text.includes('dysregulat')) && !seen.has('space')) {
            supports.push('Access to quiet space for regulation');
            seen.add('space');
        }
        if ((text.includes('sleep') || text.includes('tired') || text.includes('fatigue')) && !seen.has('rest')) {
            supports.push('Rest and energy management support');
            seen.add('rest');
        }
        if ((text.includes('routine') || text.includes('schedule') || text.includes('predictab')) && !seen.has('routine')) {
            supports.push('Consistent routines and predictable environments');
            seen.add('routine');
        }
    }

    return supports;
}

function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
}

function addFooter(doc: jsPDF, footerText: string, _parentTitle: string): void {
    const pageCount = doc.internal.pages.length - 1;
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;

    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);

        doc.setDrawColor(COLORS.borderLight);
        doc.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);

        doc.setFontSize(8);
        doc.setTextColor(COLORS.textSecondary);
        doc.text(footerText, margin, pageHeight - 14);

        doc.setTextColor(COLORS.gold);
        doc.text(`Giovanna | Page ${i} of ${pageCount}`, pageWidth - margin - 40, pageHeight - 14);
    }
}
