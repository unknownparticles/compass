import { Shop, CompassMode, Coordinate } from '../types';
import { generateLocalShops, getDistance } from '../data/mockShops';
import { PREDEFINED_REAL_SHOPS } from '../data/realShopsData';

// 常用品牌真实招牌菜品与标签映射库
const TEA_BRANDS_DATABASE: { [key: string]: { signature: string; tags: string[] } } = {
  '霸王茶姬': { signature: '伯牙绝弦 (招牌茉莉雪顶鲜奶茶)', tags: ['鲜奶茶', '国风茶饮', '招牌茉莉'] },
  '茶颜悦色': { signature: '幽兰拿铁 (Black Tea Latte)', tags: ['红茶拿铁', '中式茶饮', '忌廉奶油'] },
  '喜茶': { signature: '多肉葡萄 (Cheese Grape)', tags: ['芝士果茶', '招牌果茶', '经典葡萄'] },
  '奈雪': { signature: '霸气芝士草莓 (Strawberry Cheese)', tags: ['芝士果茶', '鲜果茶', '烘焙面包'] },
  '一点点': { signature: '四季春玛奇朵 (Light Oolong Macchiato)', tags: ['经典奶茶', '手摇茶', '奶盖'] },
  'coco': { signature: '奶茶三兄弟 (Three Brothers Boba)', tags: ['经典奶茶', '布丁仙草', '加料'] },
  '蜜雪冰城': { signature: '冰鲜柠檬水 (Fresh Lemonade)', tags: ['平价茶饮', '柠檬水', '冰淇淋'] },
  '星巴克': { signature: '燕麦焦糖玛奇朵 (Caramel Macchiato)', tags: ['精品咖啡', '星冰乐', '燕麦奶'] },
  '瑞幸': { signature: '生椰拿铁 (Raw Coconut Latte)', tags: ['生椰咖啡', '平价精品', '拿铁'] },
  '库迪': { signature: '潘帕斯生椰拿铁 (Pampas Coconut Latte)', tags: ['平价咖啡', '生椰', '拿铁'] },
  'Manner': { signature: '桂花燕麦拿铁 (Osmanthus Oat Latte)', tags: ['精品咖啡', '手冲', '拿铁'] },
  '茶百道': { signature: '招牌杨枝甘露 (Mango Sago)', tags: ['鲜果茶', '杨枝甘露', '手作饮品'] },
  '古茗': { signature: '超大杯水果茶 (Jumbo Fruit Tea)', tags: ['鲜果茶', '平价精品', '多肉系列'] },
  '书亦烧仙草': { signature: '书亦烧仙草 (Shuyi Grass Jelly)', tags: ['烧仙草', '传统甜品', '多料'] },
  '阿水大杯茶': { signature: '黑糖波霸奶茶 (Brown Sugar Boba)', tags: ['经典奶茶', '手作茶饮', '高性价比'] }
};

