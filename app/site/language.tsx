"use client";

// 语言切换（作品详情页 中/英 双语，移植自 cali-YANG 站）
// - localStorage key "lang"（"en" | "zh"），dengguang 默认 "zh"
// - SSR 恒定 "zh"，挂载后读取本地偏好，避免 hydration mismatch

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Lang = "en" | "zh";

const STORAGE_KEY = "lang";

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("zh");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== "zh" && saved !== "en") return;
    // 延迟到下一帧再应用本地偏好：避免 effect 内同步 setState，
    // 同时保持 SSR 首帧恒定 "zh"、挂载后才切换的 hydration 安全策略。
    const frame = requestAnimationFrame(() => setLangState(saved));
    return () => cancelAnimationFrame(frame);
  }, []);

  const value = useMemo<LanguageContextValue>(() => {
    const setLang = (l: Lang) => {
      setLangState(l);
      try {
        localStorage.setItem(STORAGE_KEY, l);
      } catch {
        /* private mode 等场景忽略 */
      }
    };
    return {
      lang,
      setLang,
      toggleLang: () => setLang(lang === "en" ? "zh" : "en"),
    };
  }, [lang]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be inside LanguageProvider");
  return ctx;
}
