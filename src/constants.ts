
import { Scene, Collection } from './types';

const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;

export const ACCENT_COLORS = {
  NEON_RED: '#FF003C',
  ACID_GREEN: '#CCFF00',
  ELECTRIC_BLUE: '#00F0FF',
  WARNING_YELLOW: '#FCEE0A',
  PLASMA_PURPLE: '#BD00FF',
  MECHANICAL_ORANGE: '#FF8C00',
  CYBER_WHITE: '#E0E0E0',
  TOXIC_TEAL: '#00FFA3',
};

export const PLACEHOLDER_IMAGES = {
  PORTRAIT_1: assetPath('assets/占位符竖板.png'),
  PORTRAIT_2: assetPath('assets/占位符竖板2.png'),
  PORTRAIT_3: assetPath('assets/占位符竖板3.png'),
  PORTRAIT_4: assetPath('assets/占位符竖板4.png'),
  LANDSCAPE: assetPath('assets/占位符横板.png'),
};

const DEFAULT_DETAIL_IMAGES: [string, string, string] = [
  PLACEHOLDER_IMAGES.LANDSCAPE,
  PLACEHOLDER_IMAGES.LANDSCAPE,
  PLACEHOLDER_IMAGES.LANDSCAPE
];

// 背景音乐配置
export const BGM_CONFIG = {
  url: assetPath('assets/audio/bgm_main.mp3'), 
  volume: 0.3,
  autoPlay: true
};

