/**
 * ONBOARDING FLOW
 * 
 * 3-slide intro carousel for new users.
 * Explains: Oracle, Vocal Ledger, Village features.
 */

import { useState } from 'react';
import { ChevronRight, ChevronLeft, Sparkles, Mic, Users, Heart, ArrowRight } from 'lucide-react';

interface OnboardingProps {
    onComplete: () => void;
}

interface OnboardingSlide {
    id: number;
    icon: typeof Sparkles;
    title: string;
    subtitle: string;
    description: string;
    color: string;
}

const slides: OnboardingSlide[] = [
    {
        id: 1,
        icon: Heart,
        title: 'Welcome to Giovanna',
        subtitle: 'Your Sovereign Sanctuary',
        description: 'A sacred space where your parental wisdom is honored. Here, you are the expert on your child. Everything we build supports your knowing.',
        color: '#D4AF37',
    },
    {
        id: 2,
        icon: Mic,
        title: 'The Vocal Ledger',
        subtitle: 'Document with Your Voice',
        description: 'Speak your observations and we\'ll capture them. No typing required. Every moment you witness becomes part of your child\'s sovereign record.',
        color: '#4B0082',
    },
    {
        id: 3,
        icon: Sparkles,
        title: 'The Oracle',
        subtitle: 'Pattern Recognition & Insight',
        description: 'Our AI companion sees patterns across your observations. It translates clinical language into dignity and helps you advocate for your child.',
        color: '#8B5CF6',
    },
    {
        id: 4,
        icon: Users,
        title: 'The Village',
        subtitle: 'Coordinated Care',
        description: 'Share selected insights with teachers, therapists, and doctors. You control what they see. The Village supports your journey together.',
        color: '#059669',
    },
];

export const Onboarding = ({ onComplete }: OnboardingProps) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const slide = slides[currentSlide];
    const isLastSlide = currentSlide === slides.length - 1;

    const handleNext = () => {
        if (isLastSlide) {
            onComplete();
        } else {
            setCurrentSlide((prev) => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentSlide > 0) {
            setCurrentSlide((prev) => prev - 1);
        }
    };

    const handleSkip = () => {
        onComplete();
    };

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{
                background: `linear-gradient(135deg, ${slide.color}15 0%, ${slide.color}05 100%)`,
            }}
        >
            {/* Skip Button */}
            <div className="flex justify-end p-4">
                <button
                    onClick={handleSkip}
                    className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity"
                    style={{ color: 'var(--text-primary)' }}
                >
                    Skip
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-8 pb-8">
                {/* Icon */}
                <div
                    className="w-24 h-24 rounded-full flex items-center justify-center mb-8 transition-all duration-500"
                    style={{ backgroundColor: `${slide.color}20` }}
                >
                    <slide.icon
                        className="w-12 h-12 transition-all duration-500"
                        style={{ color: slide.color }}
                    />
                </div>

                {/* Text */}
                <div className="text-center max-w-sm transition-all duration-500">
                    <h1
                        className="text-3xl mb-2"
                        style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                    >
                        {slide.title}
                    </h1>
                    <p
                        className="text-lg font-semibold mb-4"
                        style={{ color: slide.color }}
                    >
                        {slide.subtitle}
                    </p>
                    <p
                        className="text-sm leading-relaxed opacity-70"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        {slide.description}
                    </p>
                </div>
            </div>

            {/* Navigation */}
            <div className="p-8">
                {/* Dots */}
                <div className="flex justify-center gap-2 mb-6">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide
                                    ? 'w-8'
                                    : 'opacity-30'
                                }`}
                            style={{
                                backgroundColor: index === currentSlide ? slide.color : '#1A1A1A',
                            }}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                    {currentSlide > 0 && (
                        <button
                            onClick={handlePrevious}
                            className="flex-1 py-4 rounded-xl font-semibold border-2 flex items-center justify-center gap-2"
                            style={{
                                borderColor: slide.color + '40',
                                color: slide.color,
                            }}
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Back
                        </button>
                    )}

                    <button
                        onClick={handleNext}
                        className="flex-1 py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        style={{
                            background: `linear-gradient(135deg, ${slide.color} 0%, ${slide.color}CC 100%)`,
                        }}
                    >
                        {isLastSlide ? (
                            <>
                                Enter the Sanctuary
                                <ArrowRight className="w-5 h-5" />
                            </>
                        ) : (
                            <>
                                Next
                                <ChevronRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
