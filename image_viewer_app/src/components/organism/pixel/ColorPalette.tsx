import { defaultColorPalette } from '@/types/color';
import React from 'react';
import { PixelColorType } from '@/types/pixel';

interface ColorPaletteProps {
  onColorSelect: (color: PixelColorType) => void;
  selectedColor: PixelColorType;
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({  onColorSelect, selectedColor }) => {
  const colorsDefalt = defaultColorPalette;

  return (
    <div className="text-white">
      <h2 className="text-xl font-semibold mb-2">カラーパレット</h2>
      <div className="grid grid-cols-8 gap-2">
        {colorsDefalt.map((color, i) => (
          <button
            key={`color_${color}`}
            className="aspect-square border rounded"
            style={{ backgroundColor: color }}
            onClick={() => onColorSelect(color)}
          />
        ))}
      </div>
    </div>
  );
}; 