import { create } from "zustand";

export const useTwoFactorStore = create<{
  isOpen: boolean;
  data: {
    type?: string;
    fields?: Record<string, any>;
    options?: ("backup" | "app")[];
    function?: Function;
    mfa?: {
      ticket: string;
      options: {
        type: string;
        data?: Record<string, any>;
      }[];
    };
  };
  setIsOpen: (isOpen: boolean) => void;
  setData: (data: {
    type: string;
    fields: Record<string, any>;
    options: ("backup" | "app")[];
    function?: Function;
    mfa?: {
      ticket: string;
      function: Function;
      options: {
        type: string;
        data?: Record<string, any>;
      }[];
    };
  }) => void;
}>((set) => ({
  isOpen: false,
  data: {},
  setIsOpen: (isOpen) => set({ isOpen }),
  setData: (data) => set({ data }),
}));
