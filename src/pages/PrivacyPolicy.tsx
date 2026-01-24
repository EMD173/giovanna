/**
 * PRIVACY POLICY
 * 
 * Privacy and data handling policy for Giovanna platform.
 * IMPORTANT: This is placeholder text. Consult a lawyer before production.
 */

import { ArrowLeft, Shield, Lock, Eye, Trash2, Download } from 'lucide-react';

interface PrivacyPolicyProps {
    onBack?: () => void;
}

export const PrivacyPolicy = ({ onBack }: PrivacyPolicyProps) => {
    const lastUpdated = 'January 2026';

    const principles = [
        {
            icon: Lock,
            title: 'Zero-Knowledge Architecture',
            description: 'We cannot read your personal observations. Your data is encrypted and only accessible by you.',
        },
        {
            icon: Eye,
            title: 'Minimal Collection',
            description: 'We only collect what is essential for the Service to function. We never sell your data.',
        },
        {
            icon: Trash2,
            title: 'Right to Deletion',
            description: 'You can delete your account and all associated data at any time.',
        },
        {
            icon: Download,
            title: 'Data Portability',
            description: 'Export all your data in a standard format whenever you choose.',
        },
    ];

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
                        <Shield className="w-6 h-6 text-[#4B0082]" />
                    </div>
                    <div>
                        <h1
                            className="text-2xl"
                            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                        >
                            Privacy Policy
                        </h1>
                        <p className="text-xs opacity-60">Last updated: {lastUpdated}</p>
                    </div>
                </div>
            </header>

            {/* Core Principles */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                {principles.map((principle) => (
                    <div key={principle.title} className="glass-panel p-4 rounded-xl text-center">
                        <principle.icon className="w-6 h-6 text-[#4B0082] mx-auto mb-2" />
                        <h3 className="font-bold text-xs mb-1" style={{ color: 'var(--text-primary)' }}>
                            {principle.title}
                        </h3>
                        <p className="text-xs opacity-60 leading-relaxed">
                            {principle.description}
                        </p>
                    </div>
                ))}
            </div>

            {/* Content */}
            <div className="glass-panel p-6 rounded-[24px] space-y-6">
                <section>
                    <h2 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                        1. Information We Collect
                    </h2>
                    <p className="text-sm opacity-80 leading-relaxed mb-2">
                        <strong>Account Information:</strong> Email address, display name, and authentication credentials.
                    </p>
                    <p className="text-sm opacity-80 leading-relaxed mb-2">
                        <strong>User-Generated Content:</strong> Observations, reflections, Oracle queries, and settings you create within the app.
                    </p>
                    <p className="text-sm opacity-80 leading-relaxed">
                        <strong>Usage Data:</strong> Anonymous analytics about feature usage to improve the Service.
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                        2. How We Use Your Information
                    </h2>
                    <ul className="text-sm opacity-80 leading-relaxed space-y-1 list-disc list-inside">
                        <li>To provide and maintain the Service</li>
                        <li>To generate AI-powered insights via the Oracle</li>
                        <li>To improve the Service based on usage patterns</li>
                        <li>To send critical service-related communications</li>
                    </ul>
                </section>

                <section>
                    <h2 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                        3. Data Sharing
                    </h2>
                    <p className="text-sm opacity-80 leading-relaxed">
                        We do not sell, trade, or rent your personal information. We may share anonymized, aggregated data for research purposes only. Village sharing features are opt-in and controlled entirely by you.
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                        4. AI and Oracle
                    </h2>
                    <p className="text-sm opacity-80 leading-relaxed">
                        When you use the Oracle, your queries are anonymized before being processed. Personal identifiers (names, locations, schools) are stripped using our Consciousness Guardrails. We do not train AI models on your personal data.
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                        5. Data Security
                    </h2>
                    <p className="text-sm opacity-80 leading-relaxed">
                        We implement industry-standard security measures including encryption in transit (TLS) and at rest. Firebase provides our infrastructure with SOC 2 compliance.
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                        6. Your Rights
                    </h2>
                    <ul className="text-sm opacity-80 leading-relaxed space-y-1 list-disc list-inside">
                        <li>Access your data at any time</li>
                        <li>Export your data in JSON format</li>
                        <li>Request deletion of your account and all data</li>
                        <li>Opt out of non-essential communications</li>
                    </ul>
                </section>

                <section>
                    <h2 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                        7. Children's Privacy
                    </h2>
                    <p className="text-sm opacity-80 leading-relaxed">
                        This Service is intended for adult caregivers. Information about children is stored under the parent/guardian's account and protected by their credentials.
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                        8. Contact
                    </h2>
                    <p className="text-sm opacity-80 leading-relaxed">
                        For privacy inquiries: privacy@giovanna.app
                    </p>
                </section>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
                <p className="text-xs opacity-50 flex items-center justify-center gap-2">
                    <Lock className="w-3 h-3" />
                    Your data sovereignty is sacred.
                </p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
