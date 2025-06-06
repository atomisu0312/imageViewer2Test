'use client';
import { useEffect, useRef, useState, useMemo, useCallback, memo } from "react";
import { CursorColorType, Pixel, PixelColorType, newPixelColor } from "@/types/pixel";
import { useCanvasDraw } from "@/hooks/pixel/useCanvasDraw";
import { ToolType } from "@/types/tool";
import { usePixel } from "@/hooks/common/usePixel";
import { PixelRecord } from "@/types/pixelRecord";
import { usePixelHistory } from "@/hooks/pixel/usePixelHistory";

interface PixelGridProps {
  size: number;
  zoom?: number;
  cursorColor?: CursorColorType;
  selectedColor: PixelColorType;
  selectedTool: ToolType;
  addPixelRecord: (records: PixelRecord[]) => void; //グリッドの中では、履歴の追加しかしないので、この関数のみ渡せればOK
}

const PixelGrid = memo(function PixelGrid({
  size, zoom = 100, cursorColor = 'blue', selectedColor, selectedTool, addPixelRecord
}: PixelGridProps) {
  const { pixels, togglePixelState, erasePixelState, updateSize } = usePixel();
  const { canvasRef, CANVAS_BASE, getCellCoordinates } = useCanvasDraw(size, pixels);
  const [isDragging, setIsDragging] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const { addTmpHistoryRecord, rollUpHistoryRecord } = usePixelHistory({ addPixelRecord });

  // 最後にクリックしたセルの座標（再レンダリングされると困るのでRefとして定義）
  const lastCellRef = useRef<{ row: number; col: number } | null>(null);
  
  // カーソルのURL
  const cursorUrl = useMemo(() => {
    if (selectedTool.id === 'eraser') return `url('/cursor/eraser.svg')`;
    return `url('/cursor/colors/pen-${cursorColor}.svg')`;
  }, [cursorColor, selectedTool]);
  
  /** ピクセルのStateを変更 */
  const changePixelState = useCallback((row: number, col: number, color: PixelColorType) => {
    if (selectedTool.id === 'eraser') {
      erasePixelState(row, col);
    } else {
      togglePixelState(row, col, color);
    }
  }, [selectedTool, togglePixelState, erasePixelState]);

  /** ピクセルのStateを変更 */
  const updatePixel = useCallback((coords) => {
    if (selectedTool.id === 'eraser' && !pixels[coords.row][coords.col].isFilled) {
      return;
    }
    // 履歴を保存
    addTmpHistoryRecord(coords.row, coords.col, pixels[coords.row][coords.col]);
    // ピクセルのStateを変更
    changePixelState(coords.row, coords.col, newPixelColor(selectedColor));
  }, [addTmpHistoryRecord, changePixelState, pixels, selectedColor, selectedTool]);

  // キャンバスの初期化
  useEffect(() => {
    updateSize(size);
    setInitialized(true);
  }, [size, initialized]);

  // マウスイベント(マウスムーブ)
  const handleCanvasMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCellCoordinates(e);
    if (coords) {
      if (isDragging && 
          (lastCellRef.current?.row !== coords.row || lastCellRef.current?.col !== coords.col)) {
        updatePixel(coords);
        lastCellRef.current = coords;
      }
    }
  }, [isDragging, updatePixel]);

  // マウスイベント(マウス押下)
  const handleCanvasMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 0) {
      setIsDragging(true);
      const coords = getCellCoordinates(e);
      if (coords) {
        updatePixel(coords);
        lastCellRef.current = coords;
      }
    }
  }, [changePixelState, selectedColor, updatePixel]);

  // マウスイベント(マウス離下)
  const handleCanvasMouseUp = useCallback(() => {
    setIsDragging(false);
    // 変更をまとめて履歴として保存 
    rollUpHistoryRecord();
  }, [rollUpHistoryRecord]);

  return ( 
    <div className="flex justify-between items-center min-h-[512px] bg-slate-900 rounded-lg">
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
              width: `${CANVAS_BASE}px`, 
              height: `${CANVAS_BASE}px`,
              cursor: `${cursorUrl}, auto`
            }}
          />
        </div>
      </div>
    </div>
  );
});

export default PixelGrid; 