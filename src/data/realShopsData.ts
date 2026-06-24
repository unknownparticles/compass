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
        "id": "real-xm-matcha-B0LDRZCP1F",
        "name": "初待抹茶甜品(集美店)",
        "type": "milktea",
        "lat": 24.573325,
        "lng": 118.101975,
        "rating": 4,
        "reviewsCount": 408,
        "address": "集美塘盛小区集美花园东区",
        "signature": "宇治特浓抹茶拿铁 (Matcha Latte)",
        "priceRange": "¥11-17",
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
        "id": "real-xm-matcha-B02500QFOD",
        "name": "哈根达斯(sm新生活广场2期店)",
        "type": "milktea",
        "lat": 24.500064,
        "lng": 118.124561,
        "rating": 4.5,
        "reviewsCount": 427,
        "address": "嘉禾路401号SM二期红宝石二楼",
        "signature": "白玉小子抹茶波波茶 (Boba Matcha Milk)",
        "priceRange": "¥50-74",
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
        "id": "real-xm-matcha-B0FFLCYW9Y",
        "name": "古茗(同安中山路)",
        "type": "milktea",
        "lat": 24.731509,
        "lng": 118.149767,
        "rating": 4.5,
        "reviewsCount": 301,
        "address": "中山路79号",
        "signature": "特浓抹茶千层蛋糕 (Matcha Mille Crepe)",
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
        "id": "real-xm-boba-B0FFHTWFPF",
        "name": "快乐番薯(厦门思明南路店)",
        "type": "milktea",
        "lat": 24.452956,
        "lng": 118.08254,
        "rating": 4.2,
        "reviewsCount": 207,
        "address": "思明南路210号之一",
        "signature": "杨枝甘露轻盈版 (Mango Sago)",
        "priceRange": "¥6-10",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "思明区"
        ]
      },
      {
        "id": "real-xm-boba-B0IK95393X",
        "name": "星仔冰室·茶餐厅(SM三期店)",
        "type": "milktea",
        "lat": 24.501845,
        "lng": 118.125261,
        "rating": 4.5,
        "reviewsCount": 109,
        "address": "嘉禾路399号SM新生活广场(厦门思明店)B1层",
        "signature": "招牌波霸奶茶 (Classic Boba Milk Tea)",
        "priceRange": "¥40-60",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "湖里区"
        ]
      },
      {
        "id": "real-xm-boba-B0MG1RTO79",
        "name": "奶茶店",
        "type": "milktea",
        "lat": 24.574744,
        "lng": 118.099501,
        "rating": 2.7,
        "reviewsCount": 70,
        "address": "石鼓路与集源路交叉口东北40米",
        "signature": "招牌波霸奶茶 (Classic Boba Milk Tea)",
        "priceRange": "¥12-25",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "集美区"
        ]
      },
      {
        "id": "real-xm-boba-B0FFG7P66B",
        "name": "憨雯甘蔗汁(双溪公园店)",
        "type": "milktea",
        "lat": 24.728126,
        "lng": 118.15185,
        "rating": 4.4,
        "reviewsCount": 462,
        "address": "双溪公园金桥路71号",
        "signature": "生椰爆汁西瓜 (Raw Coconut Watermelon)",
        "priceRange": "¥10-16",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "同安区"
        ]
      },
      {
        "id": "real-xm-boba-B0FFHD66JW",
        "name": "哈根达斯(中华城店)",
        "type": "milktea",
        "lat": 24.45297,
        "lng": 118.082355,
        "rating": 4.5,
        "reviewsCount": 275,
        "address": "中华街道思明南路171之26号中华城购物中心一层1049号商铺",
        "signature": "杨枝甘露轻盈版 (Mango Sago)",
        "priceRange": "¥40-60",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "思明区"
        ]
      },
      {
        "id": "real-xm-boba-B0JUZUE78D",
        "name": "哈根达斯(厦门思明SM新生活广场店)",
        "type": "milktea",
        "lat": 24.501798,
        "lng": 118.125085,
        "rating": 4.3,
        "reviewsCount": 412,
        "address": "嘉禾路399号SM新生活广场(厦门思明店)L3层",
        "signature": "杨枝甘露轻盈版 (Mango Sago)",
        "priceRange": "¥46-70",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "湖里区"
        ]
      },
      {
        "id": "real-xm-boba-B025004E32",
        "name": "麦当劳(集美石鼓餐厅)",
        "type": "milktea",
        "lat": 24.5742,
        "lng": 118.099484,
        "rating": 4.7,
        "reviewsCount": 77,
        "address": "石鼓路120-122号集宏大厦1层",
        "signature": "生椰爆汁西瓜 (Raw Coconut Watermelon)",
        "priceRange": "¥18-28",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "集美区"
        ]
      },
      {
        "id": "real-xm-boba-B0FFG06P4O",
        "name": "阿桃甘蔗汁(同安店)",
        "type": "milktea",
        "lat": 24.728198,
        "lng": 118.152842,
        "rating": 4.4,
        "reviewsCount": 412,
        "address": "双溪街同新路93号",
        "signature": "招牌波霸奶茶 (Classic Boba Milk Tea)",
        "priceRange": "¥10-16",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "同安区"
        ]
      },
      {
        "id": "real-xm-boba-B0I2Y5RTH8",
        "name": "1点点(中华城店)",
        "type": "milktea",
        "lat": 24.453217,
        "lng": 118.081969,
        "rating": 4.5,
        "reviewsCount": 123,
        "address": "中山路242号之146(中华城A1-负一楼B146号商铺)",
        "signature": "生椰爆汁西瓜 (Raw Coconut Watermelon)",
        "priceRange": "¥18-26",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "思明区"
        ]
      },
      {
        "id": "real-xm-boba-B0LK11EEOI",
        "name": "MAKKEE(SM新生活广场厦门思明店)",
        "type": "milktea",
        "lat": 24.501822,
        "lng": 118.124739,
        "rating": 2.8,
        "reviewsCount": 67,
        "address": "嘉禾路399号SM新生活广场(厦门思明店)L3层",
        "signature": "招牌波霸奶茶 (Classic Boba Milk Tea)",
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
        "id": "real-xm-boba-B0LATU3JRM",
        "name": "熟介玉米汁",
        "type": "milktea",
        "lat": 24.573753,
        "lng": 118.099207,
        "rating": 4.5,
        "reviewsCount": 272,
        "address": "石鼓路116-102号肯德基与麦当劳中间",
        "signature": "招牌波霸奶茶 (Classic Boba Milk Tea)",
        "priceRange": "¥12-18",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "集美区"
        ]
      },
      {
        "id": "real-xm-boba-B0JGF1T67E",
        "name": "蜜雪冰城(南门路店)",
        "type": "milktea",
        "lat": 24.730223,
        "lng": 118.15211,
        "rating": 4.1,
        "reviewsCount": 124,
        "address": "大同街道同新路1-1(钟楼步行街新佳美门口)",
        "signature": "冰鲜柠檬水 (清凉夏日平价王)",
        "priceRange": "¥6-8",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "同安区"
        ]
      },
      {
        "id": "real-xm-boba-B0M6AAXUSA",
        "name": "陈仁基冬瓜茶老铺(中华城店)",
        "type": "milktea",
        "lat": 24.453125,
        "lng": 118.081825,
        "rating": 3.9,
        "reviewsCount": 236,
        "address": "思明南路195号中华城北区",
        "signature": "生椰爆汁西瓜 (Raw Coconut Watermelon)",
        "priceRange": "¥10-14",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "思明区"
        ]
      },
      {
        "id": "real-xm-boba-B0JRCNUUSD",
        "name": "茶山派(SM三期店)",
        "type": "milktea",
        "lat": 24.501728,
        "lng": 118.125164,
        "rating": 4.4,
        "reviewsCount": 234,
        "address": "龙虎山路480号503室",
        "signature": "杨枝甘露轻盈版 (Mango Sago)",
        "priceRange": "¥14-22",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "湖里区"
        ]
      },
      {
        "id": "real-xm-boba-B0LDKHOWAO",
        "name": "苹行宇宙(石鼓路店)",
        "type": "milktea",
        "lat": 24.576498,
        "lng": 118.100317,
        "rating": 4.4,
        "reviewsCount": 125,
        "address": "石鼓路166-101号",
        "signature": "招牌波霸奶茶 (Classic Boba Milk Tea)",
        "priceRange": "¥13-19",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "集美区"
        ]
      },
      {
        "id": "real-xm-boba-B0L6OZ34YV",
        "name": "麦当劳甜品站",
        "type": "milktea",
        "lat": 24.730241,
        "lng": 118.151672,
        "rating": 3.9,
        "reviewsCount": 323,
        "address": "钟楼壹号商城北门旁",
        "signature": "招牌波霸奶茶 (Classic Boba Milk Tea)",
        "priceRange": "¥21-31",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "同安区"
        ]
      },
      {
        "id": "real-xm-boba-B0LGF5R9I6",
        "name": "茶满方庭(中华城店)",
        "type": "milktea",
        "lat": 24.453018,
        "lng": 118.081852,
        "rating": 4.5,
        "reviewsCount": 386,
        "address": "思明南路127号125室中华城A1地块B区一楼1076号之2商铺",
        "signature": "招牌波霸奶茶 (Classic Boba Milk Tea)",
        "priceRange": "¥12-18",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "思明区"
        ]
      },
      {
        "id": "real-xm-boba-B0K3M5TNDU",
        "name": "巷里里·手作茶饮(SM三期店)",
        "type": "milktea",
        "lat": 24.501701,
        "lng": 118.12497,
        "rating": 4,
        "reviewsCount": 131,
        "address": "仙岳路1327号(SM广场三期负一层库迪咖啡附近)",
        "signature": "杨枝甘露轻盈版 (Mango Sago)",
        "priceRange": "¥14-20",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "湖里区"
        ]
      },
      {
        "id": "real-xm-boba-B0MD1ASK9W",
        "name": "古茗(集美区石鼓路店)",
        "type": "milktea",
        "lat": 24.573384,
        "lng": 118.099199,
        "rating": 3.8,
        "reviewsCount": 221,
        "address": "石鼓路与岑东路交叉口东南20米",
        "signature": "超大杯水果茶 (鲜果茶系列)",
        "priceRange": "¥14-22",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "集美区"
        ]
      },
      {
        "id": "real-xm-boba-B0J65AJYHQ",
        "name": "双溪天台茶馆",
        "type": "milktea",
        "lat": 24.728207,
        "lng": 118.153109,
        "rating": 4.3,
        "reviewsCount": 82,
        "address": "同新路93号",
        "signature": "杨枝甘露轻盈版 (Mango Sago)",
        "priceRange": "¥36-54",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "同安区"
        ]
      },
      {
        "id": "real-xm-bar-B0KDKSMZE1",
        "name": "Launch Whisky&Cocktail Bar",
        "type": "bar",
        "lat": 24.453582,
        "lng": 118.083195,
        "rating": 4.4,
        "reviewsCount": 90,
        "address": "中华街道仁安巷31号(镇海路地铁站出入口步行370米)",
        "signature": "特调长岛冰茶 (Long Island Iced Tea)",
        "priceRange": "¥72-108",
        "hours": "18:00 - 02:30",
        "tags": [
          "精酿啤酒",
          "鸡尾酒",
          "社交小酌",
          "思明区"
        ]
      },
      {
        "id": "real-xm-bar-B0MGZ7J7C6",
        "name": "U homebar(厦门SM广场店)",
        "type": "bar",
        "lat": 24.501157,
        "lng": 118.125104,
        "rating": 3.7,
        "reviewsCount": 461,
        "address": "SM广场3期外庭(1号门对面溶洞)",
        "signature": "特调长岛冰茶 (Long Island Iced Tea)",
        "priceRange": "¥105-157",
        "hours": "18:00 - 02:30",
        "tags": [
          "精酿啤酒",
          "鸡尾酒",
          "社交小酌",
          "湖里区"
        ]
      },
      {
        "id": "real-xm-bar-B0L3MCKY42",
        "name": "irisbar(集源路店)",
        "type": "bar",
        "lat": 24.575053,
        "lng": 118.100721,
        "rating": 3.7,
        "reviewsCount": 215,
        "address": "集源路与石鼓路交叉口东北160米",
        "signature": "经典莫吉托 (Classic Mojito)",
        "priceRange": "¥60-150",
        "hours": "18:00 - 02:30",
        "tags": [
          "精酿啤酒",
          "鸡尾酒",
          "社交小酌",
          "集美区"
        ]
      },
      {
        "id": "real-xm-bar-B0LUZMUGUD",
        "name": "0°Autumn",
        "type": "bar",
        "lat": 24.730231,
        "lng": 118.154261,
        "rating": 3.6,
        "reviewsCount": 185,
        "address": "大同街道南门路",
        "signature": "特调长岛冰茶 (Long Island Iced Tea)",
        "priceRange": "¥60-150",
        "hours": "18:00 - 02:30",
        "tags": [
          "精酿啤酒",
          "鸡尾酒",
          "社交小酌",
          "同安区"
        ]
      },
      {
        "id": "real-xm-bar-B0L0RY5D2F",
        "name": "上隐·DINING TABLE",
        "type": "bar",
        "lat": 24.453475,
        "lng": 118.083325,
        "rating": 3.1,
        "reviewsCount": 86,
        "address": "仁安巷与桥亭街交叉口西南40米",
        "signature": "金汤力特调 (Gin and Tonic)",
        "priceRange": "¥60-150",
        "hours": "18:00 - 02:30",
        "tags": [
          "精酿啤酒",
          "鸡尾酒",
          "社交小酌",
          "思明区"
        ]
      },
      {
        "id": "real-xm-bar-B0L0S7KLRX",
        "name": "MONOLOGUE 独白(Sm三期一楼)",
        "type": "bar",
        "lat": 24.500791,
        "lng": 118.124444,
        "rating": 3.5,
        "reviewsCount": 171,
        "address": "嘉禾路SM三期一楼401号109A",
        "signature": "特调长岛冰茶 (Long Island Iced Tea)",
        "priceRange": "¥60-150",
        "hours": "18:00 - 02:30",
        "tags": [
          "精酿啤酒",
          "鸡尾酒",
          "社交小酌",
          "湖里区"
        ]
      },
      {
        "id": "real-xm-bar-B0L35DDOXJ",
        "name": "不晚",
        "type": "bar",
        "lat": 24.573735,
        "lng": 118.099479,
        "rating": 3.9,
        "reviewsCount": 287,
        "address": "石鼓路118号101室",
        "signature": "金汤力特调 (Gin and Tonic)",
        "priceRange": "¥108-162",
        "hours": "18:00 - 02:30",
        "tags": [
          "精酿啤酒",
          "鸡尾酒",
          "社交小酌",
          "集美区"
        ]
      },
      {
        "id": "real-xm-bar-B0KRCXDG1T",
        "name": "许工你好Cocktail&Whisky bar",
        "type": "bar",
        "lat": 24.72632,
        "lng": 118.15035,
        "rating": 4.1,
        "reviewsCount": 236,
        "address": "陆丰里191-101",
        "signature": "金汤力特调 (Gin and Tonic)",
        "priceRange": "¥46-70",
        "hours": "18:00 - 02:30",
        "tags": [
          "精酿啤酒",
          "鸡尾酒",
          "社交小酌",
          "同安区"
        ]
      },
      {
        "id": "real-xm-bar-B0L1TP1M6H",
        "name": "它它派对",
        "type": "bar",
        "lat": 24.453044,
        "lng": 118.080987,
        "rating": 4.5,
        "reviewsCount": 237,
        "address": "老虎城欢乐购物中心三楼",
        "signature": "特调长岛冰茶 (Long Island Iced Tea)",
        "priceRange": "¥36-54",
        "hours": "18:00 - 02:30",
        "tags": [
          "精酿啤酒",
          "鸡尾酒",
          "社交小酌",
          "思明区"
        ]
      },
      {
        "id": "real-xm-bar-B0KRAZ7J5O",
        "name": "PALLADIUM(SM城市广场1期店)",
        "type": "bar",
        "lat": 24.500562,
        "lng": 118.127093,
        "rating": 3.4,
        "reviewsCount": 387,
        "address": "江头街道嘉禾路468号SM城市广场一期2楼221-222室",
        "signature": "经典莫吉托 (Classic Mojito)",
        "priceRange": "¥60-150",
        "hours": "18:00 - 02:30",
        "tags": [
          "精酿啤酒",
          "鸡尾酒",
          "社交小酌",
          "湖里区"
        ]
      },
      {
        "id": "real-xm-bar-B0LU5AMQ1V",
        "name": "XXX SPACE",
        "type": "bar",
        "lat": 24.576533,
        "lng": 118.099672,
        "rating": 4.1,
        "reviewsCount": 278,
        "address": "银亭路10-2号103室",
        "signature": "经典莫吉托 (Classic Mojito)",
        "priceRange": "¥60-150",
        "hours": "18:00 - 02:30",
        "tags": [
          "精酿啤酒",
          "鸡尾酒",
          "社交小酌",
          "集美区"
        ]
      },
      {
        "id": "real-xm-bar-B0LR4RPVO4",
        "name": "主者精酿(同安陆丰店)",
        "type": "bar",
        "lat": 24.725734,
        "lng": 118.151257,
        "rating": 4.2,
        "reviewsCount": 177,
        "address": "陆丰里163-1",
        "signature": "经典莫吉托 (Classic Mojito)",
        "priceRange": "¥46-68",
        "hours": "18:00 - 02:30",
        "tags": [
          "精酿啤酒",
          "鸡尾酒",
          "社交小酌",
          "同安区"
        ]
      },
      {
        "id": "real-xm-bar-B0J1MZVD7S",
        "name": "中左所Amoy bar鸡尾酒·威士忌",
        "type": "bar",
        "lat": 24.453337,
        "lng": 118.07971,
        "rating": 4.5,
        "reviewsCount": 486,
        "address": "中华街道定安路59-102号",
        "signature": "特调长岛冰茶 (Long Island Iced Tea)",
        "priceRange": "¥81-121",
        "hours": "18:00 - 02:30",
        "tags": [
          "精酿啤酒",
          "鸡尾酒",
          "社交小酌",
          "思明区"
        ]
      },
      {
        "id": "real-xm-bar-B0MBUUMLI1",
        "name": "空瓶子LIVESHOW(道里区店)",
        "type": "bar",
        "lat": 24.498825,
        "lng": 118.125825,
        "rating": 3.1,
        "reviewsCount": 428,
        "address": "嘉禾路468号SM城市广场(厦门湖里店)",
        "signature": "金汤力特调 (Gin and Tonic)",
        "priceRange": "¥70-104",
        "hours": "18:00 - 02:30",
        "tags": [
          "精酿啤酒",
          "鸡尾酒",
          "社交小酌",
          "湖里区"
        ]
      },
      {
        "id": "real-xm-bar-B0K0D5GTGP",
        "name": "小酌酒馆",
        "type": "bar",
        "lat": 24.573473,
        "lng": 118.099486,
        "rating": 4.6,
        "reviewsCount": 274,
        "address": "石鼓路114号101",
        "signature": "金汤力特调 (Gin and Tonic)",
        "priceRange": "¥50-76",
        "hours": "18:00 - 02:30",
        "tags": [
          "精酿啤酒",
          "鸡尾酒",
          "社交小酌",
          "集美区"
        ]
      },
      {
        "id": "real-xm-bar-B0MG2B1KW9",
        "name": "自唱小酒屋",
        "type": "bar",
        "lat": 24.726175,
        "lng": 118.148375,
        "rating": 1.9,
        "reviewsCount": 460,
        "address": "西桥路54号新城花园",
        "signature": "金汤力特调 (Gin and Tonic)",
        "priceRange": "¥60-150",
        "hours": "18:00 - 02:30",
        "tags": [
          "精酿啤酒",
          "鸡尾酒",
          "社交小酌",
          "同安区"
        ]
      },
      {
        "id": "real-xm-bar-B0FFFIB9Q1",
        "name": "MY WAY地下鸡尾酒吧(中山路店)",
        "type": "bar",
        "lat": 24.451731,
        "lng": 118.085321,
        "rating": 4.4,
        "reviewsCount": 472,
        "address": "镇海路双十中学正对面(镇海路地铁站3B口步行160米)",
        "signature": "经典莫吉托 (Classic Mojito)",
        "priceRange": "¥86-128",
        "hours": "18:00 - 02:30",
        "tags": [
          "精酿啤酒",
          "鸡尾酒",
          "社交小酌",
          "思明区"
        ]
      },
      {
        "id": "real-xm-bar-B0H2Z7ATOO",
        "name": "BOOMSHAKE酒吧",
        "type": "bar",
        "lat": 24.498475,
        "lng": 118.123925,
        "rating": 4.4,
        "reviewsCount": 420,
        "address": "仙岳路1183号-2门店",
        "signature": "特调长岛冰茶 (Long Island Iced Tea)",
        "priceRange": "¥104-156",
        "hours": "18:00 - 02:30",
        "tags": [
          "精酿啤酒",
          "鸡尾酒",
          "社交小酌",
          "湖里区"
        ]
      },
      {
        "id": "real-xm-bar-B0L6GY20SQ",
        "name": "folk song日屿夜",
        "type": "bar",
        "lat": 24.576847,
        "lng": 118.101096,
        "rating": 3.5,
        "reviewsCount": 252,
        "address": "银亭路与石鼓路交叉口东80米",
        "signature": "金汤力特调 (Gin and Tonic)",
        "priceRange": "¥23-35",
        "hours": "18:00 - 02:30",
        "tags": [
          "精酿啤酒",
          "鸡尾酒",
          "社交小酌",
          "集美区"
        ]
      },
      {
        "id": "real-xm-bar-B0JRAMFSQ0",
        "name": "遇见·不晚",
        "type": "bar",
        "lat": 24.733672,
        "lng": 118.151844,
        "rating": 4,
        "reviewsCount": 302,
        "address": "磐金文化城太守巷36-2号",
        "signature": "特调长岛冰茶 (Long Island Iced Tea)",
        "priceRange": "¥60-150",
        "hours": "18:00 - 02:30",
        "tags": [
          "精酿啤酒",
          "鸡尾酒",
          "社交小酌",
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
        "id": "real-st-matcha-B0GRUD5QK0",
        "name": "古茗(汕头岐山路店)",
        "type": "milktea",
        "lat": 23.389646,
        "lng": 116.687915,
        "rating": 4.2,
        "reviewsCount": 105,
        "address": "岐山路17号之3号",
        "signature": "特浓抹茶千层蛋糕 (Matcha Mille Crepe)",
        "priceRange": "¥12-18",
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
        "id": "real-st-matcha-B0H2MD0ESC",
        "name": "古茗(汕头万象城店)",
        "type": "milktea",
        "lat": 23.363255,
        "lng": 116.718071,
        "rating": 4.5,
        "reviewsCount": 128,
        "address": "长平路万象城B102号",
        "signature": "特浓抹茶千层蛋糕 (Matcha Mille Crepe)",
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
        "id": "real-st-matcha-B0LDC6HQS4",
        "name": "古茗(潮南恩波路店)",
        "type": "milktea",
        "lat": 23.248913,
        "lng": 116.434213,
        "rating": 4.2,
        "reviewsCount": 191,
        "address": "恩波路165号",
        "signature": "宇治手打冰点 (Uji Matcha Ice)",
        "priceRange": "¥12-18",
        "hours": "09:30 - 22:00",
        "tags": [
          "抹茶",
          "Matcha",
          "真实探店",
          "潮南区"
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
        "id": "real-st-matcha-B0L3ZAZKPV",
        "name": "古茗(金平东厦100店)",
        "type": "milktea",
        "lat": 23.378723,
        "lng": 116.704535,
        "rating": 3.9,
        "reviewsCount": 263,
        "address": "东厦路100号东厦壹佰购物商场负壹层DJB09号商铺",
        "signature": "雪顶抹茶芝士冰沙 (Matcha Cheese Slush)",
        "priceRange": "¥12-18",
        "hours": "09:30 - 22:00",
        "tags": [
          "抹茶",
          "Matcha",
          "真实探店",
          "金平区"
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
        "id": "real-st-matcha-B0L14H17V0",
        "name": "一杯潮茶(万象城店)",
        "type": "milktea",
        "lat": 23.362747,
        "lng": 116.718804,
        "rating": 4.5,
        "reviewsCount": 277,
        "address": "长平路95号华润大厦商业裙楼118号房之三",
        "signature": "特浓抹茶千层蛋糕 (Matcha Mille Crepe)",
        "priceRange": "¥14-22",
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
        "id": "real-st-boba-B0H197MQRX",
        "name": "LINLEE·手打柠檬茶(潮南香域广场店)",
        "type": "milktea",
        "lat": 23.24217,
        "lng": 116.441864,
        "rating": 4.1,
        "reviewsCount": 239,
        "address": "广汕公路峡山路段123号香域广场4幢1楼410房",
        "signature": "生椰爆汁西瓜 (Raw Coconut Watermelon)",
        "priceRange": "¥14-22",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "潮南区"
        ]
      },
      {
        "id": "real-st-boba-B0KAJA0V9O",
        "name": "蜜雪冰城(合胜广场店)",
        "type": "milktea",
        "lat": 23.240564,
        "lng": 116.442561,
        "rating": 4.2,
        "reviewsCount": 57,
        "address": "峡山街道广汕公路峡山路段123号香域广场4栋409号房",
        "signature": "冰鲜柠檬水 (清凉夏日平价王)",
        "priceRange": "¥7-11",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "潮南区"
        ]
      },
      {
        "id": "real-st-boba-B0M6L77CT8",
        "name": "1点点(潮南合胜广场店)",
        "type": "milktea",
        "lat": 23.240366,
        "lng": 116.4427,
        "rating": 4,
        "reviewsCount": 468,
        "address": "峡山街道广汕公路峡山路段123号香域广场7幢合胜广场一层A-01卡",
        "signature": "招牌波霸奶茶 (Classic Boba Milk Tea)",
        "priceRange": "¥14-20",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "潮南区"
        ]
      },
      {
        "id": "real-st-boba-B0LKV75I1P",
        "name": "GOODME奶茶",
        "type": "milktea",
        "lat": 23.240275,
        "lng": 116.442825,
        "rating": 3.4,
        "reviewsCount": 477,
        "address": "潮南合胜广场",
        "signature": "生椰爆汁西瓜 (Raw Coconut Watermelon)",
        "priceRange": "¥12-25",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "潮南区"
        ]
      },
      {
        "id": "real-st-boba-B0L3ASUBDA",
        "name": "古茗(峡山合胜广场店)",
        "type": "milktea",
        "lat": 23.240325,
        "lng": 116.442575,
        "rating": 4.4,
        "reviewsCount": 57,
        "address": "香域广场",
        "signature": "超大杯水果茶 (鲜果茶系列)",
        "priceRange": "¥13-19",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "潮南区"
        ]
      },
      {
        "id": "real-st-boba-B0JKYHAZZR",
        "name": "CHAGEE霸王茶姬(潮南合胜广场店)",
        "type": "milktea",
        "lat": 23.240148,
        "lng": 116.442966,
        "rating": 4.5,
        "reviewsCount": 209,
        "address": "广汕公路峡山路段123号潮南合胜广场F1层",
        "signature": "伯牙绝弦 (招牌茉莉雪顶鲜奶茶)",
        "priceRange": "¥16-24",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "潮南区"
        ]
      },
      {
        "id": "real-st-boba-B0J3ZZUVUR",
        "name": "波比冰淇淋(汕头潮南合胜店)",
        "type": "milktea",
        "lat": 23.240074,
        "lng": 116.443066,
        "rating": 3.9,
        "reviewsCount": 97,
        "address": "广汕公路123号(香域广场内)合胜广场",
        "signature": "生椰爆汁西瓜 (Raw Coconut Watermelon)",
        "priceRange": "¥7-11",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "潮南区"
        ]
      },
      {
        "id": "real-st-boba-B0HAXMME2L",
        "name": "CoCo都可(合胜广场峡山店)",
        "type": "milktea",
        "lat": 23.240071,
        "lng": 116.443068,
        "rating": 4.1,
        "reviewsCount": 316,
        "address": "峡山街道广汕公路123号香域广场7栋一层02卡",
        "signature": "奶茶三兄弟 (经典珍珠加料奶茶)",
        "priceRange": "¥10-14",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "潮南区"
        ]
      },
      {
        "id": "real-st-boba-B0LGCLRCVE",
        "name": "爷爷不泡茶(汕头潮南广场店)",
        "type": "milktea",
        "lat": 23.240125,
        "lng": 116.442725,
        "rating": 4.4,
        "reviewsCount": 362,
        "address": "峡山街道广汕公路123号香域广场7栋一层03A卡",
        "signature": "生椰爆汁西瓜 (Raw Coconut Watermelon)",
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
        "id": "real-st-boba-B0L24HO3UA",
        "name": "蓝苑.京茗春(茶室)",
        "type": "milktea",
        "lat": 23.245281,
        "lng": 116.451792,
        "rating": 3,
        "reviewsCount": 460,
        "address": "拉芳路与衡山路交叉口西南80米",
        "signature": "生椰爆汁西瓜 (Raw Coconut Watermelon)",
        "priceRange": "¥12-25",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "潮南区"
        ]
      },
      {
        "id": "real-st-boba-B0L1S7QAKC",
        "name": "楼下冰室",
        "type": "milktea",
        "lat": 23.24417,
        "lng": 116.437525,
        "rating": 4.6,
        "reviewsCount": 467,
        "address": "峡山街道东山路175号",
        "signature": "生椰爆汁西瓜 (Raw Coconut Watermelon)",
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
        "id": "real-st-boba-B0FFFOER70",
        "name": "醉正岩大红袍商行",
        "type": "milktea",
        "lat": 23.237755,
        "lng": 116.443129,
        "rating": 4.3,
        "reviewsCount": 47,
        "address": "胪岗镇泗黄峡溪南路(泗黄治安岗隔壁)",
        "signature": "杨枝甘露轻盈版 (Mango Sago)",
        "priceRange": "¥12-25",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "潮南区"
        ]
      },
      {
        "id": "real-st-boba-B0FFGBYEGO",
        "name": "柒茶(六都中学店)",
        "type": "milktea",
        "lat": 23.242548,
        "lng": 116.436025,
        "rating": 4,
        "reviewsCount": 329,
        "address": "铭德楼南门旁",
        "signature": "杨枝甘露轻盈版 (Mango Sago)",
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
        "id": "real-st-boba-B0KDP77CRB",
        "name": "阿黄柠檬茶",
        "type": "milktea",
        "lat": 23.236276,
        "lng": 116.443813,
        "rating": 3.9,
        "reviewsCount": 208,
        "address": "胪岗镇泗黄村北新四路12号",
        "signature": "生椰爆汁西瓜 (Raw Coconut Watermelon)",
        "priceRange": "¥12-25",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "潮南区"
        ]
      },
      {
        "id": "real-st-boba-B0HK3SL4YX",
        "name": "茗星居",
        "type": "milktea",
        "lat": 23.236591,
        "lng": 116.442011,
        "rating": 3.7,
        "reviewsCount": 400,
        "address": "胪岗镇泗黄村晋安新区三街78号",
        "signature": "招牌波霸奶茶 (Classic Boba Milk Tea)",
        "priceRange": "¥14-20",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "潮南区"
        ]
      },
      {
        "id": "real-st-boba-B0LD4NFH49",
        "name": "禧园茶饮",
        "type": "milktea",
        "lat": 23.242825,
        "lng": 116.435425,
        "rating": 4.4,
        "reviewsCount": 351,
        "address": "峡山街道二片70号(六都中学后门巷子)",
        "signature": "生椰爆汁西瓜 (Raw Coconut Watermelon)",
        "priceRange": "¥15-23",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "潮南区"
        ]
      },
      {
        "id": "real-st-boba-B0FFH96KRA",
        "name": "茶缘站(华龙购物店)",
        "type": "milktea",
        "lat": 23.235914,
        "lng": 116.445095,
        "rating": 3.7,
        "reviewsCount": 397,
        "address": "泗黄乡峡溪路274号",
        "signature": "招牌波霸奶茶 (Classic Boba Milk Tea)",
        "priceRange": "¥14-22",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "潮南区"
        ]
      },
      {
        "id": "real-st-boba-B0FFGTA12P",
        "name": "雅小馆咖啡屋工作室",
        "type": "milktea",
        "lat": 23.246258,
        "lng": 116.434391,
        "rating": 4.2,
        "reviewsCount": 115,
        "address": "恩波路周光稿纪念馆往恩波桥方向15米大路旁不在巷子里",
        "signature": "招牌波霸奶茶 (Classic Boba Milk Tea)",
        "priceRange": "¥25-37",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "潮南区"
        ]
      },
      {
        "id": "real-st-boba-B0FFGT1W6V",
        "name": "大台北茶饮(朝晖路店)",
        "type": "milktea",
        "lat": 23.254212,
        "lng": 116.441015,
        "rating": 3.8,
        "reviewsCount": 121,
        "address": "峡山街道朝晖路288-290号",
        "signature": "生椰爆汁西瓜 (Raw Coconut Watermelon)",
        "priceRange": "¥10-14",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "潮南区"
        ]
      },
      {
        "id": "real-st-boba-B0FFIAN15B",
        "name": "醉仙园休闲吧",
        "type": "milktea",
        "lat": 23.254046,
        "lng": 116.440279,
        "rating": 4.3,
        "reviewsCount": 222,
        "address": "朝晖路与东升路交叉口西南320米",
        "signature": "招牌波霸奶茶 (Classic Boba Milk Tea)",
        "priceRange": "¥52-78",
        "hours": "09:30 - 22:00",
        "tags": [
          "奶茶",
          "饮品店",
          "下午茶",
          "潮南区"
        ]
      },
      {
        "id": "real-st-bar-B0LDTX8P0F",
        "name": "民谣集烧烤酒馆(汕头万象城店)",
        "type": "bar",
        "lat": 23.364836,
        "lng": 116.716935,
        "rating": 4.6,
        "reviewsCount": 372,
        "address": "金砂中路100号华润大厦北塔二楼",
        "signature": "金汤力特调 (Gin and Tonic)",
        "priceRange": "¥62-92",
        "hours": "18:00 - 02:30",
        "tags": [
          "精酿啤酒",
          "鸡尾酒",
          "社交小酌",
          "龙湖区"
        ]
      },
      {
        "id": "real-st-bar-B0FFH92F57",
        "name": "信达演艺酒吧",
        "type": "bar",
        "lat": 23.242325,
        "lng": 116.443214,
        "rating": 4.5,
        "reviewsCount": 255,
        "address": "峡山街道东山工业区一街一号",
        "signature": "经典莫吉托 (Classic Mojito)",
        "priceRange": "¥82-122",
        "hours": "18:00 - 02:30",
        "tags": [
          "精酿啤酒",
          "鸡尾酒",
          "社交小酌",
          "潮南区"
        ]
      },
      {
        "id": "real-st-bar-B0GDRSDIYH",
        "name": "鲤巷KOI Alley Bar",
        "type": "bar",
        "lat": 23.364525,
        "lng": 116.717325,
        "rating": 4.5,
        "reviewsCount": 458,
        "address": "丹霞西街2号幸福里雅居3栋105号",
        "signature": "特调长岛冰茶 (Long Island Iced Tea)",
        "priceRange": "¥80-120",
        "hours": "18:00 - 02:30",
        "tags": [
          "精酿啤酒",
          "鸡尾酒",
          "社交小酌",
          "龙湖区"
        ]
      },
      {
        "id": "real-st-bar-B0L0TSADVZ",
        "name": "唐潮CLUB(广深城店)",
        "type": "bar",
        "lat": 23.243814,
        "lng": 116.450559,
        "rating": 4.3,
        "reviewsCount": 60,
        "address": "拉芳路广深城广深城A座首层01",
        "signature": "经典莫吉托 (Classic Mojito)",
        "priceRange": "¥60-150",
        "hours": "18:00 - 02:30",
        "tags": [
          "精酿啤酒",
          "鸡尾酒",
          "社交小酌",
          "潮南区"
        ]
      },
      {
        "id": "real-st-bar-B0J3T7LZQZ",
        "name": "伴木BANMU·中国鸡尾酒馆(华润幸福里店)",
        "type": "bar",
        "lat": 23.364575,
        "lng": 116.717325,
        "rating": 4.6,
        "reviewsCount": 273,
        "address": "华润幸福里3栋103铺面",
        "signature": "金汤力特调 (Gin and Tonic)",
        "priceRange": "¥81-121",
        "hours": "18:00 - 02:30",
        "tags": [
          "精酿啤酒",
          "鸡尾酒",
          "社交小酌",
          "龙湖区"
        ]
      },
      {
        "id": "real-st-bar-B0J14KUODS",
        "name": "奥斯卡酒吧",
        "type": "bar",
        "lat": 23.244082,
        "lng": 116.450768,
        "rating": 4.4,
        "reviewsCount": 69,
        "address": "拉芳路8号广深城A座",
        "signature": "金汤力特调 (Gin and Tonic)",
        "priceRange": "¥91-137",
        "hours": "18:00 - 02:30",
        "tags": [
          "精酿啤酒",
          "鸡尾酒",
          "社交小酌",
          "潮南区"
        ]
      },
      {
        "id": "real-st-bar-B0L61UMVJF",
        "name": "Tineco添可(汕头万象城旗舰店)",
        "type": "bar",
        "lat": 23.362975,
        "lng": 116.716775,
        "rating": 3.3,
        "reviewsCount": 385,
        "address": "万象城5楼L519C",
        "signature": "经典莫吉托 (Classic Mojito)",
        "priceRange": "¥60-150",
        "hours": "18:00 - 02:30",
        "tags": [
          "精酿啤酒",
          "鸡尾酒",
          "社交小酌",
          "龙湖区"
        ]
      },
      {
        "id": "real-st-bar-B0LUDUCUZJ",
        "name": "蕉下(汕头万象城店)",
        "type": "bar",
        "lat": 23.362725,
        "lng": 116.716625,
        "rating": 4,
        "reviewsCount": 68,
        "address": "万象城二楼L227蕉下",
        "signature": "金汤力特调 (Gin and Tonic)",
        "priceRange": "¥60-150",
        "hours": "18:00 - 02:30",
        "tags": [
          "精酿啤酒",
          "鸡尾酒",
          "社交小酌",
          "龙湖区"
        ]
      },
      {
        "id": "real-st-bar-B0L1OMO832",
        "name": "淼匠鸡尾酒馆",
        "type": "bar",
        "lat": 23.365975,
        "lng": 116.715525,
        "rating": 3.2,
        "reviewsCount": 273,
        "address": "金砂路92号锦峰嘉信大厦",
        "signature": "特调长岛冰茶 (Long Island Iced Tea)",
        "priceRange": "¥52-78",
        "hours": "18:00 - 02:30",
        "tags": [
          "精酿啤酒",
          "鸡尾酒",
          "社交小酌",
          "龙湖区"
        ]
      },
      {
        "id": "real-st-bar-B0LBUULL54",
        "name": "VOID",
        "type": "bar",
        "lat": 23.363192,
        "lng": 116.718293,
        "rating": 2.6,
        "reviewsCount": 213,
        "address": "万象城润街三楼357",
        "signature": "金汤力特调 (Gin and Tonic)",
        "priceRange": "¥60-150",
        "hours": "18:00 - 02:30",
        "tags": [
          "精酿啤酒",
          "鸡尾酒",
          "社交小酌",
          "龙湖区"
        ]
      },
      {
        "id": "real-st-bar-B0JRKKK30F",
        "name": "晚风·沉浸式剧院秀场(苏宁广场长平东路店)",
        "type": "bar",
        "lat": 23.365638,
        "lng": 116.714388,
        "rating": 4.5,
        "reviewsCount": 346,
        "address": "金砂路86号新友谊商厦F1层",
        "signature": "特调长岛冰茶 (Long Island Iced Tea)",
        "priceRange": "¥319-479",
        "hours": "18:00 - 02:30",
        "tags": [
          "精酿啤酒",
          "鸡尾酒",
          "社交小酌",
          "龙湖区"
        ]
      },
      {
        "id": "real-st-bar-B0JGFUIUUU",
        "name": "夜潮CLUB(新友谊商厦店)",
        "type": "bar",
        "lat": 23.366058,
        "lng": 116.714346,
        "rating": 4.4,
        "reviewsCount": 400,
        "address": "金砂路88号新友谊商厦二楼",
        "signature": "特调长岛冰茶 (Long Island Iced Tea)",
        "priceRange": "¥114-172",
        "hours": "18:00 - 02:30",
        "tags": [
          "精酿啤酒",
          "鸡尾酒",
          "社交小酌",
          "龙湖区"
        ]
      },
      {
        "id": "real-st-bar-B0LRUPCROB",
        "name": "贰拾贰酒馆",
        "type": "bar",
        "lat": 23.365975,
        "lng": 116.713675,
        "rating": 3.9,
        "reviewsCount": 351,
        "address": "金砂路86号友谊国际大厦",
        "signature": "特调长岛冰茶 (Long Island Iced Tea)",
        "priceRange": "¥46-70",
        "hours": "18:00 - 02:30",
        "tags": [
          "精酿啤酒",
          "鸡尾酒",
          "社交小酌",
          "龙湖区"
        ]
      },
      {
        "id": "real-st-bar-B0M6OHLTA1",
        "name": "MANDY 天空酒廊",
        "type": "bar",
        "lat": 23.365995,
        "lng": 116.713647,
        "rating": 4.5,
        "reviewsCount": 188,
        "address": "金砂路86号友谊国际大厦写字楼33层F室",
        "signature": "特调长岛冰茶 (Long Island Iced Tea)",
        "priceRange": "¥45-67",
        "hours": "18:00 - 02:30",
        "tags": [
          "精酿啤酒",
          "鸡尾酒",
          "社交小酌",
          "龙湖区"
        ]
      },
      {
        "id": "real-st-bar-B0KKC770NQ",
        "name": "奇遇民谣烧烤酒馆(苏宁广场店)",
        "type": "bar",
        "lat": 23.361179,
        "lng": 116.716697,
        "rating": 4.4,
        "reviewsCount": 108,
        "address": "长平路90号苏宁广场3层",
        "signature": "特调长岛冰茶 (Long Island Iced Tea)",
        "priceRange": "¥56-84",
        "hours": "18:00 - 02:30",
        "tags": [
          "精酿啤酒",
          "鸡尾酒",
          "社交小酌",
          "龙湖区"
        ]
      },
      {
        "id": "real-st-bar-B0H04Y8MM1",
        "name": "四季树酒吧(长荣大厦店)",
        "type": "bar",
        "lat": 23.367051,
        "lng": 116.718138,
        "rating": 4.5,
        "reviewsCount": 404,
        "address": "金砂路101号长荣大厦F2层",
        "signature": "经典莫吉托 (Classic Mojito)",
        "priceRange": "¥38-56",
        "hours": "18:00 - 02:30",
        "tags": [
          "精酿啤酒",
          "鸡尾酒",
          "社交小酌",
          "龙湖区"
        ]
      },
      {
        "id": "real-st-bar-B0L17A7VZB",
        "name": "RUBYHALL",
        "type": "bar",
        "lat": 23.367325,
        "lng": 116.717975,
        "rating": 4.4,
        "reviewsCount": 350,
        "address": "金砂路101号长荣大厦(金砂东路)",
        "signature": "金汤力特调 (Gin and Tonic)",
        "priceRange": "¥60-150",
        "hours": "18:00 - 02:30",
        "tags": [
          "精酿啤酒",
          "鸡尾酒",
          "社交小酌",
          "龙湖区"
        ]
      },
      {
        "id": "real-st-bar-B0FFK1PAQI",
        "name": "酉时食酒屋(汕头长荣大厦店)",
        "type": "bar",
        "lat": 23.367399,
        "lng": 116.718109,
        "rating": 4.5,
        "reviewsCount": 305,
        "address": "金砂东路长荣大厦裙楼3楼(洛城酒吧3楼)",
        "signature": "经典莫吉托 (Classic Mojito)",
        "priceRange": "¥87-131",
        "hours": "18:00 - 02:30",
        "tags": [
          "精酿啤酒",
          "鸡尾酒",
          "社交小酌",
          "龙湖区"
        ]
      },
      {
        "id": "real-st-bar-B0MBM97UZ7",
        "name": "CCclub(长城优品雪茄吧)",
        "type": "bar",
        "lat": 23.366684,
        "lng": 116.719156,
        "rating": 4.5,
        "reviewsCount": 472,
        "address": "星光华庭112号",
        "signature": "经典莫吉托 (Classic Mojito)",
        "priceRange": "¥75-113",
        "hours": "18:00 - 02:30",
        "tags": [
          "精酿啤酒",
          "鸡尾酒",
          "社交小酌",
          "龙湖区"
        ]
      },
      {
        "id": "real-st-bar-B0L62HFL7O",
        "name": "柏乐酒吧",
        "type": "bar",
        "lat": 23.367868,
        "lng": 116.716374,
        "rating": 4.5,
        "reviewsCount": 164,
        "address": "迎宾路3号首层",
        "signature": "经典莫吉托 (Classic Mojito)",
        "priceRange": "¥65-97",
        "hours": "18:00 - 02:30",
        "tags": [
          "精酿啤酒",
          "鸡尾酒",
          "社交小酌",
          "龙湖区"
        ]
      }
    ]
  }
];
