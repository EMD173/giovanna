/**
 * TERMS OF SERVICE
 * 
 * Legal terms for Giovanna platform usage.
 * IMPORTANT: This is placeholder text. Consult a lawyer before production.
 */

import { ArrowLeft, FileText, Shield, AlertCircle } from 'lucide-react';

interface TermsOfServiceProps {
    onBack?: () => void;
}

export const TermsOfService = ({ onBack }: TermsOfServiceProps) => {
    const lastUpdated = 'January 2026';

    return (
        <div
            className="min-h-screen pb-12 px-4 pt-6"
            style={{ backgroundColor: 'rgb(var(--glass-base))' }}
        >
            {/* Header */}
            <header className="mb-6">
                {onBack && (
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-sm opacity-70 hover:opacity-100 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                )}
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-[#4B0082]/10">
                        <FileText className="w-6 h-6 text-[#4B0082]" />
                    </div>
                    <div>
                        <h1
                            className="text-2xl"
                            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                        >
                            Terms of Service
                        </h1>
                        <p className="text-xs opacity-60">Last updated: {lastUpdated}</p>
                    </div>
                </div>
            </header>

            {/* Alert */}
            <div className="glass-panel p-4 rounded-xl mb-6 flex items-start gap-3 border-l-4 border-[#D4AF37]">
                <AlertCircle className="w-5 h-5 text-[#D4AF37] mt-0.5" />
                <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Important Notice
                    </p>
                    <p className="text-xs opacity-70">
                        By using Giovanna, you agree to these terms. Please read them carefully.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="glass-panel p-6 rounded-[24px] space-y-6">
                <section>
                    <h2 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                        1. Acceptance of Terms
                    </h2>
                    <p className="text-sm opacity-80 leading-relaxed">
                        By accessing or using the Giovanna platform ("Service"), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the Service.
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                        2. Description of Service
                    </h2>
                    <p className="text-sm opacity-80 leading-relaxed">
                        Giovanna is a parent-led therapeutic documentation and support platform. The Service provides tools for documenting observations, receiving AI-generated insights (the "Oracle"), and coordinating with care teams. Giovanna is NOT a substitute for professional medical, psychological, or therapeutic advice.
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                        3. User Accounts
                    </h2>
                    <p className="text-sm opacity-80 leading-relaxed">
                        You are responsible for maintaining the confidentiality of your account credentials. You agree to accept responsibility for all activities that occur under your account. You must be at least 18 years old to create an account.
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                        4. Data Sovereignty & Privacy
                    </h2>
                    <p className="text-sm opacity-80 leading-relaxed">
                        Your data belongs to you. We operate on a "Zero-Knowledge" principle where your personal observations and family data are encrypted and inaccessible to us. See our Privacy Policy for details on data handling.
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                        5. Oracle AI Disclaimer
                    </h2>
                    <p className="text-sm opacity-80 leading-relaxed">
                        The Oracle provides AI-generated insights based on patterns in your observations. These insights are for informational purposes only and should not be considered medical, psychological, or therapeutic advice. Always consult qualified professionals for healthcare decisions.
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                        6. Limitation of Liability
                    </h2>
                    <p className="text-sm opacity-80 leading-relaxed">
                        Giovanna and its creators shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service.
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                        7. Changes to Terms
                    </h2>
                    <p className="text-sm opacity-80 leading-relaxed">
                        We reserve the right to modify these terms at any time. We will provide notice of significant changes via the Service. Continued use after changes constitutes acceptance.
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                        8. Contact
                    </h2>
                    <p className="text-sm opacity-80 leading-relaxed">
                        For questions about these Terms, please contact: support@giovanna.app
                    </p>
                </section>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
                <p className="text-xs opacity-50 flex items-center justify-center gap-2">
                    <Shield className="w-3 h-3" />
                    Your sovereignty is our priority.
                </p>
            </div>
        </div>
    );
};

export default TermsOfService;
