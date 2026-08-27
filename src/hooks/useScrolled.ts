import { useEffect, useState } from "react";

/**
 * True once the page has scrolled past `threshold` px.
 *
 * Drives the nav's frosted-glass plate: at the very top the bar sits directly
 * on the hero mesh and reads better with no surface at all, but over scrolling
 * content it needs one so the brand and CTA stay legible.
 */
export function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    // run once in case the page loads already scrolled (reload, deep link)
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}
