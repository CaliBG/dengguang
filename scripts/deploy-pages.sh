#!/bin/sh
# 构建静态站点并推送到 gh-pages 分支（GitHub Pages 源）。
set -e
npm run pages:build
touch out/.nojekyll
cd out
rm -rf .git
git init -q -b gh-pages
git add -A
git commit -q -m "deploy"
git push -f https://github.com/CaliBG/dengguang.git gh-pages
cd ..
rm -rf out/.git
echo "deployed: https://calibg.github.io/dengguang/"
