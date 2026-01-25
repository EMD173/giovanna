/**
 * EXPORT CENTER: Professional Document Generation
 * 
 * Giovanna 2.0 Phase 1 - Source of Truth
 * 
 * Features:
 * - Template selection (Clinical, School, Therapy, Personal)
 * - Date range filtering
 * - Anonymization toggle
 * - Preview before download
 * - Professional branding throughout
 */

import { useState, useEffect } from 'react';
import { 
  IconFileTypePdf, 
  IconSchool, 
  IconStethoscope, 
  IconHeart, 
  IconCalendar,
  IconDownload,
  IconEye,
  IconUserOff,
  IconCheck,
  IconSparkles,
  IconArrowLeft
} from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../core/stores/useAuthStore';
import { getObservations } from '../../core/firebase/firestore';
import { getProfile } from '../../core/firebase/profiles';
import { generatePDFExport, type ExportTemplate, type ExportOptions, type ExportData } from '../../lib/pdfExport';
import type { Observation } from '../../core/stores/types';
import type { UserProfile } from '../../core/stores/profileTypes';

// Template metadata
const TEMPLATES = [
  {
    id: 'clinical' as ExportTemplate,
    label: 'Clinical Summary',
    description: 'APA-style reports for doctors, psychologists, and clinical professionals',
    icon: IconStethoscope,
    color: 'rgb(var(--color-regal))',
    audience: 'Healthcare Providers',
  },
  {
    id: 'school' as ExportTemplate,
    label: 'School Report',
    description: 'Teacher-friendly summaries for IEP meetings and school collaboration',
    icon: IconSchool,
    color: 'rgb(59, 130, 246)',
    audience: 'Educators & IEP Teams',
  },
  {
    id: 'therapy' as ExportTemplate,
    label: 'Therapy Prep',
    description: 'Session preparation documents with patterns and discussion topics',
    icon: IconSparkles,
    color: 'rgb(168, 85, 247)',
    audience: 'Therapists & Counselors',
  },
  {
    id: 'personal' as ExportTemplate,
    label: 'Family Archive',
    description: 'Beautiful keepsake documents celebrating your child\'s journey',
    icon: IconHeart,
    color: 'rgb(236, 72, 153)',
    audience: 'Family Records',
  },
] as const;

// Date range presets
const DATE_PRESETS = [
  { label: 'Last 7 Days', days: 7 },
  { label: 'Last 30 Days', days: 30 },
  { label: 'Last 90 Days', days: 90 },
  { label: 'All Time', days: null },
] as const;

interface ExportCenterProps {
  onBack?: () => void;
}

