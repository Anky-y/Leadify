import { createClient } from "@/utils/supabase-browser";

export async function resendEmail(email: string) {
  console.log("Resending email in helper:", email);
  const supabase =  createClient();
  const { data, error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: "http://localhost:3000/api/verify-email",
    },
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
