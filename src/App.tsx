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
  HelpCircle
} from 'lucide-react';
import { Coordinate, Shop, CompassMode, PresetLocation } from './types';
import { 
  PRESET_LOCATIONS, 
  generateLocalShops, 
  getDistance, 
  getBearing, 
  destinationPoint 
} from './data/mockShops';

import CompassView from './components/Compass';
import Radar from './components/Radar';
import MapContainer from './components/MapContainer';
import ShopList from './components/ShopList';

export default function App() {
  // 1. Core State
  const [mode, setMode] = useState<CompassMode>('milktea');
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

  // Check if running inside an iframe (like AI Studio preview frame)
  const isInIframe = useMemo(() => {
    try {
      return typeof window !== 'undefined' && window.self !== window.top;
    } catch (e) {
      return true;
    }
  }, []);

  // 2. Generate local shops dynamically based on current user coordinates
  const rawShops = useMemo(() => {
    return generateLocalShops(userLocation.lat, userLocation.lng);
  }, [userLocation.lat, userLocation.lng]);

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

  // 3.5. Dynamically calculate the closest shop in the current facing direction
  const facingShop = useMemo(() => {
    const activeShops = shops.filter((s) => s.type === mode);
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
  }, [shops, mode, userHeading]);

  // The active shop targets (manual lock wins, otherwise dynamic facing wins)
  const activeSelectedShop = useMemo(() => {
    if (isLocked && selectedShop) {
      const exists = shops.some((s) => s.id === selectedShop.id && s.type === mode);
      if (exists) {
        return shops.find((s) => s.id === selectedShop.id) || selectedShop;
      }
    }
    return facingShop;
  }, [isLocked, selectedShop, facingShop, shops, mode]);

  // 4. Reset manual lock if the locked shop is no longer available in the current mode
  useEffect(() => {
    if (selectedShop) {
      const exists = shops.some((s) => s.id === selectedShop.id && s.type === mode);
      if (!exists) {
        setSelectedShop(null);
        setIsLocked(false);
      }
    }
  }, [mode, shops, selectedShop]);

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

  const isBoba = mode === 'milktea';

  return (
    <div className={`min-h-screen pb-[env(safe-area-inset-bottom,0px)] pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)] transition-all duration-700 font-sans flex flex-col justify-between ${
      isBoba 
        ? 'bg-gradient-to-b from-rose-50/70 via-orange-50/40 to-white text-rose-950' 
        : 'bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-slate-100'
    }`}>
      
      {/* Dynamic Header */}
      <header className={`px-4 pt-[calc(env(safe-area-inset-top,0px)+16px)] pb-4 md:py-6 border-b flex items-center justify-between sticky top-0 z-50 backdrop-blur-md transition-all ${
        isBoba 
          ? 'bg-white/85 border-rose-100/60' 
          : 'bg-slate-950/85 border-indigo-950/60 shadow-[0_4px_10px_rgba(0,0,0,0.4)]'
      }`}>
        <div className="flex items-center gap-2">
          <div className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${
            isBoba 
              ? 'bg-rose-500 text-white shadow shadow-rose-200' 
              : 'bg-fuchsia-500 text-white shadow-[0_0_8px_rgba(217,70,239,0.5)]'
          }`}>
            <CompassIcon className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-black tracking-tight leading-none">
              {isBoba ? '奶茶/酒鬼指南针' : '酒鬼/奶茶指南针'}
            </h1>
            <p className={`text-[10px] mt-0.5 ${isBoba ? 'text-rose-700/60' : 'text-indigo-400'}`}>
              GPS 定位与方向雷达自动寻找最近好店
            </p>
          </div>
        </div>

        {/* 1. Mode Switch Button */}
        <button
          onClick={() => setMode(isBoba ? 'bar' : 'milktea')}
          className={`px-4 py-2 rounded-2xl border text-xs font-black tracking-wide flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95 ${
            isBoba 
              ? 'bg-gradient-to-r from-violet-950 to-indigo-900 border-indigo-950 text-fuchsia-300 shadow shadow-violet-200/20' 
              : 'bg-gradient-to-r from-rose-100 to-orange-100 border-rose-200 text-rose-700 shadow shadow-rose-100/10'
          }`}
        >
          {isBoba ? (
            <>
              <Beer className="w-4 h-4 text-fuchsia-400 animate-bounce" />
              <span>切换酒鬼模式</span>
            </>
          ) : (
            <>
              <Coffee className="w-4 h-4 text-rose-500 animate-bounce" />
              <span>切换奶茶模式</span>
            </>
          )}
        </button>
      </header>

      {/* Main Core Container */}
      <main className="max-w-2xl w-full mx-auto px-4 py-6 flex-1 space-y-6">
        
        {/* Dynamic Mode Heading Banner */}
        <div className="text-center md:py-2">
          <AnimatePresence mode="wait">
            {isBoba ? (
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
        <div className={`p-1.5 rounded-2xl grid grid-cols-3 gap-1 border ${
          isBoba 
            ? 'bg-rose-50/50 border-rose-100/60' 
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
                    ? isBoba
                      ? 'bg-white border border-rose-100 text-rose-950 shadow-xs'
                      : 'bg-indigo-950 border border-indigo-800 text-white shadow-[0_2px_12px_rgba(139,92,246,0.15)]'
                    : isBoba
                      ? 'text-rose-800/60 hover:text-rose-900'
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
        <div className={`p-2 rounded-3xl border min-h-96 flex items-center justify-center overflow-hidden transition-colors ${
          isBoba 
            ? 'bg-linear-to-b from-white/90 to-rose-50/10 border-rose-100' 
            : 'bg-linear-to-b from-slate-900/90 to-slate-950/40 border-indigo-950/80'
        }`}>
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
                  shops={shops.filter((s) => s.type === mode)}
                  selectedShop={activeSelectedShop}
                  setSelectedShop={(shop) => {
                    setSelectedShop(shop);
                    setIsLocked(true);
                  }}
                  userHeading={userHeading}
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
                  shops={shops.filter((s) => s.type === mode)}
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

        {/* 4. WALKING SIMULATOR CONTROLLER */}
        <div className={`p-4 rounded-3xl border transition-all duration-300 ${
          isBoba 
            ? 'bg-white border-rose-100 shadow-xs' 
            : 'bg-slate-950 border-indigo-950'
        }`}>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowSimulator(!showSimulator)}
              className={`text-xs font-black tracking-wide flex items-center gap-1.5 uppercase cursor-pointer hover:opacity-80 w-full text-left justify-between ${
                isBoba ? 'text-rose-950' : 'text-indigo-300'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-orange-400" />
                <span>🚶 模拟运动与位置控制器</span>
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-md font-extrabold ${
                isBoba ? 'bg-rose-50 text-rose-800' : 'bg-indigo-950 border border-indigo-800 text-indigo-300'
              }`}>
                {showSimulator ? '收起 ▲' : '点击展开 ⚙️'}
              </span>
            </button>
          </div>

          {showSimulator && (
            <div className="mt-4 space-y-4 pt-4 border-t border-dashed border-neutral-100 dark:border-indigo-950">
              {showSimulatorTip && (
                <p className={`text-[11px] p-2.5 rounded-xl border border-dashed transition-all relative ${
                  isBoba 
                    ? 'bg-orange-50/50 border-orange-100 text-orange-950' 
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
                            ? isBoba
                              ? 'bg-rose-500 border-rose-500 text-white'
                              : 'bg-fuchsia-500 border-fuchsia-500 text-white'
                            : isBoba
                              ? 'bg-rose-50/40 border-rose-100 text-rose-800 hover:bg-rose-50'
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
                    isBoba
                      ? 'bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-900'
                      : 'bg-indigo-950 border-indigo-800 text-indigo-200 hover:bg-indigo-900'
                  }`}
                >
                  <ChevronsUp className="w-4 h-4 animate-bounce" />
                  <span>前进 50米</span>
                </button>
                <button
                  onClick={() => handleSimulateWalk(200)}
                  className={`py-3 px-4 rounded-2xl cursor-pointer border transition-all hover:scale-102 flex items-center justify-center gap-2 active:scale-98 ${
                    isBoba
                      ? 'bg-rose-500 hover:bg-rose-600 border-rose-500 text-white'
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
          isBoba 
            ? 'bg-white border-rose-100 shadow-xs' 
            : 'bg-slate-950 border-indigo-950'
        }`}>
          <ShopList
            mode={mode}
            shops={shops.filter((s) => s.type === mode)}
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
        isBoba 
          ? 'bg-rose-50/30 border-rose-100/50 text-rose-800/50' 
          : 'bg-slate-950 border-indigo-950/40 text-indigo-300/30'
      }`}>
        <p className="font-extrabold tracking-wide uppercase">🧋 奶茶与酒鬼指南针 🍹</p>
        <p className="mt-1 opacity-75">利用手机陀螺仪及 GPS 地理围栏实现寻店指向</p>
        <p className="mt-2 text-[10px] opacity-50">支持静态部署 Github Pages PWA 应用</p>
      </footer>
    </div>
  );
}
