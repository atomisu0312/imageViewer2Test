import React, { memo } from 'react';

interface PixelToolsProps {
  readonly onToolSelect: (tool: string) => void;
  readonly selectedTool: string;
}

const PixelTools = memo(function PixelTools({ onToolSelect, selectedTool }: PixelToolsProps) {
  const tools = [
    { id: 'pen', name: 'ペン' },
    { id: 'eraser', name: '消しゴム' },
    { id: 'fill', name: '塗りつぶし' },
    { id: 'eyedropper', name: 'スポイト' },
  ];

  return (
    <div className="text-white">
      <h2 className="text-xl font-semibold mb-2">ツール</h2>
      <div className="grid grid-cols-2 gap-2">
        {tools.map((tool) => (
          <button
            key={tool.id}
            className={`p-2 border rounded ${
              selectedTool === tool.id ? 'bg-blue-600' : ''
            }`}
            onClick={() => onToolSelect(tool.id)}
          >
            {tool.name}
          </button>
        ))}
      </div>
    </div>
  );
});

export default PixelTools; 