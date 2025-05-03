import { Color } from '@/types/color';
import React from 'react';

interface ColorSquareProps {
  color?: Color;
  onClick?: () => void;
}

const ColorSquare: React.FC<ColorSquareProps> = ({
  color = '#ffffff',
  onClick,
}) => {
  return (
      <button
        onClick={onClick}
        key={`color_${color}`}
        className="aspect-square border rounded"
        style={{ backgroundColor: color }}
      />
  );
};

export default ColorSquare;