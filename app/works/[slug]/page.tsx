// 作品详情页动态路由：slug 对应 app/site/works-data.ts 的 9 个作品，
// 静态导出为 /works/<slug>/。

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { YZS_WORKS } from "../../site/works-data";
import WorkArticle from "../WorkArticle";

export const dynamicParams = false;

export function generateStaticParams() {
  return YZS_WORKS.map((work) => ({ slug: work.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const work = YZS_WORKS.find((w) => w.slug === slug);
  return work ? { title: work.title, description: work.description } : {};
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = YZS_WORKS.find((w) => w.slug === slug);
  if (!work) notFound();

  return (
    <main className="work-page">
      <WorkArticle work={work} />
    </main>
  );
}
