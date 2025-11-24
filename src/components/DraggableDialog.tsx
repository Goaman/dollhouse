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
    const [size, setSize] = useState<{ width?: number, height?: number }>({});
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    
    const dialogRef = useRef<HTMLDivElement>(null);
    const dragStartRef = useRef<{ x: number, y: number } | null>(null);
    const resizeStartRef = useRef<{ x: number, y: number, width: number, height: number } | null>(null);
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
        if (e.target instanceof Element && e.target.closest('.resize-handle')) return;
        
        setIsDragging(true);
        dragStartRef.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isDragging && dragStartRef.current) {
            setPosition({
                x: e.clientX - dragStartRef.current.x,
                y: e.clientY - dragStartRef.current.y
            });
        } else if (isResizing && resizeStartRef.current) {
            const deltaX = e.clientX - resizeStartRef.current.x;
            const deltaY = e.clientY - resizeStartRef.current.y;
            
            setSize({
                width: Math.max(300, resizeStartRef.current.width + deltaX),
                height: Math.max(200, resizeStartRef.current.height + deltaY)
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setIsResizing(false);
        dragStartRef.current = null;
        resizeStartRef.current = null;
    };

    const handleResizeMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (!dialogRef.current) return;

        const rect = dialogRef.current.getBoundingClientRect();
        setIsResizing(true);
        resizeStartRef.current = {
            x: e.clientX,
            y: e.clientY,
            width: rect.width,
            height: rect.height
        };
    };

    useEffect(() => {
        if (isDragging || isResizing) {
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
    }, [isDragging, isResizing]);

    return (
        <div 
            ref={dialogRef}
            className={`fixed bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col pointer-events-auto z-[500] ${width} ${className}`}
            style={{ 
                left: `${position.x}px`, 
                top: `${position.y}px`,
                width: size.width ? `${size.width}px` : undefined,
                height: size.height ? `${size.height}px` : undefined,
                maxWidth: size.width ? 'none' : undefined,
                maxHeight: size.height ? 'none' : '80vh'
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
            <div className="overflow-auto flex-1 relative">
                {children}
            </div>
            
            {/* Resize Handle */}
            <div 
                className="resize-handle absolute bottom-0 right-0 w-6 h-6 cursor-se-resize flex items-center justify-center z-10"
                onMouseDown={handleResizeMouseDown}
            >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-50">
                    <path d="M10 2L2 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M10 6L6 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            </div>
        </div>
    );
}


