import { Shop, CompassMode } from '../types';

export interface PredefinedRegion {
  name: string;      // 区域名称，例如 "成都春熙路/太古里"
  city: string;      // 城市
  lat: number;       // 区域中心纬度
  lng: number;       // 区域中心经度
  radius: number;    // 该区域的有效匹配半径（米），超出此距离则判定为越界
  shops: Omit<Shop, 'distance' | 'bearing' | 'relativeAngle'>[]; // 该区域内的 100% 真实商铺列表
}

/**
 * =========================================================================
 * 🛠️ 本地预置真实商铺数据库
 * -------------------------------------------------------------------------
 * 用户使用指南：
 * 如果你想在你当前居住或测试的城市增加离线真实数据支持，请参考以下格式向数组中添加新的区域。
 * 
 * 1. 坐标获取方法：可以使用高德经纬度拾取器 (https://lbs.amap.com/tools/picker) 获取中心点和店铺的经纬度。
 * 2. 招牌菜与标签：为了展示最逼真的体验，请录入商家的真实招牌菜（特别是在抹茶模式下，请录入真实主打抹茶的店铺）。
 * 3. 这里的 shops 数据不需要写 distance、bearing 和 relativeAngle 字段，系统在加载时会根据用户当前位置自动高精度计算。
 * =========================================================================
 */
