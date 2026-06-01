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
│   ├── Gallery (GALLERY 状态)
│   └── SceneViewer (VIEWER 状态)
│       └── DetailCard (热点详情卡片)
│           ├── ModelViewer (3D 模型查看器)
│           └── FullscreenModelViewer (全屏 3D 弹窗)
│               └── ModelViewer (复用)
├── ThemeToggle (主题切换 - 全局常驻)
├── AudioPlayer (音频播放器 - 全局常驻)
└── [全局] 底部微光进度条 (ShimmerBar)
```

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

```
HomeSelection
├── 顶部标题栏 (Header)
│   ├── 脉冲圆点 + "场景目录" 标签
│   ├── 大标题 "作品集 集合" (渐变文字)
│   └── 右侧元数据 (TOTAL_SECTORS / SCROLL_MODE)
│
├── Hero 区域 (占 85-90vh)
│   ├── 背景图片层 (视差滚动)
│   ├── 渐变遮罩 + 点阵覆盖层
│   ├── 巨型背景文字 "Environment Art" (半透明叠加)
│   ├── 荧光绿横条装饰线
│   ├── 左下角命令行文字 (ACCESS_GRANTED + 路径)
│   └── 右下角
│       ├── 实时时钟 (超大字号渐变文字)
│       ├── 荧光绿斜切标签 "作品集 // LKC218"
│       └── 版本号 "LIVE // Personal Work"
│
├── 作品集卡片网格 (每组3张，分页排列)
│   └── 作品集卡片 ×N
│       ├── 背景图片 (悬停放大 + 扫描线覆盖)
│       ├── 渐变底部遮罩
│       ├── 左上角 ID 标签 (如 "C-01") + 强调色横线
│       ├── 中心旋转方框图标 (悬停显示)
│       ├── 底部文字区 (subtitle / title / description)
│       ├── "ACCESS DATA" 按钮 (悬停显示)
│       └── 上下强调色边线 (悬停展开)
│
├── 滚动字幕分隔条 (Marquee Divider)
│   └── 重复大字 "Environment_Art /// Collection_0X" (滚动驱动位移)
│
└── 页脚终止标记 (竖线 + "End" + 圆点)
```

**关键交互**:
- 卡片悬停 → 背景图片放大/去灰度、强调色边线展开、中心图标旋转显示
- 滚动 → Hero 背景视差、字幕分隔条水平位移
- 点击卡片 → 触发 `onSelect`，进入 GALLERY 状态

---

### 2.2 画廊 — Gallery

**文件**: `src/components/pages/Gallery.tsx`

```
Gallery
├── 全局标题栏 (Header, 固定高度 h-20/h-24)
│   ├── 左侧
│   │   ├── 红色脉冲圆点 + "Unity_READY" 标签
│   │   └── 作品集标题 + ID
│   └── 右侧
│       ├── 元数据 (GRID_X / GRID_Y / FPS)
│       └── 返回按钮 (ArrowLeft 图标)
│
├── 场景卡片网格 (横向弹性伸缩布局)
│   └── 场景卡片 ×N (flex-1, 悬停 flex-[3])
│       ├── 背景图片 (暗模式灰度+低亮度，悬停恢复)
│       ├── 渐变遮罩
│       ├── 网格图案覆盖层 (悬停显示)
│       ├── 强调色边框 (悬停显示)
│       ├── 左上角 Sector ID + 强调色标签
│       ├── 右上角旋转十字准星图标
│       ├── 底部内容区
│       │   ├── 强调色分隔线
│       │   ├── 英文副标题
│       │   ├── 中文主标题
│       │   └── [悬停展开] 描述文字 + "进入场景" 按钮
│       └── 移动端触摸指示器 (Plus 图标圆圈)
│
└── 底部状态栏 (Footer StatusBar)
    ├── 左侧: 绿色圆点 + ONLINE + SECURE_CONNECTION
    └── 右侧: REC 数量 + VER 版本号
