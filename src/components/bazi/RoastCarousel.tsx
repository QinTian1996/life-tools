"use client";

import { useState, useEffect } from "react";

interface RoastCarouselProps {
  roasts: string[];
}

export function RoastCarousel({ roasts }: RoastCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (roasts.length === 0) return;

    const interval = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % roasts.length);
        setIsVisible(true);
      }, 500);
    }, 10000);

    return () => clearInterval(interval);
  }, [roasts.length]);

  if (roasts.length === 0) {
    return null;
  }

  return (
    <div className="relative min-h-[80px] flex items-center justify-center">
      <div
        className="text-center px-6 py-4 bg-[var(--card)] rounded-lg border border-[var(--border)] transition-opacity duration-500"
        style={{ opacity: isVisible ? 1 : 0 }}
      >
        <div className="text-2xl mb-2">💬</div>
        <p className="text-[var(--foreground)] italic">
          "{roasts[currentIndex]}"
        </p>
        <div className="mt-2 flex justify-center gap-1.5">
          {roasts.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === currentIndex
                  ? 'bg-[var(--primary)]'
                  : 'bg-[var(--muted-foreground)]'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
