import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type PointerEvent,
  type ReactElement,
} from "react";
import { createPortal } from "react-dom";

interface SignPreviewProps {
  src: string;
  children: ReactElement;
}

const OPEN_DELAY = 200;
const CARD_SIZE = 220;
const GAP = 8;
const EDGE_MARGIN = 8;

export default function SignPreview({ src, children }: SignPreviewProps) {
  const anchorRef = useRef<HTMLElement | null>(null);
  const openTimer = useRef<number | undefined>(undefined);
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const computePosition = useCallback(() => {
    const el = anchorRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();

    let top = rect.bottom + GAP;
    if (top + CARD_SIZE > window.innerHeight - EDGE_MARGIN) {
      const aboveTop = rect.top - GAP - CARD_SIZE;
      if (aboveTop >= EDGE_MARGIN) top = aboveTop;
    }

    let left = rect.left + rect.width / 2 - CARD_SIZE / 2;
    left = Math.max(EDGE_MARGIN, Math.min(left, window.innerWidth - CARD_SIZE - EDGE_MARGIN));

    setPos({ top, left });
  }, []);

  const scheduleOpen = useCallback(() => {
    window.clearTimeout(openTimer.current);
    openTimer.current = window.setTimeout(() => {
      computePosition();
      setVisible(true);
    }, OPEN_DELAY);
  }, [computePosition]);

  const close = useCallback(() => {
    window.clearTimeout(openTimer.current);
    setVisible(false);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const onReposition = () => computePosition();
    window.addEventListener("scroll", onReposition, true);
    window.addEventListener("resize", onReposition);
    return () => {
      window.removeEventListener("scroll", onReposition, true);
      window.removeEventListener("resize", onReposition);
    };
  }, [visible, computePosition]);

  useEffect(() => () => window.clearTimeout(openTimer.current), []);

  if (!isValidElement(children)) return children;

  const child = children as ReactElement<Record<string, unknown>>;
  const childRef = (child as unknown as { ref?: unknown }).ref;

  const setRefs = (node: HTMLElement | null) => {
    anchorRef.current = node;
    if (typeof childRef === "function") childRef(node);
    else if (childRef && typeof childRef === "object") (childRef as { current: HTMLElement | null }).current = node;
  };

  const triggerProps = {
    ref: setRefs,
    onPointerEnter: (e: PointerEvent) => {
      (child.props.onPointerEnter as ((e: PointerEvent) => void) | undefined)?.(e);
      if (e.pointerType === "mouse") scheduleOpen();
    },
    onPointerLeave: (e: PointerEvent) => {
      (child.props.onPointerLeave as ((e: PointerEvent) => void) | undefined)?.(e);
      close();
    },
    onFocus: (e: FocusEvent) => {
      (child.props.onFocus as ((e: FocusEvent) => void) | undefined)?.(e);
      scheduleOpen();
    },
    onBlur: (e: FocusEvent) => {
      (child.props.onBlur as ((e: FocusEvent) => void) | undefined)?.(e);
      close();
    },
  };

  return (
    <>
      {cloneElement(child, triggerProps)}
      {visible &&
        createPortal(
          <div className="sign-preview-card" style={{ top: pos.top, left: pos.left }}>
            <video src={src} autoPlay muted loop playsInline preload="none" />
          </div>,
          document.body
        )}
    </>
  );
}