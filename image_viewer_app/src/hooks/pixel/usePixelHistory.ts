import { useState, useCallback } from 'react';
import { Pixel } from '@/types/pixel';
import { PixelRecord } from '@/types/pixelRecord';

interface UsePixelHistoryProps {
  addPixelRecord: (records: PixelRecord[]) => void;
}

export function usePixelHistory({ addPixelRecord }: UsePixelHistoryProps) {
  const [tmpHistory, setTmpHistory] = useState<PixelRecord[]>([]);

  /** 直近の変更をリストとしてまとめておく */
  const addTmpHistoryRecord = useCallback((row: number, col: number, pixel: Pixel) => {
    setTmpHistory(prev => {
      // historyの中に同じ座標のものがある場合には保存しない
      const hasSameCoordinate = prev.some(record => record.row === row && record.col === col);
      if (hasSameCoordinate) {
        return prev;
      }
      return [...prev, {
        row,
        col,
        pixel: { ...pixel }
      }];
    });
  }, []);

  /** 直近の変更をまとめて、履歴として保存する関数、この際一時履歴は空にしておく */
  const rollUpHistoryRecord = useCallback(() => {
    addPixelRecord(tmpHistory);
    setTmpHistory([]);
  }, [tmpHistory, addPixelRecord]);

  return {
    addTmpHistoryRecord,
    rollUpHistoryRecord
  };
} 