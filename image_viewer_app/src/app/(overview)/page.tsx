import { Session } from "next-auth";
import { redirect } from 'next/navigation';
import { auth } from "@/lib/auth/auth";
import { checkAuthorizedByUserEmail } from "@/lib/account/account";

/**
 * 既存のユーザかどうかで表示を切り替える共通のエンドポイントとして機能するもの
 */
export default async function Home() {
  const session: Session | null = await auth();
  const authorized = await checkAuthorizedByUserEmail(session.user.email);

  if (authorized) {
    redirect('/app/image/view');
  } else {
    redirect('/welcome');
  }
}