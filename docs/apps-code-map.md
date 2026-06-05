# 项目文档导航

## 文档目录

### 1. 项目开发经验
- **路径**: `docs/项目开发经验/项目开发经验.md`
- **内容**: 项目架构设计、组件开发经验、样式系统、AI集成、性能优化、GSAP 动画经验沉淀等
- **最后更新**: 2026-06-02（v1.4 移除主题色切换功能）

### 2. 功能更新记录
- **路径**: `docs/功能更新记录-260603.md`
- **内容**: 2026-05-28 / 2026-06-01 / 2026-06-02 / 2026-06-03 的功能更新详细记录
- **主要变更**: 
  - 音频播放器重构
  - 首页Hero区域
  - 场景查看器优化
  - 数据结构更新
  - 样式系统增强
  - 3D模型查看器与全屏弹窗
  - 端口优化与环境变量
  - 首页顶栏 GSAP 动效重构
  - 斜切标语 3D 交互
  - SceneViewer 侧边栏可中断 enter/exit
  - 3D 模型查看器统一化
  - Hero 区域拆分为独立 HeroSection 组件
  - Hero 图片轮播 + 点阵噪声 ASCII 字符扰动
  - HUD 文本 hover scramble 效果
  - ScrollVideo 滚动驱动视频组件
  - HotspotPreview 热点悬停预览卡片
  - Gallery 标题共享元素回首页转场

### 3. 3D模型查看器功能实现
- **路径**: `docs/3D模型查看器-功能实现-260601.md`
- **内容**: 3D模型查看器的完整功能架构、组件设计、交互流程
- **主要变更**:
  - Three.js 引擎集成
  - DetailCard 图片/3D 双模式
  - 全屏3D查看器弹窗
  - 堆叠上下文 Portal 修复
  - 按钮交互优化

### 4. UI框架Map
- **路径**: `docs/UI框架Map.md`
- **内容**: 前端UI结构化导航，全局层级架构、页面级/组件级UI元素拆解、视觉特征反查索引
- **适用场景**: 快速定位界面元素对应的组件名与文件路径，支持人工查阅和AI上下文注入

### 5. 已实现的方案
- **路径**: `docs/已实现的方案/字体乱码解码与点阵字符扰动方案-260603.md`
- **内容**: 首页字体乱码解码、CTA 标语 scramble、白点点阵 ASCII 字符扰动的实现参数、复用步骤和注意事项
- **适用场景**: 后续在其他页面复用终端风格字体动效、HUD 小字 hover 解码、低透明点阵字符扰动

---

## 项目结构概览

```
Portfolio_BTW/
├── docs/                          # 文档目录
│   ├── apps-code-map.md          # 本文档 - 项目文档导航
│   ├── UI框架Map.md             # UI框架结构化导航
│   ├── 功能更新记录-260603.md     # 功能更新记录（2026-05-28~06-03 累计）
│   ├── 3D模型查看器-功能实现-260601.md # 3D模型查看器功能实现
│   ├── 已实现的方案/              # 已沉淀可复用技术方案
│   │   └── 字体乱码解码与点阵字符扰动方案-260603.md
│   └── 项目开发经验/              # 项目开发经验文档
│       └── 项目开发经验.md
├── public/                        # 静态资源
│   └── assets/                   # 资源文件
│       ├── BTW/                  # BTW 系列资源（C-01 卡片封面与通道1场景图）
│       ├── audio/                # 音频文件
│       ├── scene_01/             # 场景图片
│       ├── Video/                # 视频资源（font-distortion.mp4 等）
│       └── *.png, *.jpg          # 占位符图片
├── src/                           # 源代码
│   ├── components/               # 组件
│   │   ├── layout/              # 布局组件
│   │   │   ├── AudioPlayer.tsx  # 音频播放器
│   │   │   ├── CustomCursor.tsx # 自定义光标（GSAP quickTo 跟随 + 交互态缩放）
│   │   │   └── GridOverlay.tsx  # 网格覆盖层
│   │   ├── pages/               # 页面组件
│   │   │   ├── Gallery.tsx      # 画廊页面
│   │   │   ├── HeroSection.tsx  # 首页 Hero 区域（轮播 + 点阵噪声 + 文本 scramble）
│   │   │   ├── HomeSelection.tsx # 首页选择（集成 HeroSection + ScrollVideo）
│   │   │   ├── HotspotPreview.tsx # 热点悬停预览卡片（桌面端鼠标跟随 + LERP）
│   │   │   └── SceneViewer.tsx  # 场景查看器
│   │   └── ui/                  # UI组件
│   │       ├── DetailCard.tsx   # 详情卡片（含3D/图片双模式）
│   │       ├── FullscreenModelViewer.tsx # 全屏3D模型弹窗
│   │       ├── ModelViewer.tsx  # 3D模型查看器
│   │       ├── RollingClock.tsx # 滚动翻页时钟（GSAP 数字切换动画）
│   │       └── ScrollVideo.tsx  # 滚动驱动视频（GSAP ScrollTrigger 缩放 + 离屏暂停）
│   ├── hooks/                   # 自定义 Hooks
│   │   ├── useDeviceState.ts   # 设备状态检测（desktop/mobile-portrait/mobile-landscape）
│   │   └── useMouseEffects.ts  # 鼠标视差效果 Hook（quickTo 缓存 + 归一化指针）
│   ├── services/                # 服务
│   │   └── geminiService.ts     # Gemini API服务
│   ├── App.tsx                  # 主应用组件
│   ├── constants.ts             # 常量配置
│   ├── index.tsx                # 入口文件
│   └── types.ts                 # 类型定义
├── 图片/                         # 图片资源
├── 音乐/                         # 音乐资源
├── .env                         # 环境变量配置（端口、API密钥等）
├── .gitignore                   # Git忽略文件
├── README.md                    # 项目说明
├── index.html                   # HTML入口
├── metadata.json                # 元数据
├── package.json                 # 依赖配置
├── tsconfig.json                # TypeScript配置
├── vite.config.ts               # Vite配置
└── 启动.bat                     # 启动脚本
```

