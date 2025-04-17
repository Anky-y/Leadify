"use server";
import { redirect } from "next/navigation";
import { createClient } from "./supabase";
import User from "@/app/types/user";



export async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if(!user) {
    return null;
  }
  return user;
}

export async function getUserData() {
    const supabase = await createClient();

    // Get the authenticated user from Supabase Auth
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    // Query the `users` table using the user ID
    const { data: userData, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single(); // Fetch a single user

    if (error) {
      console.error("Error fetching user from users table:", error.message);
      return null;
    }

    return userData as User;
}
