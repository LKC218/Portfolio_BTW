# UI 框架 Map

> 本文档为项目前端 UI 的结构化导航，用于快速定位界面元素对应的组件名与文件路径。
> 适用于人工查阅和 AI 模型上下文注入。

---

## 1. 全局层级架构

```
App.tsx (根组件)
├── [全局] 全屏转场覆盖层 (TransitionOverlay)
├── GridOverlay (背景覆盖层 - 全局常驻)
├── <main> 主内容区 (按 AppState 切换)
│   ├── HomeSelection (HOME 状态)
│   │   ├── HeroSection (Hero 区域: 轮播 + 顶栏 + 时钟 + 标语 + 点阵噪声)
│   │   │   └── RollingClock (实时时钟)
│   │   ├── 作品集卡片网格
│   │   └── ScrollVideo (第一组卡片下方, 滚动驱动视频)
│   ├── Gallery (GALLERY 状态)
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
- `hoveredColor` — 悬停强调色，由 HomeSelection/Gallery 的 `onHover` 驱动，传递给 GridOverlay
- `activeHotspot` — 热点焦点状态，由 SceneViewer 的 `onHotspotSelect` 驱动，传递给 GridOverlay

### 状态路由

| AppState 枚举 | 显示页面 | 触发方式 |
|---|---|---|
| `HOME` | HomeSelection | 初始状态 / 点击"返回首页" |
| `GALLERY` | Gallery | 在首页点击作品集卡片 |
| `VIEWER` | SceneViewer | 在画廊点击场景卡片 |

---

## 2. 页面级 UI Map

### 2.1 首页 — HomeSelection

**文件**: `src/components/pages/HomeSelection.tsx`
**动画引擎**: GSAP (`gsap` + `@gsap/react` 的 `useGSAP`)
**无障碍**: `prefers-reduced-motion` 检测，启用时跳过所有 GSAP 动画

```
HomeSelection
├── HeroSection (独立组件, 详见下方 2.4 节)
│
├── 作品集卡片网格 (每组3张，分页排列)
│   └── 作品集卡片 ×N
│       ├── 背景图片 (来自 `src/constants.ts` 的 `COLLECTIONS[].image`；悬停放大 + 扫描线覆盖)
│       ├── 渐变底部遮罩
│       ├── 左上角 ID 标签 (如 "C-01") + 强调色横线 (悬停展开)
│       ├── 中心旋转方框图标 (悬停显示, Square 12s 旋转)
│       ├── 底部文字区 (subtitle / title / description, 悬停上移)
│       ├── "ACCESS DATA" 按钮 (悬停显示, 桌面端)
│       └── 上下强调色边线 (悬停展开, cubic-bezier 弹性)
│
├── ScrollVideo (第一组卡片下方, 详见 2.5 节)
│
├── 滚动字幕分隔条 (Marquee Divider, 每组卡片后)
│   └── 重复大字 "Environment_Art /// Collection_0X" (滚动驱动位移, 奇偶组反向)
│
└── 页脚终止标记 (竖线 + "End" + 圆点)
```

**关键交互**:
- 卡片悬停 → 背景图片放大/去灰度、强调色边线展开、中心图标旋转显示
- 滚动 → 字幕分隔条水平位移
- 点击卡片 → 触发 `onSelect`，进入 GALLERY 状态

---

### 2.2 Hero 区域 — HeroSection

**文件**: `src/components/pages/HeroSection.tsx`
**动画引擎**: GSAP (`gsap` + `@gsap/react` 的 `useGSAP`) + `gsap/SplitText`
**无障碍**: `prefers-reduced-motion` 检测，启用时跳过所有 GSAP 动画

**动画常量**:

| 常量 | 值 | 用途 |
|---|---|---|
| `TILT_MAX_DEG` | 12 | 顶栏标题组最大倾斜角度 |
| `TILT_PERSPECTIVE` | 800 | 顶栏标题组 3D 透视距离 |
| `PARALLAX_FACTOR_LABEL` | 3 | "场景目录"标签视差系数 |
| `PARALLAX_FACTOR_TITLE` | 6 | 大标题视差系数 |
| `SLOGAN_TILT_MAX_DEG` | 15 | 斜切标签最大倾斜角度 |
| `SLOGAN_TILT_PERSPECTIVE` | 600 | 斜切标签 3D 透视距离 |
| `SLOGAN_PARALLAX_FACTOR` | 4 | 斜切标签文字视差系数 |
| `SLOGAN_SHADOW_OFFSET` | 8 | 斜切标签动态阴影偏移量 |
| `BIGTEXT_ENTER_DURATION` | 0.7 | Hero 巨型背景文字字符入场时长 (秒) |
| `BIGTEXT_STAGGER` | 0.04 | 字符入场交错间隔 (秒) |
| `BIGTEXT_EASE` | `power4.out` | 字符入场缓动 |
| `BIGTEXT_ENTER_DELAY` | 0.3 | 字符入场相对时间线起点的延迟 (秒) |
| `SCRAMBLE_DURATION` | 520 | HUD 文本乱码解码动画时长 (ms) |
| `DOT_GRID_SIZE` | 20 | 点阵噪声网格单元尺寸 (px) |
| `DOT_NOISE_REFRESH_MS` | 180 | 点阵噪声刷新间隔 (ms) |
| `DOT_DEFAULT_ACTIVE_RATE` | 0.02 | 默认活跃率 (2%) |
| `DOT_HOVER_ACTIVE_RATE` | 0.05 | hover 时活跃率 (5%) |

```
HeroSection
├── 顶部标题栏 (Header, absolute top-0, z-30, isolate, 玻璃态 + GSAP 动画)
│   ├── 底层流光晕 (CCFF00 渐变, GSAP backgroundPosition 14s 循环, blur 28px)
│   ├── 玻璃半透明层 (bg-background/10 + backdrop-blur-2xl + backdrop-saturate-150)
│   ├── 顶部高光细线 (白色 15% 透明渐变)
│   ├── 底部流光线 (CCFF00 横向渐变, GSAP backgroundPosition 12s 循环, 带绿色辉光 box-shadow)
│   ├── 标题组 (GSAP 3D 倾斜 + 视差)
│   │   ├── 脉冲圆点 (6px 绿色 drop-shadow) + "场景目录" 标签 (text-shadow 描边, 视差系数 3)
│   │   ├── 大标题 "作品集" (text-shadow 兜底, 视差系数 6)
│   │   └── 右侧元数据 (PC: TOTAL_SECTORS / SCROLL_MODE；移动端: 全屏切换按钮)
│   └── 底部分隔线 (h-px bg-border/10)
│
│   [GSAP 入场动画] 流光晕 opacity+scale → 流光线 scaleX → 脉冲圆点 scale(back.out) → 标签 y+opacity → 标题 y+opacity → 元数据 y+opacity
│   [GSAP 悬停加速] timeScale 2.5x + 流光晕 opacity 0.85
│   [GSAP 鼠标移动] 标题组 rotateX/rotateY (perspective 800) + 标签/标题 xy 视差位移
│   [GSAP 鼠标离开] elastic.out(1, 0.5) 弹性回弹归零
│
├── 背景轮播 (sliderContainerRef, GSAP timeline 无缝循环)
│   ├── 图片 ×N (绝对定位, 100% 间隔排列, translateY 切换)
│   ├── 渐变遮罩 (from-background via-transparent to-black/30)
│   └── 点阵噪声覆盖层 (ASCII 字符网格, hover 时活跃率 2%→5%)
│       ├── 随机位置白色字符 (opacity 0.08~0.13)
│       └── 15% 概率 #CCFF00 高亮字符 (opacity 0.14~0.18, 带绿色辉光 text-shadow)
│
├── 巨型背景文字 "Environment Art" (半透明叠加, mix-blend-overlay, SplitText 字符 stagger 入场)
│
├── 底部内容区 (z-20)
│   ├── 左下角 HUD 信息 (ACCESS_GRANTED / SYSTEM_ROOT, hover 时 playTextScramble 乱码解码)
│   ├── 水平装饰线 (CCFF00 50% 透明)
│   └── 右下角
│       ├── 实时时钟 (clamp 响应式超大字号, RollingClock)
│       ├── 荧光绿斜切标签 "作品集 // LKC218" (GSAP 3D 倾斜 + 视差)
│       │   ├── 容器: skewX -12, transformPerspective 600, transformOrigin bottom right
│       │   ├── 文字: skewX 12 (反向补偿)
│       │   ├── 高光扫过层 (sloganShineRef, linear-gradient 105°, GSAP xPercent -100→100)
│       │   │
│       │   [GSAP 悬停] scale 1.05 (back.out) + letterSpacing 0.35em + textShadow + 高光扫过 + playTextScramble
│       │   [GSAP 鼠标移动] rotateX/rotateY (max 15°) + 文字视差 (系数 4) + 动态 boxShadow (偏移随倾斜方向)
│       │   [GSAP 鼠标离开] elastic.out(1, 0.5) 弹性回弹 + boxShadow 归零
│       │
│       └── 版本号 "LIVE // Personal Work" (hover 时 playTextScramble)
```

**关键交互**:
- 顶栏鼠标移动 → 标题组 3D 倾斜 + 标签/标题视差位移
- 顶栏悬停 → 流光动画加速 2.5x + 光晕增强
- 斜切标签鼠标移动 → 3D 倾斜 + 文字视差 + 动态阴影
- 斜切标签悬停 → 弹跳放大 + 字间距扩展 + 高光扫过 + 文本 scramble
- HUD 文本 hover → playTextScramble 乱码解码动画
- 点阵噪声区域 hover → 活跃率提升 2%→5%
- 轮播自动切换 → 每张停留 4s + 1.2s 过渡 + 大文本字符 stagger 重新入场

---

### 2.3 画廊 — Gallery

**文件**: `src/components/pages/Gallery.tsx`
**动画引擎**: GSAP (`gsap` + `@gsap/react` 的 `useGSAP`)
**无障碍**: `prefers-reduced-motion` 检测，启用时跳过所有 GSAP 动画

**动画常量**:

| 常量 | 值 | 用途 |
|---|---|---|
| `ANIM_CARD_STAGGER` | 0.12 | 卡片入场交错间隔 (秒) |
| `ANIM_CARD_CLIP_DURATION` | 0.6 | 卡片 clip-path 揭示时长 |
| `ANIM_IMG_SETTLE_DURATION` | 0.8 | 图片缩放归位时长 |
| `ANIM_TEXT_SLIDE_DURATION` | 0.4 | 文字滑入时长 |
| `ANIM_EASE_CLIP` | `power4.out` | clip-path 揭示缓动 |
| `ANIM_EASE_SETTLE` | `power2.out` | 图片归位缓动 |
| `ANIM_EASE_TEXT` | `power3.out` | 文字滑入缓动 |

```
Gallery
├── 全局标题栏 (Header, h-20/h-24, bg-background/80 backdrop-blur-sm)
│   ├── 左侧
│   │   ├── 红色脉冲圆点 + "Unity_READY" 标签
│   │   └── 作品集标题 + ID (按钮态, 点击触发共享元素回首页转场)
│   └── 右侧
│       ├── 元数据 (GRID_X / GRID_Y / FPS + 提示文字)
│       └── 返回按钮 (ArrowLeft 图标, 悬停反色)
│
│   [GSAP 入场] Header clip-path inset 揭示 → 脉冲圆点 scale(back.out) → 标题 y+opacity → 元数据 x+opacity
│
├── 场景卡片网格 (横向弹性伸缩布局)
│   └── 场景卡片 ×N (flex-1, 悬停 flex-[3])
│       ├── 背景图片 (来自 `src/constants.ts` 的 `SCENES_DB[collection.id][].mainImage`，C-01 使用 `/assets/BTW/BTW_Scenes_1_1.jpg` 至 `/assets/BTW/BTW_Scenes_1_6.jpg`；暗模式灰度+低亮度，悬停恢复, GSAP scale+opacity 入场)
│       ├── 渐变遮罩 (GSAP opacity 入场)
│       ├── 网格图案覆盖层 (悬停显示)
│       ├── 强调色边框 (悬停显示)
│       ├── 左上角 Sector ID + 强调色标签 (GSAP y+opacity 入场)
│       ├── 右上角旋转十字准星图标 (GSAP rotation 入场)
│       ├── 底部内容区
│       │   ├── 强调色分隔线 (GSAP scaleX 入场)
│       │   ├── 英文副标题 (GSAP opacity 入场)
│       │   ├── 中文主标题 (按钮态, GSAP y+opacity 入场, 点击触发共享元素回首页转场)
│       │   └── [悬停展开] 描述文字 + "进入场景" 按钮
│       └── 移动端触摸指示器 (Plus 图标圆圈)
│
│   [GSAP 入场] 每张卡片交错 0.12s: clip-path 揭示 → 图片归位 → 渐变 → 标签 → ID → 准星 → 分隔线 → 副标题 → 标题
│
└── 底部状态栏 (Footer StatusBar, GSAP clip-path 揭示入场)
    ├── 左侧: 绿色圆点 + ONLINE + SECURE_CONNECTION
    └── 右侧: REC 数量 + VER 版本号
