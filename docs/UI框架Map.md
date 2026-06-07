# UI 框架 Map

> 本文档为项目前端 UI 的结构化导航，用于快速定位界面元素对应的组件名与文件路径。
> 适用于人工查阅和 AI 模型上下文注入。

---

## 1. 全局层级架构

```text
App.tsx (根组件)
├── Preloader (首屏资源加载器 - 混合进度 + Portfolio 品牌加载动画)
├── [全局] 普通三层滑入/滑出转场 (TransitionOverlay，由 App navigate 控制)
├── GridOverlay (背景覆盖层 - 全局常驻)
├── <main> 主内容区 (按 AppState 切换)
│   ├── HomeSelection (HOME 状态)
│   │   ├── HeroSection (Hero 区域: 轮播 + 顶栏 + 时钟 + 标语 + 点阵噪声)
│   │   │   └── RollingClock (实时时钟)
│   │   ├── 作品集卡片网格
│   │   └── ScrollVideo (第一组卡片下方, 滚动驱动视频)
│   ├── Gallery (GALLERY 状态，提供共享标题转场入口)
│   └── SceneViewer (VIEWER 状态)
│       ├── 热点交互层
│       │   └── HotspotPreview (桌面端热点悬停预览)
│       └── DetailCard (热点详情卡片)
│           ├── ModelViewer (3D 模型查看器)
│           └── FullscreenModelViewer (全屏 3D 弹窗)
│               └── ModelViewer (复用)
├── AudioPlayer (音频播放器 - 全局常驻)
├── CustomCursor (自定义光标 - 全局常驻, z-300, pointer-events-none)
└── [全局] 底部微光进度条 (ShimmerBar)
```

**App 状态管理**:
- `isPreloaderComplete` — 首屏加载器完成状态，完成前由 Preloader 覆盖并阻塞首页交互。
- `appState` — 当前页面状态：`HOME` / `GALLERY` / `VIEWER`。
- `selectedCollection` — 当前选中的作品集。
- `selectedScene` — 当前选中的场景。
- `hoveredColor` — 悬停强调色，由 HomeSelection/Gallery 的 `onHover` 驱动，传递给 GridOverlay。
- `activeHotspot` — 热点焦点状态，由 SceneViewer 的 `onHotspotSelect` 驱动，传递给 GridOverlay。
- `transitionStatus` — 普通三层转场状态：`idle` / `in` / `out`。
- `transitionColor` — 普通转场强调色。
- `isSharedTitleTransitioning` — Gallery 标题共享元素回 HOME 转场锁定状态。
- `sharedTitleCloneRef` — App 克隆标题元素后的 DOM 引用。

### 状态路由

| AppState 枚举 | 显示页面 | 触发方式 |
|---|---|---|
| `HOME` | HomeSelection | 初始状态 / 点击“返回首页” / 共享标题转场结束 |
| `GALLERY` | Gallery | 在首页点击作品集卡片 |
| `VIEWER` | SceneViewer | 在画廊点击场景卡片 |

### 全局转场体系

项目当前有两套转场：

1. **普通三层滑入/滑出转场**
   - 位置：`src/App.tsx` 内联 `TransitionOverlay`。
   - 控制方：App 的 `navigate`。
   - 结构：前景层 `bg-surface`、强调色层 `transitionColor`、背景层 `bg-background`。
   - 流程：slide-in → 切换 `appState` / `selectedScene` → slide-out。

2. **Gallery 标题共享元素回 HOME 转场**
   - 入口：`Gallery.tsx` 左上作品集标题或卡片中文标题。
   - 控制方：Gallery 调用 `onSharedTitleBack`，App 克隆 sourceElement 并用 GSAP 执行动画。
   - 流程：克隆标题 → 放大移动到首页视觉区 → 缩小收回到顶部目标点并淡出 → Gallery 淡出 → 切回 HOME。

---

## 1.1 首屏加载器 — Preloader

**文件**: `src/components/layout/Preloader.tsx`  
**动画引擎**: GSAP (`gsap`)  
**配置来源**: `src/constants.ts` 的 `PRELOAD_ASSETS`

