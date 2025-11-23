import { useState } from 'react';
import type { CharacterConfig } from '../types';
import { 
    SKIN_COLORS, 
    HAIR_COLORS, 
    CLOTHING_COLORS,
    EYE_COLORS,
    HAIR_STYLES, 
    EYE_STYLES, 
    NOSE_STYLES,
    MOUTH_STYLES, 
    renderCharacterSVG 
} from '../data/characterAssets';

interface CharacterBuilderProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (config: CharacterConfig) => void;
    initialConfig?: CharacterConfig;
}

const DEFAULT_CONFIG: CharacterConfig = {
    skinColor: SKIN_COLORS[0],
    hairStyle: 'short',
    hairColor: HAIR_COLORS[0],
    eyeStyle: 'normal',
    eyeColor: '#333333',
    noseStyle: 'dot',
    mouthStyle: 'smile',
    shirtColor: CLOTHING_COLORS[0],
    pantsColor: '#333333'
};

export function CharacterBuilder({ isOpen, onClose, onSave, initialConfig }: CharacterBuilderProps) {
    const [config, setConfig] = useState<CharacterConfig>(initialConfig || DEFAULT_CONFIG);
    const [activeTab, setActiveTab] = useState<'body' | 'hair' | 'face' | 'clothes'>('body');

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(config);
        onClose();
    };

    const updateConfig = (key: keyof CharacterConfig, value: string) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 pointer-events-auto">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-800">Character Builder</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-2xl">&times;</button>
                </div>

                {/* Preview */}
                <div className="p-8 bg-blue-50 flex justify-center items-center min-h-[200px]">
                    <div 
                        className="w-32 h-48 transform transition-transform hover:scale-105"
                        dangerouslySetInnerHTML={{ __html: renderCharacterSVG(config) }}
                    />
                </div>

                {/* Tabs */}
                <div className="flex border-b overflow-x-auto scrollbar-hide">
                    {(['body', 'hair', 'face', 'clothes'] as const).map(tab => (
                        <button
                            key={tab}
                            className={`flex-1 py-3 px-4 font-bold text-sm uppercase tracking-wide transition-colors ${
                                activeTab === tab 
                                    ? 'border-b-2 border-purple-500 text-purple-600 bg-purple-50' 
                                    : 'text-gray-500 hover:bg-gray-50'
                            }`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Controls */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {activeTab === 'body' && (
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-3">Skin Tone</label>
                            <div className="flex flex-wrap gap-3">
                                {SKIN_COLORS.map(color => (
                                    <button
                                        key={color}
                                        className={`w-10 h-10 rounded-full border-2 shadow-sm transition-transform hover:scale-110 ${config.skinColor === color ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200'}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => updateConfig('skinColor', color)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'hair' && (
                        <>
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 mb-3">Style</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {Object.keys(HAIR_STYLES).map(style => (
                                        <button
                                            key={style}
                                            className={`p-2 rounded-lg border-2 text-sm font-medium capitalize transition-all ${config.hairStyle === style ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 hover:border-gray-300'}`}
                                            onClick={() => updateConfig('hairStyle', style)}
                                        >
                                            {style}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-3">Color</label>
                                <div className="flex flex-wrap gap-3">
                                    {HAIR_COLORS.map(color => (
                                        <button
                                            key={color}
                                            className={`w-10 h-10 rounded-full border-2 shadow-sm transition-transform hover:scale-110 ${config.hairColor === color ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200'}`}
                                            style={{ backgroundColor: color }}
                                            onClick={() => updateConfig('hairColor', color)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'face' && (
                        <>
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 mb-3">Eyes Shape</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {Object.keys(EYE_STYLES).map(style => (
                                        <button
                                            key={style}
                                            className={`p-2 rounded-lg border-2 text-sm font-medium capitalize transition-all ${config.eyeStyle === style ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 hover:border-gray-300'}`}
                                            onClick={() => updateConfig('eyeStyle', style)}
                                        >
                                            {style}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 mb-3">Eye Color</label>
                                <div className="flex flex-wrap gap-3">
                                    {EYE_COLORS.map(color => (
                                        <button
                                            key={color}
                                            className={`w-8 h-8 rounded-full border-2 shadow-sm transition-transform hover:scale-110 ${config.eyeColor === color ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200'}`}
                                            style={{ backgroundColor: color }}
                                            onClick={() => updateConfig('eyeColor', color)}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 mb-3">Nose</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {Object.keys(NOSE_STYLES).map(style => (
                                        <button
                                            key={style}
                                            className={`p-2 rounded-lg border-2 text-sm font-medium capitalize transition-all ${config.noseStyle === style ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 hover:border-gray-300'}`}
                                            onClick={() => updateConfig('noseStyle', style)}
                                        >
                                            {style}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-3">Mouth</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {Object.keys(MOUTH_STYLES).map(style => (
                                        <button
                                            key={style}
                                            className={`p-2 rounded-lg border-2 text-sm font-medium capitalize transition-all ${config.mouthStyle === style ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 hover:border-gray-300'}`}
                                            onClick={() => updateConfig('mouthStyle', style)}
                                        >
                                            {style}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'clothes' && (
                        <>
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 mb-3">Shirt Color</label>
                                <div className="flex flex-wrap gap-3">
                                    {CLOTHING_COLORS.map(color => (
                                        <button
                                            key={color}
                                            className={`w-10 h-10 rounded-full border-2 shadow-sm transition-transform hover:scale-110 ${config.shirtColor === color ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200'}`}
                                            style={{ backgroundColor: color }}
                                            onClick={() => updateConfig('shirtColor', color)}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-3">Pants Color</label>
                                <div className="flex flex-wrap gap-3">
                                    {CLOTHING_COLORS.map(color => (
                                        <button
                                            key={color}
                                            className={`w-10 h-10 rounded-full border-2 shadow-sm transition-transform hover:scale-110 ${config.pantsColor === color ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200'}`}
                                            style={{ backgroundColor: color }}
                                            onClick={() => updateConfig('pantsColor', color)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2 rounded-full font-bold text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        className="px-6 py-2 rounded-full font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-lg transition-transform active:scale-95"
                    >
                        Save Character
                    </button>
                </div>
            </div>
        </div>
    );
}

