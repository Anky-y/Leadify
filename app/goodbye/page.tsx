"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, Heart, Mail, X } from "lucide-react";

export default function GoodbyePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-3xl mx-auto text-center space-y-8">
          {/* Goodbye message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-blue-900 dark:text-blue-100">
              We're sad to see you go
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Thank you for being a part of Leadify. We hope our paths cross
              again in the future.
            </p>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pt-6"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button
                  variant="default"
                  className="bg-blue-700 hover:bg-blue-800"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Log Back In
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Support
                </Button>
              </Link>
              <Link
                href="https://twitter.com/leadify"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  <X className="mr-2 h-4 w-4" />
                  Follow Us
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Feedback section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="pt-12"
          >
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 max-w-xl mx-auto">
              <h2 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-3">
                Help us improve Leadify
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We'd love to hear why you're leaving. Your feedback helps us
                make Leadify better for everyone.
              </p>
              <Link href="/feedback">
                <Button variant="secondary" className="w-full sm:w-auto">
                  <Heart className="mr-2 h-4 w-4" />
                  Share Feedback
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-500">
        <p>© 2025 Leadify, Inc. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-2">
          <Link href="/privacy-policy" className="hover:text-blue-600">
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" className="hover:text-blue-600">
            Terms of Service
          </Link>
        </div>
      </footer>
    </div>
  );
}

// Wave animation component
function WaveAnimation() {
  return (
    <div className="relative w-full max-w-md">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full blur-3xl opacity-50" />

      {/* Animated waves */}
      <div className="relative">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-blue-500/30"
            style={{ scale: 0.6 + i * 0.2 }}
            animate={{
              scale: [0.6 + i * 0.2, 0.8 + i * 0.2, 0.6 + i * 0.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              delay: i * 0.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Center icon */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
            <Image
              src="/images/leadifylogo.png"
              alt="Leadify Logo"
              width={40}
              height={40}
              className="h-8 w-auto"
            />
          </div>
        </motion.div>
      </div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full bg-blue-500"
          style={{
            width: `${Math.random() * 6 + 4}px`,
            height: `${Math.random() * 6 + 4}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -40 - Math.random() * 40],
            x: [0, (Math.random() - 0.5) * 40],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