---

## 环境配置与启动

### 1. 环境变量配置 (`.env`)
- **功能**: 配置开发服务器端口和API密钥
- **配置项**: `PORT`（默认3000）、`GEMINI_API_KEY`
- **使用**: 复制 `.env.example` 并填入实际值

### 2. 启动脚本 (`启动.bat`)
- **功能**: 启动开发服务器，支持自定义端口
- **用法**: 
  - 默认端口: `启动.bat`
  - 指定端口: `启动.bat 3001`

### 3. Vite配置 (`vite.config.ts`)
- **功能**: 读取环境变量配置开发服务器
- **特性**: 支持端口环境变量、自动打开浏览器

---

## 核心模块说明

### 1. 音频播放器 (`AudioPlayer.tsx`)
- **功能**: 背景音乐播放与控制
- **特性**: 隐藏功能、键盘快捷键、自动收起、错误处理、页面隐藏/离开时暂停并按用户暂停状态恢复
- **配置**: `constants.ts` 中的 `BGM_CONFIG`

### 2. 首页选择 (`HomeSelection.tsx`)
- **功能**: 作品集展示与选择，集成 HeroSection + ScrollVideo
- **特性**: 卡片网格、滚动视差、分组展示、滚动字幕分隔条
- **特性（移动端）**: 使用 `useDeviceState` 区分竖版/横版，压缩卡片高度和底部间距；触摸端卡片默认展示入口信息并提供 `active` 按压反馈，不依赖 hover；顶栏右侧显示全屏切换按钮，PC 端保留原状态文字区
- **依赖**: `HeroSection`、`ScrollVideo`

### 2.1 画廊页面 (`Gallery.tsx`)
- **功能**: 作品集下的场景卡片列表与返回入口
- **特性**: 左上角作品集标题与卡片标题可触发共享元素回首页转场，转场采用放大移动、缩小收回、淡出切 HOME 的三段式编排，由 `App.tsx` 统一控制
- **依赖**: `gsap`、`@gsap/react`、`useDeviceState`

### 3. 首页 Hero 区域 (`HeroSection.tsx`)
- **功能**: 首页顶部 Hero 区域，从 HomeSelection 拆分为独立组件
- **特性**: 大图轮播（多张首页大图无缝循环）、GSAP 入场动画（光晕→流光线→脉冲点→标签→标题→元数据）、SplitText 字符 stagger 入场
- **特性（顶栏）**: 玻璃态半透明 + 流动渐变（`bg-background/10` + `backdrop-blur-2xl` + `backdrop-saturate-150`；底层 `#CCFF00` 绿光晕 14s 横移 + 底部流光线 12s 横移）；标题/副标签/统计文字以 `[text-shadow:...]` 兜底可读性；脉冲点带 `drop-shadow-[...]` 绿色辉光；3D 倾斜 + 视差 + 悬停加速 2.5x
- **特性（斜切标语）**: `skewX -12` + `transformPerspective 600`，hover 时 scale 1.05 + letterSpacing 扩展 + 高光扫过 + 动态阴影跟随倾斜方向；鼠标移动叠加 `rotateX/Y`（max 15°）+ 文字反向补偿 skewX 12 + 系数 4 视差
- **特性（Hero 时钟）**: 右下角 `RollingClock` 使用 `clamp()` 响应式字号，外层 `max-w-full` + `overflow-hidden` 防止窄桌面视口下超大字号溢出并压到斜切标语
- **特性（点阵噪声）**: ASCII 字符网格覆盖层，hover 时活跃率从 2% 提升到 5%，180ms 刷新；`#CCFF00` 15% 概率高亮
- **特性（HUD 文本 scramble）**: hover 时触发文本乱码解码动画（`playTextScramble`，520ms），逐步从随机字符过渡到最终文本
- **配置**: `HERO_CONFIG` 常量（images 数组、accentColor、bigText、slogan、bottomLine）
- **依赖**: `gsap`、`@gsap/react`、`gsap/SplitText`、`useDeviceState`、`RollingClock`

