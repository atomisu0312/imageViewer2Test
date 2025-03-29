import { useState, useCallback } from 'react';

export const useCanvasSize = (initialSize: number = 8) => {
  const [canvasSize, setCanvasSize] = useState<number>(initialSize);

  const handleSizeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value);
    setCanvasSize(newSize);
  }, []);

  return {
    canvasSize,
    handleSizeChange
  };
}; 