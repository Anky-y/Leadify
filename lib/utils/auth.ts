"use server";
import User from "../../app/types/user";
import { supabase } from "@/lib/supabase-client";
import type { Session as SupabaseSession } from "@supabase/supabase-js";

export async function signUpWithEmail(
  email: string,
  password: string,
  firstName: string,
  lastName: string
) {
  console.log("before signup");
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });
  if (signUpError) {
    console.error("Supabase signup error:", signUpError);
    throw new Error(signUpError.message); // ✅ only pass plain string
  }
  console.log("after signup");

  console.log(signUpData);

  const userId = signUpData.user?.id;

  // Insert user into the database
  const { data: userData, error: insertError } = await supabase
    .from("users")
    .insert({
      id: userId,
      email,
      first_name: firstName,
      last_name: lastName,
    })
    .select()
    .single();

  if (insertError) {
    console.error("Error inserting user into database:", insertError);
    throw insertError;
  }

  return userData as User;
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  console.log(data);

  return data.user;
}

export async function logout() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error during logout:", error);
      throw new Error(error.message); // Throw an error if logout fails
    }
    console.log("User successfully logged out");
  } catch (err) {
    console.error("Unexpected error during logout:", err);
    throw err; // Re-throw the error for further handling if needed
  }
}

export async function getSession(): Promise<SupabaseSession | null> {
  const { data, error } = await supabase.auth.getSession();

  console.log(data.session);

  if (error) {
    console.error("Error fetching session:", error);
    throw new Error(error.message);
    return null;
  }

  return data.session;
}
export async function getUserData(): Promise<User | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("user", user);

  const { data: profile, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user?.id)
    .single();

  if (error || !profile) {
    console.error("Error fetching user profile:", error);
    return null;
  }

  return profile as User;
}
