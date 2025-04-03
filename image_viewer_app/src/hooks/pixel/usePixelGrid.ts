import { useEffect, useState } from "react";

type UsePixelGridReturn = [
  boolean[][],
  boolean,
  { x: number; y: number },
  (row: number, col: number) => void,
  (row: number, col: number) => void,
  (e: React.MouseEvent) => void
];

function usePixelGrid(): UsePixelGridReturn {
  const size = 32;
  const [pixels, setPixels] = useState<boolean[][]>(Array(size).fill(Array(size).fill(false)));
  const [isDragging, setIsDragging] = useState(false);
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });

  const handleCellClick = (row: number, col: number) => {
    setPixels(prev => {
      const newPixels = prev.map(row => [...row]);
      newPixels[row][col] = !newPixels[row][col];
      return newPixels;
    });
  };

  const handleCellHover = (row: number, col: number) => {
    setCoordinates({ x: col, y: row });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
    }
  };

  return [pixels, isDragging, coordinates, handleCellClick, handleCellHover, handleMouseDown];
}

export default usePixelGrid;