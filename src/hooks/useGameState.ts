import { useState, useEffect, useCallback } from 'react';
import type { GameState, GameItem, SceneType, SavedCharacter, RoomConfig, SavedRoom } from '../types';

const STORAGE_KEY = 'miniLifeWorld_v6_react';
const DEFAULT_SCENE: SceneType = 'livingroom';

const DEFAULT_CONFIGS: Record<SceneType, RoomConfig> = {
    livingroom: { wallColor: '#FFE5D9', floorColor: '#D4A373' },
    kitchen: { wallColor: '#E0FBFC', floorColor: '#3D5A80' },
    bathroom: { wallColor: '#CDB4DB', floorColor: '#A2D2FF' }
};

const INITIAL_STATE: GameState = {
    currentScene: DEFAULT_SCENE,
    items: [],
    savedCharacters: [],
    isLightOn: true,
    fridgeOpen: false,
    roomConfigs: DEFAULT_CONFIGS,
    savedRooms: []
};

export function useGameState() {
    const [state, setState] = useState<GameState>(() => {
        const s = localStorage.getItem(STORAGE_KEY);
        if (s) {
            try {
                const parsed = JSON.parse(s);
                // Migration: ensure all fields exist
                if (!parsed.savedCharacters) parsed.savedCharacters = [];
                if (!parsed.roomConfigs) parsed.roomConfigs = DEFAULT_CONFIGS;
                if (!parsed.savedRooms) parsed.savedRooms = [];
                
                // Ensure deep merge of configs in case of partial missing
                parsed.roomConfigs = { ...DEFAULT_CONFIGS, ...parsed.roomConfigs };
                
                return parsed;
            } catch (e) {
                console.error("Failed to load state", e);
            }
        }
        return INITIAL_STATE;
    });

    const [showSaveToast, setShowSaveToast] = useState(false);

    // Persist state
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    const saveGame = useCallback(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        setShowSaveToast(true);
        setTimeout(() => setShowSaveToast(false), 1000);
    }, [state]);

    const switchScene = (scene: SceneType) => {
        setState(prev => ({ ...prev, currentScene: scene }));
    };

    const toggleLight = () => {
        setState(prev => ({ ...prev, isLightOn: !prev.isLightOn }));
    };

    const toggleFridge = (isOpen: boolean) => {
        setState(prev => ({ ...prev, fridgeOpen: isOpen }));
    };

    const addItem = (item: GameItem) => {
        setState(prev => ({ ...prev, items: [...prev.items, item] }));
        saveGame();
    };

    const updateItemPosition = (id: string, x: number, y: number) => {
        setState(prev => ({
            ...prev,
            items: prev.items.map(i => i.id === id ? { ...i, x, y } : i)
        }));
    };

    const removeItem = (id: string) => {
        setState(prev => ({
            ...prev,
            items: prev.items.filter(i => i.id !== id)
        }));
    };

    const addSavedCharacter = (char: SavedCharacter) => {
        setState(prev => ({ 
            ...prev, 
            savedCharacters: [...(prev.savedCharacters || []), char] 
        }));
        saveGame();
    };

    const removeSavedCharacter = (id: string) => {
        setState(prev => ({ 
            ...prev, 
            savedCharacters: (prev.savedCharacters || []).filter(c => c.id !== id) 
        }));
        saveGame();
    };

    const updateRoomConfig = (scene: SceneType, config: Partial<RoomConfig>) => {
        setState(prev => ({
            ...prev,
            roomConfigs: {
                ...prev.roomConfigs,
                [scene]: { ...prev.roomConfigs[scene], ...config }
            }
        }));
    };

    const saveRoom = (name: string) => {
        const currentItems = state.items.filter(i => i.scene === state.currentScene);
        const currentConfig = state.roomConfigs[state.currentScene];
        // Deep copy items to avoid reference issues if we mutate them later (though we treat state as immutable)
        // JSON parse/stringify is a cheap deep copy for this data
        const itemsCopy = JSON.parse(JSON.stringify(currentItems));

        const newSavedRoom: SavedRoom = {
            id: `room_${Date.now()}`,
            name,
            scene: state.currentScene,
            items: itemsCopy,
            config: currentConfig
        };

        setState(prev => ({
            ...prev,
            savedRooms: [...prev.savedRooms, newSavedRoom]
        }));
        saveGame();
    };

    const loadRoom = (id: string) => {
        const saved = state.savedRooms.find(r => r.id === id);
        if (!saved) return;
        
        // We need to regenerate IDs for items to avoid conflicts? 
        // Or just replace them. If we replace, the old IDs are gone from the scene.
        // But if we have cross-scene references (none currently), it might matter.
        // Let's just use the saved items as is.
        
        const otherItems = state.items.filter(i => i.scene !== saved.scene);
        
        setState(prev => ({
            ...prev,
            items: [...otherItems, ...saved.items],
            roomConfigs: {
                ...prev.roomConfigs,
                [saved.scene]: saved.config
            },
            currentScene: saved.scene // Switch to the loaded room's scene type
        }));
    };

    const deleteSavedRoom = (id: string) => {
        setState(prev => ({
            ...prev,
            savedRooms: prev.savedRooms.filter(r => r.id !== id)
        }));
        saveGame();
    };

    const resetGame = () => {
        if (confirm("Clear world?")) {
            localStorage.removeItem(STORAGE_KEY);
            window.location.reload();
        }
    };

    // Starter pack check
    useEffect(() => {
        if (state.items.length === 0) {
            const GAME_WIDTH = window.innerWidth;
            const GAME_HEIGHT = window.innerHeight;
            const FLOOR_Y = GAME_HEIGHT - 180;
            
            const starter: GameItem[] = [
                { id: 'sofa_start', type: 'furniture', svgTemplate: 'sofa', color: '#FF9A9E', x: GAME_WIDTH/2 - 100, y: FLOOR_Y - 80, scene: 'livingroom', w: 200, h: 120 },
                { id: 'girl', type: 'character', svg: 'char_girl', x: 200, y: FLOOR_Y - 50, scene: 'livingroom', w: 90, h: 140 },
                { id: 'plant_start', type: 'furniture', svgTemplate: 'plant', color: '#2A9D8F', x: 50, y: FLOOR_Y - 50, scene: 'livingroom', w: 60, h: 100 }
            ];
            setState(prev => ({ ...prev, items: starter }));
        }
    }, []); 

    // Migration check for hot-reload
    useEffect(() => {
        if (!state.savedCharacters || !state.roomConfigs || !state.savedRooms) {
            setState(prev => ({ 
                ...prev, 
                savedCharacters: prev.savedCharacters || [],
                roomConfigs: prev.roomConfigs || DEFAULT_CONFIGS,
                savedRooms: prev.savedRooms || []
            }));
        }
    }, [state.savedCharacters, state.roomConfigs, state.savedRooms]); 

    return {
        state,
        showSaveToast,
        switchScene,
        toggleLight,
        toggleFridge,
        addItem,
        updateItemPosition,
        removeItem,
        resetGame,
        saveGame,
        addSavedCharacter,
        removeSavedCharacter,
        updateRoomConfig,
        saveRoom,
        loadRoom,
        deleteSavedRoom
    };
}
