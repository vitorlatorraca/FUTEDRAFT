import type { Formacao, Posicao, SlotTime } from "@7a0/shared";

export const POSICAO_DISPLAY: Record<Posicao, string> = {
  GOL: "GK",
  LD: "RB",
  ZAG: "CB",
  LE: "LB",
  VOL: "DM",
  MC: "CM",
  MD: "RM",
  ME: "LM",
  AE: "LW",
  AD: "RW",
  CA: "ST",
};

export interface PitchSlotLayout {
  index: number;
  x: number;
  y: number;
  label: string;
}

const LAYOUTS: Record<Formacao, PitchSlotLayout[]> = {
  "4-4-2": [
    { index: 0, x: 50, y: 90, label: "GK" },
    { index: 4, x: 15, y: 72, label: "LB" },
    { index: 2, x: 38, y: 72, label: "CB" },
    { index: 3, x: 62, y: 72, label: "CB" },
    { index: 1, x: 85, y: 72, label: "RB" },
    { index: 8, x: 15, y: 48, label: "LM" },
    { index: 7, x: 38, y: 48, label: "CM" },
    { index: 5, x: 62, y: 48, label: "DM" },
    { index: 6, x: 85, y: 48, label: "RM" },
    { index: 9, x: 35, y: 22, label: "ST" },
    { index: 10, x: 65, y: 22, label: "ST" },
  ],
  "4-3-3": [
    { index: 0, x: 50, y: 90, label: "GK" },
    { index: 4, x: 15, y: 72, label: "LB" },
    { index: 2, x: 38, y: 72, label: "CB" },
    { index: 3, x: 62, y: 72, label: "CB" },
    { index: 1, x: 85, y: 72, label: "RB" },
    { index: 5, x: 25, y: 48, label: "CM" },
    { index: 6, x: 50, y: 48, label: "CM" },
    { index: 7, x: 75, y: 48, label: "CM" },
    { index: 8, x: 15, y: 22, label: "LW" },
    { index: 9, x: 50, y: 18, label: "ST" },
    { index: 10, x: 85, y: 22, label: "RW" },
  ],
  "3-5-2": [
    { index: 0, x: 50, y: 90, label: "GK" },
    { index: 1, x: 25, y: 72, label: "CB" },
    { index: 2, x: 50, y: 72, label: "CB" },
    { index: 3, x: 75, y: 72, label: "CB" },
    { index: 8, x: 10, y: 48, label: "LWB" },
    { index: 5, x: 30, y: 48, label: "CM" },
    { index: 6, x: 50, y: 48, label: "CM" },
    { index: 7, x: 70, y: 48, label: "CM" },
    { index: 4, x: 90, y: 48, label: "RWB" },
    { index: 9, x: 35, y: 22, label: "ST" },
    { index: 10, x: 65, y: 22, label: "ST" },
  ],
  "4-2-3-1": [
    { index: 0, x: 50, y: 90, label: "GK" },
    { index: 4, x: 15, y: 72, label: "LB" },
    { index: 2, x: 38, y: 72, label: "CB" },
    { index: 3, x: 62, y: 72, label: "CB" },
    { index: 1, x: 85, y: 72, label: "RB" },
    { index: 5, x: 35, y: 55, label: "DM" },
    { index: 6, x: 65, y: 55, label: "DM" },
    { index: 7, x: 15, y: 35, label: "LW" },
    { index: 8, x: 50, y: 35, label: "AM" },
    { index: 10, x: 85, y: 35, label: "RW" },
    { index: 9, x: 50, y: 18, label: "ST" },
  ],
  "5-3-2": [
    { index: 0, x: 50, y: 90, label: "GK" },
    { index: 4, x: 10, y: 72, label: "LB" },
    { index: 2, x: 30, y: 72, label: "CB" },
    { index: 3, x: 50, y: 72, label: "CB" },
    { index: 5, x: 70, y: 72, label: "CB" },
    { index: 1, x: 90, y: 72, label: "RB" },
    { index: 6, x: 25, y: 48, label: "CM" },
    { index: 7, x: 50, y: 48, label: "CM" },
    { index: 8, x: 75, y: 48, label: "CM" },
    { index: 9, x: 35, y: 22, label: "ST" },
    { index: 10, x: 65, y: 22, label: "ST" },
  ],
};

export function getPitchLayout(formacao: Formacao): PitchSlotLayout[] {
  return LAYOUTS[formacao];
}

const ATAQUE: Posicao[] = ["AE", "AD", "CA", "ME"];
const DEFESA: Posicao[] = ["GOL", "LD", "LE", "ZAG", "VOL"];

export function calcularStatsTime(slots: SlotTime[]) {
  const jogadores = slots.filter((s) => s.jogador).map((s) => s.jogador!);
  if (jogadores.length === 0) return { overall: 0, attack: 0, defense: 0 };

  let atkSum = 0;
  let defSum = 0;
  let atkCount = 0;
  let defCount = 0;

  for (const slot of slots) {
    if (!slot.jogador) continue;
    if (ATAQUE.includes(slot.posicao)) {
      atkSum += slot.jogador.forca;
      atkCount++;
    } else if (DEFESA.includes(slot.posicao)) {
      defSum += slot.jogador.forca;
      defCount++;
    } else {
      atkSum += slot.jogador.forca * 0.6;
      defSum += slot.jogador.forca * 0.6;
      atkCount += 0.6;
      defCount += 0.6;
    }
  }

  const overall = Math.round(
    jogadores.reduce((s, j) => s + j.forca, 0) / jogadores.length,
  );

  return {
    overall,
    attack: atkCount > 0 ? Math.round(atkSum / atkCount) : 0,
    defense: defCount > 0 ? Math.round(defSum / defCount) : 0,
  };
}

export function getCountryCode(pais: string): string {
  const codes: Record<string, string> = {
    Brasil: "BR",
    França: "FR",
    Alemanha: "DE",
    Argentina: "AR",
    Itália: "IT",
    Espanha: "ES",
    Portugal: "PT",
    Inglaterra: "EN",
    Holanda: "NL",
    Croácia: "HR",
    Uruguai: "UY",
  };
  return codes[pais] ?? pais.slice(0, 2).toUpperCase();
}
