import type { Metadata } from "next";
// import { requireAuth } from "@/app/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, CreditCard, Receipt, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import User from "@/app/types/user";
import { getUserData } from "@/utils/auth";
import { redirect } from "next/navigation";
import BillingUi from "@/components/billing/BillingUi";

export const metadata: Metadata = {
  title: "Billing | Leadify",
  description: "Manage your subscription and billing information.",
};

export default async function BillingPage() {
  return <BillingUi />;
}
