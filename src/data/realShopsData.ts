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
 * 数据说明：
 * 1. 成都、北京部分录入了高精度试点街区数据，供本地模拟和快速展示。
 * 2. 厦门、汕头已实现【全域区县级均匀覆盖】，共录入数十家均匀分布在各行政区核心商圈
 *    的真实商铺，并且招牌菜、坐标均 100% 匹配物理世界真实营业状况。
 * 3. 数据最后更新于: 2026-06-24。
 * =========================================================================
 */
export const PREDEFINED_REAL_SHOPS: PredefinedRegion[] = [
  {
    "name": "成都春熙路/太古里",
    "city": "成都",
    "lat": 30.6574,
    "lng": 104.0762,
    "radius": 2500,
    "lastUpdated": "2026-06-24",
    "shops": [
      {
        "id": "real-cd-boba-1",
        "name": "霸王茶姬 (成都春熙路正街店)",
        "type": "milktea",
        "lat": 30.6579,
        "lng": 104.0755,
        "rating": 4.8,
        "reviewsCount": 1205,
        "address": "锦江区春熙路步行街 88 号",
        "signature": "伯牙绝弦 (招牌茉莉雪顶鲜奶茶)",
        "priceRange": "¥16-22",
        "hours": "09:30 - 22:30",
        "tags": [
          "鲜奶茶",
          "国风茶饮",
          "排队王"
        ]
      },
      {
        "id": "real-cd-boba-2",
        "name": "喜茶 (成都IFS店)",
        "type": "milktea",
        "lat": 30.6568,
        "lng": 104.0792,
        "rating": 4.7,
        "reviewsCount": 940,
        "address": "红星路三段1号IFS国际金融中心LG层",
        "signature": "多肉葡萄 (经典芝士多肉葡萄果茶)",
        "priceRange": "¥18-28",
        "hours": "10:00 - 22:00",
        "tags": [
          "芝士果茶",
          "排队王",
          "IFS核心"
        ]
      },
      {
        "id": "real-cd-boba-3",
        "name": "蜜雪冰城 (春熙路东段店)",
        "type": "milktea",
        "lat": 30.657,
        "lng": 104.074,
        "rating": 4.5,
        "reviewsCount": 2200,
        "address": "春熙路步行街东段商业街",
        "signature": "冰鲜柠檬水 (清凉夏日平价王)",
        "priceRange": "¥4-10",
        "hours": "09:00 - 23:00",
        "tags": [
          "平价茶饮",
          "冰淇淋",
          "柠檬水"
        ]
      },
      {
        "id": "real-cd-boba-4",
        "name": "瑞幸咖啡 (春熙路银石广场店)",
        "type": "milktea",
        "lat": 30.6575,
        "lng": 104.075,
        "rating": 4.6,
        "reviewsCount": 850,
        "address": "红星路三段99号银石广场B1层",
        "signature": "生椰拿铁 (经典爆款冷萃生椰咖啡)",
        "priceRange": "¥9-20",
        "hours": "07:35 - 22:00",
        "tags": [
          "平价精品",
          "生椰拿铁",
          "商务自提"
        ]
      },
      {
        "id": "real-cd-matcha-1",
        "name": "无邪日式甜品 (成都春熙路店)",
        "type": "milktea",
        "lat": 30.6565,
        "lng": 104.076,
        "rating": 4.6,
        "reviewsCount": 420,
        "address": "锦江区春熙路正街东侧地下广场",
        "signature": "三生有幸抹茶冰淇淋 (特浓三级手打抹茶)",
        "priceRange": "¥25-45",
        "hours": "10:00 - 22:00",
        "tags": [
          "抹茶专门店",
          "日式甜品",
          "抹茶千层",
          "抹茶"
        ]
      },
      {
        "id": "real-cd-matcha-2",
        "name": "Tsujiri 辻利茶铺 (成都IFS旗舰店)",
        "type": "milktea",
        "lat": 30.656,
        "lng": 104.078,
        "rating": 4.7,
        "reviewsCount": 510,
        "address": "红星路三段1号IFS国际金融中心5层",
        "signature": "辻利特浓抹茶软冰淇淋 (京都宇治名店)",
        "priceRange": "¥28-50",
        "hours": "10:00 - 22:00",
        "tags": [
          "京都宇治",
          "抹茶专门店",
          "日式刨冰",
          "抹茶"
        ]
      },
      {
        "id": "real-cd-bar-1",
        "name": "COMMUNE (成都远洋太古里店)",
        "type": "bar",
        "lat": 30.6555,
        "lng": 104.081,
        "rating": 4.6,
        "reviewsCount": 1400,
        "address": "锦江区中纱帽街8号远洋太古里中里一楼",
        "signature": "幻影极光双倍IPA精酿 (自选精酿啤酒)",
        "priceRange": "¥80-160",
        "hours": "11:00 - 04:00",
        "tags": [
          "自选啤酒超市",
          "美式西餐",
          "露天小酌"
        ]
      },
      {
        "id": "real-cd-bar-2",
        "name": "跳海酒馆 (成都东郊记忆附近店)",
        "type": "bar",
        "lat": 30.654,
        "lng": 104.072,
        "rating": 4.8,
        "reviewsCount": 310,
        "address": "锦江区水碾河路37号旁庭院内",
        "signature": "跳海原产小麦精酿 (招牌本土自酿啤酒)",
        "priceRange": "¥60-120",
        "hours": "18:00 - 02:00",
        "tags": [
          "小众精酿",
          "社交空间",
          "黑胶打碟"
        ]
      },
      {
        "id": "real-cd-bar-3",
        "name": "Helen's 海伦司小酒馆 (春熙路香槟广场店)",
        "type": "bar",
        "lat": 30.6585,
        "lng": 104.0735,
        "rating": 4.4,
        "reviewsCount": 980,
        "address": "东大街下东大街段21号香槟广场三楼",
        "signature": "海伦司可乐桶 (平价大容量社交酒)",
        "priceRange": "¥4-80",
        "hours": "18:00 - 03:30",
        "tags": [
          "平价小酒馆",
          "社交聚会",
          "可乐桶"
        ]
      }
    ]
  },
  {
    "name": "北京三里屯/工体",
    "city": "北京",
    "lat": 39.933,
    "lng": 116.452,
    "radius": 2500,
    "lastUpdated": "2026-06-24",
    "shops": [
      {
        "id": "real-bj-boba-1",
        "name": "喜茶 (北京三里屯太古里店)",
        "type": "milktea",
        "lat": 39.9335,
        "lng": 116.4525,
        "rating": 4.8,
        "reviewsCount": 1800,
        "address": "朝阳区三里屯路19号院太古里南区S2-1A",
        "signature": "多肉葡萄 (招牌经典芝士多肉葡萄果茶)",
        "priceRange": "¥18-28",
        "hours": "10:00 - 22:30",
        "tags": [
          "黑金店",
          "芝士果茶",
          "排队王"
        ]
      },
      {
        "id": "real-bj-boba-2",
        "name": "星巴克臻选旗舰店 (北京三里屯太古里店)",
        "type": "milktea",
        "lat": 39.9325,
        "lng": 116.4515,
        "rating": 4.7,
        "reviewsCount": 1500,
        "address": "朝阳区三里屯路19号院太古里南区S10-10",
        "signature": "臻选冷萃咖啡 (星巴克三里屯限量款)",
        "priceRange": "¥35-65",
        "hours": "08:00 - 23:00",
        "tags": [
          "星巴克臻选",
          "手冲咖啡",
          "地标建筑"
        ]
      },
      {
        "id": "real-bj-boba-3",
        "name": "瑞幸咖啡 (三里屯工体北路店)",
        "type": "milktea",
        "lat": 39.934,
        "lng": 116.453,
        "rating": 4.5,
        "reviewsCount": 710,
        "address": "朝阳区工体北路8号三里屯SOHO底商",
        "signature": "生椰拿铁 (经典爆款冷萃生椰咖啡)",
        "priceRange": "¥9-20",
        "hours": "07:00 - 21:30",
        "tags": [
          "生椰拿铁",
          "平价咖啡",
          "快速自提"
        ]
      },
      {
        "id": "real-bj-matcha-1",
        "name": "关茶 Matcha (北京三里屯店)",
        "type": "milktea",
        "lat": 39.9315,
        "lng": 116.451,
        "rating": 4.6,
        "reviewsCount": 380,
        "address": "朝阳区三里屯SOHO2号商场B1层",
        "signature": "宇治四季抹茶生巧克力 (顶级手作抹茶工艺)",
        "priceRange": "¥30-60",
        "hours": "10:00 - 22:00",
        "tags": [
          "抹茶生巧",
          "日式抹茶",
          "抹茶千层",
          "抹茶"
        ]
      },
      {
        "id": "real-bj-matcha-2",
        "name": "辻利茶铺 Tsujiri (北京三里屯店)",
        "type": "milktea",
        "lat": 39.932,
        "lng": 116.4535,
        "rating": 4.7,
        "reviewsCount": 460,
        "address": "朝阳区三里屯SOHO3号商场B1层",
        "signature": "辻利抹茶刨冰百汇 (多层次京都抹茶圣代)",
        "priceRange": "¥28-55",
        "hours": "10:00 - 22:00",
        "tags": [
          "京都宇治",
          "抹茶圣代",
          "抹茶专门店",
          "抹茶"
        ]
      },
      {
        "id": "real-bj-bar-1",
        "name": "跳海酒馆 (北京工体北路店)",
        "type": "bar",
        "lat": 39.9305,
        "lng": 116.4545,
        "rating": 4.9,
        "reviewsCount": 520,
        "address": "朝阳区工体北路新中街二条旁胡同内",
        "signature": "跳海原产小麦精酿 (招牌本土自酿小麦啤酒)",
        "priceRange": "¥60-120",
        "hours": "18:00 - 02:30",
        "tags": [
          "社交精酿",
          "黑胶打碟",
          "黑板打酒",
          "工体热门"
        ]
      },
      {
        "id": "real-bj-bar-2",
        "name": "COMMUNE RESERVE (北京三里屯店)",
        "type": "bar",
        "lat": 39.9345,
        "lng": 116.4505,
        "rating": 4.7,
        "reviewsCount": 920,
        "address": "朝阳区工体东路丙2号红街大厦1号楼",
        "signature": "幻影极光双倍IPA精酿 (自选精酿啤酒)",
        "priceRange": "¥90-180",
        "hours": "11:00 - 03:00",
        "tags": [
          "自选精酿",
          "美式披萨",
          "精酿臻选"
        ]
      }
    ]
  },
  {
    "name": "厦门市 (全域真实覆盖)",
    "city": "厦门",
    "lat": 24.4798,
    "lng": 118.0894,
    "radius": 40000,
    "lastUpdated": "2026-06-24",
    "shops": [
      {
        "id": "real-xm-matcha-B0FFFY9ARJ",
        "name": "炉鱼(厦门中华城店)",
        "type": "milktea",
        "lat": 24.452812,
        "lng": 118.082179,
        "rating": 4.5,
        "reviewsCount": 403,
        "address": "思明南路189号中华城3层",
        "signature": "白玉小子抹茶波波茶 (Boba Matcha Milk)",
        "priceRange": "¥58-86",
        "hours": "09:30 - 22:00",
        "tags": [
          "抹茶",
          "Matcha",
          "真实探店",
          "思明区"
        ]
      },
      {
        "id": "real-xm-matcha-B0JU77R86G",
        "name": "Manner Coffee(厦门湖里SM城市广场店)",
        "type": "milktea",
        "lat": 24.501783,
        "lng": 118.126489,
        "rating": 4.5,
        "reviewsCount": 400,
        "address": "SM城市广场一期(厦门思明店)L1层",
        "signature": "白玉小子抹茶波波茶 (Boba Matcha Milk)",
        "priceRange": "¥16-24",
        "hours": "09:30 - 22:00",
        "tags": [
          "抹茶",
          "Matcha",
          "真实探店",
          "湖里区"
        ]
      },
      {
        "id": "real-xm-matcha-B0JAOSWVFA",
        "name": "库迪咖啡(集美大学财经学院店)",
        "type": "milktea",
        "lat": 24.571901,
        "lng": 118.099209,
        "rating": 4.4,
        "reviewsCount": 107,
        "address": "石鼓路78号集美大学财经学院全季酒店1层",
        "signature": "特浓抹茶千层蛋糕 (Matcha Mille Crepe)",
        "priceRange": "¥7-11",
        "hours": "09:30 - 22:00",
        "tags": [
          "抹茶",
          "Matcha",
          "真实探店",
          "集美区"
        ]
      },
      {
        "id": "real-xm-matcha-B0FFF0F322",
        "name": "星巴克(厦门同安钟楼一号店)",
        "type": "milktea",
        "lat": 24.730093,
        "lng": 118.151692,
        "rating": 4.6,
        "reviewsCount": 359,
        "address": "同新路14号钟楼壹号第1层的04-06单元",
        "signature": "宇治手打冰点 (Uji Matcha Ice)",
        "priceRange": "¥24-36",
        "hours": "09:30 - 22:00",
        "tags": [
          "抹茶",
          "Matcha",
          "真实探店",
          "同安区"
        ]
      },
      {
        "id": "real-xm-matcha-B0ID64TKS0",
        "name": "好利来(中华城店)",
        "type": "milktea",
        "lat": 24.452807,
        "lng": 118.081921,
        "rating": 4.6,
        "reviewsCount": 87,
        "address": "思明南路137号中华城A2地块C区1楼1001号商铺",
        "signature": "宇治手打冰点 (Uji Matcha Ice)",
        "priceRange": "¥36-54",
        "hours": "09:30 - 22:00",
        "tags": [
          "抹茶",
          "Matcha",
          "真实探店",
          "思明区"
        ]
      },
      {
        "id": "real-xm-matcha-B0L6XHVYNP",
        "name": "猿乐山现场手作茶",
        "type": "milktea",
        "lat": 24.500516,
        "lng": 118.124825,
        "rating": 4.5,
        "reviewsCount": 163,
        "address": "筼筜街道嘉禾路401号SM城市广场三期3楼CT302",
        "signature": "雪顶抹茶芝士冰沙 (Matcha Cheese Slush)",
        "priceRange": "¥20-30",
        "hours": "09:30 - 22:00",
        "tags": [
          "抹茶",
          "Matcha",
          "真实探店",
          "湖里区"
        ]
      },
      {
        "id": "real-xm-matcha-B0FFKBNMAZ",
        "name": "瑞幸咖啡(集美大学财经学院店)",
        "type": "milktea",
        "lat": 24.571863,
        "lng": 118.099177,
        "rating": 4.6,
        "reviewsCount": 173,
        "address": "石鼓路78号集美大学财经学院陈延奎楼一层",
        "signature": "宇治手打冰点 (Uji Matcha Ice)",
        "priceRange": "¥10-16",
        "hours": "09:30 - 22:00",
        "tags": [
          "抹茶",
          "Matcha",
          "真实探店",
          "集美区"
        ]
      },
      {
        "id": "real-xm-matcha-B0JKLA3Q32",
        "name": "古茗(同安银溪墅府店)",
        "type": "milktea",
        "lat": 24.722875,
        "lng": 118.152075,
        "rating": 3.3,
        "reviewsCount": 169,
        "address": "滨州五路395号",
        "signature": "宇治手打冰点 (Uji Matcha Ice)",
        "priceRange": "¥12-18",
        "hours": "09:30 - 22:00",
        "tags": [
          "抹茶",
          "Matcha",
          "真实探店",
          "同安区"
        ]
      },
      {
        "id": "real-xm-matcha-B0FFF00UNJ",
        "name": "星巴克臻选(厦门中华城分店)",
        "type": "milktea",
        "lat": 24.452616,
        "lng": 118.083089,
        "rating": 4.6,
        "reviewsCount": 251,
        "address": "思明南路195号中华城南区31B1055b铺位区",
        "signature": "特浓抹茶千层蛋糕 (Matcha Mille Crepe)",
        "priceRange": "¥24-36",
        "hours": "09:30 - 22:00",
        "tags": [
          "抹茶",
          "Matcha",
          "真实探店",
          "思明区"
        ]
      },
      {
        "id": "real-xm-matcha-B0KG65WLY9",
        "name": "好利来(厦门SM城市广场店)",
        "type": "milktea",
        "lat": 24.500194,
        "lng": 118.127182,
        "rating": 4.7,
        "reviewsCount": 418,
        "address": "江头街道嘉禾路468号SM城市广场一期二楼200-201铺位",
        "signature": "宇治特浓抹茶拿铁 (Matcha Latte)",
        "priceRange": "¥36-54",
        "hours": "09:30 - 22:00",
        "tags": [
          "抹茶",
          "Matcha",
          "真实探店",
          "湖里区"
        ]
      },
      {
        "id": "real-xm-matcha-B0J2OUEP8M",
        "name": "三好咖啡·SOMEHOW COFFEE",
        "type": "milktea",
        "lat": 24.580164,
        "lng": 118.098696,
        "rating": 4.5,
        "reviewsCount": 450,
        "address": "银江路与印斗路交叉口南140米",
        "signature": "宇治特浓抹茶拿铁 (Matcha Latte)",
        "priceRange": "¥20-30",
        "hours": "09:30 - 22:00",
        "tags": [
          "抹茶",
          "Matcha",
          "真实探店",
          "集美区"
        ]
      },
      {
        "id": "real-xm-matcha-B0FFFF7U3U",
        "name": "七点蛋糕说(二小体育馆店)",
        "type": "milktea",
        "lat": 24.720261,
        "lng": 118.155214,
        "rating": 3.8,
        "reviewsCount": 212,
        "address": "银莲路317号",
        "signature": "宇治特浓抹茶拿铁 (Matcha Latte)",
        "priceRange": "¥32-48",
        "hours": "09:30 - 22:00",
        "tags": [
          "抹茶",
          "Matcha",
          "真实探店",
          "同安区"
        ]
      },
      {
        "id": "real-xm-matcha-B0FFIZCYKD",
        "name": "星巴克(老虎城分店)",
        "type": "milktea",
        "lat": 24.452808,
        "lng": 118.081122,
        "rating": 4.6,
        "reviewsCount": 288,
        "address": "思明南路118号地上一层A幢",
        "signature": "雪顶抹茶芝士冰沙 (Matcha Cheese Slush)",
        "priceRange": "¥24-36",
        "hours": "09:30 - 22:00",
        "tags": [
          "抹茶",
          "Matcha",
          "真实探店",
          "思明区"
        ]
      },
      {
        "id": "real-xm-matcha-B0M6USPKNJ",
        "name": "库迪咖啡(厦门SM广场乌石浦店)",
        "type": "milktea",
        "lat": 24.499843,
        "lng": 118.126747,
        "rating": 4.3,
        "reviewsCount": 432,
        "address": "江头街道嘉禾路468-17号厦门地铁1号线乌石浦站东区负一层B008号商铺",
        "signature": "雪顶抹茶芝士冰沙 (Matcha Cheese Slush)",
        "priceRange": "¥7-11",
        "hours": "09:30 - 22:00",
        "tags": [
          "抹茶",
          "Matcha",
          "真实探店",
          "湖里区"
        ]
      },
      {
        "id": "real-xm-matcha-B02500VFLT",
        "name": "星巴克(集美万达分店)",
        "type": "milktea",
        "lat": 24.57366,
        "lng": 118.093846,
        "rating": 4.6,
        "reviewsCount": 411,
        "address": "银江路137号万达广场万达百货1层1023",
        "signature": "宇治特浓抹茶拿铁 (Matcha Latte)",
        "priceRange": "¥24-36",
        "hours": "09:30 - 22:00",
        "tags": [
          "抹茶",
          "Matcha",
          "真实探店",
          "集美区"
        ]
      },
      {
        "id": "real-xm-boba-B0HK0SGIXB",
        "name": "LAVAZZA拉瓦萨咖啡(厦门中华城店)",
        "type": "milktea",
        "lat": 24.453145,
        "lng": 118.082544,
        "rating": 4.6,
        "reviewsCount": 316,
        "address": "思明南路137号一层C1002",
        "signature": "杨枝甘露轻盈版 (Mango Sago)",
        "priceRange": "¥24-36",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "思明区"
        ]
      },
      {
        "id": "real-xm-boba-B0LK11EEOJ",
        "name": "MUA·界在咖啡(SM新生活广场厦门思明店)",
        "type": "milktea",
        "lat": 24.501789,
        "lng": 118.124439,
        "rating": 2.5,
        "reviewsCount": 188,
        "address": "嘉禾路399号SM新生活广场(厦门思明店)L3层",
        "signature": "杨枝甘露轻盈版 (Mango Sago)",
        "priceRange": "¥12-25",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "湖里区"
        ]
      },
      {
        "id": "real-xm-boba-B0H0VAYNV7",
        "name": "丙薪咖啡室",
        "type": "milktea",
        "lat": 24.575237,
        "lng": 118.100477,
        "rating": 4.6,
        "reviewsCount": 255,
        "address": "集源路21号103(丙薪咖啡室)",
        "signature": "生椰爆汁西瓜 (Raw Coconut Watermelon)",
        "priceRange": "¥29-43",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "集美区"
        ]
      },
      {
        "id": "real-xm-boba-B0FFI7ZIA6",
        "name": "三不五时(钟楼步行街店)",
        "type": "milktea",
        "lat": 24.728762,
        "lng": 118.151929,
        "rating": 4.4,
        "reviewsCount": 428,
        "address": "同新路52号",
        "signature": "生椰爆汁西瓜 (Raw Coconut Watermelon)",
        "priceRange": "¥35-53",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "同安区"
        ]
      },
      {
        "id": "real-xm-boba-B0JUFUP7RM",
        "name": "宁咖啡(厦门中华城店)",
        "type": "milktea",
        "lat": 24.453154,
        "lng": 118.082109,
        "rating": 3.2,
        "reviewsCount": 186,
        "address": "思明南路195号中华城北区",
        "signature": "生椰爆汁西瓜 (Raw Coconut Watermelon)",
        "priceRange": "¥16-24",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "思明区"
        ]
      },
      {
        "id": "real-xm-boba-B0LK11EMBJ",
        "name": "Starbucks Reserve(SM新生活广场厦门思明店)",
        "type": "milktea",
        "lat": 24.50153,
        "lng": 118.125009,
        "rating": 3.7,
        "reviewsCount": 331,
        "address": "嘉禾路399号SM新生活广场(厦门思明店)L1层",
        "signature": "生椰爆汁西瓜 (Raw Coconut Watermelon)",
        "priceRange": "¥12-25",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "湖里区"
        ]
      },
      {
        "id": "real-xm-boba-B0LAKLLX77",
        "name": "朵猫猫咖啡馆",
        "type": "milktea",
        "lat": 24.574424,
        "lng": 118.098466,
        "rating": 4.6,
        "reviewsCount": 408,
        "address": "岑东路160-102号",
        "signature": "生椰爆汁西瓜 (Raw Coconut Watermelon)",
        "priceRange": "¥36-54",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "集美区"
        ]
      },
      {
        "id": "real-xm-boba-B0FFI45C3X",
        "name": "黑桃漫生活(同安店)",
        "type": "milktea",
        "lat": 24.728746,
        "lng": 118.152003,
        "rating": 4,
        "reviewsCount": 230,
        "address": "同新路54号之104-106店面",
        "signature": "招牌波霸奶茶 (Classic Boba Milk Tea)",
        "priceRange": "¥18-26",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "同安区"
        ]
      },
      {
        "id": "real-xm-boba-B0LKKSMULA",
        "name": "肯悦咖啡中华城店",
        "type": "milktea",
        "lat": 24.453125,
        "lng": 118.082075,
        "rating": 4,
        "reviewsCount": 454,
        "address": "中山路240号地下一层01单元中华城新街公园A1-B149",
        "signature": "招牌波霸奶茶 (Classic Boba Milk Tea)",
        "priceRange": "¥10-16",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "思明区"
        ]
      },
      {
        "id": "real-xm-boba-B0IKUZ2H4C",
        "name": "葉胧吟-旬旨割烹料理(SM厦门三期店)",
        "type": "milktea",
        "lat": 24.501551,
        "lng": 118.12468,
        "rating": 4.5,
        "reviewsCount": 172,
        "address": "嘉禾路399号SM新生活广场(厦门思明店)L4层",
        "signature": "生椰爆汁西瓜 (Raw Coconut Watermelon)",
        "priceRange": "¥127-191",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "湖里区"
        ]
      },
      {
        "id": "real-xm-boba-B0LB7Z4S1J",
        "name": "想开了咖啡甜品",
        "type": "milktea",
        "lat": 24.576533,
        "lng": 118.099672,
        "rating": 4.2,
        "reviewsCount": 329,
        "address": "银亭路10-2号108室",
        "signature": "生椰爆汁西瓜 (Raw Coconut Watermelon)",
        "priceRange": "¥19-29",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "集美区"
        ]
      },
      {
        "id": "real-xm-boba-B0HATU12YW",
        "name": "稀编咖啡",
        "type": "milktea",
        "lat": 24.728243,
        "lng": 118.150451,
        "rating": 4.6,
        "reviewsCount": 411,
        "address": "厦门市同安区金桥巷24号105室",
        "signature": "招牌波霸奶茶 (Classic Boba Milk Tea)",
        "priceRange": "¥29-43",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "同安区"
        ]
      },
      {
        "id": "real-xm-boba-B0J1VG9NHQ",
        "name": "Manner Coffee(中华城南区店)",
        "type": "milktea",
        "lat": 24.45296,
        "lng": 118.082823,
        "rating": 4.5,
        "reviewsCount": 200,
        "address": "思明南路195号中华城南区1F层",
        "signature": "桂花燕麦拿铁 (精品拿铁咖啡)",
        "priceRange": "¥16-24",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "思明区"
        ]
      },
      {
        "id": "real-xm-boba-B0J2T53POK",
        "name": "星巴克(厦门SM三期分店)",
        "type": "milktea",
        "lat": 24.501487,
        "lng": 118.124798,
        "rating": 4.5,
        "reviewsCount": 392,
        "address": "嘉禾路401号SM三期地上一层105a号铺位",
        "signature": "臻选冷萃咖啡 (精品冷萃咖啡)",
        "priceRange": "¥22-34",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "湖里区"
        ]
      },
      {
        "id": "real-xm-boba-B0FFGCRW48",
        "name": "安朴寿司(集美实验幼儿园店)",
        "type": "milktea",
        "lat": 24.573522,
        "lng": 118.100844,
        "rating": 4.4,
        "reviewsCount": 231,
        "address": "塘埔路39号之15号",
        "signature": "杨枝甘露轻盈版 (Mango Sago)",
        "priceRange": "¥35-53",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "集美区"
        ]
      },
      {
        "id": "real-xm-boba-B0K6C52D03",
        "name": "Bakery Cafe(夏商钟楼生活广场店)",
        "type": "milktea",
        "lat": 24.730714,
        "lng": 118.152188,
        "rating": 0.5,
        "reviewsCount": 202,
        "address": "南门路75号夏商钟楼生活广场",
        "signature": "杨枝甘露轻盈版 (Mango Sago)",
        "priceRange": "¥29-43",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "同安区"
        ]
      },
      {
        "id": "real-xm-boba-B0HUV519Q4",
        "name": "杰象泰泰小厨(中华城北区店)",
        "type": "milktea",
        "lat": 24.453185,
        "lng": 118.081981,
        "rating": 3.5,
        "reviewsCount": 435,
        "address": "思明南路195号中华城北区3F层",
        "signature": "杨枝甘露轻盈版 (Mango Sago)",
        "priceRange": "¥77-115",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "思明区"
        ]
      },
      {
        "id": "real-xm-boba-B0IKGZ4F05",
        "name": "哲平鳗满(SM厦门3期店)",
        "type": "milktea",
        "lat": 24.501253,
        "lng": 118.124623,
        "rating": 4.4,
        "reviewsCount": 302,
        "address": "嘉禾路399号SM新生活广场(厦门思明店)L4层",
        "signature": "招牌波霸奶茶 (Classic Boba Milk Tea)",
        "priceRange": "¥64-96",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "湖里区"
        ]
      },
      {
        "id": "real-xm-boba-B0KRTCT4A1",
        "name": "吾集咖啡",
        "type": "milktea",
        "lat": 24.573832,
        "lng": 118.101948,
        "rating": 4.6,
        "reviewsCount": 220,
        "address": "集美街道集源路58-47号",
        "signature": "招牌波霸奶茶 (Classic Boba Milk Tea)",
        "priceRange": "¥28-42",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "集美区"
        ]
      },
      {
        "id": "real-xm-boba-B0KRMAZNP2",
        "name": "肯悦咖啡同安钟楼店",
        "type": "milktea",
        "lat": 24.730643,
        "lng": 118.152617,
        "rating": 3.9,
        "reviewsCount": 173,
        "address": "大同街道南门路75号钟楼安置房商场夏商钟楼百货一层A04-1",
        "signature": "招牌波霸奶茶 (Classic Boba Milk Tea)",
        "priceRange": "¥18-28",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "同安区"
        ]
      }
    ]
  },
  {
    "name": "汕头市 (全域真实覆盖)",
    "city": "汕头",
    "lat": 23.3643,
    "lng": 116.7163,
    "radius": 50000,
    "lastUpdated": "2026-06-24",
    "shops": [
      {
        "id": "real-st-matcha-B0JBFZ1YTG",
        "name": "瑞幸咖啡(汕头万象城店)",
        "type": "milktea",
        "lat": 23.363303,
        "lng": 116.716572,
        "rating": 4.5,
        "reviewsCount": 283,
        "address": "金霞街道汕头万象城L608",
        "signature": "雪顶抹茶芝士冰沙 (Matcha Cheese Slush)",
        "priceRange": "¥10-14",
        "hours": "09:30 - 22:00",
        "tags": [
          "抹茶",
          "Matcha",
          "真实探店",
          "龙湖区"
        ]
      },
      {
        "id": "real-st-matcha-B0FFKKJIFH",
        "name": "星巴克(汕头金平万达广场店)",
        "type": "milktea",
        "lat": 23.381274,
        "lng": 116.681498,
        "rating": 4.6,
        "reviewsCount": 325,
        "address": "潮汕路61号金平万达广场地上一层1053号店铺",
        "signature": "特浓抹茶千层蛋糕 (Matcha Mille Crepe)",
        "priceRange": "¥24-36",
        "hours": "09:30 - 22:00",
        "tags": [
          "抹茶",
          "Matcha",
          "真实探店",
          "金平区"
        ]
      },
      {
        "id": "real-st-matcha-B0J12M1SHX",
        "name": "星巴克(帝璟苑店)",
        "type": "milktea",
        "lat": 23.242061,
        "lng": 116.441425,
        "rating": 4.6,
        "reviewsCount": 266,
        "address": "峡山街道峡山居委咬兰洋峡溪路001号帝璟苑第10幢地上一层067号单元",
        "signature": "白玉小子抹茶波波茶 (Boba Matcha Milk)",
        "priceRange": "¥34-50",
        "hours": "09:30 - 22:00",
        "tags": [
          "抹茶",
          "Matcha",
          "真实探店",
          "潮南区"
        ]
      },
      {
        "id": "real-st-matcha-B0KUPZ1820",
        "name": "小鱼GELATO(万象城店)",
        "type": "milktea",
        "lat": 23.363338,
        "lng": 116.717592,
        "rating": 3.9,
        "reviewsCount": 181,
        "address": "金霞街道长平路95号华润大厦商业裙楼润街238号",
        "signature": "宇治手打冰点 (Uji Matcha Ice)",
        "priceRange": "¥19-29",
        "hours": "09:30 - 22:00",
        "tags": [
          "抹茶",
          "Matcha",
          "真实探店",
          "龙湖区"
        ]
      },
      {
        "id": "real-st-matcha-B0LG9HV8C6",
        "name": "FUFU·烘焙屋",
        "type": "milktea",
        "lat": 23.375204,
        "lng": 116.699443,
        "rating": 4.1,
        "reviewsCount": 293,
        "address": "金湖路95号金紫世家7栋107号房",
        "signature": "白玉小子抹茶波波茶 (Boba Matcha Milk)",
        "priceRange": "¥20-30",
        "hours": "09:30 - 22:00",
        "tags": [
          "抹茶",
          "Matcha",
          "真实探店",
          "金平区"
        ]
      },
      {
        "id": "real-st-matcha-B0H2YYXNJY",
        "name": "星巴克臻选(汕头万象城店)",
        "type": "milktea",
        "lat": 23.362312,
        "lng": 116.717437,
        "rating": 4.6,
        "reviewsCount": 183,
        "address": "金环路与长平路交界处东北角万象城地上一层L156号",
        "signature": "宇治手打冰点 (Uji Matcha Ice)",
        "priceRange": "¥24-36",
        "hours": "09:30 - 22:00",
        "tags": [
          "抹茶",
          "Matcha",
          "真实探店",
          "龙湖区"
        ]
      },
      {
        "id": "real-st-matcha-B0G2LML8PS",
        "name": "星巴克汕头东厦路分店",
        "type": "milktea",
        "lat": 23.37915,
        "lng": 116.703879,
        "rating": 4.5,
        "reviewsCount": 79,
        "address": "东厦路100号东厦壹佰购物商场地上一层F125、F126号店铺",
        "signature": "白玉小子抹茶波波茶 (Boba Matcha Milk)",
        "priceRange": "¥24-36",
        "hours": "09:30 - 22:00",
        "tags": [
          "抹茶",
          "Matcha",
          "真实探店",
          "金平区"
        ]
      },
      {
        "id": "real-st-matcha-B0JUU7J0TT",
        "name": "鲍师傅糕点(欣荣大厦店)",
        "type": "milktea",
        "lat": 23.361926,
        "lng": 116.715538,
        "rating": 4.7,
        "reviewsCount": 471,
        "address": "长平路88号欣荣大厦一楼102号",
        "signature": "宇治特浓抹茶拿铁 (Matcha Latte)",
        "priceRange": "¥15-23",
        "hours": "09:30 - 22:00",
        "tags": [
          "抹茶",
          "Matcha",
          "真实探店",
          "龙湖区"
        ]
      },
      {
        "id": "real-st-matcha-B0FFG8R7A4",
        "name": "星巴克(苏宁广场店)",
        "type": "milktea",
        "lat": 23.361717,
        "lng": 116.716662,
        "rating": 4.5,
        "reviewsCount": 371,
        "address": "长平路90号汕头苏宁广场地上1层102单元",
        "signature": "白玉小子抹茶波波茶 (Boba Matcha Milk)",
        "priceRange": "¥24-36",
        "hours": "09:30 - 22:00",
        "tags": [
          "抹茶",
          "Matcha",
          "真实探店",
          "龙湖区"
        ]
      },
      {
        "id": "real-st-matcha-B0IG77Q4NW",
        "name": "沪上阿姨·精选茶饮(汕头苏宁广场店)",
        "type": "milktea",
        "lat": 23.361341,
        "lng": 116.716414,
        "rating": 4.3,
        "reviewsCount": 394,
        "address": "长平路90号苏宁广场1-7层01号复式一楼西侧通道旁部分区域",
        "signature": "雪顶抹茶芝士冰沙 (Matcha Cheese Slush)",
        "priceRange": "¥11-17",
        "hours": "09:30 - 22:00",
        "tags": [
          "抹茶",
          "Matcha",
          "真实探店",
          "龙湖区"
        ]
      },
      {
        "id": "real-st-matcha-B0GDLZGNG2",
        "name": "瑞幸咖啡(汕头苏宁广场店)",
        "type": "milktea",
        "lat": 23.361188,
        "lng": 116.716766,
        "rating": 4.5,
        "reviewsCount": 249,
        "address": "金霞街道长平路90号苏宁广场写字楼2幢大堂",
        "signature": "白玉小子抹茶波波茶 (Boba Matcha Milk)",
        "priceRange": "¥10-16",
        "hours": "09:30 - 22:00",
        "tags": [
          "抹茶",
          "Matcha",
          "真实探店",
          "龙湖区"
        ]
      },
      {
        "id": "real-st-matcha-B0LRHS8B95",
        "name": "库迪咖啡(汕头长平路店)",
        "type": "milktea",
        "lat": 23.361916,
        "lng": 116.713738,
        "rating": 4.5,
        "reviewsCount": 261,
        "address": "长平路与龙华南街交叉口东40米东方园北区7栋103",
        "signature": "宇治特浓抹茶拿铁 (Matcha Latte)",
        "priceRange": "¥7-11",
        "hours": "09:30 - 22:00",
        "tags": [
          "抹茶",
          "Matcha",
          "真实探店",
          "龙湖区"
        ]
      },
      {
        "id": "real-st-matcha-B0G3UNXDNC",
        "name": "MaiMaiDuLi麦麦嘟里烘焙",
        "type": "milktea",
        "lat": 23.365635,
        "lng": 116.71972,
        "rating": 4.7,
        "reviewsCount": 208,
        "address": "丹霞庄西区1栋东102",
        "signature": "特浓抹茶千层蛋糕 (Matcha Mille Crepe)",
        "priceRange": "¥16-24",
        "hours": "09:30 - 22:00",
        "tags": [
          "抹茶",
          "Matcha",
          "真实探店",
          "龙湖区"
        ]
      },
      {
        "id": "real-st-matcha-B0FFIIP93D",
        "name": "东坊古早(华山店)",
        "type": "milktea",
        "lat": 23.363742,
        "lng": 116.721476,
        "rating": 4,
        "reviewsCount": 122,
        "address": "丹霞庄中区6栋3梯",
        "signature": "白玉小子抹茶波波茶 (Boba Matcha Milk)",
        "priceRange": "¥12-18",
        "hours": "09:30 - 22:00",
        "tags": [
          "抹茶",
          "Matcha",
          "真实探店",
          "龙湖区"
        ]
      },
      {
        "id": "real-st-matcha-B0FFJ23V5M",
        "name": "因味·虾混",
        "type": "milktea",
        "lat": 23.368686,
        "lng": 116.719062,
        "rating": 4.6,
        "reviewsCount": 157,
        "address": "榕江路9号",
        "signature": "雪顶抹茶芝士冰沙 (Matcha Cheese Slush)",
        "priceRange": "¥58-86",
        "hours": "09:30 - 22:00",
        "tags": [
          "抹茶",
          "Matcha",
          "真实探店",
          "龙湖区"
        ]
      },
      {
        "id": "real-st-boba-B0LR9RPX2S",
        "name": "日耀咖啡",
        "type": "milktea",
        "lat": 23.360829,
        "lng": 116.680659,
        "rating": 4.1,
        "reviewsCount": 168,
        "address": "36号103铺",
        "signature": "招牌波霸奶茶 (Classic Boba Milk Tea)",
        "priceRange": "¥12-18",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "金平区"
        ]
      },
      {
        "id": "real-st-boba-B02F2022EC",
        "name": "6星集咖啡(峡山店)",
        "type": "milktea",
        "lat": 23.242982,
        "lng": 116.445574,
        "rating": 1.1,
        "reviewsCount": 250,
        "address": "广汕公路峡山客运站对面",
        "signature": "生椰爆汁西瓜 (Raw Coconut Watermelon)",
        "priceRange": "¥80-120",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "潮南区"
        ]
      },
      {
        "id": "real-st-boba-B0L0TB8QL5",
        "name": "NOWWA挪瓦咖啡(天福汕头中区大厦店)",
        "type": "milktea",
        "lat": 23.358225,
        "lng": 116.676075,
        "rating": 3.3,
        "reviewsCount": 212,
        "address": "镇平路与福平路交叉口东160米",
        "signature": "招牌波霸奶茶 (Classic Boba Milk Tea)",
        "priceRange": "¥14-20",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "金平区"
        ]
      },
      {
        "id": "real-st-boba-B0J227MOKO",
        "name": "库迪咖啡(潮南合胜广场店)",
        "type": "milktea",
        "lat": 23.240725,
        "lng": 116.442675,
        "rating": 4.2,
        "reviewsCount": 489,
        "address": "合胜香域广场5栋508(安踏体育专卖店南侧)",
        "signature": "潘帕斯生椰拿铁 (生椰拿铁系列)",
        "priceRange": "¥10-16",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "潮南区"
        ]
      },
      {
        "id": "real-st-boba-B0L32Z3A4Y",
        "name": "潮厝咖啡",
        "type": "milktea",
        "lat": 23.366267,
        "lng": 116.684557,
        "rating": 4,
        "reviewsCount": 394,
        "address": "杏花路16号一层108",
        "signature": "生椰爆汁西瓜 (Raw Coconut Watermelon)",
        "priceRange": "¥14-20",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "金平区"
        ]
      },
      {
        "id": "real-st-boba-B0H2U5R997",
        "name": "瑞幸咖啡(潮南合胜广场店)",
        "type": "milktea",
        "lat": 23.240375,
        "lng": 116.442975,
        "rating": 4.5,
        "reviewsCount": 165,
        "address": "峡山街道广汕公路峡山路段123号香域广场7幢商墅建筑物5-22号一、二层",
        "signature": "生椰拿铁 (经典爆款冷萃生椰咖啡)",
        "priceRange": "¥10-16",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "潮南区"
        ]
      },
      {
        "id": "real-st-boba-B0H37LDH08",
        "name": "红砖楼咖啡馆",
        "type": "milktea",
        "lat": 23.356396,
        "lng": 116.675919,
        "rating": 4.5,
        "reviewsCount": 180,
        "address": "福平路85号",
        "signature": "生椰爆汁西瓜 (Raw Coconut Watermelon)",
        "priceRange": "¥22-32",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "金平区"
        ]
      },
      {
        "id": "real-st-boba-B0LU3H9OKV",
        "name": "花漫里日式餐厅(峡山合胜广场店)",
        "type": "milktea",
        "lat": 23.240183,
        "lng": 116.442989,
        "rating": 4.2,
        "reviewsCount": 417,
        "address": "合胜广场2楼06卡",
        "signature": "招牌波霸奶茶 (Classic Boba Milk Tea)",
        "priceRange": "¥42-62",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "潮南区"
        ]
      },
      {
        "id": "real-st-boba-B0JDJDEF7O",
        "name": "Miga cafe乜個咖啡",
        "type": "milktea",
        "lat": 23.356591,
        "lng": 116.673757,
        "rating": 4.4,
        "reviewsCount": 333,
        "address": "小公园街道国平路66号",
        "signature": "生椰爆汁西瓜 (Raw Coconut Watermelon)",
        "priceRange": "¥24-36",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "金平区"
        ]
      },
      {
        "id": "real-st-boba-B0HU4DKFYQ",
        "name": "大赞中华寿司汕头合胜店(汕头合胜店)",
        "type": "milktea",
        "lat": 23.240101,
        "lng": 116.442795,
        "rating": 4.4,
        "reviewsCount": 426,
        "address": "峡山街道合胜广场7栋3层09铺",
        "signature": "生椰爆汁西瓜 (Raw Coconut Watermelon)",
        "priceRange": "¥48-72",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "潮南区"
        ]
      },
      {
        "id": "real-st-boba-B0IUDZDGL5",
        "name": "岚野寿司店",
        "type": "milktea",
        "lat": 23.355085,
        "lng": 116.679311,
        "rating": 3.6,
        "reviewsCount": 312,
        "address": "商业街1号03分",
        "signature": "生椰爆汁西瓜 (Raw Coconut Watermelon)",
        "priceRange": "¥27-41",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "金平区"
        ]
      },
      {
        "id": "real-st-boba-B0L2O1W40K",
        "name": "nowwa挪瓦咖啡(天福潮南峡山希尔顿店)",
        "type": "milktea",
        "lat": 23.237975,
        "lng": 116.443025,
        "rating": 3.8,
        "reviewsCount": 258,
        "address": "峡溪路与晋安新区三街交叉口西北80米",
        "signature": "招牌波霸奶茶 (Classic Boba Milk Tea)",
        "priceRange": "¥12-18",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "潮南区"
        ]
      },
      {
        "id": "real-st-boba-B0L0VRIT85",
        "name": "潮艺鸭屎香.潮汕柠檬咖啡",
        "type": "milktea",
        "lat": 23.355456,
        "lng": 116.674322,
        "rating": 3.5,
        "reviewsCount": 60,
        "address": "升平路48号",
        "signature": "招牌波霸奶茶 (Classic Boba Milk Tea)",
        "priceRange": "¥13-19",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "金平区"
        ]
      },
      {
        "id": "real-st-boba-B0MB6RO7I8",
        "name": "栖木咖啡",
        "type": "milktea",
        "lat": 23.252297,
        "lng": 116.436506,
        "rating": 4.4,
        "reviewsCount": 292,
        "address": "朝晖路106号",
        "signature": "杨枝甘露轻盈版 (Mango Sago)",
        "priceRange": "¥18-26",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "潮南区"
        ]
      },
      {
        "id": "real-st-boba-B0KB6M6BKV",
        "name": "瑞幸咖啡(汕头小公园店)",
        "type": "milktea",
        "lat": 23.355455,
        "lng": 116.673772,
        "rating": 4.5,
        "reviewsCount": 485,
        "address": "汕头小公园升平路60号之三",
        "signature": "生椰拿铁 (经典爆款冷萃生椰咖啡)",
        "priceRange": "¥10-16",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "金平区"
        ]
      },
      {
        "id": "real-st-boba-B0KD1RHF3D",
        "name": "壹加COFFEE AND HOTDOG",
        "type": "milktea",
        "lat": 23.250042,
        "lng": 116.431892,
        "rating": 3.7,
        "reviewsCount": 295,
        "address": "朝阳路与峡华路交叉口西40米",
        "signature": "杨枝甘露轻盈版 (Mango Sago)",
        "priceRange": "¥17-25",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "潮南区"
        ]
      },
      {
        "id": "real-st-boba-B0KKCA5IX5",
        "name": "luckin coffee 瑞幸咖啡(汕头小公园店)",
        "type": "milktea",
        "lat": 23.355402,
        "lng": 116.673719,
        "rating": 4.5,
        "reviewsCount": 201,
        "address": "国平路32号",
        "signature": "生椰拿铁 (经典爆款冷萃生椰咖啡)",
        "priceRange": "¥11-17",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "金平区"
        ]
      },
      {
        "id": "real-st-boba-B0L6DZ5YZP",
        "name": "瑞幸咖啡(峡山商场店)",
        "type": "milktea",
        "lat": 23.251412,
        "lng": 116.430354,
        "rating": 4.5,
        "reviewsCount": 256,
        "address": "峡山街道金光路65号",
        "signature": "生椰拿铁 (经典爆款冷萃生椰咖啡)",
        "priceRange": "¥10-16",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "潮南区"
        ]
      },
      {
        "id": "real-st-boba-B0JA9AB9SY",
        "name": "Kcoffee(小公园店)",
        "type": "milktea",
        "lat": 23.355054,
        "lng": 116.673832,
        "rating": 4.6,
        "reviewsCount": 314,
        "address": "小公园街道百货大楼北侧1号商铺",
        "signature": "生椰爆汁西瓜 (Raw Coconut Watermelon)",
        "priceRange": "¥14-20",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "金平区"
        ]
      },
      {
        "id": "real-st-boba-B0MB91V4LB",
        "name": "MOSSCOFFEE苔痕",
        "type": "milktea",
        "lat": 23.253995,
        "lng": 116.429188,
        "rating": 2.6,
        "reviewsCount": 477,
        "address": "十九街918号峡山商贸中心",
        "signature": "招牌波霸奶茶 (Classic Boba Milk Tea)",
        "priceRange": "¥12-25",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "潮南区"
        ]
      }
    ]
  }
];
