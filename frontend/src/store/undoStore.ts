import { create } from 'zustand';

interface UndoAction {
  id: string;
  type: 'delete_entry' | 'delete_job';
  data: any;
  timestamp: number;
}

interface UndoState {
  actions: UndoAction[];
  addAction: (action: Omit<UndoAction, 'timestamp'>) => void;
  removeAction: (id: string) => void;
  clearActions: () => void;
}

export const useUndoStore = create<UndoState>((set) => ({
  actions: [],
  addAction: (action) => set((state) => ({
    actions: [...state.actions, { ...action, timestamp: Date.now() }]
  })),
  removeAction: (id) => set((state) => ({
    actions: state.actions.filter(a => a.id !== id)
  })),
  clearActions: () => set({ actions: [] }),
}));
