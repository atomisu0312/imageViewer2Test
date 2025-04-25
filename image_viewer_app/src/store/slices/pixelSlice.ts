import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Pixel, PixelGrid, PixelColorType } from '@/types/pixel';

interface PixelState {
  pixels: PixelGrid;
  size: number;
}

const createEmptyPixel = (): Pixel => ({
  isFilled: false,
  color: '#ffffff' as PixelColorType,
});

const createEmptyGrid = (size: number): PixelGrid => 
  Array(size).fill(null).map(() => 
    Array(size).fill(null).map(() => createEmptyPixel())
  );

const initialState: PixelState = {
  pixels: [],
  size: 32,
};

const pixelSlice = createSlice({
  name: 'pixel',
  initialState,
  reducers: {
    setPixels: (state, action: PayloadAction<PixelGrid>) => {
      state.pixels = action.payload;
    },
    togglePixel: (state, action: PayloadAction<{ row: number; col: number; color: PixelColorType }>) => {
      const { row, col, color } = action.payload;
      if (state.pixels[row] && state.pixels[row][col] !== undefined) {
        state.pixels[row][col] = {
          isFilled: true,
          color: color as PixelColorType,
        };
      }
    },
    erasePixel: (state, action: PayloadAction<{ row: number; col: number }>) => {
      const { row, col } = action.payload;
      if (state.pixels[row] && state.pixels[row][col] !== undefined) {
        state.pixels[row][col] = {
          isFilled: false,
          color: '#ffffff' as PixelColorType,
        };
      }
    },
    setSize: (state, action: PayloadAction<number>) => {
      state.size = action.payload;
      state.pixels = createEmptyGrid(action.payload);
    },
    resetPixels: (state) => {
      state.pixels = createEmptyGrid(state.size);
    },
  },
});

export const { setPixels, togglePixel, setSize, resetPixels, erasePixel } = pixelSlice.actions;
export default pixelSlice.reducer; 