```text
Preloader
├── 全屏黑色遮罩 (fixed inset-0, z-[9999], 阻塞首屏交互)
├── BTW 场景图片拼贴层
│   ├── 红白纸片背板 ×3
│   └── BTW 总页与 3/2/1 卡片页 ×4 (展示取 assets.slice(0,4))
├── 巨大中心品牌标题 “PORTFOLIO”
├── 低存在感细线与项目元信息
├── 标题右侧三位数字进度 (000 → 100)
└── 红色小圆点视觉锚点
```

**关键逻辑**:
- `MIN_VISIBLE_MS = 3200`，`MAX_BLOCKING_MS = 12000`。
- 以 `performance.now()` 计时。
- `assets` 全量预加载；展示层只取前 4 项。
- 当前 `PRELOAD_ASSETS` 包含 BTW 总页、3/2/1 卡片页、首页大图 1/2/3。
- 图片加载失败会计为完成，避免网络波动导致永久卡住。
- `prefers-reduced-motion` 时跳过复杂入场/退场。

---

## 2. 页面级 UI Map

### 2.1 首页 — HomeSelection

**文件**: `src/components/pages/HomeSelection.tsx`  
**直接依赖**: `useDeviceState`  
**动画职责**: HomeSelection 当前不直接依赖 GSAP；动画由子组件 HeroSection / ScrollVideo / Gallery 等承担。

```text
HomeSelection
├── HeroSection (独立组件, 详见 2.2 节)
├── 作品集卡片网格
│   └── 作品集卡片 ×N
│       ├── 背景图片 (COLLECTIONS[].image)
│       ├── 渐变底部遮罩
│       ├── 左上角 ID 标签 + 强调色横线
│       ├── 中心旋转方框图标
│       ├── 底部文字区
│       ├── “ACCESS DATA” 按钮
│       └── 上下强调色边线
├── ScrollVideo (第一组卡片下方, 详见 2.6 节)
├── 滚动字幕分隔条
└── 页脚终止标记
```

**关键职责**:
- 使用 `useDeviceState` 区分桌面、移动竖屏、移动横屏。
- 监听全屏状态并提供全屏切换。
- 监听窗口滚动位置。
- 将作品集按每组 3 个分组展示。
- 集成 HeroSection 与 ScrollVideo。

---

### 2.2 Hero 区域 — HeroSection

**文件**: `src/components/pages/HeroSection.tsx`  
**动画引擎**: GSAP (`gsap` + `@gsap/react` 的 `useGSAP`) + `gsap/SplitText`  
**资源路径**: 通过 `assetPath()` / `import.meta.env.BASE_URL` 适配 `base='/Portfolio_BTW/'`

**动画常量**:

| 常量 | 值 | 用途 |
|---|---|---|
| `TILT_MAX_DEG` | 12 | 顶栏标题组最大倾斜角度 |
| `TILT_PERSPECTIVE` | 800 | 顶栏标题组 3D 透视距离 |
| `PARALLAX_FACTOR_LABEL` | 3 | “场景目录”标签视差系数 |
| `PARALLAX_FACTOR_TITLE` | 6 | 大标题视差系数 |
| `SLOGAN_TILT_MAX_DEG` | 15 | 斜切标签最大倾斜角度 |
| `SLOGAN_TILT_PERSPECTIVE` | 600 | 斜切标签 3D 透视距离 |
| `SLOGAN_PARALLAX_FACTOR` | 4 | 斜切标签文字视差系数 |
| `SCRAMBLE_DURATION` | 520 | HUD 文本乱码解码动画时长 |
| `DOT_GRID_SIZE` | 20 | 点阵噪声网格单元尺寸 |
| `DOT_NOISE_REFRESH_MS` | 180 | 点阵噪声刷新间隔 |
| `DOT_DEFAULT_ACTIVE_RATE` | 0.02 | 默认活跃率 |
| `DOT_HOVER_ACTIVE_RATE` | 0.05 | hover 活跃率 |

```text
HeroSection
├── 顶部标题栏 (玻璃态 + GSAP 动效)
├── 背景轮播 (多张首页大图无缝循环)
├── 点阵噪声覆盖层 (ASCII 字符网格)
├── 巨型背景文字 “Environment Art”
└── 底部内容区
    ├── HUD 信息 (hover scramble)
    ├── RollingClock
    └── 荧光绿斜切标签
```

