import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { useGameStore } from "@/store/gameStore";

const EXAMPLE_PLAYERS = [
  { name: "Neuer", num: 1, y: 88 },
  { name: "R. Carlos", num: 6, y: 68, x: 12 },
  { name: "Moore", num: 6, y: 68, x: 32 },
  { name: "Beckenbauer", num: 5, y: 68, x: 68 },
  { name: "C. Alberto", num: 4, y: 68, x: 88 },
  { name: "Gerson", num: 8, y: 48, x: 20 },
  { name: "Pelé", num: 10, y: 48, x: 40 },
  { name: "Maradona", num: 10, y: 48, x: 60 },
  { name: "C. Ronaldo", num: 7, y: 22, x: 15 },
  { name: "Ronaldo", num: 9, y: 18, x: 50 },
  { name: "Messi", num: 10, y: 22, x: 85 },
];

export function Home() {
  const navigate = useNavigate();
  const iniciarJogo = useGameStore((s) => s.iniciarJogo);

  const handlePlay = () => {
    iniciarJogo({ formacao: "4-4-2", estilo: "equilibrado", modo: "classico" });
    navigate("/draft");
  };

  return (
    <AppShell>
      <div className="divider-h bg-cream px-4 py-3">
        <div className="mx-auto flex max-w-6xl justify-end gap-2">
          <button type="button" className="retro-btn-outline text-[10px]">
            Profile
          </button>
          <button type="button" className="retro-btn-outline text-[10px]">
            Settings ▾
          </button>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="mb-4 font-condensed text-xs font-semibold uppercase tracking-[0.3em] text-ink-light">
            Dream World Cup 1950 — 2026
          </p>

          <div className="mb-6 flex items-center gap-2">
            <span className="font-display text-8xl leading-none tracking-wide md:text-9xl">
              7
            </span>
            <span className="h-10 w-16 bg-brand-gold md:h-12 md:w-20" />
            <span className="font-display text-8xl leading-none tracking-wide md:text-9xl">
              0
            </span>
          </div>

          <h1 className="mb-4 font-display text-4xl uppercase leading-tight tracking-wide md:text-5xl">
            Roll the dice.
            <br />
            Build your dream
            <br />
            national team
          </h1>

          <p className="mb-8 max-w-md text-sm leading-relaxed text-ink-muted">
            Roll the dice: you get a national team and a World Cup. Pick a star
            who was actually there, fill all 11 and simulate — does your team
            win 7-0?
          </p>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={handlePlay} className="retro-btn">
              Play now →
            </button>
            <button
              type="button"
              onClick={() => navigate("/friends")}
              className="retro-btn-outline relative"
            >
              <span className="absolute -top-2 left-2 rounded bg-brand-gold px-1.5 py-0.5 font-condensed text-[8px] font-bold uppercase text-ink">
                New
              </span>
              With friends
            </button>
          </div>
        </div>

        <div className="relative mx-auto aspect-[3/4] w-full max-w-sm border-4 border-ink pitch-stripes shadow-retro">
          {EXAMPLE_PLAYERS.map((p) => (
            <div
              key={p.name}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${p.x ?? 50}%`,
                top: `${p.y}%`,
              }}
            >
              <div className="flex flex-col items-center">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink bg-white font-condensed text-xs font-bold">
                  {p.num}
                </div>
                <span className="mt-0.5 font-condensed text-[9px] font-bold uppercase">
                  {p.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="divider-h">
        <div className="mx-auto grid max-w-6xl grid-cols-3 divide-x-2 divide-ink">
          {[
            { step: "01", title: "Roll", desc: "Draws a national team and a World Cup" },
            { step: "02", title: "Build", desc: "Pick a star who played there" },
            { step: "03", title: "Simulate", desc: "See if your team wins 7-0" },
          ].map((item) => (
            <div key={item.step} className="px-6 py-8 text-center">
              <p className="mb-2 font-condensed text-xs font-bold text-ink-light">
                {item.step}
              </p>
              <p className="mb-1 font-display text-2xl uppercase tracking-wide">
                {item.title}
              </p>
              <p className="text-xs text-ink-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
