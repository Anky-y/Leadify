import { createClient } from "@/utils/supabase-browser";

export async function handleLogin(
  email: string,
  password: string
): Promise<{ error: string | null }> {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login error:", error.message);
    return { error: error.message };
  }

  return { error: null };
}
