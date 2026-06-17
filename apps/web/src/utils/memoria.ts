import type { ModoJogo } from "@7a0/shared";

export function maskPlayerName(modo: ModoJogo, nome: string): string {
  if (modo !== "memoria") return nome;
  const parts = nome.split(" ");
  return parts.length > 1 ? `${parts[0][0]}. ???` : "???";
}

export function maskRating(modo: ModoJogo, forca: number): string {
  return modo === "memoria" ? "??" : String(forca);
}

export function isModoMemoria(modo: ModoJogo): boolean {
  return modo === "memoria";
}
