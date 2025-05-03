'use client';
import { Color } from '@/types/color';
import React from 'react';
import ColorPicker from '../colorPicker';

interface Props {
  onClick?: (color: string) => void;
}

const AddSquare: React.FC<Props> = ({
  onClick,
}) => {
  return (
    <div className="aspect-square border flex items-center justify-center">
      <div className="w-full h-full flex items-center justify-center">
        <ColorPicker onChange={onClick} />
      </div>
    </div>
  );
};

export default AddSquare;