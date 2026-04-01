"use client";

import { useEffect, useState } from "react";

export function useFirstVisitAutoplay(storageKey = "heroAutoPlayed") {
  const [autoplay, setAutoplay] = useState(false);

  useEffect(() => {
    const hasAutoplayed = window.localStorage.getItem(storageKey);

    if (hasAutoplayed) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setAutoplay(true);
    });

    window.localStorage.setItem(storageKey, "true");

    return () => window.cancelAnimationFrame(frame);
  }, [storageKey]);

  return {
    autoplay,
    stopAutoplay: () => setAutoplay(false),
  };
}
