import { useState } from 'react';
import { PixelRecord } from '@/types/pixelRecord';
import { PixelGrid } from '@/types/pixel';

class Stack<T> {
  private data: T[];

  constructor() {
    this.data = [];
  }

  push(record: T) {
    this.data.push(record);
  }

  pop(): T | undefined {
    return this.data.pop();
  }

  peek(): T | undefined {
    return this.data[this.data.length - 1];
  }

  clear() {
    this.data = [];
  }

  get length(): number {
    return this.data.length;
  }
}

function usePixelRecords() {
  const [historyStack] = useState(() => new Stack<PixelRecord[]>());

  const addPixelRecord = (pixelRecord: PixelRecord[]) => {
    historyStack.push(pixelRecord);
  };

  const restoreFromHistory = (pixels: PixelGrid) => {
    const records = historyStack.pop();
    if (records) {
      records.forEach(record => {
        pixels[record.row][record.col] = record.pixel;
      });
    }
  };

  return { addPixelRecord, restoreFromHistory };
}

export default usePixelRecords;