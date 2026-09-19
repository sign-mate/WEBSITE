import { useEffect, useRef, useState } from "react";

export function useCountdown(targetMs: number | null) {
  const [remaining, setRemaining] = useState(0);
  const frame = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (targetMs === null) {
      setRemaining(0);
      return;
    }
    const tick = () => {
      const left = Math.max(0, Math.ceil((targetMs - Date.now()) / 1000));
      setRemaining(left);
      if (left > 0) frame.current = window.setTimeout(tick, 250);
    };
    tick();
    return () => window.clearTimeout(frame.current);
  }, [targetMs]);

  return remaining;
}