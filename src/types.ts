/**
 * 项目类型定义文件
 * 
 * 定义整个应用中使用的核心数据类型和枚举
 */

/**
 * 热点 (Hotspot)
 * 表示场景中的一个可交互兴趣点
 * 
 * 用途：
 * - 场景查看器中的交互标记点
 * - 点击后显示详细信息卡片
 * - 支持3D模型预览
 */
export interface Hotspot {
  id: string;          // 热点唯一标识符
  x: number;           // X坐标位置 (百分比 0-100)
  y: number;           // Y坐标位置 (百分比 0-100)
  title: string;       // 热点标题
  description: string; // 热点描述文本
  detailImage: string; // 详情图片路径
  modelUrl?: string;   // 可选的3D模型路径 (.glb/.gltf)，未配置时回退为图片显示
}

/**
 * 场景 (Scene)
 * 表示一个完整的场景视图
 * 
 * 用途：
 * - 画廊中的场景卡片
 * - 场景查看器的主视图
 * - 包含多个交互热点
 */
export interface Scene {
  id: string;                // 场景唯一标识符
  title: string;             // 场景标题
  subtitle: string;          // 场景副标题
  description: string;       // 场景描述
  mainImage: string;         // 主图路径
  color: string;             // 主题色 (十六进制颜色值，用于边框、文字高亮、UI控件)
  transitionColor?: string;  // 可选的转场颜色 (进入场景时的全屏动画颜色)
  hotspots: Hotspot[];       // 场景中的热点列表
}

/**
 * 作品集 (Collection)
 * 表示一个作品集/集合
 * 
 * 用途：
 * - 首页的卡片展示
 * - 画廊页面的数据源
 * - 包含多个场景
 */
export interface Collection {
  id: string;          // 作品集唯一标识符
  title: string;       // 作品集标题
  subtitle: string;    // 作品集副标题
  description: string; // 作品集描述
  image: string;       // 封面图路径
  color: string;       // 主题色 (十六进制颜色值)
}

/**
 * 应用状态枚举
 * 控制当前显示的页面
 */
export enum AppState {
  HOME,    // 首页 - 作品集选择
  GALLERY, // 画廊 - 场景列表
  VIEWER   // 查看器 - 场景详情
}