"use client";

import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
  /** Visibility ratio required to count as "in view". Defaults to 0.6. */
  threshold?: number;
  /** Optional root margin passed to the IntersectionObserver. */
  rootMargin?: string;
}

interface UseInViewResult<T extends Element> {
  /** Ref to attach to the observed element. */
  ref: React.RefObject<T | null>;
  /** Whether the element currently meets the visibility threshold. */
  inView: boolean;
}

/**
 * Tracks whether a referenced element is sufficiently visible in the viewport
 * using IntersectionObserver. Used to auto-play / pause feed videos.
 */
export function useInView<T extends Element = HTMLDivElement>({
  threshold = 0.6,
  rootMargin = "0px",
}: UseInViewOptions = {}): UseInViewResult<T> {
  const ref = useRef<T | null>(null);
  // When IntersectionObserver is unavailable (e.g. very old browsers), default
  // to "in view" so videos still behave. Computed lazily to avoid setState in
  // an effect.
  const [inView, setInView] = useState<boolean>(
    () =>
      typeof window !== "undefined" &&
      typeof IntersectionObserver === "undefined"
  );

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // No IntersectionObserver support: nothing to observe, keep default state.
    if (typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting && entry.intersectionRatio >= threshold);
      },
      { threshold, rootMargin }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, inView };
}
