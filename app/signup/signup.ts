"use server";

import { createClient } from "@/utils/supabase";
import { redirect } from "next/navigation";

export async function handleSignup(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("first-name") as string;
  const lastName = formData.get("last-name") as string;

  const supabase = await createClient();

  const { error, data } = await supabase.auth.signUp({
    email,
    password,
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

  redirect("/dashboard"); // redirect to dashboard if signup works
}