// ==================================================================================
// [作品集列表 (Collections)]
// 这里的 image 对应 "首页" 的封面图
// ==================================================================================
export const COLLECTIONS: Collection[] = [
  // --- PAGE 1 ---
  { id: 'C-01', title: 'BTW_通道1', subtitle: 'BTW_PASSAGE1', description: '1号撤离通道。', color: '#CCFF00',
    image: assetPath('assets/BTW/BTW_Scenes_1_卡片页.jpg') },
  { id: 'C-02', title: 'BTW_通道2', subtitle: 'BTW_PASSAGE2', description: '2号撤离通道。', color: '#FCEE0A',
    // image: '/assets/collections/cover_02.jpg',
    image: PLACEHOLDER_IMAGES.PORTRAIT_2 },
  { id: 'C-03', title: 'BTW_垂直通道', subtitle: 'THE WASTELANDS', description: '垂直燃料管道。', color: ACCENT_COLORS.ELECTRIC_BLUE,
    // image: '/assets/collections/cover_03.jpg',
    image: PLACEHOLDER_IMAGES.PORTRAIT_3 },
  
  // --- PAGE 2 ---
  { id: 'C-04', title: '数字虚空', subtitle: 'DIGITAL VOID', description: '深层网络节点。', color: ACCENT_COLORS.ELECTRIC_BLUE,
    // image: '/assets/collections/cover_04.jpg',
    image: PLACEHOLDER_IMAGES.PORTRAIT_4 },
  { id: 'C-05', title: '地下黑市', subtitle: 'UNDERGROUND MARKET', description: '非法交易地带。', color: ACCENT_COLORS.PLASMA_PURPLE,
    // image: '/assets/collections/cover_05.jpg',
    image: PLACEHOLDER_IMAGES.PORTRAIT_1 },
  { id: 'C-06', title: '重工铸造', subtitle: 'HEAVY FOUNDRY', description: '自动化机械生产线。', color: ACCENT_COLORS.MECHANICAL_ORANGE,
    // image: '/assets/collections/cover_06.jpg',
    image: PLACEHOLDER_IMAGES.PORTRAIT_2 },

  // --- PAGE 3 ---
  { id: 'C-07', title: '深海前哨', subtitle: 'OCEANIC OUTPOST', description: '深渊生物科研站。', color: ACCENT_COLORS.TOXIC_TEAL,
    // image: '/assets/collections/cover_07.jpg',
    image: PLACEHOLDER_IMAGES.PORTRAIT_3 },
  { id: 'C-08', title: '轨道空间站', subtitle: 'ORBITAL STATION', description: '低地轨道枢纽。', color: ACCENT_COLORS.CYBER_WHITE,
    // image: '/assets/collections/cover_08.jpg',
    image: PLACEHOLDER_IMAGES.PORTRAIT_4 },
  { id: 'C-09', title: '地下城', subtitle: 'SUBTERRANEAN CITY', description: '巨大地下蜂巢。', color: ACCENT_COLORS.MECHANICAL_ORANGE,
    // image: '/assets/collections/cover_09.jpg',
    image: PLACEHOLDER_IMAGES.PORTRAIT_1 },

  // --- PAGE 4 ---
  { id: 'C-10', title: '仿生花园', subtitle: 'SYNTHETIC GARDEN', description: '人造自然模拟区。', color: ACCENT_COLORS.ACID_GREEN,
    // image: '/assets/collections/cover_10.jpg',
    image: PLACEHOLDER_IMAGES.PORTRAIT_2 },
  { id: 'C-11', title: '机甲机库', subtitle: 'MECHA HANGAR', description: '巨型作战机甲库。', color: ACCENT_COLORS.NEON_RED,
    // image: '/assets/collections/cover_11.jpg',
    image: PLACEHOLDER_IMAGES.PORTRAIT_3 },
  { id: 'C-12', title: '数据堡垒', subtitle: 'DATA FORTRESS', description: '核心服务器群。', color: ACCENT_COLORS.ELECTRIC_BLUE,
    // image: '/assets/collections/cover_12.jpg',
    image: PLACEHOLDER_IMAGES.PORTRAIT_4 },

  // --- PAGE 5 ---
  { id: 'C-13', title: '隔离扇区', subtitle: 'QUARANTINE SECTOR', description: '病毒封锁区域。', color: ACCENT_COLORS.WARNING_YELLOW,
    // image: '/assets/collections/cover_13.jpg',
    image: PLACEHOLDER_IMAGES.PORTRAIT_1 },
  { id: 'C-14', title: 'AI 蜂巢', subtitle: 'AI HIVE MIND', description: '意识网络节点。', color: ACCENT_COLORS.PLASMA_PURPLE,
    // image: '/assets/collections/cover_14.jpg',
    image: PLACEHOLDER_IMAGES.PORTRAIT_2 },
  { id: 'C-15', title: '能源矩阵', subtitle: 'ENERGY MATRIX', description: '聚变反应堆群。', color: ACCENT_COLORS.ELECTRIC_BLUE,
    // image: '/assets/collections/cover_15.jpg',
    image: PLACEHOLDER_IMAGES.PORTRAIT_3 },

  // --- PAGE 6 ---
  { id: 'C-16', title: '虚空边缘', subtitle: 'VOID EDGE', description: '赛博空间交界。', color: ACCENT_COLORS.CYBER_WHITE,
    // image: '/assets/collections/cover_16.jpg',
    image: PLACEHOLDER_IMAGES.PORTRAIT_4 },
  { id: 'C-17', title: '记忆存储库', subtitle: 'MEMORY BANK', description: '记忆备份档案馆。', color: ACCENT_COLORS.TOXIC_TEAL,
    // image: '/assets/collections/cover_17.jpg',
    image: PLACEHOLDER_IMAGES.PORTRAIT_1 },
  { id: 'C-18', title: '终焉之地', subtitle: 'TERMINUS', description: '旧时代的终点。', color: ACCENT_COLORS.NEON_RED,
    // image: '/assets/collections/cover_18.jpg',
    image: PLACEHOLDER_IMAGES.PORTRAIT_2 }
];

// ==================================================================================
// [场景详细数据 (SCENES_DB)]
// 
// 本地替换说明:
// 1. 在 public/assets/ 下创建对应的 c01, c02 ... c18 文件夹。
// 2. 将您的图片放入对应文件夹。
// 3. 取消对应行 "local:" 的注释，并注释掉原来的 "mainImage" 或 "detailImages"。
//
// 颜色自定义说明:
// - borderColor: 自定义该场景在画廊中的边框颜色和强调色 (覆盖作品集默认颜色)
// - transitionColor: 自定义进入该场景时的全屏转场动画颜色
// ==================================================================================

