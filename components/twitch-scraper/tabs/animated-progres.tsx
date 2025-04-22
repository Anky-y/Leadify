"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

interface AnimatedProgressProps {
  value: number;
  className?: string;
}

export function AnimatedProgress({
  value,
  className = "h-2",
}: AnimatedProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(value);
    }, 100);

    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="relative w-full">
      <Progress
        value={progress}
        className={`${className} transition-all duration-700 ease-out`}
      />
      {value > 0 && value < 100 && (
        <div
          className="absolute h-full w-1 bg-white opacity-75 animate-[progress-pulse_2s_ease-in-out_infinite]"
          style={{
            left: `${progress - 1}%`,
            display: progress < 1 ? "none" : "block",
          }}
        />
      )}
    </div>
  );
}
