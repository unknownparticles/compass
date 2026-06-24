import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Sparkles, Navigation, Shield, Award, MapPin } from 'lucide-react';
import { Shop, CompassMode } from '../types';

interface RadarProps {
  mode: CompassMode;
  shops: Shop[];
  selectedShop: Shop | null;
  setSelectedShop: (shop: Shop | null) => void;
  userHeading: number;
  exploreRadius?: number;
}

export default function Radar({
  mode,
  shops,
  selectedShop,
  setSelectedShop,
  userHeading,
  exploreRadius = 3000
}: RadarProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredShop, setHoveredShop] = useState<Shop | null>(null);
  const [dimensions, setDimensions] = useState({ width: 320, height: 320 });
  
  // Track blip illumination levels for fade effects
  const blipIlluminationsRef = useRef<{ [key: string]: number }>({});
  const sweepAngleRef = useRef<number>(0);

  const isBoba = mode === 'milktea';
  const isMatcha = mode === 'matcha';

  // Setup dynamic theme colors for canvas rendering
  let colorPrimary = '139, 92, 246'; // default: bar (violet)
  let colorGlow = '232, 121, 249'; // default: bar (fuchsia)
  if (isBoba) {
    colorPrimary = '251, 113, 133'; // rose-400
    colorGlow = '244, 63, 94'; // rose-500
  } else if (isMatcha) {
    colorPrimary = '52, 211, 153'; // emerald-400
    colorGlow = '16, 185, 129'; // emerald-500
  }

  // Handle responsive canvas sizing
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const d = Math.min(entry.contentRect.width, 400);
        setDimensions({ width: d, height: d });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Radar Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      const { width, height } = dimensions;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const R = (width / 2) * 0.85; // maximum grid radius (representing 1000 meters)

      // 1. Draw Background grid
      ctx.strokeStyle = `rgba(${colorPrimary}, 0.15)`;
      ctx.lineWidth = 1;

      // Draw concentric circles (representing 1/3, 2/3, 1.0 of exploreRadius)
      const circles = [0.33, 0.66, 1.0];
      circles.forEach((multiplier) => {
        ctx.beginPath();
        ctx.arc(cx, cy, R * multiplier, 0, Math.PI * 2);
        ctx.stroke();

        // Draw distance labels
        ctx.fillStyle = `rgba(${colorGlow}, 0.6)`;
        ctx.font = '9px monospace';
        const distVal = Math.round(multiplier * exploreRadius);
        const distLabel = distVal >= 1000 ? `${(distVal / 1000).toFixed(1)}km` : `${distVal}m`;
        ctx.fillText(distLabel, cx + 4, cy - R * multiplier + 10);
      });

      // Draw crosshairs
      ctx.beginPath();
      ctx.moveTo(cx - R, cy);
      ctx.lineTo(cx + R, cy);
      ctx.moveTo(cx, cy - R);
      ctx.lineTo(cx, cy + R);
      ctx.stroke();

      // Draw angular indicators (30, 60, 120, 150 etc.)
      ctx.strokeStyle = `rgba(${colorPrimary}, 0.06)`;
      [30, 60, 120, 150, 210, 240, 300, 330].forEach((deg) => {
        const rad = (deg * Math.PI) / 180;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + R * Math.cos(rad), cy + R * Math.sin(rad));
        ctx.stroke();
      });

      // 2. Draw sweeping beam
      // Sweep rotates clockwise.
      sweepAngleRef.current = (sweepAngleRef.current + 0.02) % (Math.PI * 2);
      const sweepRad = sweepAngleRef.current;

      // Draw gradient tail
      const tailSlices = 40;
      for (let i = 0; i < tailSlices; i++) {
        const sliceAngle = sweepRad - (i * 0.02);
        const opacity = (1 - i / tailSlices) * 0.15;
        ctx.fillStyle = `rgba(${colorPrimary}, ${opacity})`;

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, R, sliceAngle, sliceAngle + 0.02);
        ctx.closePath();
        ctx.fill();
      }

      // Draw sharp sweep line
      ctx.strokeStyle = `rgba(${colorGlow}, 0.7)`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + R * Math.cos(sweepRad), cy + R * Math.sin(sweepRad));
      ctx.stroke();

      // 3. Render User Facing direction indicator (a dashed white cone representing user's view)
      const headingRad = ((userHeading - 90) * Math.PI) / 180; // 0 deg is UP (-90 degrees in standard polar)
      const fieldOfView = (45 * Math.PI) / 180; // 45 degree vision cone
      ctx.strokeStyle = isMatcha 
        ? 'rgba(110,231,183,0.35)' 
        : isBoba 
          ? 'rgba(253,186,116,0.35)' 
          : 'rgba(232,121,249,0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, R, headingRad - fieldOfView / 2, headingRad + fieldOfView / 2);
      ctx.closePath();
      ctx.stroke();
      ctx.setLineDash([]); // reset

      // 4. Update and Draw Blips (Shops)
      shops.forEach((shop) => {
        // Map bearing to standard polar coordinates (0 is North/UP, which is -90 degrees)
        const shopAngleRad = ((shop.bearing - 90) * Math.PI) / 180;
        
        // Calculate screen coordinates
        const ratio = Math.min(shop.distance / exploreRadius, 1.0);
        const bx = cx + R * ratio * Math.cos(shopAngleRad);
        const by = cy + R * ratio * Math.sin(shopAngleRad);

        // Normalize angles to check if sweep overlaps with this shop
        // Standard angle values are 0 to 2PI
        const normalizedSweep = (sweepRad + Math.PI * 2) % (Math.PI * 2);
        const normalizedShopAngle = (shopAngleRad + Math.PI * 2) % (Math.PI * 2);

        // Check distance between sweep line angle and shop angle
        let angleDiff = Math.abs(normalizedSweep - normalizedShopAngle);
        if (angleDiff > Math.PI) angleDiff = Math.PI * 2 - angleDiff;

        // If sweep line is crossing the blip (within ~2 degrees / 0.035 rad), illuminate it fully
        if (angleDiff < 0.04) {
          blipIlluminationsRef.current[shop.id] = 1.0;
        } else {
          // Slowly decay the light level
          const currentIllum = blipIlluminationsRef.current[shop.id] || 0;
          blipIlluminationsRef.current[shop.id] = Math.max(0, currentIllum * 0.985 - 0.003);
        }

        const illum = blipIlluminationsRef.current[shop.id] || 0;

        // Draw glow halos around the blips
        const isSelected = selectedShop?.id === shop.id;
        const radius = isSelected ? 7 : 5;

        if (isSelected) {
          ctx.beginPath();
          ctx.arc(bx, by, radius + 5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${colorGlow}, 0.15)`;
          ctx.fill();
        }

        // Draw blip core
        ctx.beginPath();
        ctx.arc(bx, by, radius, 0, Math.PI * 2);

        if (isBoba || isMatcha) {
          // Boba/Matcha blip style (green or orange star)
          const baseColor = isSelected 
            ? `rgba(${colorGlow}, 1)` 
            : `rgba(${colorPrimary}, 0.6)`;
          
          ctx.fillStyle = baseColor;
          ctx.fill();
          
          // Draw sweeping laser flash overlay on top of core
          if (illum > 0.1) {
            ctx.beginPath();
            ctx.arc(bx, by, radius + (1 - illum) * 8, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${colorGlow}, ${illum})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        } else {
          // Cyberpunk blip style (Neon green/violet core)
          const baseColor = isSelected ? 'rgba(232,121,249,1)' : 'rgba(139,92,246,0.5)';
          
          ctx.fillStyle = baseColor;
          ctx.fill();

          // Draw sweeping laser flash overlay
          if (illum > 0.1) {
            ctx.beginPath();
            ctx.arc(bx, by, radius + (1 - illum) * 10, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(232,121,249, ${illum})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }

        // If hovered, draw label
        const isHovered = hoveredShop?.id === shop.id;
        if (isHovered) {
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 10px sans-serif';
          const textWidth = ctx.measureText(shop.name).width;

          // Draw nice black tag backdrop
          ctx.fillStyle = 'rgba(0,0,0,0.8)';
          ctx.fillRect(bx - textWidth / 2 - 6, by - 24, textWidth + 12, 16);
          ctx.strokeStyle = `rgb(${colorGlow})`;
          ctx.strokeRect(bx - textWidth / 2 - 6, by - 24, textWidth + 12, 16);

          ctx.fillStyle = '#ffffff';
          ctx.fillText(shop.name, bx - textWidth / 2, by - 12);
        }
      });

      // 5. Draw center user blip
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = `rgb(${colorGlow})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [dimensions, shops, selectedShop, hoveredShop, userHeading, mode]);

  // Click on radar handler
  const handleRadarClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const cx = dimensions.width / 2;
    const cy = dimensions.height / 2;
    const R = (dimensions.width / 2) * 0.85;

    // Check which shop is clicked
    let clickedShop: Shop | null = null;
    let minDistance = 15; // click sensitivity in pixels

    shops.forEach((shop) => {
      const shopAngleRad = ((shop.bearing - 90) * Math.PI) / 180;
      const ratio = Math.min(shop.distance / exploreRadius, 1.0);
      const bx = cx + R * ratio * Math.cos(shopAngleRad);
      const by = cy + R * ratio * Math.sin(shopAngleRad);

      const clickDist = Math.hypot(x - bx, y - by);
      if (clickDist < minDistance) {
        minDistance = clickDist;
        clickedShop = shop;
      }
    });

    if (clickedShop) {
      setSelectedShop(clickedShop);
    }
  };

  // Mouse move handler (hover detection on radar)
  const handleRadarMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const cx = dimensions.width / 2;
    const cy = dimensions.height / 2;
    const R = (dimensions.width / 2) * 0.85;

    let matchedShop: Shop | null = null;
    let minDistance = 12;

    shops.forEach((shop) => {
      const shopAngleRad = ((shop.bearing - 90) * Math.PI) / 180;
      const ratio = Math.min(shop.distance / exploreRadius, 1.0);
      const bx = cx + R * ratio * Math.cos(shopAngleRad);
      const by = cy + R * ratio * Math.sin(shopAngleRad);

      const hoverDist = Math.hypot(x - bx, y - by);
      if (hoverDist < minDistance) {
        minDistance = hoverDist;
        matchedShop = shop;
      }
    });

    setHoveredShop(matchedShop);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto py-4">
      {/* Dynamic Title */}
      <div className="text-center mb-4">
        <h2 className={`text-lg font-black tracking-wide flex items-center justify-center gap-2 ${
          isBoba ? 'text-rose-900' : 'text-fuchsia-400 font-mono tracking-widest'
        }`}>
          <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
          <span>{isBoba ? '🍯 奶茶声呐探测雷达' : '🔮 酒鬼霓虹声呐雷达'}</span>
        </h2>
        <p className={`text-xs mt-1 ${isBoba ? 'text-rose-700/70' : 'text-indigo-300/60'}`}>
          半径约 {exploreRadius >= 1000 ? `${(exploreRadius / 1000).toFixed(0)}公里` : `${exploreRadius}米`}，点击屏幕上的亮斑即可锁定目标
        </p>
      </div>

      {/* Outer Radar Screen */}
      <div 
        ref={containerRef}
        className={`relative rounded-full p-2 border flex items-center justify-center transition-all shadow-inner ${
          isBoba 
            ? 'bg-rose-50/20 border-rose-100 shadow-rose-100/30' 
            : 'bg-slate-950 border-indigo-950 shadow-[0_0_25px_rgba(139,92,246,0.1)]'
        }`}
        style={{ width: dimensions.width + 16, height: dimensions.height + 16 }}
      >
        {/* Canvas Screen */}
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          onClick={handleRadarClick}
          onMouseMove={handleRadarMouseMove}
          onMouseLeave={() => setHoveredShop(null)}
          className={`rounded-full cursor-crosshair transition-all ${
            isBoba ? 'bg-white' : 'bg-slate-950'
          }`}
        />

        {/* Floating Orientation compass helper tag */}
        <div className={`absolute top-4 text-[9px] font-mono tracking-wider font-extrabold uppercase px-2 py-0.5 rounded-full border ${
          isBoba 
            ? 'bg-rose-400 text-white border-rose-300' 
            : 'bg-indigo-950 border-indigo-800 text-indigo-300'
        }`}>
          ▲ 真北角 (North)
        </div>
      </div>

      {/* Quick Stats Banner below radar */}
      <div className="w-full grid grid-cols-2 gap-3 mt-6">
        <div className={`p-3.5 rounded-2xl border text-center ${
          isBoba ? 'bg-rose-50/50 border-rose-100/50' : 'bg-indigo-950/20 border-indigo-950/60'
        }`}>
          <span className={`text-[10px] block ${isBoba ? 'text-rose-700/80' : 'text-indigo-400'}`}>
            雷达探测信号
          </span>
          <span className={`text-sm font-black mt-0.5 block ${isBoba ? 'text-rose-950' : 'text-white'}`}>
            {shops.length} 个目标已捕获
          </span>
        </div>
        <div className={`p-3.5 rounded-2xl border text-center ${
          isBoba ? 'bg-rose-50/50 border-rose-100/50' : 'bg-indigo-950/20 border-indigo-950/60'
        }`}>
          <span className={`text-[10px] block ${isBoba ? 'text-rose-700/80' : 'text-indigo-400'}`}>
            锁定状态
          </span>
          <span className={`text-sm font-black mt-0.5 block truncate ${isBoba ? 'text-rose-950' : 'text-white'}`}>
            {selectedShop ? selectedShop.name : '未选择目标'}
          </span>
        </div>
      </div>
    </div>
  );
}
