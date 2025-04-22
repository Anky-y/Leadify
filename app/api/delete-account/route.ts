// app/api/delete-account/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase-admin";
export async function POST(req: Request) {
  console.log("sdad");
  const body = await req.json();
  const userId = body.user_id;

  console.log("Deleting user with ID:", userId);

  const supabase = await createClient();

  //Delete user from DB
  const { error: dbError } = await supabase
    .from("users")
    .delete()
    .eq("id", userId);

  if (dbError) {
    console.error("Failed to delete user data:", dbError);
    return NextResponse.json(
      { error: "Failed to delete user data" },
      { status: 500 }
    );
  }

  // Delete user from Auth
  const { error } = await supabase.auth.admin.deleteUser(userId);

  if (error) {
    console.error("Failed to delete user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }

  // Optionally delete user-related data from your DB tables here

  return NextResponse.json({ success: true });
}
