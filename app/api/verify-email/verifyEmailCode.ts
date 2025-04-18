"use server";
import { createClient } from "@/utils/supabase";

export async function verifyEmailCode(code: string) {
  if (!code) {
    throw new Error("Code is required.");
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  
  if (error) {
    throw new Error(error.message);
  }

  if (data.session) {
    await supabase.auth.setSession({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    });
  }

  return { success: true, user: data.user };
}
