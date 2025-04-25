'use client';
import { useCallback, useState, useMemo } from 'react';
import { PixelEditorMain } from "@/components/organism/pixel/PixelEditorMain";
import { PixelEditorProperties } from "@/components/organism/pixel/PixelEditorProperties";
import PixelTools from "@/components/organism/pixel/PixelTools";
import { ColorPalette } from "@/components/organism/pixel/ColorPalette";
import { ActionButtons } from "@/components/organism/pixel/ActionButtons";
import { useCanvasSize } from "@/hooks/pixel/useCanvasSize";
import { useZoom } from "@/hooks/pixel/useZoom";
import { useCursorColor } from "@/hooks/pixel/useCursorColor";
import { CursorColorType, PixelColorType, newPixelColor } from "@/types/pixel";
import { TOOLS, ToolType } from '@/types/tool';
import { color } from '@/types/color';

export default function NewPixelPage() {
  // 1. State宣言
  const [selectedTool, setSelectedTool] = useState<ToolType>(TOOLS[0]);
  const [selectedColor, setSelectedColor] = useState<PixelColorType>(newPixelColor('#000000'));


  // 5. カスタムフック
  const { value: canvasSize, onChange: setCanvasSize } = useCanvasSize();
  const { value: zoom, onChange: setZoom } = useZoom();
  const { value: cursorColor, onChange: setCursorColor } = useCursorColor();

  // 7. イベントハンドラ
  const handleSave = useCallback(() => {
    // 保存処理の実装
    console.log('ドット絵を保存しました');
  }, []);

  const handleCancel = useCallback(() => {
    // キャンセル処理の実装
    console.log('キャンセルしました');
  }, []);

  const handleCanvasSizeChange = useCallback((size: number) => {
    setCanvasSize({ target: { value: String(size) } } as React.ChangeEvent<HTMLSelectElement>);
  }, [setCanvasSize]);

  const handleZoomChange = useCallback((newZoom: number) => {
    setZoom({ target: { value: String(newZoom) } } as React.ChangeEvent<HTMLSelectElement>);
  }, [setZoom]);

  const handleCursorColorChange = useCallback((color: CursorColorType) => {
    setCursorColor({ target: { value: color } } as React.ChangeEvent<HTMLSelectElement>);
  }, [setCursorColor]);

  const handleToolSelect = useCallback((tool: ToolType) => {
    setSelectedTool(tool);
  }, []);

  const handleColorSelect = useCallback((color: PixelColorType) => {
    setSelectedColor(color);
  }, []);

  // 8. JSX
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-white">新規ドット絵作成</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ドット絵作成エリア */}
        <div className="lg:col-span-2">
          <PixelEditorMain
            canvasSize={canvasSize}
            zoom={zoom}
            cursorColor={cursorColor}
            selectedColor={selectedColor}
            selectedTool={selectedTool}
          />
          <PixelEditorProperties
            canvasSize={canvasSize}
            zoom={zoom}
            cursorColor={cursorColor}
            onCanvasSizeChange={handleCanvasSizeChange}
            onZoomChange={handleZoomChange}
            onCursorColorChange={handleCursorColorChange}
          />
        </div>

        {/* ツールエリア */}
        <div className="space-y-4">
          <PixelTools
            selectedTool={selectedTool}
            onToolSelect={handleToolSelect}
          />
          <ColorPalette
            selectedColor={selectedColor}
            onColorSelect={handleColorSelect}
          />
          <ActionButtons
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
} 