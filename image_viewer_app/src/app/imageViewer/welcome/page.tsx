import Welcome from "@/components/template/welcome";
import { redirectIfHaveAccount } from '@/lib/account/rooting';

/**
 * Welcomeページ用のエンドポイント
 * @returns 
 */
export default async function RootLayout() {
  await redirectIfHaveAccount();
  return <Welcome />;
}