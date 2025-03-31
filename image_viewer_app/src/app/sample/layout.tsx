
import SampleHeader from "@/components/organism/common/sampleHeader";
import { redirectIfNotHaveAccount } from '@/lib/account/rooting';
export default async function Layout({ children }: { children: React.ReactNode }) {
  //await redirectIfNotHaveAccount();
  return (
    <>
      <SampleHeader/>
      {children}
    </>
  );
}