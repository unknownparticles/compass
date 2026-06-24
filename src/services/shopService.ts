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

// 抹茶模式专用的菜品数据库
const MATCHA_TEA_SIGNATURES = [
  '宇治特浓抹茶拿铁 (Matcha Latte)',
  '静冈大理石抹茶椰乳 (Matcha Coconut)',
  '雪顶抹茶芝士冰沙 (Matcha Cheese Slush)',
  '白玉小子抹茶波波茶 (Boba Matcha Milk)',
  '宇治手打冰点 (Uji Hand-Whisked Matcha)',
  '特浓抹茶千层蛋糕 (Matcha Mille Crepe)'
];

const MATCHA_BAR_SIGNATURES = [
  '“京都之雾”抹茶金酒特调 (Matcha Gin Fizz)',
  '大理石抹茶百利甜特饮 (Matcha Baileys)',
  '静冈抹茶艾尔精酿 (Matcha Stout Beer)'
];

// 抹茶判定知名大牌词库（这些大牌现实店中均售卖抹茶产品）
const MATCHA_FAMOUS_BRANDS = [
  '喜茶', '奈雪', '瑞幸', '星巴克', '一点点', 'coco', '茶百道', '古茗', 'manner', '库迪', '茶颜', '沪上阿姨', '蜜雪'
];

