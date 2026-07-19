import Link from "next/link";
import { MorsLightExperience } from "./MorsLightExperience";
import { BackToTop } from "./site/BackToTop";
import { WORKS } from "./site/content";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function Home() {
  return (
    <main>
      <div className="hero-zone">
        <MorsLightExperience />
      </div>

      <div className="site-sections">
        <section className="site-section" id="works" aria-labelledby="works-title">
          <p className="section-kicker">02 / 作品</p>
          <h2 id="works-title">灯亮了，看看作品。</h2>
          <p className="section-note">
            装置、可穿戴、交互与品牌——从暗室到亮场，这些是灯下的作品。
          </p>
          <div className="works-grid">
            {WORKS.map((work) => {
              const card = (
                <>
                  <div className="work-thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${BASE_PATH}${work.cover}`} alt={work.title} loading="lazy" />
                  </div>
                  <h3>{work.title}</h3>
                  <p className="work-meta">
                    {work.category} · {work.year}
                  </p>
                  <p className="work-desc">{work.description}</p>
                </>
              );
              return work.slug ? (
                <Link
                  key={work.id}
                  href={`/works/${work.slug}`}
                  className="work-card is-linked"
                >
                  {card}
                </Link>
              ) : (
                <article key={work.id} className="work-card">
                  {card}
                </article>
              );
            })}
          </div>
        </section>

        <section className="site-section" id="about" aria-labelledby="about-title">
          <p className="section-kicker">03 / 关于</p>
          <h2 id="about-title">杨子硕</h2>
          <p className="about-text">
            这里将是一段关于我的介绍——正在整理中。作品上传后，这个框架里的占位内容会逐步替换为真实的项目、简历与联系方式。
          </p>
          <p className="about-links">
            <a href="https://github.com/CaliBG" target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
          </p>
        </section>

        <footer className="site-footer">
          <BackToTop />
          <p className="footer-credit">
            灯光交互基于开源项目{" "}
            <a
              href="https://github.com/jinruozai/HTML-Light-Demo"
              target="_blank"
              rel="noreferrer"
            >
              HTML Light Demo
            </a>{" "}
            （MIT License），原创概念来自{" "}
            <a href="https://x.com/kaolti" target="_blank" rel="noreferrer">
              @kaolti
            </a>
            。
          </p>
          <p className="footer-copy">杨子硕 © 2026</p>
        </footer>
      </div>
    </main>
  );
}
