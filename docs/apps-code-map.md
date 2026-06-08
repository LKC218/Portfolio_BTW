# 项目文档导航

## 文档目录

### 1. 项目开发经验
- **路径**: `docs/项目开发经验/项目开发经验.md`
- **内容**: 项目架构设计、组件开发经验、样式系统、AI 集成、性能优化、GSAP 动画经验沉淀等
- **最后更新**: 2026-06-02（v1.4 移除主题色切换功能）

### 2. 功能更新记录
- **路径**: `docs/功能更新记录-260603.md`
- **内容**: 2026-05-28 / 2026-06-01 / 2026-06-02 / 2026-06-03 的功能更新详细记录，以及 2026-06-07 当前状态勘误
- **主要变更**:
  - 音频播放器重构
  - 首页 Hero 区域与 HeroSection 拆分
  - 场景查看器优化
  - 数据结构更新
  - 3D 模型查看器与全屏弹窗
  - 端口优化与环境变量
  - 首页顶栏 GSAP 动效重构
  - 斜切标语 3D 交互
  - SceneViewer 侧边栏可中断 enter/exit
  - 3D 模型查看器统一化
  - Hero 图片轮播 + 点阵噪声 ASCII 字符扰动
  - HUD 文本 hover scramble 效果
  - ScrollVideo 滚动驱动视频组件
  - HotspotPreview 热点悬停预览卡片
  - Gallery 标题共享元素回首页转场

### 3. 3D 模型查看器功能实现
- **路径**: `docs/3D模型查看器-功能实现-260601.md`
- **内容**: 3D 模型查看器的完整功能架构、组件设计、交互流程
- **当前口径**: DetailCard 浮动卡片显示 `detailImage` 缩略图；展开态始终渲染 ModelViewer。`modelUrl` 有效时加载 GLTF；无效或不存在时显示十二面体占位模型。移动端展开态与独立全屏态为 3D 视口设置 `dvh` 最小高度，避免 Canvas 在移动端 flex 布局中高度塌陷。

### 4. UI 框架 Map
- **路径**: `docs/UI框架Map.md`
- **内容**: 前端 UI 结构化导航，全局层级架构、页面级/组件级 UI 元素拆解、视觉特征反查索引
- **适用场景**: 快速定位界面元素对应的组件名与文件路径，支持人工查阅和 AI 上下文注入

### 5. 颜色语言文档
- **路径**: `docs/颜色语言文档-260608.md`
- **内容**: 当前页面颜色语言、基础色板、强调色板、动态场景色、环境光、预加载独立色板、交互用色规则与代码落点
- **适用场景**: 后续新增 UI 模块、调整主题氛围、统一强调色语义、检查硬编码颜色时参考

### 6. 已实现的方案
- **路径**: `docs/已实现的方案/字体乱码解码与点阵字符扰动方案-260603.md`
- **内容**: 首页字体乱码解码、CTA 标语 scramble、白点点阵 ASCII 字符扰动的实现参数、复用步骤和注意事项
- **适用场景**: 后续复用终端风格字体动效、HUD 小字 hover 解码、低透明点阵字符扰动

---

## 项目结构概览

