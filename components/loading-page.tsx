"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LoadingPageProps {
  /**
   * The title to display on the loading page
   * @default "Loading"
   */
  title?: string;

  /**
   * The subtitle or description to display below the title
   * @default "Please wait while we prepare your content..."
   */
  subtitle?: string;

  /**
   * Whether to show a progress indicator
   * @default false
   */
  showProgress?: boolean;

  /**
   * The current progress value (0-100)
   * @default 0
   */
  progress?: number;

  /**
   * The theme variant to use
   * @default "default"
   */
  variant?: "default" | "minimal" | "branded";

  /**
   * Whether the loading is complete
   * @default false
   */
  isComplete?: boolean;

  /**
   * The message to display when loading is complete
   * @default "Complete!"
   */
  completeMessage?: string;

  /**
   * Callback function when the loading animation is complete
   */
  onComplete?: () => void;

  /**
   * Additional CSS classes to apply to the component
   */
  className?: string;

  /**
   * Whether to show the logo
   * @default true
   */
  showLogo?: boolean;

  /**
   * Array of loading messages to cycle through
   */
  loadingMessages?: string[];

  /**
   * Interval in milliseconds to cycle through loading messages
   * @default 3000
   */
  messageInterval?: number;
}

/**
 * A visually engaging loading page component that provides feedback during loading processes
 */
export function LoadingPage({
  title = "Loading",
  subtitle = "Please wait while we prepare your content...",
  showProgress = false,
  progress = 0,
  variant = "default",
  isComplete = false,
  completeMessage = "Complete!",
  onComplete,
  className,
  showLogo = true,
  loadingMessages = [],
  messageInterval = 3000,
}: LoadingPageProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progressValue, setProgressValue] = useState(progress);
  const [showComplete, setShowComplete] = useState(false);

  // Auto-increment progress for better UX when no actual progress is provided
  useEffect(() => {
    if (!showProgress || isComplete) return;

    // If progress is manually controlled, use that value
    if (progress > 0) {
      setProgressValue(progress);
      return;
    }

    // Otherwise simulate progress
    const interval = setInterval(() => {
      setProgressValue((prev) => {
        // Slow down as we approach 90%
        const increment = prev < 30 ? 5 : prev < 60 ? 3 : prev < 85 ? 1 : 0.5;
        const newValue = Math.min(prev + increment, 90);
        return newValue;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [showProgress, progress, isComplete]);

  // Handle completion
  useEffect(() => {
    if (isComplete) {
      setProgressValue(100);
      const timer = setTimeout(() => {
        setShowComplete(true);
        if (onComplete) {
          const completeTimer = setTimeout(() => {
            onComplete();
          }, 1000);
          return () => clearTimeout(completeTimer);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, onComplete]);

  // Cycle through loading messages if provided
  useEffect(() => {
    if (loadingMessages.length === 0 || isComplete) return;

    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) =>
        prev === loadingMessages.length - 1 ? 0 : prev + 1
      );
    }, messageInterval);

    return () => clearInterval(interval);
  }, [loadingMessages, messageInterval, isComplete]);

  // Get current message to display
  const currentMessage =
    loadingMessages.length > 0
      ? loadingMessages[currentMessageIndex]
      : subtitle;

  return (
    <div
      className={cn(
        "min-h-[50vh] w-full flex flex-col items-center justify-center p-6",
        variant === "minimal" ? "gap-4" : "gap-8",
        className
      )}
    >
      {/* Logo or Brand Element */}
      {showLogo && variant === "branded" && (
        <div className="mb-8 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <div className="flex items-center justify-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Leadify
              </div>
            </div>
          </motion.div>

          {/* Animated background elements */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-blue-500/10 z-0"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-purple-500/10 z-0"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </div>
      )}

      {/* Main Loading Indicator */}
      <AnimatePresence mode="wait">
        {!showComplete ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center"
          >
            {/* Spinner */}
            <div className="relative mb-6">
              {variant !== "minimal" && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-500 border-r-purple-500"
                />
              )}

              {variant === "minimal" && (
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              )}

              {/* Inner pulse effect */}
              {variant === "default" && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{
                    scale: [0.8, 1.1, 0.8],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-sm" />
                </motion.div>
              )}
            </div>

            {/* Title */}
            <h2
              className={cn(
                "font-bold text-foreground",
                variant === "minimal" ? "text-xl" : "text-2xl md:text-3xl"
              )}
            >
              {title}
            </h2>

            {/* Subtitle with message cycling */}
            <AnimatePresence mode="wait">
              <motion.p
                key={currentMessage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mt-2 text-muted-foreground max-w-md"
              >
                {currentMessage}
              </motion.p>
            </AnimatePresence>

            {/* Progress Bar */}
            {showProgress && (
              <div className="w-full max-w-xs mt-6">
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progressValue}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                {variant !== "minimal" && (
                  <div className="mt-1 text-xs text-right text-muted-foreground">
                    {Math.round(progressValue)}%
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center text-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
              }}
            >
              <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
            </motion.div>
            <h2 className="text-2xl font-bold text-foreground">
              {completeMessage}
            </h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Elements - Only in default and branded variants */}
      {variant !== "minimal" && !showComplete && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={cn(
                "absolute rounded-full opacity-20",
                i % 2 === 0 ? "bg-blue-400" : "bg-purple-400"
              )}
              style={{
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100],
                x: [0, Math.random() * 50 - 25],
                opacity: [0.2, 0],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 5,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * A component that displays a loading page with a simulated progress
 * and automatically redirects after completion
 */
export function AutoLoadingPage({
  duration = 3000,
  onComplete,
  ...props
}: LoadingPageProps & { duration?: number }) {
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 100 / (duration / 100);
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsComplete(true);
          return 100;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [duration]);

  const handleComplete = () => {
    if (onComplete) onComplete();
  };

  return (
    <LoadingPage
      {...props}
      progress={progress}
      showProgress={true}
      isComplete={isComplete}
      onComplete={handleComplete}
    />
  );
}

/**
 * Example usage of the LoadingPage component with different variants
 */
export function LoadingPageExamples() {
  return (
    <div className="space-y-12 py-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Default Variant</h3>
        <LoadingPage
          title="Loading Dashboard"
          subtitle="Preparing your analytics..."
          showProgress={true}
          progress={65}
        />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Minimal Variant</h3>
        <LoadingPage
          variant="minimal"
          title="Processing"
          subtitle="Your request is being processed"
        />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Branded Variant</h3>
        <LoadingPage
          variant="branded"
          title="Welcome to Leadify"
          subtitle="Setting up your workspace"
          showProgress={true}
          loadingMessages={[
            "Setting up your workspace...",
            "Connecting to data sources...",
            "Preparing your dashboard...",
            "Almost ready...",
          ]}
        />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Completed State</h3>
        <LoadingPage
          title="Processing Complete"
          isComplete={true}
          completeMessage="Your data is ready!"
        />
      </div>
    </div>
  );
}
