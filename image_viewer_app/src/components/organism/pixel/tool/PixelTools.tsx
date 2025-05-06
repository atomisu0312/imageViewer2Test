import React, { memo } from 'react';
import { TOOLS, ToolType } from '@/types/tool';
interface PixelToolsProps {
  readonly onToolSelect: (tool: ToolType) => void;
  readonly selectedTool: ToolType;
}

const PixelTools = memo(function PixelTools({ onToolSelect, selectedTool }: PixelToolsProps) {
  const tools = TOOLS;

  return (
    <div className="text-white">
      <h2 className="text-xl font-semibold mb-2">ツール</h2>
      <div className="grid grid-cols-3 gap-2">
        {tools.map((tool) => (
          <button
            key={tool.id}
            className={`p-2 border rounded ${
              selectedTool.id === tool.id ? 'bg-blue-600' : ''
            }`}
            onClick={() => onToolSelect(tool)}
          >
            {tool.name}
          </button>
        ))}
      </div>
    </div>
  );
});

export default PixelTools; 