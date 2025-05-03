'use client';
import { Color } from '@/types/color';
import React, { useState } from 'react';
import ColorPicker from '@/components/molecule/colorPicker';

interface Props {
  onClick: (color: string) => void;
}

const AddColorPaletteUnit: React.FC<Props> = ({
  onClick,
}) => {
  const [selectedColor, setSelectedColor] = useState('#000000');

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  return (
    <div className="grid grid-cols-1 gap-1">
      <ColorPicker onChange={handleColorChange} />
      <div className="flex justify-center gap-2">
        <button 
          className="text-white text-lg"
          onClick={() => onClick(selectedColor)}
        >
          ADD
        </button>
      </div>
    </div>
  );
};

export default AddColorPaletteUnit;