import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { togglePixel, setSize, resetPixels, setPixels, erasePixel } from '@/store/slices/pixelSlice';
import { PixelColorType, PixelGrid } from '@/types/pixel';

export const usePixel = () => {
  const pixels = useSelector((state: RootState) => state.pixel.pixels);
  const size = useSelector((state: RootState) => state.pixel.size);
  const dispatch = useDispatch();

  const togglePixelState = (row: number, col: number, color: PixelColorType) => {
    dispatch(togglePixel({ row, col, color }));
  };

  const erasePixelState = (row: number, col: number) => {
    dispatch(erasePixel({ row, col }));
  };

  const updateSize = (newSize: number) => {
    dispatch(setSize(newSize));
  };

  const resetPixelState = () => {
    dispatch(resetPixels());
  };

  const updatePixels = (newPixels: PixelGrid) => {
    dispatch(setPixels(newPixels));
  };

  return {
    pixels,
    size,
    togglePixelState,
    erasePixelState,
    updateSize,
    resetPixelState,
    updatePixels,
  };
}; 