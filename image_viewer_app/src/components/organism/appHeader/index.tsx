'use client'

export default function AppHeader() {
  return (
    <div className="px-2 grid grid-cols-12 py-4 border-b">
      <div className="col-span-1"></div>
      <div className="col-span-10 flex justify-center">
        <span className="text-lg font-medium text-gray-700">
          アプリケーション
        </span>
      </div>
      <div className="col-span-1"></div>
    </div>
  );
}  