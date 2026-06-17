import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="divider-h mt-auto bg-cream">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-4 py-4">
        <button type="button" className="rounded-full bg-brand-red px-4 py-1.5 font-condensed text-[10px] font-bold uppercase tracking-wider text-white">
          Support 7a0
        </button>

        <nav className="flex flex-wrap gap-4 font-condensed text-[10px] font-semibold uppercase tracking-widest text-ink-light">
          <span>7a0 — Sete a Zero</span>
          <Link to="/draft" className="hover:text-ink">
            Build
          </Link>
          <Link to="/simulacao" className="hover:text-ink">
            Simulate
          </Link>
          <span>7-0</span>
          <span>Privacy</span>
        </nav>
      </div>
    </footer>
  );
}
