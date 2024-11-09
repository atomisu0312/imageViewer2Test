import Footer from "@/components/template/footer";
import Header from "@/components/template/header";
import { redirectIfNotHaveAccount } from '@/lib/account/rooting';
import { redirect } from 'next/navigation';
import './embra.css'

export default async function Layout({ children }: { children: React.ReactNode }) {
  await redirectIfNotHaveAccount();
  return (
    <>
      {children}
    </>
  );
}