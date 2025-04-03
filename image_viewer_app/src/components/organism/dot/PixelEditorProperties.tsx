import React from 'react';
import { PropertySelect } from '@/components/molecule/propertySelect';
import { CanvasSizeType, ZoomLevelType, CursorColorType, CANVAS_SIZES, ZOOM_LEVELS, CURSOR_COLORS } from '@/types/pixel';

interface PixelEditorPropertiesProps {
  canvasSize: CanvasSizeType;
  zoom: ZoomLevelType;
  cursorColor: CursorColorType;
  onCanvasSizeChange: (size: CanvasSizeType) => void;
  onZoomChange: (zoom: ZoomLevelType) => void;
  onCursorColorChange: (color: CursorColorType) => void;
}

export const PixelEditorProperties: React.FC<PixelEditorPropertiesProps> = ({
  canvasSize,
  zoom,
  cursorColor,
  onCanvasSizeChange,
  onZoomChange,
  onCursorColorChange,
}) => {
  return (
    <div className="p-4 rounded-lg">
      <div className="grid grid-cols-3 gap-4">
        <PropertySelect<CanvasSizeType>
          label="キャンバスサイズ"
          value={canvasSize}
          options={CANVAS_SIZES}
          onChange={onCanvasSizeChange}
        />
        <PropertySelect<ZoomLevelType>
          label="ズーム"
          value={zoom}
          options={ZOOM_LEVELS}
          onChange={onZoomChange}
        />
        <PropertySelect<CursorColorType>
          label="カーソルカラー"
          value={cursorColor}
          options={CURSOR_COLORS}
          onChange={onCursorColorChange}
        />
      </div>
    </div>
  );
};
