/**
 * ABOUT ELI: The Sacred Story
 * 
 * A regal, scrollable glass panel presenting the 'Why This App' narrative
 * for social workers, parents, sponsors, and researchers.
 * 
 * CONTENT:
 * - Legacy of Mutual Recognition narrative
 * - 30-year journey from ABA to Epigenetic Consciousness
 * - Giovanna case study and "Mommy Said No" mantra
 * - PhD Research foundation
 */

import { useState } from 'react';
import {
    Heart,
    BookOpen,
    GraduationCap,
    Users,
    Sparkles,
    ChevronDown,
    ChevronUp,
    Quote,
    Calendar
} from 'lucide-react';

interface TimelineEvent {
    year: number;
    title: string;
    description: string;
    icon: React.ReactNode;
}

const LEGACY_TIMELINE: TimelineEvent[] = [
    {
        year: 1996,
        title: 'Service Begins',
        description: 'Started working with families navigating autism, ADHD, and learning differences. Witnessed the gap between institutional language and family reality.',
        icon: <Heart className="w-5 h-5" />
    },
    {
        year: 2003,
        title: 'ABA Foundation',
        description: 'Trained in Applied Behavior Analysis. Learned its power—and its limits. Began questioning deficit-based frameworks.',
        icon: <BookOpen className="w-5 h-5" />
    },
    {
        year: 2013,
        title: 'Giovanna: The Anchor',
        description: 'Met a child whose mother said three words that changed everything: "Mommy Said No." Witnessed the power of parental consistency as sacred healing logic.',
        icon: <Sparkles className="w-5 h-5" />
    },
    {
        year: 2020,
        title: 'PhD Research Begins',
        description: 'Enrolled in doctoral program to formalize Epigenetic Consciousness and Critical Systems Theory as theoretical frameworks for neurodivergent healing.',
        icon: <GraduationCap className="w-5 h-5" />
    },
    {
        year: 2026,
        title: 'Global Deployment',
        description: 'Giovanna launches worldwide—a sovereign healing sanctuary for every family navigating the intersection of neurodivergence and institutional systems.',
        icon: <Users className="w-5 h-5" />
    }
];

