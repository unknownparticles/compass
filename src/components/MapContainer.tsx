import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Sparkles } from 'lucide-react';
import { Shop, Coordinate, CompassMode } from '../types';

interface MapContainerProps {
  mode: CompassMode;
  userLocation: Coordinate;
  setUserLocation: (loc: Coordinate) => void;
  shops: Shop[];
  selectedShop: Shop | null;
  setSelectedShop: (shop: Shop | null) => void;
}

export default function MapContainer({
  mode,
  userLocation,
  setUserLocation,
  shops,
  selectedShop,
  setSelectedShop
}: MapContainerProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersGroupRef = useRef<L.FeatureGroup | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);

  const isBoba = mode === 'milktea';

  // 1. Initialize Leaflet Map (Run once)
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Create Leaflet Map Instance
    const map = L.map(mapContainerRef.current, {
      center: [userLocation.lat, userLocation.lng],
      zoom: 16,
      zoomControl: true,
      attributionControl: false // keep it clean
    });

    mapInstanceRef.current = map;

    // Create a feature group to hold all markers for easy clearing
    const markersGroup = L.featureGroup().addTo(map);
    markersGroupRef.current = markersGroup;

    // Listen to map contextmenu (right-click / long-press) events to teleport simulated location
    map.on('contextmenu', (e: L.LeafletMouseEvent) => {
      setUserLocation({
        lat: e.latlng.lat,
        lng: e.latlng.lng
      });
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Handle map tile and theme switching (Light vs Dark map style)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove old tiles
    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }

    // Gorgeous sleek modern map styles
    const tileUrl = isBoba
      ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png' // Light elegant grey
      : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';  // Cyber dark neon

    const tiles = L.tileLayer(tileUrl, {
      maxZoom: 19
    }).addTo(map);

    tileLayerRef.current = tiles;
  }, [mode]);

  // 3. Render markers and polyline connection path
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    // Clear previous elements
    markersGroup.clearLayers();
    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    // A. Render User Position Marker with custom div icon (pulsing dot)
    const userIconHtml = isBoba
      ? `
        <div class="relative flex items-center justify-center w-10 h-10">
          <span class="absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-30 animate-ping"></span>
          <div class="relative flex items-center justify-center rounded-full w-6 h-6 bg-rose-500 border-2 border-white shadow-md text-white text-xs font-bold">我</div>
        </div>
        `
      : `
        <div class="relative flex items-center justify-center w-10 h-10">
          <span class="absolute inline-flex h-full w-full rounded-full bg-fuchsia-500 opacity-45 animate-ping"></span>
          <div class="relative flex items-center justify-center rounded-full w-6 h-6 bg-fuchsia-500 border-2 border-violet-950 shadow-[0_0_10px_rgba(217,70,239,0.8)] text-white text-xs font-bold">我</div>
        </div>
        `;

    const userIcon = L.divIcon({
      html: userIconHtml,
      className: 'custom-user-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
      .bindPopup('<strong style="font-family: sans-serif;">我的位置 (GPS)</strong><br/><span style="font-size: 11px;">(您可以点击地图其他位置模拟移动)</span>')
      .addTo(markersGroup);

    // B. Render Shop Markers of Active Mode
    shops.forEach((shop) => {
      const isSelected = selectedShop?.id === shop.id;

      // Icon Design: Selected has larger glow and bouncy layout
      const iconHtml = isBoba
        ? `
          <div class="flex flex-col items-center justify-center relative cursor-pointer group transition-all duration-300">
            ${isSelected ? '<span class="absolute inline-flex h-10 w-10 rounded-full bg-orange-400/30 animate-pulse"></span>' : ''}
            <div class="flex items-center justify-center rounded-full shadow-lg border-2 text-md transition-transform duration-300 ${
              isSelected 
                ? 'w-9 h-9 bg-linear-to-br from-orange-400 to-rose-400 border-orange-100 scale-110 shadow-orange-200' 
                : 'w-8 h-8 bg-white border-rose-200 hover:scale-105'
            }">
              🧋
            </div>
            <div class="absolute -bottom-5 bg-rose-950/90 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md whitespace-nowrap border border-rose-800 shadow shadow-black">
              ${shop.distance}m
            </div>
          </div>
          `
        : `
          <div class="flex flex-col items-center justify-center relative cursor-pointer group transition-all duration-300">
            ${isSelected ? '<span class="absolute inline-flex h-10 w-10 rounded-full bg-fuchsia-500/40 animate-pulse"></span>' : ''}
            <div class="flex items-center justify-center rounded-full shadow-lg border-2 text-md transition-transform duration-300 ${
              isSelected 
                ? 'w-9 h-9 bg-linear-to-br from-fuchsia-500 to-violet-600 border-fuchsia-200 scale-110 shadow-[0_0_12px_rgba(217,70,239,0.7)]' 
                : 'w-8 h-8 bg-slate-900 border-indigo-900 hover:scale-105 shadow-[0_0_5px_rgba(139,92,246,0.2)]'
            }">
              🍹
            </div>
            <div class="absolute -bottom-5 bg-indigo-950/95 text-fuchsia-300 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-md whitespace-nowrap border border-indigo-800 shadow shadow-black">
              ${shop.distance}m
            </div>
          </div>
          `;

      const markerIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-shop-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const shopMarker = L.marker([shop.lat, shop.lng], { icon: markerIcon })
        .bindPopup(`
          <div style="font-family: sans-serif; padding: 2px;">
            <strong style="font-size: 13px; color: ${isBoba ? '#4c0519' : '#ffffff'};">${shop.name}</strong><br/>
            <span style="font-size: 11px; color: #64748b;">⭐ ${shop.rating} (${shop.reviewsCount}人评)</span><br/>
            <span style="font-size: 11px; font-weight: bold; color: ${isBoba ? '#b45309' : '#f472b6'};">招牌: ${shop.signature}</span><br/>
            <span style="font-size: 11px; color: #475569;">价格: ${shop.priceRange} | ${shop.hours}</span>
          </div>
        `);

      // Handle click to set selected shop
      shopMarker.on('click', () => {
        setSelectedShop(shop);
      });

      shopMarker.addTo(markersGroup);
    });

    // C. Render Path connection from user to Selected Shop
    if (selectedShop) {
      const pathPoints: [number, number][] = [
        [userLocation.lat, userLocation.lng],
        [selectedShop.lat, selectedShop.lng]
      ];

      const polyline = L.polyline(pathPoints, {
        color: isBoba ? '#ec4899' : '#d946ef',
        weight: 3,
        dashArray: '8, 8',
        opacity: 0.85
      }).addTo(map);

      polylineRef.current = polyline;
    }
  }, [userLocation, shops, selectedShop, mode]);

  // 4. Centering utility button
  const handleRecenter = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.setView([userLocation.lat, userLocation.lng], 16, {
      animate: true,
      duration: 1
    });
  };

  return (
    <div className="w-full flex flex-col items-center justify-center h-full relative">
      {/* Recenter / Teleport Indicator Banner (Placed at the bottom to avoid covering Zoom tools) */}
      <div className={`absolute bottom-4 left-4 right-4 z-[1000] px-3 py-2 rounded-xl text-[10px] font-bold shadow-md border flex items-center justify-between pointer-events-auto backdrop-blur-md ${
        isBoba 
          ? 'bg-white/95 border-rose-100 text-rose-900 shadow-rose-100/20' 
          : 'bg-slate-950/95 border-indigo-950 text-indigo-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
      }`}>
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 shrink-0 animate-pulse text-amber-500" />
          <span>长按/右键地图任意点即可「瞬移」定位</span>
        </div>
        <button
          onClick={handleRecenter}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border cursor-pointer transition-all active:scale-95 ${
            isBoba 
              ? 'bg-rose-50 border-rose-200 hover:bg-rose-100 text-rose-700' 
              : 'bg-indigo-950 border-indigo-800 hover:bg-indigo-900 text-indigo-100'
          }`}
        >
          <Navigation className="w-2.5 h-2.5 rotate-45" />
          <span>回中心</span>
        </button>
      </div>

      {/* Leaflet Map DOM Root */}
      <div 
        ref={mapContainerRef} 
        id="leaflet-map-element" 
        className={`w-full h-96 md:h-100 rounded-3xl border shadow-inner ${
          isBoba ? 'border-rose-100' : 'border-indigo-950'
        }`}
      />
    </div>
  );
}
