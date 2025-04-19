"use server";

import { createClient } from "@/utils/supabase";

export async function updateName({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: userError || new Error("No user found") };
  }

  const { error } = await supabase
    .from("users")
    .update({ first_name: firstName, last_name: lastName })
    .eq("id", user.id);

  return { error };
}
