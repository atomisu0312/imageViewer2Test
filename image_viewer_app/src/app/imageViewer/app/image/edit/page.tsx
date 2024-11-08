import '@/app/globals.css';

import { AppFront } from '@/components/template/appFront';
import { redirectIfNotHaveAccount } from '@/lib/account/rooting';

/**
 * appページ用のエンドポイント
 * @returns 
 */
export default async function Page() {
  await redirectIfNotHaveAccount();

  return (
    <AppFront />
  );
}