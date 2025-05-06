import { useState } from 'react';
import { PixelRecord } from '@/types/pixelRecord';
import { usePixel } from '@/hooks/common/usePixel';
import { Stack } from '@/lib/util/Stack';

function usePixelRecords() {
  const [historyStack] = useState(() => new Stack<PixelRecord[]>());
  const { togglePixelState, erasePixelState } = usePixel();

  const addPixelRecord = (pixelRecord: PixelRecord[]) => {
    historyStack.push(pixelRecord);
  };

  const restoreFromHistory = () => {
    const records = historyStack.pop();
    if (records) {
      records.forEach(record => {
        if (record.pixel.isFilled) {
          togglePixelState(record.row, record.col, record.pixel.color);
        } else {
          erasePixelState(record.row, record.col);
        }
      });
    }
  };

  return { addPixelRecord, restoreFromHistory };
}

export default usePixelRecords;