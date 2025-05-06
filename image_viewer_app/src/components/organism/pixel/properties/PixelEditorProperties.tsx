import React from 'react';
import PixelPropertySelect from '@/components/molecule/pixel/PixelPropertySelect';
import { CANVAS_SIZES, ZOOM_LEVELS, CURSOR_COLORS } from '@/types/pixel';
import { CanvasSizeType, ZoomLevelType, CursorColorType } from '@/types/pixel';

interface PixelEditorPropertiesProps {
  readonly canvasSize: CanvasSizeType;
  readonly zoom: ZoomLevelType;
  readonly cursorColor: CursorColorType;
  readonly onCanvasSizeChange: (size: CanvasSizeType) => void;
  readonly onZoomChange: (zoom: ZoomLevelType) => void;
  readonly onCursorColorChange: (color: CursorColorType) => void;
}

export const PixelEditorProperties: React.FC<Readonly<PixelEditorPropertiesProps>> = ({
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
        <PixelPropertySelect<CanvasSizeType>
          label="キャンバスサイズ"
          value={canvasSize}
          options={CANVAS_SIZES}
          onChange={onCanvasSizeChange}
        />
        <PixelPropertySelect<ZoomLevelType>
          label="ズーム"
          value={zoom}
          options={ZOOM_LEVELS}
          onChange={onZoomChange}
        />
        <PixelPropertySelect<CursorColorType>
          label="カーソルカラー"
          value={cursorColor}
          options={CURSOR_COLORS}
          onChange={onCursorColorChange}
        />
      </div>
    </div>
  );
};
