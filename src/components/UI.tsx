import { useState } from 'react';
import { CATALOG } from '../data/assets';
import type { SceneType, CatalogItem } from '../types';

interface UIProps {
    currentScene: SceneType;
    onSwitchScene: (s: SceneType) => void;
    onSpawnItem: (item: CatalogItem) => void;
    onReset: () => void;
    onToggleLight?: () => void; // Switch is usually on wall, but maybe UI controls it too?
}

export function UI({ currentScene, onSwitchScene, onSpawnItem, onReset }: UIProps) {
    const [isCatalogOpen, setCatalogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(Object.keys(CATALOG)[0]);
    const [scenarioText, setScenarioText] = useState<string | null>(null);

    const handleGenerateScenario = async () => {
        // Mocking the API call behavior
        setScenarioText("A fun day at the dollhouse! Everyone is planning a surprise party.");
    };

    const handleThoughts = () => {
         // Mock
         alert("Thinking...");
    };

    return (
        <div className="ui-layer pointer-events-none z-[200] fixed inset-0">
            {/* Header */}
            <div className="absolute top-4 left-4 flex gap-3 pointer-events-auto">
                <div className="bg-white px-4 py-2 rounded-full shadow border-2 border-gray-100 font-bold text-gray-700 flex items-center gap-2 select-none">
                    <span>🏠 Mini Life</span>
                </div>
                <button onClick={handleGenerateScenario} className="bg-purple-100 hover:bg-purple-200 text-purple-700 border-2 border-purple-200 px-3 py-2 rounded-full font-bold text-sm flex items-center gap-1 transition-transform active:scale-95 shadow-sm">
                    <span>✨ Story</span>
                </button>
                <button onClick={handleThoughts} className="bg-orange-100 hover:bg-orange-200 text-orange-700 border-2 border-orange-200 px-3 py-2 rounded-full font-bold text-sm flex items-center gap-1 transition-transform active:scale-95 shadow-sm">
                    <span>💭 Think</span>
                </button>
            </div>

            {/* Scenario Box */}
            {scenarioText && (
                <div className="scenario-box pointer-events-auto block">
                    <h3 className="text-xs font-black text-purple-600 uppercase tracking-widest mb-2">Creative Prompt</h3>
                    <p className="text-gray-800 font-bold text-lg leading-tight mb-3">{scenarioText}</p>
                    <button onClick={() => setScenarioText(null)} className="bg-gray-100 hover:bg-gray-200 px-4 py-1 rounded-full text-sm font-bold text-gray-600">Got it!</button>
                </div>
            )}

            {/* Catalog Toggle */}
            <button onClick={() => setCatalogOpen(!isCatalogOpen)} className="absolute bottom-24 right-4 bg-yellow-400 p-4 rounded-full shadow-lg border-4 border-white text-white hover:scale-110 transition pointer-events-auto z-50 flex items-center justify-center" title="Furniture Shop">
                <span className="text-2xl">🛍️</span>
            </button>

            {/* Reset */}
            <button onClick={onReset} className="absolute top-4 right-4 bg-white p-2 rounded-full shadow hover:bg-red-50 transition pointer-events-auto border-2 border-gray-100 text-gray-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74-2.74L3 12"/></svg>
            </button>

            {/* Scene Nav */}
            <div className="nav-bar">
                <button className={`nav-btn ${currentScene === 'livingroom' ? 'active' : ''}`} onClick={() => onSwitchScene('livingroom')}>🛋️</button>
                <button className={`nav-btn ${currentScene === 'kitchen' ? 'active' : ''}`} onClick={() => onSwitchScene('kitchen')}>🍳</button>
                <button className={`nav-btn ${currentScene === 'bathroom' ? 'active' : ''}`} onClick={() => onSwitchScene('bathroom')}>🛁</button>
            </div>

            {/* Catalog Modal */}
            <div className={`catalog-modal ${isCatalogOpen ? 'open' : ''}`}>
                <div className="catalog-header">
                    <h2 className="text-xl font-bold text-gray-800">Furniture Shop</h2>
                    <button onClick={() => setCatalogOpen(false)} className="text-gray-500 hover:text-red-500 font-bold text-xl px-2">✕</button>
                </div>
                <div className="catalog-tabs">
                    {Object.keys(CATALOG).map(cat => (
                        <button 
                            key={cat} 
                            className={`tab-btn ${activeTab === cat ? 'active' : ''}`}
                            onClick={() => setActiveTab(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <div className="catalog-grid">
                    {CATALOG[activeTab]?.map((item, idx) => (
                        <div key={idx} className="catalog-item" onClick={() => { onSpawnItem(item); setCatalogOpen(false); }}>
                            <div dangerouslySetInnerHTML={{ __html: item.svg }} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