```

**关键交互**:
- 卡片悬停 → 弹性伸缩(flex-[3])、边框高亮、描述展开
- 点击卡片 → 触发 `onSelect`，进入 VIEWER 状态
- 返回按钮 → 回到 HOME 状态

---

### 2.3 场景查看器 — SceneViewer

**文件**: `src/components/pages/SceneViewer.tsx`

```
SceneViewer
├── 顶部信息栏 (TopBar, 绝对定位)
│   ├── 返回按钮 (ArrowLeft, 悬停变强调色)
│   ├── 分隔线
│   └── 场景标题 + 脉冲圆点 + 副标题
│
├── 主视口 (Main Viewport)
│   ├── 背景大图 (热点激活时模糊+灰度+半透明)
│   ├── 内部网格覆盖层
│   ├── 暗角效果 (Vignette)
│   │
│   ├── 热点交互层 (Hotspot Layer)
│   │   └── 热点按钮 ×N
│   │       ├── 脉冲圆环 (激活态)
│   │       ├── 悬停圆环 (未激活态)
│   │       ├── 中心圆点 (激活时变强调色+发光)
│   │       └── 标签气泡 (悬停显示热点标题)
│   │
│   ├── 瞄准框 (Target Reticle, 热点激活时显示)
│   │   └── 四角 L 形边框 + 十字线
│   │
│   ├── DetailCard (热点详情卡片, 热点激活时显示)
│   │
│   └── 右侧边栏 (Sidebar)
│       ├── 收起态 (60px 宽)
│       │   ├── 展开按钮 (ChevronLeft)
│       │   └── 热点编号列表 (01/02/03)
│       └── 展开态 (320px 宽)
│           ├── 标题 "区域分析" + 收起按钮
│           ├── 热点列表项 ×N
│           │   ├── 左侧强调色竖条
│           │   ├── 缩略图
│           │   └── 编号 + 标题
│           └── 底部状态栏 (在线 + 版本号)
│
├── 移动端菜单按钮 (右下角浮动)
│
└── 底部坐标信息 (mix-blend-difference)
    ├── 镜头_ID
    └── 坐标 (热点位置 / "扫描中...")
```

**关键交互**:
- 点击热点 → 背景图模糊、瞄准框定位、DetailCard 弹出
- 侧边栏悬停/点击 → 展开/收起
- 返回按钮 → 回到 GALLERY 状态

---

## 3. 通用组件 UI Map

### 3.1 背景覆盖层 — GridOverlay

**文件**: `src/components/layout/GridOverlay.tsx`
**位置**: 全局常驻，z-0，pointer-events-none

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
│   ├── 左上: 方块 + "SYS.MONITOR" / "TARGET_LOCKED"
│   ├── 右上: "R + REC" (强调色)
│   ├── 左下: "COORD: xx.xx" 坐标
│   └── 右下: "MEM: 64TB" + 脉冲圆点
│
├── 动态瞄准环 (跟随热点焦点或居中)
│   ├── 外圈 (实线, 热点激活时强调色)
│   ├── 内圈 (虚线, 旋转动画)
│   └── [焦点态] 十字线 + ping 脉冲
│
└── 暗角效果 (Vignette)
```

**视觉特征**: 全屏背景层，有缓慢移动的彩色光斑、扫描线、四角闪烁文字、中心旋转虚线环

---

### 3.2 详情卡片 — DetailCard

**文件**: `src/components/ui/DetailCard.tsx`

```
DetailCard
├── 浮动卡片态 (默认)
│   ├── 移动端拖拽手柄 (顶部圆角条)
│   ├── 扫描线动画 (半透明覆盖)
│   ├── 头部栏 (ScanLine 图标 + "细节_区块_hX" + 关闭按钮)
│   ├── 缩略图区 (aspect-video, 悬停放大+展开提示)
│   ├── 描述文字 (左边框引用样式)
│   └── 底部装饰 (网格坐标 / 安全连接)
│
├── 全屏展开态 (Portal 挂载到 body)
│   ├── Wipe 转场动画 (双层色彩擦除)
│   ├── 关闭按钮 (右上角, 延迟显示)
│   ├── 左侧: 大图 / 3D 视口
│   │   ├── [有模型] ModelViewer + 全屏按钮
│   │   └── [无模型] 大图展示
│   └── 右侧: 信息面板
│       ├── 标签 (3D_模型_视图 / 高分辨率_视图)
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
- 有 modelUrl 时 → 显示 3D 模型 + 全屏按钮
- 点击全屏按钮 → FullscreenModelViewer

---

### 3.3 3D 模型查看器 — ModelViewer

**文件**: `src/components/ui/ModelViewer.tsx`

```
ModelViewer
├── Three.js Canvas (透明背景)
│   ├── 环境光 + 方向光 + 点光源 (强调色)
│   ├── 占位模型 (十二面体 + 扭曲材质 + 线框 + 光环)
│   ├── 网格地面 (GridHelper)
│   ├── OrbitControls (禁止平移, 阻尼)
│   └── Environment (city 预设)
│
└── HUD 覆盖层 (可选显示)
    ├── 左上: 脉冲圆点 + "3D_VIEWPORT"
    ├── 右上: 旋转角度 ROT X/Y
    ├── 左下: "ORBIT_CTRL"
    └── 右下: 圆点 + "LIVE"
