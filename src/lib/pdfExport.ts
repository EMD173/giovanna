/**
 * PDF EXPORT ENGINE: Professional-Grade Document Generation
 * 
 * Senior-Level Implementation:
 * - Clinical summaries for doctors/therapists
 * - School-ready reports for IEP meetings
 * - Therapy prep documents with pattern analysis
 * - Dignity-framed language throughout
 * 
 * Uses jsPDF with autotable for production-quality output.
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Observation, ResonanceChannel } from '../core/stores/types';
import type { UserProfile } from '../core/stores/profileTypes';

// ============================================================================
// TYPES
// ============================================================================

export type ExportTemplate = 'clinical' | 'school' | 'therapy' | 'personal';

export interface ExportOptions {
  template: ExportTemplate;
  dateRange?: {
    start: Date;
    end: Date;
  };
  includePhotos?: boolean;
  includeVideoLinks?: boolean;
  anonymizeChild?: boolean;
  customTitle?: string;
}

export interface ExportData {
  profile: UserProfile;
  observations: Observation[];
  generatedAt: Date;
}

// ============================================================================
// DESIGN TOKENS (Giovanna Brand)
// ============================================================================

const COLORS = {
  regal: [75, 0, 130] as [number, number, number],      // #4B0082
  gold: [212, 175, 55] as [number, number, number],     // #D4AF37
  darkText: [26, 26, 26] as [number, number, number],   // #1A1A1A
  lightText: [100, 100, 100] as [number, number, number],
  accent: [139, 92, 246] as [number, number, number],   // Purple accent
  success: [34, 197, 94] as [number, number, number],   // Green
  warning: [249, 115, 22] as [number, number, number],  // Orange
};

const FONTS = {
  title: 24,
  subtitle: 16,
  heading: 14,
  body: 11,
  caption: 9,
};

// ============================================================================
// DIGNITY-FRAMED LANGUAGE TRANSLATIONS
// ============================================================================

const DIGNITY_TRANSLATIONS: Record<string, string> = {
  'meltdown': 'emotional expression',
  'tantrum': 'communication attempt',
  'behavior': 'communication',
  'issue': 'area of support',
  'problem': 'growth opportunity',
  'trigger': 'environmental factor',
  'deficit': 'area for development',
  'noncompliant': 'expressing needs differently',
  'aggressive': 'demonstrating strong feelings',
  'withdrawn': 'self-regulating',
};

function translateToDignity(text: string): string {
  let result = text;
  Object.entries(DIGNITY_TRANSLATIONS).forEach(([deficit, dignity]) => {
    const regex = new RegExp(deficit, 'gi');
    result = result.replace(regex, dignity);
  });
  return result;
}

// ============================================================================
// CHANNEL METADATA FOR PROFESSIONAL REPORTS
// ============================================================================

const CHANNEL_PROFESSIONAL_LABELS: Record<ResonanceChannel, { clinical: string; school: string }> = {
  'Seeking Safety': {
    clinical: 'Autonomic Safety-Seeking Behaviors',
    school: 'Safety and Security Needs',
  },
  'Sensory Need': {
    clinical: 'Sensory Processing Indicators',
    school: 'Sensory Accommodations Required',
  },
  'Connection Bid': {
    clinical: 'Social-Emotional Connection Attempts',
    school: 'Social Interaction Patterns',
  },
  'Transition Signal': {
    clinical: 'Executive Function: Transition Markers',
    school: 'Transition Support Needs',
  },
  'Body Wisdom': {
    clinical: 'Interoceptive Awareness Indicators',
    school: 'Physical Regulation Observations',
  },
  'Joy Expression': {
    clinical: 'Positive Affect and Engagement',
    school: 'Strengths and Interests',
  },
};

// ============================================================================
// PDF GENERATION ENGINE
// ============================================================================

export class PDFExportEngine {
  private doc: jsPDF;
  private pageHeight: number;
  private pageWidth: number;
  private margin: number = 20;
  private currentY: number = 20;

  constructor() {
    this.doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.pageWidth = this.doc.internal.pageSize.getWidth();
  }

  // Check if we need a new page
  private checkPageBreak(requiredSpace: number = 30): void {
    if (this.currentY + requiredSpace > this.pageHeight - this.margin) {
      this.doc.addPage();
      this.currentY = this.margin;
      this.addPageFooter();
    }
  }

  // Add header with Giovanna branding
  private addHeader(title: string, subtitle?: string): void {
    // Regal purple header bar
    this.doc.setFillColor(...COLORS.regal);
    this.doc.rect(0, 0, this.pageWidth, 35, 'F');

    // Gold accent line
    this.doc.setFillColor(...COLORS.gold);
    this.doc.rect(0, 35, this.pageWidth, 2, 'F');

    // Title
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(FONTS.title);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, this.margin, 20);

    // Subtitle
    if (subtitle) {
      this.doc.setFontSize(FONTS.body);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(subtitle, this.margin, 28);
    }

    // Giovanna branding
    this.doc.setFontSize(FONTS.caption);
    this.doc.text('Generated by Giovanna', this.pageWidth - this.margin - 40, 28);

    this.currentY = 50;
  }

  // Add page footer
  private addPageFooter(): void {
    const pageNumber = this.doc.getNumberOfPages();
    this.doc.setFontSize(FONTS.caption);
    this.doc.setTextColor(...COLORS.lightText);
    this.doc.text(
      `Page ${pageNumber} | Confidential Document | Giovanna Family Care Platform`,
      this.pageWidth / 2,
      this.pageHeight - 10,
      { align: 'center' }
    );
  }

  // Add section header
  private addSectionHeader(title: string): void {
    this.checkPageBreak(20);
    this.doc.setFontSize(FONTS.heading);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(...COLORS.regal);
    this.doc.text(title, this.margin, this.currentY);
    
    // Underline
    this.doc.setDrawColor(...COLORS.gold);
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, this.currentY + 2, this.margin + 50, this.currentY + 2);
    
    this.currentY += 10;
  }

  // Add paragraph text
  private addParagraph(text: string, indent: boolean = false): void {
    this.checkPageBreak(10);
    this.doc.setFontSize(FONTS.body);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(...COLORS.darkText);
    
    const xPos = indent ? this.margin + 5 : this.margin;
    const maxWidth = this.pageWidth - (2 * this.margin) - (indent ? 5 : 0);
    
    const lines = this.doc.splitTextToSize(text, maxWidth);
    this.doc.text(lines, xPos, this.currentY);
    this.currentY += lines.length * 5 + 3;
  }

  // Add key-value row
  private addKeyValue(key: string, value: string): void {
    this.checkPageBreak(8);
    this.doc.setFontSize(FONTS.body);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(...COLORS.darkText);
    this.doc.text(`${key}:`, this.margin, this.currentY);
    
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(value, this.margin + 45, this.currentY);
    this.currentY += 7;
  }

  // Add observations table
  private addObservationsTable(observations: Observation[], template: ExportTemplate): void {
    this.checkPageBreak(40);

    const headers = template === 'clinical'
      ? ['Date', 'Communication', 'Channels', 'Reciprocity', 'Context']
      : template === 'school'
        ? ['Date', 'Observation', 'Supports Needed', 'Connection Level']
        : ['Date', 'What Happened', 'How We Responded', 'Outcome'];

    const rows = observations.map(obs => {
      // Convert Firebase Timestamp to Date
      const date = obs.timestamp?.toDate?.() ?? new Date();
      const dateStr = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: '2-digit'
      });

      const channels = obs.channels?.map(c => {
        if (template === 'clinical') {
          return CHANNEL_PROFESSIONAL_LABELS[c]?.clinical || c;
        }
        if (template === 'school') {
          return CHANNEL_PROFESSIONAL_LABELS[c]?.school || c;
        }
        return c;
      }).join(', ') || 'Not specified';

      const reciprocityLabels = [
        '', 'Disconnection', 'Emerging', 'Present', 'Strong', 'Deep Mutual Recognition'
      ];

      if (template === 'clinical') {
        return [
          dateStr,
          translateToDignity(obs.strengthNarrative || '—'),
          channels,
          reciprocityLabels[obs.relationalReciprocity] || '—',
          translateToDignity(obs.atmosphericResonance || '—')
        ];
      }

      if (template === 'school') {
        return [
          dateStr,
          translateToDignity(obs.strengthNarrative || '—'),
          channels,
          `${obs.relationalReciprocity}/5`
        ];
      }

      // Therapy / Personal
      return [
        dateStr,
        translateToDignity(obs.strengthNarrative || '—'),
        translateToDignity(obs.biologicalNeeds || '—'),
        reciprocityLabels[obs.relationalReciprocity] || '—'
      ];
    });

    autoTable(this.doc, {
      startY: this.currentY,
      head: [headers],
      body: rows,
      theme: 'grid',
      headStyles: {
        fillColor: COLORS.regal,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: FONTS.caption,
      },
      bodyStyles: {
        fontSize: FONTS.caption,
        textColor: COLORS.darkText,
      },
      alternateRowStyles: {
        fillColor: [248, 246, 255],
      },
      margin: { left: this.margin, right: this.margin },
      styles: {
        cellPadding: 3,
        overflow: 'linebreak',
      },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 50 },
      },
    });

    // Update currentY after table
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.currentY = (this.doc as any).lastAutoTable.finalY + 10;
  }

  // Add pattern analysis section
  private addPatternAnalysis(observations: Observation[]): void {
    this.addSectionHeader('Pattern Analysis');

    // Channel frequency
    const channelCounts: Record<string, number> = {};
    observations.forEach(obs => {
      obs.channels?.forEach(channel => {
        channelCounts[channel] = (channelCounts[channel] || 0) + 1;
      });
    });

    const sortedChannels = Object.entries(channelCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    if (sortedChannels.length > 0) {
      this.addParagraph('Most Frequently Observed Communication Patterns:');
      sortedChannels.forEach(([channel, count], idx) => {
        this.addParagraph(`${idx + 1}. ${channel}: ${count} occurrences`, true);
      });
    }

    // Reciprocity trend
    const reciprocityValues = observations
      .map(o => o.relationalReciprocity)
      .filter((v): v is 1 | 2 | 3 | 4 | 5 => v !== undefined);

    if (reciprocityValues.length > 0) {
      const avgReciprocity = (reciprocityValues.reduce((a, b) => a + b, 0) / reciprocityValues.length).toFixed(1);
      this.currentY += 5;
      this.addParagraph(`Average Connection Quality: ${avgReciprocity}/5`);

      // Trend analysis
      if (reciprocityValues.length >= 5) {
        const firstHalf = reciprocityValues.slice(0, Math.floor(reciprocityValues.length / 2));
        const secondHalf = reciprocityValues.slice(Math.floor(reciprocityValues.length / 2));
        const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

        const trend = secondAvg > firstAvg + 0.2
          ? 'improving trend'
          : secondAvg < firstAvg - 0.2
            ? 'area requiring attention'
            : 'stable pattern';

        this.addParagraph(`Trend Analysis: ${trend} in relational connection over the reporting period.`);
      }
    }
  }

  // Add recommendations section
  private addRecommendations(observations: Observation[], template: ExportTemplate): void {
    this.addSectionHeader(template === 'clinical' ? 'Clinical Recommendations' : 'Support Recommendations');

    // Analyze patterns to generate recommendations
    const channelCounts: Record<string, number> = {};
    observations.forEach(obs => {
      obs.channels?.forEach(channel => {
        channelCounts[channel] = (channelCounts[channel] || 0) + 1;
      });
    });

    const recommendations: string[] = [];

    if (channelCounts['Seeking Safety'] > observations.length * 0.3) {
      recommendations.push(
        template === 'clinical'
          ? 'Consider environmental modifications to enhance felt safety; assess for sensory triggers in common settings.'
          : 'This child benefits from predictable routines and advance notice of changes. Consider providing a quiet, safe space for regulation.'
      );
    }

    if (channelCounts['Sensory Need'] > observations.length * 0.3) {
      recommendations.push(
        template === 'clinical'
          ? 'Recommend occupational therapy evaluation for sensory integration; consider sensory diet implementation.'
          : 'Sensory breaks and accommodations (noise-canceling headphones, fidgets, movement breaks) may be beneficial.'
      );
    }

    if (channelCounts['Transition Signal'] > observations.length * 0.2) {
      recommendations.push(
        template === 'clinical'
          ? 'Executive function support indicated; visual schedules and transition warnings recommended.'
          : 'Use visual timers and 5-2-1 minute warnings before transitions. Consider visual schedules.'
      );
    }

    if (channelCounts['Connection Bid'] > observations.length * 0.25) {
      recommendations.push(
        template === 'clinical'
          ? 'Strong social motivation observed; leverage for skill building through preferred activities and social stories.'
          : 'This child actively seeks connection. Structured peer activities and 1:1 time support their engagement.'
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        'Continue current approaches; observations indicate balanced communication across multiple channels.'
      );
    }

    recommendations.forEach((rec, idx) => {
      this.addParagraph(`${idx + 1}. ${rec}`);
    });
  }

  // ============================================================================
  // PUBLIC EXPORT METHODS
  // ============================================================================

  /**
   * Generate Clinical Summary PDF
   * For doctors, psychologists, and clinical professionals
   */
  public generateClinicalSummary(data: ExportData, options: ExportOptions): Blob {
    const childName = options.anonymizeChild ? 'Child' : (data.profile.childName || 'Child');
    const dateRange = options.dateRange
      ? `${options.dateRange.start.toLocaleDateString()} - ${options.dateRange.end.toLocaleDateString()}`
      : 'All observations';

    this.addHeader('Clinical Observation Summary', `${childName} | ${dateRange}`);
    this.addPageFooter();

    // Child Profile Section
    this.addSectionHeader('Client Profile');
    this.addKeyValue('Child Age', data.profile.childAge ? String(data.profile.childAge) : 'Not specified');
    this.addKeyValue('Diagnosis', data.profile.vault?.clinical?.diagnoses?.[0]?.name || 'See attached documentation');
    this.addKeyValue('Reporting Period', dateRange);
    this.addKeyValue('Total Observations', String(data.observations.length));
    this.currentY += 5;

    // Observations Table
    this.addSectionHeader('Observation Log');
    if (data.observations.length > 0) {
      this.addObservationsTable(data.observations, 'clinical');
    } else {
      this.addParagraph('No observations recorded during this period.');
    }

    // Pattern Analysis
    if (data.observations.length >= 3) {
      this.addPatternAnalysis(data.observations);
    }

    // Recommendations
    if (data.observations.length >= 2) {
      this.addRecommendations(data.observations, 'clinical');
    }

    // Disclaimer
    this.checkPageBreak(30);
    this.currentY += 10;
    this.doc.setFontSize(FONTS.caption);
    this.doc.setTextColor(...COLORS.lightText);
    this.doc.text(
      'This report was generated from caregiver observations and is intended to supplement, not replace, clinical assessment.',
      this.margin,
      this.currentY,
      { maxWidth: this.pageWidth - 2 * this.margin }
    );

    return this.doc.output('blob');
  }

  /**
   * Generate School Report PDF
   * For teachers, IEP teams, and school staff
   */
  public generateSchoolReport(data: ExportData, options: ExportOptions): Blob {
    const childName = options.anonymizeChild ? 'Student' : (data.profile.childName || 'Student');
    const dateRange = options.dateRange
      ? `${options.dateRange.start.toLocaleDateString()} - ${options.dateRange.end.toLocaleDateString()}`
      : 'Current period';

    this.addHeader('School Collaboration Report', `${childName} | ${dateRange}`);
    this.addPageFooter();

    // Student Profile
    this.addSectionHeader('Student Information');
    this.addKeyValue('Student', childName);
    this.addKeyValue('Grade/Age', data.profile.childAge ? String(data.profile.childAge) : 'See student records');
    this.addKeyValue('Report Period', dateRange);
    this.addKeyValue('Home Observations', String(data.observations.length));
    this.currentY += 5;

    // Context for educators
    this.addSectionHeader('Context for Educators');
    this.addParagraph(
      'This report shares observations from the home environment to support school-home collaboration. ' +
      'The observations use a strength-based framework that views behavior as communication. ' +
      'We hope this helps you understand what works well for our child.'
    );
    this.currentY += 5;

    // Observations
    this.addSectionHeader('Home Observations');
    if (data.observations.length > 0) {
      this.addObservationsTable(data.observations, 'school');
    } else {
      this.addParagraph('No observations to share for this period.');
    }

    // What Works Section
    this.addSectionHeader('What Works at Home');
    const joyExpressions = data.observations.filter(o => 
      o.channels?.includes('Joy Expression') && o.relationalReciprocity >= 4
    );
    
    if (joyExpressions.length > 0) {
      this.addParagraph('Conditions where connection was strongest:');
      joyExpressions.slice(0, 3).forEach((obs, idx) => {
        this.addParagraph(
          `${idx + 1}. ${translateToDignity(obs.strengthNarrative || 'Engaged and connected')}`,
          true
        );
      });
    } else {
      this.addParagraph(
        'Strong connection observed across various contexts. Child responds well to predictable routines and clear expectations.'
      );
    }

    // Recommendations
    this.addRecommendations(data.observations, 'school');

    // Parent contact
    this.checkPageBreak(25);
    this.addSectionHeader('Collaboration');
    this.addParagraph(
      `Prepared by: ${data.profile.parent?.title || 'Parent/Guardian'}\n` +
      'Please contact us to discuss any observations or coordinate support strategies.'
    );

    return this.doc.output('blob');
  }

  /**
   * Generate Therapy Prep PDF
   * For therapy session preparation
   */
  public generateTherapyPrep(data: ExportData, options: ExportOptions): Blob {
    const childName = options.anonymizeChild ? 'Client' : (data.profile.childName || 'Child');
    const dateRange = options.dateRange
      ? `${options.dateRange.start.toLocaleDateString()} - ${options.dateRange.end.toLocaleDateString()}`
      : 'Since last session';

    this.addHeader('Therapy Session Preparation', `${childName} | ${dateRange}`);
    this.addPageFooter();

    // Session prep context
    this.addSectionHeader('Session Context');
    this.addKeyValue('Client', childName);
    this.addKeyValue('Reporting Period', dateRange);
    this.addKeyValue('Observations Recorded', String(data.observations.length));
    this.currentY += 5;

    // Recent observations
    this.addSectionHeader('Recent Observations');
    if (data.observations.length > 0) {
      this.addObservationsTable(data.observations.slice(0, 10), 'therapy');
    } else {
      this.addParagraph('No new observations since last session.');
    }

    // Topics to discuss
    this.addSectionHeader('Suggested Discussion Topics');
    
    const lowReciprocity = data.observations.filter(o => o.relationalReciprocity <= 2);
    const highReciprocity = data.observations.filter(o => o.relationalReciprocity >= 4);

    if (lowReciprocity.length > 0) {
      this.addParagraph('Challenging moments to process:');
      lowReciprocity.slice(0, 3).forEach((obs, idx) => {
        this.addParagraph(`${idx + 1}. ${translateToDignity(obs.strengthNarrative || 'Disconnection noted')}`, true);
      });
      this.currentY += 3;
    }

    if (highReciprocity.length > 0) {
      this.addParagraph('Wins to celebrate and build upon:');
      highReciprocity.slice(0, 3).forEach((obs, idx) => {
        this.addParagraph(`${idx + 1}. ${translateToDignity(obs.strengthNarrative || 'Strong connection')}`, true);
      });
    }

    // Pattern summary
    if (data.observations.length >= 3) {
      this.addPatternAnalysis(data.observations);
    }

    // Caregiver notes section (blank for writing)
    this.checkPageBreak(40);
    this.addSectionHeader('Caregiver Notes');
    this.addParagraph('Questions or topics I want to discuss:');
    this.currentY += 20;
    this.doc.setDrawColor(...COLORS.lightText);
    for (let i = 0; i < 4; i++) {
      this.doc.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
      this.currentY += 8;
    }

    return this.doc.output('blob');
  }

  /**
   * Generate Personal Archive PDF
   * For family records and personal use
   */
  public generatePersonalArchive(data: ExportData, options: ExportOptions): Blob {
    const childName = data.profile.childName || 'Our Child';
    const dateRange = options.dateRange
      ? `${options.dateRange.start.toLocaleDateString()} - ${options.dateRange.end.toLocaleDateString()}`
      : 'Complete history';

    this.addHeader(`${childName}'s Journey`, dateRange);
    this.addPageFooter();

    // Dedication
    this.addSectionHeader('A Letter to the Future');
    this.addParagraph(
      `This document captures ${data.observations.length} moments of connection, growth, and love ` +
      'between our family. Each observation is a testament to the communication that flows between us — ' +
      'not behaviors to be managed, but expressions of a beautiful mind making sense of the world.'
    );
    this.currentY += 5;

    // Profile
    this.addSectionHeader('About ' + childName);
    if (data.profile.childAge) {
      this.addKeyValue('Age', String(data.profile.childAge));
    }
    // Note: interests/strengths will be added in future schema expansion
    // For now, use biological context regulation strategies if available
    if (data.profile.biologicalContext?.regulationStrategies && data.profile.biologicalContext.regulationStrategies.length > 0) {
      this.addKeyValue('What Works', data.profile.biologicalContext.regulationStrategies.join(', '));
    }
    this.currentY += 5;

    // All observations
    this.addSectionHeader('Our Story');
    if (data.observations.length > 0) {
      this.addObservationsTable(data.observations, 'personal');
    } else {
      this.addParagraph('Our story is just beginning...');
    }

    // Pattern reflection
    if (data.observations.length >= 5) {
      this.addPatternAnalysis(data.observations);
    }

    // Closing
    this.checkPageBreak(30);
    this.currentY += 10;
    this.doc.setFontSize(FONTS.subtitle);
    this.doc.setFont('helvetica', 'italic');
    this.doc.setTextColor(...COLORS.regal);
    this.doc.text(
      'Every moment witnessed is a moment of love.',
      this.pageWidth / 2,
      this.currentY,
      { align: 'center' }
    );

    return this.doc.output('blob');
  }
}

