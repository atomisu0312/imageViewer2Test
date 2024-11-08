import Footer from "@/components/template/footer";
import Header from "@/components/template/header";

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}