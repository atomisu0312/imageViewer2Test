'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AppHeader() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600';
  };

  return (
    <div className="px-2 grid grid-cols-12 py-4 border">
      <div className="col-span-1"></div>
      <div className="col-span-10 flex justify-center">
        <div className="flex items-center justify-between">
          <nav className="flex space-x-8">
            <Link href="/app/image/view" className={`${isActive('/app/image')} transition-colors`}>
              画像表示
            </Link>
            <Link href="/app/team" className={`${isActive('/app/team')} transition-colors`}>
              チーム
            </Link>
            <Link href="/app/dot" className={`${isActive('/app/dot')} transition-colors`}>
              ドット絵
            </Link>
            <Link href="/app/analyze" className={`${isActive('/app/analyze')} transition-colors`}>
              分析
            </Link>
          </nav>
        </div>
      </div>
      <div className="col-span-1"></div>
    </div>
  );
}  