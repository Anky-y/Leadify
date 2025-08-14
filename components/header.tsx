"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useRef } from "react";
import { cn } from "../lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { usePathname } from "next/navigation";
// import { getUser } from "../app/auth"
import { useEffect, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import User from "@/app/types/user";
import Spinner from "./spinner";


 export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { user: contextUser, loading: userLoading } = useUser();
  const [user, setUser] = useState<User | null>(null);

  // Load user after component is mounted
  useEffect(() => {
    if (!userLoading) {
      setUser(contextUser);
    }
  }, [contextUser, userLoading]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Skip this check if the menu is already closed
      if (!isMenuOpen) return;

      // Get the button element
      const menuButton = document.querySelector('[aria-label="Toggle menu"]');

      // Don't close if clicking the menu button itself - let its own handler manage that
      if (menuButton && menuButton.contains(event.target as Node)) {
        return;
      }

      // Close if clicking outside the menu
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  // Close menu when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (isMenuOpen) setIsMenuOpen(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMenuOpen]);
  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Check if a link is active
  const isActive = (path: string) => {
    if (path === "/" && pathname !== "/") {
      return false;
    }
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/leadifylogo.png"
              alt="Leadify Logo"
              width={40}
              height={40}
              className="h-8 w-auto"
            />
            <span className="text-xl font-bold text-blue-700">Leadify</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={cn(
              "text-sm font-medium transition-colors",
              isActive("/") ? "text-blue-700" : "hover:text-blue-600"
            )}
          >
            Home
          </Link>
          <Link
            href="/features"
            className={cn(
              "text-sm font-medium transition-colors",
              isActive("/features") ? "text-blue-700" : "hover:text-blue-600"
            )}
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className={cn(
              "text-sm font-medium transition-colors",
              isActive("/pricing") ? "text-blue-700" : "hover:text-blue-600"
            )}
          >
            Pricing
          </Link>
          <Link
            href="/contact"
            className={cn(
              "text-sm font-medium transition-colors",
              isActive("/contact") ? "text-blue-700" : "hover:text-blue-600"
            )}
          >
            Contact
          </Link>
          <Link
            href="/privacy-policy"
            className={cn(
              "text-sm font-medium transition-colors",
              isActive("/privacy-policy") ? "text-blue-700" : "hover:text-blue-600"
            )}
          >
            Privacy Policy
          </Link>
          <Link
            href="/refund-policy"
            className={cn(
              "text-sm font-medium transition-colors",
              isActive("/refund-policy") ? "text-blue-700" : "hover:text-blue-600"
            )}
          >
            Refund Policy
          </Link>
        </nav>

        {/* Desktop Auth Buttons and Theme Toggle */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <Link href="/dashboard">
              <Button size="sm" className="bg-blue-700 hover:bg-blue-800">
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-blue-700 hover:bg-blue-800">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button and Theme Toggle */}
        <div className="md:hidden flex items-center gap-1">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 p-0"
            onClick={(e) => {
              // Stop propagation to prevent the document click handler from firing
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        ref={menuRef}
        className={cn(
          "absolute left-0 right-0 z-50 bg-background shadow-md transform transition-all duration-200 ease-in-out md:hidden",
          isMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        )}
      >
        <div className="container py-3 px-4 flex flex-col">
          <nav className="flex flex-col space-y-1">
            <Link
              href="/"
              className={cn(
                "px-2 py-2 text-sm font-medium rounded-md transition-colors",
                isActive("/")
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-200"
                  : "hover:bg-blue-50 dark:hover:bg-blue-900/20"
              )}
            >
              Home
            </Link>
            <Link
              href="/features"
              className={cn(
                "px-2 py-2 text-sm font-medium rounded-md transition-colors",
                isActive("/features")
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-200"
                  : "hover:bg-blue-50 dark:hover:bg-blue-900/20"
              )}
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className={cn(
                "px-2 py-2 text-sm font-medium rounded-md transition-colors",
                isActive("/pricing")
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-200"
                  : "hover:bg-blue-50 dark:hover:bg-blue-900/20"
              )}
            >
              Pricing
            </Link>
            <Link
              href="/contact"
              className={cn(
                "px-2 py-2 text-sm font-medium rounded-md transition-colors",
                isActive("/contact")
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-200"
                  : "hover:bg-blue-50 dark:hover:bg-blue-900/20"
              )}
            >
              Contact
            </Link>
          </nav>

          <div className="flex gap-2 mt-3 pt-2 border-t border-gray-100 dark:border-gray-800">
            {user ? (
              <Link href="/dashboard" className="w-full">
                <Button
                  size="sm"
                  className="w-full justify-center bg-blue-700 hover:bg-blue-800"
                >
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" className="flex-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-center"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup" className="flex-1">
                  <Button
                    size="sm"
                    className="w-full justify-center bg-blue-700 hover:bg-blue-800"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
