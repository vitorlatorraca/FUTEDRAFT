import type { Room, RoomPlayer } from "@7a0/shared";

const API_URL = import.meta.env.VITE_API_URL ?? "";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = API_URL ? `${API_URL}${path}` : path;
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message ?? "Erro na API");
  }
  return res.json();
}

export async function createRoom(hostName: string): Promise<Room> {
  return request("/api/rooms", {
    method: "POST",
    body: JSON.stringify({ hostName }),
  });
}

export async function joinRoom(
  code: string,
  playerName: string,
): Promise<Room> {
  return request(`/api/rooms/${code}/join`, {
    method: "POST",
    body: JSON.stringify({ playerName }),
  });
}

export async function getRoom(code: string): Promise<Room> {
  return request(`/api/rooms/${code}`);
}

export async function submitRoomScore(
  code: string,
  playerId: string,
  payload: { pontuacao: number; venceu: boolean },
): Promise<RoomPlayer> {
  return request(`/api/rooms/${code}/score`, {
    method: "POST",
    body: JSON.stringify({ playerId, ...payload }),
  });
}
