import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { ConfigPanel } from "@/components/draft/ConfigPanel";
import { CampoTatico } from "@/components/draft/CampoTatico";
import { BoxScore } from "@/components/draft/BoxScore";
import { RollPanel } from "@/components/draft/RollPanel";
import { useDraft } from "@/hooks/useDraft";

export function Draft() {
  const navigate = useNavigate();
  const {
    estado,
    loading,
    jogadoresDisponiveis,
    proximaPosicao,
    slotsPreenchidos,
    timeCompleto,
    aguardandoRoll,
    sortearSelecao,
    rerollTeam,
    rerollCup,
    escolherJogador,
    setFormacao,
    setEstilo,
    setModo,
  } = useDraft();

  useEffect(() => {
    if (!estado) navigate("/");
  }, [estado, navigate]);

  if (!estado) return null;

  const proximoIndex =
    estado.slots.find((s) => s.jogador === null)?.index ?? null;
  const configLocked = slotsPreenchidos > 0;

  return (
    <AppShell
      showGameHeader
      formacao={estado.formacao}
      estilo={estado.estilo}
      modo={estado.modo}
    >
      <div className="mx-auto grid max-w-[1400px] gap-4 px-4 py-4 lg:grid-cols-[280px_1fr_260px]">
        {/* Coluna esquerda */}
        <div className="space-y-4">
          <ConfigPanel
            formacao={estado.formacao}
            estilo={estado.estilo}
            modo={estado.modo}
            locked={configLocked}
            onFormacao={setFormacao}
            onEstilo={setEstilo}
            onModo={setModo}
          />
          <RollPanel
            selecao={estado.selecaoAtual}
            loading={loading}
            modo={estado.modo}
            rerollsRestantes={estado.rerollsRestantes}
            aguardandoRoll={aguardandoRoll}
            jogadores={jogadoresDisponiveis}
            proximaPosicao={proximaPosicao}
            timeCompleto={timeCompleto}
            onRoll={sortearSelecao}
            onRerollTeam={rerollTeam}
            onRerollCup={rerollCup}
            onEscolher={escolherJogador}
            onSimular={() => navigate("/simulacao")}
          />
        </div>

        {/* Campo central */}
        <div className="flex items-center justify-center py-4">
          <CampoTatico
            formacao={estado.formacao}
            slots={estado.slots}
            proximoIndex={proximoIndex}
          />
        </div>

        {/* Box score direita */}
        <div>
          <BoxScore
            formacao={estado.formacao}
            slots={estado.slots}
            slotsPreenchidos={slotsPreenchidos}
          />
        </div>
      </div>
    </AppShell>
  );
}
