"use client";

import { DndContext, KeyboardSensor, PointerSensor, TouchSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import { COLOR_META, type CarColor } from "@/lib/survey";

function SortableColor({ color, index, total, onMove }: { color: CarColor; index: number; total: number; onMove: (from: number, to: number) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: color });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={style} className={`flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.045] p-3 transition-shadow md:p-4 ${isDragging ? "z-20 shadow-2xl shadow-black/50 ring-1 ring-blue-300/50" : ""}`}>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/8 font-mono text-xs text-white/62">{index + 1}</span>
      <button type="button" className="cursor-grab touch-none rounded-lg p-1.5 text-white/35 hover:bg-white/8 hover:text-white/75 focus-visible:outline-2 focus-visible:outline-blue-300" aria-label={`拖动${color}调整排名`} {...attributes} {...listeners}><GripVertical className="h-5 w-5" /></button>
      <span className="h-3.5 w-3.5 rounded-full ring-4 ring-white/5" style={{ background: COLOR_META[color].hex }} />
      <span className="grid leading-tight">
        <span className="font-medium">{color}</span>
        <span className="text-xs text-white/42">{COLOR_META[color].english}</span>
      </span>
      <div className="ml-auto flex gap-1">
        <button type="button" disabled={index === 0} onClick={() => onMove(index, index - 1)} aria-label={`${color}上移一名`} className="rounded-lg p-2 text-white/55 hover:bg-white/10 disabled:opacity-20"><ChevronUp className="h-4 w-4" /></button>
        <button type="button" disabled={index === total - 1} onClick={() => onMove(index, index + 1)} aria-label={`${color}下移一名`} className="rounded-lg p-2 text-white/55 hover:bg-white/10 disabled:opacity-20"><ChevronDown className="h-4 w-4" /></button>
      </div>
    </div>
  );
}

export function RankingQuestion({ value, onChange }: { value: CarColor[]; onChange: (ranking: CarColor[]) => void }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const move = (from: number, to: number) => { if (to >= 0 && to < value.length) onChange(arrayMove(value, from, to)); };
  const dragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    move(value.indexOf(active.id as CarColor), value.indexOf(over.id as CarColor));
  };
  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={dragEnd}>
      <SortableContext items={value} strategy={verticalListSortingStrategy}>
        <div className="grid gap-2.5">{value.map((color, index) => <SortableColor key={color} color={color} index={index} total={value.length} onMove={move} />)}</div>
      </SortableContext>
    </DndContext>
  );
}
