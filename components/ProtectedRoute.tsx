import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserSession } from "../app/context/UserSessionContext"; // adjust path
import type { Session as supabaseSession } from "@supabase/supabase-js";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { session } = useUserSession();

  useEffect(() => {
    if (session === null) {
      router.replace("/login");
    }
  }, [session]);

  // Optionally show a loading screen while session is being checked
  if (session === null) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
