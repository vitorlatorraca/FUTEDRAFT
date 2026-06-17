import { GameHeader } from "./GameHeader";
import { Footer } from "./Footer";
import type { EstiloJogo, Formacao, ModoJogo } from "@7a0/shared";

interface AppShellProps {
  children: React.ReactNode;
  formacao?: Formacao;
  estilo?: EstiloJogo;
  modo?: ModoJogo;
  showGameHeader?: boolean;
}

export function AppShell({
  children,
  formacao,
  estilo,
  modo,
  showGameHeader = false,
}: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-cream">
      {showGameHeader ? (
        <GameHeader
          formacao={formacao}
          estilo={estilo}
          modo={modo}
          showConfig
        />
      ) : null}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
