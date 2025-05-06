import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { togglePixel, setSize, resetPixels, setPixels, erasePixel } from '@/store/slices/pixelSlice';
import { PixelColorType, PixelGrid } from '@/types/pixel';

export const usePixel = () => {
  const dispatch = useDispatch();
  const pixels = useSelector((state: RootState) => state.pixel.pixels);

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

  const savePixelArt = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const OUTPUT_SIZE = 1024;
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;

    const pixelSize = OUTPUT_SIZE / pixels.length;

    // 背景を白に設定
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ピクセルデータを描画
    pixels.forEach((row, i) => {
      row.forEach((pixel, j) => {
        if (pixel.isFilled) {
          ctx.fillStyle = pixel.color;
          ctx.fillRect(
            j * pixelSize,
            i * pixelSize,
            pixelSize,
            pixelSize
          );
        }
      });
    });

    // 画像としてダウンロード
    const link = document.createElement('a');
    link.download = 'pixel-art.png';
    link.href = canvas.toDataURL('image/png');
    link.click();

    // DOM要素のクリーンアップ
    link.remove();
    canvas.remove();
  };

  return {
    pixels,
    togglePixelState,
    erasePixelState,
    updateSize,
    resetPixelState,
    updatePixels,
    savePixelArt,
  };
}; 