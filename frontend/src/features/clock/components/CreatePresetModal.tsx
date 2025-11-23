import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { GlassPanel } from "../../../shared/components/ui/GlassPanel";
import type { TimerPreset } from "../../../store/clockStore";

interface CreatePresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preset: Omit<TimerPreset, "id">) => void;
  initialData?: TimerPreset;
}

const COLORS = [
  "#4F46E5", // Indigo
  "#EF4444", // Red
  "#F59E0B", // Amber
  "#10B981", // Emerald
  "#EC4899", // Pink
  "#8B5CF6", // Violet
  "#06B6D4", // Cyan
  "#F97316", // Orange
];

export const CreatePresetModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}: CreatePresetModalProps) => {
  const [name, setName] = useState(initialData?.name || "");
  const [workMinutes, setWorkMinutes] = useState(
    initialData ? Math.floor(initialData.workDuration / 60) : 25
  );
  const [breakMinutes, setBreakMinutes] = useState(
    initialData ? Math.floor(initialData.breakDuration / 60) : 5
  );
  const [selectedColor, setSelectedColor] = useState(
    initialData?.color || COLORS[0]
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      workDuration: workMinutes * 60,
      breakDuration: breakMinutes * 60,
      color: selectedColor,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pb-24 md:pb-4 bg-black/20 dark:bg-black/60 backdrop-blur-md transition-all duration-300">
      <GlassPanel className="w-full max-w-md p-8 relative animate-in fade-in zoom-in duration-200 rounded-3xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-text-secondary hover:text-text-primary transition-colors"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-3xl font-bold text-text-primary mb-8 tracking-tight">
          {initialData ? "Edit Timer" : "New Timer"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-text-secondary uppercase tracking-wider">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-text-primary placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-lg"
              placeholder="e.g., Deep Work"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-text-secondary uppercase tracking-wider">
                Work (min)
              </label>
              <input
                type="number"
                min="1"
                max="180"
                value={workMinutes}
                onChange={(e) => setWorkMinutes(Number(e.target.value))}
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-lg font-mono"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-text-secondary uppercase tracking-wider">
                Break (min)
              </label>
              <input
                type="number"
                min="0"
                max="60"
                value={breakMinutes}
                onChange={(e) => setBreakMinutes(Number(e.target.value))}
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-lg font-mono"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-text-secondary uppercase tracking-wider">
              Theme Color
            </label>
            <div className="flex flex-wrap gap-4">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full transition-all duration-300 hover:scale-110 ${
                    selectedColor === color
                      ? "ring-4 ring-offset-4 ring-offset-transparent ring-white/50 scale-110 shadow-lg"
                      : "hover:shadow-md opacity-80 hover:opacity-100"
                  }`}
                  style={{
                    backgroundColor: color,
                    boxShadow: selectedColor === color ? `0 0 20px ${color}60` : undefined
                  }}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-primary text-white text-lg font-bold shadow-lg hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            Save Timer
          </button>
        </form>
      </GlassPanel>
    </div>
  );
};
