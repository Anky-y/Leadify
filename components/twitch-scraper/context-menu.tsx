"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode, useEffect, useRef, useState } from "react";

interface ContextMenuProps {
  children: ReactNode;
  x: number;
  y: number;
  open: boolean;
  onClose: () => void;
  className?: string;
}

export function ContextMenu({
  children,
  x,
  y,
  open,
  onClose,
  className,
}: ContextMenuProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x, y });
  const [measured, setMeasured] = useState(false);
  const [portal, setPortal] = useState<HTMLElement | null>(null);

  // Set up portal for rendering outside the DOM hierarchy
  useEffect(() => {
    setPortal(document.body);
  }, []);

  // Reset measured state and position when menu is opened at a new location
  useEffect(() => {
    if (open) {
      setMeasured(false);
      setPosition({ x, y });
    }
  }, [x, y, open]);

  // Smart positioning: measure and adjust position after first render
  useEffect(() => {
    if (ref.current && open && !measured) {
      const rect = ref.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      let adjustedX = x;
      let adjustedY = y;

      // Adjust horizontal position if needed
      if (x + rect.width > windowWidth) {
        adjustedX = Math.max(windowWidth - rect.width - 8, 8);
      }

      // Adjust vertical position if needed
      if (y + rect.height > windowHeight) {
        adjustedY = Math.max(windowHeight - rect.height - 8, 8);
      }

      setPosition({ x: adjustedX, y: adjustedY });
      setMeasured(true);
    }
  }, [x, y, open, measured]);

  // Handle clicks outside the context menu
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("contextmenu", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("contextmenu", handleOutsideClick);
    };
  }, [open, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  // Animation variants
  const menuVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.1,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.075,
        ease: "easeIn",
      },
    },
  };

  if (!portal) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          className={cn(
            "fixed z-50 min-w-[180px] overflow-hidden rounded-md border border-gray-200 bg-white p-1 shadow-md",
            className
          )}
          initial="hidden"
          animate={measured ? "visible" : false}
          exit="exit"
          variants={menuVariants}
          style={{
            left: measured ? position.x : -9999,
            top: measured ? position.y : -9999,
            visibility: measured ? "visible" : "hidden",
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>,
    portal
  );
}
