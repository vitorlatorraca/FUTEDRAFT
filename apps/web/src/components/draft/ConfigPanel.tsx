import type { EstiloJogo, Formacao, ModoJogo } from "@7a0/shared";
import { FORMATION_LIST } from "@/utils/formacoes";

interface ConfigPanelProps {
  formacao: Formacao;
  estilo: EstiloJogo;
  modo: ModoJogo;
  locked: boolean;
  onFormacao: (f: Formacao) => void;
  onEstilo: (e: EstiloJogo) => void;
  onModo: (m: ModoJogo) => void;
}

const ESTILOS: { value: EstiloJogo; label: string }[] = [
  { value: "defensivo", label: "Defensive" },
  { value: "equilibrado", label: "Balanced" },
  { value: "ofensivo", label: "Attacking" },
];

const MODOS: { value: ModoJogo; label: string }[] = [
  { value: "classico", label: "Classic" },
  { value: "memoria", label: "From memory" },
];

function PillGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  disabled,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  disabled?: boolean;
}) {
  return (
    <div>
      <p className="mb-2 font-condensed text-[10px] font-bold uppercase tracking-widest text-ink-light">
        {label}
      </p>
      <div className="flex flex-wrap gap-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(opt.value)}
            className={`pill-btn ${value === opt.value ? "pill-btn-active" : "pill-btn-inactive"} disabled:opacity-40`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ConfigPanel({
  formacao,
  estilo,
  modo,
  locked,
  onFormacao,
  onEstilo,
  onModo,
}: ConfigPanelProps) {
  return (
    <div className="space-y-4 border-2 border-ink bg-white p-4">
      <PillGroup
        label="Formation"
        options={FORMATION_LIST.map((f) => ({ value: f, label: f }))}
        value={formacao}
        onChange={onFormacao}
        disabled={locked}
      />
      <PillGroup
        label="Style"
        options={ESTILOS}
        value={estilo}
        onChange={onEstilo}
        disabled={locked}
      />
      <PillGroup
        label="Mode · Difficulty"
        options={MODOS}
        value={modo}
        onChange={onModo}
        disabled={locked}
      />
      {modo === "memoria" && (
        <p className="text-[10px] leading-relaxed text-brand-red">
          From memory — names and ratings hidden in the player list
        </p>
      )}
    </div>
  );
}
