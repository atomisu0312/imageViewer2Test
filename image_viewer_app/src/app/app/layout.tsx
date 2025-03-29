import AppHeader from "@/components/organism/common/appHeader";
import { redirectIfNotHaveAccount } from '@/lib/account/rooting';
export default async function Layout({ children }: { children: React.ReactNode }) {
  await redirectIfNotHaveAccount();
  return (
    <>
      <AppHeader/>
      {children}
    </>
  );
}