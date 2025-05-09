"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, CreditCard, Download } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import User from "@/app/types/user";
import { useUser } from "@/app/context/UserContext";
import Loading from "@/app/loading";
import { useSubscription } from "@/app/context/SubscriptionContext";
import { PlanConfig } from "@/app/types/plans";
const plansConfig: Record<"monthly" | "yearly", PlanConfig[]> = {
  monthly: [
    {
      id: 0,
      name: "Free",
      price: 0,
      description: "Basic features for personal use",
      features: [
        "5 searches per day",
        "Basic analytics",
        "Email support",
        "1 user account",
      ],
      variantId: null,
      checkoutUrl: "",
    },
    {
      id: 783425,
      name: "Basic",
      price: 9.99,
      description: "Essential features for individuals",
      features: [
        "10 searches per day",
        "Basic analytics",
        "Email support",
        "1 user account",
        "Standard exports",
      ],
      variantId: "81a494e3-c10f-45c1-b768-3089d750219f",
      checkoutUrl: `https://leadifysolutions.lemonsqueezy.com/buy/81a494e3-c10f-45c1-b768-3089d750219f`,
    },
    {
      id: 783455,
      name: "Professional",
      price: 29.99,
      description: "Advanced features for professionals",
      features: [
        "Unlimited searches",
        "Advanced analytics",
        "Priority email support",
        "5 user accounts",
        "Advanced exports",
        "API access",
      ],
      variantId: "3df6e0cf-c654-4323-8149-825b59c05c7f",
      checkoutUrl: `https://leadifysolutions.lemonsqueezy.com/buy/3df6e0cf-c654-4323-8149-825b59c05c7f`,
    },
    {
      id: 783452,
      name: "Enterprise",
      price: 99.99,
      description: "Complete solution for teams",
      features: [
        "Unlimited everything",
        "Custom analytics",
        "24/7 phone support",
        "Unlimited user accounts",
        "Custom exports",
        "Advanced API access",
        "Dedicated account manager",
      ],
      variantId: "d74fff53-9d86-4447-85ed-1590c7157d74",
      checkoutUrl: `https://leadifysolutions.lemonsqueezy.com/buy/d74fff53-9d86-4447-85ed-1590c7157d74`,
    },
    {
      id: 783459,
      name: "Ultimate",
      price: 199.99,
      description: "Everything plus white-glove service",
      features: [
        "All Enterprise features",
        "White-label solution",
        "Custom development",
        "Quarterly business reviews",
        "Strategic consulting",
        "On-site training",
        "Custom integrations",
      ],
      variantId: "5491d18d-ca9d-409e-ab0f-4c5063c77e76",
      checkoutUrl: `https://leadifysolutions.lemonsqueezy.com/buy/5491d18d-ca9d-409e-ab0f-4c5063c77e76`,
    },
  ],
  yearly: [
    {
      id: 0,
      name: "Free",
      price: 0,
      description: "Basic features for personal use",
      features: [
        "5 searches per day",
        "Basic analytics",
        "Email support",
        "1 user account",
      ],
      variantId: null,
      checkoutUrl: "",
    },
    {
      id: 783451,
      name: "Basic",
      price: 99.99,
      description: "Essential features for individuals",
      features: [
        "10 searches per day",
        "Basic analytics",
        "Email support",
        "1 user account",
        "Standard exports",
      ],
      variantId: "67939b0a-52be-45fd-9306-94d29241d78a",
      checkoutUrl: `https://leadifysolutions.lemonsqueezy.com/buy/67939b0a-52be-45fd-9306-94d29241d78a`,
    },
    {
      id: 783457,
      name: "Professional",
      price: 299.99,
      description: "Advanced features for professionals",
      features: [
        "Unlimited searches",
        "Advanced analytics",
        "Priority email support",
        "5 user accounts",
        "Advanced exports",
        "API access",
      ],
      variantId: "7aee438c-cd9a-4691-b71c-81407b0d273f",
      checkoutUrl: `https://leadifysolutions.lemonsqueezy.com/buy/7aee438c-cd9a-4691-b71c-81407b0d273f`,
    },
    {
      id: 783454,
      name: "Enterprise",
      price: 999.99,
      description: "Complete solution for teams",
      features: [
        "Unlimited everything",
        "Custom analytics",
        "24/7 phone support",
        "Unlimited user accounts",
        "Custom exports",
        "Advanced API access",
        "Dedicated account manager",
      ],
      variantId: "638aae02-d3f3-4e7a-8d10-f2694f1c4f5f",
      checkoutUrl: `https://leadifysolutions.lemonsqueezy.com/buy/638aae02-d3f3-4e7a-8d10-f2694f1c4f5f`,
    },
    {
      id: 783464,
      name: "Ultimate",
      price: 1999.99,
      description: "Everything plus white-glove service",
      features: [
        "All Enterprise features",
        "White-label solution",
        "Custom development",
        "Quarterly business reviews",
        "Strategic consulting",
        "On-site training",
        "Custom integrations",
      ],
      variantId: "24794d79-deba-4f60-af21-451537124c87",
      checkoutUrl: `https://leadifysolutions.lemonsqueezy.com/buy/24794d79-deba-4f60-af21-451537124c87`,
    },
  ],
};

