"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  // Use useState to track component mounting state
  const [mounted, setMounted] = useState(false)

  // Get theme utilities from next-themes
  const { resolvedTheme, setTheme } = useTheme()

  // Set mounted to true after component mounts to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    // Only toggle if component is mounted
    if (mounted) {
      // Check current resolved theme and set the opposite
      setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }
  }

  // If not mounted yet, render a placeholder to avoid hydration mismatch
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9">
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  // Render the appropriate icon based on the current theme
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9"
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`}
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem] transition-transform duration-200 ease-in-out" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] transition-transform duration-200 ease-in-out" />
      )}
      <span className="sr-only">{resolvedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme"}</span>
    </Button>
  )
}
