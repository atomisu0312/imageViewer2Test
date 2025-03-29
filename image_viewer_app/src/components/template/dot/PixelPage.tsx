import Link from 'next/link';

export default function PixelPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-white">ドット絵一覧</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 新規作成ボタン */}
        <Link href="/app/pixel/new" className="block p-4 border rounded-lg hover:bg-gray-800">
          <div className="text-center">
            <div className="text-4xl mb-2">+</div>
            <div className="text-white">新規作成</div>
          </div>
        </Link>

        {/* 既存の作品一覧 */}
        <div className="col-span-full">
          <h2 className="text-xl font-semibold mb-2 text-white">既存の作品</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* サンプル作品 */}
            <Link href="/app/pixel/view/1" className="block p-4 border rounded-lg hover:bg-gray-800">
              <div className="aspect-square bg-gray-700 mb-2"></div>
              <div className="text-white">サンプル作品 1</div>
            </Link>
            <Link href="/app/pixel/view/2" className="block p-4 border rounded-lg hover:bg-gray-800">
              <div className="aspect-square bg-gray-700 mb-2"></div>
              <div className="text-white">サンプル作品 2</div>
            </Link>
            <Link href="/app/pixel/view/3" className="block p-4 border rounded-lg hover:bg-gray-800">
              <div className="aspect-square bg-gray-700 mb-2"></div>
              <div className="text-white">サンプル作品 3</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 