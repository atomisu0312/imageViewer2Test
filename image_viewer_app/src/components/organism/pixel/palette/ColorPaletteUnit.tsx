import ColorSquare from '@/components/molecule/ColorSquare';
import { Color } from '@/types/color';
import React from 'react';

interface Props {
  color?: Color;
  onClick?: () => void;
  onDelete?: () => void;
}

const ColorPaletteUnit: React.FC<Props> = ({
  color,
  onClick,
  onDelete,
}) => {
  return (
    <div className="grid grid-cols-1 gap-1">
      <ColorSquare onClick={onClick} color={color} />
      <div className="flex justify-center gap-2">
        <button className="text-white text-lg" onClick={onDelete}>❌</button>
      </div>
    </div>
  );
};

export default ColorPaletteUnit;