import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TimerPreset {
  id: string;
  name: string;
  workDuration: number; // in seconds
  breakDuration: number; // in seconds
  color: string;
  icon?: string;
}

interface ClockState {
  presets: TimerPreset[];
  activePresetId: string | null;
  addPreset: (preset: TimerPreset) => void;
  removePreset: (id: string) => void;
  updatePreset: (id: string, updates: Partial<TimerPreset>) => void;
  setActivePreset: (id: string) => void;
}

const DEFAULT_PRESETS: TimerPreset[] = [
  {
    id: "standard",
    name: "Standard",
    workDuration: 0, // Stopwatch
    breakDuration: 0,
    color: "#4F46E5", // Indigo
  },
  {
    id: "pomodoro",
    name: "Pomodoro",
    workDuration: 25 * 60,
    breakDuration: 5 * 60,
    color: "#F59E0B", // Amber
  },
  {
    id: "it_working",
    name: "IT Working",
    workDuration: 90 * 60,
    breakDuration: 5 * 60,
    color: "#10B981", // Emerald
  },
];

export const useClockStore = create<ClockState>()(
  persist(
    (set) => ({
      presets: DEFAULT_PRESETS,
      activePresetId: "standard",
      addPreset: (preset) =>
        set((state) => ({ presets: [...state.presets, preset] })),
      updatePreset: (id, updates) =>
        set((state) => ({
          presets: state.presets.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),
      removePreset: (id) =>
        set((state) => ({
          presets: state.presets.filter((p) => p.id !== id),
          // If active preset is removed, switch to standard
          activePresetId:
            state.activePresetId === id ? "standard" : state.activePresetId,
        })),

      setActivePreset: (id) => set({ activePresetId: id }),
    }),
    {
      name: "clock-storage",
    }
  )
);
