import { useState } from 'react';

export const useZoom = (initialZoom: number = 100) => {
  const [zoom, setZoom] = useState<number>(initialZoom);

  const handleZoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newZoom = parseInt(e.target.value);
    setZoom(newZoom);
  };

  return {
    zoom,
    handleZoomChange
  };
}; 