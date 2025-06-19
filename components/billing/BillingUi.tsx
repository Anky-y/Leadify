"use client";

import { useState, useEffect } from "react";
import {
  Check,
  Zap,
  CreditCard,
  Calendar,
  TrendingUp,
  XCircle,
  CreditCardIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useUser } from "@/app/context/UserContext";
import { toast } from "sonner";
import { useSubscription } from "@/app/context/SubscriptionContext";
import { getPlanName } from "@/utils/qol_Functions";

// Calculate savings}
// Animated counter component
function AnimatedCounter({
  value,
  duration = 1000,
}: {
  value: number;
  duration?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      setCount(Math.floor(progress * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span>{count}</span>;
}

export default function BillingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [currentCredits, setCurrentCredits] = useState(0);
  const { user } = useUser();
  const { subscription } = useSubscription();

  useEffect(() => {
    const credits = user?.credits || 0;
    setCurrentCredits(credits);
  });

  // Subscription plans with Lemon Squeezy product IDs for both monthly and yearly
  const plans = [
    {
      id: "free",
      name: "Free",
      price: { monthly: 0, yearly: 0 },
      credits: 25,
      description: "For first-time users",
      features: [
        "25 credits per month",
        "Basic lead generation",
        "Email support",
        "Standard exports",
      ],
      popular: false,
      monthly_checkout_url: "",
      yearly_checkout_url: "",
      monthly_product_id: "",
      yearly_product_id: "",
    },
    {
      id: "basic",
      name: "Basic",
      price: { monthly: 19, yearly: 190 },
      credits: 150,
      description: "For indie creators",
      features: [
        "150 credits per month",
        "Advanced lead generation",
        "Priority email support",
        "CSV & Excel exports",
        "Basic analytics",
      ],
      popular: false,
      monthly_checkout_url: `https://leadifysolutions.lemonsqueezy.com/buy/81a494e3-c10f-45c1-b768-3089d750219f?checkout[custom][user_id]=${user?.id}&checkout[custom][product_type]=subscription`,
      yearly_checkout_url: `https://leadifysolutions.lemonsqueezy.com/buy/67939b0a-52be-45fd-9306-94d29241d78a?checkout[custom][user_id]=${user?.id}&checkout[custom][product_type]=subscription`,
      monthly_product_id: "783425",
      yearly_product_id: "783451",
    },
    {
      id: "pro",
      name: "Pro",
      price: { monthly: 49, yearly: 490 },
      credits: 500,
      description: "For agencies",
      features: [
        "500 credits per month",
        "Premium lead generation",
        "24/7 chat support",
        "All export formats",
        "Advanced analytics",
        "API access",
        "Team collaboration",
      ],
      popular: true,
      monthly_checkout_url: `https://leadifysolutions.lemonsqueezy.com/buy/67939b0a-52be-45fd-9306-94d29241d78a?checkout[custom][user_id]=${user?.id}&checkout[custom][product_type]=subscription`,
      yearly_checkout_url: `https://leadifysolutions.lemonsqueezy.com/buy/7aee438c-cd9a-4691-b71c-81407b0d273f?checkout[custom][user_id]=${user?.id}&checkout[custom][product_type]=subscription`,
      monthly_product_id: "783455",
      yearly_product_id: "783457",
    },
  ];

  // Helper to get the correct product id for a plan based on billing period
  const getPlanProductId = (plan: (typeof plans)[0], yearly: boolean) =>
    yearly ? plan.yearly_product_id : plan.monthly_product_id;

  // Credit top-up packs
  const creditPacks = [
    {
      id: "starter",
      name: "Starter",
      credits: 100,
      price: 5,
      description: "Perfect for small projects",
      checkout_url: `https://leadifysolutions.lemonsqueezy.com/buy/d82a2214-2b2b-436a-be26-6105a7fcdf65?checkout[custom][user_id]=${user?.id}&checkout[custom][product_type]=topup`,
    },
    {
      id: "growth",
      name: "Growth",
      credits: 500,
      price: 20,
      description: "Great for growing businesses",
      popular: true,
      checkout_url: `https://leadifysolutions.lemonsqueezy.com/buy/7658cebc-9507-4278-aa94-e09ee20cd766?checkout[custom][user_id]=${user?.id}&checkout[custom][product_type]=topup`,
    },
    {
      id: "scale",
      name: "Scale",
      credits: 1000,
      price: 35,
      description: "For scaling operations",
      checkout_url: `https://leadifysolutions.lemonsqueezy.com/buy/c69f17b9-a809-4aef-abb1-47989c0e5c2a?checkout[custom][user_id]=${user?.id}&checkout[custom][product_type]=topup`,
    },
    {
      id: "power",
      name: "Power",
      credits: 5000,
      price: 150,
      description: "Maximum value pack",
      checkout_url: `https://leadifysolutions.lemonsqueezy.com/buy/c69f17b9-a809-4aef-abb1-47989c0e5c2a?checkout[custom][user_id]=${user?.id}&checkout[custom][product_type]=topup`,
    },
  ];

  const calculateSavings = (monthly: number, yearly: number) => {
    if (monthly === 0) return 0;
    return Math.round(((monthly * 12 - yearly) / (monthly * 12)) * 100);
  };

  const handleBuyCredits = async (pack: {
    id: string;
    credits: number;
    checkout_url: string;
  }) => {
    if (!user) {
      toast.error("Authentication Required", {
        description: "Please log in to purchase credits.",
        icon: <XCircle className="h-5 w-5" />,
      });
      return;
    }

    toast.info("Redirecting to Payment", {
      description: `Processing your purchase of ${pack.credits.toLocaleString()} credits...`,
      icon: <CreditCardIcon className="h-5 w-5" />,
    });

    window.location.href = pack.checkout_url.toString();
  };

  const handleBuySubscription = async (plan: (typeof plans)[0]) => {
    if (!user) {
      toast.error("Authentication Required", {
        description: "Please log in to upgrade your subscription.",
        icon: <XCircle className="h-5 w-5" />,
      });
      return;
    }
    const baseUrl = isYearly
      ? plan.yearly_checkout_url
      : plan.monthly_checkout_url;
    if (!baseUrl) {
      toast.error("Checkout Unavailable", {
        description:
          "This subscription plan is currently unavailable. Please try again later.",
        icon: <XCircle className="h-5 w-5" />,
      });
      return;
    }

    toast.info("Redirecting to Checkout", {
      description: `Processing your ${plan.name} subscription upgrade...`,
      icon: <CreditCardIcon className="h-5 w-5" />,
    });

    window.location.href = baseUrl.toString();
  };

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
            Your Plan & Credits
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your subscription and boost your lead generation
          </p>
        </div>

        {/* Current Plan Card */}
        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10" />
          <CardContent className="relative p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Current Plan */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Current Plan
                  </span>
                </div>
                <p className="text-2xl font-bold">
                  {subscription?.plan_name
                    ? `${getPlanName(subscription.plan_name)}`
                    : "Free Plan"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {subscription?.plan_name?.toLowerCase().startsWith("pro")
                    ? "$49/month"
                    : subscription?.plan_name?.toLowerCase().startsWith("basic")
                    ? "$19/month"
                    : ""}
                </p>
              </div>

              {/* Credits */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Remaining Credits
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">
                    <AnimatedCounter value={currentCredits} />
                  </span>
                  <span className="text-sm text-muted-foreground">credits</span>
                </div>
              </div>

              {/* Renewal Date */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Next Renewal
                  </span>
                </div>
                <p className="text-lg font-semibold">
                  {typeof subscription?.renews_at === "string" &&
                  subscription.renews_at
                    ? formatDate(subscription.renews_at)
                    : "N/A"}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105">
                  <Zap className="mr-2 h-4 w-4" />
                  Top Up Credits
                </Button>
                <Button
                  variant="outline"
                  className="w-full hover:bg-white/50 transition-all duration-200"
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Change Plan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Billing Toggle */}
        <div className="flex justify-center">
          <div className="flex items-center space-x-4 bg-white dark:bg-slate-800 p-2 rounded-full shadow-lg border">
            <span
              className={cn(
                "text-sm font-medium px-4 py-2 rounded-full transition-all",
                !isYearly &&
                  "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
              )}
            >
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-blue-600"
            />
            <div className="flex items-center space-x-2">
              <span
                className={cn(
                  "text-sm font-medium px-4 py-2 rounded-full transition-all",
                  isYearly &&
                    "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                )}
              >
                Yearly
              </span>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                Save up to 20%
              </Badge>
            </div>
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const price = isYearly ? plan.price.yearly : plan.price.monthly;
            const savings = calculateSavings(
              plan.price.monthly,
              plan.price.yearly
            );

            return (
              <Card
                key={plan.id}
                className={cn(
                  "relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group",
                  plan.popular &&
                    "border-blue-500 shadow-lg shadow-blue-500/25",
                  selectedPlan === plan.id && "ring-2 ring-blue-500"
                )}
                onClick={() => handleBuySubscription}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                )}

                <CardHeader className={cn("pb-4", plan.popular && "pt-12")}>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {plan.description}
                      </CardDescription>
                    </div>
                    {isYearly && savings > 0 && (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        Save {savings}%
                      </Badge>
                    )}
                  </div>

                  <div className="mt-4">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold">${price}</span>
                      <span className="text-muted-foreground ml-1">
                        /{isYearly ? "year" : "month"}
                      </span>
                    </div>
                    <div className="flex items-center mt-2 text-sm text-muted-foreground">
                      <Zap className="h-4 w-4 mr-1 text-yellow-500" />
                      {plan.credits} credits included
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </CardContent>

                <CardFooter>
                  <Button
                    className={cn(
                      "w-full transition-all duration-200",
                      plan.popular
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"
                        : "hover:bg-blue-50 dark:hover:bg-blue-950"
                    )}
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => handleBuySubscription(plan)}
                  >
                    {user?.subscription_status &&
                    getPlanProductId(plan, isYearly) &&
                    getPlanName(subscription?.plan_name ?? "").toLowerCase() ===
                      plan.name.toLowerCase()
                      ? "Current Plan"
                      : user?.subscription_plan?.toLowerCase() === "free" &&
                        plan.id.toLowerCase() === "free"
                      ? "Current Plan"
                      : "Choose Plan"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Credit Top-up Packs */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Credit Top-up Packs</h2>
            <p className="text-muted-foreground">
              Need more credits? Choose from our flexible top-up options
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {creditPacks.map((pack) => (
              <Card
                key={pack.id}
                className={cn(
                  "relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group cursor-pointer",
                  pack.popular &&
                    "border-green-500 shadow-md shadow-green-500/25"
                )}
              >
                {pack.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-center py-1 text-xs font-medium">
                    Best Value
                  </div>
                )}

                <CardHeader className={cn("pb-3", pack.popular && "pt-8")}>
                  <CardTitle className="text-lg">{pack.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {pack.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      <span className="text-2xl font-bold">
                        {pack.credits.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">credits</p>
                  </div>

                  <div className="text-center">
                    <span className="text-3xl font-bold">${pack.price}</span>
                    <p className="text-xs text-muted-foreground">
                      ${(pack.price / pack.credits).toFixed(3)} per credit
                    </p>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    className={cn(
                      "w-full transition-all duration-200 group-hover:scale-105",
                      pack.popular
                        ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        : "hover:bg-green-50 dark:hover:bg-green-950"
                    )}
                    variant={pack.popular ? "default" : "outline"}
                    onClick={() => handleBuyCredits(pack)}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Buy Credits
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
