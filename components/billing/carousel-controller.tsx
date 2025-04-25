"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Carousel, type CarouselApi } from "@/components/ui/carousel";

interface CarouselControllerProps {
  children: React.ReactNode;
  className?: string;
  opts?: any;
}

export function CarouselController({
  children,
  className,
  opts,
}: CarouselControllerProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <Carousel setApi={setApi} className={className} opts={opts}>
      {children}
    </Carousel>
  );
}
