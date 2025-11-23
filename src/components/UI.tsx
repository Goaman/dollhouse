import { useState } from 'react';
import { CATALOG } from '../data/assets';
import { renderCharacterSVG } from '../data/characterAssets';
import type { SceneType, CatalogItem, CharacterConfig, SavedCharacter, RoomConfig, SavedRoom } from '../types';
import { CharacterBuilder } from './CharacterBuilder';
import { DraggableDialog } from './DraggableDialog';

interface UIProps {
    currentScene: SceneType;
    savedCharacters: SavedCharacter[];
    roomConfigs: Record<SceneType, RoomConfig>;
    savedRooms: SavedRoom[];
    onSwitchScene: (s: SceneType) => void;
    onSpawnItem: (item: CatalogItem) => void;
    onSpawnCharacter: (config: CharacterConfig) => void;
    onSaveCharacter: (config: CharacterConfig, name: string) => void;
    onDeleteCharacter: (id: string) => void;
    onReset: () => void;
    onToggleLight?: () => void;
    onUpdateRoomConfig: (scene: SceneType, config: Partial<RoomConfig>) => void;
    onSaveRoom: (name: string) => void;
    onLoadRoom: (id: string) => void;
    onDeleteRoom: (id: string) => void;
}

export function UI({ 
    currentScene, 
    savedCharacters = [], 
    roomConfigs,
    savedRooms,
    onSwitchScene, 
    onSpawnItem, 
    onSpawnCharacter, 
    onSaveCharacter, 
    onDeleteCharacter, 
    onReset,
    onUpdateRoomConfig,
    onSaveRoom,
    onLoadRoom,
    onDeleteRoom
}: UIProps) {
    const [isCatalogOpen, setCatalogOpen] = useState(false);
    const [isCharacterManagerOpen, setCharacterManagerOpen] = useState(false);
    const [isBuilderOpen, setBuilderOpen] = useState(false);
    const [isRoomSettingsOpen, setRoomSettingsOpen] = useState(false);
    const [isSavedRoomsOpen, setSavedRoomsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(Object.keys(CATALOG)[0]);
    const [newRoomName, setNewRoomName] = useState('');

    const handleSaveNewCharacter = (config: CharacterConfig, name: string) => {
        onSaveCharacter(config, name);
        setBuilderOpen(false);
        setCharacterManagerOpen(true);
    };

    const handleSaveRoom = () => {
        if (newRoomName.trim()) {
            onSaveRoom(newRoomName);
            setNewRoomName('');
        }
    };

    return (
        <div className="ui-layer pointer-events-none z-[200] fixed inset-0">
            {/* Header */}
            <div className="absolute top-4 left-4 flex gap-3 pointer-events-auto">
                <div className="bg-white px-4 py-2 rounded-full shadow border-2 border-gray-100 font-bold text-gray-700 flex items-center gap-2 select-none">
                    <span>🏠 Doll House</span>
                </div>
            </div>

            {/* Floating Action Buttons */}
            <div className="absolute bottom-24 right-4 flex gap-4 pointer-events-auto items-end">
                 {/* Saved Rooms */}
                 <button onClick={() => setSavedRoomsOpen(true)} className="bg-blue-400 p-4 rounded-full shadow-lg border-4 border-white text-white hover:scale-110 transition flex items-center justify-center w-16 h-16" title="Saved Rooms">
                    <span className="text-2xl">💾</span>
                </button>
                
                {/* Room Settings */}
                <button onClick={() => setRoomSettingsOpen(true)} className="bg-pink-400 p-4 rounded-full shadow-lg border-4 border-white text-white hover:scale-110 transition flex items-center justify-center w-16 h-16" title="Room Settings">
                    <span className="text-2xl">🎨</span>
                </button>

                {/* Character Manager */}
                <button onClick={() => setCharacterManagerOpen(true)} className="bg-purple-400 p-4 rounded-full shadow-lg border-4 border-white text-white hover:scale-110 transition flex items-center justify-center w-16 h-16" title="Characters">
                    <span className="text-2xl">👥</span>
                </button>

                {/* Catalog Toggle */}
                <button onClick={() => setCatalogOpen(!isCatalogOpen)} className="bg-yellow-400 p-4 rounded-full shadow-lg border-4 border-white text-white hover:scale-110 transition flex items-center justify-center w-16 h-16" title="Furniture Shop">
                    <span className="text-2xl">🛍️</span>
                </button>
            </div>

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
            {isCatalogOpen && (
                <DraggableDialog
                    title="Furniture Shop"
                    onClose={() => setCatalogOpen(false)}
                    initialX={window.innerWidth / 2 - 250}
                    initialY={window.innerHeight - 450}
                    width="w-[500px]"
                >
                    <div className="flex flex-col h-[400px]">
                        <div className="catalog-tabs sticky top-0 z-10">
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
                                <div key={idx} className="catalog-item" onClick={() => { onSpawnItem(item); /* Keep open to spawn multiple? or close? Original closed. */ setCatalogOpen(false); }}>
                                    <div className="w-full h-full flex items-center justify-center pointer-events-none" dangerouslySetInnerHTML={{ __html: item.svg }} />
                                </div>
                            ))}
                        </div>
                    </div>
                </DraggableDialog>
            )}

            {/* Room Settings Modal */}
            {isRoomSettingsOpen && (
                <DraggableDialog
                    title={`Room Settings (${currentScene})`}
                    onClose={() => setRoomSettingsOpen(false)}
                    width="w-full max-w-sm"
                >
                    <div className="p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Wall Color</label>
                            <div className="flex items-center gap-3">
                                <input 
                                    type="color" 
                                    value={roomConfigs[currentScene]?.wallColor || '#ffffff'}
                                    onChange={(e) => onUpdateRoomConfig(currentScene, { wallColor: e.target.value })}
                                    className="w-12 h-12 rounded cursor-pointer border-0 p-0"
                                />
                                <span className="text-gray-500 text-sm font-mono">{roomConfigs[currentScene]?.wallColor}</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Floor Color</label>
                            <div className="flex items-center gap-3">
                                <input 
                                    type="color" 
                                    value={roomConfigs[currentScene]?.floorColor || '#ffffff'}
                                    onChange={(e) => onUpdateRoomConfig(currentScene, { floorColor: e.target.value })}
                                    className="w-12 h-12 rounded cursor-pointer border-0 p-0"
                                />
                                <span className="text-gray-500 text-sm font-mono">{roomConfigs[currentScene]?.floorColor}</span>
                            </div>
                        </div>
                    </div>
                </DraggableDialog>
            )}

            {/* Saved Rooms Modal */}
            {isSavedRoomsOpen && (
                <DraggableDialog
                    title="Saved Rooms"
                    onClose={() => setSavedRoomsOpen(false)}
                    width="w-full max-w-md"
                >
                    <div className="flex flex-col max-h-[60vh]">
                        <div className="p-4 border-b bg-gray-50">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Save Current Room</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder="e.g. Dream Kitchen"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                                    value={newRoomName}
                                    onChange={(e) => setNewRoomName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSaveRoom()}
                                />
                                <button 
                                    onClick={handleSaveRoom}
                                    disabled={!newRoomName.trim()}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Save
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {savedRooms.length === 0 ? (
                                <div className="text-center text-gray-400 py-8">No saved rooms yet</div>
                            ) : (
                                savedRooms.map(room => (
                                    <div key={room.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 transition">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg border shadow-sm shrink-0">
                                                {room.scene === 'kitchen' ? '🍳' : room.scene === 'bathroom' ? '🛁' : '🛋️'}
                                            </div>
                                            <div className="truncate">
                                                <div className="font-bold text-gray-800 truncate">{room.name}</div>
                                                <div className="text-xs text-gray-500">{room.items.length} items</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 shrink-0">
                                            <button 
                                                onClick={() => { onLoadRoom(room.id); setSavedRoomsOpen(false); }}
                                                className="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200"
                                                title="Load"
                                            >
                                                📂
                                            </button>
                                            <button 
                                                onClick={() => onDeleteRoom(room.id)}
                                                className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                                                title="Delete"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </DraggableDialog>
            )}

            {/* Character Manager Modal */}
            {isCharacterManagerOpen && !isBuilderOpen && (
                <DraggableDialog
                    title="My Characters"
                    onClose={() => setCharacterManagerOpen(false)}
                    width="w-full max-w-lg"
                >
                    <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-4 max-h-[60vh]">
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
                </DraggableDialog>
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