```

**关键交互**:
- 卡片悬停 → 弹性伸缩(flex-[3])、边框高亮、描述展开
- 点击卡片非标题区域 → 触发 `onSelect`，进入 VIEWER 状态
- 点击左上角作品集标题或卡片中文标题 → 触发 `onSharedTitleBack`，由 `App.tsx` 克隆标题元素并执行“放大移动到首页视觉区 → 缩小收回到顶部目标点 → 淡出切 HOME”的共享元素转场
- 返回按钮 → 回到 HOME 状态

---

### 2.4 场景查看器 — SceneViewer

**文件**: `src/components/pages/SceneViewer.tsx`

```
SceneViewer
├── 顶部信息栏 (TopBar, 绝对定位, z-40)
│   ├── 返回按钮 (ArrowLeft, 悬停变强调色, bg-background/60 backdrop-blur-md)
│   ├── 分隔线
│   └── 场景标题 (textShadow 场景色辉光) + 脉冲圆点 + 副标题
│
├── 主视口 (Main Viewport, bg-transparent 允许 GridOverlay 穿透)
│   ├── 背景大图 (热点激活时: opacity-20 + blur-[2px] + grayscale; 默认: opacity-90/80)
│   ├── 内部网格覆盖层
│   ├── 暗角效果 (Vignette, 亮色模式低透明度避免白雾)
│   │
│   ├── 热点交互层 (Hotspot Layer, z-30)
│   │   ├── 热点按钮 ×N
│   │   │   ├── 脉冲圆环 (激活态, ping 动画)
│   │   │   ├── 悬停圆环 (未激活态, scale+opacity 过渡)
│   │   │   ├── 中心圆点 (激活时变强调色+shadow 发光)
│   │   │   └── 标签气泡 (悬停显示热点标题, backdrop-blur-md)
│   │   └── HotspotPreview (桌面端热点悬停预览卡片, z-60, 详见 2.5 节)
│   │
│   ├── 瞄准框 (Target Reticle, 热点激活时显示, z-30)
│   │   └── 四角 L 形边框 + 十字线
│   │
│   ├── DetailCard (热点详情卡片, 热点激活时显示, z-50)
│   │
│   └── 右侧边栏 (Sidebar, z-50, bg-background/90 backdrop-blur-xl)
│       ├── 收起态 (60px 宽)
│       │   ├── 展开按钮 (ChevronLeft)
│       │   └── 热点编号列表 (01/02/03)
│       └── 展开态 (320px 宽)
│           ├── 标题 "区域分析" + 收起按钮 (ChevronRight / X)
│           ├── 热点列表项 ×N
│           │   ├── 左侧强调色竖条
│           │   ├── 缩略图 (mix-blend-overlay 叠色)
│           │   └── 编号 + 标题
│           └── 底部状态栏 (在线 + 版本号)
│
├── 移动端菜单按钮 (右下角浮动, List 图标)
│
└── 底部坐标信息 (mix-blend-difference, paddingRight 随侧边栏宽度适配)
    ├── 镜头_ID
    └── 坐标 (热点位置 / "扫描中...")
