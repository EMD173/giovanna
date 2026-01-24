/**
 * SUBSCRIPTION MODAL: Village Tier Upgrade Gateway
 * 
 * A premium, dignity-centered modal explaining the benefits
 * of the Village Tier subscription for practitioner access.
 * 
 * DESIGN: Liquid Glass + Gold Leaf accents
 * TONE: Respectful invitation, not upsell pressure
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Crown,
    Shield,
    Users,
    FileText,
    Sparkles,
    Check,
    Lock,
    Heart,
    Clock,
    Share2,
    Key
} from 'lucide-react';

interface SubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubscribe?: () => void;
    featureRequested?: string;
}

interface TierFeature {
    icon: React.ReactNode;
    title: string;
    description: string;
    included: boolean;
}

const SANCTUARY_FEATURES: TierFeature[] = [
    {
        icon: <Shield className="w-5 h-5" />,
        title: 'Secure Sanctuary Keys',
        description: 'Generate time-bound, encrypted access keys for practitioners',
        included: true,
    },
    {
        icon: <FileText className="w-5 h-5" />,
        title: 'Sovereign Care Plan Export',
        description: 'Professional-grade documentation for IEP meetings',
        included: true,
    },
    {
        icon: <Users className="w-5 h-5" />,
        title: 'Practitioner Portal Access',
        description: 'Read-only, strength-based view for care team members',
        included: true,
    },
    {
        icon: <Clock className="w-5 h-5" />,
        title: 'Time-Bound Sharing',
        description: 'Set custom expiration dates for all shared access',
        included: true,
    },
    {
        icon: <Share2 className="w-5 h-5" />,
        title: 'Institutional Sharing',
        description: 'Send secure summaries directly to schools and clinics',
        included: true,
    },
    {
        icon: <Heart className="w-5 h-5" />,
        title: 'Dignity-First Narratives',
        description: 'AI-crafted summaries that center your child\'s strengths',
        included: true,
    },
];

const SubscriptionModal = ({
    isOpen,
    onClose,
    onSubscribe,
    featureRequested
}: SubscriptionModalProps) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubscribe = async () => {
        setIsProcessing(true);
        // Simulate processing
        await new Promise(resolve => setTimeout(resolve, 1500));
        onSubscribe?.();
        setIsProcessing(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
                    onClick={(e) => e.target === e.currentTarget && onClose()}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto"
                        style={{
                            background: 'linear-gradient(145deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                            backdropFilter: 'blur(24px)',
                            borderRadius: '32px',
                            border: '2px solid rgba(212, 175, 55, 0.4)',
                            boxShadow: '0 8px 32px rgba(212, 175, 55, 0.15), inset 0 1px 0 rgba(255,255,255,0.2)',
                        }}
                    >
                        {/* Gold Leaf Header Accent */}
                        <div
                            className="absolute top-0 left-0 right-0 h-1 rounded-t-[32px]"
                            style={{
                                background: 'linear-gradient(90deg, #D4AF37 0%, #E8C547 50%, #D4AF37 100%)',
                            }}
                        />

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <X className="w-5 h-5 opacity-60" />
                        </button>

                        <div className="p-8">
                            {/* Crown Icon */}
                            <div className="flex justify-center mb-4">
                                <div
                                    className="p-4 rounded-2xl"
                                    style={{
                                        background: 'linear-gradient(145deg, rgba(212, 175, 55, 0.3) 0%, rgba(212, 175, 55, 0.1) 100%)',
                                        border: '1px solid rgba(212, 175, 55, 0.4)',
                                    }}
                                >
                                    <Crown
                                        className="w-8 h-8"
                                        style={{ color: '#D4AF37' }}
                                    />
                                </div>
                            </div>

                            {/* Title */}
                            <h2
                                className="text-2xl font-bold text-center mb-2"
                                style={{
                                    fontFamily: "'Playfair Display', serif",
                                    color: 'var(--text-primary)',
                                }}
                            >
                                Activate Your Village
                            </h2>

                            <p className="text-center text-sm opacity-70 mb-6">
                                Extend your child's sanctuary to their care team with secure,
                                dignity-first practitioner access.
                            </p>

                            {/* Feature Requested Badge */}
                            {featureRequested && (
                                <div
                                    className="flex items-center justify-center gap-2 py-2 px-4 rounded-full mx-auto mb-6 w-fit"
                                    style={{
                                        background: 'rgba(212, 175, 55, 0.15)',
                                        border: '1px solid rgba(212, 175, 55, 0.3)',
                                    }}
                                >
                                    <Key className="w-4 h-4" style={{ color: '#D4AF37' }} />
                                    <span className="text-sm font-medium">
                                        Unlock: {featureRequested}
                                    </span>
                                </div>
                            )}

                            {/* Features List */}
                            <div className="space-y-3 mb-8">
                                {SANCTUARY_FEATURES.map((feature, index) => (
                                    <motion.div
                                        key={feature.title}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-start gap-3 p-3 rounded-xl"
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.05)',
                                        }}
                                    >
                                        <div
                                            className="p-2 rounded-lg shrink-0"
                                            style={{
                                                background: 'rgba(212, 175, 55, 0.2)',
                                            }}
                                        >
                                            <span style={{ color: '#D4AF37' }}>
                                                {feature.icon}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-sm">
                                                    {feature.title}
                                                </span>
                                                <Check
                                                    className="w-4 h-4"
                                                    style={{ color: '#4CAF50' }}
                                                />
                                            </div>
                                            <p className="text-xs opacity-60 mt-0.5">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Pricing */}
                            <div
                                className="text-center p-4 rounded-2xl mb-6"
                                style={{
                                    background: 'linear-gradient(145deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%)',
                                    border: '1px solid rgba(212, 175, 55, 0.25)',
                                }}
                            >
                                <div className="flex items-baseline justify-center gap-1 mb-1">
                                    <span
                                        className="text-3xl font-bold"
                                        style={{ color: '#D4AF37' }}
                                    >
                                        $9.99
                                    </span>
                                    <span className="text-sm opacity-60">/month</span>
                                </div>
                                <p className="text-xs opacity-60">
                                    Cancel anytime · First month free
                                </p>
                            </div>

                            {/* CTA Buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={handleSubscribe}
                                    disabled={isProcessing}
                                    className="w-full py-4 px-6 rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition-all"
                                    style={{
                                        background: isProcessing
                                            ? 'rgba(212, 175, 55, 0.5)'
                                            : 'linear-gradient(145deg, #D4AF37 0%, #C4A032 100%)',
                                        boxShadow: isProcessing
                                            ? 'none'
                                            : '0 4px 20px rgba(212, 175, 55, 0.4)',
                                    }}
                                >
                                    {isProcessing ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                            >
                                                <Sparkles className="w-5 h-5" />
                                            </motion.div>
                                            Opening Gateway...
                                        </>
                                    ) : (
                                        <>
                                            <Crown className="w-5 h-5" />
                                            Activate Village Tier
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={onClose}
                                    className="w-full py-3 px-6 rounded-xl text-sm opacity-60 hover:opacity-100 transition-opacity"
                                >
                                    Maybe later
                                </button>
                            </div>

                            {/* Trust Badge */}
                            <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-white/10">
                                <Lock className="w-4 h-4 opacity-40" />
                                <span className="text-xs opacity-40">
                                    Secure, encrypted · You control all access
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SubscriptionModal;
