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
    const response = await fetch(`${process.env.FASTAPI_ACCOUNT_SERVICE_HOST}/welcome/new_team_and_user/`, {
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
    revalidatePath('/front/imageViewer');
    // リダイレクト処理 
    redirect('/front/imageViewer');
  }
}

export async function makeFollowerWithKey(prevState: State, formData: FormData) {
  console.log(formData.get("passcode"));
  console.log("submit PASSCODE!!!!!!!!!");

  try {
    // postリクエストを送る
    const response = await fetch("http://localhost:8080", {
      method: "GET",
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
    revalidatePath('/front/imageViewer');
    // リダイレクト処理 
    redirect('/front/imageViewer');
  }
}