```

**关键交互**:
- 点击热点 → 背景图低透明度+模糊+灰度（显示 GridOverlay）、瞄准框定位、DetailCard 弹出
- 桌面端热点悬停 → HotspotPreview 预览卡片跟随鼠标显示（含预览图 + 标题）
- 移动端点击热点 → 14px 级触摸热区触发，竖版弹出底部抽屉，横版弹出右侧详情面板
- 侧边栏悬停/点击 → 展开/收起；移动端通过右下角菜单按钮打开
- 返回按钮 → 回到 GALLERY 状态

---

### 2.5 热点悬停预览 — HotspotPreview

**文件**: `src/components/pages/HotspotPreview.tsx`
**位置**: SceneViewer 热点交互层内，z-60，仅桌面端显示

```
HotspotPreview
└── 预览容器 (fixed, pointer-events-none, clip-path + opacity 过渡)
    ├── 预览卡片 (w-64, bg-black/80, backdrop-blur-xl, rounded-xl)
    │   ├── 预览图片 (aspect-[4/3], hover 时 scale 100→100)
    │   ├── 渐变遮罩 (from-black/70 via-black/10 to-transparent)
    │   └── 标题栏 (标题 + "PREVIEW" 标签)
    └── 连接线 (h-4, 白色渐变, 从卡片底部到鼠标方向)
