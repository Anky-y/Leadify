import type React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import { UserProvider } from "@/app/context/UserContext";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { SubscriptionProvider } from "@/app/context/SubscriptionContext";

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
              <Toaster
                richColors
                position="bottom-right"
                closeButton
                expand={true}
                visibleToasts={5}
                toastOptions={{
                  style: {
                    borderRadius: "12px",
                    fontSize: "14px",
                    padding: "16px",
                    minHeight: "60px",
                    border: "1px solid rgba(0, 0, 0, 0.08)",
                    boxShadow:
                      "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  },
                  duration: 4000,
                }}
              />
            </ThemeProvider>
          </SubscriptionProvider>
        </UserProvider>
      </body>
    </html>
  );
}