interface RawSceneConfig {
  id: string;
  title: string;
  subtitle?: string;
  desc?: string;
  mainImage: string;
  detailImages: [string, string, string]; // 必须有3张
  borderColor?: string;     // [可选] 自定义边框颜色 (覆盖默认)
  transitionColor?: string; // [可选] 自定义转场颜色 (覆盖默认)
}

export const SCENES_DB: Record<string, RawSceneConfig[]> = {
  // --------------------------------------------------------------------------------
  // [C-01] 通道1
  // --------------------------------------------------------------------------------
  'C-01': [
    { 
      id: '01', title: '通道1镜头1', 
      // borderColor: '#FFFFFF', // [示例] 强制白色边框
      // transitionColor: '#000000', // [示例] 黑色转场
      mainImage: assetPath('assets/BTW/BTW_Scenes_1_1.jpg'),
      detailImages: DEFAULT_DETAIL_IMAGES
    },
    { id: '02', title: '通道1镜头2', mainImage: assetPath('assets/BTW/BTW_Scenes_1_2.jpg'), detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '03', title: '通道1镜头3', mainImage: assetPath('assets/BTW/BTW_Scenes_1_3.jpg'), detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '04', title: '通道1镜头4', mainImage: assetPath('assets/BTW/BTW_Scenes_1_4.jpg'), detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '05', title: '通道1镜头5', mainImage: assetPath('assets/BTW/BTW_Scenes_1_5.jpg'), detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '06', title: '通道1镜头6', mainImage: assetPath('assets/BTW/BTW_Scenes_1_6.jpg'), detailImages: DEFAULT_DETAIL_IMAGES },
  ],

  // --------------------------------------------------------------------------------
  // [C-02] 通道2
  // --------------------------------------------------------------------------------
  'C-02': [
    { 
      id: '01', title: '通道2镜头1', 
      // local: '/assets/c02/s01_main.jpg',
      mainImage: PLACEHOLDER_IMAGES.PORTRAIT_1, 
      // local: ['/assets/c02/s01_h1.jpg', '/assets/c02/s01_h2.jpg', '/assets/c02/s01_h3.jpg'],
      detailImages: DEFAULT_DETAIL_IMAGES 
    },
    { id: '02', title: '通道2镜头2', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_2, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '03', title: '通道2镜头3', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_3, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '04', title: '通道2镜头4', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_4, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '05', title: '通道2镜头5', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_1, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '06', title: '通道2镜头6', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_2, detailImages: DEFAULT_DETAIL_IMAGES },
  ],

  // --------------------------------------------------------------------------------
  // [C-03] 荒原边境 (THE WASTELANDS)
  // --------------------------------------------------------------------------------
  'C-03': [
    { 
      id: '01', title: '垂直通道镜头1', 
      // local: '/assets/c03/s01_main.jpg',
      mainImage: assetPath('assets/BTW/BTW_Scenes_3_1.jpg'), 
      // local: ['/assets/c03/s01_h1.jpg', '/assets/c03/s01_h2.jpg', '/assets/c03/s01_h3.jpg'],
      detailImages: DEFAULT_DETAIL_IMAGES 
    },
    { id: '02', title: '垂直通道镜头2', mainImage: assetPath('assets/BTW/BTW_Scenes_3_2.jpg'), detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '03', title: '垂直通道镜头3', mainImage: assetPath('assets/BTW/BTW_Scenes_3_3.jpg'), detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '04', title: '垂直通道镜头4', mainImage: assetPath('assets/BTW/BTW_Scenes_3_4.jpg'), detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '05', title: '垂直通道镜头5', mainImage: assetPath('assets/BTW/BTW_Scenes_3_5.jpg'), detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '06', title: '垂直通道镜头6', mainImage: assetPath('assets/BTW/BTW_Scenes_3_6.jpg'), detailImages: DEFAULT_DETAIL_IMAGES },
  ],

  // --------------------------------------------------------------------------------
  // [C-04] 数字虚空 (DIGITAL VOID)
  // --------------------------------------------------------------------------------
  'C-04': [
    { 
      id: '01', title: '核心节点', 
      // local: '/assets/c04/s01_main.jpg',
      mainImage: PLACEHOLDER_IMAGES.PORTRAIT_1,
      // local: ['/assets/c04/s01_h1.jpg', '/assets/c04/s01_h2.jpg', '/assets/c04/s01_h3.jpg'],
      detailImages: DEFAULT_DETAIL_IMAGES
    },
    { id: '02', title: '防火墙边界', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_2, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '03', title: '数据流通道', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_3, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '04', title: '记忆缓存区', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_4, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '05', title: '协议网关', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_1, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '06', title: '逻辑深渊', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_2, detailImages: DEFAULT_DETAIL_IMAGES },
  ],

  // --------------------------------------------------------------------------------
  // [C-05] 地下黑市 (UNDERGROUND MARKET)
  // --------------------------------------------------------------------------------
  'C-05': [
    { 
      id: '01', title: '霓虹入口', 
      // local: '/assets/c05/s01_main.jpg',
      mainImage: PLACEHOLDER_IMAGES.PORTRAIT_1,
      // local: ['/assets/c05/s01_h1.jpg', '/assets/c05/s01_h2.jpg', '/assets/c05/s01_h3.jpg'],
      detailImages: DEFAULT_DETAIL_IMAGES
    },
    { id: '02', title: '义体诊所', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_2, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '03', title: '走私仓库', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_3, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '04', title: '地下面摊', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_4, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '05', title: '废旧回收站', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_1, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '06', title: '隐秘后巷', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_2, detailImages: DEFAULT_DETAIL_IMAGES },
  ],

  // --------------------------------------------------------------------------------
  // [C-06] 重工铸造 (HEAVY FOUNDRY)
  // --------------------------------------------------------------------------------
  'C-06': [
    { 
      id: '01', title: '熔炼中心', 
      // local: '/assets/c06/s01_main.jpg',
      mainImage: PLACEHOLDER_IMAGES.PORTRAIT_1,
      // local: ['/assets/c06/s01_h1.jpg', '/assets/c06/s01_h2.jpg', '/assets/c06/s01_h3.jpg'],
      detailImages: DEFAULT_DETAIL_IMAGES
    },
    { id: '02', title: '机械臂走廊', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_2, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '03', title: '冷却池', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_3, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '04', title: '冲压车间', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_4, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '05', title: '动力室', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_1, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '06', title: '排气管道', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_2, detailImages: DEFAULT_DETAIL_IMAGES },
  ],

  // --------------------------------------------------------------------------------
  // [C-07] 深海前哨 (OCEANIC OUTPOST)
  // --------------------------------------------------------------------------------
  'C-07': [
    { 
      id: '01', title: '深潜气闸', 
      // local: '/assets/c07/s01_main.jpg',
      mainImage: PLACEHOLDER_IMAGES.PORTRAIT_1,
      // local: ['/assets/c07/s01_h1.jpg', '/assets/c07/s01_h2.jpg', '/assets/c07/s01_h3.jpg'],
      detailImages: DEFAULT_DETAIL_IMAGES
    },
    { id: '02', title: '压力测试舱', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_2, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '03', title: '海底观测窗', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_3, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '04', title: '样本分析室', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_4, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '05', title: '氧气循环站', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_1, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '06', title: '黑暗海沟', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_2, detailImages: DEFAULT_DETAIL_IMAGES },
  ],

  // --------------------------------------------------------------------------------
  // [C-08] 轨道空间站 (ORBITAL STATION)
  // --------------------------------------------------------------------------------
  'C-08': [
    { 
      id: '01', title: '停泊码头', 
      // local: '/assets/c08/s01_main.jpg',
      mainImage: PLACEHOLDER_IMAGES.PORTRAIT_1,
      // local: ['/assets/c08/s01_h1.jpg', '/assets/c08/s01_h2.jpg', '/assets/c08/s01_h3.jpg'],
      detailImages: DEFAULT_DETAIL_IMAGES
    },
    { id: '02', title: '重力环廊', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_2, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '03', title: '太阳能阵列', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_3, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '04', title: '指挥舰桥', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_4, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '05', title: '货物传输带', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_1, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '06', title: '星空瞭望台', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_2, detailImages: DEFAULT_DETAIL_IMAGES },
  ],

  // --------------------------------------------------------------------------------
  // [C-09] 地下城 (SUBTERRANEAN CITY)
  // --------------------------------------------------------------------------------
  'C-09': [
    { 
      id: '01', title: '地底广场', 
      // local: '/assets/c09/s01_main.jpg',
      mainImage: PLACEHOLDER_IMAGES.PORTRAIT_1,
      // local: ['/assets/c09/s01_h1.jpg', '/assets/c09/s01_h2.jpg', '/assets/c09/s01_h3.jpg'],
      detailImages: DEFAULT_DETAIL_IMAGES
    },
    { id: '02', title: '垂直农场', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_2, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '03', title: '地热发电机', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_3, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '04', title: '蜂巢居住区', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_4, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '05', title: '污水净化厂', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_1, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '06', title: '岩层隧道', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_2, detailImages: DEFAULT_DETAIL_IMAGES },
  ],

  // --------------------------------------------------------------------------------
  // [C-10] 仿生花园 (SYNTHETIC GARDEN)
  // --------------------------------------------------------------------------------
  'C-10': [
    { 
      id: '01', title: '全息温室', 
      // local: '/assets/c10/s01_main.jpg',
      mainImage: PLACEHOLDER_IMAGES.PORTRAIT_1,
      // local: ['/assets/c10/s01_h1.jpg', '/assets/c10/s01_h2.jpg', '/assets/c10/s01_h3.jpg'],
      detailImages: DEFAULT_DETAIL_IMAGES
    },
    { id: '02', title: '基因培养槽', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_2, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '03', title: '人造瀑布', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_3, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '04', title: '拟态树林', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_4, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '05', title: '种子冷库', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_1, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '06', title: '气候控制室', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_2, detailImages: DEFAULT_DETAIL_IMAGES },
  ],

  // --------------------------------------------------------------------------------
  // [C-11] 机甲机库 (MECHA HANGAR)
  // --------------------------------------------------------------------------------
  'C-11': [
    { 
      id: '01', title: '主机库', 
      // local: '/assets/c11/s01_main.jpg',
      mainImage: PLACEHOLDER_IMAGES.PORTRAIT_1,
      // local: ['/assets/c11/s01_h1.jpg', '/assets/c11/s01_h2.jpg', '/assets/c11/s01_h3.jpg'],
      detailImages: DEFAULT_DETAIL_IMAGES
    },
    { id: '02', title: '武器装配台', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_2, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '03', title: '驾驶模拟舱', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_3, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '04', title: '燃料加注站', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_4, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '05', title: '维修升降机', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_1, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '06', title: '战备通道', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_2, detailImages: DEFAULT_DETAIL_IMAGES },
  ],

  // --------------------------------------------------------------------------------
  // [C-12] 数据堡垒 (DATA FORTRESS)
  // --------------------------------------------------------------------------------
  'C-12': [
    { 
      id: '01', title: '服务器巨塔', 
      // local: '/assets/c12/s01_main.jpg',
      mainImage: PLACEHOLDER_IMAGES.PORTRAIT_1,
      // local: ['/assets/c12/s01_h1.jpg', '/assets/c12/s01_h2.jpg', '/assets/c12/s01_h3.jpg'],
      detailImages: DEFAULT_DETAIL_IMAGES
    },
    { id: '02', title: '冷却矩阵', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_2, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '03', title: '光纤井', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_3, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '04', title: '量子加密室', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_4, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '05', title: '数据档案馆', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_1, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '06', title: '物理防火墙', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_2, detailImages: DEFAULT_DETAIL_IMAGES },
  ],

  // --------------------------------------------------------------------------------
  // [C-13] 隔离扇区 (QUARANTINE SECTOR)
  // --------------------------------------------------------------------------------
  'C-13': [
    { 
      id: '01', title: '隔离关卡', 
      // local: '/assets/c13/s01_main.jpg',
      mainImage: PLACEHOLDER_IMAGES.PORTRAIT_1,
      // local: ['/assets/c13/s01_h1.jpg', '/assets/c13/s01_h2.jpg', '/assets/c13/s01_h3.jpg'],
      detailImages: DEFAULT_DETAIL_IMAGES
    },
    { id: '02', title: '消毒通道', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_2, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '03', title: '临时医疗帐', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_3, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '04', title: '封锁墙', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_4, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '05', title: '废弃街道', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_1, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '06', title: '危险源点', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_2, detailImages: DEFAULT_DETAIL_IMAGES },
  ],

  // --------------------------------------------------------------------------------
  // [C-14] AI 蜂巢 (AI HIVE MIND)
  // --------------------------------------------------------------------------------
  'C-14': [
    { 
      id: '01', title: '神经网络', 
      // local: '/assets/c14/s01_main.jpg',
      mainImage: PLACEHOLDER_IMAGES.PORTRAIT_1,
      // local: ['/assets/c14/s01_h1.jpg', '/assets/c14/s01_h2.jpg', '/assets/c14/s01_h3.jpg'],
      detailImages: DEFAULT_DETAIL_IMAGES
    },
    { id: '02', title: '逻辑门阵列', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_2, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '03', title: '意识上传口', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_3, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '04', title: '虚拟梦境', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_4, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '05', title: '核心处理器', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_1, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '06', title: '散热风扇', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_2, detailImages: DEFAULT_DETAIL_IMAGES },
  ],

  // --------------------------------------------------------------------------------
  // [C-15] 能源矩阵 (ENERGY MATRIX)
  // --------------------------------------------------------------------------------
  'C-15': [
    { 
      id: '01', title: '聚变反应堆', 
      // local: '/assets/c15/s01_main.jpg',
      mainImage: PLACEHOLDER_IMAGES.PORTRAIT_1,
      // local: ['/assets/c15/s01_h1.jpg', '/assets/c15/s01_h2.jpg', '/assets/c15/s01_h3.jpg'],
      detailImages: DEFAULT_DETAIL_IMAGES
    },
    { id: '02', title: '磁场约束环', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_2, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '03', title: '高压变电器', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_3, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '04', title: '能量传输管', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_4, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '05', title: '控制中心', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_1, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '06', title: '废热排放口', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_2, detailImages: DEFAULT_DETAIL_IMAGES },
  ],

  // --------------------------------------------------------------------------------
  // [C-16] 虚空边缘 (VOID EDGE)
  // --------------------------------------------------------------------------------
  'C-16': [
    { 
      id: '01', title: '现实裂缝', 
      // local: '/assets/c16/s01_main.jpg',
      mainImage: PLACEHOLDER_IMAGES.PORTRAIT_1,
      // local: ['/assets/c16/s01_h1.jpg', '/assets/c16/s01_h2.jpg', '/assets/c16/s01_h3.jpg'],
      detailImages: DEFAULT_DETAIL_IMAGES
    },
    { id: '02', title: '乱码风暴', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_2, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '03', title: '边界信标', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_3, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '04', title: '虚无空间', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_4, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '05', title: '错误扇区', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_1, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '06', title: '遗忘之地', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_2, detailImages: DEFAULT_DETAIL_IMAGES },
  ],

  // --------------------------------------------------------------------------------
  // [C-17] 记忆存储库 (MEMORY BANK)
  // --------------------------------------------------------------------------------
  'C-17': [
    { 
      id: '01', title: '记忆存储塔', 
      // local: '/assets/c17/s01_main.jpg',
      mainImage: PLACEHOLDER_IMAGES.PORTRAIT_1,
      // local: ['/assets/c17/s01_h1.jpg', '/assets/c17/s01_h2.jpg', '/assets/c17/s01_h3.jpg'],
      detailImages: DEFAULT_DETAIL_IMAGES
    },
    { id: '02', title: '检索终端', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_2, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '03', title: '记忆回放室', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_3, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '04', title: '情感提取机', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_4, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '05', title: '备份服务器', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_1, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '06', title: '数据墓地', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_2, detailImages: DEFAULT_DETAIL_IMAGES },
  ],

  // --------------------------------------------------------------------------------
  // [C-18] 终焉之地 (TERMINUS)
  // --------------------------------------------------------------------------------
  'C-18': [
    { 
      id: '01', title: '终焉之门', 
      // local: '/assets/c18/s01_main.jpg',
      mainImage: PLACEHOLDER_IMAGES.PORTRAIT_1,
      // local: ['/assets/c18/s01_h1.jpg', '/assets/c18/s01_h2.jpg', '/assets/c18/s01_h3.jpg'],
      detailImages: DEFAULT_DETAIL_IMAGES
    },
    { id: '02', title: '最后的站台', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_2, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '03', title: '纪念碑谷', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_3, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '04', title: '逃逸飞船', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_4, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '05', title: '时间胶囊', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_1, detailImages: DEFAULT_DETAIL_IMAGES },
    { id: '06', title: '寂静大厅', mainImage: PLACEHOLDER_IMAGES.PORTRAIT_2, detailImages: DEFAULT_DETAIL_IMAGES },
  ],
};

