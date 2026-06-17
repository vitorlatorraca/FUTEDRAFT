import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const prisma = new PrismaClient();
const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  const jsonPath = join(__dirname, "../../web/public/data/jogadores.json");
  const data = JSON.parse(readFileSync(jsonPath, "utf-8"));

  let totalJogadores = 0;

  for (const selecao of data.selecoes) {
    const forcaMedia =
      selecao.jogadores.reduce(
        (acc: number, j: { forca: number }) => acc + j.forca,
        0,
      ) / selecao.jogadores.length;

    await prisma.selecao.upsert({
      where: { id: selecao.id },
      update: {
        pais: selecao.pais,
        ano: selecao.ano,
        forcaMedia: Math.round(forcaMedia * 10) / 10,
      },
      create: {
        id: selecao.id,
        pais: selecao.pais,
        ano: selecao.ano,
        forcaMedia: Math.round(forcaMedia * 10) / 10,
      },
    });

    for (const jogador of selecao.jogadores) {
      await prisma.jogador.upsert({
        where: { id: jogador.id },
        update: {
          nome: jogador.nome,
          posicao: jogador.posicao,
          posicaoAlternativa: jogador.posicaoAlternativa ?? null,
          forca: jogador.forca,
          velocidade: jogador.velocidade,
          tecnica: jogador.tecnica,
          pais: jogador.pais,
          anoCopa: jogador.anoCopa,
          selecaoId: selecao.id,
        },
        create: {
          id: jogador.id,
          nome: jogador.nome,
          posicao: jogador.posicao,
          posicaoAlternativa: jogador.posicaoAlternativa ?? null,
          forca: jogador.forca,
          velocidade: jogador.velocidade,
          tecnica: jogador.tecnica,
          pais: jogador.pais,
          anoCopa: jogador.anoCopa,
          selecaoId: selecao.id,
        },
      });
      totalJogadores++;
    }
  }

  const selecoes = await prisma.selecao.count();
  console.log(`Seed concluído: ${selecoes} seleções, ${totalJogadores} jogadores`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
