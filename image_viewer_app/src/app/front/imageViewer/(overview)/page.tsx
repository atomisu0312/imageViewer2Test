import { Session } from "next-auth";

import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

const Welcome = () => {
  redirect('/front/imageViewer/welcome');
  return <></>;
}

const MyApp = () => {
  redirect('/front/imageViewer/app');
  return <></>
}

export default async function Home() {
  const session: Session | null = await auth();
  const authorized = false; // ここの下りは関数型で書いてあげるとベターかもと思ったけど初見ログインとかを考えるとこのままでいいかな
  return (
    <>
      {authorized ? <MyApp /> : <Welcome />}
    </>
  );
}