import { useEffect, useRef, useState } from "react";

/**
 * Fades an element in the first time it scrolls into view.
 * Falls back to always-visible if IntersectionObserver isn't available,
 * and force-reveals after 2s as a safety net so content can never get
 * stuck invisible.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    io.observe(el);

    const safety = setTimeout(() => setVisible(true), 2000);

    return () => {
      io.disconnect();
      clearTimeout(safety);
    };
  }, []);

  return { ref, className: `reveal${visible ? " visible" : ""}` };
}