```

---

### 3.4 全屏 3D 模型弹窗 — FullscreenModelViewer

**文件**: `src/components/ui/FullscreenModelViewer.tsx`

```
FullscreenModelViewer
├── 背景遮罩 (点击关闭)
├── Wipe 转场动画 (双层)
├── 关闭按钮 (右上角, 延迟显示)
├── 左侧: 3D 视口 (ModelViewer)
│   └── 左上角徽章 "全屏_3D_视图"
└── 右侧: 信息面板
    ├── 标题 + 分隔线
    ├── 描述
    ├── 操作指南 (左键拖拽旋转 / 滚轮缩放)
    └── "关闭查看器" 按钮
```

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
│   ├── 播放状态脉冲圆点
│   └── 状态文字 "PLAYING" / "PAUSED"
│
└── 展开态 (悬停/点击展开)
    ├── 进度条 (可点击跳转, 悬停显示拖拽圆点)
    ├── 时间显示 (当前 / 总时长)
    ├── 播放/暂停按钮 (绿色/红色状态)
    ├── 音量控制 (图标 + 滑块)
    └── 隐藏按钮 (ChevronDown)
```

**快捷键**: Space 播放/暂停 | M 静音 | Esc 隐藏

---

### 3.6 主题切换 — ThemeToggle

**文件**: `src/components/layout/ThemeToggle.tsx`
**位置**: 固定左下角（AudioPlayer 上方），z-50

```
ThemeToggle
└── 切换按钮
    ├── 图标 (Moon / Sun)
    └── 悬停展开文字 "DARK" / "LIGHT"
```

---

## 4. 全局 UI 元素

### 4.1 全屏转场覆盖层 (TransitionOverlay)

**文件**: `src/App.tsx` (内联渲染)
**触发**: 页面导航时 (navigate 函数)

```
TransitionOverlay (z-100, pointer-events-none)
├── 前景层 (bg-surface, slide-in/out, 0.5s)
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
└── 1px 高 × 96px 宽的容器
    └── 半宽前景条 (shimmer 动画)
```

### 4.3 CSS 自定义属性 (主题色)

**文件**: `index.html`

