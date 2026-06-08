# Portfolio_BTW

基于 Vite、React、Three.js 和 GSAP 构建的个人作品集网站。

## 本地运行

需要先安装 Node.js。

```powershell
npm install
npm run dev
```

默认本地访问地址：

```text
http://localhost:3000/
```

## 构建

```powershell
npm run typecheck
npm run build
```

构建产物会生成到：

```text
dist/
```

## 本地预览构建产物

```powershell
npm run preview
```

## GitHub Pages 部署

当前项目按 GitHub Pages 项目页配置，仓库地址：

```text
https://github.com/LKC218/Portfolio_BTW.git
```

公网访问地址预计为：

```text
https://lkc218.github.io/Portfolio_BTW/
```

部署方式：

1. 推送代码到 `main` 分支。
2. GitHub Actions 自动执行 `npm ci` 和 `npm run build`。
3. 自动发布 `dist/` 到 GitHub Pages。

GitHub 仓库需要在：

```text
Settings → Pages
```

将 Source 设置为：

```text
GitHub Actions
```

## 环境变量安全

不要将真实 `.env`、`.env.local` 或任何 API Key 提交到仓库。

当前 `.gitignore` 已忽略环境变量文件。
