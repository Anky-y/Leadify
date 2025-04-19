import { createClient } from "@/utils/supabase-browser";

export async function verifyEmailCode(token_hash: string | null) {
  if (!token_hash) throw new Error("Code is required.");

  const supabase = createClient();

  const { data, error } = await supabase.auth.verifyOtp({
    token_hash: token_hash,
    type: "email",
  });
  console.log(token_hash);
  console.log("Data from verifyEmailCode:", data);
  console.log(error);
  if (error) {
    throw new Error(error.message);
  }

  return { success: true, user: data.user };
}
