import { useState, useRef } from 'react';
import type { GameItem } from '../types';
import { ASSETS_CHAR, SVG_TEMPLATES } from '../data/assets';

interface GameObjProps {
    item: GameItem;
    onUpdatePosition: (id: string, x: number, y: number) => void;
    onInteraction?: (item: GameItem, targetId?: string) => void;
    onToggle?: (item: GameItem) => void;
    isFridgeOpen?: boolean;
}

export function GameObj({ item, onUpdatePosition, onInteraction, onToggle, isFridgeOpen }: GameObjProps) {
    const [isDragging, setIsDragging] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const dragStart = useRef({ x: 0, y: 0 });
    const initialPos = useRef({ x: 0, y: 0 });
    const hasMoved = useRef(false);

    // Render Content
    const getContent = () => {
        if (item.svgTemplate) {
            if (item.subtype === 'fridge') {
                 // Fridge special handling
                 const svgContent = SVG_TEMPLATES.fridge(item.color || '#eee');
                 return (
                     <>
                        <div className="absolute w-full h-full" dangerouslySetInnerHTML={{ __html: svgContent }} />
                        <div className={`absolute w-full h-full fridge-door cursor-pointer ${isFridgeOpen ? 'fridge-open-door' : ''}`} 
                             style={{ transformOrigin: 'left', transition: 'transform 0.4s ease-in-out', transform: isFridgeOpen ? 'rotateY(-110deg)' : 'none' }}>
                             <div dangerouslySetInnerHTML={{ __html: svgContent.replace('rx="10" fill="', 'rx="10" fill="#fff" stroke="') }} />
                        </div>
                     </>
                 );
            }
            // Standard furniture already has svg property populated in catalog, but for initial items it might be just template
            // Actually in my assets.ts I store the rendered string in `svg` for catalog items.
            // But for starter items in `useGameState`, I only provided template/color.
            // So I should generate it here if `item.svg` is missing but template is present.
            
            const templateFunc = SVG_TEMPLATES[item.svgTemplate];
            const svgString = item.svg || (templateFunc ? templateFunc(item.color || '#fff') : '');
            return <div dangerouslySetInnerHTML={{ __html: svgString }} />;
        }
        
        if (item.svg && ASSETS_CHAR[item.svg]) {
            return <div dangerouslySetInnerHTML={{ __html: ASSETS_CHAR[item.svg] }} />;
        }
        
        if (item.emoji) {
            return <div className="drop-shadow-sm" style={{ fontSize: item.type === 'food' ? '30px' : '40px' }}>{item.emoji}</div>;
        }

        // Fallback for catalog items that have pre-rendered svg
        if (item.svg) {
             return <div dangerouslySetInnerHTML={{ __html: item.svg }} />;
        }

        return null;
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        e.preventDefault();
        setIsDragging(true);
        hasMoved.current = false;
        dragStart.current = { x: e.clientX, y: e.clientY };
        initialPos.current = { x: item.x, y: item.y };
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging) return;
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        
        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
            hasMoved.current = true;
        }
        
        // Simple constraints
        const maxX = window.innerWidth - (item.w || 50);
        const maxY = window.innerHeight - (item.h || 50);
        
        const nx = Math.max(-50, Math.min(initialPos.current.x + dx, maxX));
        const ny = Math.max(-50, Math.min(initialPos.current.y + dy, maxY));
        
        if (ref.current) {
            ref.current.style.left = `${nx}px`;
            ref.current.style.top = `${ny}px`;
        }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (!isDragging) return;
        setIsDragging(false);
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        
        if (!hasMoved.current && onToggle) {
            onToggle(item);
            return;
        }

        // Update final position
        const finalX = parseFloat(ref.current?.style.left || item.x.toString());
        const finalY = parseFloat(ref.current?.style.top || item.y.toString());
        
        onUpdatePosition(item.id, finalX, finalY);
        
        // Check collision/interaction (simplified)
        // In a real app we might want to do this in parent by checking all rects
        if (onInteraction) {
            onInteraction(item);
        }
    };

    return (
        <div
            ref={ref}
            className={`game-obj type-${item.type} ${item.subtype === 'fridge' ? 'fridge-group' : ''} ${isDragging ? 'z-[100] scale-105' : ''}`}
            style={{
                left: item.x,
                top: item.y,
                width: item.w,
                height: item.h,
                zIndex: isDragging ? 100 : undefined, // Force z-index on drag
                // Retain original class styles via tailwind or global css
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
        >
            {getContent()}
        </div>
    );
}