---

### 2.3 画廊 — Gallery

**文件**: `src/components/pages/Gallery.tsx`  
**动画引擎**: GSAP (`gsap` + `@gsap/react` 的 `useGSAP`)

```text
Gallery
├── 全局标题栏
│   ├── 作品集标题 + ID (可触发共享标题回 HOME 转场)
│   └── 返回按钮
├── 场景卡片网格
│   └── 场景卡片 ×N
│       ├── 背景图片
│       ├── 强调色边框
│       ├── Sector ID
│       ├── 中文主标题 (可触发共享标题回 HOME 转场)
│       └── “进入场景”按钮
└── 底部状态栏
```

**关键交互**:
- 卡片悬停 → 弹性伸缩、边框高亮、描述展开。
- 点击卡片非标题区域 → 进入 VIEWER 状态。
- 点击左上作品集标题或卡片中文标题 → 触发共享标题转场。
- 返回按钮 → 普通三层转场回 HOME。

---

### 2.4 场景查看器 — SceneViewer

**文件**: `src/components/pages/SceneViewer.tsx`

```text
SceneViewer
├── 顶部信息栏
├── 主视口
│   ├── 背景大图
│   ├── 内部网格覆盖层
│   ├── 热点交互层
│   │   ├── 热点按钮 ×N
│   │   └── HotspotPreview (桌面端热点悬停预览)
│   ├── 瞄准框
│   ├── DetailCard
│   └── 右侧边栏
│       ├── 桌面端: 60px ↔ 320px
│       ├── 移动竖屏: 100%
│       └── 移动横屏: 约 60%~62%
├── 移动端菜单按钮
└── 底部坐标信息
```

**关键交互**:
- 点击热点 → 背景图低透明度+模糊+灰度、瞄准框定位、DetailCard 弹出。
- 桌面端热点悬停 → HotspotPreview 预览卡片跟随鼠标显示。
- 侧边栏桌面端悬停/点击展开，移动端通过按钮打开。
- 侧边栏动画使用 GSAP 单 Timeline + `addPause()`，支持 enter/exit 可中断。

---

### 2.5 热点悬停预览 — HotspotPreview

**文件**: `src/components/pages/HotspotPreview.tsx`  
**位置**: SceneViewer 热点交互层内，z-60，仅桌面端显示

```text
HotspotPreview
└── 预览容器 (fixed, pointer-events-none, clip-path + opacity 过渡)
    ├── 预览卡片
    │   ├── 预览图片 (显示时 scale-105 收回到 scale-100)
    │   ├── 渐变遮罩
    │   └── 标题栏
    └── 连接线
```

**技术要点**:
- `requestAnimationFrame` + LERP 0.14 平滑跟随鼠标。
- 视口边界限制：X `[160, viewport-120]`，Y `[220, viewport-120]`。
- 基于水平速度的旋转效果：限制 ±6°。
- 展示/隐藏：`clip-path inset` + `opacity` 过渡。

---

### 2.6 滚动驱动视频 — ScrollVideo

**文件**: `src/components/ui/ScrollVideo.tsx`  
**位置**: HomeSelection 第一组卡片下方  
**动画引擎**: GSAP ScrollTrigger

```text
ScrollVideo
├── 背景辉光
├── 视频元素 (JSX: preload="auto" / muted / playsInline)
│   └── canplay 后程序化 video.play().catch(...)
├── 加载状态
└── 标题覆盖层
```

**技术要点**:
- 不是 JSX `autoPlay`；当前为 `canplay` 后程序化播放。
- `video.loop = true`、`video.muted = true` 在逻辑中设置。
- `IntersectionObserver` 入屏播放、离屏暂停。
- GSAP ScrollTrigger 驱动视频 `scale 0.6 → 1`、`opacity 0.5 → 1`；标题淡入。

---

## 3. 通用组件 UI Map

### 3.1 背景覆盖层 — GridOverlay

**文件**: `src/components/layout/GridOverlay.tsx`  
**位置**: 全局常驻，z-0，pointer-events-none

