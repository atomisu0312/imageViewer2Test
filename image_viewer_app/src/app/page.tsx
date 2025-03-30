import Link from 'next/link';
import { auth } from '@/lib/auth/auth';

export default async function Home() {
  const session = await auth();
  const isAuthenticated = !!session;

  return (
    <div className="min-h-screen">
      {/* ヒーローセクション */}
      <section className="py-20 px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          思い出を、シンプルに保存
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          画像を簡単にアップロードして、大切な思い出を安全に保管できます
        </p>
        {!isAuthenticated && (
          <Link
            href="/welcome"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            始めましょう
          </Link>
        )}
      </section>

      {/* 機能紹介セクション */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <h3 className="text-xl font-semibold mb-4">画像アップロード</h3>
            <p className="text-gray-600 mb-4">
              ドラッグ＆ドロップで簡単に画像をアップロードできます
            </p>
            <Link
              href={isAuthenticated ? "/app/image/upload" : "/welcome"}
              className="text-blue-600 hover:text-blue-800"
            >
              アップロード →
            </Link>
          </div>

          <div className="text-center p-6">
            <h3 className="text-xl font-semibold mb-4">ギャラリー</h3>
            <p className="text-gray-600 mb-4">
              保存した画像を整理して閲覧できます
            </p>
            <Link
              href="/sample"
              className="text-blue-600 hover:text-blue-800"
            >
              ギャラリーを見る →
            </Link>
          </div>

          <div className="text-center p-6">
            <h3 className="text-xl font-semibold mb-4">マイページ</h3>
            <p className="text-gray-600 mb-4">
              画像を管理し、必要に応じて共有できます
            </p>
            <Link
              href={isAuthenticated ? "/app/image/view" : "/welcome"}
              className="text-blue-600 hover:text-blue-800"
            >
              マイページへ →
            </Link>
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">なぜこのサービスなのか？</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">シンプルさ</h3>
              <p className="text-gray-600">
                複雑な設定は不要。直感的な操作で画像を保存できます
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">安全性</h3>
              <p className="text-gray-600">
                大切な思い出を安全に保管し、必要な時だけ共有できます
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">さっそく始めましょう</h2>
        <p className="text-xl mb-8">
          アカウントを作成して、思い出を安全に保管してください
        </p>
        {!isAuthenticated && (
          <Link
            href="/welcome"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            無料で始める
          </Link>
        )}
      </section>
    </div>
  );
}