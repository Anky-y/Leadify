"use client";

import { useState } from "react";
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

export default function BillingUi() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [currentPlan, setCurrentPlan] = useState<string>("pro");

  // Calculate yearly savings
  const calculateSavings = (monthlyPrice: number, yearlyPrice: number) => {
    if (monthlyPrice === 0) return 0;
    const monthlyCost = monthlyPrice * 12;
    const yearlyCost = yearlyPrice;
    const savings = ((monthlyCost - yearlyCost) / monthlyCost) * 100;
    return Math.round(savings);
  };

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
            {plans[billingCycle].map((plan) => (
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
                            plans.monthly.find((p) => p.id === plan.id)
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
                      plans[billingCycle].findIndex((p) => p.id === plan.id) >
                        plans[billingCycle].findIndex(
                          (p) => p.id === currentPlan
                        ) ? (
                      <Button className="w-full bg-primary hover:bg-primary/90 transition-colors">
                        Upgrade Plan
                      </Button>
                    ) : (
                      <Button className="w-full" variant="outline">
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
      {/* <Card>
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
      </Card> */}
    </div>
  );
}