export const AboutEli = () => {
    const [expandedSection, setExpandedSection] = useState<string | null>('vision');

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    return (
        <div
            className="min-h-screen p-4 pb-24"
            style={{ backgroundColor: 'rgb(var(--glass-base))' }}
        >
            {/* Header */}
            <div className="mb-6">
                <h1
                    className="text-2xl"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                >
                    The Visionary Story
                </h1>
                <p className="text-sm opacity-60">Why this app exists</p>
            </div>

            {/* Vision Section */}
            <section className="glass-panel rounded-[24px] p-6 mb-4">
                <button
                    onClick={() => toggleSection('vision')}
                    className="w-full flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <Heart className="w-6 h-6 text-[#D4AF37]" />
                        <h2
                            className="text-xl"
                            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                        >
                            Legacy of Mutual Recognition
                        </h2>
                    </div>
                    {expandedSection === 'vision' ? (
                        <ChevronUp className="w-5 h-5 opacity-50" />
                    ) : (
                        <ChevronDown className="w-5 h-5 opacity-50" />
                    )}
                </button>

                {expandedSection === 'vision' && (
                    <div className="mt-4 space-y-4 animate-fade-in">
                        <p className="text-base leading-relaxed opacity-80">
                            For thirty years, I have walked beside families navigating the intersection
                            of neurodivergence and institutional systems. I have witnessed parents
                            dismissed by schools, pathologized by clinicians, and exhausted by
                            advocacy.
                        </p>
                        <p className="text-base leading-relaxed opacity-80">
                            I built Giovanna because I believe parents are the experts on their
                            own children. Not the IEP team. Not the behaviorist. Not the diagnosis.
                            <strong className="text-[#4B0082]"> You.</strong>
                        </p>
                        <p className="text-base leading-relaxed opacity-80">
                            This app is a sacred space for witnessing—for documenting not what
                            your child "can't do," but who they actually are when the institution
                            isn't watching.
                        </p>
                    </div>
                )}
            </section>

            {/* Giovanna Story Section */}
            <section className="glass-panel rounded-[24px] p-6 mb-4">
                <button
                    onClick={() => toggleSection('giovanna')}
                    className="w-full flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <Sparkles className="w-6 h-6 text-[#4B0082]" />
                        <h2
                            className="text-xl"
                            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                        >
                            The Giovanna Story
                        </h2>
                    </div>
                    {expandedSection === 'giovanna' ? (
                        <ChevronUp className="w-5 h-5 opacity-50" />
                    ) : (
                        <ChevronDown className="w-5 h-5 opacity-50" />
                    )}
                </button>

                {expandedSection === 'giovanna' && (
                    <div className="mt-4 space-y-4 animate-fade-in">
                        <div
                            className="bg-[#4B0082]/10 rounded-xl p-4 border-l-4 border-[#4B0082]"
                        >
                            <Quote className="w-5 h-5 text-[#4B0082] mb-2" />
                            <p className="text-lg italic" style={{ fontFamily: 'var(--font-display)' }}>
                                "Mommy Said No."
                            </p>
                        </div>

                        <p className="text-base leading-relaxed opacity-80">
                            In 2013, I met a mother who changed how I understood healing. Her
                            daughter—let's call her Giovanna—was labeled "non-compliant" by her
                            school. The BIP called for "behavior reduction." The team wanted
                            consequences.
                        </p>
                        <p className="text-base leading-relaxed opacity-80">
                            But her mother knew something the institution didn't: Giovanna wasn't
                            defiant. She was <em>consistent</em>. When her mother set a boundary,
                            Giovanna tested it—not to manipulate, but to ensure the world was
                            predictable.
                        </p>
                        <p className="text-base leading-relaxed opacity-80">
                            "Mommy Said No" became the anchor phrase. Not harsh. Not punitive.
                            Just consistent. And within months, Giovanna flourished—not because
                            she was "fixed," but because she was <strong>understood</strong>.
                        </p>
                        <p className="text-base leading-relaxed opacity-80">
                            This app is named for that child. For every child whose nervous
                            system craves the predictability that only parental witness can provide.
                        </p>
                    </div>
                )}
            </section>

            {/* PhD Research Section */}
            <section className="glass-panel rounded-[24px] p-6 mb-4">
                <button
                    onClick={() => toggleSection('research')}
                    className="w-full flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <GraduationCap className="w-6 h-6 text-[#D4AF37]" />
                        <h2
                            className="text-xl"
                            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                        >
                            The Research Foundation
                        </h2>
                    </div>
                    {expandedSection === 'research' ? (
                        <ChevronUp className="w-5 h-5 opacity-50" />
                    ) : (
                        <ChevronDown className="w-5 h-5 opacity-50" />
                    )}
                </button>

                {expandedSection === 'research' && (
                    <div className="mt-4 space-y-4 animate-fade-in">
                        <h3 className="font-bold text-[#4B0082]">Epigenetic Consciousness</h3>
                        <p className="text-base leading-relaxed opacity-80">
                            Your child's nervous system carries ancestral memory. Trauma, resilience,
                            and healing patterns encoded in gene expression. This isn't "behavior"—
                            it's biology responding to environment.
                        </p>

                        <h3 className="font-bold text-[#4B0082]">Critical Systems Theory</h3>
                        <p className="text-base leading-relaxed opacity-80">
                            Schools, clinics, and courts are systems with their own logic—often
                            designed for efficiency, not dignity. We must name these systems to
                            navigate them without being consumed.
                        </p>

                        <h3 className="font-bold text-[#4B0082]">Relational Resonance</h3>
                        <p className="text-base leading-relaxed opacity-80">
                            Healing happens in relationship. Not in "interventions." The Oracle
                            reflects your observations back to you with depth and dignity—not to
                            replace your expertise, but to amplify it.
                        </p>
                    </div>
                )}
            </section>

            {/* Legacy Timeline */}
            <section className="glass-panel rounded-[24px] p-6 mb-4">
                <button
                    onClick={() => toggleSection('timeline')}
                    className="w-full flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <Calendar className="w-6 h-6 text-[#4B0082]" />
                        <h2
                            className="text-xl"
                            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                        >
                            30 Years of Service
                        </h2>
                    </div>
                    {expandedSection === 'timeline' ? (
                        <ChevronUp className="w-5 h-5 opacity-50" />
                    ) : (
                        <ChevronDown className="w-5 h-5 opacity-50" />
                    )}
                </button>

                {expandedSection === 'timeline' && (
                    <div className="mt-4 space-y-0 animate-fade-in">
                        {LEGACY_TIMELINE.map((event, index) => (
                            <div
                                key={event.year}
                                className="relative pl-12 pb-6 last:pb-0"
                            >
                                {/* Timeline line */}
                                {index < LEGACY_TIMELINE.length - 1 && (
                                    <div
                                        className="absolute left-[18px] top-8 w-0.5 h-full bg-linear-to-b from-[#4B0082] to-[#D4AF37]"
                                    />
                                )}

                                {/* Timeline dot */}
                                <div
                                    className="absolute left-0 top-0 w-9 h-9 rounded-full bg-linear-to-br from-[#4B0082] to-[#D4AF37] flex items-center justify-center text-white"
                                >
                                    {event.icon}
                                </div>

                                {/* Content */}
                                <div className="pt-1">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-xl font-bold text-[#4B0082]">
                                            {event.year}
                                        </span>
                                        <span className="text-base font-semibold">
                                            {event.title}
                                        </span>
                                    </div>
                                    <p className="text-sm opacity-70 mt-1">
                                        {event.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Signature */}
            <div className="text-center py-8 opacity-60">
                <p className="text-sm italic" style={{ fontFamily: 'var(--font-display)' }}>
                    Built with love by Eli Marshall Davis
                </p>
                <p className="text-xs mt-1">
                    For every parent who has ever felt unseen.
                </p>
            </div>

            <style>{`
                .animate-fade-in {
                    animation: fadeIn 0.4s ease-out forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default AboutEli;
