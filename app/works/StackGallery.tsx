"use client";

// 叠放画廊 —— 移植自 cali-YANG 站（其本身忠实还原 caliyang.dpdns.org 的 stack gallery）：
// - 卡片 4:5 绝对定位堆叠（max-width 520px 居中），transform-origin: center bottom
// - 第 n 层（从顶数）rotate(n*4deg) scale(1-n*0.06)，仅顶部 4 张可见
// - 顶牌可拖拽（位移 + rotateX/rotateY 倾斜），超过 120px 甩到底部；点击也换牌
// - 3 秒自动轮播，悬停/拖拽暂停

import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "../site/language";

const SENSITIVITY = 120;
const AUTOPLAY_MS = 3000;
const CARD_TRANSITION =
  "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1)";

export default function StackGallery({
  images,
  alt,
  aspect = "4 / 5",
  maxWidth = 520,
}: {
  images: string[];
  alt: string;
  aspect?: string;
  maxWidth?: number;
}) {
  const { lang } = useLanguage();
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const total = images.length;

  // order：底→顶的卡片索引序列
  const [order, setOrder] = useState<number[]>(() => images.map((_, i) => i));
  const [hovering, setHovering] = useState(false);

  const drag = useRef({
    active: false,
    startX: 0,
    startY: 0,
    dx: 0,
    dy: 0,
    cardIdx: -1,
    // 触摸需要方向判定：纵向是页面滚动，横向才是拖牌
    isTouch: false,
    committed: false,
  });

  const transformFor = useCallback(
    (stackPos: number) => {
      const fromTop = total - 1 - stackPos;
      return `rotate(${fromTop * 4}deg) scale(${1 - fromTop * 0.06})`;
    },
    [total],
  );

  const sendTopToBack = useCallback(() => {
    setOrder((prev) => {
      const next = prev.slice();
      next.unshift(next.pop()!);
      return next;
    });
  }, []);

  // 自动轮播（悬停/拖拽/聚焦时暂停；reduced-motion 下完全关闭）
  useEffect(() => {
    if (hovering || total < 2) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(sendTopToBack, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [hovering, total, sendTopToBack]);

  // 拖拽（mouse + touch；move/up 挂 window）
  useEffect(() => {
    const getXY = (e: MouseEvent | TouchEvent) => {
      const t = (e as TouchEvent).touches?.[0];
      return t
        ? { x: t.clientX, y: t.clientY }
        : { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
    };

    const releaseCard = (restore: boolean) => {
      const d = drag.current;
      const el = cardRefs.current[d.cardIdx];
      if (el) {
        el.style.cursor = "";
        el.style.transition = CARD_TRANSITION;
        if (restore) el.style.transform = "rotate(0deg) scale(1)";
      }
      d.active = false;
      d.committed = false;
      d.cardIdx = -1;
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      const d = drag.current;
      if (!d.active) return;
      const { x, y } = getXY(e);
      d.dx = x - d.startX;
      d.dy = y - d.startY;

      // 触摸：先判定方向——纵向让给页面滚动（touch-action: pan-y 会接管并
      // 触发 touchcancel），明显横向才算拖牌；未判定前不动卡片。
      if (d.isTouch && !d.committed) {
        const slop = 12;
        if (Math.abs(d.dy) > slop && Math.abs(d.dy) > Math.abs(d.dx)) {
          releaseCard(true);
          setHovering(false);
          return;
        }
        if (Math.abs(d.dx) <= slop) return;
        d.committed = true;
      }

      const el = cardRefs.current[d.cardIdx];
      if (el) {
        el.style.transition = "none";
        el.style.transform = `translate(${d.dx}px, ${d.dy}px) rotateX(${
          (d.dy / 100) * -60
        }deg) rotateY(${(d.dx / 100) * 60}deg)`;
      }
    };

    const onUp = () => {
      const d = drag.current;
      if (!d.active) return;
      const wasTouch = d.isTouch;
      const committed = !d.isTouch || d.committed;
      // 触摸只按横向位移判定换牌，避免滚动手势误触发
      const shuffle =
        committed &&
        (d.isTouch
          ? Math.abs(d.dx) > SENSITIVITY
          : Math.abs(d.dx) > SENSITIVITY || Math.abs(d.dy) > SENSITIVITY);
      releaseCard(!shuffle);
      if (shuffle) sendTopToBack();
      // 触摸结束后恢复自动轮播（触摸设备没有 mouseleave）
      if (wasTouch) setHovering(false);
    };

    const onCancel = () => {
      const d = drag.current;
      if (!d.active) return;
      releaseCard(true);
      setHovering(false);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp);
    window.addEventListener("touchcancel", onCancel);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
      window.removeEventListener("touchcancel", onCancel);
    };
  }, [sendTopToBack]);

  const topIdx = order[order.length - 1];

  const onPointerDown =
    (idx: number) => (e: React.MouseEvent | React.TouchEvent) => {
      if (idx !== topIdx) return;
      const t = (e as React.TouchEvent).touches?.[0];
      const x = t ? t.clientX : (e as React.MouseEvent).clientX;
      const y = t ? t.clientY : (e as React.MouseEvent).clientY;
      drag.current = {
        active: true,
        startX: x,
        startY: y,
        dx: 0,
        dy: 0,
        cardIdx: idx,
        isTouch: Boolean(t),
        committed: false,
      };
      const el = cardRefs.current[idx];
      if (el && !t) el.style.cursor = "grabbing";
      setHovering(true);
    };

  const onClick = (idx: number) => () => {
    const d = drag.current;
    if (Math.abs(d.dx) > 5 || Math.abs(d.dy) > 5) return;
    if (idx === topIdx) sendTopToBack();
  };

  if (total === 0) return null;

  return (
    <div className="stack-clip">
      <div
        className="stack-stage"
        style={{ width: `min(${maxWidth}px, calc(100vw - 5rem))`, aspectRatio: aspect }}
        role="button"
        tabIndex={0}
        aria-label={
          lang === "zh"
            ? `${alt} 图片画廊，共 ${total} 张，按回车或右方向键换牌`
            : `${alt} gallery, ${total} images. Press Enter or Right Arrow to shuffle.`
        }
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") {
            e.preventDefault();
            sendTopToBack();
          }
        }}
        onFocus={() => setHovering(true)}
        onBlur={() => setHovering(false)}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {images.map((src, i) => {
          const stackPos = order.indexOf(i);
          return (
            <div
              key={src}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="stack-card"
              style={{
                zIndex: stackPos,
                transform: transformFor(stackPos),
                opacity: stackPos < total - 4 ? 0 : 1,
                transition: CARD_TRANSITION,
              }}
              onMouseDown={onPointerDown(i)}
              onTouchStart={onPointerDown(i)}
              onClick={onClick(i)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alt}
                draggable={false}
                loading={stackPos >= total - 4 ? "eager" : "lazy"}
              />
            </div>
          );
        })}
      </div>
      {total > 1 && (
        <p className="stack-caption">
          {lang === "zh"
            ? `拖拽或点击换牌 · ${total} 张`
            : `Drag or click to shuffle · ${total}`}
        </p>
      )}
    </div>
  );
}