### 4. 热点悬停预览 (`HotspotPreview.tsx`)
- **功能**: SceneViewer 桌面端热点悬停时显示详情预览卡片
- **特性**: 跟随鼠标移动（requestAnimationFrame + 线性插值 LERP 0.14 平滑）、视口边界限制、基于水平速度的旋转效果（±6°）、clip-path + opacity 展示/隐藏过渡
- **特性（减少动画）**: `prefers-reduced-motion` 时直接设置位置，无 LERP 插值
- **位置**: SceneViewer 热点交互层内，z-60
- **依赖**: `Hotspot` 类型

### 5. 滚动驱动视频 (`ScrollVideo.tsx`)
- **功能**: GSAP ScrollTrigger 驱动的视频展示组件
- **特性**: 视频从 scale 0.6 → 1 + opacity 0.5 → 1 跟随滚动缩放，标题淡入动画；IntersectionObserver 离屏暂停/入屏播放；视频自动循环播放、静音
- **位置**: HomeSelection 第一组卡片下方
- **依赖**: `gsap`、`gsap/ScrollTrigger`

### 6. 场景查看器 (`SceneViewer.tsx`)
- **功能**: 场景详情展示与热区交互
- **特性**: 透明背景、热区选择、侧边栏、瞄准器
- **特性（侧边栏动画）**: GSAP 单 Timeline + `addPause()` 实现可中断 enter/exit（参考 [Interruptible Single Timeline Enter/Exit](https://demos.gsap.com/demo/interruptible-single-timeline-enterexit/)），桌面端宽度 60px↔320px + 列表 stagger（`back.out(1.2)` 进入 / `power3.in` 退出），移动端 `xPercent` 抽屉，遵守 `prefers-reduced-motion`
- **依赖**: `DetailCard` 组件

### 7. 详情卡片 (`DetailCard.tsx`)
- **功能**: 热点详情展示，支持图片与3D模型双模式
- **特性**: 浮动卡片态、全屏展开态、3D模型查看、放大弹窗
- **依赖**: `ModelViewer`、`FullscreenModelViewer`

### 8. 3D模型查看器 (`ModelViewer.tsx`)
- **功能**: 基于 Three.js 的 3D 模型查看器
- **特性**: OrbitControls 旋转/缩放、占位几何体、HUD 信息叠加、四角装饰
- **依赖**: `@react-three/fiber`、`@react-three/drei`

### 9. 全屏3D模型弹窗 (`FullscreenModelViewer.tsx`)
- **功能**: 独立的全屏 3D 模型查看器
- **特性**: 全屏覆盖、wipe 转场动画、操作指南面板、赛博朋克 UI 风格
- **特性（移动端）**: 关闭按钮和角标位置适配小屏，操作指南在触屏设备显示"单指拖拽 / 双指捏合"文案
- **依赖**: `ModelViewer`

### 10. 自定义光标 (`CustomCursor.tsx`)
- **功能**: 全局自定义光标，GSAP `quickTo` 平滑跟随鼠标
- **特性**: 交互态缩放（idle/hover/pressed 三态）、`prefers-reduced-motion` + `pointer: coarse` 检测自动禁用
- **依赖**: `useMouseEffects` Hook

### 11. 滚动翻页时钟 (`RollingClock.tsx`)
- **功能**: 实时时钟显示，数字切换时带 GSAP 翻页动画
- **特性**: 渐变文字 + `WebkitTextStroke` 描边、`useMemo` 优化 digits 数组
- **位置**: HeroSection 区域右下角

### 12. 设备状态检测 (`useDeviceState.ts`)
- **功能**: 检测当前设备类型，区分 `desktop` / `mobile-portrait` / `mobile-landscape`
- **判断逻辑**: `width < 768` 为移动端，`width < 1024 && height < 500` 为横版移动端
- **事件**: 监听 `resize` + `orientationchange`

### 13. 鼠标视差效果 (`useMouseEffects.ts`)
- **功能**: 归一化指针坐标 + `gsap.quickTo` 视差缓存
- **特性**: `prefers-reduced-motion` + `pointer: coarse` 检测自动禁用
- **导出**: `useMouseEffects()` 返回 `{ isSupported, pointer, parallaxTo }`

### 14. 常量配置 (`constants.ts`)
- **内容**: 颜色系统、BGM配置、作品集数据、场景数据
- **更新**: 2026-05-28 更新了作品集封面路径

---

## 文档更新规范

### 文件命名
- 使用有意义的中文文件名
- 词组分隔使用连字符 `-`
- 日期后置使用 `YYMMDD` 格式
- 示例: `功能更新记录-260602.md`（最后更新日期后置）

### 更新要求
1. 新增、修改或重构功能模块后，必须同步更新本文档
2. 不在本文档写修改历史、阶段记录或执行结果
3. 只有目录存在实际源码且职责稳定时，才新增独立说明文档
4. 空目录、占位目录、未接入主线的目录，不单独建档

---

## 更新日志

| 日期 | 文档 | 变更内容 |
|------|------|----------|
| 2026-05-28 | apps-code-map.md | 创建项目文档导航 |
| 2026-05-28 | 功能更新记录-260528.md | 创建功能更新记录文档 |
| 2026-05-28 | 项目开发经验.md | 更新项目开发经验文档 |
| 2026-06-01 | 3D模型查看器-功能实现-260601.md | 创建3D模型查看器功能实现文档 |
| 2026-06-01 | apps-code-map.md | 新增3D模型查看器组件导航 |
| 2026-06-01 | .env, 启动.bat, vite.config.ts | 端口优化，支持环境变量配置 |
| 2026-06-01 | UI框架Map.md | 创建UI框架结构化导航文档 |
| 2026-06-01 | HomeSelection.tsx, index.html, UI框架Map.md, apps-code-map.md | 首页顶栏升级为玻璃态 + 流动渐变（`#CCFF00` 流光线 + 底层绿光晕） |
| 2026-06-01 | HomeSelection.tsx, apps-code-map.md | 首页顶栏暗色模式加深半透明（`dark:bg-background/10` + `dark:backdrop-blur-2xl`），按区域补强文字阴影与脉冲辉光 |
| 2026-06-02 | SceneViewer.tsx, apps-code-map.md, 3D模型查看器-功能实现-260601.md, 项目开发经验.md | SceneViewer 侧边栏重构为 GSAP 单 Timeline + `addPause()` 可中断 enter/exit 动画（桌面 width 60↔320 + 列表 stagger，移动 xPercent 抽屉），遵守 `prefers-reduced-motion` |
| 2026-06-02 | ThemeToggle.tsx（删除）, App.tsx, index.html, 5 个组件文件, UI框架Map.md, apps-code-map.md, 项目开发经验.md | 移除主题色切换功能，固定为暗色唯一主题；删除 ThemeToggle 组件及切换链路；清理全部 `dark:` Tailwind 类；CSS 变量从 `.dark` 提升为 `:root` |
| 2026-06-02 | vite.config.ts | 构建优化：Three.js / GSAP 代码分割 `manualChunks` |
| 2026-06-02 | index.html, App.tsx, GridOverlay.tsx, DetailCard.tsx, FullscreenModelViewer.tsx | 内联 `@keyframes` 统一迁移到 `index.html`；App.tsx 转场 + CustomCursor 样式一并迁移 |
| 2026-06-02 | App.tsx | 事件处理器 `useCallback` 包装，减少子组件无效重渲染 |
| 2026-06-02 | ModelViewer.tsx | LoadedModel 对象复用：`Box3`/`Vector3` 计算移入 `useMemo` |
| 2026-06-02 | apps-code-map.md | 补充 CustomCursor、RollingClock、useDeviceState、useMouseEffects 条目 |
| 2026-06-03 | 已实现的方案/字体乱码解码与点阵字符扰动方案-260603.md, apps-code-map.md | 新增首页字体乱码解码与点阵字符扰动复用方案文档 |
| 2026-06-03 | HeroSection.tsx, HotspotPreview.tsx, ScrollVideo.tsx, HomeSelection.tsx, SceneViewer.tsx, apps-code-map.md, UI框架Map.md, 功能更新记录-260603.md | Hero 区域拆分为独立组件；新增 Hero 图片轮播、点阵噪声 ASCII 扰动、HUD 文本 scramble；新增 HotspotPreview 热点悬停预览；新增 ScrollVideo 滚动驱动视频 |
