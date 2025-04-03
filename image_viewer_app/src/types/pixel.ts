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
export const CANVAS_SIZE_VALUES = [8, 16, 32, 64] as const;
export const CANVAS_SIZES = CANVAS_SIZE_VALUES.map(value => ({ value, label: `${value}x${value}` }));
export type CanvasSizeType = typeof CANVAS_SIZE_VALUES[number];

/**
 * ズーム率の設定値
 */
export const ZOOM_LEVEL_VALUES = [100, 200, 400] as const;
export const ZOOM_LEVELS = ZOOM_LEVEL_VALUES.map(value => ({ value, label: `${value}%` }));
export type ZoomLevelType = typeof ZOOM_LEVEL_VALUES[number];

/**
 * 各設定項目のデフォルト値の定義
 */
export const DEFAULT_VALUES: Record<NumericSettingType, number> = {
  canvasSize: CANVAS_SIZE_VALUES[0],
  zoom: ZOOM_LEVEL_VALUES[0],
} as const;

/**
 * カーソルカラーの設定
 */
export const CURSOR_COLORS: { value: CursorColorType; label: string }[] = [
  { value: 'blue', label: '青' },
  { value: 'red', label: '赤' },
  { value: 'green', label: '緑' },
] as const; 