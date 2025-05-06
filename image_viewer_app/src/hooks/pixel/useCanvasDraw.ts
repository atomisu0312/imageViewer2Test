import { useMemo, useRef, useEffect, useCallback } from "react";
import { PixelGrid } from "@/types/pixel";

export const useCanvasDraw = (size: number, pixels: PixelGrid) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const patternRef = useRef<CanvasPattern | null>(null);
  const CANVAS_BASE = 512; // キャンバスの基本サイズを定義
  const cellSize = useMemo(() => CANVAS_BASE / size, [size]);

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

  // パターンの生成
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = CANVAS_BASE;
    canvas.height = CANVAS_BASE;

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

    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        patternRef.current = ctx.createPattern(patternCanvas, 'repeat');
      }
    }
  }, []);

  // ピクセルの描画
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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
  
  return { canvasRef, cellSize, CANVAS_BASE, getCellCoordinates };
}