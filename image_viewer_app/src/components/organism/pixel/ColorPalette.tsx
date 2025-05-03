import { Color, defaultColorPalette } from '@/types/color';
import React, { useState } from 'react';
import { PixelColorType } from '@/types/pixel';
import ColorPaletteUnit from './ColorPaletteUnit';
import AddColorPaletteUnit from './AddColorPaletteUnit';

interface ColorPaletteProps {
  onColorSelect: (color: PixelColorType) => void;
  selectedColor: PixelColorType;
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({  onColorSelect, selectedColor }) => {
  const [paletteColors, setPaletteColors] = useState(defaultColorPalette);

  const handleAddColorPalette = (color: Color) => {
    if (paletteColors.includes(color)) {
      return;
    }
    setPaletteColors([...paletteColors, color]);
  };

  const handleDeleteColorPalette = (color: Color) => {
    setPaletteColors(paletteColors.filter((c) => c !== color));
  };

  return (
    <div className="text-white">
      <h2 className="text-xl font-semibold mb-2">カラーパレット</h2>
      <div className="grid grid-cols-8 gap-4">
        {paletteColors.map((color, i) => (
          <ColorPaletteUnit 
            key={`color-${i}`}
            onClick={() => onColorSelect(color)} 
            color={color} 
            onDelete={() => handleDeleteColorPalette(color)}
          />
        ))}
        <AddColorPaletteUnit onClick={handleAddColorPalette} />
      </div>
    </div>
  );
}; 