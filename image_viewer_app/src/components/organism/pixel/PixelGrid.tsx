'use client';
import { useEffect, useRef, useState, useMemo, useCallback, memo } from "react";
import { CursorColorType, PixelColorType, newPixelColor } from "@/types/pixel";
import { usePixel } from "@/hooks/common/usePixel";
import { Color } from "@/types/color";
import { ToolType } from "@/types/tool";

interface PixelGridProps {
  size: number;
  zoom?: number;
  cursorColor?: CursorColorType;
  selectedColor: PixelColorType;
  selectedTool: ToolType;
}

const PixelGrid = memo(function PixelGrid({ size, zoom = 100, cursorColor = 'blue', selectedColor, selectedTool }: PixelGridProps) {
  const BASE = 512;
  
  const { pixels, togglePixelState, erasePixelState, updateSize } = usePixel();
  const [isDragging, setIsDragging] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const prevSizeRef = useRef(size);

  const lastCellRef = useRef<{ row: number; col: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const cellSize = useMemo(() => BASE / size, [size]);
  
  const cursorUrl = useMemo(() => {
    if (selectedTool.id === 'eraser') return `url('/cursor/eraser.svg')`;
    return `url('/cursor/colors/pen-${cursorColor}.svg')`;
  }, [cursorColor, selectedTool]);

  const patternRef = useRef<CanvasPattern | null>(null);

  useEffect(() => {
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = 8;
    patternCanvas.height = 8;
    const patternCtx = patternCanvas.getContext('2d');
    if (patternCtx) {
      patternCtx.fillStyle = '#ffffff';
      patternCtx.fillRect(0, 0, 8, 8);
      patternCtx.fillStyle = '#e0e0e0';
      patternCtx.fillRect(0, 0, 4, 4);
      patternCtx.fillRect(4, 4, 4, 4);
    }
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        patternRef.current = ctx.createPattern(patternCanvas, 'repeat');
      }
    }
  }, []);

  const drawPixel = useCallback((row: number, col: number, color: PixelColorType) => {
    if (selectedTool.id === 'eraser') {
      erasePixelState(row, col);
    } else {
      togglePixelState(row, col, color);
    }
  }, [selectedTool, togglePixelState, erasePixelState]);

  const getCellCoordinates = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const colIndex = Math.floor(x / cellSize);
    const rowIndex = Math.floor(y / cellSize);

    if (colIndex >= 0 && colIndex < size && rowIndex >= 0 && rowIndex < size) {
      return { row: rowIndex, col: colIndex };
    }
    return null;
  }, [cellSize, size]);

  // サイズ変更時の初期化処理
  useEffect(() => {
    if (prevSizeRef.current !== size) {
      setInitialized(false);
      prevSizeRef.current = size;
    }
  }, [size]);

  // 初期化処理
  useEffect(() => {
    if (!initialized) {
      updateSize(size);
      setInitialized(true);
    }
  }, [size, initialized]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = BASE;
    canvas.height = BASE;

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 0.2;

    pixels.forEach((row, rowIndex) => {
      row.forEach((pixel, colIndex) => {
        const x = colIndex * cellSize;
        const y = rowIndex * cellSize;

        if (!pixel.isFilled) {
          if (patternRef.current) {
            ctx.fillStyle = patternRef.current;
            ctx.fillRect(x, y, cellSize, cellSize);
          }
        } else {
          ctx.fillStyle = pixel.color;
          ctx.fillRect(x, y, cellSize, cellSize);
        }
        ctx.strokeRect(x, y, cellSize, cellSize);
      });
    });
  }, [pixels, cellSize]);

  // 7. イベントハンドラ
  const handleCanvasMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCellCoordinates(e);
    if (coords) {
      if (isDragging && 
          (lastCellRef.current?.row !== coords.row || lastCellRef.current?.col !== coords.col)) {
        drawPixel(coords.row, coords.col, newPixelColor(selectedColor));
        lastCellRef.current = coords;
      }
    }
  }, [isDragging, getCellCoordinates, drawPixel, selectedColor]);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 0) {
      setIsDragging(true);
      const coords = getCellCoordinates(e);
      if (coords) {
        drawPixel(coords.row, coords.col, newPixelColor(selectedColor));
        lastCellRef.current = coords;
      }
    }
  }, [getCellCoordinates, drawPixel, selectedColor]);

  const handleCanvasMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // 8. JSX
  return (    
    <div className="flex justify-center overflow-auto" style={{ width: '100%', height: '100%' }}>
      <div 
        style={{ 
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'left top',
          transition: 'transform 0.2s ease-in-out',
          position: 'relative',
          display: 'inline-block',
          transformBox: 'fill-box',
        }}
      >
        <canvas
          ref={canvasRef}
          className="border border-blue-700"
          onMouseMove={handleCanvasMouseMove}
          onMouseDown={handleCanvasMouseDown}
          onMouseUp={handleCanvasMouseUp}
          style={{ 
            width: `${BASE}px`, 
            height: `${BASE}px`,
            cursor: `${cursorUrl}, auto`
          }}
        />
      </div>
    </div>
  );
});

export default PixelGrid; 