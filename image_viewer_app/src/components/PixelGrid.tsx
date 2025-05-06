import React, { useMemo } from 'react';

interface PixelGridProps {
  width: number;
  height: number;
  color: string;
}

export const PixelGrid: React.FC<PixelGridProps> = ({ width, height, color }) => {
  const pixels = useMemo(() => {
    const grid: boolean[][] = Array(height)
      .fill(null)
      .map(() => Array(width).fill(false));

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        grid[y][x] = (x + y) % 2 === 0;
      }
    }

    return grid;
  }, [width, height]);

  return (
    <div className="grid" style={{ 
      display: 'grid',
      gridTemplateColumns: `repeat(${width}, 1fr)`,
      gap: '1px',
      backgroundColor: '#ccc',
      padding: '1px',
      width: 'fit-content'
    }}>
      {pixels.map((row, y) =>
        row.map((isActive, x) => (
          <div
            key={`${x}-${y}`}
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: isActive ? color : 'white',
              transition: 'background-color 0.2s'
            }}
          />
        ))
      )}
    </div>
  );
}; 