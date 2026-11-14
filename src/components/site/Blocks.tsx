import Image from "next/image";
import type { Block, ImageBlock, LoopBlock } from "@/lib/projects";

function Still({ item, sizes, alt }: { item: ImageBlock | LoopBlock; sizes: string; alt: string }) {
  if (item.type === "loop") {
    return (
      <video
        data-loop
        src={item.src}
        poster={item.poster}
        width={item.w}
        height={item.h}
        muted
        loop
        playsInline
        preload="none"
        aria-label={alt}
      />
    );
  }
  return <Image src={item.src} alt={alt} width={item.w} height={item.h} sizes={sizes} />;
}

export function Blocks({ blocks, title }: { blocks: Block[]; title: string }) {
  return (
    <div className="blocks">
      {blocks.map((block, i) => {
        if (block.type === "grid") {
          const cols = Math.min(block.items.length, 3);
          return (
            <div key={i} className="block-grid rv" data-cols={cols}>
              {block.items.map((item) => (
                <Still
                  key={item.src}
                  item={item}
                  alt={title}
                  sizes={`(max-width: 700px) 100vw, ${Math.round(100 / cols)}vw`}
                />
              ))}
            </div>
          );
        }
        if (block.type === "video") {
          return (
            <div key={i} className="block-video rv" style={{ aspectRatio: `${block.w} / ${block.h}` }}>
              <iframe
                src={block.src}
                title={`${title} — video`}
                loading="lazy"
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                allowFullScreen
              />
            </div>
          );
        }
        return (
          <div key={i} className="block-media rv">
            <Still item={block} alt={title} sizes="(max-width: 1240px) 100vw, 1160px" />
          </div>
        );
      })}
    </div>
  );
}
