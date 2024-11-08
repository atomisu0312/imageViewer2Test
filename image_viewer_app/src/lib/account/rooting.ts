import { checkAuthorizedByUserEmail } from '@/lib/account/account';
import { auth } from '@/lib/auth/auth';
import { Session } from 'next-auth';
import { redirect } from 'next/navigation';

/** 
 * もし登録されていないユーザであれば、初期画面にリダイレクトさせる
 * 注意：本来登録されているユーザがアクセスできないページでこれを使うと、
 * 無限にリダイレクトが走るので注意が必要？ 
 * */
const redirectIfNotHaveAccount = async () => {
  const session: Session | null = await auth();
  const authorized = await checkAuthorizedByUserEmail(session.user.email);

  if (!authorized) {
    redirect('/imageViewer');
  }
}


/** 
 * もし登録されているユーザであれば、初期画面にリダイレクトさせる
 * 注意：本来登録されているユーザしかアクセスできないページでこれを使うと、
 * 無限にリダイレクトが走るので注意が必要？ 
 * */
const redirectIfHaveAccount = async () => {
  const session: Session | null = await auth();
  const authorized = await checkAuthorizedByUserEmail(session.user.email);

  if (authorized) {
    redirect('/imageViewer');
  }
}

export { redirectIfNotHaveAccount, redirectIfHaveAccount };