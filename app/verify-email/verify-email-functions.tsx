"use server";

import { createClient } from "@/utils/supabase";

export async function resendEmail(
  setIsResending: (isResending: boolean) => void,
  setSecondsLeft: (secondsLeft: number) => void,
  email: string
) {
  setIsResending(true);

  const supabase = await createClient();
  await supabase.auth.resend({
    type: "signup",
    email,
  });
  setTimeout(() => {
    setIsResending(false);
    setSecondsLeft(60);
  }, 1500);
}

export async function checkEmailVerification() {
  const supabase = await createClient(); // Await the client creation here

    const { data, error } = await supabase.auth.getUser();
    
    return data.user


}
