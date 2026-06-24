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

  // Formatting helper for heading
  const getCardinalDirection = (deg: number) => {
    const directions = ['北 (N)', '东北 (NE)', '东 (E)', '东南 (SE)', '南 (S)', '西南 (SW)', '西 (W)', '西北 (NW)'];
    const idx = Math.round(deg / 45) % 8;
    return directions[idx];
  };

  // Preset quick headings
  const setFacing = (deg: number) => {
    setUserHeading(deg);
  };

  const isBoba = mode === 'milktea';

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto px-4 py-6">
      
      {/* Sensor Status Banner */}
      <div className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl mb-4 text-xs font-medium border transition-colors ${
        sensorStatus === 'active'
          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
          : isBoba 
            ? 'bg-rose-50/80 border-rose-100 text-rose-700' 
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
              isBoba 
                ? 'bg-rose-100 hover:bg-rose-200 border-rose-200 text-rose-800' 
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

      {/* Sensor Diagnostic & Instruction Guide */}
      {sensorStatus !== 'active' && showDiagnostic && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`w-full p-4 rounded-2xl border text-left mb-6 text-xs relative ${
            isBoba 
              ? 'bg-orange-50/60 border-orange-100/80 text-rose-950' 
              : 'bg-indigo-950/20 border-indigo-950 text-indigo-300'
          }`}
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
            <div className="space-y-1.5">
              <h4 className="font-extrabold flex items-center gap-1">
                <span>为什么我的手机陀螺仪不可用？</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 text-[9px] font-black uppercase">
                  技术科普与修复
                </span>
              </h4>
              <p className="leading-relaxed opacity-90">
                {isInIframe ? (
                  <>
                    ⚠️ <strong>检测到当前在 AI Studio 框架中运行：</strong>由于浏览器的沙盒安全规则，嵌套在 iFrame 内的网页被绝对禁止读取重力加速度计与罗盘。
                  </>
                ) : (
                  <>
                    ⚠️ <strong>传感器被拦截：</strong>移动端浏览器（iOS Safari 与 Chrome）要求必须在<strong> HTTPS 安全连接</strong>下，且通过<strong>用户手动点击</strong>才能授权调用罗盘。
                  </>
                )}
              </p>
              
              <div className="pt-1.5 border-t border-dashed border-current/10 space-y-1">
                <p className="font-bold">🛠️ 完美修复并启用真机步骤：</p>
                <ol className="list-decimal list-inside space-y-1 pl-1 opacity-90">
                  {isInIframe && (
                    <li>
                      点击屏幕右上角 <strong>“在新标签页中打开 (Open in a new tab)”</strong> 独立页面。
                    </li>
                  )}
                  <li>使用手机微信或自带浏览器扫码独立页面的 URL。</li>
                  <li>
                    进入手机浏览器后，点击上方闪烁的 <strong>【开启真机指向】</strong> 按钮，并允许动作与方向权限，罗盘即可瞬间被激活！
                  </li>
                </ol>
              </div>
              
              <p className="text-[10px] opacity-75 italic mt-1.5">
                💡 电脑端或未开启时，您依然可以完美拖动下方的<b>“当前面朝方向”滑块</b>和使用<b>运动模拟器</b>进行完美的虚拟行走和雷达寻店测试！
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Dial Area */}
      <div className="relative w-76 h-76 md:w-80 md:h-80 flex items-center justify-center select-none">
        
        {/* Boba Bubbles or Cyber Grid Backdrop */}
        <AnimatePresence mode="wait">
          {isBoba ? (
            <motion.div 
              key="boba-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-full bg-linear-to-b from-rose-50 to-orange-50/40 -z-10 border-4 border-rose-100 shadow-inner"
            />
          ) : (
            <motion.div 
              key="bar-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-full bg-slate-950 -z-10 border-4 border-indigo-950 shadow-[inset_0_2px_12px_rgba(0,0,0,0.6)] overflow-hidden"
            >
              {/* Glowing radar line rotation for backdrop */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0%,transparent_70%)]" />
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 1. Compass Plate (Rotates counter-clockwise to heading: -userHeading) */}
        <motion.div 
          className="absolute inset-2 rounded-full border-2 border-dashed flex items-center justify-center transition-all"
          style={{ 
            borderColor: isBoba ? '#fecdd3' : '#312e81',
          }}
          animate={{ rotate: animatedHeading }}
          transition={{ type: 'spring', damping: 25, stiffness: 120 }}
        >
          {/* Cardinal markers (N, E, S, W) */}
          <div className="absolute top-4 font-black text-sm text-center flex flex-col items-center">
            <span className={isBoba ? 'text-rose-500' : 'text-fuchsia-400 font-mono tracking-widest drop-shadow-[0_0_5px_rgba(232,121,249,0.5)]'}>N</span>
            <div className={`w-1 h-2 mt-0.5 rounded-full ${isBoba ? 'bg-rose-500' : 'bg-fuchsia-400'}`} />
          </div>
          <div className="absolute right-4 font-black text-sm text-center flex flex-row-reverse items-center gap-1">
            <span className={isBoba ? 'text-rose-400' : 'text-indigo-400 font-mono'}>E</span>
          </div>
          <div className="absolute bottom-4 font-black text-sm text-center flex flex-col-reverse items-center">
            <span className={isBoba ? 'text-rose-400' : 'text-indigo-400 font-mono'}>S</span>
          </div>
          <div className="absolute left-4 font-black text-sm text-center flex items-center gap-1">
            <span className={isBoba ? 'text-rose-400' : 'text-indigo-400 font-mono'}>W</span>
          </div>

          {/* Subcardinal ticks and degrees */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <div 
              key={deg} 
              className="absolute inset-0 flex items-start justify-center pointer-events-none"
              style={{ transform: `rotate(${deg}deg)` }}
            >
              {deg % 90 !== 0 && (
                <div className={`w-0.5 h-2 mt-1.5 rounded-full ${isBoba ? 'bg-rose-200' : 'bg-indigo-900/60'}`} />
              )}
            </div>
          ))}
        </motion.div>

        {/* 2. Central Mode Avatar (Boba or Glass) */}
        <div className={`absolute w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-all ${
          isBoba 
            ? 'bg-gradient-to-br from-rose-100 to-orange-100 border-2 border-rose-200 text-rose-500' 
            : 'bg-gradient-to-br from-indigo-950 via-slate-900 to-violet-950 border-2 border-indigo-500 text-fuchsia-400 shadow-[0_0_15px_rgba(139,92,246,0.3)]'
        }`}>
          {isBoba ? (
            <Coffee className="w-10 h-10 animate-bounce" style={{ animationDuration: '3s' }} />
          ) : (
            <Beer className="w-10 h-10 animate-pulse" style={{ animationDuration: '2s' }} />
          )}
        </div>

        {/* 3. Target Direction Arrow (Rotates relative to screen: targetBearing - userHeading) */}
        {selectedShop ? (
          <motion.div 
            className="absolute inset-0 flex items-start justify-center pointer-events-none"
            animate={{ rotate: animatedRelativeAngle }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          >
            {/* The 指针 (Indicator Needle) */}
            <div className="relative flex flex-col items-center -top-6">
              {/* Dynamic Bubble/Neon indicator */}
              <motion.div 
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className={`flex flex-col items-center justify-center p-2 rounded-xl shadow-md border pointer-events-auto cursor-help ${
                  isBoba 
                    ? 'bg-rose-400 text-white border-rose-300' 
                    : 'bg-fuchsia-500 text-white border-fuchsia-400 shadow-[0_0_10px_rgba(244,63,94,0.4)]'
                }`}
              >
                {isBoba ? (
                  <Coffee className="w-4 h-4" />
                ) : (
                  <Beer className="w-4 h-4" />
                )}
                <span className="text-[9px] font-extrabold mt-0.5 whitespace-nowrap px-0.5">
                  {selectedShop.distance}m
                </span>
              </motion.div>
              {/* The Pointer Line/Arrow */}
              <div className={`w-1.5 h-16 rounded-full -mt-0.5 ${
                isBoba 
                  ? 'bg-gradient-to-b from-rose-500 to-rose-300' 
                  : 'bg-gradient-to-b from-fuchsia-500 to-violet-700 shadow-[0_0_8px_rgba(217,70,239,0.5)]'
              }`} />
              <div className={`w-0 h-0 border-l-[6px] border-r-[6px] border-t-[10px] border-l-transparent border-r-transparent ${
                isBoba ? 'border-t-rose-300' : 'border-t-violet-700'
              }`} />
            </div>
          </motion.div>
        ) : (
          /* Empty Compass Arrow Pointer (Points to North) */
          <motion.div 
            className="absolute inset-0 flex items-start justify-center pointer-events-none"
            animate={{ rotate: 0 }}
            transition={{ type: 'spring' }}
          >
            <div className="relative flex flex-col items-center -top-3">
              <div className={`w-1 h-12 rounded-full ${
                isBoba ? 'bg-rose-300' : 'bg-indigo-800'
              }`} />
              <ArrowUp className={`w-4 h-4 -mt-1 ${
                isBoba ? 'text-rose-400' : 'text-indigo-600'
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
                isBoba 
                  ? 'bg-linear-to-br from-rose-50/90 to-orange-50/70 border-rose-100 shadow-xs' 
                  : 'bg-slate-900/80 border-indigo-900/60 shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
              }`}
            >
              {/* Mode indicator badge / Lock Toggle */}
              <button
                onClick={() => setIsLocked(!isLocked)}
                className={`absolute top-0 right-0 px-3 py-1.5 text-[10px] font-black rounded-bl-2xl tracking-wider uppercase cursor-pointer transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 ${
                  isLocked
                    ? isBoba
                      ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-xs'
                      : 'bg-fuchsia-600 hover:bg-fuchsia-700 text-white shadow-[0_2px_8px_rgba(217,70,239,0.3)]'
                    : isBoba
                      ? 'bg-orange-500/90 hover:bg-orange-600 text-white shadow-xs'
                      : 'bg-indigo-600/90 hover:bg-indigo-700 text-white shadow-[0_2px_8px_rgba(79,70,229,0.3)]'
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
                  isBoba ? 'bg-orange-100 text-orange-700' : 'bg-indigo-950 border border-indigo-800 text-indigo-300'
                }`}>
                  最近的{isBoba ? '奶茶店' : '酒吧/酒馆'}
                </span>
                <h3 className={`text-lg font-black mt-1 ${isBoba ? 'text-rose-950' : 'text-white'}`}>
                  {selectedShop.name}
                </h3>
                
                {/* Distance and direction description */}
                <div className="flex items-center gap-4 mt-2 mb-1">
                  <div className="flex flex-col items-center">
                    <span className={`text-xs ${isBoba ? 'text-rose-500' : 'text-indigo-400'}`}>距离</span>
                    <span className={`text-xl font-black ${isBoba ? 'text-rose-900' : 'text-fuchsia-400 font-mono'}`}>
                      {selectedShop.distance}米
                    </span>
                  </div>
                  <div className={`w-px h-8 ${isBoba ? 'bg-rose-100' : 'bg-indigo-900/40'}`} />
                  <div className="flex flex-col items-center">
                    <span className={`text-xs ${isBoba ? 'text-rose-500' : 'text-indigo-400'}`}>绝对方位</span>
                    <span className={`text-xl font-black ${isBoba ? 'text-rose-900' : 'text-fuchsia-400 font-mono'}`}>
                      {selectedShop.bearing}° {getCardinalDirection(selectedShop.bearing)}
                    </span>
                  </div>
                  <div className={`w-px h-8 ${isBoba ? 'bg-rose-100' : 'bg-indigo-900/40'}`} />
                  <div className="flex flex-col items-center">
                    <span className={`text-xs ${isBoba ? 'text-rose-500' : 'text-indigo-400'}`}>相对夹角</span>
                    <span className={`text-xl font-black ${isBoba ? 'text-rose-900' : 'text-fuchsia-400 font-mono'}`}>
                      {relativeAngle}°
                    </span>
                  </div>
                </div>

                <p className={`text-xs ${isBoba ? 'text-rose-700/80' : 'text-indigo-300/80'} mt-1 flex items-center justify-center gap-1`}>
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
                isBoba 
                  ? 'bg-rose-50/50 border-rose-100/60 text-rose-800' 
                  : 'bg-indigo-950/20 border-indigo-950 text-indigo-400'
              }`}
            >
              <Navigation className="w-6 h-6 mx-auto mb-2 opacity-50 animate-pulse" />
              <p className="text-sm font-bold">请在下方列表中选择锁定的店铺目标</p>
              <p className="text-xs mt-1 opacity-75">指南针将全天候指向并引领您到达目的地</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. Manual Rotator (Horizontal slider & preset buttons) */}
      <div className={`w-full mt-6 p-4 rounded-3xl border ${
        isBoba 
          ? 'bg-white border-rose-100 shadow-xs' 
          : 'bg-slate-950/80 border-indigo-950/80 shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-bold ${isBoba ? 'text-rose-900' : 'text-indigo-300'}`}>
            📱 当前面朝方向 (Heading)
          </span>
          <span className={`text-xs font-mono font-bold ${isBoba ? 'text-rose-600 bg-rose-50' : 'text-fuchsia-400 bg-indigo-950/60'} px-2 py-0.5 rounded-lg border border-transparent`}>
            {userHeading}° {getCardinalDirection(userHeading)}
          </span>
        </div>

        {/* Rotary Range Slider */}
        <input 
          type="range"
          min="0"
          max="359"
          value={userHeading}
          onChange={(e) => setUserHeading(parseInt(e.target.value))}
          className={`w-full h-2 rounded-lg appearance-none cursor-pointer mb-4 transition-all focus:outline-none ${
            isBoba ? 'bg-rose-100 accent-rose-500' : 'bg-indigo-950 accent-fuchsia-500'
          }`}
        />

        {/* Fast Direction Preset Buttons */}
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
                  ? isBoba 
                    ? 'bg-rose-500 border-rose-500 text-white shadow-xs' 
                    : 'bg-fuchsia-500 border-fuchsia-500 text-white shadow-[0_0_8px_rgba(217,70,239,0.4)]'
                  : isBoba 
                    ? 'bg-rose-50/50 border-rose-100/60 hover:bg-rose-50 text-rose-700' 
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
