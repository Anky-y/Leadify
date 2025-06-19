import type React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import { UserProvider } from "./context/UserContext";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { SubscriptionProvider } from "./context/SubscriptionContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Leadify - Discover the Perfect Streamers for Your Brand",
  description:
    "Connect with the right content creators to amplify your brand's message and reach your target audience effectively.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <UserProvider>
          <SubscriptionProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
              {children}
              <Toaster richColors position="bottom-right" />
            </ThemeProvider>
          </SubscriptionProvider>
        </UserProvider>
      </body>
    </html>
  );
}