// ==================================================================================
// 数据解析逻辑 (DO NOT MODIFY)
// ==================================================================================

export const getScenesForCollection = (collectionId: string): Scene[] => {
  const collection = COLLECTIONS.find(c => c.id === collectionId);
  const baseColor = collection ? collection.color : '#FFFFFF';
  
  // 查找静态数据库
  const rawData = SCENES_DB[collectionId] || [];

  return rawData.map(item => {
    // 决定 UI 颜色: 优先使用场景自定义的边框颜色，否则使用作品集默认颜色
    const uiColor = item.borderColor || baseColor;

    return {
      id: item.id,
      title: item.title,
      subtitle: `${item.subtitle || 'SECTOR ' + item.id} // ${collectionId}`,
      description: item.desc || `场景 ${item.id} 的详细细节。该区域包含关键的视觉信息。`,
      mainImage: item.mainImage,
      
      // 主颜色 (影响边框、文字高亮、UI控件)
      color: uiColor,
      
      // 转场颜色 (进入场景时的全屏闪烁颜色)，默认跟随 UI 颜色
      transitionColor: item.transitionColor || uiColor,

      hotspots: [
        {
          id: 'h1',
          x: 25 + Math.random() * 20,
          y: 30 + Math.random() * 20,
          title: '场景细节 A',
          description: '系统扫描显示的第一个关键兴趣点。',
          detailImage: item.detailImages[0],
          modelUrl: assetPath('assets/models/placeholder.glb')
        },
        {
          id: 'h2',
          x: 55 + Math.random() * 20,
          y: 40 + Math.random() * 20,
          title: '场景细节 B',
          description: '检测到与背景形成对比的纹理结构。',
          detailImage: item.detailImages[1],
          modelUrl: assetPath('assets/models/placeholder.glb')
        },
        {
          id: 'h3',
          x: 35 + Math.random() * 30,
          y: 65 + Math.random() * 20,
          title: '场景细节 C',
          description: '该区域的环境光照与材质反射率分析。',
          detailImage: item.detailImages[2],
          modelUrl: assetPath('assets/models/placeholder.glb')
        }
      ]
    };
  });
};
