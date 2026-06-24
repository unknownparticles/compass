import React from 'react';
import { motion } from 'motion/react';
import { Coffee, Beer, Star, Clock, MapPin, Tag, Compass, Sparkles } from 'lucide-react';
import { Shop, CompassMode } from '../types';

interface ShopListProps {
  mode: CompassMode;
  shops: Shop[];
  selectedShop: Shop | null;
  setSelectedShop: (shop: Shop | null) => void;
  setActiveTab: (tab: string) => void;
}

export default function ShopList({
  mode,
  shops,
  selectedShop,
  setSelectedShop,
  setActiveTab
}: ShopListProps) {
  const isBoba = mode === 'milktea';
  const isMatcha = mode === 'matcha';

  // 传入的 shops 已经是父组件 activeShops 过滤并排序过后的结果，此处直接作为列表数据
  const filteredShops = shops;

  const handleLockShop = (shop: Shop) => {
    setSelectedShop(shop);
    // Auto switch to compass tab so user can follow the needle!
    setActiveTab('compass');
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className={`text-md font-extrabold flex items-center gap-1.5 ${
          isMatcha 
            ? 'text-emerald-950'
            : isBoba 
              ? 'text-rose-950' 
              : 'text-indigo-200'
        }`}>
          {isMatcha ? (
            <Sparkles className="w-5 h-5 text-emerald-600 animate-pulse" />
          ) : isBoba ? (
            <Coffee className="w-5 h-5 text-rose-500" />
          ) : (
            <Beer className="w-5 h-5 text-fuchsia-400" />
          )}
          <span>附近推荐的 {isMatcha ? '抹茶好物' : isBoba ? '奶茶店' : '酒吧酒馆'} ({filteredShops.length})</span>
        </h3>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg border ${
          isMatcha
            ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
            : isBoba 
              ? 'bg-rose-50 border-rose-100 text-rose-700' 
              : 'bg-indigo-950/60 border-indigo-900/60 text-indigo-300'
        }`}>
          按距离排序
        </span>
      </div>

      <div className="space-y-4 max-h-120 overflow-y-auto pr-1">
        {filteredShops.map((shop, idx) => {
          const isSelected = selectedShop?.id === shop.id;

          return (
            <motion.div
              key={shop.id}
              whileHover={{ scale: 1.01, y: -2 }}
              className={`p-4 rounded-3xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? isMatcha
                    ? 'bg-gradient-to-br from-emerald-50/70 to-teal-50/70 border-emerald-300 shadow-md ring-1 ring-emerald-300/40'
                    : isBoba
                      ? 'bg-gradient-to-br from-rose-50/70 to-orange-50/70 border-rose-300 shadow-md ring-1 ring-rose-300/40'
                      : 'bg-gradient-to-br from-indigo-950/70 to-violet-950/60 border-fuchsia-500/80 shadow-[0_0_15px_rgba(139,92,246,0.15)] ring-1 ring-fuchsia-500/30'
                  : isMatcha
                    ? 'bg-white hover:bg-emerald-50/20 border-emerald-100/60 shadow-xs'
                    : isBoba
                      ? 'bg-white hover:bg-rose-50/20 border-rose-100/60 shadow-xs'
                      : 'bg-slate-900/40 hover:bg-slate-900/80 border-indigo-950'
              }`}
            >
              {/* Distance circle indicator */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  {/* Avatar number or icon */}
                  <div className={`w-8 h-8 rounded-2xl flex items-center justify-center font-black shrink-0 ${
                    isSelected
                      ? isMatcha
                        ? 'bg-emerald-500 text-white'
                        : isBoba
                          ? 'bg-rose-500 text-white'
                          : 'bg-fuchsia-500 text-white shadow-[0_0_8px_rgba(244,63,94,0.4)]'
                      : isMatcha
                        ? 'bg-emerald-50 text-emerald-600'
                        : isBoba
                          ? 'bg-rose-50 text-rose-600'
                          : 'bg-indigo-950 text-indigo-400'
                  }`}>
                    {idx + 1}
                  </div>
                  <div>
                    {/* Shop Name */}
                    <h4 className={`text-sm md:text-base font-black flex items-center gap-1.5 ${
                      isMatcha ? 'text-emerald-950' : isBoba ? 'text-rose-950' : 'text-white'
                    }`}>
                      <span>{shop.name}</span>
                      {idx === 0 && (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-black tracking-wide uppercase ${
                          isMatcha
                            ? 'bg-emerald-100 text-emerald-800'
                            : isBoba 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-emerald-950 border border-emerald-800 text-emerald-300'
                        }`}>
                          最亲近 ➔
                        </span>
                      )}
                    </h4>

                    {/* Address / Walking estimation */}
                    <p className={`text-xs mt-1 flex items-center gap-1 ${
                      isMatcha ? 'text-emerald-800/70' : isBoba ? 'text-rose-800/70' : 'text-indigo-300/70'
                    }`}>
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate max-w-56 md:max-w-72">{shop.address}</span>
                    </p>
                  </div>
                </div>

                {/* Distance highlight */}
                <div className="text-right shrink-0">
                  <div className={`text-base font-black ${
                    isMatcha ? 'text-emerald-700' : isBoba ? 'text-rose-700' : 'text-fuchsia-400 font-mono'
                  }`}>
                    {shop.distance}米
                  </div>
                  <div className="text-[10px] opacity-60">
                    步程约 {Math.ceil(shop.distance / 80)} 分钟
                  </div>
                </div>
              </div>

              {/* Middle row: Stats, signature, and Tags */}
              <div className={`mt-3 pt-3 border-t grid grid-cols-2 gap-2 text-xs ${
                isMatcha ? 'border-emerald-100/50' : isBoba ? 'border-rose-100/50' : 'border-indigo-950/60'
              }`}>
                {/* Rating */}
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="font-extrabold">{shop.rating}</span>
                  <span className="opacity-50">({shop.reviewsCount}人评)</span>
                </div>

                {/* Signature menu item */}
                <div className="text-right truncate">
                  <span className="opacity-50">招牌: </span>
                  <span className={`font-black ${isMatcha ? 'text-emerald-800' : isBoba ? 'text-rose-800' : 'text-fuchsia-300'}`}>
                    {shop.signature}
                  </span>
                </div>
              </div>

              {/* Tags and price row */}
              <div className="flex items-center justify-between flex-wrap gap-2 mt-3 pt-2">
                <div className="flex items-center gap-1 flex-wrap">
                  {shop.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                        isMatcha
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100/60'
                          : isBoba
                            ? 'bg-orange-50 text-orange-700 border border-orange-100/60'
                            : 'bg-indigo-950/60 text-indigo-300 border border-indigo-900/40'
                      }`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                
                <span className={`text-[11px] font-black ${isMatcha ? 'text-emerald-900' : isBoba ? 'text-rose-900' : 'text-indigo-200'}`}>
                  人均: {shop.priceRange}
                </span>
              </div>

              {/* Button block: Point compass to this shop */}
              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => setSelectedShop(shop)}
                  className={`flex-1 py-2 px-3 text-xs font-bold rounded-2xl cursor-pointer transition-all border flex items-center justify-center gap-1.5 active:scale-98 ${
                    isSelected
                      ? isMatcha
                        ? 'bg-emerald-100 border-emerald-200 text-emerald-800'
                        : isBoba
                          ? 'bg-rose-100 border-rose-200 text-rose-800'
                          : 'bg-indigo-950 border-indigo-800 text-indigo-200'
                      : isMatcha
                        ? 'bg-emerald-50/30 border-emerald-100/50 hover:bg-emerald-50 hover:border-emerald-200 text-emerald-750'
                        : isBoba
                          ? 'bg-rose-50/30 border-rose-100/50 hover:bg-rose-50 hover:border-rose-200 text-rose-700'
                          : 'bg-slate-900/60 border-indigo-950 hover:bg-indigo-950 text-indigo-300'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isSelected ? '已选为目标' : '选定此店'}</span>
                </button>
                
                <button
                  onClick={() => handleLockShop(shop)}
                  className={`py-2 px-4 text-xs font-black rounded-2xl cursor-pointer transition-all flex items-center justify-center gap-1.5 active:scale-98 text-white ${
                    isSelected
                      ? isMatcha
                        ? 'bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-200/50'
                        : isBoba
                          ? 'bg-rose-500 hover:bg-rose-600 shadow-md'
                          : 'bg-fuchsia-500 hover:bg-fuchsia-600 shadow-[0_0_10px_rgba(217,70,239,0.5)]'
                      : isMatcha
                        ? 'bg-emerald-500 hover:bg-emerald-600'
                        : isBoba
                          ? 'bg-rose-400 hover:bg-rose-500'
                          : 'bg-violet-600 hover:bg-violet-500 shadow-[0_0_5px_rgba(139,92,246,0.2)]'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5 shrink-0 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>锁定指向 ➔</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
