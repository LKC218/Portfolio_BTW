
export interface Hotspot {
  id: string;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  title: string;
  description: string;
  detailImage: string;
}

export interface Scene {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  mainImage: string;
  color: string; // Hex code for accent (Border color / UI color)
  transitionColor?: string; // Specific color for the slide transition
  hotspots: Hotspot[];
}

export interface Collection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  color: string;
}

export enum AppState {
  HOME,
  GALLERY,
  VIEWER
}
