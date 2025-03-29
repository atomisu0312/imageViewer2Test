import { Session } from "next-auth";

import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

import { checkAuthorizedByUserEmail } from "@/lib/account/account";

/**
 * 既存のユーザでなければ、welcomeページにリダイレクトする
 * @returns 
 */
const Welcome = () => {
  redirect('/welcome');
  return <></>;
}

/**
 * 既存のユーザであれば、画像表示ページにリダイレクトする
 * @returns 
 */
const MyApp = () => {
  redirect('/app/image/view');
  return <></>
}
/**
 * 既存のユーザかどうかで表示を切り替える共通のエンドポイントとして機能するもの
 */
export default async function Home() {
  const session: Session | null = await auth();
  const authorized = await checkAuthorizedByUserEmail(session.user.email);

  return (
    <>
      {authorized ? <MyApp /> : <Welcome />}
    </>
  );
}