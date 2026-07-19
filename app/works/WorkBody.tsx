"use client";

// 作品详情正文渲染器（移植自 cali-YANG 站 YzsWorkBody，9 个作品共用）
// 结构：导语（双语切换）→ 信息块（材料/类型/团队/灵感）→ 金句 → 图片 → 视频 → 演示链接
// 视频排版：onLoadedMetadata 检测宽高比——竖屏限高居中，横屏才全宽。

import { useState } from "react";
import { useLanguage } from "../site/language";
import type { BiText, YzsWork } from "../site/works-data";
import StackGallery from "./StackGallery";
import WorkImage from "./WorkImage";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const asset = (path: string) => `${BASE_PATH}${path}`;

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="meta-row">
      <span className="meta-label">{label}</span>
      <span className="meta-value">{value}</span>
    </div>
  );
}

function VideoFigure({ src, caption }: { src: string; caption?: string }) {
  const [ratio, setRatio] = useState<{ w: number; h: number } | null>(null);
  const portrait = ratio ? ratio.h > ratio.w : false;

  return (
    <figure className="work-video">
      <video
        src={src}
        controls
        playsInline
        preload="metadata"
        onLoadedMetadata={(e) =>
          setRatio({
            w: e.currentTarget.videoWidth,
            h: e.currentTarget.videoHeight,
          })
        }
        style={ratio ? { aspectRatio: `${ratio.w} / ${ratio.h}` } : undefined}
        className={portrait ? "is-portrait" : "is-landscape"}
      />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

export default function WorkBody({ work }: { work: YzsWork }) {
  const { lang } = useLanguage();
  const zh = lang === "zh";
  const pick = (t: BiText) => (zh ? t.zh : t.en);

  return (
    <>
      <div className="work-lede">
        {(zh ? work.intro.zh : work.intro.en).map((p, i) => (
          <p key={`${lang}-${i}`}>{p}</p>
        ))}
      </div>

      <div className="work-meta-block">
        <MetaRow label={zh ? "材料" : "Material"} value={pick(work.material)} />
        {work.type && <MetaRow label={zh ? "类型" : "Type"} value={pick(work.type)} />}
        {work.team && <MetaRow label={zh ? "团队" : "Team"} value={pick(work.team)} />}
        {work.inspiration && (
          <MetaRow label={zh ? "灵感" : "Inspired by"} value={pick(work.inspiration)} />
        )}
      </div>

      <blockquote className="work-quote">
        {pick(work.quote).replace(/ —/g, " —")}
      </blockquote>

      {work.images.length > 1 ? (
        <StackGallery
          images={work.images.map((src) => asset(src))}
          alt={work.title}
          aspect={work.galleryAspect}
          maxWidth={work.galleryMaxWidth}
        />
      ) : work.images.length === 1 ? (
        <WorkImage src={asset(work.images[0])} alt={work.title} />
      ) : null}

      {work.videos && work.videos.length > 0 && (
        <div className={`work-videos${work.videos.length > 1 ? " is-pair" : ""}`}>
          {work.videos.map((v) => (
            <VideoFigure
              key={v.src}
              src={asset(v.src)}
              caption={v.caption ? pick(v.caption) : undefined}
            />
          ))}
        </div>
      )}

      {work.demoLink && (
        <a
          href={asset(work.demoLink.href)}
          target="_blank"
          rel="noopener noreferrer"
          className="work-demo-link"
        >
          {pick(work.demoLink.label)} ↗
        </a>
      )}
    </>
  );
}