```text
GridOverlay
├── 动态背景能量光斑
├── 数字噪点纹理
├── 地形等高线纹理
├── 扫描线
├── 四角数据覆盖层
├── 动态瞄准环
└── 暗角效果
```

---

### 3.2 详情卡片 — DetailCard

**文件**: `src/components/ui/DetailCard.tsx`  
**Props**: `hotspot`, `onClose`, `sceneTitle`, `accentColor`, `isMobile`, `isLandscape`, `onExpand`

```text
DetailCard
├── 浮动卡片态
│   ├── detailImage 缩略图
│   ├── 展开提示
│   ├── 描述文字
│   └── 底部装饰
├── 全屏展开态 (Portal, z-100)
│   ├── Wipe 转场动画
│   ├── 左侧: ModelViewer (始终渲染)
│   │   ├── modelUrl 有效时加载 GLTF
│   │   └── modelUrl 无效/不存在时显示十二面体占位模型
│   └── 右侧: 信息面板
└── 全屏 3D 查看器 (Portal, z-200)
    └── FullscreenModelViewer
```

**当前最终形态**:
- 浮动卡片显示 `detailImage` 缩略图。
- 展开态始终渲染 ModelViewer。
- `modelUrl` 有效加载 GLTF；无效/不存在时显示十二面体占位模型。
- 不再使用“展开态图片/3D 双模式”的旧描述。

---

### 3.3 3D 模型查看器 — ModelViewer

**文件**: `src/components/ui/ModelViewer.tsx`

```text
ModelViewer
├── Three.js Canvas
│   ├── SceneContent
│   │   ├── 灯光
│   │   ├── Suspense 加载态
│   │   ├── LoadedModel (resolvedUrl 有效)
│   │   ├── PlaceholderModel (resolvedUrl 无效/为空)
│   │   └── GridFloor
│   ├── OrbitControls
│   └── Environment
├── useResolvedModelUrl
│   └── HEAD 请求验证 modelUrl，拒绝 text/html 响应
└── HUD 覆盖层
```

---

### 3.4 全屏 3D 模型弹窗 — FullscreenModelViewer

**文件**: `src/components/ui/FullscreenModelViewer.tsx`

```text
FullscreenModelViewer
├── 背景遮罩
├── Wipe 转场动画
├── 关闭按钮
├── 左侧: 3D 视口 (ModelViewer)
└── 右侧: 信息面板
    ├── 标题 + 分隔线
    ├── 描述
    ├── 操作指南
    └── “关闭查看器”按钮
```

**响应式**:
- 桌面端信息面板宽 `340px`。
- 移动横屏信息面板宽 `38%`，内容压缩间距。
- 普通移动端信息面板 `max-h-[55vh]`，顶部拖拽手柄。
- 操作指南根据移动端切换：桌面为“滚轮 → 缩放视图”，移动端为“双指捏合 → 缩放视图”。

---

### 3.5 音频播放器 — AudioPlayer

**文件**: `src/components/layout/AudioPlayer.tsx`  
**位置**: 固定左下角，z-50

```text
AudioPlayer
├── 隐藏态
├── 收起态
└── 展开态
    ├── 进度条
    ├── 时间显示
    ├── 播放/暂停按钮
    ├── 音量控制
    └── 隐藏按钮
```

**快捷键**: Space 播放/暂停 | M 静音 | Esc 隐藏  
**配置**: `BGM_CONFIG`

---

### 3.6 自定义光标 — CustomCursor

**文件**: `src/components/layout/CustomCursor.tsx`  
**依赖**: `useMouseEffects`

**交互逻辑**:
- `pointermove` → `gsap.quickTo` 跟随鼠标。
- `mouseover/mouseout` → 检测交互元素切换悬停态。
- `mousedown/mouseup` → 按压态反馈。
- `prefers-reduced-motion` 或 `pointer: coarse` → 自动禁用。

---

### 3.7 滚动翻页时钟 — RollingClock

**文件**: `src/components/ui/RollingClock.tsx`  
**位置**: HeroSection 区域右下角

```text
RollingClock
└── 8 位字符 (HH:MM:SS)
    ├── 数字位: RollingDigit
    └── 分隔符 “:”
```

---

## 4. 全局 UI 元素

### 4.1 普通三层转场覆盖层 (TransitionOverlay)

