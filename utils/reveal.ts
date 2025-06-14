import { toast } from "sonner";

// Placeholder functions for API calls
export async function revealSocialLinks(streamerId: string) {
  // This would be replaced with an actual API call
  return new Promise<boolean>((resolve) => {
    setTimeout(() => resolve(true), 500);
  });
}

export async function revealEmail(streamerId: string) {
  // This would be replaced with an actual API call
  return new Promise<boolean>((resolve) => {
    setTimeout(() => resolve(true), 500);
  });
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
