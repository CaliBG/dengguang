"use client";

export function BackToTop() {
  return (
    <button
      type="button"
      className="back-to-top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      回到灯下，让屋子暗下来 <span>↑</span>
    </button>
  );
}
