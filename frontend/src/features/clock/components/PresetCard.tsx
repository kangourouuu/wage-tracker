import { PlayIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import type { TimerPreset } from "../../../store/clockStore";
import { useState } from "react";

interface PresetCardProps {
  preset: TimerPreset;
  isActive: boolean;
  onSelect: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
}

export const PresetCard = ({
  preset,
  isActive,
  onSelect,
  onDelete,
  onEdit,
}: PresetCardProps) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isSwiped, setIsSwiped] = useState(false);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && onDelete) {
      setIsSwiped(true);
    }
    if (isRightSwipe) {
      setIsSwiped(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl group">
      {/* Swipe Actions (Mobile) */}
      <div
        className={`absolute inset-y-0 right-0 flex items-center transition-transform duration-300 ease-out z-10 ${
          isSwiped ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
              setIsSwiped(false);
            }}
            className="h-full px-4 bg-blue-500 text-white font-medium flex items-center justify-center"
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
              setIsSwiped(false);
            }}
            className="h-full px-4 bg-red-500 text-white font-medium flex items-center justify-center"
          >
            Delete
          </button>
        )}
      </div>

      <div
        onClick={onSelect}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className={`relative p-4 rounded-xl transition-all duration-300 cursor-pointer border backdrop-blur-sm ${
          isActive
            ? "bg-white/10 border-white/20 shadow-lg scale-[1.02]"
            : "bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10 hover:scale-[1.01]"
        } ${isSwiped ? "-translate-x-32" : "translate-x-0"}`}
        style={{
          borderColor: isActive ? preset.color : undefined,
          boxShadow: isActive
            ? `0 0 20px ${preset.color}20`
            : undefined,
        }}
      >
        {/* Hover Glow Effect */}
        <div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            boxShadow: `inset 0 0 20px ${preset.color}10, 0 0 20px ${preset.color}10`
          }}
        />

        <div className="flex items-center justify-between mb-2">
          <div
            className="w-3 h-3 rounded-full shadow-[0_0_8px_currentColor]"
            style={{ color: preset.color, backgroundColor: preset.color }}
          />

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-4 group-hover:translate-x-0">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="p-1.5 rounded-full hover:bg-white/10 text-text-secondary hover:text-primary transition-colors"
                title="Edit"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-1.5 rounded-full hover:bg-white/10 text-text-secondary hover:text-red-500 transition-colors"
                title="Delete"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <h3 className="text-lg font-bold text-text-primary mb-1 tracking-tight">{preset.name}</h3>
        <div className="text-sm text-text-secondary font-medium">
          {Math.floor(preset.workDuration / 60)}m focus
          {preset.breakDuration > 0 && ` • ${Math.floor(preset.breakDuration / 60)}m break`}
        </div>

        <div
          className={`absolute bottom-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            isActive
              ? "bg-white text-black opacity-100 scale-100"
              : "bg-white/10 text-white opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
          }`}
          style={{ backgroundColor: isActive ? preset.color : undefined }}
        >
          <PlayIcon className="w-4 h-4 text-white mix-blend-difference" />
        </div>
      </div>
    </div>
  );
};
