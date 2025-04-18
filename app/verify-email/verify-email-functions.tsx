"use server";

import { createClient } from "@/utils/supabase";

export async function resendEmail(
  email: string
) {
  console.log("Resending email in helper:", email);
  const supabase = await createClient();
  const { data, error }  = await supabase.auth.resend({
    type: "signup",
    email,
  });
  if (error) {
    console.error("Error resending email:", error.message);
    throw new Error(error.message);
  } 
  console.log("Email resent successfully:", data);
}

// export async function checkEmailVerification() {
//   const supabase = await createClient(); // Await the client creation here

//     const { data, error } = await supabase.auth.getUser();
    
//     return data.user


// }
