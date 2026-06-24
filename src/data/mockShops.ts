import { Shop, PresetLocation, CompassMode } from '../types';

// Famous Chinese City Presets for demo/testing
export const PRESET_LOCATIONS: PresetLocation[] = [
  {
    name: '成都 春熙路',
    city: '成都',
    lat: 30.6574,
    lng: 104.0762,
    description: '奶茶神街，市中心最繁华的商圈，聚集了几百家茶饮店和深夜酒馆。'
  },
  {
    name: '北京 三里屯',
    city: '北京',
    lat: 39.9341,
    lng: 116.4542,
    description: '酒鬼圣地，酒吧街和时尚地标，各种精酿和高端调酒林立。'
  },
  {
    name: '上海 新天地',
    city: '上海',
    lat: 31.2208,
    lng: 121.4756,
    description: '魔都小资地标，石库门弄堂里的露天酒吧与新潮现制茶饮。'
  },
  {
    name: '广州 北京路',
    city: '广州',
    lat: 23.1251,
    lng: 113.2678,
    description: '岭南风情步行街，老字号糖水与现代潮牌茶饮交织，附近小酒馆夜夜笙歌。'
  },
  {
    name: '深圳 万象城',
    city: '深圳',
    lat: 22.5372,
    lng: 114.1189,
    description: '赛博鹏城精英地标，高端下午茶和顶级威士忌吧的聚集地。'
  }
];

// Haversine formula to calculate distance in meters
export function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371e3; // meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) *
    Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in meters
}

// Calculate bearing/absolute angle (0 = North, 90 = East, 180 = South, 270 = West)
export function getBearing(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const lambda1 = (lng1 * Math.PI) / 180;
  const lambda2 = (lng2 * Math.PI) / 180;

  const y = Math.sin(lambda2 - lambda1) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(lambda2 - lambda1);
  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360; // normalized to 0-360
}

// Helper to generate coordinates at a specific bearing & distance from an origin
export function destinationPoint(lat: number, lng: number, distanceM: number, bearingDeg: number) {
  const R = 6371e3; // Earth's radius
  const ad = distanceM / R;
  const rla1 = (lat * Math.PI) / 180;
  const rlo1 = (lng * Math.PI) / 180;
  const rbearing = (bearingDeg * Math.PI) / 180;

  const rla2 = Math.asin(
    Math.sin(rla1) * Math.cos(ad) + Math.cos(rla1) * Math.sin(ad) * Math.cos(rbearing)
  );
  const rlo2 =
    rlo1 +
    Math.atan2(
      Math.sin(rbearing) * Math.sin(ad) * Math.cos(rla1),
      Math.cos(ad) - Math.sin(rla1) * Math.sin(rla2)
    );

  return {
    lat: (rla2 * 180) / Math.PI,
    lng: (rlo2 * 180) / Math.PI
  };
}

// Templates for generating customized nearby shops based on lat/lng seeding
const MILK_TEA_TEMPLATES = [
  {
    brand: '喜茶 HEYTEA',
    signature: '多肉葡萄 (Cheese Grape)',
    priceRange: '￥18-24',
    tags: ['真果现剥', '经典芝士', '超高人气'],
    hours: '10:00 - 22:00'
  },
  {
    brand: '霸王茶姬 CHAGEE',
    signature: '伯牙绝弦 (Jasmine Green Tea)',
    priceRange: '￥16-20',
    tags: ['原叶鲜奶茶', '国风美学', '清爽不腻'],
    hours: '09:30 - 22:30'
  },
  {
    brand: '蜜雪冰城 MIXUE',
    signature: '冰鲜柠檬水 (Lemonade)',
    priceRange: '￥4-8',
    tags: ['平价之王', '超大杯', '酸甜冰爽'],
    hours: '09:00 - 23:00'
  },
  {
    brand: '茶颜悦色 Sexy Tea',
    signature: '幽兰拿铁 (Black Tea Latte)',
    priceRange: '￥17-22',
    tags: ['中式奶油茶', '碧根果碎', '江南风韵'],
    hours: '10:00 - 22:00'
  },
  {
    brand: '古茗 GUMING',
    signature: '超口爆柠檬椰 (Lemon Coconut)',
    priceRange: '￥14-18',
    tags: ['好喝不贵', '新鲜水果', 'Q弹西米露'],
    hours: '09:30 - 23:00'
  },
  {
    brand: '奈雪的茶 NAYUKI',
    signature: '霸气芝士草莓 (Strawberry Cheese)',
    priceRange: '￥19-26',
    tags: ['新鲜水果', '欧包极配', '高雅大堂'],
    hours: '10:00 - 22:00'
  },
  {
    brand: 'CoCo都可',
    signature: '奶茶三兄弟 (3 Brothers Boba)',
    priceRange: '￥13-17',
    tags: ['大满贯配料', '浓郁奶香', '老牌经典'],
    hours: '10:00 - 22:30'
  },
  {
    brand: '一点点 1点点',
    signature: '波霸奶茶加红豆 (Boba Milk Tea)',
    priceRange: '￥12-16',
    tags: ['经典台式', '可定制甜度', '波霸超Q弹'],
    hours: '10:00 - 23:00'
  }
];

