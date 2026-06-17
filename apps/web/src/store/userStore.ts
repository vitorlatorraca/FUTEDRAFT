import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStore {
  apelido: string;
  userId: string;
  setApelido: (apelido: string) => void;
}

function gerarUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      apelido: "Jogador",
      userId: gerarUserId(),
      setApelido: (apelido) => set({ apelido }),
    }),
    { name: "7a0-user" },
  ),
);