| 变量 | 亮色模式 | 暗色模式 |
|---|---|---|
| `--background` | `245 243 240` (暖米白) | `5 5 5` (深黑) |
| `--surface` | `255 253 250` (柔奶油白) | `24 24 27` (锌灰) |
| `--foreground` | `28 25 23` (暖深棕黑) | `255 255 255` (白) |
| `--muted` | `120 113 108` (暖灰) | `156 163 175` (灰400) |
| `--border` | `214 211 209` (暖灰边框) | `255 255 255` (白+透明度) |

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
| 超大实时时钟 (渐变文字) | HomeSelection → Hero 时钟 | `src/components/pages/HomeSelection.tsx` |
| 荧光绿斜切标签 "作品集 // LKC218" | HomeSelection → Hero 标语 | `src/components/pages/HomeSelection.tsx` |
| 巨型半透明背景字 "Environment Art" | HomeSelection → Hero 背景字 | `src/components/pages/HomeSelection.tsx` |
| 作品集卡片 (悬停边线展开+中心旋转方框) | HomeSelection → 卡片 | `src/components/pages/HomeSelection.tsx` |
| 滚动大字字幕条 | HomeSelection → Marquee Divider | `src/components/pages/HomeSelection.tsx` |
| 横向弹性伸缩场景卡片 | Gallery → 场景卡片 | `src/components/pages/Gallery.tsx` |
| 底部状态栏 (ONLINE / REC / VER) | Gallery → Footer | `src/components/pages/Gallery.tsx` |
| 场景大图 + 可点击热点圆点 | SceneViewer → 热点层 | `src/components/pages/SceneViewer.tsx` |
| 四角 L 形瞄准框 | SceneViewer → Reticle | `src/components/pages/SceneViewer.tsx` |
| 右侧可收起侧边栏 (热点列表) | SceneViewer → Sidebar | `src/components/pages/SceneViewer.tsx` |
| 热点详情浮动卡片 | DetailCard | `src/components/ui/DetailCard.tsx` |
| 全屏图片/3D展开弹窗 (Wipe转场) | DetailCard → 展开态 | `src/components/ui/DetailCard.tsx` |
| 3D 十二面体 (线框+光环) | ModelViewer → PlaceholderModel | `src/components/ui/ModelViewer.tsx` |
| 全屏3D查看器 (含操作指南) | FullscreenModelViewer | `src/components/ui/FullscreenModelViewer.tsx` |
| 缓慢移动的彩色光斑背景 | GridOverlay → 能量光斑 | `src/components/layout/GridOverlay.tsx` |
| 水平扫描线 (垂直循环) | GridOverlay → Scanner Beam | `src/components/layout/GridOverlay.tsx` |
| 四角闪烁文字 (SYS.MONITOR / REC) | GridOverlay → 数据覆盖层 | `src/components/layout/GridOverlay.tsx` |
| 中心旋转虚线瞄准环 | GridOverlay → 动态瞄准环 | `src/components/layout/GridOverlay.tsx` |
| 地形等高线纹理 (缓慢漂移) | GridOverlay → 等高线 | `src/components/layout/GridOverlay.tsx` |
| 左下角音频播放器 (绿/红状态) | AudioPlayer | `src/components/layout/AudioPlayer.tsx` |
| 左下角主题切换 (月/日图标) | ThemeToggle | `src/components/layout/ThemeToggle.tsx` |
| 全屏三色层滑入/滑出转场 | App → TransitionOverlay | `src/App.tsx` |
| 底部居中微光进度条 | App → ShimmerBar | `src/App.tsx` |

---

## 6. 组件依赖关系

```
App
 ├── GridOverlay (无依赖)
 ├── HomeSelection (无子组件依赖)
 ├── Gallery (无子组件依赖)
 ├── SceneViewer
 │    └── DetailCard
 │         ├── ModelViewer (@react-three/fiber, @react-three/drei, three)
 │         └── FullscreenModelViewer
 │              └── ModelViewer (复用)
 ├── AudioPlayer (无子组件依赖)
 └── ThemeToggle (无子组件依赖)
```

**外部依赖**:
- `lucide-react` — 所有图标 (ArrowRight, Square, Crosshair, X, ScanLine, ZoomIn, Maximize2, Box, Music, Volume2, VolumeX, ChevronDown, Sun, Moon 等)
- `@react-three/fiber` + `@react-three/drei` + `three` — 3D 渲染 (ModelViewer 专用)
- `@google/genai` — Gemini AI 服务 (geminiService，当前未接入 UI)

---

## 7. z-index 层级规范

| z-index | 用途 | 组件 |
|---|---|---|
| 0 | 背景覆盖层 | GridOverlay |
| 10 | 主内容区 | `<main>` |
| 20 | 画廊标题栏 | Gallery Header |
| 30 | 热点交互层 / 卡片内容 | SceneViewer Hotspots |
| 40 | 场景顶部信息栏 | SceneViewer TopBar |
| 50 | DetailCard / 侧边栏 / 全局控件 | DetailCard, Sidebar, AudioPlayer, ThemeToggle |
| 100 | 全屏转场 / 全屏展开态 | TransitionOverlay, DetailCard 展开态 |
| 200 | 全屏 3D 查看器 | FullscreenModelViewer |
