"use client";

// 单图 + 共享元素灯箱（移植自 cali-YANG 站 MdxImg 的 FLIP 缩放，
// 背景取色简化为固定深色遮罩）。点击放大，Escape / 点击遮罩关闭。

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";

const ZOOM_TRANSITION_MS = 300;

function computeInitialTransform(thumb: HTMLImageElement): string | null {
  const natW = thumb.naturalWidth;
  const natH = thumb.naturalHeight;
  if (!natW || !natH) return null;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const scale = Math.min(1, (0.92 * vw) / natW, (0.92 * vh) / natH);
  const displayW = natW * scale;
  const rect = thumb.getBoundingClientRect();
  const dx = rect.left + rect.width / 2 - vw / 2;
  const dy = rect.top + rect.height / 2 - vh / 2;
  const s = rect.width / displayW;
  return `translate(${dx}px, ${dy}px) scale(${s})`;
}

export default function WorkImage({ src, alt = "" }: { src: string; alt?: string }) {
  const thumbRef = useRef<HTMLImageElement | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [open, setOpen] = useState(false);
  const [entered, setEntered] = useState(false);
  const [initialTransform, setInitialTransform] = useState<string | null>(null);

  const handleOpen = useCallback(() => {
    const img = thumbRef.current;
    if (!img || !img.complete) return;
    const t = computeInitialTransform(img);
    if (!t) return;
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setInitialTransform(t);
    setEntered(false);
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    const img = thumbRef.current;
    if (img) {
      const t = computeInitialTransform(img);
      if (t) setInitialTransform(t);
    }
    setEntered(false);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setOpen(false), ZOOM_TRANSITION_MS);
  }, []);

  useEffect(() => {
    if (!open || entered) return;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setEntered(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [open, entered]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, handleClose]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const overlayStyle: CSSProperties = {
    opacity: entered ? 1 : 0,
  };

  const zoomImgStyle: CSSProperties = {
    transform: entered ? "translate(0px, 0px) scale(1)" : (initialTransform ?? undefined),
    transition: `transform ${ZOOM_TRANSITION_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
    willChange: "transform",
  };

  return (
    <span className="work-figure">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={thumbRef}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="work-figure-thumb"
        style={{ opacity: open ? 0 : 1 }}
        onClick={handleOpen}
      />
      {open
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              className="work-lightbox"
              style={overlayStyle}
              onClick={handleClose}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={alt} decoding="async" style={zoomImgStyle} />
            </div>,
            document.body,
          )
        : null}
    </span>
  );
}