// 常见精品咖啡馆品牌招牌与标签映射库
const COFFEE_BRANDS_DATABASE: { [key: string]: { signature: string; tags: string[] } } = {
  '星巴克': { signature: '燕麦拿铁 (Oat Milk Latte)', tags: ['精品咖啡', '拿铁', '燕麦奶'] },
  'starbucks': { signature: '燕麦拿铁 (Oat Milk Latte)', tags: ['精品咖啡', '拿铁', '燕麦奶'] },
  '瑞幸': { signature: '生椰拿铁 (Raw Coconut Latte)', tags: ['生椰咖啡', '平价精品', '拿铁'] },
  'luckin': { signature: '生椰拿铁 (Raw Coconut Latte)', tags: ['生椰咖啡', '平价精品', '拿铁'] },
  'Manner': { signature: '桂花燕麦拿铁 (Osmanthus Oat Latte)', tags: ['精品手冲', '小批量烘焙', '拿铁'] },
  'manner': { signature: '桂花燕麦拿铁 (Osmanthus Oat Latte)', tags: ['精品手冲', '小批量烘焙', '拿铁'] },
  '库迪': { signature: '潘帕斯生椰拿铁 (Pampas Coconut Latte)', tags: ['平价咖啡', '生椰', '拿铁'] },
  '库迪咖啡': { signature: '潘帕斯生椰拿铁 (Pampas Coconut Latte)', tags: ['平价咖啡', '生椰', '拿铁'] },
  'cudi': { signature: '潘帕斯生椰拿铁 (Pampas Coconut Latte)', tags: ['平价咖啡', '生椰', '拿铁'] },
  'Arabica': { signature: '招牌黑咖啡 (Signature Black Coffee)', tags: ['精品咖啡', '单品豆', '日系'] },
  'arabica': { signature: '招牌黑咖啡 (Signature Black Coffee)', tags: ['精品咖啡', '单品豆', '日系'] },
  'Tim Hortons': { signature: '双倍浓缩冰美式 (Double Espresso Iced Americano)', tags: ['加拿大咖啡', '平价快饮'] },
  'tim hortons': { signature: '双倍浓缩冰美式 (Double Espresso Iced Americano)', tags: ['加拿大咖啡', '平价快饮'] },
  'M Stand': { signature: '香草糖浆手冲 (Vanilla Syrup Pour Over)', tags: ['精品咖啡', '工业风', '手冲'] },
  'm stand': { signature: '香草糖浆手冲 (Vanilla Syrup Pour Over)', tags: ['精品咖啡', '工业风', '手冲'] },
  'Seesaw': { signature: 'Dirty 浓缩牛奶 (Seesaw Dirty)', tags: ['精品咖啡', 'Dirty', '单品豆'] },
  'seesaw': { signature: 'Dirty 浓缩牛奶 (Seesaw Dirty)', tags: ['精品咖啡', 'Dirty', '单品豆'] },
  'Costa': { signature: '摩卡冰咖啡 (Iced Mocha)', tags: ['英式咖啡', '摩卡', '拿铁'] },
  'costa': { signature: '摩卡冰咖啡 (Iced Mocha)', tags: ['英式咖啡', '摩卡', '拿铁'] },
  '皮爷': { signature: '极深烘手冲 (Dark Roast Pour Over)', tags: ['深烘咖啡', '美式风格', '手冲'] },
  'Peet': { signature: '极深烘手冲 (Dark Roast Pour Over)', tags: ['深烘咖啡', '美式风格', '手冲'] },
  'peet': { signature: '极深烘手冲 (Dark Roast Pour Over)', tags: ['深烘咖啡', '美式风格', '手冲'] },
};

// 默认咖啡馆备用招牌菜品
const DEFAULT_COFFEE_SIGNATURES = [
  '招牌手冲单品咖啡 (Signature Pour Over)',
  '拿铁咖啡 (Latte)',
  '冰美式 (Iced Americano)'
];

// 常见酒吧招牌特调与标签映射库
const BAR_BRANDS_DATABASE: { [key: string]: { signature: string; tags: string[] } } = {
  'COMMUNE': { signature: '幻影极光双倍IPA精酿 (Aurora IPA)', tags: ['幻音精酿', '美式西餐', '自选啤酒'] },
  '海伦司': { signature: '海伦司可乐桶 (Helens Cola Bucket)', tags: ['平价小酒馆', '可乐桶', '聚会小酌'] },
  '跳海': { signature: '跳海原产小麦精酿 (Tiaohai Craft Wheat)', tags: ['精酿啤酒', '社交互动', '小众精酿'] },
  '胡桃里': { signature: '桃花源特调鸡尾酒 (Peach Cocktail)', tags: ['音乐酒馆', '川菜美食', '民谣现场'] }
};

// 默认奶茶店/咖啡馆备用招牌菜品
const DEFAULT_TEA_SIGNATURES = [
  '招牌波霸奶茶 (Classic Boba Milk Tea)',
  '杨枝甘露轻盈版 (Mango Sago)',
  '生椰爆汁西瓜 (Raw Coconut Watermelon)'
];

// 默认酒吧备用招牌鸡尾酒
const DEFAULT_BAR_SIGNATURES = [
  '经典莫吉托 (Classic Mojito)',
  '特调长岛冰茶 (Long Island Iced Tea)',
  '金汤力特调 (Gin and Tonic)'
];

