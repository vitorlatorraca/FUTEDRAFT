import { Routes, Route } from "react-router-dom";
import { Home } from "@/pages/Home";
import { Draft } from "@/pages/Draft";
import { Simulacao } from "@/pages/Simulacao";
import { Resultado } from "@/pages/Resultado";
import { Ranking } from "@/pages/Ranking";
import { Friends } from "@/pages/Friends";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/draft" element={<Draft />} />
      <Route path="/simulacao" element={<Simulacao />} />
      <Route path="/resultado" element={<Resultado />} />
      <Route path="/ranking" element={<Ranking />} />
      <Route path="/friends" element={<Friends />} />
    </Routes>
  );
}
