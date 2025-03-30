import { checkAuthorizedByUserEmail } from '@/lib/account/account';
import { auth } from '@/lib/auth/auth';
import { Session } from 'next-auth';
import { redirect } from 'next/navigation';

/** 
 * もし登録されていないユーザであれば、welcomeページにリダイレクトさせる
 * 注意：本来登録されているユーザがアクセスできないページでこれを使うと、
 * 無限にリダイレクトが走るので注意が必要？ 
 * */
const redirectIfNotHaveAccount = async () => {
  const session: Session | null = await auth();

  if (session == null) {
    redirect('/welcome');
  }

  const authorized = await checkAuthorizedByUserEmail(session.user?.email);

  if (!authorized) {
    redirect('/welcome');
  }
}


/** 
 * もし登録されているユーザであれば、画像表示ページにリダイレクトさせる
 * 注意：本来登録されているユーザしかアクセスできないページでこれを使うと、
 * 無限にリダイレクトが走るので注意が必要？ 
 * */
const redirectIfHaveAccount = async () => {
  const session: Session | null = await auth();
  const authorized = await checkAuthorizedByUserEmail(session.user.email);

  if (authorized) {
    redirect('/app/image/view');
  }
}

export { redirectIfNotHaveAccount, redirectIfHaveAccount };