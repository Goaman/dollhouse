export type SceneType = 'livingroom' | 'kitchen' | 'bathroom';

export interface GameItem {
    id: string;
    type: 'furniture' | 'furniture-back' | 'furniture-wall' | 'furniture-complex' | 'item' | 'character' | 'wearable' | 'food';
    scene: SceneType;
    x: number;
    y: number;
    w?: number;
    h?: number;
    svgTemplate?: string;
    color?: string;
    emoji?: string;
    svg?: string; // Can be the rendered SVG string or the character SVG key
    subtype?: string; // e.g. 'fridge'
}

export interface GameState {
    currentScene: SceneType;
    items: GameItem[];
    isLightOn: boolean;
    fridgeOpen: boolean;
}

export interface CatalogItem {
    name: string;
    svgTemplate?: string;
    color?: string;
    type: string;
    w?: number;
    h?: number;
    svg: string; // The preview SVG string
    emoji?: string;
}

