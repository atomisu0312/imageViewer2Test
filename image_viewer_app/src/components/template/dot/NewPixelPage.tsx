'use client';
import PixelGrid from "@/components/organism/dot/PixelGrid";
import { useCanvasSize } from "@/hooks/pixel/useCanvasSize";
import { useZoom } from "@/hooks/pixel/useZoom";

export default function NewPixelPage() {
  const { canvasSize, handleSizeChange } = useCanvasSize();
  const { zoom, handleZoomChange } = useZoom();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-white">新規ドット絵作成</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ドット絵作成エリア */}
        <div className="lg:col-span-2">
          <div className="border rounded-lg">
            <div className="border border-slate-700 p-3 justify-center">
              <h1 className="text-center text-3xl">キャンバス：{canvasSize}x{canvasSize}</h1>
              <div>
                <PixelGrid size={canvasSize} zoom={zoom} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
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
            <button className="w-full p-2 bg-blue-600 text-white rounded">保存</button>
            <button className="w-full p-2 border text-white rounded">キャンセル</button>
          </div>
        </div>
      </div>
    </div>
  );
} 