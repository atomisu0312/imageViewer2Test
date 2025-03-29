'use client'

import AppHeader from '@/components/organism/common/appHeader';

export default function AnalyzePage() {
  return (
    <div>
      <div className="p-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">分析対象画像</span>
              </div>
            </div>
          </div>
          <div className="col-span-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium mb-4">分析結果</h2>
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded">
                  <h3 className="text-sm font-medium mb-1">色の分布</h3>
                  <div className="h-2 bg-gray-100 rounded">
                    <div className="h-full w-3/4 bg-blue-500 rounded"></div>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <h3 className="text-sm font-medium mb-1">明るさ</h3>
                  <div className="h-2 bg-gray-100 rounded">
                    <div className="h-full w-1/2 bg-yellow-500 rounded"></div>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <h3 className="text-sm font-medium mb-1">コントラスト</h3>
                  <div className="h-2 bg-gray-100 rounded">
                    <div className="h-full w-2/3 bg-green-500 rounded"></div>
                  </div>
                </div>
                <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors">
                  分析開始
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 