// OSM 模式下的 POI 饮品及酒吧白名单过滤词
const OSM_MILKTEA_KEYWORDS = [
  '茶', '奶茶', '咖', '咖啡', '冰室', '甜品', '椰', '冰沙', 'KFC', '麦当劳', '德克士',
  '蜜雪', '喜茶', '霸王', '瑞幸', '星巴克', 'Manner', 'Tsujiri', '辻利', '奈雪',
  '一点点', 'Coco', '古茗', '茶百道', '书亦', '阿水', '丸摩堂', '库迪', 'Luckin',
  'Starbucks', 'Tea', 'Boba', 'Coffee', 'Cafe', 'Dessert', 'Ice Cream', 'Juice', 'Fruit'
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
  type: 'milktea' | 'bar',
  lat: number,
  lng: number,
  address: string,
  rating: number,
  priceNum: number | null,
  hasMatchaInject: boolean,
  mode: CompassMode
): Shop {
  const nameLower = name.toLowerCase();
  
  // 抹茶判定：店名含有“抹茶/Matcha”或者属于知名售卖抹茶的奶茶/咖啡连锁品牌
  const isMatchaBrand = MATCHA_FAMOUS_BRANDS.some(brand => nameLower.includes(brand.toLowerCase()));
  const isRealMatcha = name.includes('抹茶') || nameLower.includes('matcha') || isMatchaBrand;
  const finalHasMatcha = isRealMatcha || hasMatchaInject;

  let signature = '';
  let tags: string[] = [];

  // 根据品牌或默认池子匹配招牌菜与标签
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
      const idx = Math.floor(Math.abs(hashString(id)) % DEFAULT_TEA_SIGNATURES.length);
      signature = DEFAULT_TEA_SIGNATURES[idx];
      tags = ['手作茶饮', '下午茶', '休闲空间'];
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
      const idx = Math.floor(Math.abs(hashString(id)) % DEFAULT_BAR_SIGNATURES.length);
      signature = DEFAULT_BAR_SIGNATURES[idx];
      tags = ['精酿啤酒', '鸡尾酒', '音乐小酌'];
    }
  }

  // 抹茶风味渗透/强化逻辑：如果被选中为抹茶店，或当前是抹茶模式，则替换特色菜与标签
  if (finalHasMatcha || mode === 'matcha') {
    if (type === 'milktea' || mode === 'matcha') {
      const matchaIdx = Math.floor(Math.abs(hashString(id + '_matcha')) % MATCHA_TEA_SIGNATURES.length);
      signature = MATCHA_TEA_SIGNATURES[matchaIdx];
      tags.push('抹茶', 'Matcha', '抹茶专门店');
    } else {
      const matchaIdx = Math.floor(Math.abs(hashString(id + '_matcha')) % MATCHA_BAR_SIGNATURES.length);
      signature = MATCHA_BAR_SIGNATURES[matchaIdx];
      tags.push('抹茶调酒', '抹茶');
    }
  }

  const hours = type === 'milktea' ? '09:30 - 22:00' : '18:00 - 02:00';

  let priceRange = '';
  if (priceNum && priceNum > 0) {
    priceRange = `¥${Math.round(priceNum * 0.8)}-${Math.round(priceNum * 1.2)}`;
  } else {
    priceRange = type === 'milktea' ? '¥15-30' : '¥60-150';
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
  
  // 抹茶模式下：除了查询名字带“抹茶/Matcha”的店，还将“喜茶/星巴克/瑞幸/奈雪/一点点”等售卖抹茶的大牌连锁合并放入检索中，杜绝没数据的情况！
  const nameSelector = isMatchaMode 
    ? '[name~"抹茶|Matcha|matcha|喜茶|奈雪|瑞幸|星巴克|一点点|Manner|Coco|茶百道|古茗|库迪|茶颜|luckin|starbucks",i]' 
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
    // 🔍 OSM 细粒度过滤器 (杜绝快餐、面馆、中餐污染奶茶/酒吧列表)
    // -------------------------------------------------------------------------
    let type: 'milktea' | 'bar' | null = null;

    // 1. 酒馆判定：被标记为 bar/pub，或者店名含有“酒”（如XX的酒、酒馆、酒吧、精酿、beer 等）
    const isExplicitBar = amenity === 'bar' || amenity === 'pub';
    const isNameBar = nameLower.includes('酒') || 
                      OSM_BAR_KEYWORDS.some(kw => nameLower.includes(kw));
    
    // 2. 奶茶/咖啡判定：被标记为 cafe，或者店名含有“茶”（如XX的茶、茶铺、奶茶、咖啡、sweet 等）
    const isExplicitCafe = amenity === 'cafe';
    const isNameMilktea = nameLower.includes('茶') || 
                          nameLower.includes('咖啡') ||
                          OSM_MILKTEA_KEYWORDS.some(kw => nameLower.includes(kw));

    if (isExplicitBar || isNameBar) {
      type = 'bar';
    } else if (isExplicitCafe || isNameMilktea) {
      type = 'milktea';
    } else {
      // 既不带酒，也不带茶/咖啡/甜品，过滤掉
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
    // 抹茶模式下：keywords 加上 '抹茶' 和 知名在售抹茶的茶饮大牌，确保搜寻出真实丰富店铺
    types = '050202|050500|050800|050400|050100';
    keywords = '抹茶|喜茶|奈雪|瑞幸|星巴克|一点点|Manner';
  } else if (mode === 'milktea') {
    types = '050202|050500';
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
    let type: 'milktea' | 'bar' = 'milktea';
    if (typecode === '050402' || poi.type?.includes('酒吧') || poi.type?.includes('酒馆') || name.includes('酒吧') || name.includes('酒馆')) {
      type = 'bar';
    }

    const ext = poi.biz_ext || {};
    const rating = ext.rating ? parseFloat(ext.rating) : (4.0 + (Math.abs(hashString(poi.id)) % 10) * 0.1);
    const priceNum = ext.cost ? parseFloat(ext.cost) : null;

    const hasMatchaInject = (Math.abs(hashString(poi.id + '_matcha')) % 10) < 3.5;

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
      // 计算距离并缓存，同时对抹茶连锁店或被抽中的离线店进行抹茶风味渗透
      const sortedShops = matchedRegion.shops.map((shop) => {
        const dist = getDistance(lat, lng, shop.lat, shop.lng);
        
        // 抹茶判断与注入逻辑
        const nameLower = shop.name.toLowerCase();
        const isMatchaBrand = MATCHA_FAMOUS_BRANDS.some(brand => nameLower.includes(brand.toLowerCase()));
        const isRealMatcha = shop.name.includes('抹茶') || nameLower.includes('matcha') || isMatchaBrand;
        const hasMatchaInject = (Math.abs(hashString(shop.id + '_matcha_offline')) % 10) < 3.5;
        const finalHasMatcha = isRealMatcha || hasMatchaInject;

        let signature = shop.signature;
        let tags = [...shop.tags];

        if (finalHasMatcha || mode === 'matcha') {
          if (shop.type === 'milktea' || mode === 'matcha') {
            const matchaIdx = Math.floor(Math.abs(hashString(shop.id + '_matcha')) % MATCHA_TEA_SIGNATURES.length);
            signature = MATCHA_TEA_SIGNATURES[matchaIdx];
            tags.push('抹茶', 'Matcha', '抹茶专门店');
          } else {
            const matchaIdx = Math.floor(Math.abs(hashString(shop.id + '_matcha')) % MATCHA_BAR_SIGNATURES.length);
            signature = MATCHA_BAR_SIGNATURES[matchaIdx];
            tags.push('抹茶调酒', '抹茶');
          }
        }

        return {
          ...shop,
          distance: Math.round(dist),
          bearing: 0,
          relativeAngle: 0,
          signature,
          tags: Array.from(new Set(tags))
        };
      }) as Shop[];

      // 按距离最近升序排列
      sortedShops.sort((a, b) => a.distance - b.distance);

      // 动态分流截断：保底展示最近 50 家；若 5公里内商家极多，最多展示 5公里内前 80 家
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
