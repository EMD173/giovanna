/**
 * CONSISTENCY MODE: Limiting Participation Wizard
 * 
 * A component that helps parents draft short, direct, 1-3 word prompts
 * to minimize cognitive processing load for neurodivergent children.
 * 
 * FEATURES:
 * - Convert long instructions to short prompts
 * - Processing load indicators
 * - Toggle for capture screens
 * 
 * PHILOSOPHY: Every word is a processing demand. When we limit our
 * participation to the essential, we create space for the child's
 * nervous system to respond without overwhelm.
 */

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    Zap,
    MessageSquare,
    Check,
    RefreshCw,
    Lightbulb,
    ArrowRight
} from 'lucide-react';
import { generateShortPrompt } from '../../lib/ai/agents/oracle';
import type { ShortPrompt } from '../../lib/ai/agents/oracle';

// ============================================================================
// TYPES
// ============================================================================

interface ConsistencyModeProps {
    isActive: boolean;
    onToggle: (active: boolean) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const ConsistencyModeToggle = ({ isActive, onToggle }: ConsistencyModeProps) => (
    <button
        onClick={() => onToggle(!isActive)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all"
        style={{
            background: isActive
                ? 'linear-gradient(145deg, rgba(16, 185, 129, 0.4), rgba(34, 197, 94, 0.4))'
                : 'rgba(255,255,255,0.05)',
            border: isActive
                ? '2px solid rgba(34, 197, 94, 0.6)'
                : '2px solid transparent',
        }}
    >
        <Zap
            className="w-4 h-4"
            style={{ color: isActive ? '#22C55E' : 'rgba(255,255,255,0.5)' }}
        />
        <span className="text-sm font-medium">
            Consistency Mode {isActive ? 'ON' : 'OFF'}
        </span>
    </button>
);

// ============================================================================
// PROMPT SHORTENER WIDGET
// ============================================================================

interface PromptShortenerProps {
    onShortened?: (prompt: ShortPrompt) => void;
}

export const PromptShortener = ({ onShortened }: PromptShortenerProps) => {
    const [input, setInput] = useState('');
    const [result, setResult] = useState<ShortPrompt | null>(null);

    const handleShorten = useCallback(() => {
        if (!input.trim()) return;

        const shortened = generateShortPrompt(input.trim());
        setResult(shortened);
        onShortened?.(shortened);
    }, [input, onShortened]);

    const getLoadColor = (load: ShortPrompt['processingLoad']) => {
        switch (load) {
            case 'minimal': return '#22C55E';
            case 'low': return '#F59E0B';
            case 'moderate': return '#EF4444';
        }
    };

    return (
        <div className="glass-panel rounded-[20px] p-5">
            <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5" style={{ color: '#22C55E' }} />
                <h3 className="font-bold">Short Prompt Generator</h3>
            </div>

            <p className="text-xs opacity-60 mb-4">
                Enter your instruction and get a 1-3 word version that minimizes processing demand.
            </p>

            <div className="space-y-4">
                <div>
                    <label className="text-xs opacity-50 block mb-1">Your instruction:</label>
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="e.g., Please put your shoes on now"
                        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-sm"
                        onKeyDown={e => e.key === 'Enter' && handleShorten()}
                    />
                </div>

                <button
                    onClick={handleShorten}
                    disabled={!input.trim()}
                    className="w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all"
                    style={{
                        background: input.trim()
                            ? 'linear-gradient(145deg, rgba(16, 185, 129, 0.4), rgba(34, 197, 94, 0.4))'
                            : 'rgba(255,255,255,0.05)',
                        opacity: input.trim() ? 1 : 0.5,
                    }}
                >
                    <RefreshCw className="w-4 h-4" />
                    Shorten Prompt
                </button>

                {/* Result */}
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl"
                        style={{
                            background: 'linear-gradient(145deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.05))',
                            border: '1px solid rgba(34, 197, 94, 0.3)',
                        }}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <ArrowRight className="w-4 h-4 opacity-40" />
                            <p
                                className="text-xl font-bold"
                                style={{ color: '#22C55E' }}
                            >
                                "{result.shortened}"
                            </p>
                        </div>

                        <div className="flex items-center gap-4 text-xs">
                            <span className="opacity-60">
                                {result.wordCount} word{result.wordCount !== 1 ? 's' : ''}
                            </span>
                            <span
                                className="px-2 py-0.5 rounded-full"
                                style={{
                                    background: `${getLoadColor(result.processingLoad)}20`,
                                    color: getLoadColor(result.processingLoad),
                                }}
                            >
                                {result.processingLoad} load
                            </span>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

// ============================================================================
// QUICK PROMPTS PANEL (For Capture screen)
// ============================================================================

interface QuickPromptsPanelProps {
    onSelect: (prompt: string) => void;
}

const QUICK_PROMPTS = [
    { short: 'Shoes on', full: 'Put your shoes on' },
    { short: 'Eyes here', full: 'Look at me' },
    { short: 'Come here', full: 'Come to me' },
    { short: 'Sit', full: 'Sit down' },
    { short: 'Clean up', full: 'Clean up toys' },
    { short: 'Walking feet', full: 'Stop running' },
    { short: 'Quiet voice', full: 'Inside voice' },
    { short: 'Hands down', full: 'Keep hands to self' },
];

export const QuickPromptsPanel = ({ onSelect }: QuickPromptsPanelProps) => (
    <div className="space-y-2">
        <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4" style={{ color: '#F59E0B' }} />
            <span className="text-sm font-medium">Quick Short Prompts</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
            {QUICK_PROMPTS.map(({ short, full }) => (
                <button
                    key={short}
                    onClick={() => onSelect(short)}
                    className="p-3 rounded-xl text-left text-sm hover:bg-white/10 transition-all group"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                    <p className="font-bold" style={{ color: '#22C55E' }}>
                        {short}
                    </p>
                    <p className="text-xs opacity-40 group-hover:opacity-60">
                        → {full}
                    </p>
                </button>
            ))}
        </div>
    </div>
);

// ============================================================================
// CONSISTENCY MODE PANEL (Full feature panel for Capture)
// ============================================================================

interface ConsistencyModePanelProps {
    isActive: boolean;
    onToggle: (active: boolean) => void;
    onPromptSelect?: (prompt: string) => void;
}

export const ConsistencyModePanel = ({
    isActive,
    onToggle,
    onPromptSelect
}: ConsistencyModePanelProps) => (
    <div
        className="glass-panel rounded-[24px] p-6"
        style={{
            border: isActive ? '2px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(255,255,255,0.1)',
        }}
    >
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <div
                    className="p-2 rounded-xl"
                    style={{
                        background: isActive
                            ? 'rgba(34, 197, 94, 0.2)'
                            : 'rgba(255,255,255,0.05)'
                    }}
                >
                    <Zap
                        className="w-5 h-5"
                        style={{ color: isActive ? '#22C55E' : 'rgba(255,255,255,0.5)' }}
                    />
                </div>
                <div>
                    <h3 className="font-bold">Consistency Mode</h3>
                    <p className="text-xs opacity-60">Short prompts, less processing</p>
                </div>
            </div>
            <ConsistencyModeToggle isActive={isActive} onToggle={onToggle} />
        </div>

        {isActive && (
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
            >
                <div
                    className="p-4 rounded-xl text-sm"
                    style={{ background: 'rgba(34, 197, 94, 0.1)' }}
                >
                    <p className="flex items-start gap-2">
                        <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#22C55E' }} />
                        <span className="opacity-80">
                            <strong>1-3 words only.</strong> Every extra word is a processing demand.
                            Keep prompts short and direct.
                        </span>
                    </p>
                </div>

                <PromptShortener />

                {onPromptSelect && (
                    <QuickPromptsPanel onSelect={onPromptSelect} />
                )}
            </motion.div>
        )}
    </div>
);

export default ConsistencyModePanel;
