import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Pixel, PixelGrid, PixelColorType } from '@/types/pixel';

interface PixelState {
  pixels: PixelGrid;
  size: number;
}

/** 空のピクセルを作成
 * @returns 空のピクセル
 */
const createEmptyPixel = (): Pixel => ({
  isFilled: false,
  color: '#ffffff' as PixelColorType,
});

/** 空のピクセルグリッドを作成(２次元配列なので、二重に初期化している)
 * @param size サイズ
 * @returns 空のピクセルグリッド
 */
const createEmptyGrid = (size: number): PixelGrid => 
  Array(size).fill(null).map(() => 
    Array(size).fill(null).map(() => createEmptyPixel())
  );

/** 初期状態
 * @returns 初期状態
 */
const initialState: PixelState = {
  pixels: [],
  size: 32,
};

/** ピクセルの状態を管理するスライス
 * @returns ピクセルの状態を管理するスライス
 */
const pixelSlice = createSlice({
  name: 'pixel',
  initialState,
  reducers: {
    /** ピクセルの状態を設定
     * @param pixels ピクセルの状態
     */
    setPixels: (state, action: PayloadAction<PixelGrid>) => {
      state.pixels = action.payload;
    },

    /** ピクセルの状態を変更
     * @param row 行
     * @param col 列
     * @param color 色
     */
    togglePixel: (state, action: PayloadAction<{ row: number; col: number; color: PixelColorType }>) => {
      const { row, col, color } = action.payload;
      if (state.pixels[row]?.[col] !== undefined) {
        state.pixels[row][col] = {
          isFilled: true,
          color: color,
        };
      }
    },

    /** ピクセルの状態を削除
     * @param row 行
     * @param col 列
     */
    erasePixel: (state, action: PayloadAction<{ row: number; col: number }>) => {
      const { row, col } = action.payload;
      if (state.pixels[row]?.[col] !== undefined) {
        state.pixels[row][col] = {
          isFilled: false,
          color: '#ffffff' as PixelColorType,
        };
      }
    },

    /** ピクセルのサイズを設定
     * @param size サイズ
     */
    setSize: (state, action: PayloadAction<number>) => {
      state.size = action.payload;
      state.pixels = createEmptyGrid(action.payload);
    },

    /** ピクセルの状態をリセット
     */
    resetPixels: (state) => {
      state.pixels = createEmptyGrid(state.size);
    },
  },
});

/** ピクセルの状態を管理するスライスのアクション
 * @returns ピクセルの状態を管理するスライスのアクション
 */
export const { setPixels, togglePixel, setSize, resetPixels, erasePixel } = pixelSlice.actions;

/** ピクセルの状態を管理するスライスのリデューサー
 * @returns ピクセルの状態を管理するスライスのリデューサー
 */
export const pixelReducer = pixelSlice.reducer;