**文件**: `src/App.tsx` 内联渲染  
**触发**: `navigate`

```text
TransitionOverlay (z-100, pointer-events-none)
├── 前景层 (bg-surface, 0.5s)
├── 强调色层 (transitionColor, 0.6s, 0.05s 延迟)
└── 背景层 (bg-background, 0.6s)
```

### 4.2 Gallery 共享标题转场

**文件**: `src/App.tsx` + `src/components/pages/Gallery.tsx`
- Gallery 提供可点击标题入口。
- App 克隆源标题元素并执行 GSAP 动画。
- 该转场不是 TransitionOverlay 三层滑入/滑出，而是共享元素动画。

### 4.3 底部微光进度条 (ShimmerBar)

**文件**: `src/App.tsx` 内联渲染  
**位置**: 固定底部居中，z-50，pointer-events-none

### 4.4 强调色系统

**文件**: `src/constants.ts`

`ACCENT_COLORS` 提供基础色；`COLLECTIONS` 可直接写十六进制，也可引用常量。当前集合映射如下：

| 集合 | 标题 | 当前颜色 |
|---|---|---|
| C-01 | BTW_通道1 | `#CCFF00` |
| C-02 | BTW_通道2 | `#FCEE0A` |
| C-03 | BTW_垂直通道 | `#00F0FF` |
| C-04 | 数字虚空 | `#00F0FF` |
| C-05 | 地下黑市 | `#BD00FF` |
| C-06 | 重工铸造 | `#FF8C00` |
| C-07 | 深海前哨 | `#00FFA3` |
| C-08 | 轨道空间站 | `#E0E0E0` |
| C-09 | 地下城 | `#FF8C00` |
| C-10 | 仿生花园 | `#CCFF00` |
| C-11 | 机甲机库 | `#FF003C` |
| C-12 | 数据堡垒 | `#00F0FF` |
| C-13 | 隔离扇区 | `#FCEE0A` |
| C-14 | AI 蜂巢 | `#BD00FF` |
| C-15 | 能源矩阵 | `#00F0FF` |
| C-16 | 虚空边缘 | `#E0E0E0` |
| C-17 | 记忆存储库 | `#00FFA3` |
| C-18 | 终焉之地 | `#FF003C` |

---

## 5. 视觉特征反查索引

| 视觉特征 | 所属组件 | 文件路径 |
|---|---|---|
| 超大实时时钟 | HeroSection → RollingClock | `src/components/ui/RollingClock.tsx` |
| 荧光绿斜切标签 | HeroSection | `src/components/pages/HeroSection.tsx` |
| 巨型半透明背景字 “Environment Art” | HeroSection | `src/components/pages/HeroSection.tsx` |
| 首页顶栏玻璃态 + 流动渐变 | HeroSection | `src/components/pages/HeroSection.tsx` |
| Hero 大图轮播 | HeroSection | `src/components/pages/HeroSection.tsx` |
| 点阵噪声覆盖层 | HeroSection | `src/components/pages/HeroSection.tsx` |
| HUD 文本 hover 乱码解码 | HeroSection | `src/components/pages/HeroSection.tsx` |
| 作品集卡片 | HomeSelection | `src/components/pages/HomeSelection.tsx` |
| 滚动大字字幕条 | HomeSelection | `src/components/pages/HomeSelection.tsx` |
| 画廊入场 clip-path 揭示动画 | Gallery | `src/components/pages/Gallery.tsx` |
| 横向弹性伸缩场景卡片 | Gallery | `src/components/pages/Gallery.tsx` |
| Gallery 标题共享元素回 HOME | Gallery + App | `src/components/pages/Gallery.tsx` / `src/App.tsx` |
| 场景大图 + 热点圆点 | SceneViewer | `src/components/pages/SceneViewer.tsx` |
| 热点悬停预览卡片 | HotspotPreview | `src/components/pages/HotspotPreview.tsx` |
| 右侧可收起侧边栏 | SceneViewer | `src/components/pages/SceneViewer.tsx` |
| 热点详情浮动卡片 | DetailCard | `src/components/ui/DetailCard.tsx` |
| 全屏 3D 展开弹窗 | DetailCard | `src/components/ui/DetailCard.tsx` |
| 3D 十二面体占位模型 | ModelViewer | `src/components/ui/ModelViewer.tsx` |
| GLTF 模型加载 | ModelViewer | `src/components/ui/ModelViewer.tsx` |
| 全屏 3D 查看器 | FullscreenModelViewer | `src/components/ui/FullscreenModelViewer.tsx` |
| 滚动驱动视频 | ScrollVideo | `src/components/ui/ScrollVideo.tsx` |
| 缓慢移动的彩色光斑背景 | GridOverlay | `src/components/layout/GridOverlay.tsx` |
| 黄绿色方形光标 | CustomCursor | `src/components/layout/CustomCursor.tsx` |
| 全屏三色层滑入/滑出转场 | App → TransitionOverlay | `src/App.tsx` |
| 底部居中微光进度条 | App → ShimmerBar | `src/App.tsx` |

