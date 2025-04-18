
import { createClient } from "@/utils/supabase-browser";
import { redirect } from "next/navigation";

export async function handleSignup(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("first-name") as string;
  const lastName = formData.get("last-name") as string;

  const supabase = createClient();

  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `http://localhost:3000/api/verify-email`, // Make sure to pass the page user was on
    },
  });

  if (error) {
    // You can throw here and catch it on the client
    throw new Error(error.message);
  }

  // Insert user info to `users` table (optional)
  await supabase.from("users").insert([
    {
      id: data.user?.id,
      email,
      first_name: firstName,
      last_name: lastName,
    },
  ]);

  redirect(`/verify-email?email=${encodeURIComponent(email)}`);
}
