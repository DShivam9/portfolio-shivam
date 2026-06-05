import { create } from 'zustand';

interface SkillRevealState {
  status: 'idle' | 'hovered' | 'selected';
  setStatus: (status: 'idle' | 'hovered' | 'selected') => void;
}

export const useSkillReveal = create<SkillRevealState>((set) => ({
  status: 'idle',
  setStatus: (status) => set({ status }),
}));
