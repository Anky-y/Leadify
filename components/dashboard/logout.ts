"use server";

import { createClient } from "@/utils/supabase";

export async function handleLogout(): Promise<{ error: string | null }> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Logout error:", error.message);
    return { error: error.message };
  }

  return { error: null };
}
