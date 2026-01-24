/**
 * InstallPrompt - PWA Install Prompt Component
 * 
 * Shows a beautiful prompt inviting users to install Giovanna
 * on their home screen. Only shows once per device.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPrompt = () => {
    const [showPrompt, setShowPrompt] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Check if already dismissed or installed
        const dismissed = localStorage.getItem('giovanna-install-dismissed');
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

        if (dismissed || isStandalone) return;

        // Detect iOS
        const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        setIsIOS(iOS);

        // For iOS, show after a delay
        if (iOS) {
            const timer = setTimeout(() => setShowPrompt(true), 3000);
            return () => clearTimeout(timer);
        }

        // For Android/Chrome, wait for beforeinstallprompt event
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setTimeout(() => setShowPrompt(true), 2000);
        };

        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (deferredPrompt) {
            await deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setShowPrompt(false);
            }
            setDeferredPrompt(null);
        }
    };

    const handleDismiss = () => {
        localStorage.setItem('giovanna-install-dismissed', 'true');
        setShowPrompt(false);
    };

    if (!showPrompt) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                className="install-prompt-overlay"
                style={{
                    position: 'fixed',
                    bottom: '80px',
                    left: '16px',
                    right: '16px',
                    zIndex: 1000,
                }}
            >
                <div
                    style={{
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.95), rgba(217, 119, 6, 0.95))',
                        borderRadius: '20px',
                        padding: '20px',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                        backdropFilter: 'blur(10px)',
                        color: 'white',
                        position: 'relative',
                    }}
                >
                    {/* Close Button */}
                    <button
                        onClick={handleDismiss}
                        style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            background: 'rgba(255, 255, 255, 0.2)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                        }}
                    >
                        <X size={16} />
                    </button>

                    {/* Content */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div
                            style={{
                                width: '50px',
                                height: '50px',
                                background: 'white',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Smartphone size={28} color="#8B5CF6" />
                        </div>

                        <div style={{ flex: 1 }}>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>
                                Add Giovanna to Home
                            </h3>
                            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', opacity: 0.9 }}>
                                {isIOS
                                    ? 'One tap access — no typing URLs'
                                    : 'Skip the browser. Instant access when you need it most.'}
                            </p>
                        </div>
                    </div>

                    {/* Install Button (Android only) */}
                    {!isIOS && deferredPrompt && (
                        <button
                            onClick={handleInstall}
                            style={{
                                marginTop: '16px',
                                width: '100%',
                                padding: '12px',
                                background: 'white',
                                color: '#8B5CF6',
                                border: 'none',
                                borderRadius: '12px',
                                fontWeight: 600,
                                fontSize: '1rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                            }}
                        >
                            <Download size={18} />
                            Install Now
                        </button>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default InstallPrompt;
