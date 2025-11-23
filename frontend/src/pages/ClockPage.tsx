import { useState, useEffect, useRef } from "react";
import { PlayIcon, PauseIcon, ArrowPathIcon, PlusIcon } from "@heroicons/react/24/solid";
import { GlassPanel } from "../shared/components/ui/GlassPanel";
import { useClockStore, type TimerPreset } from "../store/clockStore";
import { PresetCard } from "../features/clock/components/PresetCard";
import { CreatePresetModal } from "../features/clock/components/CreatePresetModal";

type TimerState = "idle" | "running" | "paused" | "break";

export const ClockPage = () => {
  const { presets, activePresetId, setActivePreset, addPreset, removePreset, updatePreset } = useClockStore();
  const activePreset = presets.find((p) => p.id === activePresetId) || presets[0];

  const [state, setState] = useState<TimerState>("idle");
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPreset, setEditingPreset] = useState<TimerPreset | undefined>(undefined);

  const timerRef = useRef<any>(null);

  // Initialize timer when preset changes
  useEffect(() => {
    resetTimer();
  }, [activePresetId, activePreset]); // Re-run when active preset changes

  const playSound = () => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5);

    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  };

  useEffect(() => {
    if (state === "running") {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (activePreset.workDuration === 0) {
             // Stopwatch mode (Standard)
            return prev + 1;
          } else {
             // Countdown mode
            if (prev <= 1) {
              handleTimerComplete();
              return 0;
            }
            return prev - 1;
          }
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state, activePreset]);

  const handleTimerComplete = () => {
    playSound();
    if (state === "running" && activePreset.workDuration > 0) {
      setState("break");
      setTimeLeft(activePreset.breakDuration);
      setTotalTime(activePreset.breakDuration);
      setTimeout(() => setState("running"), 100);
    } else if (state === "break") {
       setState("idle");
       resetTimer();
    }
  };

  const toggleTimer = () => {
    if (state === "running") {
      setState("paused");
    } else {
      setState("running");
    }
  };

  const resetTimer = () => {
    setState("idle");
    if (activePreset.workDuration === 0) {
      setTimeLeft(0);
    } else {
      setTimeLeft(activePreset.workDuration);
      setTotalTime(activePreset.workDuration);
    }
  };

  const handleCreatePreset = (data: Omit<TimerPreset, "id">) => {
    if (editingPreset) {
      updatePreset(editingPreset.id, data);
      setEditingPreset(undefined);
    } else {
      const newPreset: TimerPreset = {
        ...data,
        id: Date.now().toString(),
      };
      addPreset(newPreset);
    }
  };

  const handleEdit = (preset: TimerPreset) => {
    setEditingPreset(preset);
    setIsModalOpen(true);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (activePreset.workDuration === 0 && h > 0) {
        return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const progress = activePreset.workDuration === 0 ? 100 : ((totalTime - timeLeft) / totalTime) * 100;

  const [isListExpanded, setIsListExpanded] = useState(false);

  // ... (keep existing functions)

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 p-6 pb-24 md:pb-6 overflow-hidden relative">
      {/* Mobile List Toggle / Header */}
      <div className="md:hidden flex items-center justify-between z-30 relative">
        <h2 className="text-xl font-bold text-text-primary">
          {isListExpanded ? "My Timers" : activePreset.name}
        </h2>
        <div className="flex gap-2">
           <button
            onClick={() => setIsListExpanded(!isListExpanded)}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-text-primary transition-colors"
          >
            <ArrowPathIcon className={`w-5 h-5 transition-transform ${isListExpanded ? "rotate-180" : ""}`} />
          </button>
          <button
            onClick={() => {
              setEditingPreset(undefined);
              setIsModalOpen(true);
            }}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-text-primary transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Left Panel: Presets (Collapsible on Mobile) */}
      <div
        className={`
          absolute md:relative inset-x-0 top-16 md:top-0 bottom-0 z-20 md:z-auto
          bg-black/80 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none
          transition-all duration-300 ease-in-out
          ${isListExpanded ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 md:translate-y-0 md:opacity-100 pointer-events-none md:pointer-events-auto"}
          w-full md:w-80 flex flex-col gap-4 h-[calc(100%-4rem)] md:h-full p-6 md:p-0
        `}
      >
        <div className="hidden md:flex items-center justify-between">
          <h2 className="text-xl font-bold text-text-primary">My Timers</h2>
          <button
            onClick={() => {
              setEditingPreset(undefined);
              setIsModalOpen(true);
            }}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-text-primary transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar pb-24 md:pb-4">
          {presets.map((preset) => (
            <PresetCard
              key={preset.id}
              preset={preset}
              isActive={activePresetId === preset.id}
              onSelect={() => {
                setActivePreset(preset.id);
                setIsListExpanded(false);
              }}
              onEdit={
                ["standard", "pomodoro", "it_working"].includes(preset.id)
                  ? undefined
                  : () => handleEdit(preset)
              }
              onDelete={
                ["standard", "pomodoro", "it_working"].includes(preset.id)
                  ? undefined
                  : () => removePreset(preset.id)
              }
            />
          ))}
        </div>
      </div>

      {/* Main Panel: Active Timer */}
      <div className="flex-1 flex items-center justify-center h-full absolute md:relative inset-0 z-10 pt-16 md:pt-0">
        <GlassPanel className="w-full max-w-2xl aspect-square md:aspect-video flex flex-col items-center justify-center gap-4 md:gap-8 relative p-6 md:p-12 transition-colors duration-500"
           style={{
             background: `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, ${activePreset.color}10 100%)`,
             borderColor: `${activePreset.color}30`
           }}
        >
          {/* ... (Keep existing Clock UI content) ... */}
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">
            {state === "break" ? "Break Time" : activePreset.name}
          </h2>

          {/* Clock Container */}
          <div className="relative w-56 h-56 md:w-96 md:h-96 flex items-center justify-center">
            {/* Progress Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Background Circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-white/10"
              />
              {/* Progress Circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={activePreset.color}
                strokeWidth="2"
                strokeDasharray="283"
                strokeDashoffset={283 - (283 * progress) / 100}
                className="transition-all duration-1000 ease-linear"
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 8px ${activePreset.color})` }}
              />
            </svg>

            {/* Time Display */}
            <div className="flex flex-col items-center z-10">
              <span className="text-5xl md:text-8xl font-mono font-bold text-text-primary tracking-wider tabular-nums"
                style={{ textShadow: `0 0 20px ${activePreset.color}40` }}
              >
                {formatTime(timeLeft)}
              </span>
              <span className="text-sm md:text-lg text-text-secondary mt-2 md:mt-4 uppercase tracking-widest font-medium">
                {state === "idle" ? "Ready" : state}
              </span>
            </div>

            {/* Pulsing Effect */}
            {state === "running" && (
               <div
                 className="absolute inset-0 rounded-full animate-ping-slow opacity-20"
                 style={{ backgroundColor: activePreset.color }}
               />
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-6 md:gap-8">
            <button
              onClick={toggleTimer}
              className="w-16 h-16 md:w-20 md:h-20 rounded-full text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all active:scale-95"
              style={{
                backgroundColor: activePreset.color,
                boxShadow: `0 0 20px ${activePreset.color}40`
              }}
            >
              {state === "running" ? (
                <PauseIcon className="w-8 h-8 md:w-10 md:h-10" />
              ) : (
                <PlayIcon className="w-8 h-8 md:w-10 md:h-10 ml-1" />
              )}
            </button>

            <button
              onClick={resetTimer}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 text-text-secondary flex items-center justify-center hover:bg-white/20 transition-colors backdrop-blur-md"
            >
              <ArrowPathIcon className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </GlassPanel>
      </div>

      <CreatePresetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreatePreset}
        initialData={editingPreset}
      />
    </div>
  );
};

export default ClockPage;