// ============================================================================
// CONVENIENCE EXPORT FUNCTIONS
// ============================================================================

/**
 * Generate and download a PDF export
 */
export async function generatePDFExport(
  data: ExportData,
  options: ExportOptions
): Promise<void> {
  const engine = new PDFExportEngine();
  let blob: Blob;

  switch (options.template) {
    case 'clinical':
      blob = engine.generateClinicalSummary(data, options);
      break;
    case 'school':
      blob = engine.generateSchoolReport(data, options);
      break;
    case 'therapy':
      blob = engine.generateTherapyPrep(data, options);
      break;
    case 'personal':
    default:
      blob = engine.generatePersonalArchive(data, options);
      break;
  }

  // Create download
  const url = URL.createObjectURL(blob);
  const filename = `giovanna-${options.template}-${data.profile.childName?.toLowerCase().replace(/\s+/g, '-') || 'export'}-${new Date().toISOString().split('T')[0]}.pdf`;

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate PDF blob without downloading (for preview or email attachment)
 */
export function generatePDFBlob(
  data: ExportData,
  options: ExportOptions
): Blob {
  const engine = new PDFExportEngine();

  switch (options.template) {
    case 'clinical':
      return engine.generateClinicalSummary(data, options);
    case 'school':
      return engine.generateSchoolReport(data, options);
    case 'therapy':
      return engine.generateTherapyPrep(data, options);
    case 'personal':
    default:
      return engine.generatePersonalArchive(data, options);
  }
}
