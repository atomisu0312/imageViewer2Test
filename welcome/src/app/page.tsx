'use client';

import { signIn } from 'next-auth/react';

export default function Home() {
  const handleSignIn = async () => {
    await signIn('google', { callbackUrl: process.env.NEXTAUTH_URL });
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <span>ようこそ</span>
        <button onClick={handleSignIn}>CLICK</button>
      </div>
    </main>
  );
}