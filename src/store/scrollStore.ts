import { create } from 'zustand';

interface ScrollState {
  progress: {
    hero: number;
    about: number;
    skills: number;
  };
  setProgress: (section: keyof ScrollState['progress'], value: number) => void;
}

export const useScrollStore = create<ScrollState>((set) => ({
  progress: {
    hero: 0,
    about: 0,
    skills: 0,
  },
  setProgress: (section, value) => 
    set((state) => ({
      progress: {
        ...state.progress,
        [section]: value
      }
    }))
}));
