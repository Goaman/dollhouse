import { useState } from 'react';
import { CATALOG } from '../data/assets';
import { renderCharacterSVG } from '../data/characterAssets';
import type { SceneType, CatalogItem, CharacterConfig, SavedCharacter } from '../types';
import { CharacterBuilder } from './CharacterBuilder';

interface UIProps {
    currentScene: SceneType;
    savedCharacters: SavedCharacter[];
    onSwitchScene: (s: SceneType) => void;
    onSpawnItem: (item: CatalogItem) => void;
    onSpawnCharacter: (config: CharacterConfig) => void;
    onSaveCharacter: (config: CharacterConfig, name: string) => void;
    onDeleteCharacter: (id: string) => void;
    onReset: () => void;
    onToggleLight?: () => void;
}

export function UI({ currentScene, savedCharacters = [], onSwitchScene, onSpawnItem, onSpawnCharacter, onSaveCharacter, onDeleteCharacter, onReset }: UIProps) {
    const [isCatalogOpen, setCatalogOpen] = useState(false);
    const [isCharacterManagerOpen, setCharacterManagerOpen] = useState(false);
    const [isBuilderOpen, setBuilderOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(Object.keys(CATALOG)[0]);

    const handleSaveNewCharacter = (config: CharacterConfig, name: string) => {
        onSaveCharacter(config, name);
        // Builder closes automatically by its own logic via onClose, but we ensure manager stays open
        setBuilderOpen(false);
        setCharacterManagerOpen(true);
    };

    return (
        <div className="ui-layer pointer-events-none z-[200] fixed inset-0">
            {/* Header */}
            <div className="absolute top-4 left-4 flex gap-3 pointer-events-auto">
                <div className="bg-white px-4 py-2 rounded-full shadow border-2 border-gray-100 font-bold text-gray-700 flex items-center gap-2 select-none">
                    <span>🏠 Doll House</span>
                </div>
            </div>

            {/* Character Manager Toggle */}
            <button onClick={() => setCharacterManagerOpen(true)} className="absolute bottom-24 right-24 bg-purple-400 p-4 rounded-full shadow-lg border-4 border-white text-white hover:scale-110 transition pointer-events-auto z-50 flex items-center justify-center" title="Characters">
                <span className="text-2xl">👥</span>
            </button>

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

            {/* Character Manager Modal */}
            {isCharacterManagerOpen && !isBuilderOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[250] p-4 pointer-events-auto">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]">
                        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-800">My Characters</h2>
                            <button onClick={() => setCharacterManagerOpen(false)} className="text-gray-500 hover:text-red-500 text-2xl">&times;</button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => setBuilderOpen(true)}
                                className="aspect-[3/4] border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-purple-500 hover:text-purple-500 hover:bg-purple-50 transition-all"
                            >
                                <span className="text-4xl mb-2">+</span>
                                <span className="font-bold">Create New</span>
                            </button>

                            {savedCharacters.map(char => (
                                <div key={char.id} className="relative group aspect-[3/4] bg-gray-50 rounded-xl border-2 border-gray-100 hover:border-purple-200 transition-all overflow-hidden">
                                    <div 
                                        className="absolute inset-0 flex items-center justify-center p-2 cursor-pointer"
                                        onClick={() => { onSpawnCharacter(char.config); setCharacterManagerOpen(false); }}
                                    >
                                        <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: renderCharacterSVG(char.config) }} />
                                    </div>
                                    <div className="absolute bottom-0 left-0 w-full bg-white bg-opacity-90 p-2 text-center border-t border-gray-100">
                                        <span className="font-bold text-sm text-gray-800 block truncate">{char.name}</span>
                                    </div>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onDeleteCharacter(char.id); }}
                                        className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow text-red-500 hover:bg-red-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Delete"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Character Builder Modal */}
            <CharacterBuilder 
                isOpen={isBuilderOpen}
                onClose={() => { setBuilderOpen(false); setCharacterManagerOpen(true); }}
                onSave={handleSaveNewCharacter}
            />
        </div>
    );
}
