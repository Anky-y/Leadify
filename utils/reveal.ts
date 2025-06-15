import { toast } from "sonner";
import { createClient } from "./supabase-browser";

const supabase = createClient();

// Placeholder functions for API calls
export async function revealSocialLinks(streamerId: string): Promise<boolean> {
  try {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;
    if (!token) {
      throw new Error("No session found. User is not logged in.");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}reveal-socials`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ streamer_id: streamerId }),
      }
    );

    console.log(response);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to reveal social links");
    }

    return true;
  } catch (error: any) {
    toast.error("Error revealing social links", {
      description: error.message,
    });
    return false;
  }
}

export async function revealEmail(streamerId: string): Promise<boolean> {
  try {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}reveal-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ streamer_id: streamerId }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to reveal email");
    }

    return true;
  } catch (error: any) {
    toast.error("Error revealing email", {
      description: error.message,
    });
    return false;
  }
}
// Helper function to check if user can access feature based on subscription
export function canAccessFeature(
  feature: "social_links" | "email",
  subscriptionPlan: string | undefined
): boolean {
  if (!subscriptionPlan) return false;

  switch (feature) {
    case "social_links":
      // All plans can access social links
      return true;
    case "email":
      return ["Basic", "Pro"].includes(subscriptionPlan);
    default:
      return false;
  }
}

// Helper function to show upgrade toast
export function showUpgradeToast(feature: "social_links" | "email") {
  const featureName =
    feature === "social_links" ? "social media links" : "email addresses";
  const requiredPlan = feature === "email" ? "Basic" : "Free";

  toast.error(
    `${
      featureName.charAt(0).toUpperCase() + featureName.slice(1)
    } are only available on ${requiredPlan} plans and above`,
    {
      description: "Upgrade your subscription to access this feature",
      action: {
        label: "Upgrade",
        onClick: () => (window.location.href = "/dashboard/billing"),
      },
    }
  );
}