// 真实主打抹茶的连锁大牌及官方推荐菜
const REAL_MATCHA_BRANDS_DATABASE: { [key: string]: { signature: string; tags: string[] } } = {
  '星巴克': { signature: '抹茶可可碎片星冰乐 (Matcha Cream Frappuccino)', tags: ['经典星冰乐', '精选抹茶'] },
  'starbucks': { signature: '抹茶可可碎片星冰乐 (Matcha Cream Frappuccino)', tags: ['经典星冰乐', '精选抹茶'] },
  '瑞幸': { signature: '宇治抹茶拿铁 (Uji Matcha Latte)', tags: ['抹茶拿铁', '大师咖啡'] },
  'luckin': { signature: '宇治抹茶拿铁 (Uji Matcha Latte)', tags: ['抹茶拿铁', '大师咖啡'] },
  '喜茶': { signature: '极浓抹茶椰 (Matcha Coconut)', tags: ['鲜果茶', '抹茶乳饮'] },
  'heytea': { signature: '极浓抹茶椰 (Matcha Coconut)', tags: ['鲜果茶', '抹茶乳饮'] },
  '奈雪': { signature: '宇治抹茶奶盖茶 (Uji Matcha Cheese Tea)', tags: ['芝士茶', '抹茶烘焙'] },
  'nayuki': { signature: '宇治抹茶奶盖茶 (Uji Matcha Cheese Tea)', tags: ['芝士茶', '抹茶烘焙'] },
  '一点点': { signature: '抹茶红豆拿铁 (Matcha Red Bean Latte)', tags: ['手摇奶茶', '经典抹茶'] },
  '1点点': { signature: '抹茶红豆拿铁 (Matcha Red Bean Latte)', tags: ['手摇奶茶', '经典抹茶'] },
  'coco': { signature: '抹茶红豆欧蕾 (Matcha Red Bean Au Lait)', tags: ['红豆奶茶', '经典欧蕾'] },
  'manner': { signature: '抹茶燕麦拿铁 (Matcha Oat Latte)', tags: ['精品咖啡', '抹茶拿铁'] },
  '辻利': { signature: '辻利特浓抹茶刨冰 (Tsujiri Matcha Shaved Ice)', tags: ['日本宇治', '抹茶专门店'] },
  'tsujiri': { signature: '辻利特浓抹茶刨冰 (Tsujiri Matcha Shaved Ice)', tags: ['日本宇治', '抹茶专门店'] }
};

// 抹茶专门店默认抹茶推荐菜（仅用于名字直接含“抹茶/matcha”但非上述大牌的店）
const DEFAULT_MATCHA_SPECIALTY_SIGNATURES = [
  '手打宇治浓口抹茶 (Hand-Whisked Matcha)',
  '宇治浓厚抹茶冰淇淋 (Matcha Ice Cream)',
  '经典抹茶千层蛋糕 (Matcha Mille Crepe)'
];

// OSM 模式下的 POI 饮品及酒吧白名单过滤词
const OSM_MILKTEA_KEYWORDS = [
  '茶', '奶茶', '咖', '咖啡', '冰室', '甜品', '椰', '冰沙', 'KFC', '麦当劳', '德克士',
  '蜜雪', '喜茶', '霸王', '瑞幸', '星巴克', 'Manner', 'Tsujiri', '辻利', '奈雪',
  '一点点', 'Coco', '古茗', '茶百道', '书亦', '阿水', '丸摩堂', '库迪', 'Luckin',
  'Starbucks', 'Tea', 'Boba', 'Coffee', 'Cafe', 'Dessert', 'Ice Cream', 'Juice', 'Fruit',
  '抹茶', 'matcha'
];

const OSM_BAR_KEYWORDS = [
  '酒吧', '酒馆', '精酿', '啤', 'Pub', 'Bar', 'Taproom', 'Beer', 'Bistro', 'Whisky', 'Cocktail', '酿'
];

/**
 * 智能的抹茶风味渗透与商铺属性生成器
 */
