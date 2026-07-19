import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the portfolio light experience shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>杨子硕 — 作品集<\/title>/i);
  assert.match(html, /灯光交互首页/);
  assert.match(html, /光亮起的地方/);
  assert.match(html, /向下滚动/);
  assert.match(html, /作品陆续上传中/);
  assert.match(html, /灯亮了，看看作品。/);
  assert.match(html, /43\+1 — 力量与平衡/);
  assert.match(html, /皮囊记忆/);
  assert.match(html, /works\/work01\.jpg/);
});

test("keeps the light, controls, and simulation in the shipped source", async () => {
  const [experience, canvas, surface, compatibility, page, layout, packageJson, worker] = await Promise.all([
    readFile(new URL("../app/MorsLightExperience.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/light/MorsLightCanvas.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/light/MorsPageSurface.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/light/three-html-compatibility.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../worker/index.ts", import.meta.url), "utf8"),
  ]);

  assert.match(experience, /dynamic\(/);
  assert.match(experience, /ssr: false/);
  assert.match(experience, /loading: MorsLightLoading/);
  assert.doesNotMatch(experience, /from "three"/);
  assert.match(canvas, /new THREE\.HTMLTexture/);
  assert.match(compatibility, /function installThreeHtmlTextureCompatibility/);
  assert.match(compatibility, /value: function texElementImage2D\(/);
  assert.match(canvas, /new THREE\.HemisphereLight/);
  assert.match(canvas, /new THREE\.DirectionalLight/);
  assert.match(canvas, /new THREE\.SpotLight/);
  assert.doesNotMatch(canvas, /ConeGeometry/);
  assert.match(canvas, /event\.button === 2/);
  assert.match(canvas, /Math\.round\(beamStartAngle \+ movementX \* 0\.14\)/);
  assert.match(canvas, /shouldCycleColor/);
  assert.match(canvas, /contextmenu/);
  assert.match(canvas, /const BASE_LIGHT_DIRECTION = DOWN\.clone\(\)/);
  assert.match(canvas, /const cameraDrop = portrait/);
  assert.match(canvas, /const upwardTarget = portrait/);
  assert.match(canvas, /const fixedStep = 1 \/ 120/);
  assert.match(canvas, /function updatePointerTarget/);
  assert.match(canvas, /pullStrength/);
  assert.match(canvas, /intersectPlane/);
  assert.doesNotMatch(canvas, /isInteractiveTarget/);
  assert.doesNotMatch(canvas, /event\.preventDefault\(\)/);
  assert.match(canvas, /width < 760 \? 1\.25 : 1\.5/);
  assert.match(canvas, /function updateScrollIllumination/);
  assert.match(canvas, /hero-zone/);
  assert.match(canvas, /scrollIllumRef/);
  assert.match(canvas, /flood-overlay/);
  assert.match(surface, />BEAM</);
  assert.match(surface, /BRIGHTNESS/);
  assert.match(surface, />COLOR</);
  assert.match(surface, /function MorsLightPreview/);
  assert.match(page, /<MorsLightExperience \/>/);
  assert.match(page, /hero-zone/);
  assert.match(layout, /杨子硕/);
  assert.match(layout, /og\.jpg/);
  assert.match(packageJson, /"three-html-render"/);
  assert.doesNotMatch(packageJson, /tailwindcss/);
  assert.doesNotMatch(worker, /image-optimization/);
});

test("keeps the GitHub Pages static deployment configured", async () => {
  const [nextConfig, packageJson, deployScript, readme, surface] = await Promise.all([
    readFile(new URL("../next.config.ts", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../scripts/deploy-pages.sh", import.meta.url), "utf8"),
    readFile(new URL("../README.md", import.meta.url), "utf8"),
    readFile(new URL("../app/light/MorsPageSurface.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(nextConfig, /output: "export"/);
  assert.match(nextConfig, /basePath/);
  assert.match(surface, /NEXT_PUBLIC_BASE_PATH/);
  assert.match(packageJson, /"deploy": "sh scripts\/deploy-pages\.sh"/);
  assert.match(deployScript, /pages:build/);
  assert.match(deployScript, /nojekyll/);
  assert.match(deployScript, /gh-pages/);
  assert.match(readme, /https:\/\/calibg\.github\.io\/dengguang\//);
});
