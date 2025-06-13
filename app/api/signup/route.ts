import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase";

export async function POST(req: Request) {
  const formData = await req.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("first-name") as string;
  const lastName = formData.get("last-name") as string;

  const supabase = await createClient();

  try {
    // Sign up the user
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/verify-email`,
      },
    });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    const userId = data.user?.id;
    console.log(userId);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID not found after signup." },
        { status: 500 }
      );
    }
    // Insert user info into the `users` table
    await supabase.from("users").insert([
      {
        id: userId,
        email,
        first_name: firstName,
        last_name: lastName,
        credits: 25,
        subscription_plan: "Free",
        subscription_status: false,
      },
    ]);

    await supabase.from("folders").insert([
      {
        user_id: userId,
        name: "All",
        is_mandatory: true,
      },
      {
        user_id: userId,
        name: "Favourites",
        is_mandatory: true,
      },
    ]);

    const initRes = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}initialize-user?user_id=${userId}`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
        },
      }
    );

    console.log(initRes);

    if (!initRes.ok) {
      throw new Error("Failed to fetch scrape progress");
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Signup error:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
