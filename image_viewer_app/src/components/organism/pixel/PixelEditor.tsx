import { memo } from 'react';
import PixelGrid from "@/components/organism/pixel/PixelGrid";
import { CursorColorType, CanvasSizeType, ZoomLevelType } from "@/types/pixel";

export type PixelEditorProps = {
  canvasSize: CanvasSizeType;
  zoom: ZoomLevelType;
  cursorColor: CursorColorType;
};

export const PixelEditor = memo(function PixelEditor({
  canvasSize,
  zoom,
  cursorColor,
}: PixelEditorProps) {
  return (
    <div className="border rounded-lg bg-slate-800">
      <div className="border border-slate-700 p-3">
        <h1 className="text-center text-3xl text-white mb-4">キャンバス：{canvasSize}x{canvasSize}</h1>
        <div className="flex justify-center items-center min-h-[512px] bg-slate-900 rounded-lg">
          <PixelGrid 
            size={canvasSize} 
            zoom={zoom} 
            cursorColor={cursorColor}
          />
        </div>
      </div>
    </div>
  );
}); 