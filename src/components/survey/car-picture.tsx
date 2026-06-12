import { COLOR_META, type CarColor } from "@/lib/survey";

export function CarPicture({ color, className = "", eager = false }: { color: CarColor; className?: string; eager?: boolean }) {
  const slug = COLOR_META[color].slug;
  return (
    <picture className="contents">
      <source type="image/avif" srcSet={`/cars/${slug}-1600.avif`} />
      <source type="image/webp" srcSet={`/cars/${slug}-960.webp 960w, /cars/${slug}-1920.webp 1920w`} sizes="(max-width: 768px) 95vw, 72vw" />
      <img src={`/cars/${slug}-1920.webp`} alt={`${color}星途 EX7 主驾 45 度视图`} className={className} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : "auto"} draggable={false} />
    </picture>
  );
}
