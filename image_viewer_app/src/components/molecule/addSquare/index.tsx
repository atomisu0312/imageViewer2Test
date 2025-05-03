import { Color } from '@/types/color';
import React from 'react';

interface Props {
  onClick?: () => void;
}

const AddSquare: React.FC<Props> = ({
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="aspect-square border rounded-full"
    >
      <span className="text-white text-lg">+</span>
    </button>
  );
};

export default AddSquare;