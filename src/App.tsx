import { useGameState } from './hooks/useGameState';
import { GameObj } from './components/GameObj';
import { UI } from './components/UI';
import type { GameItem, CatalogItem } from './types';

export default function App() {
  const { 
    state, 
    switchScene, 
    toggleLight, 
    toggleFridge, 
    addItem, 
    updateItemPosition, 
    removeItem, 
    resetGame 
  } = useGameState();

  // ... Rest of the component logic can be simplified for testing if needed, but let's try full content
  
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

  const filteredItems = state.items.filter(i => i.scene === state.currentScene);

  return (
    <div className="game-container">
      <div className="scene">
        <div className={`wall ${state.currentScene}-wall`} />
        <div className={`floor ${state.currentScene}-floor`} />
      </div>
      <div className="light-overlay" style={{ opacity: state.isLightOn ? 0 : 0.8, pointerEvents: 'none' }} />
      <div className="wall-switch" onClick={toggleLight}>
         <div className="wall-switch-knob" style={{ transform: `translateY(${state.isLightOn ? '-5px' : '5px'})` }} />
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
          />
        ))}
      </div>
      <UI 
        currentScene={state.currentScene} 
        onSwitchScene={switchScene} 
        onSpawnItem={handleSpawnItem}
        onReset={resetGame}
      />
    </div>
  );
}