```

**技术要点**:
- `requestAnimationFrame` + 线性插值 (LERP 0.14) 平滑跟随鼠标
- 视口边界限制: X [160, viewport-120], Y [220, viewport-120]
- 基于水平速度的旋转效果: `velocityX * 0.08`，限制 ±6°
- 展示/隐藏: `clip-path inset` + `opacity` 过渡 (380ms / 240ms)
- `prefers-reduced-motion` 时直接设置位置，无 LERP 插值

---

### 2.6 滚动驱动视频 — ScrollVideo

**文件**: `src/components/ui/ScrollVideo.tsx`
**位置**: HomeSelection 第一组卡片下方
**动画引擎**: GSAP ScrollTrigger (`gsap` + `gsap/ScrollTrigger`)

```
ScrollVideo
├── 背景辉光 (radial-gradient, accentColor 33%, opacity 20%)
├── 视频元素 (autoplay, loop, muted, playsInline)
│   [GSAP ScrollTrigger] scale 0.6→1, opacity 0.5→1 (start: top 90%, end: top 30%, scrub 0.5)
├── 加载状态 (旋转边框, accentColor)
└── 标题覆盖层 (底部渐变, GSAP ScrollTrigger opacity+y 淡入)
    ├── 副标题 (mono 9px, accentColor)
    └── 主标题 + "// DEMO" 后缀