```text
Portfolio_BTW/
├── docs/                          # 文档目录
│   ├── apps-code-map.md           # 本文档 - 项目文档导航
│   ├── UI框架Map.md               # UI 框架结构化导航
│   ├── 颜色语言文档-260608.md      # 当前页面颜色语言、色板与用色规则
│   ├── 功能更新记录-260603.md      # 功能更新记录与当前状态勘误
│   ├── 3D模型查看器-功能实现-260601.md
│   ├── 已实现的方案/
│   │   └── 字体乱码解码与点阵字符扰动方案-260603.md
│   └── 项目开发经验/
│       └── 项目开发经验.md
├── public/
│   └── assets/
│       ├── BTW/                   # BTW 系列资源
│       ├── audio/                 # 背景音乐
│       ├── scene_01/              # 场景图片
│       ├── Video/                 # 视频资源（font-distortion.mp4 等）
│       └── *.png, *.jpg           # 占位图、首页大图等
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AudioPlayer.tsx
│   │   │   ├── CustomCursor.tsx
│   │   │   ├── GridOverlay.tsx
│   │   │   └── Preloader.tsx
│   │   ├── pages/
│   │   │   ├── Gallery.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── HomeSelection.tsx
│   │   │   ├── HotspotPreview.tsx
│   │   │   └── SceneViewer.tsx
│   │   └── ui/
│   │       ├── DetailCard.tsx
│   │       ├── FullscreenModelViewer.tsx
│   │       ├── ModelViewer.tsx
│   │       ├── RollingClock.tsx
│   │       └── ScrollVideo.tsx
│   ├── hooks/
│   │   ├── useDeviceState.ts
│   │   └── useMouseEffects.ts
│   ├── App.tsx
│   ├── constants.ts
│   ├── index.tsx
│   ├── types.ts
│   └── vite-env.d.ts
├── 图片/                          # 本地图片素材目录
├── 音乐/                          # 本地音乐素材目录
├── .gitignore
├── README.md
├── index.html
├── metadata.json
├── package.json                    # scripts 与依赖配置
├── tsconfig.json
├── vite.config.ts
└── 启动.bat                       # 检查 Node、自动安装依赖并启动开发服务器
```

> 环境文件说明：项目支持 `.env` / `.env.local` 等 Vite 环境文件，但当前仓库未提供 `.env`，也未提供 `.env.example`。

---

## 环境配置与启动

### 1. 环境变量
- **支持文件**: `.env`、`.env.local`、`.env.[mode]` 等 Vite 支持的环境文件。
- **当前仓库状态**: 未提供 `.env` / `.env.example`。
- **配置项**:
  - `PORT`: Vite 开发服务器端口，默认 `3000`。

### 2. Vite 配置 (`vite.config.ts`)
- `base: '/Portfolio_BTW/'`，用于适配 GitHub Pages / 子路径部署。
- `server.port` 读取 `PORT`，未配置时默认 `3000`；`host: '0.0.0.0'`；`open: true`。
- `build.rollupOptions.output.manualChunks` 拆分 `vendor-three` 与 `vendor-gsap`。
- 资源路径通过 `assetPath()` / `import.meta.env.BASE_URL` 适配部署路径，避免硬编码根路径在子目录部署失效。

### 3. 启动脚本 (`启动.bat`)
- 启动前检查 Node.js 是否存在。
- 缺少 `node_modules` 时自动执行 `npm install`。
- 默认执行 `npm run dev`。
- 可传端口参数：`启动.bat 3001` 会执行 `npm run dev -- --port 3001`。

### 4. package scripts

| 脚本 | 命令 | 用途 |
|---|---|---|
| `dev` | `vite` | 启动开发服务器 |
| `start` | `vite` | 启动开发服务器别名 |
| `build` | `vite build` | 生产构建 |
| `typecheck` | `tsc --noEmit` | TypeScript 类型检查 |
| `preview` | `vite preview` | 预览构建产物 |

### 5. 主要依赖
- React 19 / React DOM 19
- Vite 6 / TypeScript
- GSAP / @gsap/react
- Three.js / @react-three/fiber / @react-three/drei
- lucide-react

---

## 核心模块说明

### 1. 首屏加载器 (`Preloader.tsx`)
- **功能**: 首次打开时阻塞首页进入，等待关键图片与字体资源完成，显示 `PORTFOLIO` 品牌开场动画。
- **计时策略**: `MIN_VISIBLE_MS = 3200`、`MAX_BLOCKING_MS = 12000`，以 `performance.now()` 计算真实耗时，避免累计计时误差。
- **预加载范围**: `assets` 全量预加载，`displayAssets = assets.slice(0, 4)` 仅用于展示中心海报堆叠。
- **当前 `PRELOAD_ASSETS`**:
  1. `assets/BTW/BTW_Scenes_总页.jpg`
  2. `assets/BTW/BTW_Scenes_3_卡片页.jpg`
  3. `assets/BTW/BTW_Scenes_2_卡片页.jpg`
  4. `assets/BTW/BTW_Scenes_1_卡片页.jpg`
  5. `assets/首页大图.jpg`
  6. `assets/首页大图2.jpg`
  7. `assets/首页大图3.jpg`