export function ExportCenter({ onBack }: ExportCenterProps) {
  // Auth & Data
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Export Config
  const [selectedTemplate, setSelectedTemplate] = useState<ExportTemplate>('school');
  const [datePreset, setDatePreset] = useState<number | null>(30);
  const [customDateRange, setCustomDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: '',
  });
  const [anonymize, setAnonymize] = useState(false);
  
  // Status
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load profile and observations
  useEffect(() => {
    async function loadData() {
      if (!user) return;
      
      try {
        setLoading(true);
        const [profileData, observationsData] = await Promise.all([
          getProfile(user.uid),
          getObservations(user.uid, 200), // Get more for filtering
        ]);
        
        setProfile(profileData);
        setObservations(observationsData);
      } catch (err) {
        console.error('Failed to load export data:', err);
        setError('Failed to load your data. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [user]);

  // Filter observations by date range
  const filteredObservations = (() => {
    if (!observations.length) return [];
    
    const now = new Date();
    let startDate: Date | null = null;
    let endDate: Date = now;
    
    if (datePreset !== null) {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - datePreset);
    } else if (customDateRange.start) {
      startDate = new Date(customDateRange.start);
      if (customDateRange.end) {
        endDate = new Date(customDateRange.end);
      }
    }
    
    return observations.filter(obs => {
      const obsDate = obs.timestamp?.toDate?.() ?? new Date();
      if (startDate && obsDate < startDate) return false;
      if (obsDate > endDate) return false;
      return true;
    });
  })();

  // Handle export
  async function handleExport() {
    if (!profile || !user) {
      setError('Please complete your profile before exporting.');
      return;
    }
    
    if (filteredObservations.length === 0) {
      setError('No observations found for the selected date range.');
      return;
    }
    
    try {
      setExporting(true);
      setError(null);
      
      const exportData: ExportData = {
        profile,
        observations: filteredObservations,
        generatedAt: new Date(),
      };
      
      const options: ExportOptions = {
        template: selectedTemplate,
        anonymizeChild: anonymize,
        includePhotos: true,
        includeVideoLinks: true,
      };
      
      // Add date range if using preset
      if (datePreset !== null) {
        const start = new Date();
        start.setDate(start.getDate() - datePreset);
        options.dateRange = {
          start,
          end: new Date(),
        };
      } else if (customDateRange.start) {
        options.dateRange = {
          start: new Date(customDateRange.start),
          end: customDateRange.end ? new Date(customDateRange.end) : new Date(),
        };
      }
      
      await generatePDFExport(exportData, options);
    } catch (err) {
      console.error('Export failed:', err);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setExporting(false);
    }
  }

  // Get selected template metadata
  const selectedTemplateData = TEMPLATES.find(t => t.id === selectedTemplate);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'rgb(var(--glass-base))' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your observations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: 'rgb(var(--glass-base))' }}>
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-white/60">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-full hover:bg-white/60 transition-colors"
              aria-label="Go back"
            >
              <IconArrowLeft size={24} />
            </button>
          )}
          <div className="flex-1">
            <h1 className="text-xl font-bold" style={{ color: 'rgb(var(--color-regal))' }}>
              Export Center
            </h1>
            <p className="text-sm text-gray-600">
              Create professional reports from your observations
            </p>
          </div>
          <IconFileTypePdf size={32} className="text-purple-600" />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        
        {/* Observation Count */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
            <IconEye size={24} className="text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">
              {filteredObservations.length} Observations
            </p>
            <p className="text-sm text-gray-600">
              Ready to export for {profile?.childName || 'your child'}
            </p>
          </div>
        </motion.div>

        {/* Template Selection */}
        <section>
          <h2 className="text-lg font-semibold mb-3 text-gray-800">Choose Report Type</h2>
          <div className="grid grid-cols-2 gap-3">
            {TEMPLATES.map((template, idx) => {
              const Icon = template.icon;
              const isSelected = selectedTemplate === template.id;
              
              return (
                <motion.button
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`relative p-4 rounded-2xl border-2 transition-all text-left ${
                    isSelected 
                      ? 'border-purple-500 bg-purple-50 shadow-lg' 
                      : 'border-gray-200 bg-white hover:border-purple-300'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="template-check"
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center"
                    >
                      <IconCheck size={14} className="text-white" />
                    </motion.div>
                  )}
                  
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${template.color}20` }}
                  >
                    <Icon size={22} style={{ color: template.color }} />
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-1">{template.label}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2">{template.description}</p>
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* Selected Template Details */}
        <AnimatePresence mode="wait">
          {selectedTemplateData && (
            <motion.div
              key={selectedTemplate}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-card p-4 border-l-4"
              style={{ borderLeftColor: selectedTemplateData.color }}
            >
              <div className="flex items-start gap-3">
                <selectedTemplateData.icon size={24} style={{ color: selectedTemplateData.color }} />
                <div>
                  <p className="font-semibold text-gray-900">{selectedTemplateData.label}</p>
                  <p className="text-sm text-gray-600 mt-1">{selectedTemplateData.description}</p>
                  <p className="text-xs text-purple-600 mt-2">
                    Perfect for: {selectedTemplateData.audience}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Date Range */}
        <section>
          <h2 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
            <IconCalendar size={20} />
            Date Range
          </h2>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {DATE_PRESETS.map(preset => (
              <button
                key={preset.label}
                onClick={() => {
                  setDatePreset(preset.days);
                  setCustomDateRange({ start: '', end: '' });
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  datePreset === preset.days
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-purple-50 border border-gray-200'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
          
          {/* Custom Date Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">From</label>
              <input
                type="date"
                value={customDateRange.start}
                onChange={(e) => {
                  setCustomDateRange(prev => ({ ...prev, start: e.target.value }));
                  setDatePreset(null);
                }}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">To</label>
              <input
                type="date"
                value={customDateRange.end}
                onChange={(e) => {
                  setCustomDateRange(prev => ({ ...prev, end: e.target.value }));
                  setDatePreset(null);
                }}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </section>

        {/* Privacy Options */}
        <section>
          <h2 className="text-lg font-semibold mb-3 text-gray-800">Privacy Options</h2>
          
          <button
            onClick={() => setAnonymize(!anonymize)}
            className={`w-full glass-card p-4 flex items-center gap-4 transition-all ${
              anonymize ? 'border-purple-500 bg-purple-50' : ''
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              anonymize ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              <IconUserOff size={22} />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-gray-900">Anonymize Child's Name</p>
              <p className="text-sm text-gray-500">
                Replace name with "Child" or "Student" in the report
              </p>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
              anonymize 
                ? 'border-purple-500 bg-purple-500' 
                : 'border-gray-300'
            }`}>
              {anonymize && <IconCheck size={14} className="text-white" />}
            </div>
          </button>
        </section>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Export Button */}
        <motion.button
          onClick={handleExport}
          disabled={exporting || filteredObservations.length === 0}
          className="w-full py-4 px-6 rounded-2xl font-semibold text-white shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: 'rgb(var(--color-regal))' }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {exporting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <IconDownload size={22} />
              Download {selectedTemplateData?.label}
            </>
          )}
        </motion.button>

        {/* Footer Note */}
        <p className="text-center text-xs text-gray-500 mt-4">
          All reports use dignity-framed language and are branded with the Giovanna seal.
        </p>
      </div>
    </div>
  );
}