const BAR_TEMPLATES = [
  {
    brand: '霓虹绿洲 Cyber Oasis Lounge',
    signature: '赛博迷雾 (Smoke & Berry Cocktail)',
    priceRange: '￥78-98',
    tags: ['赛博朋克', '霓虹打卡', '微醺驻唱'],
    hours: '19:00 - 03:00'
  },
  {
    brand: '大鹿精酿 The Drunk Moose',
    signature: '双倍跳跃IPA (Double IPA)',
    priceRange: '￥45-68',
    tags: ['自酿新鲜', '美式小吃', '大屏看球'],
    hours: '18:00 - 02:00'
  },
  {
    brand: '麦克斯威士忌酒馆 Macallan Room',
    signature: '烟熏古典 (Smoked Old Fashioned)',
    priceRange: '￥98-168',
    tags: ['单一麦芽', '黑胶唱片', '安静私密'],
    hours: '19:00 - 02:00'
  },
  {
    brand: '日落大道天台酒吧 Sunset Terrace',
    signature: '落日余晖玛格丽特 (Sunset Margarita)',
    priceRange: '￥88-120',
    tags: ['高空露台', '绝美夜景', '露天电影'],
    hours: '18:00 - 01:30'
  },
  {
    brand: '左轮现场 Revolver Livehouse',
    signature: '长岛冰茶 (Long Island Iced Tea)',
    priceRange: '￥68-88',
    tags: ['摇滚现场', '气氛燥热', '蹦迪精选'],
    hours: '20:00 - 04:00'
  },
  {
    brand: '迷失东京 Lost in Tokyo (Speakeasy)',
    signature: '“歌舞伎町”特调 (Kabukicho Cocktail)',
    priceRange: '￥90-130',
    tags: ['日式调酒', '手工雕冰', '隐藏门推门'],
    hours: '19:30 - 02:30'
  },
  {
    brand: '月光小酌 Bistro Moonlight',
    signature: '桂花起泡红酒 (Osmanthus Sparkler)',
    priceRange: '￥55-80',
    tags: ['浪漫情调', '精美西餐', '适合约会'],
    hours: '17:30 - 01:00'
  },
  {
    brand: '赫兹电子音乐吧 Hertz Techno Club',
    signature: '迷幻伏特加 (Electro Vodka Shot)',
    priceRange: '￥60-90',
    tags: ['重低音Techno', '激光秀', '硬核解压'],
    hours: '21:00 - 05:00'
  }
];

// Seeded pseudorandom generator to maintain consistent fake locations on drag
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

/**
 * Dynamically generates 6 Milk Tea shops and 6 Bars near the specified latitude/longitude coordinate.
 * Distances are mathematically accurate and spread between 120m and 1100m.
 */
