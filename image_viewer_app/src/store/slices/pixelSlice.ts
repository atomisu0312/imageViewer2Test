import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Pixel, PixelGrid, PixelColorType } from '@/types/pixel';

interface PixelState {
  pixels: PixelGrid;
  size: number;
}

const createEmptyPixel = (): Pixel => ({
  isFilled: false,
  color: 'black',
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
    togglePixel: (state, action: PayloadAction<{ row: number; col: number }>) => {
      const { row, col } = action.payload;
      if (state.pixels[row] && state.pixels[row][col] !== undefined) {
        state.pixels[row][col] = {
          isFilled: !state.pixels[row][col].isFilled,
          color: 'black',
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

export const { setPixels, togglePixel, setSize, resetPixels } = pixelSlice.actions;
export default pixelSlice.reducer; 