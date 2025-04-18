"use server";

import { createClient } from "@/utils/supabase";

export async function resendEmail(
  email: string
) {
  console.log("Resending email to:", email);
  const supabase = await createClient();
  await supabase.auth.resend({
    type: "signup",
    email,
  });
}

// export async function checkEmailVerification() {
//   const supabase = await createClient(); // Await the client creation here

//     const { data, error } = await supabase.auth.getUser();
    
//     return data.user


// }
