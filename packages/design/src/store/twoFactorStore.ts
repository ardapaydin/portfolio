import { create } from "zustand";

export const useTwoFactorStore = create<{
  isOpen: boolean;
  data: {
    type?: string;
    fields?: Record<string, any>;
    options?: ("backup" | "app")[];
  };
  setIsOpen: (isOpen: boolean) => void;
  setData: (data: {
    type: string;
    fields: Record<string, any>;
    options: ("backup" | "app")[];
  }) => void;
}>((set) => ({
  isOpen: false,
  data: {},
  setIsOpen: (isOpen) => set({ isOpen }),
  setData: (data) => set({ data }),
}));
