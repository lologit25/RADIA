import data from "@/data/projects.json";

export interface Media {
  src: string;
  w: number;
  h: number;
}

export interface ImageBlock extends Media {
  type: "image";
}

export interface LoopBlock extends Media {
  type: "loop";
  poster: string;
}

export interface VideoBlock extends Media {
  type: "video";
}

export interface GridBlock {
  type: "grid";
  items: Array<ImageBlock | LoopBlock>;
}

export type Block = ImageBlock | LoopBlock | VideoBlock | GridBlock;

export interface Award {
  medal: string;
  festival: string;
  jury: string[];
}

export interface Project {
  slug: string;
  client: string | null;
  title: string;
  kind: string;
  year: number;
  behance: string;
  cover: Media;
  credits: Array<{ role: string; names: string }>;
  awards: Award[];
  blocks: Block[];
}

export const projects = data as Project[];

export const profile = {
  name: "Paolo Pérez Ramos",
  short: "Paolo",
  role: "Redactor creativo",
  company: "Publicis Impetu",
  location: "Montevideo, Uruguay",
  behance: "https://www.behance.net/paoloperezramos",
} as const;

export const clients = Array.from(
  new Set(projects.map((p) => p.client).filter((c): c is string => Boolean(c))),
);

export function pad(n: number): string {
  return String(n).padStart(2, "0");
}
