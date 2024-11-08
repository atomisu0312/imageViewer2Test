'use client'

import { useSession, signIn, signOut, SessionProvider } from 'next-auth/react';

function HeaderComponent() {
  const { data: session, status } = useSession();
  return (
    <>
      <div className="px-2 grid grid-cols-12 py-7">
        <div className="col-span-1"></div>
        <div className="col-span-10">
          <span>
            Image Viewer
          </span>
        </div>
        <div className="col-span-1">
          {session ? (
            <button onClick={() => signOut()}>Sign out</button>
          ) : (
            <button onClick={() => signIn()}>Sign in</button>
          )}
        </div>
      </div>
    </>
  );
}
export default function Header() {
  return (
    <>
      <SessionProvider>
        <HeaderComponent />
      </SessionProvider>
    </>
  )
}