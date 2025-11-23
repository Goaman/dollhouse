import { useState, useEffect, useCallback } from 'react';
import type { GameState, GameItem, SceneType } from '../types';

const STORAGE_KEY = 'miniLifeWorld_v6_react';
const DEFAULT_SCENE: SceneType = 'livingroom';

const INITIAL_STATE: GameState = {
    currentScene: DEFAULT_SCENE,
    items: [],
    isLightOn: true,
    fridgeOpen: false
};

export function useGameState() {
    const [state, setState] = useState<GameState>(() => {
        const s = localStorage.getItem(STORAGE_KEY);
        if (s) {
            try {
                return JSON.parse(s);
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
        // We won't show toast on every state change as it's too frequent in React
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
                { id: 'girl', type: 'character', svg: 'char_girl', x: 200, y: FLOOR_Y - 50, scene: 'livingroom' },
                { id: 'plant_start', type: 'furniture', svgTemplate: 'plant', color: '#2A9D8F', x: 50, y: FLOOR_Y - 50, scene: 'livingroom', w: 60, h: 100 }
            ];
            setState(prev => ({ ...prev, items: starter }));
        }
    }, []); // Run once on mount if empty

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
        saveGame
    };
}

