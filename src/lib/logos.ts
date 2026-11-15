export interface Logo {
  name: string;
  src: string;
  w: number;
  h: number;
  /** Optical size relative to the row height. */
  scale: number;
}

export const logos: Record<string, Logo> = {
  "Pepsi": { name: "Pepsi", src: "/logos/pepsi.webp", w: 240, h: 240, scale: 1.55 },
  "Pilsen": { name: "Pilsen", src: "/logos/pilsen.webp", w: 1161, h: 240, scale: 0.6 },
  "INAVI": { name: "INAVI", src: "/logos/inavi.webp", w: 999, h: 240, scale: 1.0 },
  "FIAT": { name: "FIAT", src: "/logos/fiat.webp", w: 317, h: 240, scale: 0.95 },
  "Tigo Paraguay": { name: "Tigo Paraguay", src: "/logos/tigo.webp", w: 334, h: 240, scale: 1.15 },
};
