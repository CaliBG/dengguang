#!/bin/sh
# 构建静态站点并推送到 gh-pages 分支（GitHub Pages 源）。
set -e
npm run pages:build
touch out/.nojekyll
cd out
rm -rf .git
git init -q -b gh-pages
# out/ 里的临时仓库继承不到外层配置，显式指定提交身份
git config user.name "Cali-Yang"
git config user.email "CaliBG@users.noreply.github.com"
git add -A
git commit -q -m "deploy"
git push -f https://github.com/CaliBG/dengguang.git gh-pages
cd ..
rm -rf out/.git
echo "deployed: https://calibg.github.io/dengguang/"