type Cycle = "monthly" | "yearly";
export default function BillingUi() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [currentPlan, setCurrentPlan] = useState<number>(0);
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const { user: contextUser, loading: userLoading } = useUser();
  const { subscription: contextSubscription, loading: subscriptionLoading } =
    useSubscription();

  // Load user after component is mounted
  useEffect(() => {
    if (!userLoading && !subscriptionLoading) {
      setUser(contextUser);
      setSubscription(contextSubscription);
    }
  }, [contextUser, userLoading]);

  useEffect(() => {
    if (!userLoading && !subscriptionLoading && subscription?.plan_name) {
      const parsed = parsePlanName(subscription.plan_name);
      if (parsed) {
        const { name, cycle } = parsed;
        const matchedPlan = plansConfig[cycle].find((p) => p.name === name);
        if (matchedPlan) {
          setBillingCycle(cycle);
          setCurrentPlan(matchedPlan.id);
        } else {
          setBillingCycle("monthly");
          setCurrentPlan(0);
        }
      } else {
        setBillingCycle("monthly");
        setCurrentPlan(0);
      }
    }
  }, [subscriptionLoading, subscription]);

  if (userLoading || subscriptionLoading) {
    return <Loading />; // Show a loading state while fetching user data
  }

  if (!user) {
    return <div>Error: User not found</div>; // Handle the case where no user is found
  }

  console.log(subscription);
  // Calculate yearly savings
  const calculateSavings = (monthlyPrice: number, yearlyPrice: number) => {
    if (monthlyPrice === 0) return 0;
    const monthlyCost = monthlyPrice * 12;
    const yearlyCost = yearlyPrice;
    const savings = ((monthlyCost - yearlyCost) / monthlyCost) * 100;
    return Math.round(savings);
  };

  // Sample plan data with expanded options
  const plans = {
    monthly: [
      {
        id: "free",
        name: "Free",
        price: 0,
        description: "Basic features for personal use",
        features: [
          "5 searches per day",
          "Basic analytics",
          "Email support",
          "1 user account",
        ],
        checkoutUrl: "", // Add the checkout URL here
      },
      {
        id: "basic",
        name: "Basic",
        price: 9.99,
        description: "Essential features for individuals",
        features: [
          "10 searches per day",
          "Basic analytics",
          "Email support",
          "1 user account",
          "Standard exports",
        ],
        checkoutUrl: `https://leadifysolutions.lemonsqueezy.com/buy/81a494e3-c10f-45c1-b768-3089d750219f?checkout[custom][user_id]=${user.id}`, // Add the checkout URL here
      },
      {
        id: "pro",
        name: "Professional",
        price: 29.99,
        description: "Advanced features for professionals",
        features: [
          "Unlimited searches",
          "Advanced analytics",
          "Priority email support",
          "5 user accounts",
          "Advanced exports",
          "API access",
        ],
        checkoutUrl: `https://leadifysolutions.lemonsqueezy.com/buy/3df6e0cf-c654-4323-8149-825b59c05c7f?checkout[custom][user_id]=${user.id}`, // Add the checkout URL here
      },
      {
        id: "enterprise",
        name: "Enterprise",
        price: 99.99,
        description: "Complete solution for teams",
        features: [
          "Unlimited everything",
          "Custom analytics",
          "24/7 phone support",
          "Unlimited user accounts",
          "Custom exports",
          "Advanced API access",
          "Dedicated account manager",
        ],
        checkoutUrl: `https://leadifysolutions.lemonsqueezy.com/buy/d74fff53-9d86-4447-85ed-1590c7157d74?checkout[custom][user_id]=${user.id}`, // Add the checkout URL here
      },
      {
        id: "ultimate",
        name: "Ultimate",
        price: 199.99,
        description: "Everything plus white-glove service",
        features: [
          "All Enterprise features",
          "White-label solution",
          "Custom development",
          "Quarterly business reviews",
          "Strategic consulting",
          "On-site training",
          "Custom integrations",
        ],
        checkoutUrl: `https://leadifysolutions.lemonsqueezy.com/buy/5491d18d-ca9d-409e-ab0f-4c5063c77e76?checkout[custom][user_id]=${user.id}`, // Add the checkout URL here
      },
    ],
    yearly: [
      {
        id: "free",
        name: "Free",
        price: 0,
        description: "Basic features for personal use",
        features: [
          "5 searches per day",
          "Basic analytics",
          "Email support",
          "1 user account",
        ],
        checkoutUrl: "", // Add the checkout URL here
      },
      {
        id: "basic",
        name: "Basic",
        price: 99.99,
        description: "Essential features for individuals",
        features: [
          "10 searches per day",
          "Basic analytics",
          "Email support",
          "1 user account",
          "Standard exports",
        ],
        checkoutUrl: `https://leadifysolutions.lemonsqueezy.com/buy/67939b0a-52be-45fd-9306-94d29241d78a?checkout[custom][user_id]=${user.id}`, // Add the checkout URL here
      },
      {
        id: "pro",
        name: "Professional",
        price: 299.99,
        description: "Advanced features for professionals",
        features: [
          "Unlimited searches",
          "Advanced analytics",
          "Priority email support",
          "5 user accounts",
          "Advanced exports",
          "API access",
        ],
        checkoutUrl: `https://leadifysolutions.lemonsqueezy.com/buy/7aee438c-cd9a-4691-b71c-81407b0d273f?checkout[custom][user_id]=${user.id}`, // Add the checkout URL here
      },
      {
        id: "enterprise",
        name: "Enterprise",
        price: 999.99,
        description: "Complete solution for teams",
        features: [
          "Unlimited everything",
          "Custom analytics",
          "24/7 phone support",
          "Unlimited user accounts",
          "Custom exports",
          "Advanced API access",
          "Dedicated account manager",
        ],
        checkoutUrl: `https://leadifysolutions.lemonsqueezy.com/buy/638aae02-d3f3-4e7a-8d10-f2694f1c4f5f?checkout[custom][user_id]=${user.id}`, // Add the checkout URL here
      },
      {
        id: "ultimate",
        name: "Ultimate",
        price: 1999.99,
        description: "Everything plus white-glove service",
        features: [
          "All Enterprise features",
          "White-label solution",
          "Custom development",
          "Quarterly business reviews",
          "Strategic consulting",
          "On-site training",
          "Custom integrations",
        ],
        checkoutUrl: `https://leadifysolutions.lemonsqueezy.com/checkout/buy/24794d79-deba-4f60-af21-451537124c87?checkout[custom][user_id]=${user.id}`, // Add the checkout URL here
      },
    ],
  };

  // Sample invoice data
  const invoices = [
    {
      id: "INV-2025-0412",
      planName: "Professional Plan",
      amount: 29.99,
      purchaseDate: "April 12, 2025",
      endDate: "May 12, 2025",
      status: "Paid",
    },
    {
      id: "INV-2025-0312",
      planName: "Professional Plan",
      amount: 29.99,
      purchaseDate: "March 12, 2025",
      endDate: "April 12, 2025",
      status: "Paid",
    },
    {
      id: "INV-2025-0212",
      planName: "Basic Plan",
      amount: 9.99,
      purchaseDate: "February 12, 2025",
      endDate: "March 12, 2025",
      status: "Paid",
    },
    {
      id: "INV-2025-0112",
      planName: "Basic Plan",
      amount: 9.99,
      purchaseDate: "January 12, 2025",
      endDate: "February 12, 2025",
      status: "Paid",
    },
  ];
  function parsePlanName(
    planName: string
  ): { name: string; cycle: Cycle } | null {
    const match = planName.match(/^(.+?)\s*\((monthly|yearly)\)$/i);
    if (!match) return null;
    const [, name, cycle] = match;
    return {
      name: name.trim(),
      cycle: cycle.toLowerCase() as Cycle,
    };
  }

  async function handleUpdate(plan: any, user: any, subscription: any) {
    console.log(plan.id);
    console.log(Number(subscription.plan_id));
    if (!plan?.id || !user?.id) {
      console.error("Missing plan variant or user ID.");
      return;
    }

    // If user isn't paid, send them to the normal checkout URL:
    if (!user.subscription_status) {
      window.location.href = `${plan.checkoutUrl}?checkout[custom][user_id]=${user.id}`;
      return;
    }

    if (plan.name === parsePlanName(subscription.plan_name)?.name) {
      alert("You are already on this plan.");
      return;
    }
    // Otherwise, call your backend to update the existing subscription:
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_LOCAL_URL}update-subscription`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          variant_id: plan.id,
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      console.error("Upgrade failed:", err);
      alert("Could not change plan. Please try again.");
    } else {
      // Optionally show a spinner/toast until webhook arrives and DB updates
      alert("Plan change in progress! Your subscription will update shortly.");
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Billing & Subscription
        </h1>
        <p className="text-muted-foreground">
          Manage your subscription and billing information.
        </p>
      </div>

      {/* Billing Cycle Toggle */}
      <div className="flex justify-end items-center space-x-4">
        <span
          className={cn(
            "text-sm font-medium",
            billingCycle === "monthly"
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          Monthly
        </span>
        <div className="flex items-center space-x-2">
          <Switch
            id="billing-cycle"
            checked={billingCycle === "yearly"}
            onCheckedChange={(checked) =>
              setBillingCycle(checked ? "yearly" : "monthly")
            }
          />
          <Label htmlFor="billing-cycle" className="sr-only">
            Toggle billing cycle
          </Label>
        </div>
        <div className="flex items-center">
          <span
            className={cn(
              "text-sm font-medium",
              billingCycle === "yearly"
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            Yearly
          </span>
          <Badge
            variant="outline"
            className="ml-2 bg-green-50 text-green-700 hover:bg-green-50 border-green-200"
          >
            Save 16%
          </Badge>
        </div>
      </div>

      {/* Plan Cards Carousel */}
      <div className="relative">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {plansConfig[billingCycle].map((plan) => (
              <CarouselItem
                key={plan.id}
                className="pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <Card
                  className={cn(
                    "h-full flex flex-col transition-all duration-300 select-none",
                    currentPlan === plan.id
                      ? "border-primary border-2 shadow-md shadow-primary/20"
                      : "hover:border-primary/50"
                  )}
                >
                  <CardHeader
                    className={cn(
                      "pb-4 relative",
                      currentPlan === plan.id
                        ? "bg-gradient-to-br from-primary-foreground/10 to-/5"
                        : ""
                    )}
                  >
                    {currentPlan === plan.id && (
                      <Badge className="w-fit mb-2 bg-primary hover:bg-primary/90">
                        Current Plan
                      </Badge>
                    )}
                    <CardTitle className="flex items-center">
                      {plan.name}
                      {currentPlan === plan.id && (
                        <CheckCircle className="ml-2 h-5 w-5 text-primary" />
                      )}
                    </CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-2">
                      <span className="text-3xl font-bold">
                        ${plan.price.toFixed(2)}
                      </span>
                      <span className="text-muted-foreground">
                        /{billingCycle === "monthly" ? "month" : "year"}
                      </span>
                      {billingCycle === "yearly" && plan.price > 0 && (
                        <Badge
                          variant="outline"
                          className="ml-2 bg-green-50 text-green-700 hover:bg-green-50 border-green-200"
                        >
                          Save{" "}
                          {calculateSavings(
                            plansConfig.monthly.find((p) => p.id === plan.id)
                              ?.price || 0,
                            plan.price
                          )}
                          %
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4 flex-grow">
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 animate-in fade-in-50 duration-300"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <CheckCircle
                            className={cn(
                              "h-5 w-5 shrink-0 mt-0.5",
                              currentPlan === plan.id
                                ? "text-primary"
                                : "text-green-500"
                            )}
                          />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="mt-auto pt-4">
                    {currentPlan === plan.id ? (
                      <Button className="w-full bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20">
                        Current Plan
                      </Button>
                    ) : currentPlan &&
                      plansConfig[billingCycle].findIndex(
                        (p) => p.id === plan.id
                      ) >
                        plansConfig[billingCycle].findIndex(
                          (p) => p.id === currentPlan
                        ) ? (
                      <Button
                        className="w-full bg-primary hover:bg-primary/90 transition-colors"
                        onClick={() => handleUpdate(plan, user, subscription)}
                      >
                        Upgrade Plan
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => handleUpdate(plan, user, subscription)}
                      >
                        Downgrade
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2" />
          </div>
        </Carousel>
      </div>

      {/* Current Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Usage</CardTitle>
          <CardDescription>Your current usage statistics.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Searches</span>
                <span className="text-sm">127 / Unlimited</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-1000 ease-in-out"
                  style={{ width: "40%" }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Exports</span>
                <span className="text-sm">42 / 100</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-1000 ease-in-out"
                  style={{ width: "42%" }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Saved Searches</span>
                <span className="text-sm">8 / 10</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-1000 ease-in-out"
                  style={{ width: "80%" }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>
            Your recent invoices and payment history.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan Name</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Purchase Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow
                    key={invoice.id}
                    className="transition-all duration-200 hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">
                      {invoice.planName}
                    </TableCell>
                    <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                    <TableCell>{invoice.purchaseDate}</TableCell>
                    <TableCell>{invoice.endDate}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200"
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <span className="sr-only">Download invoice</span>
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Manage your payment methods.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg transition-colors hover:bg-primary/5 hover:border-primary/30">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Visa ending in 4242</p>
                <p className="text-sm text-muted-foreground">Expires 04/2026</p>
              </div>
            </div>
            <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              Default
            </Badge>
          </div>

          <Button
            variant="outline"
            className="w-full hover:border-primary/50 hover:text-primary transition-colors"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Add Payment Method
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
// "use client";
// import { Product } from "@/app/types/lemonSqueezy";
// import React, { useState, useEffect } from "react";

// const BillingUi = () => {
//   const [products, setProducts] = useState<Product[]>([]);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       const cachedProducts = localStorage.getItem("products");

//       if (cachedProducts) {
//         setProducts(JSON.parse(cachedProducts));
//       } else {
//         const apiKey = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_API_KEY; // Get API key from environment
//         const url = "https://api.lemonsqueezy.com/v1/products"; // Your API route for fetching products

//         try {
//           const response = await fetch(url, {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${apiKey}`,
//               Accept: "application/json",
//             },
//           });

//           if (!response.ok) {
//             throw new Error("Failed to fetch products");
//           }

//           const data = await response.json();
//           setProducts(data.data);
//           localStorage.setItem("products", JSON.stringify(data.data)); // Cache products in localStorage
//         } catch (error) {
//           console.error("Error fetching products:", error);
//         }
//       }
//     };

//     fetchProducts();
//   }, []);

//   if (products.length === 0) return <p>Loading products...</p>;

//   return (
//     <div>
//       {products.map((product) => (
//         <div key={product.id} className="product-card">
//           <h3>{product.name}</h3>
//           <p>{product.description}</p>
//           <div>
//             {product.variants && product.variants.length > 0 ? (
//               product.variants.map((variant) => (
//                 <div key={variant.id} className="variant-card">
//                   <h4>{variant.name}</h4>
//                   <p>${variant.price}</p>
//                   <p>Billing cycle: {variant.billing_cycle}</p>
//                   <a href={variant.checkout_url}>Manage Subscription</a>
//                 </div>
//               ))
//             ) : (
//               <p>No variants available</p>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default BillingUi;
