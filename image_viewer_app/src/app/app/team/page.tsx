'use client'

import AppHeader from '@/components/organism/appHeader';

export default function TeamPage() {
  return (
    <div>
      <div className="p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-medium mb-6">チーム情報</h2>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium mb-2">チーム名</h3>
                <p className="text-gray-600">サンプルチーム</p>
              </div>
              <div className="border-b pb-4">
                <h3 className="text-lg font-medium mb-2">メンバー</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
                    <span className="text-gray-600">山田太郎</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
                    <span className="text-gray-600">鈴木花子</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">作成日</h3>
                <p className="text-gray-600">2024/03/20</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 