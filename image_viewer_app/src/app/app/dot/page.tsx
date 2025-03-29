'use client'

import AppHeader from '@/components/organism/appHeader';

export default function DotPage() {
  return (
    <div>
      <AppHeader />
      <div className="p-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">ドット絵エディタ</span>
              </div>
            </div>
          </div>
          <div className="col-span-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium mb-4">ツール</h2>
              <div className="space-y-2">
                <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors">
                  新規作成
                </button>
                <button className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors">
                  保存
                </button>
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">サイズ</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="number" className="border rounded px-2 py-1" placeholder="幅" />
                    <input type="number" className="border rounded px-2 py-1" placeholder="高さ" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 