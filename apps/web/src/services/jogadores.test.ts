import { describe, it, expect, beforeEach, vi } from "vitest";
import type { Selecao } from "@7a0/shared";
import {
  getOutraSelecaoMesmoAno,
  getOutraSelecaoMesmoPais,
  resetCacheSelecoes,
} from "@/services/jogadores";
import { maskPlayerName, maskRating } from "@/utils/memoria";

const mockSelecoes: Selecao[] = [
  {
    id: "br-2002",
    pais: "Brasil",
    ano: 2002,
    jogadores: [],
    forca_media: 90,
  },
  {
    id: "de-2002",
    pais: "Alemanha",
    ano: 2002,
    jogadores: [],
    forca_media: 85,
  },
  {
    id: "br-1970",
    pais: "Brasil",
    ano: 1970,
    jogadores: [],
    forca_media: 92,
  },
  {
    id: "fr-2018",
    pais: "França",
    ano: 2018,
    jogadores: [],
    forca_media: 88,
  },
];

beforeEach(() => {
  resetCacheSelecoes();
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ selecoes: mockSelecoes.map((s) => ({ ...s, jogadores: [] })) }),
  });
});

describe("reroll seleções", () => {
  it("another team mantém o ano e troca o país", async () => {
    const brasil = mockSelecoes[0];
    const result = await getOutraSelecaoMesmoAno(brasil);
    expect(result.ano).toBe(2002);
    expect(result.pais).not.toBe("Brasil");
  });

  it("another cup mantém o país e troca o ano", async () => {
    const brasil = mockSelecoes[0];
    const result = await getOutraSelecaoMesmoPais(brasil);
    expect(result.pais).toBe("Brasil");
    expect(result.ano).not.toBe(2002);
  });
});

describe("modo memoria", () => {
  it("esconde nome e rating", () => {
    expect(maskPlayerName("memoria", "Deco")).toMatch(/\?/);
    expect(maskRating("memoria", 87)).toBe("??");
    expect(maskPlayerName("classico", "Deco")).toBe("Deco");
  });
});
