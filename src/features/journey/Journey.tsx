import { useState } from 'react';
import { Search, Wind, Moon, Music, Zap, Heart } from 'lucide-react';

export const Journey = () => {
    const [filter, setFilter] = useState('All');

    const strategies = [
        { id: 1, title: 'Deep Pressure', category: 'Sensory', icon: <Wind size={24} />, color: 'bg-blue-500' },
        { id: 2, title: 'Dim Lighting', category: 'Environment', icon: <Moon size={24} />, color: 'bg-indigo-500' },
        { id: 3, title: 'Safe Song', category: 'Auditory', icon: <Music size={24} />, color: 'bg-purple-500' },
        { id: 4, title: 'Heavy Work', category: 'Proprioception', icon: <Zap size={24} />, color: 'bg-orange-500' },
        { id: 5, title: 'Co-Regulation', category: 'Social', icon: <Heart size={24} />, color: 'bg-pink-500' },
    ];

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
                        className="bg-transparent w-full focus:outline-none text-[#1A1A1A] placeholder-[#1A1A1A]/40"
                    />
                </div>
            </div>

            {/* FILTER TABS */}
            <div className="flex space-x-2 px-2 overflow-x-auto no-scrollbar">
                {['All', 'Sensory', 'Sleep', 'Meltdown'].map((tab) => (
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
                {strategies.map((item) => (
                    <div
                        key={item.id}
                        className="glass-panel p-4 rounded-[24px] flex flex-col items-center justify-center text-center space-y-3 aspect-square active:scale-95 transition-transform"
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
                    </div>
                ))}

                {/* 'ADD NEW' CARD */}
                <div className="border-2 border-dashed border-[#1A1A1A]/20 rounded-[24px] flex flex-col items-center justify-center text-center space-y-2 aspect-square active:bg-black/5 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-[#1A1A1A]/5 flex items-center justify-center">
                        <span className="text-2xl text-[#1A1A1A]/40">+</span>
                    </div>
                    <span className="text-sm font-bold text-[#1A1A1A]/40">Add New</span>
                </div>
            </div>

        </div>
    );
};
