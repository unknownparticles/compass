import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  Map as MapIcon, 
  Coffee, 
  Beer, 
  Radio, 
  Navigation, 
  Sparkles, 
  MapPin, 
  RotateCcw, 
  ChevronRight, 
  Compass as CompassIcon,
  ChevronsUp,
  Sliders,
  HelpCircle,
  Settings,
  X,
  Loader2
} from 'lucide-react';
import { Coordinate, Shop, CompassMode, PresetLocation } from './types';
import { 
  PRESET_LOCATIONS, 
  getDistance, 
  getBearing, 
  destinationPoint 
} from './data/mockShops';
import { fetchShops } from './services/shopService';

import CompassView from './components/Compass';
import Radar from './components/Radar';
import MapContainer from './components/MapContainer';
import ShopList from './components/ShopList';
import { isVipShop } from './data/vipConfig';


export default function App() {
  // 1. Core State
  const [isMatchaUnlocked, setIsMatchaUnlocked] = useState<boolean>(() => {
    return localStorage.getItem('compass_matcha_unlocked') === 'true';
  });
  const [mode, setMode] = useState<CompassMode>(() => {
    const savedMode = localStorage.getItem('compass_active_mode') as CompassMode;
    const isUnlocked = localStorage.getItem('compass_matcha_unlocked') === 'true';
    if (savedMode === 'matcha' && !isUnlocked) {
      return 'milktea';
    }
    return savedMode || 'milktea';
  });
  const [userLocation, setUserLocation] = useState<Coordinate>({
    lat: 30.6574,  // Initial coordinate: Chengdu Chunxi Road (Spring Autumn Plaza)
    lng: 104.0762
  });
  const [userHeading, setUserHeading] = useState<number>(0); // facing direction (0-360)
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [isLocked, setIsLocked] = useState<boolean>(false); // whether manual lock is active
  const [activeTab, setActiveTab] = useState<string>('compass'); // 'compass' | 'radar' | 'map'
  const [sensorStatus, setSensorStatus] = useState<'loading' | 'active' | 'unavailable'>('loading');
  const [showSimulatorTip, setShowSimulatorTip] = useState<boolean>(true);
  const [showSimulator, setShowSimulator] = useState<boolean>(false); // default hidden
  const [titleClickCount, setTitleClickCount] = useState<number>(0);
  const [exploreRadius, setExploreRadius] = useState<number>(3000); // 默认3000米 (1000 | 3000 | 5000 | 10000)
  const [maxShopsCount, setMaxShopsCount] = useState<number>(15);   // 默认最近15家 (15 | 30 | 50 | 100)

  // 1.5. Data Source and Config Settings States
  const [dataSource, setDataSource] = useState<'mock' | 'osm' | 'amap'>(() => {
    const saved = localStorage.getItem('compass_data_source');
    return (saved === 'osm' || saved === 'amap') ? saved : 'mock';
  });
  const [amapKey, setAmapKey] = useState<string>(() => {
    return localStorage.getItem('compass_amap_key') || '';
  });
  const [rawShops, setRawShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  
  // Temporary states inside the settings modal
  const [tempDataSource, setTempDataSource] = useState<'mock' | 'osm' | 'amap'>(dataSource);
  const [tempAmapKey, setTempAmapKey] = useState<string>(amapKey);

  useEffect(() => {
    if (showSettings) {
      setTempDataSource(dataSource);
      setTempAmapKey(amapKey);
    }
  }, [showSettings, dataSource, amapKey]);

  const handleSaveSettings = () => {
    setDataSource(tempDataSource);
    setAmapKey(tempAmapKey);
    localStorage.setItem('compass_data_source', tempDataSource);
    localStorage.setItem('compass_amap_key', tempAmapKey);
    setShowSettings(false);
  };

  const handleTitleClick = () => {
    if (isMatchaUnlocked) return;
    const nextCount = titleClickCount + 1;
    setTitleClickCount(nextCount);
    if (nextCount >= 5) {
      setIsMatchaUnlocked(true);
      localStorage.setItem('compass_matcha_unlocked', 'true');
      setMode('matcha');
      localStorage.setItem('compass_active_mode', 'matcha');
      alert('🎉 恭喜你发现了隐藏的彩蛋！已成功解锁隐藏的「🍃 抹茶特调指南针模式」！现在点击右上角切换按钮，即可随罗盘寻找附近的抹茶特调和甜品啦！');
    }
  };

  // Check if running inside an iframe (like AI Studio preview frame)
  const isInIframe = useMemo(() => {
    try {
      return typeof window !== 'undefined' && window.self !== window.top;
    } catch (e) {
      return true;
    }
  }, []);

  // 2. Fetch shops dynamically (Async)
  useEffect(() => {
    let active = true;
    const loadShops = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const data = await fetchShops(
          userLocation.lat,
          userLocation.lng,
          dataSource,
          mode,
          exploreRadius,
          amapKey
        );
        if (active) {
          setRawShops(data);
        }
      } catch (err: any) {
        if (active) {
          setFetchError(err.message || '获取周边真实商铺数据失败');
          setRawShops([]);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadShops();

    return () => {
      active = false;
    };
  }, [userLocation.lat, userLocation.lng, dataSource, mode, exploreRadius, amapKey]);

  // 3. Process shops to calculate dynamic distances, bearings, and relative angles based on heading
  const shops = useMemo(() => {
    return rawShops.map((shop) => {
      const distance = Math.round(getDistance(userLocation.lat, userLocation.lng, shop.lat, shop.lng));
      const bearing = Math.round(getBearing(userLocation.lat, userLocation.lng, shop.lat, shop.lng));
      // relative angle of shop based on which direction user is facing
      const relativeAngle = (bearing - userHeading + 360) % 360;

      return {
        ...shop,
        distance,
        bearing,
        relativeAngle
      };
    });
  }, [rawShops, userLocation, userHeading]);

  // 3.2. Filter shops by active mode, sort by distance, filter by exploreRadius, and slice by maxShopsCount
  const activeShops = useMemo(() => {
    const filtered = shops.filter((s) => s.type === mode);

    return filtered
      .filter((s) => s.distance <= exploreRadius)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, maxShopsCount);
  }, [shops, mode, exploreRadius, maxShopsCount]);

  // 3.5. Dynamically calculate the closest shop in the current facing direction
  const facingShop = useMemo(() => {
    if (activeShops.length === 0) return null;

    // 1st Priority: Closest shop within 45 degrees of facing direction
    const sector45 = activeShops.filter((s) => {
      const diff = Math.min(s.relativeAngle, 360 - s.relativeAngle);
      return diff <= 45;
    });
    if (sector45.length > 0) {
      return [...sector45].sort((a, b) => a.distance - b.distance)[0];
    }

    // 2nd Priority: Closest shop within 90 degrees of facing direction
    const sector90 = activeShops.filter((s) => {
      const diff = Math.min(s.relativeAngle, 360 - s.relativeAngle);
      return diff <= 90;
    });
    if (sector90.length > 0) {
      return [...sector90].sort((a, b) => a.distance - b.distance)[0];
    }

    // 3rd Priority: Globally closest angular match to facing direction
    return [...activeShops].sort((a, b) => {
      const diffA = Math.min(a.relativeAngle, 360 - a.relativeAngle);
      const diffB = Math.min(b.relativeAngle, 360 - b.relativeAngle);
      return diffA - diffB;
    })[0];
  }, [activeShops]);

  // The active shop targets (manual lock wins, otherwise dynamic facing wins)
  const activeSelectedShop = useMemo(() => {
    if (isLocked && selectedShop) {
      const exists = activeShops.some((s) => s.id === selectedShop.id);
      if (exists) {
        return activeShops.find((s) => s.id === selectedShop.id) || selectedShop;
      }
    }
    return facingShop;
  }, [isLocked, selectedShop, facingShop, activeShops]);

  // 3.8. VIP Shop Vibrate effect: triggers once when activeSelectedShop changes and it's a VIP
  useEffect(() => {
    if (activeSelectedShop && isVipShop(activeSelectedShop)) {
      if ('vibrate' in navigator) {
        try {
          navigator.vibrate(200);
          console.log(`[VIP VIBRATE] Shop "${activeSelectedShop.name}" scanned!`);
        } catch (e) {
          console.warn('Vibration failed:', e);
        }
      }
    }
  }, [activeSelectedShop?.id]);


  // 4. Reset manual lock if the locked shop is no longer available in the current mode
  useEffect(() => {
    if (selectedShop) {
      const exists = activeShops.some((s) => s.id === selectedShop.id);
      if (!exists) {
        setSelectedShop(null);
        setIsLocked(false);
      }
    }
  }, [activeShops, selectedShop]);

  // 5. Geolocation Sensor: Grab GPS on startup
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          console.log("GPS Position acquired successfully!");
        },
        (error) => {
          console.warn("GPS Permission or location services error:", error);
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    }
  }, []);

  // 6. Device Orientation Sensor: Listen for physical phone rotation
  const handleOrientation = (e: DeviceOrientationEvent) => {
    let heading = 0;
    
    if ('webkitCompassHeading' in e) {
      // iOS Compass Heading (Most accurate on iOS Safari)
      heading = (e as any).webkitCompassHeading;
    } else if (e.alpha !== null) {
      // Android alpha. Webkit orientations usually use 360 - alpha.
      // High compatibility for Android absolute orientation
      heading = 360 - e.alpha;
    }
    
    // Smooth angle update to prevent shaky UI
    setUserHeading(Math.round(heading));
    setSensorStatus('active');
  };

  const requestDeviceOrientation = () => {
    if (typeof window === 'undefined') return;

    // Check if permission API exists (iOS 13+ Safari)
    if (
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      (DeviceOrientationEvent as any).requestPermission()
        .then((permissionState: string) => {
          if (permissionState === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation, true);
            window.addEventListener('deviceorientationabsolute', handleOrientation, true);
            setSensorStatus('active');
          } else {
            setSensorStatus('unavailable');
          }
        })
        .catch((err: any) => {
          console.error("iOS Gyro Permission Error:", err);
          setSensorStatus('unavailable');
        });
    } else {
      // Android or Standard browsers (Chrome, Firefox Mobile etc.)
      try {
        const win = window as any;
        // Modern Android Chrome uses 'deviceorientationabsolute' for absolute compass values
        if ('ondeviceorientationabsolute' in win) {
          win.addEventListener('deviceorientationabsolute', handleOrientation, true);
        } else {
          win.addEventListener('deviceorientation', handleOrientation, true);
        }
        
        // Brief check to see if we get actual sensor feedback
        const checkEvent = (e: DeviceOrientationEvent) => {
          if (e.alpha !== null || 'webkitCompassHeading' in e) {
            setSensorStatus('active');
          } else {
            setSensorStatus('unavailable');
          }
          win.removeEventListener('deviceorientation', checkEvent);
          win.removeEventListener('deviceorientationabsolute', checkEvent);
        };
        
        win.addEventListener('deviceorientation', checkEvent);
      } catch (e) {
        console.warn("Sensor binding error:", e);
        setSensorStatus('unavailable');
      }
    }
  };

  // Attempt to check sensors silently on load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const win = window as any;
        const checkEvent = (e: DeviceOrientationEvent) => {
          if (e.alpha !== null || 'webkitCompassHeading' in e) {
            setSensorStatus('active');
            win.addEventListener('deviceorientation', handleOrientation, true);
            win.addEventListener('deviceorientationabsolute', handleOrientation, true);
          }
          win.removeEventListener('deviceorientation', checkEvent);
        };
        win.addEventListener('deviceorientation', checkEvent);
      } catch (e) {
        setSensorStatus('unavailable');
      }
    }
  }, []);

  // 7. Simulator controls: Teleport to dynamic Preset Locations
  const handlePresetSelect = (preset: PresetLocation) => {
    setUserLocation({ lat: preset.lat, lng: preset.lng });
  };

  // 8. Simulator controls: Simulating physical walking in facing direction!
  const handleSimulateWalk = (meters: number) => {
    const nextPos = destinationPoint(userLocation.lat, userLocation.lng, meters, userHeading);
    setUserLocation(nextPos);
  };

  const isMatcha = mode === 'matcha';
  const isBoba = mode === 'milktea';
  const isCoffee = mode === 'coffee';

  const handleModeSwitch = () => {
    let nextMode: CompassMode = 'milktea';
    if (mode === 'milktea') {
      nextMode = 'coffee';
    } else if (mode === 'coffee') {
      nextMode = 'bar';
    } else if (mode === 'bar') {
      if (isMatchaUnlocked) {
        nextMode = 'matcha';
      } else {
        nextMode = 'milktea';
      }
    } else {
      nextMode = 'milktea';
    }
    setMode(nextMode);
    localStorage.setItem('compass_active_mode', nextMode);
  };

  return (
    <div className={`min-h-screen pb-[env(safe-area-inset-bottom,0px)] pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)] transition-all duration-700 font-sans flex flex-col justify-between ${
      isMatcha
        ? 'bg-gradient-to-b from-emerald-50/60 via-stone-50/40 to-white text-emerald-950'
        : isBoba 
          ? 'bg-gradient-to-b from-rose-50/70 via-orange-50/40 to-white text-rose-950'
          : isCoffee
            ? 'bg-gradient-to-b from-amber-50/80 via-stone-50/50 to-white text-amber-950'
            : 'bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-slate-100'
    }`}>
      
      {/* Dynamic Header */}
      <header className={`px-4 pt-[calc(env(safe-area-inset-top,0px)+16px)] pb-4 md:py-6 border-b flex items-center justify-between sticky top-0 z-50 backdrop-blur-md transition-all ${
        isMatcha
          ? 'bg-white/85 border-emerald-100/60'
          : isBoba 
            ? 'bg-white/85 border-rose-100/60'
            : isCoffee
              ? 'bg-white/90 border-amber-100/60'
              : 'bg-slate-950/85 border-indigo-950/60 shadow-[0_4px_10px_rgba(0,0,0,0.4)]'
      }`}>
        <div className="flex items-center gap-2">
          <div className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${
            isMatcha
              ? 'bg-emerald-600 text-white shadow shadow-emerald-200'
              : isBoba 
                ? 'bg-rose-500 text-white shadow shadow-rose-200'
                : isCoffee
                  ? 'bg-amber-700 text-white shadow shadow-amber-200'
                  : 'bg-fuchsia-500 text-white shadow-[0_0_8px_rgba(217,70,239,0.5)]'
          }`}>
            <CompassIcon className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div onClick={handleTitleClick} className="cursor-pointer select-none">
            <h1 className="text-base md:text-lg font-black tracking-tight leading-none">
              {isMatcha ? '寻味指南针 🍵' : isBoba ? '寻味指南针 🧋' : isCoffee ? '寻味指南针 ☕' : '寻味指南针 🍹'}
            </h1>
            <p className={`text-[10px] mt-0.5 ${isMatcha ? 'text-emerald-700/60' : isBoba ? 'text-rose-700/60' : isCoffee ? 'text-amber-700/70' : 'text-indigo-400'}`}>
              {isMatcha ? '已开启隐藏模式：寻觅抹茶甜物' : isCoffee ? '罗盘指引 · 寻找最近精品咖啡' : 'GPS 定位与方向雷达自动寻找最近好店'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Settings Button */}
          <button
            onClick={() => setShowSettings(true)}
            className={`p-2 rounded-2xl border flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 ${
              isMatcha
                ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
                : isBoba
                  ? 'bg-rose-50 border-rose-100 text-rose-700'
                  : isCoffee
                    ? 'bg-amber-50 border-amber-100 text-amber-800'
                    : 'bg-slate-900 border-indigo-950 text-fuchsia-300 shadow-[0_0_8px_rgba(217,70,239,0.15)]'
            }`}
            title="数据源设置"
          >
            <Settings className="w-4.5 h-4.5" />
          </button>

          {/* 1. Mode Switch Button */}
          <button
            onClick={handleModeSwitch}
            className={`px-4 py-2 rounded-2xl border text-xs font-black tracking-wide flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95 ${
              isMatcha
                ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-800 shadow shadow-emerald-100/10'
                : isBoba
                  ? 'bg-gradient-to-r from-rose-50 to-rose-100 border-rose-200 text-rose-700 shadow shadow-rose-100/10'
                  : isCoffee
                    ? 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200 text-amber-850 shadow shadow-amber-100/10'
                    : 'bg-gradient-to-r from-slate-900 to-indigo-950 border-indigo-900 text-fuchsia-300 shadow-[0_0_8px_rgba(217,70,239,0.2)]'
            }`}
          >
            {isMatcha ? (
              <>
                <Coffee className="w-4 h-4 text-rose-500 animate-bounce" />
                <span>切换奶茶模式</span>
              </>
            ) : isBoba ? (
              <>
                <Coffee className="w-4 h-4 text-amber-700 animate-bounce" />
                <span>切换咖啡模式</span>
              </>
            ) : isCoffee ? (
              <>
                <Beer className="w-4 h-4 text-fuchsia-400 animate-bounce" />
                <span>切换酒鬼模式</span>
              </>
            ) : isMatchaUnlocked ? (
              <>
                <Sparkles className="w-4 h-4 text-emerald-500 animate-bounce" />
                <span>切换抹茶模式 🍃</span>
              </>
            ) : (
              <>
                <Coffee className="w-4 h-4 text-rose-500 animate-bounce" />
                <span>切换奶茶模式</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Core Container */}
      <main className="max-w-2xl w-full mx-auto px-4 py-6 flex-1 space-y-6">
        
        {/* Dynamic Mode Heading Banner */}
        <div className="text-center md:py-2">
          <AnimatePresence mode="wait">
            {isMatcha ? (
              <motion.div
                key="matcha-title"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
              >
                <span className="text-2xl md:text-3xl font-black block text-emerald-950">
                  🍵 隐藏抹茶模式 🍃
                </span>
                <p className="text-xs text-emerald-800/70 mt-1 max-w-sm mx-auto">
                  “宇治拿铁、静冈大理石、抹茶调酒...” 已为您解锁附近的抹茶特调与甜点好店！
                </p>
              </motion.div>
            ) : isBoba ? (
              <motion.div
                key="milktea-title"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
              >
                <span className="text-2xl md:text-3xl font-black block text-rose-950">
                  🧋 奶茶指南针 🍯
                </span>
                <p className="text-xs text-rose-700/70 mt-1 max-w-sm mx-auto">
                  “波霸无糖、加红豆、芝士盖顶...” 马上指出您身边最近的解馋奶茶铺！
                </p>
              </motion.div>
            ) : isCoffee ? (
              <motion.div
                key="coffee-title"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
              >
                <span className="text-2xl md:text-3xl font-black block text-amber-900">
                  ☕ 咖啡指南针 🫘
                </span>
                <p className="text-xs text-amber-800/70 mt-1 max-w-sm mx-auto">
                  “生椰拿铁、手冲单品、Dirty...” 立刻锁定您附近最近的精品咖啡馆！
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="bar-title"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
              >
                <span className="text-2xl md:text-3xl font-black block text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-pink-400 to-violet-400 tracking-wider">
                  🍹 酒鬼指南针 🔮
                </span>
                <p className="text-xs text-indigo-300/60 mt-1 max-w-sm mx-auto">
                  “古典、莫吉托、双倍精酿、爵士黑胶...” 即刻引导您潜入最近的深夜避风港！
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 2. TAB CONTROLLER CARDS */}
        <div className={`p-1.5 rounded-2xl grid grid-cols-3 gap-1 border transition-all duration-300 ${
          isMatcha
            ? 'bg-emerald-50/50 border-emerald-100/60'
            : isBoba 
              ? 'bg-rose-50/50 border-rose-100/60'
              : isCoffee
                ? 'bg-amber-50/50 border-amber-100/60'
                : 'bg-slate-950 border-indigo-950'
        }`}>
          {[
            { id: 'compass', label: '指南针', icon: Compass },
            { id: 'radar', label: '声呐雷达', icon: Radio },
            { id: 'map', label: '地图模式', icon: MapIcon }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2.5 rounded-xl text-xs font-black cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                  isActive
                    ? isMatcha
                      ? 'bg-white border border-emerald-100 text-emerald-950 shadow-xs'
                      : isBoba
                        ? 'bg-white border border-rose-100 text-rose-950 shadow-xs'
                        : isCoffee
                          ? 'bg-white border border-amber-200 text-amber-950 shadow-xs'
                          : 'bg-indigo-950 border border-indigo-800 text-white shadow-[0_2px_12px_rgba(139,92,246,0.15)]'
                    : isMatcha
                      ? 'text-emerald-800/60 hover:text-emerald-900'
                      : isBoba
                        ? 'text-rose-800/60 hover:text-rose-900'
                        : isCoffee
                          ? 'text-amber-800/60 hover:text-amber-900'
                          : 'text-indigo-400 hover:text-indigo-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 3. ACTIVE TAB RENDER VIEWS */}
        <div className={`relative p-2 rounded-3xl border min-h-96 flex items-center justify-center overflow-hidden transition-all duration-300 ${
          isMatcha
            ? 'bg-linear-to-b from-white/90 to-emerald-50/10 border-emerald-100'
            : isBoba 
              ? 'bg-linear-to-b from-white/90 to-rose-50/10 border-rose-100'
              : isCoffee
                ? 'bg-linear-to-b from-white/90 to-amber-50/10 border-amber-100'
                : 'bg-linear-to-b from-slate-900/90 to-slate-950/40 border-indigo-950/80'
        }`}>
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 z-50 backdrop-blur-md bg-white/70 dark:bg-slate-950/80 flex flex-col items-center justify-center gap-4 transition-all duration-300">
              <Loader2 className={`w-10 h-10 animate-spin ${
                isMatcha ? 'text-emerald-600' : isBoba ? 'text-rose-500' : isCoffee ? 'text-amber-700' : 'text-fuchsia-500'
              }`} />
              <div className="text-center px-4">
                <p className={`font-black text-xs ${isBoba || isMatcha || isCoffee ? 'text-neutral-800' : 'text-indigo-200'}`}>
                  {dataSource === 'osm' 
                    ? '正在连接卫星搜寻周边真实商铺 (OSM)...' 
                    : dataSource === 'amap' 
                      ? '正在通过高德地图获取真实商家 POI...' 
                      : '正在初始化雷达空间...'}
                </p>
                <p className="text-[10px] text-neutral-500 dark:text-indigo-400/60 mt-1 font-bold">罗盘及雷达天线展开中</p>
              </div>
            </div>
          )}

          {/* Out of Bounds (Offline unsupported region) Overlay */}
          {fetchError && !isLoading && fetchError.includes("OutOfBounds") && (
            <div className="absolute inset-0 z-50 backdrop-blur-md bg-white/85 dark:bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center gap-4">
              <span className="text-4xl animate-bounce">📍</span>
              <div>
                <p className="font-black text-sm text-amber-600 dark:text-amber-400">
                  离线模式未支持当前区域
                </p>
                <p className="text-[10px] text-neutral-600 dark:text-indigo-300/80 mt-2 max-w-sm mx-auto leading-relaxed">
                  你当前的定位已超出本地离线数据库的预设范围。目前离线模式仅支持：<strong>北京、成都、广州、深圳、厦门、汕头、哈尔滨</strong>等城市。请切换在线模式或补充数据。
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSettings(true)}
                  className={`px-3.5 py-2 rounded-xl text-[10px] font-black text-white cursor-pointer ${
                    isMatcha ? 'bg-emerald-600' : isBoba ? 'bg-rose-500' : isCoffee ? 'bg-amber-600' : 'bg-fuchsia-500'
                  }`}
                >
                  ⚙️ 打开数据源设置
                </button>
                <button
                  onClick={() => {
                    setDataSource('osm');
                    localStorage.setItem('compass_data_source', 'osm');
                    setFetchError(null);
                  }}
                  className="px-3.5 py-2 rounded-xl text-[10px] font-black bg-indigo-950 border border-indigo-800 text-indigo-300 dark:bg-indigo-900/40 dark:text-white cursor-pointer hover:bg-indigo-900 transition-colors"
                >
                  🌍 切换为 OSM 模式
                </button>
              </div>
            </div>
          )}

          {/* General Fetch Error Overlay (Key error, Network error) */}
          {fetchError && !isLoading && !fetchError.includes("OutOfBounds") && (
            <div className="absolute inset-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center gap-4">
              <span className="text-3xl">⚠️</span>
              <div>
                <p className="font-black text-xs text-red-600 dark:text-red-400">
                  商铺数据加载失败
                </p>
                <p className="text-[10px] text-neutral-600 dark:text-indigo-300/80 mt-2 max-w-xs mx-auto leading-relaxed">
                  {fetchError}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setRawShops([]);
                    setUserLocation({ ...userLocation });
                  }}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black text-white cursor-pointer ${
                    isMatcha ? 'bg-emerald-500' : isBoba ? 'bg-rose-500' : isCoffee ? 'bg-amber-600' : 'bg-fuchsia-500'
                  }`}
                >
                  重试一次
                </button>
                <button
                  onClick={() => {
                    setDataSource('mock');
                    localStorage.setItem('compass_data_source', 'mock');
                    setFetchError(null);
                  }}
                  className="px-3 py-1.5 rounded-xl text-[10px] font-black bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 cursor-pointer"
                >
                  切换回离线模式
                </button>
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {activeTab === 'compass' && (
              <motion.div
                key="tab-compass"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="w-full"
              >
                <CompassView
                  mode={mode}
                  userHeading={userHeading}
                  setUserHeading={setUserHeading}
                  selectedShop={activeSelectedShop}
                  isLocked={isLocked}
                  setIsLocked={setIsLocked}
                  sensorStatus={sensorStatus}
                  requestDeviceOrientation={requestDeviceOrientation}
                  isInIframe={isInIframe}
                />
              </motion.div>
            )}

            {activeTab === 'radar' && (
              <motion.div
                key="tab-radar"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="w-full"
              >
                <Radar
                  mode={mode}
                  shops={activeShops}
                  selectedShop={activeSelectedShop}
                  setSelectedShop={(shop) => {
                    setSelectedShop(shop);
                    setIsLocked(true);
                  }}
                  userHeading={userHeading}
                  exploreRadius={exploreRadius}
                />
              </motion.div>
            )}

            {activeTab === 'map' && (
              <motion.div
                key="tab-map"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="w-full h-full"
              >
                <MapContainer
                  mode={mode}
                  userLocation={userLocation}
                  setUserLocation={setUserLocation}
                  shops={activeShops}
                  selectedShop={activeSelectedShop}
                  setSelectedShop={(shop) => {
                    setSelectedShop(shop);
                    setIsLocked(true);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3.8. Range & Display Limit Controller */}
        <div className={`p-4 rounded-3xl border transition-all duration-300 ${
          isMatcha
            ? 'bg-white/90 backdrop-blur-md border-emerald-100 text-emerald-950 shadow-xs'
            : isBoba 
              ? 'bg-white/90 backdrop-blur-md border-rose-100 text-rose-950 shadow-xs'
              : isCoffee
                ? 'bg-white/90 backdrop-blur-md border-amber-100 text-amber-950 shadow-xs'
                : 'bg-slate-950/80 backdrop-blur-md border-indigo-950 text-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.4)]'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Radius Control */}
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-center">
                <span className={`text-xs font-black tracking-wide ${
                  isMatcha ? 'text-emerald-900' : isBoba ? 'text-rose-950' : isCoffee ? 'text-amber-950' : 'text-indigo-300'
                }`}>
                  📡 探索范围半径
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  isMatcha ? 'bg-emerald-50 text-emerald-700' : isBoba ? 'bg-rose-50 text-rose-800' : isCoffee ? 'bg-amber-50 text-amber-800' : 'bg-indigo-950 border border-indigo-800 text-indigo-300'
                }`}>
                  {exploreRadius >= 1000 ? `${exploreRadius / 1000} km` : `${exploreRadius} m`}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[1000, 3000, 5000, 10000].map((r) => (
                  <button
                    key={r}
                    onClick={() => setExploreRadius(r)}
                    className={`py-2 rounded-xl text-[10px] font-black cursor-pointer border transition-all hover:scale-102 active:scale-98 ${
                      exploreRadius === r
                        ? isMatcha
                          ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs shadow-emerald-200'
                          : isBoba
                            ? 'bg-rose-500 border-rose-500 text-white shadow-xs shadow-rose-200'
                            : isCoffee
                              ? 'bg-amber-600 border-amber-600 text-white shadow-xs shadow-amber-200'
                              : 'bg-fuchsia-500 border-fuchsia-500 text-white shadow-[0_0_8px_rgba(217,70,239,0.4)]'
                        : isMatcha
                          ? 'bg-emerald-50/30 border-emerald-100/60 hover:bg-emerald-50 text-emerald-800'
                          : isBoba
                            ? 'bg-rose-50/30 border-rose-100/60 hover:bg-rose-50 text-rose-800'
                            : isCoffee
                              ? 'bg-amber-50/40 border-amber-100/60 hover:bg-amber-50 text-amber-850'
                              : 'bg-indigo-950/30 border-indigo-900/60 text-indigo-300 hover:bg-indigo-950'
                    }`}
                  >
                    {r >= 1000 ? `${r / 1000}km` : `${r}m`}
                  </button>
                ))}
              </div>
            </div>

            {/* Shop limit Control */}
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-center">
                <span className={`text-xs font-black tracking-wide ${
                  isMatcha ? 'text-emerald-900' : isBoba ? 'text-rose-950' : isCoffee ? 'text-amber-955 text-amber-950' : 'text-indigo-300'
                }`}>
                  🎯 显示商铺上限
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  isMatcha ? 'bg-emerald-50 text-emerald-700' : isBoba ? 'bg-rose-50 text-rose-800' : isCoffee ? 'bg-amber-50 text-amber-800' : 'bg-indigo-950 border border-indigo-800 text-indigo-300'
                }`}>
                  {maxShopsCount === 100 ? '不限' : `最近 ${maxShopsCount} 家`}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[15, 30, 50, 100].map((c) => (
                  <button
                    key={c}
                    onClick={() => setMaxShopsCount(c)}
                    className={`py-2 rounded-xl text-[10px] font-black cursor-pointer border transition-all hover:scale-102 active:scale-98 ${
                      maxShopsCount === c
                        ? isMatcha
                          ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs shadow-emerald-200'
                          : isBoba
                            ? 'bg-rose-500 border-rose-500 text-white shadow-xs shadow-rose-200'
                            : isCoffee
                              ? 'bg-amber-600 border-amber-600 text-white shadow-xs shadow-amber-200'
                              : 'bg-fuchsia-500 border-fuchsia-500 text-white shadow-[0_0_8px_rgba(217,70,239,0.4)]'
                        : isMatcha
                          ? 'bg-emerald-50/30 border-emerald-100/60 hover:bg-emerald-50 text-emerald-800'
                          : isBoba
                            ? 'bg-rose-50/30 border-rose-100/60 hover:bg-rose-50 text-rose-800'
                            : isCoffee
                              ? 'bg-amber-50/40 border-amber-100/60 hover:bg-amber-50 text-amber-850'
                              : 'bg-indigo-950/30 border-indigo-900/60 text-indigo-300 hover:bg-indigo-950'
                    }`}
                  >
                    {c === 100 ? '不限' : `${c}家`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4. WALKING SIMULATOR CONTROLLER */}
        <div className={`p-4 rounded-3xl border transition-all duration-300 ${
          isMatcha
            ? 'bg-white border-emerald-100 shadow-xs'
            : isBoba 
              ? 'bg-white border-rose-100 shadow-xs'
              : isCoffee
                ? 'bg-white border-amber-100 shadow-xs'
                : 'bg-slate-950 border-indigo-950'
        }`}>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowSimulator(!showSimulator)}
              className={`text-xs font-black tracking-wide flex items-center gap-1.5 uppercase cursor-pointer hover:opacity-80 w-full text-left justify-between ${
                isMatcha
                  ? 'text-emerald-950'
                  : isBoba 
                    ? 'text-rose-950'
                    : isCoffee
                      ? 'text-amber-950'
                      : 'text-indigo-300'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-orange-400" />
                <span>🚶 模拟运动与位置控制器</span>
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-md font-extrabold ${
                isMatcha
                  ? 'bg-emerald-50 text-emerald-800'
                  : isBoba 
                    ? 'bg-rose-50 text-rose-800'
                    : isCoffee
                      ? 'bg-amber-50 text-amber-800'
                      : 'bg-indigo-950 border border-indigo-800 text-indigo-300'
              }`}>
                {showSimulator ? '收起 ▲' : '点击展开 ⚙️'}
              </span>
            </button>
          </div>

          {showSimulator && (
            <div className="mt-4 space-y-4 pt-4 border-t border-dashed border-neutral-100 dark:border-indigo-950">
              {showSimulatorTip && (
                <p className={`text-[11px] p-2.5 rounded-xl border border-dashed transition-all relative ${
                  isMatcha
                    ? 'bg-emerald-50/50 border-emerald-100 text-emerald-950'
                    : isBoba 
                      ? 'bg-orange-50/50 border-orange-100 text-orange-950' 
                      : isCoffee
                        ? 'bg-amber-50/50 border-amber-100 text-amber-955 text-amber-950'
                        : 'bg-indigo-950/30 border-indigo-900 text-indigo-300/80'
                }`}>
                  <strong>使用提示：</strong>本模拟器允许您在电脑端测试。
                  调整上方的“面朝方向”滑块改变视野，点击“前进”以该方向行进，观察雷达、地图和指针的实时变化！
                  <button 
                    onClick={() => setShowSimulatorTip(false)}
                    className="absolute top-1 right-2 text-[10px] font-bold opacity-60 hover:opacity-100 cursor-pointer"
                  >
                    不再提示
                  </button>
                </p>
              )}

              {/* Preset City Teleportations */}
              <div>
                <span className="text-[10px] opacity-60 block mb-2">城市热门地标一键穿梭：</span>
                <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
                  {PRESET_LOCATIONS.map((preset) => {
                    const isCurrentCity = Math.abs(userLocation.lat - preset.lat) < 0.005;
                    return (
                      <button
                        key={preset.name}
                        onClick={() => handlePresetSelect(preset)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer border transition-all hover:scale-102 ${
                          isCurrentCity
                            ? isMatcha
                              ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
                              : isBoba
                                ? 'bg-rose-500 border-rose-500 text-white shadow-xs shadow-rose-200'
                                : isCoffee
                                  ? 'bg-amber-600 border-amber-600 text-white shadow-xs shadow-amber-200'
                                  : 'bg-fuchsia-500 border-fuchsia-500 text-white'
                            : isMatcha
                              ? 'bg-emerald-50/40 border-emerald-100 text-emerald-850 hover:bg-emerald-50'
                              : isBoba
                                ? 'bg-rose-50/40 border-rose-100 text-rose-850 hover:bg-rose-50'
                                : isCoffee
                                  ? 'bg-amber-50/40 border-amber-100 text-amber-850 hover:bg-amber-50'
                                  : 'bg-indigo-950/50 border-indigo-900/60 text-indigo-300 hover:bg-indigo-950'
                        }`}
                      >
                        📍 {preset.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Simulator Actions: Walking forward */}
              <div className="grid grid-cols-2 gap-3 text-xs font-black">
                <button
                  onClick={() => handleSimulateWalk(50)}
                  className={`py-3 px-4 rounded-2xl cursor-pointer border transition-all hover:scale-102 flex items-center justify-center gap-2 active:scale-98 ${
                    isMatcha
                      ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-900'
                      : isBoba
                        ? 'bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-900'
                        : isCoffee
                          ? 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900'
                          : 'bg-indigo-950 border-indigo-800 text-indigo-200 hover:bg-indigo-900'
                  }`}
                >
                  <ChevronsUp className="w-4 h-4 animate-bounce" />
                  <span>前进 50米</span>
                </button>
                <button
                  onClick={() => handleSimulateWalk(200)}
                  className={`py-3 px-4 rounded-2xl cursor-pointer border transition-all hover:scale-102 flex items-center justify-center gap-2 active:scale-98 ${
                    isMatcha
                      ? 'bg-emerald-500 hover:bg-emerald-600 border-emerald-500 text-white shadow-xs'
                      : isBoba
                        ? 'bg-rose-500 hover:bg-rose-600 border-rose-500 text-white'
                        : isCoffee
                          ? 'bg-amber-600 hover:bg-amber-700 border-amber-600 text-white shadow-xs shadow-amber-200'
                          : 'bg-fuchsia-500 hover:bg-fuchsia-600 border-fuchsia-500 text-white'
                  }`}
                >
                  <ChevronsUp className="w-4 h-4 animate-bounce" style={{ animationDuration: '0.8s' }} />
                  <span>大步跨 200米</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 5. SHOP LIST */}
        <div className={`p-4 md:p-6 rounded-3xl border transition-colors ${
          isMatcha
            ? 'bg-white border-emerald-100 shadow-xs'
            : isBoba 
              ? 'bg-white border-rose-100 shadow-xs'
              : isCoffee
                ? 'bg-white border-amber-100 shadow-xs'
                : 'bg-slate-950 border-indigo-950'
        }`}>
          <ShopList
            mode={mode}
            shops={activeShops}
            selectedShop={activeSelectedShop}
            setSelectedShop={(shop) => {
              if (activeSelectedShop && shop && activeSelectedShop.id === shop.id && isLocked) {
                setIsLocked(false);
                setSelectedShop(null);
              } else {
                setSelectedShop(shop);
                setIsLocked(true);
              }
            }}
            setActiveTab={setActiveTab}
          />
        </div>
      </main>

      {/* Footer info & Credits */}
      <footer className={`pt-6 pb-[calc(env(safe-area-inset-bottom,0px)+24px)] border-t text-center text-xs transition-colors ${
        isMatcha
          ? 'bg-emerald-50/30 border-emerald-100/50 text-emerald-800/50'
          : isBoba 
            ? 'bg-rose-50/30 border-rose-100/50 text-rose-800/50' 
            : isCoffee
              ? 'bg-amber-50/30 border-amber-100/50 text-amber-800/50'
              : 'bg-slate-950 border-indigo-950/40 text-indigo-300/30'
      }`}>
        <p className="font-extrabold tracking-wide uppercase">
          {isMatcha ? '🍵 寻味指南针' : isBoba ? '🧋 寻味指南针' : isCoffee ? '☕ 寻味指南针' : '🍹 寻味指南针'}
        </p>
        <p className="mt-1 opacity-75">利用手机陀螺仪及 GPS 地理围栏实现寻店指向</p>
        <p className="mt-2 text-[10px] opacity-50">支持静态部署 Github Pages PWA 应用</p>
      </footer>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className={`relative z-10 w-full max-w-sm p-6 rounded-3xl border shadow-2xl overflow-hidden transition-all duration-300 ${
                isMatcha
                  ? 'bg-white/95 border-emerald-100 text-emerald-950 shadow-emerald-950/10'
                  : isBoba
                    ? 'bg-white/95 border-rose-100 text-rose-950 shadow-rose-950/10'
                    : isCoffee
                      ? 'bg-white/95 border-amber-100 text-amber-955 text-amber-950 shadow-amber-950/10'
                      : 'bg-slate-900/95 border-indigo-950 text-slate-100 shadow-black/50'
              }`}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowSettings(false)}
                className={`absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                  isBoba || isMatcha || isCoffee ? 'text-neutral-500' : 'text-slate-400'
                }`}
              >
                <X className="w-4 h-4" />
              </button>

              <h2 className="text-sm font-black flex items-center gap-1.5 mb-4">
                <Settings className="w-4.5 h-4.5" />
                <span>罗盘数据源配置</span>
              </h2>

              <div className="space-y-4">
                {/* Data Source Selector */}
                <div>
                  <label className="text-[10px] font-bold block mb-2 opacity-80 uppercase tracking-wider">🗺️ 选择数据来源</label>
                  <div className="space-y-2">
                    {[
                      { id: 'mock', name: '🤖 离线模式（仅支持部分地区）', desc: '免 Key 免网。支持已录入的真实城市（如北京/成都/广深/厦汕/哈尔滨）。' },
                      { id: 'osm', name: '🌍 OSM 模式', desc: '免 Key 真实数据。支持全球，已启用精细化 POI 类别清洗过滤。' },
                      { id: 'amap', name: '🗺️ 高德 API 模式', desc: '中国大陆高精度真实数据首选。需配置个人的 Web 服务 Key。' }
                    ].map((src) => {
                      const isSelected = tempDataSource === src.id;
                      return (
                        <div
                          key={src.id}
                          onClick={() => setTempDataSource(src.id as any)}
                          className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                            isSelected
                              ? isMatcha
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                                : isBoba
                                  ? 'bg-rose-50 border-rose-500 text-rose-950 font-bold'
                                  : isCoffee
                                    ? 'bg-amber-50 border-amber-500 text-amber-955 text-amber-950 font-bold'
                                    : 'bg-indigo-950 border-fuchsia-500 text-white font-bold shadow-[0_0_8px_rgba(217,70,239,0.3)]'
                              : isBoba || isMatcha || isCoffee
                                ? 'bg-neutral-50/50 border-neutral-200/60 hover:bg-neutral-50 text-neutral-800'
                                : 'bg-slate-950/40 border-indigo-950/60 hover:bg-indigo-900/20 text-slate-300'
                          }`}
                        >
                          <div className="text-[11px] font-black">{src.name}</div>
                          <div className="text-[9px] opacity-70 mt-1 leading-normal">{src.desc}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Amap Key Input */}
                {tempDataSource === 'amap' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden space-y-2"
                  >
                    <label className="text-[10px] font-bold block opacity-80 uppercase tracking-wider">🔑 高德 Web 服务 API Key</label>
                    <input
                      type="password"
                      placeholder="请贴入您的 32 位高德 Key"
                      value={tempAmapKey}
                      onChange={(e) => setTempAmapKey(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 ${
                        isMatcha
                          ? 'bg-white border-neutral-300 text-neutral-900 focus:border-emerald-500 focus:ring-emerald-500'
                          : isBoba
                            ? 'bg-white border-neutral-300 text-neutral-900 focus:border-rose-500 focus:ring-rose-500'
                            : isCoffee
                              ? 'bg-white border-neutral-300 text-neutral-900 focus:border-amber-600 focus:ring-amber-600'
                              : 'bg-slate-950 border-indigo-950 text-white focus:border-fuchsia-500 focus:ring-fuchsia-500'
                      }`}
                    />
                    <p className="text-[8px] opacity-60 leading-normal">
                      * 注意：必须为高德控制台申请的<strong>“Web 服务”</strong>类型 Key（非 JS Web端 Key），否则高德周边搜索服务会鉴权报错。可前往{' '}
                      <a
                        href="https://lbs.amap.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="underline text-sky-500 hover:text-sky-400 cursor-pointer"
                      >
                        高德开放平台
                      </a>{' '}
                      免费申请获取。
                    </p>
                  </motion.div>
                )}

                {/* Save Button */}
                <button
                  onClick={handleSaveSettings}
                  className={`w-full py-2.5 rounded-2xl text-xs font-black cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] ${
                    isMatcha
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow shadow-emerald-200'
                      : isBoba
                        ? 'bg-rose-500 hover:bg-rose-600 text-white shadow shadow-rose-200'
                        : isCoffee
                          ? 'bg-amber-600 hover:bg-amber-700 text-white shadow shadow-amber-200'
                          : 'bg-gradient-to-r from-fuchsia-500 to-violet-600 hover:from-fuchsia-600 hover:to-violet-750 text-white shadow-[0_0_12px_rgba(217,70,239,0.3)]'
                  }`}
                >
                  保存并重新加载
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
