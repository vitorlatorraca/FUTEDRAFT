import type { FaseCampeonato, Formacao, RankingEntry, ResultadoPartida } from "@7a0/shared";

const API_URL = import.meta.env.VITE_API_URL ?? "";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = API_URL ? `${API_URL}${path}` : path;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message ?? "Erro na API");
  }
  return res.json();
}

export interface SalvarPartidaPayload {
  formacao: Formacao;
  forcaTime: number;
  faseAlcancada: FaseCampeonato;
  venceu: boolean;
  placar: ResultadoPartida[];
  pontuacao: number;
  apelido?: string;
}

export async function salvarPartida(
  payload: SalvarPartidaPayload,
): Promise<{ id: string }> {
  return request("/api/partidas", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getRanking(): Promise<RankingEntry[]> {
  return request("/api/ranking");
}

export async function getRankingUsuario(
  userId: string,
): Promise<RankingEntry[]> {
  return request(`/api/ranking/usuario/${userId}`);
}
