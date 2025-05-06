'use client';
import { usePixel } from '@/hooks/common/usePixel';

const ActionButtons = () => {
  const { resetPixelState, savePixelArt } = usePixel();

  return (
    <div className="space-y-2">
      <button
        onClick={resetPixelState}
        className="w-full p-2 border text-white rounded"
      >
        クリア
      </button>
      <button
        onClick={savePixelArt}
        className="w-full p-2 bg-blue-600 text-white rounded"
      >
        保存
      </button>
    </div>
  );
};

export default ActionButtons; 