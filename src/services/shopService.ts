import { Shop, CompassMode, Coordinate } from '../types';
import { generateLocalShops } from '../data/mockShops';

// 常用茶饮/咖啡品牌招牌菜品映射数据库
const TEA_BRANDS_DATABASE: { [key: string]: { signature: string; tags: string[] } } = {
  '霸王茶姬': { signature: '伯牙绝弦 (Jasmine Green Milk Tea)', tags: ['鲜奶茶', '国风茶饮', '招牌茉莉'] },
  '茶颜悦色': { signature: '幽兰拿铁 (Black Tea Latte)', tags: ['红茶拿铁', '中式茶饮', '忌廉奶油'] },
  '喜茶': { signature: '多肉葡萄 (Cheese Grape)', tags: ['芝士果茶', '招牌果茶', '经典葡萄'] },
  '奈雪': { signature: '霸气芝士草莓 (Strawberry Cheese)', tags: ['芝士果茶', '鲜果茶', '烘焙面包'] },
  '一点点': { signature: '四季春玛奇朵 (Light Oolong Macchiato)', tags: ['经典奶茶', '手摇茶', '奶盖'] },
  'coco': { signature: '奶茶三兄弟 (Three Brothers Boba)', tags: ['经典奶茶', '布丁仙草', '加料'] },
  '蜜雪冰城': { signature: '冰鲜柠檬水 (Fresh Lemonade)', tags: ['平价茶饮', '柠檬水', '冰淇淋'] },
  '星巴克': { signature: '燕麦焦糖玛奇朵 (Caramel Macchiato)', tags: ['精品咖啡', '星冰乐', '燕麦奶'] },
  '瑞幸': { signature: '生椰拿铁 (Raw Coconut Latte)', tags: ['生椰咖啡', '平价精品', '拿铁'] },
  '库迪': { signature: '潘帕斯生椰拿铁 (Pampas Coconut Latte)', tags: ['平价咖啡', '生椰', '拿铁'] },
  'Manner': { signature: '桂花燕麦拿铁 (Osmanthus Oat Latte)', tags: ['精品咖啡', '手冲', '拿铁'] }
};

// 常见酒吧招牌特调映射数据库
const BAR_BRANDS_DATABASE: { [key: string]: { signature: string; tags: string[] } } = {
  'COMMUNE': { signature: '幻影极光精酿 (Aurora IPA)', tags: ['幻音精酿', '美式西餐', '自选啤酒'] },
  '海伦司': { signature: '海伦司可乐桶 (Helens Cola Bucket)', tags: ['平价小酒馆', '可乐桶', '聚会小酌'] },
  '跳海': { signature: '跳海原产小麦精酿 (Tiaohai Craft Wheat)', tags: ['精酿啤酒', '社交互动', '小众精酿'] },
  '胡桃里': { signature: '桃花源特调鸡尾酒 (Peach Cocktail)', tags: ['音乐酒馆', '川菜美食', '民谣现场'] }
};

// 默认奶茶店/咖啡馆备用招牌菜品
const DEFAULT_TEA_SIGNATURES = [
  '招牌波霸奶茶 (Classic Pearl Milk Tea)',
  '杨枝甘露轻盈版 (Mango Sago Mango Slush)',
  '生椰爆汁西瓜 (Coconut Watermelon Juice)',
  '芝士多肉莓莓 (Cheese Strawberry Fruit Tea)',
  '美式咖啡 (Iced Caffe Americano)',
  '馥芮白 (Flat White)'
];

// 默认酒吧备用招牌鸡尾酒
const DEFAULT_BAR_SIGNATURES = [
  '经典莫吉托 (Classic Mojito)',
  '特调长岛冰茶 (Long Island Iced Tea)',
  '金汤力特调 (Gin and Tonic)',
  '玛格丽特 (Margarita)',
  '泥煤威士忌纯饮 (Peated Islay Single Malt)',
  '海盐柠檬精酿小麦 (Sea Salt Craft Wheat Beer)'
];

// 抹茶模式专用的菜品数据库（抹茶风味渗透）
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
  // 1. 判断是否真的包含抹茶（名字里含有抹茶或 Matcha）
  const isRealMatcha = name.includes('抹茶') || name.toLowerCase().includes('matcha');
  const finalHasMatcha = isRealMatcha || hasMatchaInject;

  let signature = '';
  let tags: string[] = [];

  // 2. 根据品牌或默认池子匹配招牌菜与标签
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

  // 3. 抹茶风味渗透/强化逻辑：如果被选中为抹茶店，或当前是抹茶模式，则替换特色菜与标签
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

  // 4. 处理营业时间
  const hours = type === 'milktea' ? '09:30 - 22:00' : '18:00 - 02:00';

  // 5. 格式化消费区间
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
    distance: 0,       // 稍后在 App.tsx 层面会依据实际定位实时覆盖计算
    bearing: 0,        // 稍后覆盖
    relativeAngle: 0,  // 稍后覆盖
    rating: parseFloat(rating.toFixed(1)),
    reviewsCount,
    address,
    signature,
    priceRange,
    hours,
    tags: Array.from(new Set(tags)) // 去重
  };
}

// 辅助哈希函数，用于将字符串转换为伪随机数以保持数据一致性
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

/**
 * 从 OpenStreetMap (OSM) Overpass API 异步拉取商铺数据
 */
async function fetchFromOSM(lat: number, lng: number, mode: CompassMode, radius = 3000): Promise<Shop[]> {
  const isMatchaMode = mode === 'matcha';
  
  // 抹茶模式下通过 Overpass 的正则语法只查询店名含有 抹茶/Matcha/matcha 的节点，防止召回非抹茶店
  const nameSelector = isMatchaMode ? '[name~"抹茶|Matcha|matcha",i]' : '';

  // 构建 Overpass API 查询语句
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
    let type: 'milktea' | 'bar' = 'milktea';
    
    if (amenity === 'bar' || amenity === 'pub' || name.toLowerCase().includes('bar') || name.includes('酒吧') || name.includes('酒馆')) {
      type = 'bar';
    }

    const seed = `${el.id}`;
    const rating = 4.1 + (Math.abs(hashString(seed)) % 9) * 0.1;

    // 抹茶风味渗透：30% 的概率被注入抹茶产品（仅对非抹茶模式下的普通店作标记）
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
    // 抹茶模式：在周边搜索里加入 keywords='抹茶'，并扩大品类到甜品、茶馆、冷饮与咖啡餐厅，寻找真实商家
    types = '050202|050500|050800|050400|050100';
    keywords = '抹茶';
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
 * @param lat 用户纬度
 * @param lng 用户经度
 * @param source 数据源类型 ('mock' | 'osm' | 'amap')
 * @param mode 当前指南针模式
 * @param amapKey 高德 API Key（高德模式下必传）
 * @returns 统一的商铺列表 Promise
 */
export async function fetchShops(
  lat: number,
  lng: number,
  source: 'mock' | 'osm' | 'amap',
  mode: CompassMode,
  amapKey?: string
): Promise<Shop[]> {
  switch (source) {
    case 'osm':
      return await fetchFromOSM(lat, lng, mode);
    case 'amap':
      if (!amapKey) {
        throw new Error('未检测到高德 API Key，请点击右上角设置面板进行配置！');
      }
      return await fetchFromAmap(lat, lng, mode, amapKey);
    case 'mock':
    default:
      return Promise.resolve(generateLocalShops(lat, lng));
  }
}
