import { useState, useCallback } from 'react';
import { CursorColorType, CURSOR_COLORS } from '@/types/pixel';

type CursorColorHookReturn = {
  value: CursorColorType;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export const useCursorColor = (initialColor?: CursorColorType): CursorColorHookReturn => {
  const [cursorColor, setCursorColor] = useState<CursorColorType>(initialColor ?? CURSOR_COLORS[0].value);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setCursorColor(e.target.value as CursorColorType);
  }, []);

  return {
    value: cursorColor,
    onChange: handleChange
  };
}; 