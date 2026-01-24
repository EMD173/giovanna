/**
 * SAFETY THRESHOLD: Global Safety Infrastructure
 * 
 * A persistent safety layer for the Divine Neural Sanctuary:
 * - Persistent Footer: AI disclaimer for medical/clinical guidance
 * - SOS Pulse: Floating action button for immediate 911 access
 * 
 * PHILOSOPHY: Safety is not a feature—it is the foundation.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertTriangle,
    Phone,
    X,
    Heart,
    Shield
} from 'lucide-react';

// ============================================================================
// CRISIS RESOURCES
// ============================================================================

const CRISIS_RESOURCES = [
    {
        id: 'emergency',
        name: 'Emergency Services',
        number: '911',
        description: 'Immediate danger to life',
        color: '#EF4444',
    },
    {
        id: 'suicide',
        name: '988 Suicide & Crisis Lifeline',
        number: '988',
        description: '24/7 mental health crisis support',
        color: '#8B5CF6',
    },
    {
        id: 'crisis-text',
        name: 'Crisis Text Line',
        number: 'Text HOME to 741741',
        description: 'Text-based crisis support',
        color: '#3B82F6',
    },
    {
        id: 'parent-hotline',
        name: 'National Parent Helpline',
        number: '1-855-427-2736',
        description: 'Emotional support for parents',
        color: '#10B981',
    },
];

// ============================================================================
// SAFETY FOOTER COMPONENT (Sovereign Disclaimer)
// ============================================================================

export const SafetyFooter = () => (
    <div
        className="fixed bottom-0 left-0 right-0 z-40 py-3 px-4 text-center"
        style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)',
            pointerEvents: 'none',
        }}
    >
        <div
            className="max-w-xl mx-auto"
            style={{ pointerEvents: 'auto' }}
        >
            <p className="text-xs opacity-50 flex items-center justify-center gap-2">
                <Shield className="w-3 h-3 opacity-60" />
                <span>
                    Grounded in Critical Systems Theory; Oracle can err.
                    Consult physicians for medical truth.
                </span>
            </p>
            <p className="text-[10px] opacity-30 mt-1">
                Behavior = Communication • Home Resonance = Sanctuary
            </p>
        </div>
    </div>
);

// ============================================================================
// SOS PULSE BUTTON
// ============================================================================

interface SOSPulseProps {
    className?: string;
}

export const SOSPulse = ({ className = '' }: SOSPulseProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [confirmCall, setConfirmCall] = useState<string | null>(null);

    const handleResourceClick = (number: string) => {
        if (number.startsWith('Text')) {
            // Open SMS for text-based resources
            window.open(`sms:741741?body=HOME`, '_blank');
        } else if (confirmCall === number) {
            // Second tap confirms the call
            window.open(`tel:${number}`, '_blank');
            setConfirmCall(null);
            setIsOpen(false);
        } else {
            // First tap shows confirmation
            setConfirmCall(number);
        }
    };

    return (
        <>
            {/* Floating SOS Button */}
            <motion.button
                onClick={() => setIsOpen(true)}
                className={`fixed z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-xl ${className}`}
                style={{
                    bottom: '80px',
                    right: '20px',
                    background: 'linear-gradient(145deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 1) 100%)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 4px 20px rgba(239, 68, 68, 0.4)',
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
            >
                {/* Pulse animation */}
                <motion.div
                    className="absolute inset-0 rounded-full"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    style={{
                        background: 'rgba(239, 68, 68, 0.4)',
                    }}
                />
                <Phone className="w-6 h-6 text-white relative z-10" />
            </motion.button>

            {/* Crisis Resources Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-end justify-center p-4"
                        style={{ background: 'rgba(0, 0, 0, 0.7)' }}
                        onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                setIsOpen(false);
                                setConfirmCall(null);
                            }
                        }}
                    >
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="w-full max-w-md"
                            style={{
                                background: 'linear-gradient(145deg, rgba(30,30,40,0.98) 0%, rgba(20,20,30,0.98) 100%)',
                                backdropFilter: 'blur(24px)',
                                borderRadius: '32px 32px 0 0',
                                border: '1px solid rgba(255,255,255,0.1)',
                            }}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/10">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="p-2 rounded-xl"
                                        style={{ background: 'rgba(239, 68, 68, 0.2)' }}
                                    >
                                        <AlertTriangle className="w-5 h-5 text-red-400" />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-lg">Crisis Support</h2>
                                        <p className="text-xs opacity-60">
                                            You are not alone. Help is available.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        setConfirmCall(null);
                                    }}
                                    className="p-2 rounded-full hover:bg-white/10"
                                >
                                    <X className="w-5 h-5 opacity-60" />
                                </button>
                            </div>

                            {/* Resources List */}
                            <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
                                {CRISIS_RESOURCES.map((resource) => (
                                    <motion.button
                                        key={resource.id}
                                        onClick={() => handleResourceClick(resource.number)}
                                        className="w-full p-4 rounded-2xl text-left transition-all"
                                        style={{
                                            background: confirmCall === resource.number
                                                ? `${resource.color}30`
                                                : 'rgba(255,255,255,0.05)',
                                            border: confirmCall === resource.number
                                                ? `2px solid ${resource.color}`
                                                : '2px solid transparent',
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-2 h-2 rounded-full"
                                                        style={{ background: resource.color }}
                                                    />
                                                    <span className="font-semibold text-sm">
                                                        {resource.name}
                                                    </span>
                                                </div>
                                                <p className="text-xs opacity-60 mt-1">
                                                    {resource.description}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <span
                                                    className="font-bold"
                                                    style={{ color: resource.color }}
                                                >
                                                    {resource.number}
                                                </span>
                                                {confirmCall === resource.number && (
                                                    <p className="text-xs text-red-400 mt-1">
                                                        Tap again to call
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>

                            {/* Safety Message */}
                            <div className="p-4 border-t border-white/10">
                                <div
                                    className="p-4 rounded-xl"
                                    style={{ background: 'rgba(139, 92, 246, 0.1)' }}
                                >
                                    <div className="flex items-start gap-3">
                                        <Heart className="w-5 h-5 mt-0.5" style={{ color: '#A78BFA' }} />
                                        <div>
                                            <p className="text-sm font-medium mb-1">
                                                You are doing hard things.
                                            </p>
                                            <p className="text-xs opacity-70">
                                                Reaching out is strength, not weakness. Your child needs
                                                you regulated, and that may mean asking for help.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

// ============================================================================
// COMBINED SAFETY THRESHOLD WRAPPER
// ============================================================================

interface SafetyThresholdProps {
    children: React.ReactNode;
    showFooter?: boolean;
    showSOS?: boolean;
}

export const SafetyThreshold = ({
    children,
    showFooter = true,
    showSOS = true
}: SafetyThresholdProps) => {
    return (
        <>
            {children}
            {showFooter && <SafetyFooter />}
            {showSOS && <SOSPulse />}
        </>
    );
};

export default SafetyThreshold;