function processAndDecorateShop(
  id: string,
  name: string,
  type: CompassMode,
  lat: number,
  lng: number,
  address: string,
  rating: number,
  priceNum: number | null,
  hasMatchaInject: boolean,
  mode: CompassMode
): Shop {
  const nameLower = name.toLowerCase();
  
  let signature = '-'; // 默认无推荐招牌，写 '-' 占位，绝不自己编造数据！
  let tags: string[] = [];

  // 根据品牌匹配招牌菜与标签
  if (type === 'milktea') {
    let brandMatched = false;
    for (const key in TEA_BRANDS_DATABASE) {
      if (name.includes(key)) {
        signature = TEA_BRANDS_DATABASE[key].signature;
        tags = [...TEA_BRANDS_DATABASE[key].tags];
        brandMatched = true;
        break;
      }
    }
    if (!brandMatched) {
      tags = ['茶饮', '下午茶'];
    }
  } else if (type === 'coffee') {
    let brandMatched = false;
    for (const key in COFFEE_BRANDS_DATABASE) {
      if (name.toLowerCase().includes(key.toLowerCase())) {
        signature = COFFEE_BRANDS_DATABASE[key].signature;
        tags = [...COFFEE_BRANDS_DATABASE[key].tags];
        brandMatched = true;
        break;
      }
    }
    if (!brandMatched) {
      tags = ['咖啡馆', '精品咖啡'];
    }
  } else if (type === 'matcha') {
    let brandMatched = false;
    for (const key in REAL_MATCHA_BRANDS_DATABASE) {
      if (nameLower.includes(key)) {
        signature = REAL_MATCHA_BRANDS_DATABASE[key].signature;
        tags = [...REAL_MATCHA_BRANDS_DATABASE[key].tags];
        brandMatched = true;
        break;
      }
    }
    if (!brandMatched) {
      tags = ['抹茶专门店', '抹茶', 'Matcha', '日式甜点'];
    }
  } else {
    let brandMatched = false;
    for (const key in BAR_BRANDS_DATABASE) {
      if (name.includes(key)) {
        signature = BAR_BRANDS_DATABASE[key].signature;
        tags = [...BAR_BRANDS_DATABASE[key].tags];
        brandMatched = true;
        break;
      }
    }
    if (!brandMatched) {
      tags = ['酒吧', '小酌'];
    }
  }

  const hours = type === 'bar' ? '18:00 - 02:00' : type === 'coffee' ? '08:00 - 21:00' : type === 'matcha' ? '10:00 - 22:00' : '09:30 - 22:00';

  let priceRange = '';
  if (priceNum && priceNum > 0) {
    priceRange = `¥${Math.round(priceNum * 0.8)}-${Math.round(priceNum * 1.2)}`;
  } else {
    priceRange = type === 'milktea' ? '¥15-30' : type === 'coffee' ? '¥25-50' : type === 'matcha' ? '¥20-40' : '¥60-150';
  }

  const reviewsCount = Math.floor(30 + (Math.abs(hashString(id + '_reviews')) % 420));

  return {
    id,
    name,
    type,
    lat,
    lng,
    distance: 0,
    bearing: 0,
    relativeAngle: 0,
    rating: parseFloat(rating.toFixed(1)),
    reviewsCount,
    address,
    signature,
    priceRange,
    hours,
    tags: Array.from(new Set(tags))
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

/**
 * 从 OpenStreetMap (OSM) Overpass API 异步拉取商铺数据并进行精细清洗
 */
async function fetchFromOSM(lat: number, lng: number, mode: CompassMode, radius = 3000): Promise<Shop[]> {
  const isMatchaMode = mode === 'matcha';
  
  // 抹茶模式下：仅拉取名字带“抹茶/Matcha”的专门店
  const nameSelector = isMatchaMode 
    ? '[name~"抹茶|Matcha|matcha",i]' 
    : '';

  const overpassQuery = `
    [out:json][timeout:15];
    (
      node(around:${radius},${lat},${lng})[amenity~"cafe|bar|pub|fast_food|restaurant"]${nameSelector};
      way(around:${radius},${lat},${lng})[amenity~"cafe|bar|pub|fast_food|restaurant"]${nameSelector};
    );
    out center;
  `;

  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`OSM Overpass API 响应失败，状态码: ${response.status}`);
  }

  const data = await response.json();
  const elements = data.elements || [];

  const shops: Shop[] = [];
  
  elements.forEach((el: any) => {
    const tags = el.tags || {};
    const name = tags.name || tags.name_zh || tags.name_en || tags.brand;
    
    if (!name) return;

    const shopLat = el.lat || (el.center && el.center.lat);
    const shopLng = el.lon || (el.center && el.center.lon);
    if (!shopLat || !shopLng) return;

    const amenity = tags.amenity || '';
    const nameLower = name.toLowerCase();

    // =========================================================================
    // 🔍 排除非法烟酒批发与干茶叶行 (避免它们因名字含“茶/酒”污染雷达)
    // -------------------------------------------------------------------------
    const isExclusion = nameLower.includes('烟酒') || 
                        nameLower.includes('酒行') || 
                        nameLower.includes('酒业') || 
                        nameLower.includes('茶业') || 
                        nameLower.includes('茶叶') || 
                        nameLower.includes('批发') || 
                        nameLower.includes('茶庄') ||
                        nameLower.includes('茶行') ||
                        nameLower.includes('茶庄') ||
                        nameLower.includes('茶社') ||
                        nameLower.includes('棋牌');
                        
    if (isExclusion) return;

    // =========================================================================
    // OSM 分类逻辑：以 cuisine 标签为主要判断依据（实测成都春熙路结果）
    //   cuisine=coffee_shop -> 咖啡馆  |  bubble_tea/tea/teahouse -> 奶茶
    // -------------------------------------------------------------------------
    const cuisine = (tags.cuisine || '').toLowerCase();
    const isExplicitBar = amenity === 'bar' || amenity === 'pub';
    const isExplicitCafe = amenity === 'cafe';

    const isNameBar = OSM_BAR_KEYWORDS.some(kw => nameLower.includes(kw)) ||
                      (nameLower.includes('\u9152') && !nameLower.includes('\u9152\u5e97'));

    const isCuisineCoffee = cuisine.includes('coffee');
    const isNameCoffee = nameLower.includes('\u548f\u5561') || nameLower.includes('coffee') ||
                         nameLower.includes('caf\u00e9') || nameLower.includes('espresso') ||
                         ['\u661f\u5df4\u514b', '\u745e\u5e78', 'luckin', 'starbucks', 'manner', 'seesaw',
                          '\u5e93\u8fea', 'cudi', 'arabica', 'tim hortons', 'm stand', 'peet',
                          '\u76ae\u7237', 'costa', '\u632a\u74e6', 'nowwa', '\u592a\u5e73\u6d0b\u548f\u5561'].some(b => nameLower.includes(b));

    const isCuisineMilktea = cuisine.includes('bubble_tea') || cuisine.includes('tea') ||
                              cuisine.includes('ice_cream');
    const isNameMilktea = (nameLower.includes('\u8336') ||
                           OSM_MILKTEA_KEYWORDS.some(kw => nameLower.includes(kw))) &&
                          !isNameCoffee && !isNameBar;

    let type: CompassMode | null = null;

    if (isMatchaMode) {
      type = 'matcha';
    } else if (isExplicitBar || isNameBar) {
      type = 'bar';
    } else if (isCuisineCoffee || isNameCoffee) {
      type = 'coffee';
    } else if (isCuisineMilktea || isNameMilktea) {
      type = 'milktea';
    } else if (isExplicitCafe) {
      return;
    } else {
      return;
    }
    // =========================================================================

    const seed = `${el.id}`;
    const rating = 4.1 + (Math.abs(hashString(seed)) % 9) * 0.1;

    // 抹茶风味渗透概率（对非抹茶模式下的普通店作标记）
    const hasMatchaInject = (Math.abs(hashString(seed + '_matcha_seed')) % 10) < 3;

    const address = tags['addr:street'] || tags['addr:full'] || `导航至：周围街区附近的 ${name}`;

    const shop = processAndDecorateShop(
      `osm-${el.id}`,
      name,
      type,
      shopLat,
      shopLng,
      address,
      rating,
      null,
      hasMatchaInject,
      mode
    );
    
    shops.push(shop);
  });

  return shops;
}