export const PREDEFINED_REAL_SHOPS: PredefinedRegion[] = [
  {
    name: "成都春熙路/太古里",
    city: "成都",
    lat: 30.6574,
    lng: 104.0762,
    radius: 2500, // 2.5公里覆盖范围
    shops: [
      {
        id: "real-cd-boba-1",
        name: "霸王茶姬 (成都春熙路正街店)",
        type: "milktea",
        lat: 30.6579,
        lng: 104.0755,
        rating: 4.8,
        reviewsCount: 1205,
        address: "锦江区春熙路步行街 88 号",
        signature: "伯牙绝弦 (招牌茉莉雪顶鲜奶茶)",
        priceRange: "¥16-22",
        hours: "09:30 - 22:30",
        tags: ["鲜奶茶", "国风茶饮", "排队王"]
      },
      {
        id: "real-cd-boba-2",
        name: "喜茶 (成都IFS店)",
        type: "milktea",
        lat: 30.6568,
        lng: 104.0792,
        rating: 4.7,
        reviewsCount: 940,
        address: "红星路三段1号IFS国际金融中心LG层",
        signature: "多肉葡萄 (经典芝士多肉葡萄果茶)",
        priceRange: "¥18-28",
        hours: "10:00 - 22:00",
        tags: ["芝士果茶", "排队王", "IFS核心"]
      },
      {
        id: "real-cd-boba-3",
        name: "蜜雪冰城 (春熙路东段店)",
        type: "milktea",
        lat: 30.6570,
        lng: 104.0740,
        rating: 4.5,
        reviewsCount: 2200,
        address: "春熙路步行街东段商业街",
        signature: "冰鲜柠檬水 (清凉夏日平价王)",
        priceRange: "¥4-10",
        hours: "09:00 - 23:00",
        tags: ["平价茶饮", "冰淇淋", "柠檬水"]
      },
      {
        id: "real-cd-boba-4",
        name: "瑞幸咖啡 (春熙路银石广场店)",
        type: "milktea",
        lat: 30.6575,
        lng: 104.0750,
        rating: 4.6,
        reviewsCount: 850,
        address: "红星路三段99号银石广场B1层",
        signature: "生椰拿铁 (经典爆款冷萃生椰咖啡)",
        priceRange: "¥9-20",
        hours: "07:35 - 22:00",
        tags: ["平价精品", "生椰拿铁", "商务自提"]
      },
      {
        id: "real-cd-matcha-1",
        name: "无邪日式甜品 (成都春熙路店)",
        type: "milktea", // 属于甜品茶饮类，同时也包含在抹茶模式中
        lat: 30.6565,
        lng: 104.0760,
        rating: 4.6,
        reviewsCount: 420,
        address: "锦江区春熙路正街东侧地下广场",
        signature: "三生有幸抹茶冰淇淋 (特浓三级手打抹茶)",
        priceRange: "¥25-45",
        hours: "10:00 - 22:00",
        tags: ["抹茶专门店", "日式甜品", "抹茶千层", "抹茶"]
      },
      {
        id: "real-cd-matcha-2",
        name: "Tsujiri 辻利茶铺 (成都IFS旗舰店)",
        type: "milktea",
        lat: 30.6560,
        lng: 104.0780,
        rating: 4.7,
        reviewsCount: 510,
        address: "红星路三段1号IFS国际金融中心5层",
        signature: "辻利特浓抹茶软冰淇淋 (京都宇治名店)",
        priceRange: "¥28-50",
        hours: "10:00 - 22:00",
        tags: ["京都宇治", "抹茶专门店", "日式刨冰", "抹茶"]
      },
      {
        id: "real-cd-bar-1",
        name: "COMMUNE (成都远洋太古里店)",
        type: "bar",
        lat: 30.6555,
        lng: 104.0810,
        rating: 4.6,
        reviewsCount: 1400,
        address: "锦江区中纱帽街8号远洋太古里中里一楼",
        signature: "幻影极光双倍IPA精酿 (自选精酿啤酒)",
        priceRange: "¥80-160",
        hours: "11:00 - 04:00",
        tags: ["自选啤酒超市", "美式西餐", "露天小酌"]
      },
      {
        id: "real-cd-bar-2",
        name: "跳海酒馆 (成都东郊记忆附近店)",
        type: "bar",
        lat: 30.6540,
        lng: 104.0720,
        rating: 4.8,
        reviewsCount: 310,
        address: "锦江区水碾河路37号旁庭院内",
        signature: "跳海原产小麦精酿 (招牌本土自酿啤酒)",
        priceRange: "¥60-120",
        hours: "18:00 - 02:00",
        tags: ["小众精酿", "社交空间", "黑胶打碟"]
      },
      {
        id: "real-cd-bar-3",
        name: "Helen's 海伦司小酒馆 (春熙路香槟广场店)",
        type: "bar",
        lat: 30.6585,
        lng: 104.0735,
        rating: 4.4,
        reviewsCount: 980,
        address: "东大街下东大街段21号香槟广场三楼",
        signature: "海伦司可乐桶 (平价大容量社交酒)",
        priceRange: "¥40-80",
        hours: "18:00 - 03:30",
        tags: ["平价小酒馆", "社交聚会", "可乐桶"]
      }
    ]
  },
  {
    name: "北京三里屯/工体",
    city: "北京",
    lat: 39.9330,
    lng: 116.4520,
    radius: 2500,
    shops: [
      {
        id: "real-bj-boba-1",
        name: "喜茶 (北京三里屯太古里店)",
        type: "milktea",
        lat: 39.9335,
        lng: 116.4525,
        rating: 4.8,
        reviewsCount: 1800,
        address: "朝阳区三里屯路19号院太古里南区S2-1A",
        signature: "多肉葡萄 (招牌经典芝士多肉葡萄果茶)",
        priceRange: "¥18-28",
        hours: "10:00 - 22:30",
        tags: ["黑金店", "芝士果茶", "排队王"]
      },
      {
        id: "real-bj-boba-2",
        name: "星巴克臻选旗舰店 (北京三里屯太古里店)",
        type: "milktea",
        lat: 39.9325,
        lng: 116.4515,
        rating: 4.7,
        reviewsCount: 1500,
        address: "朝阳区三里屯路19号院太古里南区S10-10",
        signature: "臻选冷萃咖啡 (星巴克三里屯限量款)",
        priceRange: "¥35-65",
        hours: "08:00 - 23:00",
        tags: ["星巴克臻选", "手冲咖啡", "地标建筑"]
      },
      {
        id: "real-bj-boba-3",
        name: "瑞幸咖啡 (三里屯工体北路店)",
        type: "milktea",
        lat: 39.9340,
        lng: 116.4530,
        rating: 4.5,
        reviewsCount: 710,
        address: "朝阳区工体北路8号三里屯SOHO底商",
        signature: "生椰拿铁 (经典爆款冷萃生椰咖啡)",
        priceRange: "¥9-20",
        hours: "07:00 - 21:30",
        tags: ["生椰拿铁", "平价咖啡", "快速自提"]
      },
      {
        id: "real-bj-matcha-1",
        name: "关茶 Matcha (北京三里屯店)",
        type: "milktea",
        lat: 39.9315,
        lng: 116.4510,
        rating: 4.6,
        reviewsCount: 380,
        address: "朝阳区三里屯SOHO2号商场B1层",
        signature: "宇治四季抹茶生巧克力 (顶级手作抹茶工艺)",
        priceRange: "¥30-60",
        hours: "10:00 - 22:00",
        tags: ["抹茶生巧", "日式抹茶", "抹茶千层", "抹茶"]
      },
      {
        id: "real-bj-matcha-2",
        name: "辻利茶铺 Tsujiri (北京三里屯店)",
        type: "milktea",
        lat: 39.9320,
        lng: 116.4535,
        rating: 4.7,
        reviewsCount: 460,
        address: "朝阳区三里屯SOHO3号商场B1层",
        signature: "辻利抹茶刨冰百汇 (多层次京都抹茶圣代)",
        priceRange: "¥28-55",
        hours: "10:00 - 22:00",
        tags: ["京都宇治", "抹茶圣代", "抹茶专门店", "抹茶"]
      },
      {
        id: "real-bj-bar-1",
        name: "跳海酒馆 (北京工体北路店)",
        type: "bar",
        lat: 39.9305,
        lng: 116.4545,
        rating: 4.9,
        reviewsCount: 520,
        address: "朝阳区工体北路新中街二条旁胡同内",
        signature: "跳海原产小麦精酿 (招牌本土自酿小麦啤酒)",
        priceRange: "¥60-120",
        hours: "18:00 - 02:30",
        tags: ["社交精酿", "黑胶打碟", "黑板打酒", "工体热门"]
      },
      {
        id: "real-bj-bar-2",
        name: "COMMUNE RESERVE (北京三里屯店)",
        type: "bar",
        lat: 39.9345,
        lng: 116.4505,
        rating: 4.7,
        reviewsCount: 920,
        address: "朝阳区工体东路丙2号红街大厦1号楼",
        signature: "幻影极光双倍IPA精酿 (自选精酿啤酒)",
        priceRange: "¥90-180",
        hours: "11:00 - 03:00",
        tags: ["自选精酿", "美式披萨", "精酿臻选"]
      }
    ]
  }
];
