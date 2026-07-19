"use client";

// 作品详情页外壳（客户端）：返回链接 + 中英切换 + 标题区 + 正文。
// 布局对应 cali-YANG 站详情页：大标题 → 日期 → 分割线 → 类型行 → 正文。

import Link from "next/link";
import { LanguageProvider, useLanguage } from "../site/language";
import type { YzsWork } from "../site/works-data";
import WorkBody from "./WorkBody";

function ArticleInner({ work }: { work: YzsWork }) {
  const { lang, toggleLang } = useLanguage();
  const zh = lang === "zh";

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
