import { useState } from 'react';
import { Search, Wind, Moon, Music, Zap, Heart, X, Check, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Strategy {
    id: number;
    title: string;
    category: string;
    icon: React.ReactNode;
    color: string;
    description: string;
    steps: string[];
}

export const Journey = () => {
    const [filter, setFilter] = useState('All');
    const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const strategies: Strategy[] = [
        {
            id: 1,
            title: 'Deep Pressure',
            category: 'Sensory',
            icon: <Wind size={24} />,
            color: 'bg-blue-500',
            description: 'Apply firm, even pressure to help calm the nervous system and reduce anxiety.',
            steps: [
                'Find a weighted blanket or compression vest',
                'Apply gentle, firm pressure across body',
                'Hold for 5-10 minutes or as needed',
                'Breathe slowly and deeply together',
            ],
        },
        {
            id: 2,
            title: 'Dim Lighting',
            category: 'Environment',
            icon: <Moon size={24} />,
            color: 'bg-indigo-500',
            description: 'Reduce visual stimulation by lowering lights to create a calming environment.',
            steps: [
                'Turn off overhead lights',
                'Use a dim lamp or nightlight',
                'Close curtains or blinds',
                'Create a cozy, darker space',
            ],
        },
        {
            id: 3,
            title: 'Safe Song',
            category: 'Auditory',
            icon: <Music size={24} />,
            color: 'bg-purple-500',
            description: 'Play familiar, soothing music that provides comfort and predictability.',
            steps: [
                'Choose a favorite calming song',
                'Play at a low, comfortable volume',
                'Hum or sing along if helpful',
                'Use headphones if noise-canceling helps',
            ],
        },
        {
            id: 4,
            title: 'Heavy Work',
            category: 'Proprioception',
            icon: <Zap size={24} />,
            color: 'bg-orange-500',
            description: 'Engage muscles through pushing, pulling, or carrying to help regulate the body.',
            steps: [
                'Push against a wall for 10 seconds',
                'Carry a heavy book or backpack',
                'Do wall push-ups or chair push-ups',
                'Jump on a trampoline if available',
            ],
        },
        {
            id: 5,
            title: 'Co-Regulation',
            category: 'Social',
            icon: <Heart size={24} />,
            color: 'bg-pink-500',
            description: 'Stay calm and present to help your child borrow your regulated state.',
            steps: [
                'Take slow, visible breaths',
                'Speak in a calm, low tone',
                'Offer quiet physical presence',
                'Wait patiently without rushing',
            ],
        },
    ];

    const filteredStrategies = strategies.filter((s) => {
        const matchesFilter = filter === 'All' || s.category === filter;
        const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="flex flex-col space-y-6 pt-8 pb-32 fade-in">

            {/* HEADER */}
            <header className="px-2">
                <h2 className="text-sm font-bold tracking-widest text-[#4B0082] uppercase opacity-80">
                    Your Toolbox
                </h2>
                <h1 className="text-3xl font-serif text-[#1A1A1A] mt-1">
                    Strategies
                </h1>
            </header>

            {/* SEARCH BAR */}
            <div className="px-2">
                <div className="glass-panel p-3 rounded-2xl flex items-center space-x-3">
                    <Search className="w-5 h-5 text-[#1A1A1A]/40" />
                    <input
                        type="text"
                        placeholder="Find a strategy..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent w-full focus:outline-none text-[#1A1A1A] placeholder-[#1A1A1A]/40"
                    />
                </div>
            </div>

            {/* FILTER TABS */}
            <div className="flex space-x-2 px-2 overflow-x-auto no-scrollbar">
                {['All', 'Sensory', 'Environment', 'Auditory', 'Proprioception', 'Social'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${filter === tab
                            ? 'bg-[#4B0082] text-white shadow-md'
                            : 'bg-white/40 text-[#1A1A1A]/70 border border-white/50'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* STRATEGY GRID */}
            <div className="grid grid-cols-2 gap-4 px-2">
                {filteredStrategies.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setSelectedStrategy(item)}
                        className="glass-panel p-4 rounded-[24px] flex flex-col items-center justify-center text-center space-y-3 aspect-square active:scale-95 transition-transform cursor-pointer hover:shadow-lg"
                    >
                        <div className={`p-4 rounded-full text-white shadow-lg ${item.color} bg-opacity-80`}>
                            {item.icon}
                        </div>
                        <div>
                            <h3 className="font-bold text-[#1A1A1A] leading-tight">{item.title}</h3>
                            <span className="text-[10px] uppercase font-bold text-[#1A1A1A]/40 tracking-wider">
                                {item.category}
                            </span>
                        </div>
                    </button>
                ))}

                {/* 'ADD NEW' CARD */}
                <button className="border-2 border-dashed border-[#1A1A1A]/20 rounded-[24px] flex flex-col items-center justify-center text-center space-y-2 aspect-square active:bg-black/5 transition-colors cursor-pointer hover:border-[#4B0082]/40">
                    <div className="w-12 h-12 rounded-full bg-[#1A1A1A]/5 flex items-center justify-center">
                        <span className="text-2xl text-[#1A1A1A]/40">+</span>
                    </div>
                    <span className="text-sm font-bold text-[#1A1A1A]/40">Add New</span>
                </button>
            </div>

            {/* STRATEGY DETAIL MODAL */}
            <AnimatePresence>
                {selectedStrategy && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
                        onClick={() => setSelectedStrategy(null)}
                    >
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="w-full max-w-lg bg-white rounded-t-[32px] p-6 pb-10 max-h-[85vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedStrategy(null)}
                                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                            >
                                <X size={20} />
                            </button>

                            {/* Header */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className={`p-4 rounded-full text-white ${selectedStrategy.color}`}>
                                    {selectedStrategy.icon}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-[#1A1A1A]">
                                        {selectedStrategy.title}
                                    </h2>
                                    <span className="text-sm text-[#4B0082] font-medium uppercase tracking-wide">
                                        {selectedStrategy.category}
                                    </span>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-[#1A1A1A]/70 mb-6 leading-relaxed">
                                {selectedStrategy.description}
                            </p>

                            {/* Steps */}
                            <h3 className="font-bold text-[#1A1A1A] mb-4">How to Use</h3>
                            <div className="space-y-3 mb-8">
                                {selectedStrategy.steps.map((step, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-[#4B0082]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-xs font-bold text-[#4B0082]">{index + 1}</span>
                                        </div>
                                        <p className="text-[#1A1A1A]/80">{step}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setSelectedStrategy(null)}
                                    className="flex-1 py-3 px-4 bg-[#4B0082] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#3a006b] transition-colors"
                                >
                                    <Check size={18} />
                                    Try This Now
                                </button>
                                <button className="py-3 px-4 bg-gray-100 text-[#1A1A1A] rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
                                    <Share2 size={18} />
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};