---

## 6. 组件依赖关系

```text
App
 ├── Preloader (gsap)
 ├── GridOverlay (无子组件依赖)
 ├── HomeSelection (useDeviceState)
 │    ├── HeroSection (gsap, @gsap/react, gsap/SplitText, useDeviceState)
 │    │    └── RollingClock (gsap)
 │    └── ScrollVideo (gsap, gsap/ScrollTrigger)
 ├── Gallery (gsap, @gsap/react, useDeviceState)
 ├── SceneViewer (gsap, @gsap/react, useDeviceState)
 │    ├── HotspotPreview (无外部依赖)
 │    └── DetailCard
 │         ├── ModelViewer (@react-three/fiber, @react-three/drei, three)
 │         └── FullscreenModelViewer
 │              └── ModelViewer (复用)
 ├── AudioPlayer (无子组件依赖)
 └── CustomCursor (useMouseEffects → gsap)
```

**外部依赖**:
- `gsap` + `@gsap/react` + `gsap/ScrollTrigger` + `gsap/SplitText` — 动画引擎，主要用于 Preloader、HeroSection、Gallery、SceneViewer、ScrollVideo、CustomCursor、RollingClock。
- `lucide-react` — 图标系统。
- `@react-three/fiber` + `@react-three/drei` + `three` — 3D 渲染，ModelViewer 专用。

> 注意：HomeSelection 不再列为 GSAP 直接依赖；App 也不直连 RollingClock，实际链路为 App → HomeSelection → HeroSection → RollingClock。

---

## 7. z-index 层级规范

| z-index | 用途 | 组件 |
|---|---|---|
| 0 | 背景覆盖层 | GridOverlay |
| 10 | 主内容区 | `<main>` |
| 20 | 画廊标题栏 / 场景查看器容器 | Gallery Header / SceneViewer |
| 30 | 首页顶栏 / 热点交互层 / 瞄准框 | HeroSection Header / SceneViewer Hotspots & Reticle |
| 40 | 场景顶部信息栏 | SceneViewer TopBar |
| 50 | DetailCard / 侧边栏 / 全局控件 | DetailCard, Sidebar, AudioPlayer |
| 60 | 热点悬停预览 | HotspotPreview |
| 100 | 全屏转场 / 全屏展开态 | TransitionOverlay, DetailCard 展开态 |
| 200 | 全屏 3D 查看器 | FullscreenModelViewer |
| 250 | 共享标题克隆元素 | App shared title clone |
| 300 | 自定义光标 | CustomCursor |
| 9999 | 首屏加载器 | Preloader |

---

## 8. 设备测试参考

### 8.1 真我 GT8（参考设备）

| 项目 | 值 | 备注 |
|---|---|---|
| 设备 | 真我 GT8 | 真机 |
| 物理分辨率 | 1440 × 3136 px | W × H |
| 屏幕密度 | 508 PPI | 约 6.78 英寸 |
| 设备像素比 | 3.5 | CSS px → 物理 px 倍率 |
| 测试分辨率 | 896 × 411 CSS px | 横屏测试参考 |

### 8.2 计算公式

```text
CSS 分辨率 = 物理分辨率 ÷ DPR
物理尺寸(英寸) = √(W² + H²) ÷ PPI
viewport meta 宽度 = 设备独立像素 (CSS px)
```
