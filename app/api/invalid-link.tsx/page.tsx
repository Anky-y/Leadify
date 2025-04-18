"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function InvalidLinkPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-gradient-to-b from-red-50 to-rose-100">
      <div className="max-w-md w-full text-center space-y-6 p-8 bg-white rounded-2xl shadow-lg border border-red-200">
        <div className="flex justify-center">
          <AlertTriangle className="h-10 w-10 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-red-700">
          Link Expired or Invalid
        </h1>
        <p className="text-gray-600">
          This verification link is no longer valid. It may have expired or
          already been used.
        </p>
        <div className="space-y-2">
          <Link href="/signup">
            <Button className="w-full bg-blue-700 hover:bg-blue-800">
              Sign up again
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="w-full">
              Back to login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
