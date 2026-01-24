/**
 * DATA EXPORT: GDPR-Compliant Data Portability
 * 
 * Allows users to download all their data in JSON format.
 * Supports observations, intentions, mantras, and profile data.
 */

import { useState } from 'react';
import { Download, FileJson, Loader2, Check, AlertCircle } from 'lucide-react';

interface DataExportProps {
    userId: string;
    onExport?: () => Promise<ExportData>;
}

interface ExportData {
    profile: unknown;
    observations: unknown[];
    intentions: unknown[];
    mantras: unknown[];
    mirrorMoments: unknown[];
    exportedAt: string;
    version: string;
}

export const DataExport = ({ userId, onExport }: DataExportProps) => {
    const [isExporting, setIsExporting] = useState(false);
    const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleExport = async () => {
        setIsExporting(true);
        setExportStatus('idle');

        try {
            let data: ExportData;

            if (onExport) {
                // Use provided export function
                data = await onExport();
            } else {
                // Generate placeholder data
                data = {
                    profile: { userId, exportNote: 'Connect Firebase to export real data' },
                    observations: [],
                    intentions: [],
                    mantras: [],
                    mirrorMoments: [],
                    exportedAt: new Date().toISOString(),
                    version: '1.0.0',
                };
            }

            // Create downloadable file
            const blob = new Blob([JSON.stringify(data, null, 2)], {
                type: 'application/json',
            });
            const url = URL.createObjectURL(blob);
            const filename = `giovanna-export-${new Date().toISOString().split('T')[0]}.json`;

            // Trigger download
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            setExportStatus('success');
        } catch (error) {
            console.error('Export failed:', error);
            setExportStatus('error');
        } finally {
            setIsExporting(false);

            // Reset status after 3 seconds
            setTimeout(() => setExportStatus('idle'), 3000);
        }
    };

    return (
        <div className="glass-panel p-6 rounded-[24px]">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-[#4B0082]/10">
                    <FileJson className="w-6 h-6 text-[#4B0082]" />
                </div>
                <div>
                    <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                        Export Your Data
                    </h3>
                    <p className="text-xs opacity-60">
                        Download all your data in JSON format
                    </p>
                </div>
            </div>

            <p className="text-sm opacity-70 mb-4">
                Your data belongs to you. Export includes: observations, intentions, mantras, mirror moments, and profile information.
            </p>

            <button
                onClick={handleExport}
                disabled={isExporting}
                className={`w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${exportStatus === 'success'
                        ? 'bg-green-500 text-white'
                        : exportStatus === 'error'
                            ? 'bg-red-500 text-white'
                            : 'bg-[#4B0082] text-white hover:bg-[#6B238E]'
                    } ${isExporting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
                {isExporting ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Preparing Export...
                    </>
                ) : exportStatus === 'success' ? (
                    <>
                        <Check className="w-5 h-5" />
                        Downloaded Successfully
                    </>
                ) : exportStatus === 'error' ? (
                    <>
                        <AlertCircle className="w-5 h-5" />
                        Export Failed - Try Again
                    </>
                ) : (
                    <>
                        <Download className="w-5 h-5" />
                        Download My Data
                    </>
                )}
            </button>

            <p className="text-xs text-center opacity-50 mt-3">
                GDPR Article 20 - Right to Data Portability
            </p>
        </div>
    );
};

export default DataExport;