- **特性**: 混合进度、失败资源计入完成、字体等待、红白纸片背板、BTW 总页与 3/2/1 卡片页中心堆叠、标题字符随机揭示、三位数字进度、`clip-path` 幕布退场、减少动画偏好适配。

### 2. 主应用 (`App.tsx`)
- **状态**: `isPreloaderComplete`、`appState`、`selectedCollection`、`selectedScene`、`hoveredColor`、`activeHotspot`、`transitionStatus`、`transitionColor`、`isSharedTitleTransitioning`、`sharedTitleCloneRef`。
- **页面状态**: `HOME` / `GALLERY` / `VIEWER`。
- **普通转场**: `navigate` 控制三层 `TransitionOverlay`，前景层、强调色层、背景层按不同延迟滑入/滑出。
- **函数状态**: `navigate` 本身仍为普通函数；部分事件处理器使用 `useCallback` 包装。
- **共享标题转场**: Gallery 的左上作品集标题或卡片标题触发入口，App 克隆标题元素，使用 GSAP 执行放大移动、缩小收回、Gallery 淡出并切回 HOME。

### 3. 首页选择 (`HomeSelection.tsx`)
- **职责**: 直接依赖 `useDeviceState`，管理全屏状态、窗口滚动、作品集分组、作品集卡片网格，并集成 `HeroSection` 与 `ScrollVideo`。
- **注意**: 当前组件不直接依赖 GSAP；动画主要由 `HeroSection`、`ScrollVideo`、`Gallery` 等子组件承担。
- **移动端**: 区分竖屏/横屏，横屏压缩卡片高度与间距，触摸端入口信息不依赖 hover。

### 4. 首页 Hero 区域 (`HeroSection.tsx`)
- **功能**: 首页顶部 Hero 区域，包含大图轮播、顶栏、滚动翻页时钟、斜切标语、点阵噪声、HUD 文本 scramble。
- **资源路径**: Hero 图片通过 `assetPath()` / `import.meta.env.BASE_URL` 适配 `base='/Portfolio_BTW/'`。
- **特性**: GSAP 入场动画、SplitText 字符 stagger、轮播首尾重复无缝循环、ASCII 点阵噪声、HUD 文本 hover scramble。
- **依赖**: `gsap`、`@gsap/react`、`gsap/SplitText`、`useDeviceState`、`RollingClock`。

### 5. 画廊页面 (`Gallery.tsx`)
- **功能**: 作品集下的场景卡片列表与返回入口。
- **特性**: 场景卡片横向弹性伸缩、clip-path 入场、标题共享元素回 HOME 转场入口。
- **依赖**: `gsap`、`@gsap/react`、`useDeviceState`。

### 6. 场景查看器 (`SceneViewer.tsx`)
- **功能**: 场景详情展示与热区交互。
- **侧边栏**:
  - 桌面端宽度 `60px ↔ 320px`。
  - 移动竖屏宽度 `100%`。
  - 移动横屏宽度约 `60% ~ 62%`（当前初始化为 `62%`）。
- **动画**: GSAP 单 Timeline + `addPause()` 实现可中断 enter/exit；移动端使用 `xPercent` 抽屉；遵守 `prefers-reduced-motion`。
- **集成**: `DetailCard`、`HotspotPreview`。

### 7. 热点悬停预览 (`HotspotPreview.tsx`)
- **功能**: SceneViewer 桌面端热点悬停时显示详情预览卡片。
- **特性**: `requestAnimationFrame` + LERP 0.14 平滑跟随、视口边界限制、基于水平速度的 ±6° 旋转、clip-path + opacity 展示/隐藏。

