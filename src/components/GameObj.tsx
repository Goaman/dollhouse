import { useState, useRef, useEffect, useCallback } from 'react';
import type { GameItem } from '../types';
import { ASSETS_CHAR, SVG_TEMPLATES } from '../data/assets';
import { renderCharacterSVG } from '../data/characterAssets';

interface GameObjProps {
    item: GameItem;
    onUpdatePosition: (id: string, x: number, y: number) => void;
    onInteraction?: (item: GameItem, targetId?: string) => void;
    onToggle?: (item: GameItem) => void;
    isFridgeOpen?: boolean;
    onDragStart?: () => void;
    onDragEnd?: (id: string, x: number, y: number) => void;
}

export function GameObj({ item, onUpdatePosition, onInteraction, onToggle, isFridgeOpen, onDragStart, onDragEnd }: GameObjProps) {
    const [isDragging, setIsDragging] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const dragStart = useRef({ x: 0, y: 0 });
    const initialPos = useRef({ x: 0, y: 0 });
    const hasMoved = useRef(false);

    // Store latest callbacks and item to avoid stale closures in event listeners
    const propsRef = useRef({ item, onUpdatePosition, onInteraction, onToggle, onDragStart, onDragEnd });
    useEffect(() => {
        propsRef.current = { item, onUpdatePosition, onInteraction, onToggle, onDragStart, onDragEnd };
    });

    // Render Content
    const getContent = () => {
        if (item.characterConfig) {
            return <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: renderCharacterSVG(item.characterConfig) }} />;
        }

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
            
            const templateFunc = SVG_TEMPLATES[item.svgTemplate];
            const svgString = item.svg || (templateFunc ? templateFunc(item.color || '#fff') : '');
            return <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: svgString }} />;
        }
        
        if (item.svg && ASSETS_CHAR[item.svg]) {
            return <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: ASSETS_CHAR[item.svg] }} />;
        }
        
        if (item.emoji) {
            return <div className="drop-shadow-sm" style={{ fontSize: item.type === 'food' ? '30px' : '40px' }}>{item.emoji}</div>;
        }

        // Fallback for catalog items that have pre-rendered svg
        if (item.svg) {
             return <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: item.svg }} />;
        }

        return null;
    };

    // Stable handlers that use refs
    const handleWindowMove = useCallback((e: PointerEvent) => {
        const { item } = propsRef.current;
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
    }, []);

    const handleWindowUp = useCallback(() => {
        const { item, onUpdatePosition, onInteraction, onToggle, onDragEnd } = propsRef.current;

        window.removeEventListener('pointermove', handleWindowMove);
        window.removeEventListener('pointerup', handleWindowUp);
        
        setIsDragging(false);
        
        if (!hasMoved.current && onToggle) {
            onToggle(item);
        }

        // Update final position
        let finalX = item.x;
        let finalY = item.y;

        if (ref.current) {
             finalX = parseFloat(ref.current.style.left || item.x.toString());
             finalY = parseFloat(ref.current.style.top || item.y.toString());
        }
        
        if (hasMoved.current) {
            onUpdatePosition(item.id, finalX, finalY);
            if (onDragEnd) {
                onDragEnd(item.id, finalX, finalY);
            }
        }

        if (onInteraction && !hasMoved.current) {
             onInteraction(item);
        } else if (onInteraction && hasMoved.current) {
             onInteraction(item);
        }
    }, [handleWindowMove]); // Dependency on handleWindowMove needed for removeEventListener

    const handlePointerDown = (e: React.PointerEvent) => {
        e.preventDefault();
        
        setIsDragging(true);
        hasMoved.current = false;
        dragStart.current = { x: e.clientX, y: e.clientY };
        const { item, onDragStart } = propsRef.current;
        initialPos.current = { x: item.x, y: item.y };
        
        if (onDragStart) onDragStart();

        window.addEventListener('pointermove', handleWindowMove);
        window.addEventListener('pointerup', handleWindowUp);
    };

    // Cleanup on unmount only
    useEffect(() => {
        return () => {
            window.removeEventListener('pointermove', handleWindowMove);
            window.removeEventListener('pointerup', handleWindowUp);
        };
    }, [handleWindowMove, handleWindowUp]);

    return (
        <div
            ref={ref}
            className={`game-obj type-${item.type} ${item.subtype === 'fridge' ? 'fridge-group' : ''} ${isDragging ? 'z-[100] scale-105' : ''}`}
            style={{
                left: item.x,
                top: item.y,
                width: item.w,
                height: item.h,
                zIndex: isDragging ? 100 : undefined,
                // Removed pointerEvents: none to ensure we can always grab it again and it doesn't get stuck
            }}
            onPointerDown={handlePointerDown}
        >
            {getContent()}
        </div>
    );
}
