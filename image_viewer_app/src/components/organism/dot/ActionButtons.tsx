import React from 'react';

interface ActionButtonsProps {
  onSave: () => void;
  onCancel: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ onSave, onCancel }) => {
  return (
    <div className="space-y-2">
      <button 
        className="w-full p-2 bg-blue-600 text-white rounded"
        onClick={onSave}
      >
        保存
      </button>
      <button 
        className="w-full p-2 border text-white rounded"
        onClick={onCancel}
      >
        キャンセル
      </button>
    </div>
  );
}; 