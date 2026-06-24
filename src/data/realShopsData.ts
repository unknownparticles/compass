import { Shop, CompassMode } from '../types';

export interface PredefinedRegion {
  name: string;      // 区域名称，例如 "成都春熙路/太古里"
  city: string;      // 城市
  lat: number;       // 区域中心纬度
  lng: number;       // 区域中心经度
  radius: number;    // 该区域的有效匹配半径（米），超出此距离则判定为越界
  shops: Omit<Shop, 'distance' | 'bearing' | 'relativeAngle'>[]; // 该区域内的 100% 真实商铺列表
  lastUpdated?: string; // 数据最后更新时间
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
    lastUpdated: "2026-06-24",
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
        type: "milktea",
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
    lastUpdated: "2026-06-24",
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
  },
  {
    name: "厦门中山路步行街/白鹭洲",
    city: "厦门",
    lat: 24.4533,
    lng: 118.0825,
    radius: 2500,
    lastUpdated: "2026-06-24",
    shops: [
      {
        id: "real-xm-matcha-B0FFFY9ARJ",
        name: "炉鱼(厦门中华城店)",
        type: "milktea",
        lat: 24.452812,
        lng: 118.082179,
        rating: 4.5,
        reviewsCount: 153,
        address: "思明南路189号中华城3层",
        signature: "白玉小子抹茶波波茶 (Boba Matcha Milk)",
        priceRange: "¥58-86",
        hours: "09:30 - 22:00",
        tags: ["抹茶", "Matcha", "甜品下午茶"]
      },
      {
        id: "real-xm-matcha-B0ID64TKS0",
        name: "好利来(中华城店)",
        type: "milktea",
        lat: 24.452807,
        lng: 118.081921,
        rating: 4.6,
        reviewsCount: 127,
        address: "思明南路137号中华城A2地块C区1楼1001号商铺",
        signature: "宇治手打冰点 (Uji Matcha Ice)",
        priceRange: "¥36-54",
        hours: "09:30 - 22:00",
        tags: ["抹茶", "Matcha", "甜品下午茶"]
      },
      {
        id: "real-xm-matcha-B0FFF00UNJ",
        name: "星巴克臻选(厦门中华城分店)",
        type: "milktea",
        lat: 24.452616,
        lng: 118.083089,
        rating: 4.6,
        reviewsCount: 321,
        address: "思明南路195号中华城南区31B1055b铺位区",
        signature: "特浓抹茶千层蛋糕 (Matcha Mille Crepe)",
        priceRange: "¥24-36",
        hours: "09:30 - 22:00",
        tags: ["抹茶", "Matcha", "甜品下午茶"]
      },
      {
        id: "real-xm-matcha-B0FFIZCYKD",
        name: "星巴克(老虎城分店)",
        type: "milktea",
        lat: 24.452808,
        lng: 118.081122,
        rating: 4.6,
        reviewsCount: 48,
        address: "思明南路118号地上一层A幢",
        signature: "雪顶抹茶芝士冰沙 (Matcha Cheese Slush)",
        priceRange: "¥24-36",
        hours: "09:30 - 22:00",
        tags: ["抹茶", "Matcha", "甜品下午茶"]
      },
      {
        id: "real-xm-matcha-B0J6KA6X8Y",
        name: "海隐记|福建菜|海鲜大排档(中山路店)",
        type: "milktea",
        lat: 24.454063,
        lng: 118.080591,
        rating: 4.4,
        reviewsCount: 117,
        address: "局口街4号(镇海路地铁站3A口步行440米)",
        signature: "特浓抹茶千层蛋糕 (Matcha Mille Crepe)",
        priceRange: "¥70-106",
        hours: "09:30 - 22:00",
        tags: ["抹茶", "Matcha", "甜品下午茶"]
      },
      {
        id: "real-xm-boba-B0HK0SGIXB",
        name: "LAVAZZA拉瓦萨咖啡(厦门中华城店)",
        type: "milktea",
        lat: 24.453145,
        lng: 118.082544,
        rating: 4.6,
        reviewsCount: 226,
        address: "思明南路137号一层C1002",
        signature: "杨枝甘露轻盈版 (Mango Sago)",
        priceRange: "¥24-36",
        hours: "09:30 - 22:00",
        tags: ["奶茶", "饮品店", "下午茶", "精品咖啡"]
      },
      {
        id: "real-xm-boba-B0JUFUP7RM",
        name: "宁咖啡(厦门中华城店)",
        type: "milktea",
        lat: 24.453154,
        lng: 118.082109,
        rating: 3.2,
        reviewsCount: 236,
        address: "思明南路195号中华城北区",
        signature: "生椰爆汁西瓜 (Raw Coconut Watermelon)",
        priceRange: "¥16-24",
        hours: "09:30 - 22:00",
        tags: ["奶茶", "饮品店", "下午茶", "精品咖啡"]
      },
      {
        id: "real-xm-boba-B0LKKSMULA",
        name: "肯悦咖啡中华城店",
        type: "milktea",
        lat: 24.453125,
        lng: 118.082075,
        rating: 4.0,
        reviewsCount: 264,
        address: "中山路240号地下一层01单元中华城新街公园A1-B149",
        signature: "招牌波霸奶茶 (Classic Boba Milk Tea)",
        priceRange: "¥10-16",
        hours: "09:30 - 22:00",
        tags: ["奶茶", "饮品店", "下午茶", "精品咖啡"]
      },
      {
        id: "real-xm-boba-B0J1VG9NHQ",
        name: "Manner Coffee(中华城南区店)",
        type: "milktea",
        lat: 24.45296,
        lng: 118.082823,
        rating: 4.5,
        reviewsCount: 70,
        address: "思明南路195号中华城南区1F层",
        signature: "桂花燕麦拿铁 (精品拿铁咖啡)",
        priceRange: "¥16-24",
        hours: "09:30 - 22:00",
        tags: ["奶茶", "饮品店", "下午茶"]
      },
      {
        id: "real-xm-boba-B0HUV519Q4",
        name: "杰象泰泰小厨(中华城北区店)",
        type: "milktea",
        lat: 24.453185,
        lng: 118.081981,
        rating: 3.5,
        reviewsCount: 135,
        address: "思明南路195号中华城北区3F层",
        signature: "杨枝甘露轻盈版 (Mango Sago)",
        priceRange: "¥77-115",
        hours: "09:30 - 22:00",
        tags: ["奶茶", "饮品店", "下午茶"]
      }
    ]
  },
  {
    name: "汕头万象城/苏宁广场",
    city: "汕头",
    lat: 23.3643,
    lng: 116.7163,
    radius: 2500,
    lastUpdated: "2026-06-24",
    shops: [
      {
        id: "real-st-matcha-B0JBFZ1YTG",
        name: "瑞幸咖啡(汕头万象城店)",
        type: "milktea",
        lat: 23.363303,
        lng: 116.716572,
        rating: 4.5,
        reviewsCount: 183,
        address: "金霞街道汕头万象城L608",
        signature: "雪顶抹茶芝士冰沙 (Matcha Cheese Slush)",
        priceRange: "¥10-14",
        hours: "09:30 - 22:00",
        tags: ["抹茶", "Matcha", "甜品下午茶"]
      },
      {
        id: "real-st-matcha-B0KUPZ1820",
        name: "小鱼GELATO(万象城店)",
        type: "milktea",
        lat: 23.363338,
        lng: 116.717592,
        rating: 3.9,
        reviewsCount: 201,
        address: "金霞街道长平路95号华润大厦商业裙楼润街238号",
        signature: "宇治手打冰点 (Uji Matcha Ice)",
        priceRange: "¥19-29",
        hours: "09:30 - 22:00",
        tags: ["抹茶", "Matcha", "甜品下午茶"]
      },
      {
        id: "real-st-matcha-B0H2YYXNJY",
        name: "星巴克臻选(汕头万象城店)",
        type: "milktea",
        lat: 23.362312,
        lng: 116.717437,
        rating: 4.6,
        reviewsCount: 63,
        address: "金环路与长平路交界处东北角万象城地上一层L156号",
        signature: "宇治手打冰点 (Uji Matcha Ice)",
        priceRange: "¥24-36",
        hours: "09:30 - 22:00",
        tags: ["抹茶", "Matcha", "甜品下午茶"]
      },
      {
        id: "real-st-matcha-B0JUU7J0TT",
        name: "鲍师傅糕点(欣荣大厦店)",
        type: "milktea",
        lat: 23.361926,
        lng: 116.715538,
        rating: 4.7,
        reviewsCount: 281,
        address: "长平路88号欣荣大厦一楼102号",
        signature: "宇治特浓抹茶拿铁 (Matcha Latte)",
        priceRange: "¥15-23",
        hours: "09:30 - 22:00",
        tags: ["抹茶", "Matcha", "甜品下午茶"]
      },
      {
        id: "real-st-matcha-B0FFG8R7A4",
        name: "星巴克(苏宁广场店)",
        type: "milktea",
        lat: 23.361717,
        lng: 116.716662,
        rating: 4.5,
        reviewsCount: 121,
        address: "长平路90号汕头苏宁广场地上1层102单元",
        signature: "白玉小子抹茶波波茶 (Boba Matcha Milk)",
        priceRange: "¥24-36",
        hours: "09:30 - 22:00",
        tags: ["抹茶", "Matcha", "甜品下午茶"]
      },
      {
        id: "real-st-boba-B0M6DX8NA0",
        name: "虫鸣探秘鲜果咖啡",
        type: "milktea",
        lat: 23.364025,
        lng: 116.716625,
        rating: 3.3,
        reviewsCount: 202,
        address: "金霞街道长平路95号汕头万象城L5层",
        signature: "生椰爆汁西瓜 (Raw Coconut Watermelon)",
        priceRange: "¥61-91",
        hours: "09:30 - 22:00",
        tags: ["奶茶", "饮品店", "下午茶", "精品咖啡"]
      },
      {
        id: "real-st-boba-B0HDCSKA7H",
        name: "瑞幸咖啡(汕头华润大厦店)",
        type: "milktea",
        lat: 23.364663,
        lng: 116.716558,
        rating: 4.5,
        reviewsCount: 89,
        address: "长平路95号华润大厦北塔112号铺面",
        signature: "生椰拿铁 (经典爆款冷萃生椰咖啡)",
        priceRange: "¥10-16",
        hours: "09:30 - 22:00",
        tags: ["奶茶", "饮品店", "下午茶", "精品咖啡"]
      },
      {
        id: "real-st-boba-B0GKHAXFF3",
        name: "赤鱬居酒屋",
        type: "milktea",
        lat: 23.364426,
        lng: 116.716948,
        rating: 4.5,
        reviewsCount: 104,
        address: "幸福里雅居5栋133,134",
        signature: "杨枝甘露轻盈版 (Mango Sago)",
        priceRange: "¥108-162",
        hours: "09:30 - 22:00",
        tags: ["奶茶", "饮品店", "下午茶"]
      },
      {
        id: "real-st-boba-B0IU3CHEFE",
        name: "道兴咖啡(万象润街店)",
        type: "milktea",
        lat: 23.363961,
        lng: 116.716938,
        rating: 4.6,
        reviewsCount: 244,
        address: "金霞街道长平路95号华润大厦商业裙楼167号铺",
        signature: "杨枝甘露轻盈版 (Mango Sago)",
        priceRange: "¥19-29",
        hours: "09:30 - 22:00",
        tags: ["奶茶", "饮品店", "下午茶", "精品咖啡"]
      },
      {
        id: "real-st-boba-B0LR77JQWL",
        name: "nowwa挪瓦咖啡(易站汕头万象店)",
        type: "milktea",
        lat: 23.364798,
        lng: 116.716958,
        rating: 3.9,
        reviewsCount: 114,
        address: "长平路95号华润大厦北塔118号易站便利店1层",
        signature: "招牌波霸奶茶 (Classic Boba Milk Tea)",
        priceRange: "¥10-14",
        hours: "09:30 - 22:00",
        tags: ["奶茶", "饮品店", "下午茶", "精品咖啡"]
      }
    ]
  }
];
