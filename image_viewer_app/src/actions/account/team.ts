'use server';
import { auth } from "@/lib/auth/auth";
import { Session } from "next-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from 'next/cache';

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function makeMyFirstTeam(prevState: State, formData: FormData) {
  const session: Session | null = await auth();

  formData.append("email", session.user.email);
  formData.append("user_name", session.user.name as string);
  try {
    // postリクエストを送る
    const response = await fetch(`${process.env.FASTAPI_ACCOUNT_SERVICE_HOST}/api/myauth/welcome/new/userteam`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ "team_name": formData.get("team_name"), "email": session.user.email, "user_name": session.user.name }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

  } catch (error) {
    console.error("Fetch error:", error);
    // 失敗した場合の別のレスポンスを返す
    return { error: "Failed to submit the form. Please try again later." };

  } finally {
    // キャッシュをクリアするメソッドなんだけど、リダイレクト前のおまじないみたいな扱いになっとる
    revalidatePath('/imageViewer');
    // リダイレクト処理 
    redirect('/imageViewer');
  }
}

export async function makeFollowerWithKey(prevState: State, formData: FormData) {
  const session: Session | null = await auth();
  formData.append("email", session.user.email);
  formData.append("user_name", session.user.name as string);

  console.log(formData.get("passcode"));
  console.log("submit PASSCODE!!!!!!!!!");

  try {
    // postリクエストを送る
    const response = await fetch(`${process.env.FASTAPI_ACCOUNT_SERVICE_HOST}/api/myauth/welcome/new/follower`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ "passcode": formData.get("passcode"), "email": session.user.email, "user_name": session.user.name }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // JSONデータを取得
    const data = await response.json();

  } catch (error) {
    console.error("Fetch error:", error);
    // 失敗した場合の別のレスポンスを返す
    return { error: "Failed to submit the form. Please try again later." };

  } finally {

    // キャッシュをクリアするメソッドなんだけど、リダイレクト前のおまじないみたいな扱いになっとる
    revalidatePath('/imageViewer');
    // リダイレクト処理 
    redirect('/imageViewer');
  }
}