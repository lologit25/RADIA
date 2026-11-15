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
  group: "pro" | "student";
}

export const projects = data as Project[];
export const proProjects = projects.filter((p) => p.group === "pro");
export const studentProjects = projects.filter((p) => p.group === "student");

export const profile = {
  name: "Paolo Pérez Ramos",
  short: "Paolo",
  role: "Redactor creativo",
  company: "Publicis Ímpetu",
  location: "Montevideo, Uruguay",
  behance: "https://www.behance.net/paoloperezramos",
  linkedin: "https://www.linkedin.com/in/paolop%C3%A9rezramos",
} as const;

export const clients = Array.from(
  new Set(proProjects.map((p) => p.client).filter((c): c is string => Boolean(c))),
);

export function pad(n: number): string {
  return String(n).padStart(2, "0");
}

const kindsEn: Record<string, string> = {
  "Campaña integral": "Integrated campaign",
  "Film · Música": "Film · Music",
  Gráfica: "Print",
  "Idea alternativa": "Alternative idea",
  "Campaña gráfica": "Print campaign",
  "Innovación · Future Lions": "Innovation · Future Lions",
};

const medalsEn: Record<string, string> = { Plata: "Silver", Oro: "Gold", Bronce: "Bronze" };

export function kindLabel(kind: string): string {
  return kindsEn[kind] ?? kind;
}

export function medalLabel(medal: string): string {
  return medalsEn[medal] ?? medal;
}
