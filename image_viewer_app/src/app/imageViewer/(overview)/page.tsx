import { Session } from "next-auth";

import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

import { checkAuthorizedByUserEmail } from "@/lib/account/account";

/**
 * 既存のユーザでなければ、welcomeページにリダイレクトする
 * @returns 
 */
const Welcome = () => {
  redirect('/imageViewer/welcome');
  return <></>;
}

/**
 * 既存のユーザであれば、imageViewerページにリダイレクトする
 * @returns 
 */
const MyApp = () => {
  redirect('/imageViewer/app');
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