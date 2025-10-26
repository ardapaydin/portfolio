import { create } from "zustand";

export const useValidationErrorStore = create<{
  errors: Record<string, string[]>;
  setError: (field: string, message: string[]) => void;
  clearError: (field: string) => void;
  clearAllErrors: () => void;
  setErrors: (field: Record<string, string[]>) => void;
}>((set) => ({
  errors: {},
  setError: (field, message) =>
    set((state) => ({
      errors: { ...state.errors, [field]: message },
    })),
  setErrors: (errors) => set({ errors: errors }),
  clearError: (field) =>
    set((state) => {
      const newerrors = { ...state.errors };
      delete newerrors[field];
      return { errors: newerrors };
    }),
  clearAllErrors: () => set({ errors: {} }),
}));
