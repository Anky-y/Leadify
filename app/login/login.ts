import { createClient } from "@/utils/supabase-browser";
import { useUser } from "../context/UserContext";

export async function handleLogin(
  email: string,
  password: string,
  refreshUser: () => Promise<void> // Accept refreshUser as a parameter
): Promise<{ error: string | null }> {
  const supabase = createClient();
  const response = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (response.error) {
    console.error("Login error:", response.error.message);
    return { error: response.error.message };
  }
  await refreshUser();
  return { error: null };
}
