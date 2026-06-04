import { create } from 'zustand';

interface ScrollState {
  progress: {
    hero: number;
    about: number;
    skills: number;
    relic1: number;
    relic2: number;
    relic3: number;
  };
  setProgress: (section: keyof ScrollState['progress'], value: number) => void;
}

export const useScrollStore = create<ScrollState>((set) => ({
  progress: {
    hero: 0,
    about: 0,
    skills: 0,
    relic1: 0,
    relic2: 0,
    relic3: 0,
  },
  setProgress: (section, value) => 
    set((state) => ({
      progress: {
        ...state.progress,
        [section]: value
      }
    }))
}));