```

**技术要点**:
- `IntersectionObserver` 离屏暂停 / 入屏播放 (threshold 0.1)
- `gsap.context()` 包裹，清理时 `ctx.revert()`
- `video.muted = true` + `playsInline` 确保自动播放策略兼容

---

## 3. 通用组件 UI Map

### 3.1 背景覆盖层 — GridOverlay

**文件**: `src/components/layout/GridOverlay.tsx`
**位置**: 全局常驻，z-0，pointer-events-none
**Props**: `accentColor` (悬停/选中强调色), `hotspotFocus` (热点焦点坐标)

```
GridOverlay
├── 动态背景能量 (彩色模糊光斑)
│   ├── 左上光斑 (primaryColor, 5s 浮动动画)
│   ├── 右下光斑 (secondaryColor, 7s 反向浮动)
│   └── 中心脉冲光晕
│
├── 数字噪点纹理 (SVG feTurbulence)
│
├── 地形等高线纹理 (SVG 位移变形线条, 120s 缓慢漂移)
│
├── 扫描线 (水平 2px 光线, 4s 垂直循环扫描)
│
├── 四角数据覆盖层 (闪烁动画)
│   ├── 左上: 方块 + "SYS.MONITOR" / "TARGET_LOCKED" (热点激活时切换)
│   ├── 右上: "R + REC" (强调色)
│   ├── 左下: "COORD: xx.xx" 坐标 (热点激活时显示实际坐标)
│   └── 右下: "MEM: 64TB" + 脉冲圆点
│
├── 动态瞄准环 (跟随热点焦点或居中)
│   ├── 外圈 (实线, 热点激活时强调色, 700ms 过渡)
│   ├── 内圈 (虚线, 热点激活时 2s 旋转 / 默认 20s 旋转)
│   └── [焦点态] 十字线 + ping 脉冲
│
└── 暗角效果 (Vignette, 亮色模式低透明度)
```

**颜色逻辑**:
- 默认: primaryColor = `#00F0FF` (Electric Blue), secondaryColor = `#FF003C` (Neon Red)
- 有 accentColor: primaryColor = accentColor, secondaryColor = accentColor
- 热点激活: primaryColor = `#FFFFFF`, secondaryColor = `#00F0FF` (高对比分析模式)

**视觉特征**: 全屏背景层，有缓慢移动的彩色光斑、扫描线、四角闪烁文字、中心旋转虚线环

---

### 3.2 详情卡片 — DetailCard

**文件**: `src/components/ui/DetailCard.tsx`
**Props**: `hotspot`, `onClose`, `sceneTitle`, `accentColor`, `isMobile`, `onExpand`

```
DetailCard
├── 浮动卡片态 (默认)
│   ├── 移动端: 底部抽屉样式 (rounded-t-xl, max-h-75vh, slide-in-from-bottom)
│   ├── 桌面端: 浮动卡片样式 (w-80, backdrop-blur-xl, zoom-in-95)
│   ├── 移动端拖拽手柄 (顶部圆角条)
│   ├── 扫描线动画 (半透明覆盖)
│   ├── 头部栏 (ScanLine 图标 + "细节_区块_hX" + 关闭按钮, sticky backdrop-blur-md；关闭按钮满足触摸尺寸)
│   ├── 缩略图区 (aspect-video, 悬停放大+展开提示 "展开视图")
│   ├── 描述文字 (左边框引用样式)
│   └── 底部装饰 (网格坐标 / 安全连接, 桌面端显示)
│
├── 全屏展开态 (Portal 挂载到 body, z-100)
│   ├── Wipe 转场动画 (双层色彩擦除: foreground + accentColor)
│   ├── 关闭按钮 (右上角, 延迟 500ms 显示)
│   ├── 左侧: 3D 视口 (始终显示 ModelViewer)
│   │   ├── ModelViewer (modelUrl 有效时加载 GLTF, 否则显示占位模型)
│   │   └── 全屏按钮 (Maximize2, 右上角)
│   └── 右侧: 信息面板
│       ├── 标签 "3D_模型_视图" + Box 图标
│       ├── 标题
│       ├── 分隔线
│       ├── 描述文字
│       └── "关闭视图" 按钮
│
└── 全屏 3D 查看器 (Portal 挂载到 body)
    └── FullscreenModelViewer
```

**关键交互**:
- 点击缩略图 → 全屏展开 (Wipe 转场)
- 展开态始终显示 ModelViewer (内部自动判断加载 GLTF 或占位模型)
- 点击全屏按钮 → FullscreenModelViewer

---

### 3.3 3D 模型查看器 — ModelViewer

**文件**: `src/components/ui/ModelViewer.tsx`
**Props**: `accentColor`, `modelUrl?`, `className?`, `showHud?`, `hudPadding?`

```
ModelViewer
├── Three.js Canvas (透明背景, camera: position[3,2,5] fov=45)
│   ├── SceneContent
│   │   ├── 环境光 (0.4) + 方向光 (0.8) + 点光源 (0.3, 强调色)
│   │   ├── Suspense 加载态 (旋转边框 + "加载模型..." 文字)
│   │   ├── [modelUrl 有效] LoadedModel (useGLTF 加载, 自动居中+缩放)
│   │   ├── [modelUrl 无效/空] PlaceholderModel
│   │   │   ├── Float 包裹 (speed 1.5, rotationIntensity 0.2, floatIntensity 0.5)
│   │   │   ├── 十二面体 (MeshDistortMaterial, distort 0.15, speed 2)
│   │   │   ├── 线框十二面体 (opacity 0.15)
│   │   │   ├── 内光环 (ringGeometry 2.2-2.25, opacity 0.3)
│   │   │   └── 外光环 (ringGeometry 2.6-2.63, opacity 0.1)
│   │   └── GridFloor (gridHelper 20x20, 强调色)
│   ├── OrbitControls (禁止平移, 阻尼 0.05, 距离 3-12)
│   └── Environment (city 预设)
│
├── useResolvedModelUrl (Hook)
│   └── HEAD 请求验证 modelUrl, 拒绝 text/html 响应, 无效时返回 null
│
└── HUD 覆盖层 (可选显示, 可自定义 padding)
    ├── 左上: 脉冲圆点 + "3D_VIEWPORT"
    ├── 右上: 旋转角度 ROT X/Y°
    ├── 左下: "ORBIT_CTRL"
    └── 右下: 圆点 + "LIVE"
```

