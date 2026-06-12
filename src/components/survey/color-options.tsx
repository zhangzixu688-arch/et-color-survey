import { Check } from "lucide-react";
import { CAR_COLORS, COLOR_META, type CarColor } from "@/lib/survey";

export function ColorOptions({ name, value, onChange }: { name: string; value?: CarColor; onChange: (value: CarColor) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 md:gap-3">
      {CAR_COLORS.map((color) => {
        const selected = value === color;
        return (
          <label key={color}>
            <input className="option-input" type="radio" name={name} value={color} checked={selected} onChange={() => onChange(color)} />
            <span className="option-card">
              <span className="h-3.5 w-3.5 shrink-0 rounded-full ring-4 ring-white/5" style={{ background: COLOR_META[color].hex }} />
              <span className="text-sm md:text-base">{color}</span>
              <Check className={`ml-auto h-4 w-4 transition-opacity ${selected ? "opacity-100" : "opacity-0"}`} />
            </span>
          </label>
        );
      })}
    </div>
  );
}
