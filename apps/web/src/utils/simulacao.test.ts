import { describe, it, expect } from "vitest";
import { calcularForcaTime, simularPartida, jogadorCompativel } from "../utils/simulacao";
import type { Jogador, Selecao, SlotTime } from "@7a0/shared";

const mockJogador = (overrides: Partial<Jogador> = {}): Jogador => ({
  id: "1",
  nome: "Test",
  posicao: "CA",
  forca: 90,
  velocidade: 80,
  tecnica: 85,
  selecao: "Brasil",
  pais: "Brasil",
  anoCopa: 2002,
  ...overrides,
});

describe("simulacao", () => {
  it("calcula força média do time", () => {
    const slots: SlotTime[] = [
      { posicao: "GOL", jogador: mockJogador({ forca: 80, pais: "Brasil", anoCopa: 2002 }), index: 0 },
      { posicao: "CA", jogador: mockJogador({ forca: 90, pais: "França", anoCopa: 2018, id: "2" }), index: 1 },
    ];
    expect(calcularForcaTime(slots)).toBe(85);
  });

  it("aplica bônus de mesma seleção", () => {
    const slots: SlotTime[] = Array.from({ length: 2 }, (_, i) => ({
      posicao: "CA" as const,
      jogador: mockJogador({ forca: 90, id: String(i) }),
      index: i,
    }));
    expect(calcularForcaTime(slots)).toBe(95);
  });

  it("verifica compatibilidade de posição", () => {
    const j = mockJogador({ posicao: "ME", posicaoAlternativa: "CA" });
    expect(jogadorCompativel(j, "ME")).toBe(true);
    expect(jogadorCompativel(j, "CA")).toBe(true);
    expect(jogadorCompativel(j, "GOL")).toBe(false);
  });

  it("simula partida com resultado", () => {
    const adversario: Selecao = {
      id: "test",
      pais: "França",
      ano: 2018,
      jogadores: [],
      forca_media: 88,
    };
    const resultado = simularPartida(90, adversario, "grupos");
    expect(["vitoria", "derrota"]).toContain(resultado.resultado);
    expect(resultado.placar).toMatch(/^\d+-\d+$/);
  });
});