### 8. 滚动驱动视频 (`ScrollVideo.tsx`)
- **功能**: GSAP ScrollTrigger 驱动的视频展示组件。
- **播放策略**: `canplay` 后调用 `video.play().catch(() => {})`；`loop` / `muted` 由程序设置；JSX 设置 `preload="auto"`、`muted`、`playsInline`。
- **可见性控制**: `IntersectionObserver` 入屏播放、离屏暂停；ready 状态通过 ref 给观察器读取，避免闭包持有过期状态。
- **位置**: HomeSelection 第一组卡片下方。

### 9. 详情卡片 (`DetailCard.tsx`)
- **当前最终形态**:
  - 浮动卡片态显示 `detailImage` 缩略图。
  - 点击缩略图进入展开态。
  - 展开态始终渲染 `ModelViewer`。
  - `modelUrl` 有效时加载 GLTF；无效或不存在时显示十二面体占位模型。
- **不再使用旧口径**: 不再描述为“展开态图片/3D 双模式”。
- **依赖**: `ModelViewer`、`FullscreenModelViewer`。

### 10. 3D 模型查看器 (`ModelViewer.tsx`)
- **功能**: 基于 Three.js / R3F 的 3D 模型查看器。
- **模型解析**: `useResolvedModelUrl` 通过 HEAD 请求验证 `modelUrl`，拒绝 `text/html` 响应；有效时加载 GLTF，无效或为空时渲染占位模型。
- **占位模型**: 十二面体 + MeshDistortMaterial + 线框外壳 + 内外环光。
- **交互**: OrbitControls 旋转/缩放，禁止平移，距离 `3-12`。
- **移动端尺寸**: 根容器保持 `w-full h-full min-h-0 overflow-hidden`，由外层展开态或全屏态提供稳定高度，避免 Canvas 高度塌陷。

### 11. 全屏 3D 模型弹窗 (`FullscreenModelViewer.tsx`)
- **功能**: 独立全屏 3D 模型查看器。
- **布局**:
  - 桌面端左右分栏，信息面板宽 `340px`。
  - 移动横屏信息面板宽 `38%`。
  - 普通移动端信息面板 `max-h-[55vh]`，顶部拖拽手柄。
  - 普通移动端 3D 视口使用 `42dvh ~ 50dvh` 最小高度，适配移动浏览器动态视口。
- **操作指南**: 桌面显示“滚轮 → 缩放视图”；移动端切换为“双指捏合 → 缩放视图”。

### 12. 自定义光标 (`CustomCursor.tsx`)
- **功能**: 全局自定义光标，GSAP quickTo 平滑跟随鼠标。
- **特性**: idle / hover / pressed 三态；`prefers-reduced-motion` 与 `pointer: coarse` 自动禁用。
- **依赖**: `useMouseEffects`。

### 13. 滚动翻页时钟 (`RollingClock.tsx`)
- **功能**: 实时时钟显示，数字切换时带 GSAP 翻页动画。
- **位置**: HeroSection 区域右下角。

### 14. 设备状态检测 (`useDeviceState.ts`)
- **功能**: 检测 `desktop` / `mobile-portrait` / `mobile-landscape`。
- **判断逻辑**: `width < 768` 为移动端，`width < 1024 && height < 500` 为横版移动端。
- **事件**: 监听 `resize` + `orientationchange`。

### 15. 鼠标视差效果 (`useMouseEffects.ts`)
- **功能**: 归一化指针坐标 + `gsap.quickTo` 视差缓存。
- **强度**: `PARALLAX_STRENGTH` 为 `FAR=8`、`MID=15`、`NEAR=25`。
- **缓存**: 使用 `Map<gsap.TweenTarget, { xTo, yTo }>` 缓存 quickTo setter。
- **动画参数**: `duration = 0.45`，`ease = power3.out`。
- **导出**: `useMouseEffects()` 返回 `{ isSupported, pointer, parallaxTo }`。