/**
 * 从高德地图 (Amap) 周边搜索 API 异步拉取商铺数据
 */
async function fetchFromAmap(lat: number, lng: number, mode: CompassMode, amapKey: string, radius = 3000): Promise<Shop[]> {
  if (!amapKey || amapKey.trim() === '') {
    throw new Error('高德 API Key 不能为空，请在右上角设置中配置您的 Web服务 Key。');
  }

  const isMatchaMode = mode === 'matcha';
  let types = '';
  let keywords = '';

  if (isMatchaMode) {
    // 抹茶模式下：仅使用 '抹茶' 关键字
    types = '050202|050500|050800|050400|050100';
    keywords = '抹茶';
  } else if (mode === 'coffee') {
    types = '050500|050501|050502';
  } else if (mode === 'milktea') {
    types = '050202|050200';
  } else {
    types = '050402|050400';
  }

  let url = `https://restapi.amap.com/v3/place/around?key=${amapKey}&location=${lng},${lat}&types=${encodeURIComponent(types)}&radius=${radius}&offset=50&page=1&output=json`;
  if (keywords) {
    url += `&keywords=${encodeURIComponent(keywords)}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`高德 API 响应失败，状态码: ${response.status}`);
  }

  const data = await response.json();
  if (data.status !== '1') {
    throw new Error(data.info || '高德 API 请求异常，请确认 Key 是否正确且为“Web服务”类型。');
  }

  const pois = data.pois || [];
  const shops: Shop[] = [];

  pois.forEach((poi: any) => {
    const name = poi.name;
    if (!name) return;

    const locParts = (poi.location || '').split(',');
    if (locParts.length !== 2) return;
    const shopLng = parseFloat(locParts[0]);
    const shopLat = parseFloat(locParts[1]);
    if (isNaN(shopLng) || isNaN(shopLat)) return;

    const typecode = poi.typecode || '';
    let type: CompassMode = 'milktea';
    if (isMatchaMode) {
      type = 'matcha';
    } else if (mode === 'coffee') {
      type = 'coffee';
    } else if (typecode === '050402' || poi.type?.includes('酒吧') || poi.type?.includes('酒馆') || name.includes('酒吧') || name.includes('酒馆')) {
      type = 'bar';
    } else if (typecode === '050500' || poi.type?.includes('咖啡') || name.includes('咖啡') || name.includes('Coffee')) {
      type = 'coffee';
    }

    const ext = poi.biz_ext || {};
    const rating = ext.rating ? parseFloat(ext.rating) : (4.0 + (Math.abs(hashString(poi.id)) % 10) * 0.1);
    const priceNum = ext.cost ? parseFloat(ext.cost) : null;

    const hasMatchaInject = false;

    const address = poi.address && poi.address.length > 0 ? poi.address : `导航至：距离较近的 ${name}`;

    const shop = processAndDecorateShop(
      `amap-${poi.id}`,
      name,
      type,
      shopLat,
      shopLng,
      address,
      rating,
      priceNum,
      hasMatchaInject,
      mode
    );

    shops.push(shop);
  });

  return shops;
}

/**
 * 统一的数据拉取入口
 */
export async function fetchShops(
  lat: number,
  lng: number,
  source: 'mock' | 'osm' | 'amap',
  mode: CompassMode,
  radius?: number,
  amapKey?: string
): Promise<Shop[]> {
  // 1. 离线模式拦截检测
  if (source === 'mock') {
    const matchedRegion = PREDEFINED_REAL_SHOPS.find((region) => {
      const dist = getDistance(lat, lng, region.lat, region.lng);
      return dist <= region.radius;
    });

    if (matchedRegion) {
      // 1.1 先根据当前 mode 过滤出该类别的店铺
      const filteredShops = matchedRegion.shops.filter((shop) => shop.type === mode);

      // 1.2 计算距离并组装 Shop 对象
      const sortedShops = filteredShops.map((shop) => {
        const dist = getDistance(lat, lng, shop.lat, shop.lng);
        
        return {
          ...shop,
          distance: Math.round(dist),
          bearing: 0,
          relativeAngle: 0
        };
      }) as Shop[];

      // 1.3 按距离最近升序排列
      sortedShops.sort((a, b) => a.distance - b.distance);

      // 1.4 动态分流截断：保底展示最近 50 家；若 5公里内商家极多，最多展示 5公里内前 80 家
      let finalShops: Shop[] = [];
      const shopsWithin5Km = sortedShops.filter(s => s.distance <= 5000);
      
      if (shopsWithin5Km.length <= 50) {
        finalShops = sortedShops.slice(0, 50);
      } else {
        finalShops = shopsWithin5Km.slice(0, 80);
      }

      return Promise.resolve(finalShops);
    } else {
      return Promise.reject(
        new Error(
          "OutOfBounds: 离线数据库未支持您当前所在的物理区域。目前离线模式仅支持：北京、成都、广州、深圳、厦门、汕头、哈尔滨！"
        )
      );
    }
  }

  // 2. 在线模式拉取
  switch (source) {
    case 'osm':
      return await fetchFromOSM(lat, lng, mode, radius);
    case 'amap':
      if (!amapKey) {
        throw new Error('未检测到高德 API Key，请点击右上角设置面板进行配置！');
      }
      return await fetchFromAmap(lat, lng, mode, amapKey, radius);
    default:
      return Promise.resolve([]);
  }
}
