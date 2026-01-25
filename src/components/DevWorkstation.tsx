/**
 * DEV WORKSTATION: Quick Navigation Panel for Development
 * 
 * Allows developers to jump to any page without going through normal flows.
 * Only shows in development mode.
 */

import { useState } from 'react';
import { IconCode, IconX, IconChevronRight } from '@tabler/icons-react';

interface DevWorkstationProps {
    currentView: string;
    onNavigate: (view: string) => void;
    onSkipOnboarding?: () => void;
}

const ALL_VIEWS = [
    { id: 'Sanctuary', label: 'Dashboard (Home)', category: 'Main Nav' },
    { id: 'Capture', label: 'Capture', category: 'Main Nav' },
    { id: 'Oracle', label: 'Oracle', category: 'Main Nav' },
    { id: 'Village', label: 'Village', category: 'Main Nav' },
    { id: 'Journey', label: 'Journey', category: 'Main Nav' },
    { id: 'Passport', label: 'Digital Passport', category: 'Profile' },
    { id: 'Vault', label: 'Institutional Vault', category: 'Profile' },
    { id: 'Onboarding', label: 'Recognition Rite', category: 'Auth' },
    { id: 'ProfessionalDashboard', label: 'Professional Dashboard', category: 'Pro' },
    { id: 'About', label: 'About / Visionary Story', category: 'Info' },
    { id: 'AdminDashboard', label: 'Admin Dashboard', category: 'Admin' },
];

export const DevWorkstation = ({ currentView, onNavigate, onSkipOnboarding }: DevWorkstationProps) => {
    const [isOpen, setIsOpen] = useState(false);

    // Only show in development
    if (import.meta.env.PROD) return null;

    const categories = [...new Set(ALL_VIEWS.map(v => v.category))];

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-24 left-4 z-[100] w-12 h-12 rounded-full bg-purple-600 text-white shadow-lg flex items-center justify-center hover:bg-purple-700 transition-all"
                title="Dev Workstation"
            >
                <IconCode className="w-5 h-5" />
            </button>

            {/* Panel */}
            {isOpen && (
                <div className="fixed inset-0 z-[99] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-md max-h-[80vh] overflow-hidden">
                        {/* Header */}
                        <div className="bg-purple-600 text-white p-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <IconCode className="w-5 h-5" />
                                <h2 className="font-bold">Dev Workstation</h2>
                            </div>
                            <button onClick={() => setIsOpen(false)}>
                                <IconX className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Current View */}
                        <div className="p-3 bg-purple-50 border-b">
                            <p className="text-xs text-purple-600 font-semibold uppercase">Current View</p>
                            <p className="font-bold text-purple-900">{currentView}</p>
                        </div>

                        {/* Skip Onboarding */}
                        {onSkipOnboarding && (
                            <div className="p-3 border-b">
                                <button
                                    onClick={() => {
                                        onSkipOnboarding();
                                        setIsOpen(false);
                                    }}
                                    className="w-full py-2 px-4 bg-amber-500 text-white rounded-lg font-semibold text-sm hover:bg-amber-600"
                                >
                                    Skip Onboarding (Dev Mode)
                                </button>
                            </div>
                        )}

                        {/* Views List */}
                        <div className="overflow-y-auto max-h-[50vh]">
                            {categories.map(category => (
                                <div key={category}>
                                    <p className="px-4 py-2 bg-gray-100 text-xs font-bold uppercase text-gray-500">
                                        {category}
                                    </p>
                                    {ALL_VIEWS.filter(v => v.category === category).map(view => (
                                        <button
                                            key={view.id}
                                            onClick={() => {
                                                onNavigate(view.id);
                                                setIsOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-purple-50 transition-colors ${currentView === view.id ? 'bg-purple-100' : ''
                                                }`}
                                        >
                                            <span className={currentView === view.id ? 'font-bold text-purple-700' : ''}>
                                                {view.label}
                                            </span>
                                            <IconChevronRight className="w-4 h-4 text-gray-400" />
                                        </button>
                                    ))}
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="p-3 bg-gray-50 border-t text-center">
                            <p className="text-xs text-gray-400">Dev only — hidden in production</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DevWorkstation;