---

### 3.4 全屏 3D 模型弹窗 — FullscreenModelViewer

**文件**: `src/components/ui/FullscreenModelViewer.tsx`
**Props**: `title`, `description`, `accentColor`, `modelUrl?`, `onClose`, `isMobile?`

```
FullscreenModelViewer
├── 背景遮罩 (点击关闭, bg-background/95 backdrop-blur-md)
├── Wipe 转场动画 (双层: foreground + accentColor)
├── 关闭按钮 (右上角, 延迟 500ms 显示)
├── 左侧: 3D 视口 (ModelViewer, showHud, hudPadding 48px)
│   └── 左上角徽章 "全屏_3D_视图" (Maximize 图标)
└── 右侧: 信息面板
    ├── 标题 + 分隔线
    ├── 描述
    ├── 操作指南 (左键拖拽旋转 / 滚轮缩放)
    └── "关闭查看器" 按钮
```

**响应式**: 移动端信息面板 `max-h-[55vh]` + 顶部拖拽手柄

---

### 3.5 音频播放器 — AudioPlayer

**文件**: `src/components/layout/AudioPlayer.tsx`
**位置**: 固定左下角，z-50

```
AudioPlayer
├── 隐藏态 (仅显示 Music 图标小按钮)
│
├── 收起态 (默认)
│   ├── 图标按钮 (Music / ChevronDown)
│   ├── 播放状态脉冲圆点 (emerald-400)
│   └── 状态文字 "PLAYING" / "PAUSED"
│
└── 展开态 (悬停/点击展开, 3s 无交互自动收起)
    ├── 进度条 (可点击跳转, 悬停显示拖拽圆点, emerald-500)
    ├── 时间显示 (当前 / 总时长)
    ├── 播放/暂停按钮 (绿色/红色状态)
    ├── 音量控制 (图标 + 滑块)
    └── 隐藏按钮 (ChevronDown)
```

**快捷键**: Space 播放/暂停 | M 静音 | Esc 隐藏
**配置**: `BGM_CONFIG` (url, volume 0.3, autoPlay true)
**页面生命周期**: 切到其他标签页或窗口后台时暂停；返回页面时仅恢复由页面隐藏导致的暂停；刷新、关闭或跳转离开时暂停音频

---

### 3.6 自定义光标 — CustomCursor

**文件**: `src/components/layout/CustomCursor.tsx`
**位置**: 固定定位，z-300，pointer-events-none
**依赖**: `useMouseEffects` Hook（`isSupported` 检测）

```
CustomCursor
├── 外层光标 (fixed, 黄绿色 #CCFF00 方块)
│   ├── 初始态: scale 12/36 (小方块)
│   ├── 悬停态: scale 48/36 (放大反馈，首页作品集卡片通过 `data-cursor` 触发)
│   └── 按压态: scale 24/36 (中等尺寸)
└── 内层圆点 (黑色 10×10, 悬停/按压时显示)
```

**交互逻辑**:
- `pointermove` → `gsap.quickTo` 跟随鼠标（duration 0.35s, power3.out）
- `mouseover/mouseout` → 检测 `INTERACTIVE_SELECTOR`（a, button, [role="button"] 等）切换悬停态
- `mousedown/mouseup` → 按压态反馈
- `mouseleave/mouseenter` → 光标显隐
- `prefers-reduced-motion` 或 `pointer: coarse` → 自动禁用，回退系统光标

---

### 3.7 滚动翻页时钟 — RollingClock

**文件**: `src/components/ui/RollingClock.tsx`
**位置**: HomeSelection Hero 区域右下角

```
RollingClock
└── 8 位字符 (HH:MM:SS)
    ├── 数字位: RollingDigit
    │   ├── 当前数字 (渐变文字 + WebkitTextStroke 描边)
    │   └── 切换动画 (GSAP timeline: 旧数字 yPercent -100 淡出, 新数字 yPercent 100→0 淡入)
    └── 分隔符 ":" (渐变文字, 固定宽度 0.3em)
```

**技术要点**:
- `setInterval(update, 1000)` 每秒更新
- `useMemo` 缓存 digits 数组，避免每秒重建
- RollingDigit 内部用 DOM 操作 + GSAP timeline 实现翻页，完成后 `remove()` 临时节点

