'use client';
import { useEffect, useRef, useState } from "react";


// propとしてキャンバスのサイズを準備 
interface PixelGridProps {
  size: number;
  zoom?: number;
}

export default function PixelGrid({ size, zoom = 100 }: PixelGridProps) {
  const BASE = 512;
   
  const [pixels, setPixels] = useState<boolean[][]>(() => 
    Array(size).fill(null).map(() => Array(size).fill(false))
  );
  const [isDragging, setIsDragging] = useState(false);
  const cellSize = BASE / size;
  const lastCellRef = useRef<{ row: number; col: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // キャンバスの描画
  useEffect(() => {
    setPixels(Array(size).fill(Array(size).fill(false)));
  }, [size]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // キャンバスサイズの設定
    canvas.width = BASE;
    canvas.height = BASE;

    // グリッドの描画
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 0.2;

    // ピクセルの描画
    pixels.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const x = colIndex * cellSize;
        const y = rowIndex * cellSize;

        // ピクセルの塗りつぶし
        ctx.fillStyle = cell ? '#000000' : '#ffffff';
        ctx.fillRect(x, y, cellSize, cellSize);

        // グリッド線
        ctx.strokeRect(x, y, cellSize, cellSize);
      });
    });
  }, [pixels]);

  // ピクセルの更新、この際に描画処理が起こる
  const drawPixel = (row: number, col: number) => {
    setPixels(prev => {
      const newPixels = prev.map(row => [...row]);
      newPixels[row][col] = !newPixels[row][col];
      return newPixels;
    });
  };

  // マウスの座標を取得
  const getCellCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
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
  };

  // 【イベント】移動
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCellCoordinates(e);
    if (coords) {
      // ドラッグ中で、前回のセルと異なる場合のみ色を変更
      if (isDragging  && 
          (lastCellRef.current?.row !== coords.row || lastCellRef.current?.col !== coords.col)) {
        drawPixel(coords.row, coords.col);
        lastCellRef.current = coords;
      }
    }
  };

  // 【イベント】クリック
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // 左クリックの場合
    if (e.button === 0) {
      setIsDragging(true);
      const coords = getCellCoordinates(e);
      if (coords) {
        drawPixel(coords.row, coords.col);
        lastCellRef.current = coords;
      }
    }
  };

  // 【イベント】マウスアップ
  const handleCanvasMouseUp = () => {
    // クリックから手を離していたら、ドラッグを停止
    setIsDragging(false);
  };

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
          style={{ width: `${BASE}px`, height: `${BASE}px` }}
        />
      </div>
    </div>
  );
} 