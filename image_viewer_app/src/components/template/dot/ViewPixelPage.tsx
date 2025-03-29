export default function ViewPixelPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-white">ドット絵詳細</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ドット絵表示エリア */}
        <div className="lg:col-span-2">
          <div className="aspect-square border rounded-lg mb-4">
            <div className="w-full h-full bg-gray-700"></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-white">
              <label className="block mb-2">ズーム</label>
              <select className="w-full p-2 rounded">
                <option>100%</option>
                <option>200%</option>
                <option>400%</option>
              </select>
            </div>
          </div>
        </div>

        {/* 情報詳細エリア */}
        <div className="space-y-4">
          <div className="text-white">
            <h2 className="text-xl font-semibold mb-2">作品情報</h2>
            <div className="space-y-2">
              <div>
                <label className="block text-sm">タイトル</label>
                <div className="p-2 border rounded">サンプル作品 1</div>
              </div>
              <div>
                <label className="block text-sm">作成日時</label>
                <div className="p-2 border rounded">2024-03-20 12:00</div>
              </div>
              <div>
                <label className="block text-sm">サイズ</label>
                <div className="p-2 border rounded">32x32</div>
              </div>
            </div>
          </div>

          {/* アクションエリア */}
          <div className="space-y-2">
            <button className="w-full p-2 bg-blue-600 text-white rounded">編集</button>
            <button className="w-full p-2 border text-white rounded">戻る</button>
          </div>
        </div>
      </div>
    </div>
  );
} 