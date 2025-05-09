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

    // Insert user info into the `users` table
    await supabase.from("users").insert([
      {
        id: data.user?.id,
        email,
        first_name: firstName,
        last_name: lastName,
        subscription_status: false,
      },
    ]);

    // // Insert the 'free' subscription into the `subscriptions` table (without Lemon Squeezy)
    // const { error: subInsertError, data: subInsertData } = await supabase
    //   .from("subscriptions")
    //   .insert([
    //     {
    //       user_id: data.user?.id,
    //       plan_id: null, // Use the internal 'free' plan ID
    //       subscription_id: null, // No subscription ID, since they're on free
    //       status: "inactive", // Status set as 'inactive'
    //       product_name: "Free",
    //     },
    //   ]);

    // console.log(subInsertData);

    // if (subInsertError) {
    //   console.error("Error inserting subscription:", subInsertError.message);
    //   return NextResponse.json(
    //     { success: false, error: subInsertError.message },
    //     { status: 500 }
    //   );
    // }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Signup error:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
