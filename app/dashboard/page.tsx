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
import { getUserData } from "@/lib/utils/auth";
import { useUserSession } from "../context/UserSessionContext";
import DashboardUi from "@/components/dashboard/DashboardUi";
import DashboardPageWrapper from "@/components/dashboard/DashboardPageWrapper";


export const metadata: Metadata = {
  title: "Dashboard | Leadify",
  description: "View your Leadify dashboard and analytics.",
};

export default async function DashboardPage() {
  return (
      <DashboardUi />
  );
}
