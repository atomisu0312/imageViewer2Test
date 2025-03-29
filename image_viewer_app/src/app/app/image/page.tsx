'use client'

import AppHeader from '@/components/organism/appHeader';

export default function ImagePage() {
  return (
    <div>
      <AppHeader />
      <div className="p-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8 bg-white p-4 rounded-lg shadow-sm">
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">画像表示エリア</span>
            </div>
          </div>
          <div className="col-span-4 bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">画像情報</h2>
            <div className="space-y-2">
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-sm text-gray-600">ファイル名: sample.jpg</p>
                <p className="text-sm text-gray-600">サイズ: 1920 x 1080</p>
                <p className="text-sm text-gray-600">アップロード日: 2024/03/20</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}