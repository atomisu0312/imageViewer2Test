'use client';
import { useCallback, useState } from 'react';
import PixelGrid from "@/components/organism/dot/PixelGrid";
import { useCanvasSize } from "@/hooks/pixel/useCanvasSize";
import { useZoom } from "@/hooks/pixel/useZoom";

export default function NewPixelPage() {
  // 1. State宣言
  const [cursorColor, setCursorColor] = useState<'blue' | 'red' | 'green'>('blue');

  // 2. Ref宣言
  // なし

  // 3. メモ化された値
  // なし

  // 4. メモ化されたコールバック
  const handleCursorColorChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setCursorColor(e.target.value as 'blue' | 'red' | 'green');
  }, []);

  // 5. カスタムフック
  const { canvasSize, handleSizeChange } = useCanvasSize();
  const { zoom, handleZoomChange } = useZoom();

  // 6. 副作用
  // なし

  // 7. イベントハンドラ
  const handleSave = useCallback(() => {
    // 保存処理の実装
    console.log('ドット絵を保存しました');
  }, []);

  const handleCancel = useCallback(() => {
    // キャンセル処理の実装
    console.log('キャンセルしました');
  }, []);

  // 8. JSX
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-white">新規ドット絵作成</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ドット絵作成エリア */}
        <div className="lg:col-span-2">
          <div className="border rounded-lg bg-slate-800">
            <div className="border border-slate-700 p-3">
              <h1 className="text-center text-3xl text-white mb-4">キャンバス：{canvasSize}x{canvasSize}</h1>
              <div className="flex justify-center items-center min-h-[512px] bg-slate-900 rounded-lg">
                <PixelGrid size={canvasSize} zoom={zoom} cursorColor={cursorColor} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-white">
              <label className="block mb-2">キャンバスサイズ</label>
              <select 
                className="w-full p-2 rounded text-black bg-white" 
                value={canvasSize}
                onChange={handleSizeChange}
              >
                <option value="8">8x8</option>
                <option value="16">16x16</option>
                <option value="32">32x32</option>
                <option value="64">64x64</option>
              </select>
            </div>
            <div className="text-white">
              <label className="block mb-2">ズーム</label>
              <select 
                className="w-full p-2 rounded text-black bg-white"
                value={zoom}
                onChange={handleZoomChange}
              >
                <option value="100">100%</option>
                <option value="200">200%</option>
                <option value="400">400%</option>
              </select>
            </div>
            <div className="text-white">
              <label className="block mb-2">カーソル色</label>
              <select 
                className="w-full p-2 rounded text-black bg-white"
                value={cursorColor}
                onChange={handleCursorColorChange}
              >
                <option value="blue">青</option>
                <option value="red">赤</option>
                <option value="green">緑</option>
              </select>
            </div>
          </div>
        </div>

        {/* ツールエリア */}
        <div className="space-y-4">
          <div className="text-white">
            <h2 className="text-xl font-semibold mb-2">ツール</h2>
            <div className="grid grid-cols-2 gap-2">
              <button className="p-2 border rounded">ペン</button>
              <button className="p-2 border rounded">消しゴム</button>
              <button className="p-2 border rounded">塗りつぶし</button>
              <button className="p-2 border rounded">スポイト</button>
            </div>
          </div>

          <div className="text-white">
            <h2 className="text-xl font-semibold mb-2">カラーパレット</h2>
            <div className="grid grid-cols-8 gap-2">
              {Array(32).fill(null).map((_, i) => (
                <div key={i} className="aspect-square border rounded"></div>
              ))}
            </div>
          </div>

          {/* アクションエリア */}
          <div className="space-y-2">
            <button 
              className="w-full p-2 bg-blue-600 text-white rounded"
              onClick={handleSave}
            >
              保存
            </button>
            <button 
              className="w-full p-2 border text-white rounded"
              onClick={handleCancel}
            >
              キャンセル
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 