### 16. 常量配置 (`constants.ts`)
- **职责**:
  - `assetPath`: 用 `import.meta.env.BASE_URL` 统一生成资源路径。
  - `ACCENT_COLORS`: 基础强调色常量。
  - `PLACEHOLDER_IMAGES`: 占位图资源。
  - `PRELOAD_ASSETS`: 首屏预加载资源。
  - `BGM_CONFIG`: 背景音乐配置。
  - `COLLECTIONS`: 作品集列表。
  - `SCENES_DB`: 场景静态数据。
  - `getScenesForCollection`: 根据作品集 ID 生成场景数据与热点数据。

---

## 文档更新规范

1. 新增、修改或重构功能模块后，必须同步更新本文档与就近模块说明文档。
2. 本文档只作为文件导航和文档更新落点，不写阶段记录、执行结果或任务完成说明。
3. 只有目录存在实际源码且职责稳定时，才新增独立说明文档。
4. 空目录、占位目录、未接入主线的目录，不单独建档。

---

## 更新日志

| 日期 | 文档 | 变更内容 |
|------|------|----------|
| 2026-06-07 | apps-code-map.md | 根据当前源码整理项目结构、环境配置、核心组件职责、依赖与当前实现口径 |
| 2026-06-03 | HeroSection.tsx, HotspotPreview.tsx, ScrollVideo.tsx, HomeSelection.tsx, SceneViewer.tsx, apps-code-map.md, UI框架Map.md, 功能更新记录-260603.md | Hero 区域拆分为独立组件；新增 Hero 图片轮播、点阵噪声 ASCII 扰动、HUD 文本 scramble；新增 HotspotPreview 热点悬停预览；新增 ScrollVideo 滚动驱动视频 |
| 2026-06-03 | 已实现的方案/字体乱码解码与点阵字符扰动方案-260603.md, apps-code-map.md | 新增首页字体乱码解码与点阵字符扰动复用方案文档 |
| 2026-06-02 | apps-code-map.md | 补充 CustomCursor、RollingClock、useDeviceState、useMouseEffects 条目 |
| 2026-06-02 | App.tsx | 事件处理器 `useCallback` 包装，减少子组件无效重渲染 |
| 2026-06-02 | ModelViewer.tsx | LoadedModel 对象复用：`Box3`/`Vector3` 计算移入 `useMemo` |
| 2026-06-02 | index.html, App.tsx, GridOverlay.tsx, DetailCard.tsx, FullscreenModelViewer.tsx | 内联 `@keyframes` 统一迁移到 `index.html`；App.tsx 转场 + CustomCursor 样式一并迁移 |
| 2026-06-02 | vite.config.ts | 构建优化：Three.js / GSAP 代码分割 `manualChunks` |
| 2026-06-02 | ThemeToggle.tsx（删除）, App.tsx, index.html, 5 个组件文件, UI框架Map.md, apps-code-map.md, 项目开发经验.md | 移除主题色切换功能，固定为暗色唯一主题 |
| 2026-06-02 | SceneViewer.tsx, apps-code-map.md, 3D模型查看器-功能实现-260601.md, 项目开发经验.md | SceneViewer 侧边栏重构为 GSAP 单 Timeline + `addPause()` 可中断 enter/exit |
| 2026-06-01 | HomeSelection.tsx, index.html, UI框架Map.md, apps-code-map.md | 首页顶栏升级为玻璃态 + 流动渐变 |
| 2026-06-01 | UI框架Map.md | 创建 UI 框架结构化导航文档 |
| 2026-06-01 | .env, 启动.bat, vite.config.ts | 端口优化，支持环境变量配置 |
| 2026-06-01 | apps-code-map.md | 新增 3D 模型查看器组件导航 |
| 2026-06-01 | 3D模型查看器-功能实现-260601.md | 创建 3D 模型查看器功能实现文档 |
| 2026-05-28 | apps-code-map.md | 创建项目文档导航 |
| 2026-05-28 | 功能更新记录-260528.md | 创建功能更新记录文档 |
| 2026-05-28 | 项目开发经验.md | 更新项目开发经验文档 |
