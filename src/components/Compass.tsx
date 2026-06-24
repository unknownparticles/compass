import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Navigation, ArrowUp, RefreshCw, Beer, Coffee, MapPin, AlertCircle, ExternalLink, HelpCircle } from 'lucide-react';
import { Shop, CompassMode } from '../types';

interface CompassProps {
  mode: CompassMode;
  userHeading: number;
  setUserHeading: (heading: number) => void;
  selectedShop: Shop | null;
  isLocked: boolean;
  setIsLocked: (locked: boolean) => void;
  sensorStatus: 'active' | 'unavailable' | 'loading';
  requestDeviceOrientation: () => void;
  isInIframe: boolean;
}

export default function CompassView({
  mode,
  userHeading,
  setUserHeading,
  selectedShop,
  isLocked,
  setIsLocked,
  sensorStatus,
  requestDeviceOrientation,
  isInIframe
}: CompassProps) {
  const [showDiagnostic, setShowDiagnostic] = useState<boolean>(true);

  // Shortest path angle transition logic
  const prevHeadingRef = useRef<number>(0);
  const [animatedHeading, setAnimatedHeading] = useState<number>(0);

  const prevRelativeAngleRef = useRef<number>(0);
  const [animatedRelativeAngle, setAnimatedRelativeAngle] = useState<number>(0);

  const targetBearing = selectedShop ? selectedShop.bearing : 0;
  const relativeAngle = selectedShop ? (targetBearing - userHeading + 360) % 360 : 0;

  // 1. Shortest path for dial rotation
  useEffect(() => {
    const prev = prevHeadingRef.current;
    const curr = -userHeading;
    let diff = curr - prev;
    diff = ((diff + 180) % 360 + 360) % 360 - 180;
    const target = prev + diff;
    prevHeadingRef.current = target;
    setAnimatedHeading(target);
  }, [userHeading]);

  // 2. Shortest path for pointer rotation
  useEffect(() => {
    const prev = prevRelativeAngleRef.current;
    const curr = relativeAngle;
    let diff = curr - prev;
    diff = ((diff + 180) % 360 + 360) % 360 - 180;
    const target = prev + diff;
    prevRelativeAngleRef.current = target;
    setAnimatedRelativeAngle(target);
  }, [relativeAngle]);

  const getCardinalDirection = (deg: number) => {
    const directions = ['北 (N)', '东北 (NE)', '东 (E)', '东南 (SE)', '南 (S)', '西南 (SW)', '西 (W)', '西北 (NW)'];
    const idx = Math.round(deg / 45) % 8;
    return directions[idx];
  };

  const setFacing = (deg: number) => {
    setUserHeading(deg);
  };

  const isBoba = mode === 'milktea';
  const isMatcha = mode === 'matcha';
  const isCoffee = mode === 'coffee';
  const isLight = isBoba || isMatcha || isCoffee;

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto px-4 py-6">
      
      {/* Sensor Status Banner */}
      <div className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl mb-4 text-xs font-medium border transition-colors ${
        sensorStatus === 'active'
          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
          : isMatcha
            ? 'bg-emerald-50/80 border-emerald-100 text-emerald-700'
            : isBoba 
              ? 'bg-rose-50/80 border-rose-100 text-rose-700' 
              : isCoffee
                ? 'bg-amber-50/80 border-amber-100 text-amber-800'
                : 'bg-indigo-950/40 border-indigo-900/60 text-indigo-300'
      }`}>
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${
            sensorStatus === 'active' 
              ? 'bg-emerald-500 animate-pulse' 
              : 'bg-amber-500 animate-pulse'
          }`} />
          <span>手机陀螺仪：{sensorStatus === 'active' ? '已连接 (实时指向)' : '不可用 (虚拟模拟)'}</span>
        </div>
        {sensorStatus !== 'active' ? (
          <button 
            id="auth-gyro"
            onClick={requestDeviceOrientation}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer border transition-all hover:scale-105 active:scale-95 ${
              isMatcha
                ? 'bg-emerald-100 hover:bg-emerald-200 border-emerald-200 text-emerald-800'
                : isBoba 
                  ? 'bg-rose-100 hover:bg-rose-200 border-rose-200 text-rose-800' 
                  : isCoffee
                    ? 'bg-amber-100 hover:bg-amber-200 border-amber-200 text-amber-800'
                    : 'bg-indigo-800 hover:bg-indigo-700 border-indigo-700 text-indigo-100'
            }`}
          >
            <RefreshCw className="w-3 h-3" />
            <span>开启真机指向</span>
          </button>
        ) : (
          <span className="opacity-70 text-[11px]">真机动态感应中</span>
        )}
      </div>

      {/* Sensor Diagnostic */}
      {sensorStatus !== 'active' && showDiagnostic && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`w-full p-4 rounded-2xl border text-left mb-6 text-xs relative ${
            isMatcha
              ? 'bg-emerald-50/40 border-emerald-100/60 text-emerald-950'
              : isBoba 
                ? 'bg-orange-50/60 border-orange-100/80 text-rose-950' 
                : isCoffee
                  ? 'bg-amber-50/40 border-amber-100/60 text-amber-955 text-amber-950'
                  : 'bg-indigo-950/20 border-indigo-950 text-indigo-300'
          }`}
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
            <div className="space-y-1.5">
              <h4 className="font-extrabold flex items-center gap-1">
                <span>为什么我的手机陀螺仪不可用？</span>
              </h4>
              <p className="leading-relaxed opacity-90">
                {isInIframe ? (
                  <>⚠️ <strong>检测到当前在 AI Studio 框架中运行：</strong>由于安全规则，嵌套在 iFrame 内的网页被禁止读取重力加速度计与罗盘。</>
                ) : (
                  <>⚠️ <strong>传感器被拦截：</strong>移动端浏览器要求必须在<strong> HTTPS 安全连接</strong>下，且通过<strong>用户手动点击</strong>才能授权调用罗盘。</>
                )}
              </p>
              
              <div className="pt-1.5 border-t border-dashed border-current/10 space-y-1">
                <p className="font-bold">🛠️ 启用步骤：</p>
                <ol className="list-decimal list-inside space-y-1 pl-1 opacity-90">
                  {isInIframe && <li>点击屏幕右上角 <strong>“在新标签页中打开”</strong> 独立页面。</li>}
                  <li>使用手机自带浏览器扫码独立页面的 URL。</li>
                  <li>点击上方 <strong>【开启真机指向】</strong> 并允许权限，罗盘即可瞬间激活！</li>
                </ol>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Dial Area */}
      <div className="relative w-76 h-76 md:w-80 md:h-80 flex items-center justify-center select-none">
        
        {/* Backdrop Grid */}
        <AnimatePresence mode="wait">
          {isMatcha ? (
            <motion.div 
              key="matcha-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-full bg-linear-to-b from-emerald-50 to-teal-50/40 -z-10 border-4 border-emerald-100 shadow-inner"
            />
          ) : isBoba ? (
            <motion.div 
              key="boba-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-full bg-linear-to-b from-rose-50 to-orange-50/40 -z-10 border-4 border-rose-100 shadow-inner"
            />
          ) : isCoffee ? (
            <motion.div 
              key="coffee-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-full bg-linear-to-b from-amber-50 to-stone-50/40 -z-10 border-4 border-amber-100 shadow-inner"
            />
          ) : (
            <motion.div 
              key="bar-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-full bg-slate-950 -z-10 border-4 border-indigo-950 shadow-[inset_0_2px_12px_rgba(0,0,0,0.6)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0%,transparent_70%)]" />
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 1. Compass Plate */}
        <motion.div 
          className="absolute inset-2 rounded-full border-2 border-dashed flex items-center justify-center transition-all"
          style={{ 
            borderColor: isMatcha ? '#a7f3d0' : isBoba ? '#fecdd3' : isCoffee ? '#fcd34d' : '#312e81',
          }}
          animate={{ rotate: animatedHeading }}
          transition={{ type: 'spring', damping: 25, stiffness: 120 }}
        >
          {/* Cardinal markers (N, E, S, W) */}
          <div className="absolute top-4 font-black text-sm text-center flex flex-col items-center">
            <span className={isMatcha ? 'text-emerald-600 font-extrabold' : isBoba ? 'text-rose-500' : isCoffee ? 'text-amber-700 font-extrabold' : 'text-fuchsia-400 font-mono tracking-widest drop-shadow-[0_0_5px_rgba(232,121,249,0.5)]'}>N</span>
            <div className={`w-1 h-2 mt-0.5 rounded-full ${isMatcha ? 'bg-emerald-600' : isBoba ? 'bg-rose-500' : isCoffee ? 'bg-amber-700' : 'bg-fuchsia-400'}`} />
          </div>
          <div className="absolute right-4 font-black text-sm text-center flex flex-row-reverse items-center gap-1">
            <span className={isLight ? isMatcha ? 'text-emerald-600' : isBoba ? 'text-rose-455 text-rose-400' : 'text-amber-750 text-amber-700' : 'text-indigo-400 font-mono'}>E</span>
          </div>
          <div className="absolute bottom-4 font-black text-sm text-center flex flex-col-reverse items-center">
            <span className={isLight ? isMatcha ? 'text-emerald-600' : isBoba ? 'text-rose-400' : 'text-amber-700' : 'text-indigo-400 font-mono'}>S</span>
          </div>
          <div className="absolute left-4 font-black text-sm text-center flex items-center gap-1">
            <span className={isLight ? isMatcha ? 'text-emerald-600' : isBoba ? 'text-rose-400' : 'text-amber-700' : 'text-indigo-400 font-mono'}>W</span>
          </div>

          {/* Subcardinal ticks */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <div 
              key={deg} 
              className="absolute inset-0 flex items-start justify-center pointer-events-none"
              style={{ transform: `rotate(${deg}deg)` }}
            >
              {deg % 90 !== 0 && (
                <div className={`w-0.5 h-2 mt-1.5 rounded-full ${isMatcha ? 'bg-emerald-200' : isBoba ? 'bg-rose-200' : isCoffee ? 'bg-amber-200' : 'bg-indigo-900/60'}`} />
              )}
            </div>
          ))}
        </motion.div>

        {/* 2. Central Mode Avatar */}
        <div className={`absolute w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-all ${
          isMatcha
            ? 'bg-gradient-to-br from-emerald-100 to-teal-50 border-2 border-emerald-200 text-emerald-600'
            : isBoba 
              ? 'bg-gradient-to-br from-rose-100 to-orange-100 border-2 border-rose-200 text-rose-500' 
              : isCoffee
                ? 'bg-gradient-to-br from-amber-100 to-amber-50 border-2 border-amber-200 text-amber-705 text-amber-700'
                : 'bg-gradient-to-br from-indigo-950 via-slate-900 to-violet-950 border-2 border-indigo-500 text-fuchsia-400 shadow-[0_0_15px_rgba(139,92,246,0.3)]'
        }`}>
          {isMatcha ? (
            <span className="text-4xl animate-pulse select-none">🍵</span>
          ) : isBoba ? (
            <span className="text-4xl animate-pulse select-none">🧋</span>
          ) : isCoffee ? (
            <Coffee className="w-10 h-10 animate-bounce" style={{ animationDuration: '3s' }} />
          ) : (
            <Beer className="w-10 h-10 animate-pulse" style={{ animationDuration: '2s' }} />
          )}
        </div>

        {/* 3. Target Direction Arrow */}
        {selectedShop ? (
          <motion.div 
            className="absolute inset-0 flex items-start justify-center pointer-events-none"
            animate={{ rotate: animatedRelativeAngle }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          >
            <div className="relative flex flex-col items-center -top-6">
              <motion.div 
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className={`flex flex-col items-center justify-center p-2 rounded-xl shadow-md border pointer-events-auto cursor-help ${
                  isMatcha
                    ? 'bg-emerald-500 text-white border-emerald-400 shadow-xs'
                    : isBoba 
                      ? 'bg-rose-400 text-white border-rose-300' 
                      : isCoffee
                        ? 'bg-amber-600 text-white border-amber-500 shadow-xs'
                        : 'bg-fuchsia-500 text-white border-fuchsia-400 shadow-[0_0_10px_rgba(244,63,94,0.4)]'
                }`}
              >
                {isMatcha ? (
                  <span className="text-xs">🍵</span>
                ) : isBoba ? (
                  <span className="text-xs">🧋</span>
                ) : isCoffee ? (
                  <Coffee className="w-4 h-4" />
                ) : (
                  <Beer className="w-4 h-4" />
                )}
                <span className="text-[9px] font-extrabold mt-0.5 whitespace-nowrap px-0.5">
                  {selectedShop.distance}m
                </span>
              </motion.div>
              <div className={`w-1.5 h-16 rounded-full -mt-0.5 ${
                isMatcha
                  ? 'bg-gradient-to-b from-emerald-500 to-emerald-300'
                  : isBoba 
                    ? 'bg-gradient-to-b from-rose-500 to-rose-300' 
                    : isCoffee
                      ? 'bg-gradient-to-b from-amber-600 to-amber-300 shadow-xs'
                      : 'bg-gradient-to-b from-fuchsia-500 to-violet-700 shadow-[0_0_8px_rgba(217,70,239,0.5)]'
              }`} />
              <div className={`w-0 h-0 border-l-[6px] border-r-[6px] border-t-[10px] border-l-transparent border-r-transparent ${
                isMatcha ? 'border-t-emerald-300' : isBoba ? 'border-t-rose-300' : isCoffee ? 'border-t-amber-300' : 'border-t-violet-700'
              }`} />
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="absolute inset-0 flex items-start justify-center pointer-events-none"
            animate={{ rotate: 0 }}
            transition={{ type: 'spring' }}
          >
            <div className="relative flex flex-col items-center -top-3">
              <div className={`w-1 h-12 rounded-full ${
                isMatcha ? 'bg-emerald-300' : isBoba ? 'bg-rose-300' : isCoffee ? 'bg-amber-300' : 'bg-indigo-800'
              }`} />
              <ArrowUp className={`w-4 h-4 -mt-1 ${
                isMatcha ? 'text-emerald-400' : isBoba ? 'text-rose-400' : isCoffee ? 'text-amber-500' : 'text-indigo-600'
              }`} />
            </div>
          </motion.div>
        )}
      </div>

      {/* Target Lock Details Card */}
      <div className="w-full mt-6">
        <AnimatePresence mode="wait">
          {selectedShop ? (
            <motion.div
              key={selectedShop.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-3xl border w-full text-center relative overflow-hidden ${
                isMatcha
                  ? 'bg-linear-to-br from-emerald-50/90 to-teal-50/70 border-emerald-100 shadow-xs'
                  : isBoba 
                    ? 'bg-linear-to-br from-rose-50/90 to-orange-50/70 border-rose-100 shadow-xs' 
                    : isCoffee
                      ? 'bg-linear-to-br from-amber-50/90 to-amber-50/40 border-amber-100 shadow-xs'
                      : 'bg-slate-900/80 border-indigo-900/60 shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
              }`}
            >
              <button
                onClick={() => setIsLocked(!isLocked)}
                className={`absolute top-0 right-0 px-3 py-1.5 text-[10px] font-black rounded-bl-2xl tracking-wider uppercase cursor-pointer transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 ${
                  isLocked
                    ? isMatcha
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : isBoba
                        ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-xs'
                        : isCoffee
                          ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                          : 'bg-fuchsia-600 hover:bg-fuchsia-700 text-white'
                    : isMatcha
                      ? 'bg-emerald-500/90 hover:bg-emerald-600 text-white'
                      : isBoba
                        ? 'bg-orange-500/90 hover:bg-orange-600 text-white shadow-xs'
                        : isCoffee
                          ? 'bg-amber-500/90 hover:bg-amber-600 text-white shadow-xs'
                          : 'bg-indigo-600/90 hover:bg-indigo-700 text-white'
                }`}
                title={isLocked ? '点击切换为自动寻向' : '点击锁定当前店铺'}
              >
                {isLocked ? (
                  <>
                    <span>🔒 已锁定</span>
                    <span className="text-[8px] opacity-75 hidden xs:inline">(解锁)</span>
                  </>
                ) : (
                  <>
                    <span>📡 自动寻向</span>
                    <span className="text-[8px] opacity-75 hidden xs:inline">(锁定)</span>
                  </>
                )}
              </button>

              <div className="flex flex-col items-center gap-1">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  isMatcha
                    ? 'bg-emerald-100 text-emerald-700'
                    : isBoba 
                      ? 'bg-rose-100 text-rose-700' 
                      : isCoffee
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-indigo-950 border border-indigo-800 text-indigo-300'
                }`}>
                  最近的{isMatcha ? '抹茶好物' : isBoba ? '奶茶店' : isCoffee ? '咖啡馆' : '酒吧/酒馆'}
                </span>
                <h3 className={`text-lg font-black mt-1 ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                  {selectedShop.name}
                </h3>
                
                {/* Distance */}
                <div className="flex items-center gap-4 mt-2 mb-1">
                  <div className="flex flex-col items-center">
                    <span className={`text-xs ${isMatcha ? 'text-emerald-600' : isBoba ? 'text-rose-500' : isCoffee ? 'text-amber-700' : 'text-indigo-400'}`}>距离</span>
                    <span className={`text-xl font-black ${isMatcha ? 'text-emerald-800' : isBoba ? 'text-rose-900' : isCoffee ? 'text-amber-800' : 'text-fuchsia-400 font-mono'}`}>
                      {selectedShop.distance}米
                    </span>
                  </div>
                  <div className={`w-px h-8 ${isLight ? 'bg-neutral-200' : 'bg-indigo-900/40'}`} />
                  <div className="flex flex-col items-center">
                    <span className={`text-xs ${isMatcha ? 'text-emerald-600' : isBoba ? 'text-rose-500' : isCoffee ? 'text-amber-700' : 'text-indigo-400'}`}>绝对方位</span>
                    <span className={`text-xl font-black ${isMatcha ? 'text-emerald-800' : isBoba ? 'text-rose-900' : isCoffee ? 'text-amber-800' : 'text-fuchsia-400 font-mono'}`}>
                      {selectedShop.bearing}° {getCardinalDirection(selectedShop.bearing)}
                    </span>
                  </div>
                  <div className={`w-px h-8 ${isLight ? 'bg-neutral-200' : 'bg-indigo-900/40'}`} />
                  <div className="flex flex-col items-center">
                    <span className={`text-xs ${isMatcha ? 'text-emerald-600' : isBoba ? 'text-rose-500' : isCoffee ? 'text-amber-700' : 'text-indigo-400'}`}>相对夹角</span>
                    <span className={`text-xl font-black ${isMatcha ? 'text-emerald-800' : isBoba ? 'text-rose-900' : isCoffee ? 'text-amber-800' : 'text-fuchsia-400 font-mono'}`}>
                      {relativeAngle}°
                    </span>
                  </div>
                </div>

                <p className={`text-xs ${isMatcha ? 'text-emerald-800/80' : isBoba ? 'text-rose-700/80' : isCoffee ? 'text-amber-850/80' : 'text-indigo-300/80'} mt-1 flex items-center justify-center gap-1`}>
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    需要向 <strong>{getCardinalDirection(relativeAngle)}</strong> 步行约{' '}
                    <strong>{Math.ceil(selectedShop.distance / 80)} 分钟</strong>
                  </span>
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="no-target"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-5 rounded-3xl border text-center ${
                isLight 
                  ? 'bg-neutral-50/50 border-neutral-200/60 text-neutral-800' 
                  : 'bg-indigo-950/20 border-indigo-950 text-indigo-400'
              }`}
            >
              <Navigation className="w-6 h-6 mx-auto mb-2 opacity-50 animate-pulse" />
              <p className="text-sm font-bold">正在搜寻周边店铺...</p>
              <p className="text-xs mt-1 opacity-75">当前方向没有找到好店，请转动设备或在列表切换模式</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. Manual Rotator */}
      <div className={`w-full mt-6 p-4 rounded-3xl border ${
        isMatcha
          ? 'bg-white border-emerald-100 shadow-xs'
          : isBoba 
            ? 'bg-white border-rose-100 shadow-xs' 
            : isCoffee
              ? 'bg-white border-amber-100 shadow-xs'
              : 'bg-slate-950/80 border-indigo-950/80 shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-bold ${isMatcha ? 'text-emerald-900' : isBoba ? 'text-rose-900' : isCoffee ? 'text-amber-900' : 'text-indigo-300'}`}>
            📱 当前面朝方向 (Heading)
          </span>
          <span className={`text-xs font-mono font-bold ${isMatcha ? 'text-emerald-600 bg-emerald-50' : isBoba ? 'text-rose-600 bg-rose-50' : isCoffee ? 'text-amber-700 bg-amber-50' : 'text-fuchsia-400 bg-indigo-950/60'} px-2 py-0.5 rounded-lg border border-transparent`}>
            {userHeading}° {getCardinalDirection(userHeading)}
          </span>
        </div>

        <input 
          type="range"
          min="0"
          max="359"
          value={userHeading}
          onChange={(e) => setUserHeading(parseInt(e.target.value))}
          className={`w-full h-2 rounded-lg appearance-none cursor-pointer mb-4 transition-all focus:outline-none ${
            isMatcha
              ? 'bg-emerald-100 accent-emerald-500'
              : isBoba 
                ? 'bg-rose-100 accent-rose-500' 
                : isCoffee
                  ? 'bg-amber-100 accent-amber-600'
                  : 'bg-indigo-950 accent-fuchsia-500'
          }`}
        />

        <div className="grid grid-cols-4 gap-2 text-[11px] font-bold">
          {[
            { label: '北 (N) 0°', deg: 0 },
            { label: '东 (E) 90°', deg: 90 },
            { label: '南 (S) 180°', deg: 180 },
            { label: '西 (W) 270°', deg: 270 }
          ].map((preset) => (
            <button
              key={preset.deg}
              onClick={() => setFacing(preset.deg)}
              className={`py-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                userHeading === preset.deg 
                  ? isMatcha
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
                    : isBoba 
                      ? 'bg-rose-500 border-rose-500 text-white shadow-xs' 
                      : isCoffee
                        ? 'bg-amber-600 border-amber-600 text-white shadow-xs'
                        : 'bg-fuchsia-500 border-fuchsia-500 text-white'
                  : isMatcha
                    ? 'bg-emerald-50/50 border-emerald-100/60 hover:bg-emerald-50 text-emerald-750'
                    : isBoba 
                      ? 'bg-rose-50/50 border-rose-100/60 hover:bg-rose-50 text-rose-700' 
                      : isCoffee
                        ? 'bg-amber-50/50 border-amber-100/60 hover:bg-amber-50 text-amber-700'
                        : 'bg-indigo-950/40 border-indigo-900/40 hover:bg-indigo-900/40 text-indigo-300'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