---

## 4. 全局 UI 元素

### 4.1 全屏转场覆盖层 (TransitionOverlay)

**文件**: `src/App.tsx` (内联渲染)
**触发**: 页面导航时 (navigate 函数)

```
TransitionOverlay (z-100, pointer-events-none)
├── 前景层 (bg-surface, slide-in/out, 0.5s, cubic-bezier(0.87,0,0.13,1))
├── 强调色层 (bg=transitionColor, slide-in/out, 0.6s, 0.05s 延迟)
└── 背景层 (bg-background, slide-in/out, 0.6s)
```

**动画**: slide-in (从右滑入) → 状态切换 → slide-out (向左滑出)
**颜色来源**: 集合颜色 / 场景转场颜色 / 默认白色

### 4.2 底部微光进度条 (ShimmerBar)

**文件**: `src/App.tsx` (内联渲染)
**位置**: 固定底部居中，z-50，pointer-events-none

```
ShimmerBar
└── h-1 × w-24 的容器 (bg-border/20)
    └── 半宽前景条 (bg-foreground/30, shimmer 2s 动画)
```

### 4.3 CSS 自定义属性（暗色唯一主题）

**文件**: `index.html`

| 变量 | 值 |
|---|---|
| `--background` | `5 5 5` (深黑) |
| `--surface` | `24 24 27` (锌灰) |
| `--foreground` | `255 255 255` (白) |
| `--muted` | `156 163 175` (灰400) |
| `--border` | `255 255 255` (白+透明度) |

**index.html 保留的 CSS**:
- `fadeIn` 关键帧 (AudioPlayer 展开)
- 自定义滚动条样式
- Range 滑块样式 (emerald-500)
- `prefers-reduced-motion` 媒体查询 (禁用 animate-ping/pulse/fadeIn 和 transition-all)

### 4.4 强调色系统

**文件**: `src/constants.ts`

| 色名 | 色值 | 使用场景 |
|---|---|---|
| NEON_RED | `#FF003C` | C-01, C-11, C-18 |
| ACID_GREEN | `#CCFF00` | C-02, C-10, Hero区 |
| ELECTRIC_BLUE | `#00F0FF` | C-04, C-12, C-15, 默认GridOverlay |
| WARNING_YELLOW | `#FCEE0A` | C-03, C-13 |
| PLASMA_PURPLE | `#BD00FF` | C-05, C-14 |
| MECHANICAL_ORANGE | `#FF8C00` | C-06, C-09 |
| CYBER_WHITE | `#E0E0E0` | C-08, C-16 |
| TOXIC_TEAL | `#00FFA3` | C-07, C-17 |

---

## 5. 视觉特征反查索引

> 看到界面上的某个视觉元素，通过特征描述快速定位到组件。