export function generateLocalShops(userLat: number, userLng: number): Shop[] {
  const generated: Shop[] = [];
  const baseSeed = Math.floor((userLat + userLng) * 1000);

  // Generate milk tea shops (6 items)
  for (let i = 0; i < 6; i++) {
    const seed = baseSeed + i * 13;
    const distance = 120 + seededRandom(seed) * 880; // 120m to 1000m
    const bearing = seededRandom(seed + 1) * 360;    // 0 to 360 degrees
    const pos = destinationPoint(userLat, userLng, distance, bearing);

    const templateIndex = Math.floor(seededRandom(seed + 2) * MILK_TEA_TEMPLATES.length);
    const tmpl = MILK_TEA_TEMPLATES[templateIndex];

    const rating = parseFloat((4.2 + seededRandom(seed + 3) * 0.7).toFixed(1)); // 4.2 to 4.9
    const reviewsCount = Math.floor(50 + seededRandom(seed + 4) * 450); // 50 to 500

    // Randomly assign matcha drinks to 40% of milk tea shops
    const hasMatcha = seededRandom(seed + 10) < 0.4;
    let signature = tmpl.signature;
    let tags = [...tmpl.tags];
    if (hasMatcha) {
      const matchaMenu = [
        '宇治特浓抹茶拿铁 (Matcha Latte)',
        '静冈大理石抹茶椰乳 (Matcha Coconut)',
        '雪顶抹茶芝士冰沙 (Matcha Cheese Slush)',
        '白玉小子抹茶波波茶 (Boba Matcha Milk)'
      ];
      const matchaIndex = Math.floor(seededRandom(seed + 11) * matchaMenu.length);
      signature = matchaMenu[matchaIndex];
      tags.push('抹茶', 'Matcha');
    }

    generated.push({
      id: `milktea-${i}`,
      name: `${tmpl.brand} (${i + 1}号店)`,
      type: 'milktea',
      lat: pos.lat,
      lng: pos.lng,
      distance: Math.round(distance),
      bearing: Math.round(bearing),
      relativeAngle: 0, // calculated relative to heading in App
      rating,
      reviewsCount,
      address: `导航至：距离您约 ${Math.round(distance)}米 的${tmpl.brand}`,
      signature,
      priceRange: tmpl.priceRange,
      hours: tmpl.hours,
      tags
    });
  }

  // Generate bars (6 items)
  for (let i = 0; i < 6; i++) {
    const seed = baseSeed + i * 17 + 500;
    const distance = 150 + seededRandom(seed) * 950; // 150m to 1100m
    const bearing = seededRandom(seed + 1) * 360;    // 0 to 360 degrees
    const pos = destinationPoint(userLat, userLng, distance, bearing);

    const templateIndex = Math.floor(seededRandom(seed + 2) * BAR_TEMPLATES.length);
    const tmpl = BAR_TEMPLATES[templateIndex];

    const rating = parseFloat((4.1 + seededRandom(seed + 3) * 0.8).toFixed(1)); // 4.1 to 4.9
    const reviewsCount = Math.floor(30 + seededRandom(seed + 4) * 370);

    // Randomly assign matcha cocktails to 30% of bars
    const hasMatcha = seededRandom(seed + 12) < 0.3;
    let signature = tmpl.signature;
    let tags = [...tmpl.tags];
    if (hasMatcha) {
      const matchaMenu = [
        '“京都之雾”抹茶金酒特调 (Matcha Gin Fizz)',
        '大理石抹茶百利甜特饮 (Matcha Baileys)',
        '静冈抹茶艾尔精酿 (Matcha Stout Beer)'
      ];
      const matchaIndex = Math.floor(seededRandom(seed + 13) * matchaMenu.length);
      signature = matchaMenu[matchaIndex];
      tags.push('抹茶调酒', '抹茶');
    }

    generated.push({
      id: `bar-${i}`,
      name: `${tmpl.brand}`,
      type: 'bar',
      lat: pos.lat,
      lng: pos.lng,
      distance: Math.round(distance),
      bearing: Math.round(bearing),
      relativeAngle: 0,
      rating,
      reviewsCount,
      address: `导航至：距离您约 ${Math.round(distance)}米 的${tmpl.brand}`,
      signature,
      priceRange: tmpl.priceRange,
      hours: tmpl.hours,
      tags
    });
  }

  return generated;
}
