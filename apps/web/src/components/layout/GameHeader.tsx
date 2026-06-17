import { Link } from "react-router-dom";
import type { EstiloJogo, Formacao, ModoJogo } from "@7a0/shared";

interface GameHeaderProps {
  formacao?: Formacao;
  estilo?: EstiloJogo;
  modo?: ModoJogo;
  showConfig?: boolean;
}

const ESTILO_LABEL: Record<EstiloJogo, string> = {
  defensivo: "DEFENSIVE",
  equilibrado: "BALANCED",
  ofensivo: "ATTACKING",
};

const MODO_LABEL: Record<ModoJogo, string> = {
  classico: "CLASSIC",
  memoria: "FROM MEMORY",
};

export function GameHeader({
  formacao,
  estilo,
  modo,
  showConfig = false,
}: GameHeaderProps) {
  return (
    <header className="divider-h bg-cream">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <div className="leading-none">
            <div className="flex items-baseline gap-1">
              <span className="font-display text-3xl tracking-wide">7-0</span>
              <span className="font-condensed text-xs font-bold uppercase tracking-widest text-ink-muted">
                Sete a Zero
              </span>
            </div>
            <p className="font-condensed text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-light">
              Build · Simulate · 7-0
            </p>
          </div>
        </Link>

        {showConfig && formacao && (
          <div className="hidden items-center gap-3 font-condensed text-xs font-bold uppercase tracking-wider text-ink-muted sm:flex">
            <span>{formacao}</span>
            <span>·</span>
            {estilo && <span>{ESTILO_LABEL[estilo]}</span>}
            <span>·</span>
            {modo && <span>{MODO_LABEL[modo]}</span>}
          </div>
        )}

        <button
          type="button"
          className="retro-btn-outline px-3 py-1.5 text-[10px]"
        >
          Settings ▾
        </button>
      </div>
    </header>
  );
}
