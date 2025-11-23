import { useState, useCallback } from 'react';
import { useGameState } from './hooks/useGameState';
import { GameObj } from './components/GameObj';
import { UI } from './components/UI';
import type { GameItem, CatalogItem, CharacterConfig } from './types';

export default function App() {
  const [isDraggingGlobal, setIsDraggingGlobal] = useState(false);

  const { 
    state, 
    switchScene, 
    toggleLight, 
    toggleFridge, 
    addItem, 
    updateItemPosition, 
    removeItem, 
    resetGame,
    addSavedCharacter,
    removeSavedCharacter,
    updateRoomConfig,
    saveRoom,
    loadRoom,
    deleteSavedRoom
  } = useGameState();

  const handleSpawnItem = (catItem: CatalogItem) => {
    const newItem: GameItem = {
      id: `obj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      scene: state.currentScene,
      x: window.innerWidth / 2 - (catItem.w ? catItem.w / 2 : 25),
      y: window.innerHeight / 2 - (catItem.h ? catItem.h / 2 : 25),
      type: catItem.type as GameItem['type'],
      w: catItem.w,
      h: catItem.h,
      svgTemplate: catItem.svgTemplate,
      color: catItem.color,
      emoji: catItem.emoji,
      svg: catItem.svg,
      subtype: catItem.svgTemplate === 'fridge' ? 'fridge' : undefined
    };
    addItem(newItem);
  };

  const handleSpawnCharacter = (config: CharacterConfig) => {
    const newItem: GameItem = {
      id: `char_${Date.now()}`,
      scene: state.currentScene,
      x: window.innerWidth / 2 - 45,
      y: window.innerHeight / 2 - 70,
      type: 'character',
      w: 90,
      h: 140,
      characterConfig: config
    };
    addItem(newItem);
  };

  const handleSaveCharacter = (config: CharacterConfig, name: string) => {
    addSavedCharacter({
        id: `saved_${Date.now()}`,
        name,
        config
    });
  };

  const handleInteraction = (item: GameItem) => {
     if (item.type === 'food') {
         const chars = state.items.filter(i => i.type === 'character' && i.scene === state.currentScene);
         const foodRect = { l: item.x, r: item.x + 50, t: item.y, b: item.y + 50 };
         chars.forEach(char => {
             const charRect = { l: char.x, r: char.x + 90, t: char.y, b: char.y + 140 };
             if (foodRect.l < charRect.r && foodRect.r > charRect.l && foodRect.t < charRect.b && foodRect.b > charRect.t) {
                 removeItem(item.id);
             }
         });
     }
  };

  const handleToggle = (item: GameItem) => {
      if (item.subtype === 'fridge') {
          toggleFridge(!state.fridgeOpen);
      }
  };

  const handleDragStart = useCallback(() => {
      setIsDraggingGlobal(true);
  }, []);

  const handleDragEnd = useCallback((id: string, x: number, y: number) => {
      setIsDraggingGlobal(false);
      
      // Check if dropped in trash (Left side, below logo: x < 120, 60 < y < 180)
      if (x < 120 && y > 60 && y < 180) {
          removeItem(id);
      } else {
          updateItemPosition(id, x, y);
      }
  }, [removeItem, updateItemPosition]);

  const filteredItems = state.items.filter(i => i.scene === state.currentScene);
  const currentRoomConfig = state.roomConfigs?.[state.currentScene] || { wallColor: '#fff', floorColor: '#ccc' };

  return (
    <div className="game-container">
      <div className="scene">
        <div 
            className={`wall ${state.currentScene}-wall`} 
            style={{ backgroundColor: currentRoomConfig.wallColor }}
        />
        <div 
            className={`floor ${state.currentScene}-floor`}
            style={{ backgroundColor: currentRoomConfig.floorColor }}
        />
      </div>
      
      <div className="light-overlay" style={{ opacity: state.isLightOn ? 0 : 0.8, pointerEvents: 'none' }} />
      <div className="wall-switch" onClick={toggleLight}>
         <div className="wall-switch-knob" style={{ transform: `translateY(${state.isLightOn ? '-5px' : '5px'})` }} />
      </div>

      {/* Trash Icon */}
      <div 
        className={`fixed top-20 left-4 w-20 h-20 bg-red-100 rounded-full border-4 border-red-400 flex items-center justify-center z-[150] transition-all duration-300 pointer-events-none ${isDraggingGlobal ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
      >
        <span className="text-4xl animate-bounce">🗑️</span>
      </div>

      <div id="objectsLayer">
        {filteredItems.map(item => (
          <GameObj 
            key={item.id} 
            item={item} 
            onUpdatePosition={updateItemPosition}
            onInteraction={handleInteraction}
            onToggle={handleToggle}
            isFridgeOpen={state.fridgeOpen}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
        ))}
      </div>
      <UI 
        currentScene={state.currentScene} 
        savedCharacters={state.savedCharacters}
        roomConfigs={state.roomConfigs}
        savedRooms={state.savedRooms}
        onSwitchScene={switchScene} 
        onSpawnItem={handleSpawnItem}
        onSpawnCharacter={handleSpawnCharacter}
        onSaveCharacter={handleSaveCharacter}
        onDeleteCharacter={removeSavedCharacter}
        onReset={resetGame}
        onUpdateRoomConfig={updateRoomConfig}
        onSaveRoom={saveRoom}
        onLoadRoom={loadRoom}
        onDeleteRoom={deleteSavedRoom}
      />
    </div>
  );
}
