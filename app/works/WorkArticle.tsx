"use client";

// 作品详情页外壳（客户端）：返回链接 + 中英切换 + 标题区 + 正文。
// 布局对应 cali-YANG 站详情页：大标题 → 日期 → 分割线 → 类型行 → 正文。

import Link from "next/link";
import { useEffect } from "react";
import { WORKS } from "../site/content";
import { LanguageProvider, useLanguage } from "../site/language";
import type { YzsWork } from "../site/works-data";
import WorkBody from "./WorkBody";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function ArticleInner({ work }: { work: YzsWork }) {
  const { lang, toggleLang } = useLanguage();
  const zh = lang === "zh";
  // 封面横幅：与首页卡片缩略图同名的 view-transition-name，
  // 点击卡片时封面从网格原位放大飞入这里（共享元素 morph）
  const cover = WORKS.find((w) => w.slug === work.slug)?.cover;

  // 详情页是浅色页：覆盖 html 的深色背景（为首页暗场景准备的），
  // 否则 iOS/触控板橡皮筋回弹会在浅色页面外露出全黑画布。
  useEffect(() => {
    const previous = document.documentElement.style.backgroundColor;
    document.documentElement.style.backgroundColor = "#fafafa";
    return () => {
      document.documentElement.style.backgroundColor = previous;
    };
  }, []);

  return (
    <article className="work-article">
      <nav className="work-nav">
        <Link href="/#works" className="work-back">
          ← {zh ? "回到作品" : "Back to works"}
        </Link>
        <button type="button" className="lang-toggle" onClick={toggleLang}>
          {zh ? "EN" : "中文"}
        </button>
      </nav>

      {cover ? (
        <div
          className="work-hero"
          style={{ viewTransitionName: `work-${work.slug}` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${BASE_PATH}${cover}`} alt="" />
        </div>
      ) : null}

      <header className="work-header">
        <h1>{work.title}</h1>
        <p className="work-date">{work.date}</p>
        <div className="work-divider" />
        <p className="work-type-line">{work.description}</p>
      </header>

      <WorkBody work={work} />

      <footer className="work-footer">
        <Link href="/#works" className="work-back">
          ← {zh ? "回到作品" : "Back to works"}
        </Link>
      </footer>
    </article>
  );
}

export default function WorkArticle({ work }: { work: YzsWork }) {
  return (
    <LanguageProvider>
      <ArticleInner work={work} />
    </LanguageProvider>
  );
}
