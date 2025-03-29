import AppHeader from "@/components/organism/appHeader";
import Footer from "@/components/template/footer";
import Header from "@/components/template/header";
import { redirectIfNotHaveAccount } from '@/lib/account/rooting';
import { redirect } from 'next/navigation';
export default async function Layout({ children }: { children: React.ReactNode }) {
  await redirectIfNotHaveAccount();
  return (
    <>
      <AppHeader/>
      {children}
    </>
  );
}