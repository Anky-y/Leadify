import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUpRight, Users, Search, Clock, BarChart3 } from "lucide-react";
import Link from "next/link";
import DashboardUi from "@/components/dashboard/DashboardUi";
import { redirect } from "next/navigation";
import User from "../types/user";
import { getUserData } from "@/utils/auth";
// import DashboardPageWrapper from "@/components/dashboard/DashboardPageWrapper";
// import { getUser } from "@/utils/auth";

export const metadata: Metadata = {
  title: "Dashboard | Leadify",
  description: "View your Leadify dashboard and analytics.",
};

export default async function DashboardPage() {
  // const user: User | null = await getUserData();
  // if (!user) {
  //   // Redirect to login if no user is found
  //   return redirect("/login");
  // }
  return <DashboardUi />;
}
