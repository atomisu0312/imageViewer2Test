'use client';
import { useEffect, useRef, useState, useMemo, useCallback } from "react";


// propとしてキャンバスのサイズを準備 
interface PixelGridProps {
  size: number;
  zoom?: number;
  cursorColor?: 'blue' | 'red' | 'green'; // カーソルの色を指定するプロパティを追加
}

export default function PixelGrid({ size, zoom = 100, cursorColor = 'blue' }: PixelGridProps) {
  const BASE = 512;
   
  // 1. State宣言
  const [pixels, setPixels] = useState<boolean[][]>(() => 
    Array(size).fill(null).map(() => Array(size).fill(false))
  );
  const [isDragging, setIsDragging] = useState(false);

  // 2. Ref宣言
  const lastCellRef = useRef<{ row: number; col: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 3. メモ化された値
  const cellSize = useMemo(() => BASE / size, [size]);
  
  // カーソルのURLをメモ化
  const cursorUrl = useMemo(() => {
    if (cursorColor === 'blue') return `url('/cursor/pen.svg')`;
    return `url('/cursor/colors/pen-${cursorColor}.svg')`;
  }, [cursorColor]);

  // 4. メモ化されたコールバック
  const drawPixel = useCallback((row: number, col: number) => {
    setPixels(prev => {
      const newPixels = prev.map(row => [...row]);
      newPixels[row][col] = !newPixels[row][col];
      return newPixels;
    });
  }, []);

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

  // 5. カスタムフック
  // なし

  // 6. 副作用
  useEffect(() => {
    setPixels(Array(size).fill(Array(size).fill(false)));
  }, [size]);

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
      row.forEach((cell, colIndex) => {
        const x = colIndex * cellSize;
        const y = rowIndex * cellSize;

        ctx.fillStyle = cell ? '#000000' : '#ffffff';
        ctx.fillRect(x, y, cellSize, cellSize);
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
        drawPixel(coords.row, coords.col);
        lastCellRef.current = coords;
      }
    }
  }, [isDragging, getCellCoordinates, drawPixel]);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 0) {
      setIsDragging(true);
      const coords = getCellCoordinates(e);
      if (coords) {
        drawPixel(coords.row, coords.col);
        lastCellRef.current = coords;
      }
    }
  }, [getCellCoordinates, drawPixel]);

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
} 