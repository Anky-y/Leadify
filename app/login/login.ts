import { createClient } from "@/utils/supabase-browser";
import { useUser } from "../context/UserContext";

export async function handleLogin(
  email: string,
  password: string,
  refreshUser: () => Promise<void> // Accept refreshUser as a parameter
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
  await refreshUser();
  return { error: null };
}
