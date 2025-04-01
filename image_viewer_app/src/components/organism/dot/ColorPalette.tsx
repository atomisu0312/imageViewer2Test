import React from 'react';

interface ColorPaletteProps {
  colors: string[];
  onColorSelect: (color: string) => void;
  selectedColor: string;
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({ colors, onColorSelect, selectedColor }) => {
  return (
    <div className="text-white">
      <h2 className="text-xl font-semibold mb-2">カラーパレット</h2>
      <div className="grid grid-cols-8 gap-2">
        {colors.map((color, i) => (
          <button
            key={`color_${color}`}
            className="aspect-square border rounded"
            onClick={() => onColorSelect(color)}
          />
        ))}
      </div>
    </div>
  );
}; 