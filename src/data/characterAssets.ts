import type { CharacterConfig } from '../types';

export const SKIN_COLORS = [
    '#f8d5c2', // Light
    '#E0AC69', // Medium
    '#8D5524', // Dark
    '#C68642', // Tan
    '#FFDCB1', // Pale
];

export const HAIR_COLORS = [
    '#5D4037', // Brown
    '#000000', // Black
    '#E6BE8A', // Blonde
    '#A52A2A', // Red
    '#9E9E9E', // Grey
    '#FF9A9E', // Pink
    '#A1C4FD', // Blue
];

export const CLOTHING_COLORS = [
    '#FF9A9E', // Pink
    '#A1C4FD', // Blue
    '#C1E1C1', // Green
    '#FDFD96', // Yellow
    '#B39EB5', // Purple
    '#FFB347', // Orange
    '#333333', // Black
    '#FFFFFF', // White
];

export const HAIR_STYLES: Record<string, (color: string) => string> = {
    short: (c) => `<path d="M25 25 Q50 15 75 25" fill="none" stroke="${c}" stroke-width="8" stroke-linecap="round"/>`,
    long: (c) => `<path d="M25 35 Q50 5 75 35 L85 80 Q90 90 75 90 L25 90 Q10 90 15 80 Z" fill="${c}" />`,
    ponytail: (c) => `<circle cx="50" cy="25" r="28" fill="${c}" clip-path="inset(0 0 50% 0)" /><circle cx="80" cy="40" r="15" fill="${c}" />`,
    spiky: (c) => `<path d="M25 35 L30 15 L40 30 L50 10 L60 30 L70 15 L75 35 Z" fill="${c}" />`,
    bob: (c) => `<path d="M20 35 Q50 5 80 35 L80 65 Q80 75 70 75 L30 75 Q20 75 20 65 Z" fill="${c}" />`,
};

export const EYE_STYLES: Record<string, string> = {
    normal: `<circle cx="42" cy="32" r="3" fill="#333"/><circle cx="58" cy="32" r="3" fill="#333"/>`,
    happy: `<path d="M39 32 Q42 29 45 32" fill="none" stroke="#333" stroke-width="2"/><path d="M55 32 Q58 29 61 32" fill="none" stroke="#333" stroke-width="2"/>`,
    glasses: `<circle cx="42" cy="32" r="6" fill="none" stroke="#333" stroke-width="2"/><circle cx="58" cy="32" r="6" fill="none" stroke="#333" stroke-width="2"/><line x1="48" y1="32" x2="52" y2="32" stroke="#333" stroke-width="2"/>`,
    wink: `<circle cx="42" cy="32" r="3" fill="#333"/><path d="M55 32 Q58 29 61 32" fill="none" stroke="#333" stroke-width="2"/>`,
    sleepy: `<path d="M39 32 Q42 35 45 32" fill="none" stroke="#333" stroke-width="2"/><path d="M55 32 Q58 35 61 32" fill="none" stroke="#333" stroke-width="2"/>`
};

export const MOUTH_STYLES: Record<string, string> = {
    smile: `<path d="M45 45 Q50 48 55 45" stroke="#333" stroke-width="2" fill="none"/>`,
    big_smile: `<path d="M42 45 Q50 52 58 45 Z" fill="#333"/>`,
    surprised: `<circle cx="50" cy="47" r="3" fill="none" stroke="#333" stroke-width="2"/>`,
    neutral: `<line x1="45" y1="47" x2="55" y2="47" stroke="#333" stroke-width="2"/>`,
};

export function renderCharacterSVG(config: CharacterConfig): string {
    const { skinColor, hairStyle, hairColor, eyeStyle, mouthStyle, shirtColor, pantsColor } = config;

    const hairSvg = HAIR_STYLES[hairStyle] ? HAIR_STYLES[hairStyle](hairColor) : HAIR_STYLES['short'](hairColor);
    const eyesSvg = EYE_STYLES[eyeStyle] || EYE_STYLES['normal'];
    const mouthSvg = MOUTH_STYLES[mouthStyle] || MOUTH_STYLES['smile'];

    return `
        <svg viewBox="0 0 100 150" class="drop-shadow-lg">
            <g transform="translate(5,5)">
                <!-- Legs/Pants -->
                <path d="M30 140 L30 90 L70 90 L70 140" stroke="${pantsColor}" stroke-width="12" stroke-linecap="round" fill="none"/>
                
                <!-- Body/Shirt -->
                <rect x="20" y="50" width="60" height="50" rx="10" fill="${shirtColor}"/>
                
                <!-- Head -->
                <circle cx="50" cy="35" r="25" fill="${skinColor}"/>
                
                <!-- Hair Back (if needed, for now just one layer) -->
                
                <!-- Face -->
                ${eyesSvg}
                ${mouthSvg}
                
                <!-- Hair Front -->
                ${hairSvg}
                
                <!-- Arms -->
                <path d="M15 55 L25 80" stroke="${skinColor}" stroke-width="8" stroke-linecap="round"/>
                <path d="M85 55 L75 80" stroke="${skinColor}" stroke-width="8" stroke-linecap="round"/>
            </g>
        </svg>
    `;
}
