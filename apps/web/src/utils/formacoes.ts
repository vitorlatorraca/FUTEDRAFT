import type { ConfigFormacao, Formacao, Posicao } from "@7a0/shared";

export const FORMATIONS: Record<Formacao, ConfigFormacao> = {
  "4-3-3": {
    nome: "4-3-3",
    slots: ["GOL", "LD", "ZAG", "ZAG", "LE", "MC", "MC", "MC", "AE", "CA", "AD"],
  },
  "4-4-2": {
    nome: "4-4-2",
    slots: ["GOL", "LD", "ZAG", "ZAG", "LE", "MD", "MC", "MC", "ME", "CA", "CA"],
  },
  "3-5-2": {
    nome: "3-5-2",
    slots: ["GOL", "ZAG", "ZAG", "ZAG", "MD", "MC", "MC", "ME", "LE", "CA", "CA"],
  },
  "4-2-3-1": {
    nome: "4-2-3-1",
    slots: ["GOL", "LD", "ZAG", "ZAG", "LE", "VOL", "VOL", "MD", "ME", "AE", "CA"],
  },
  "5-3-2": {
    nome: "5-3-2",
    slots: ["GOL", "LD", "ZAG", "ZAG", "ZAG", "LE", "MC", "MC", "MC", "CA", "CA"],
  },
};

export const FORMATION_LIST: Formacao[] = Object.keys(FORMATIONS) as Formacao[];

export const POSICAO_LABEL: Record<Posicao, string> = {
  GOL: "Goleiro",
  LD: "Lateral Direito",
  ZAG: "Zagueiro",
  LE: "Lateral Esquerdo",
  VOL: "Volante",
  MC: "Meio-Campo",
  MD: "Meia Direita",
  ME: "Meia Esquerda",
  AE: "Atacante Esquerdo",
  AD: "Atacante Direito",
  CA: "Centroavante",
};

export function getFormationConfig(formacao: Formacao): ConfigFormacao {
  return FORMATIONS[formacao];
}
