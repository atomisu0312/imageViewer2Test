'use client';

import { Color } from '@/types/color';
import React, { useState } from 'react';
import { SketchPicker, ColorResult } from 'react-color';

interface ColorPickerProps {
  onChange?: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ 
  onChange 
}) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [color, setColor] = useState('#000000');

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleChange = (color: ColorResult) => {
    setColor(color.hex);
    onChange?.(color.hex);
  };

  return (
    <div className="aspect-square border rounded">
      <div 
        className="w-full h-full rounded cursor-pointer"
        onClick={handleClick}
      >
        <div 
          className="w-full h-full rounded"
          style={{ backgroundColor: color }}
        />
      </div>
      {displayColorPicker && (
        <div className="absolute z-10">
          <div 
            className="fixed inset-0"
            onClick={handleClose}
          />
          <div className="relative">
            <SketchPicker 
              color={color} 
              onChange={handleChange}
              styles={{
                default: {
                  picker: {
                    background: '#fff',
                    color: '#000',
                  },
                  input: {
                    color: '#000',
                  },
                  label: {
                    color: '#000',
                  },
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;