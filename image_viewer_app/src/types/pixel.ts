/**
 * ピクセルエディタの数値設定項目の種類
 */
export type NumericSettingType = 'canvasSize' | 'zoom';

/**
 * カーソルカラーの種類
 */
export type CursorColorType = 'blue' | 'red' | 'green';

/**
 * キャンバスサイズの設定値
 */
export const CANVAS_SIZES = [
  { value: 8, label: '8x8' },
  { value: 16, label: '16x16' },
  { value: 32, label: '32x32' },
  { value: 64, label: '64x64' },
] as const;

export type CanvasSizeType = typeof CANVAS_SIZES[number]['value'];

/**
 * ズーム率の設定値
 */
export const ZOOM_LEVELS = [
  { value: 100, label: '100%' },
  { value: 200, label: '200%' },
  { value: 400, label: '400%' },
] as const;

export type ZoomLevelType = typeof ZOOM_LEVELS[number]['value'];

/**
 * 各設定項目のデフォルト値の定義
 */
export const DEFAULT_VALUES: Record<NumericSettingType, number> = {
  canvasSize: CANVAS_SIZES[0].value,
  zoom: ZOOM_LEVELS[0].value,
} as const;

/**
 * カーソルカラーの設定
 */
export const CURSOR_COLORS: { value: CursorColorType; label: string }[] = [
  { value: 'blue', label: '青' },
  { value: 'red', label: '赤' },
  { value: 'green', label: '緑' },
] as const; 