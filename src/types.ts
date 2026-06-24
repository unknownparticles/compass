export interface Coordinate {
  lat: number;
  lng: number;
}

export type CompassMode = 'milktea' | 'bar' | 'matcha';

export interface Shop {
  id: string;
  name: string;
  type: CompassMode;
  lat: number;
  lng: number;
  distance: number; // dynamically calculated, in meters
  bearing: number;  // absolute angle from user to shop (0 is North, 90 is East, etc.)
  relativeAngle: number; // relative angle from user's current facing direction to shop
  rating: number;
  reviewsCount: number;
  address: string;
  signature: string; // Signature menu item (e.g., "杨枝甘露", "Classic Mojito")
  priceRange: string;
  hours: string;
  tags: string[];
}

export interface PresetLocation {
  name: string;
  city: string;
  lat: number;
  lng: number;
  description: string;
}
