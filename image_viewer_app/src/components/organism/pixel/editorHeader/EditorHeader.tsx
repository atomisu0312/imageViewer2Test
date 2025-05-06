'use client';
import React from 'react';

interface Props {
  canvasSize: number;
  onUndo: () => void;
}

const EditorHeader: React.FC<Props> = ({
  canvasSize,
  onUndo,
}) => {

  return (
    <div className="grid grid-cols-3 gap-4 items-center">
      <div className='col-span-1 flex justify-end items-center'>
        <button type="button" className='text-white' onClick={() => {}}>
          なんか
        </button>
      </div>
      <div className='col-span-1'>
        <h1 className="text-center text-3xl text-white">キャンバス：{canvasSize}x{canvasSize}</h1>
      </div>
      <div className='col-span-1'>
        <button
          onClick={onUndo}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Undo
        </button>
      </div>
    </div>
  );
};

export default React.memo(EditorHeader);