'use client';
import React from 'react';

interface Props {
  canvasSize: number;
}

const EditorHeader: React.FC<Props> = ({
  canvasSize,
}) => {

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className='col-span-1'>
      </div>
      <div className='col-span-1'>
      <h1 className="text-center text-3xl text-white mb-4">キャンバス：{canvasSize}x{canvasSize}</h1>
      </div>
      <div className='col-span-1'>
      </div>
    </div>
  );
};

export default React.memo(EditorHeader);