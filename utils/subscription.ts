import { createClient } from "./supabase";

export async function getUserSubscription() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: subscription, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .order("id", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching subscription:", error.message);
    return null;
  }

  return subscription;
}
