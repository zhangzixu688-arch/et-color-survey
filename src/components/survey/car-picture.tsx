import { COLOR_META, type CarColor } from "@/lib/survey";

export function CarPicture({ color, className = "", eager = false }: { color: CarColor; className?: string; eager?: boolean }) {
  const meta = COLOR_META[color];
  return (
    <picture className="contents">
      <source type="image/avif" srcSet={`/cars/${meta.slug}-1600.avif`} />
      <source type="image/webp" srcSet={`/cars/${meta.slug}-960.webp 960w, /cars/${meta.slug}-1920.webp 1920w`} sizes="(max-width: 768px) 95vw, 72vw" />
      <img src={`/cars/${meta.slug}-1920.webp`} alt={`${meta.display} / ${meta.english} ET 主驾 45 度视图 / driver-side 45-degree view`} className={className} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : "auto"} draggable={false} />
    </picture>
  );
}
