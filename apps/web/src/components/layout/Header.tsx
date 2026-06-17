import { Link, useLocation } from "react-router-dom";
import { Trophy, Home, Swords } from "lucide-react";

const links = [
  { to: "/", label: "Início", icon: Home },
  { to: "/ranking", label: "Ranking", icon: Trophy },
];

export function Header() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pitch-500">
            <Swords className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-xl font-bold text-white">
            7a0
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {links.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
