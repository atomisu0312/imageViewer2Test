import { defaultColorPalette } from '@/types/color';
import React, { useState } from 'react';
import { PixelColorType } from '@/types/pixel';
import ColorSquare from '@/components/molecule/ColorSquare';
import AddSquare from '@/components/molecule/addSquare';
import ColorPaletteUnit from './ColorPaletteUnit';

interface ColorPaletteProps {
  onColorSelect: (color: PixelColorType) => void;
  selectedColor: PixelColorType;
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({  onColorSelect, selectedColor }) => {
  const [paletteColors, setPaletteColors] = useState(defaultColorPalette);
  
  return (
    <div className="text-white">
      <h2 className="text-xl font-semibold mb-2">カラーパレット</h2>
      <div className="grid grid-cols-8 gap-4">
        {paletteColors.map((color, i) => (
          <ColorPaletteUnit onClick={() => onColorSelect(color)} color={color} />
        ))}
        <AddSquare onClick={() => {}} />
      </div>
    </div>
  );
}; 