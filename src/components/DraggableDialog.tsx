import { useState, useRef, useEffect } from 'react';

interface DraggableDialogProps {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
    initialX?: number;
    initialY?: number;
    className?: string;
    width?: string;
}

export function DraggableDialog({ title, onClose, children, initialX, initialY, className = '', width = 'max-w-md' }: DraggableDialogProps) {
    const [position, setPosition] = useState({ x: initialX ?? 0, y: initialY ?? 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef<{ x: number, y: number } | null>(null);
    const initializedRef = useRef(false);

    // Center initially if no position provided
    useEffect(() => {
        if (!initializedRef.current && initialX === undefined && initialY === undefined) {
            setPosition({
                x: Math.max(0, window.innerWidth / 2 - 200), // approximate center
                y: Math.max(0, window.innerHeight / 2 - 200)
            });
            initializedRef.current = true;
        }
    }, [initialX, initialY]);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        dragStartRef.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || !dragStartRef.current) return;
        setPosition({
            x: e.clientX - dragStartRef.current.x,
            y: e.clientY - dragStartRef.current.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        dragStartRef.current = null;
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    return (
        <div 
            className={`fixed bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col pointer-events-auto z-[500] ${width} ${className}`}
            style={{ 
                left: `${position.x}px`, 
                top: `${position.y}px`,
            }}
        >
            <div 
                className="p-4 border-b flex justify-between items-center bg-gray-50 cursor-move select-none"
                onMouseDown={handleMouseDown}
            >
                <h2 className="text-xl font-bold text-gray-800 pointer-events-none">{title}</h2>
                <button 
                    onClick={onClose} 
                    className="text-gray-500 hover:text-red-500 text-2xl cursor-pointer"
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    &times;
                </button>
            </div>
            <div className="overflow-auto max-h-[80vh]">
                {children}
            </div>
        </div>
    );
}