| 视觉特征 | 所属组件 | 文件路径 |
|---|---|---|
| 超大实时时钟 (渐变文字) | HeroSection → Hero 时钟 | `src/components/pages/HeroSection.tsx` |
| 荧光绿斜切标签 "作品集 // LKC218" (3D 倾斜+视差+高光扫过+scramble) | HeroSection → 斜切标语 | `src/components/pages/HeroSection.tsx` |
| 巨型半透明背景字 "Environment Art" (SplitText 字符 stagger 入场) | HeroSection → 大文本 | `src/components/pages/HeroSection.tsx` |
| 首页顶栏 玻璃态 + 流动渐变 (GSAP 驱动流光线+光晕) | HeroSection → Header | `src/components/pages/HeroSection.tsx` |
| 首页顶栏 鼠标移动时标题 3D 倾斜+视差 | HeroSection → Header | `src/components/pages/HeroSection.tsx` |
| Hero 大图轮播 (多张首页大图自动切换) | HeroSection → 背景轮播 | `src/components/pages/HeroSection.tsx` |
| 点阵噪声覆盖层 (ASCII 字符网格, hover 增密) | HeroSection → 点阵噪声 | `src/components/pages/HeroSection.tsx` |
| HUD 文本 hover 乱码解码 (scramble 效果) | HeroSection → HUD | `src/components/pages/HeroSection.tsx` |
| 作品集卡片 (悬停边线展开+中心旋转方框) | HomeSelection → 卡片 | `src/components/pages/HomeSelection.tsx` |
| 滚动大字字幕条 | HomeSelection → Marquee Divider | `src/components/pages/HomeSelection.tsx` |
| 画廊入场 clip-path 揭示动画 | Gallery → 全局 | `src/components/pages/Gallery.tsx` |
| 横向弹性伸缩场景卡片 | Gallery → 场景卡片 | `src/components/pages/Gallery.tsx` |
| 底部状态栏 (ONLINE / REC / VER) | Gallery → Footer | `src/components/pages/Gallery.tsx` |
| 场景大图 + 可点击热点圆点 | SceneViewer → 热点层 | `src/components/pages/SceneViewer.tsx` |
| 热点悬停预览卡片 (跟随鼠标+LERP+旋转) | HotspotPreview | `src/components/pages/HotspotPreview.tsx` |
| 热点激活时背景变暗+模糊 (GridOverlay 穿透显示) | SceneViewer → 主视口 | `src/components/pages/SceneViewer.tsx` |
| 四角 L 形瞄准框 | SceneViewer → Reticle | `src/components/pages/SceneViewer.tsx` |
| 右侧可收起侧边栏 (热点列表) | SceneViewer → Sidebar | `src/components/pages/SceneViewer.tsx` |
| 热点详情浮动卡片 | DetailCard | `src/components/ui/DetailCard.tsx` |
| 全屏3D展开弹窗 (Wipe转场, 始终显示 ModelViewer) | DetailCard → 展开态 | `src/components/ui/DetailCard.tsx` |
| 3D 十二面体占位模型 (线框+光环+Float浮动) | ModelViewer → PlaceholderModel | `src/components/ui/ModelViewer.tsx` |
| GLTF 模型加载 (自动居中缩放) | ModelViewer → LoadedModel | `src/components/ui/ModelViewer.tsx` |
| 全屏3D查看器 (含操作指南) | FullscreenModelViewer | `src/components/ui/FullscreenModelViewer.tsx` |
| 滚动驱动视频 (ScrollTrigger 缩放+标题淡入) | ScrollVideo | `src/components/ui/ScrollVideo.tsx` |
| 缓慢移动的彩色光斑背景 | GridOverlay → 能量光斑 | `src/components/layout/GridOverlay.tsx` |
| 水平扫描线 (垂直循环) | GridOverlay → Scanner Beam | `src/components/layout/GridOverlay.tsx` |
| 四角闪烁文字 (SYS.MONITOR / TARGET_LOCKED) | GridOverlay → 数据覆盖层 | `src/components/layout/GridOverlay.tsx` |
| 中心旋转虚线瞄准环 | GridOverlay → 动态瞄准环 | `src/components/layout/GridOverlay.tsx` |
| 地形等高线纹理 (缓慢漂移) | GridOverlay → 等高线 | `src/components/layout/GridOverlay.tsx` |
| 左下角音频播放器 (绿/红状态) | AudioPlayer | `src/components/layout/AudioPlayer.tsx` |
| 黄绿色方形光标跟随鼠标 (悬停放大+内层黑点) | CustomCursor | `src/components/layout/CustomCursor.tsx` |
| Hero 区域右下角超大实时时钟 (翻页数字) | RollingClock | `src/components/ui/RollingClock.tsx` |
| 全屏三色层滑入/滑出转场 | App → TransitionOverlay | `src/App.tsx` |
| 底部居中微光进度条 | App → ShimmerBar | `src/App.tsx` |

---

## 6. 组件依赖关系

```
App
 ├── GridOverlay (无依赖)
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
 ├── CustomCursor (useMouseEffects → gsap)
 └── RollingClock (gsap)
```

**外部依赖**:
- `gsap` + `@gsap/react` + `gsap/ScrollTrigger` + `gsap/SplitText` — 全局动画引擎 (HomeSelection, HeroSection, Gallery, SceneViewer, ScrollVideo, CustomCursor, RollingClock)
- `lucide-react` — 所有图标 (ArrowRight, Square, Crosshair, X, ScanLine, Maximize2, Box, Music, Volume2, VolumeX, ChevronDown, ChevronLeft, ChevronRight, MoveRight, Plus, List, Scan, Maximize 等)
- `@react-three/fiber` + `@react-three/drei` + `three` — 3D 渲染 (ModelViewer 专用)

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
| 300 | 自定义光标 | CustomCursor |

---

## 8. 设备测试参考

> 测试布局、响应式设计验证、性能基准参考。

### 8.1 真我 GT8（参考设备）

| 项目 | 值 | 备注 |
|---|---|---|
| 设备 | 真我 GT8 | 真机 |
| 物理分辨率 | 1440 × 3136 px | W × H |
| 屏幕密度 (PPI) | 508 | 物理对角线像素 ≈ 3451，对应 ≈ 6.78 英寸 |
| 设备像素比 (DPR) | 3.5 | CSS px → 物理 px 倍率 |
| 测试分辨率 (CSS) | 896 × 411 px | 1440 ÷ 3.5 ≈ 411，3136 ÷ 3.5 = 896 |

**测试场景用途**：

- 移动端布局断点验证（`md:` 断点 768px 上下分别观察）
- 响应式弹性布局适配（侧边栏抽屉、Hero 字号缩放）
- 高 DPR 下纹理/光晕性能基准（`blur 28px` + 大尺寸径向渐变）

### 8.2 计算公式

```
CSS 分辨率 = 物理分辨率 ÷ DPR
物理尺寸(英寸) = √(W² + H²) ÷ PPI
viewport meta 宽度 = 设备独立像素 (CSS px)
```
