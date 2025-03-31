import '@/app/globals.css';

import { AppFront } from '@/components/template/appFront';

/**
 * appページ用のエンドポイント
 * @returns 
 */
export default async function DefaultLayout() {

  return (
    <AppFront />
  );
}