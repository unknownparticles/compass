import { Shop } from '../types';

// 付费尊享vip商家配置（支持名称模糊匹配，不分大小写）
export const VIP_SHOPS_CONFIG: string[] = [
  "下班之后·bar"
];

/**
 * 判断某个商家是否为“付费尊享vip商家”
 */
export function isVipShop(shop: Shop | null | undefined): boolean {
  if (!shop) return false;
  const shopNameLower = shop.name.toLowerCase();
  return VIP_SHOPS_CONFIG.some(vipName => 
    shopNameLower.includes(vipName.toLowerCase()) || 
    shop.id.toLowerCase() === vipName.toLowerCase()
  );
}
