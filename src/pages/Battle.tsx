import { useLocation, useNavigate } from "react-router-dom";
import { BattleView } from "../components/BattleView";
import { useEffect } from "react";
import { Monster } from "../domain/entities/Monster";

const Battle = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { monster1, monster2 } = location.state || {};

  useEffect(() => {
    if (!monster1 || !monster2) {
      navigate("/");
    }
  }, [monster1, monster2, navigate]);

  const realMonster1 = new Monster(monster1);
  const realMonster2 = new Monster(monster2);

  if (!realMonster1 || !realMonster2) return null;
  return (
    <div
      className="w-screen h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('/images/board.png')" }}
    >
      <div className="absolute inset-0 bg-black/30 z-0" />

      <div className="absolute inset-0 z-10 flex items-center justify-center p-6">
        <BattleView monster1={realMonster1} monster2={realMonster2} />
      </div>
    </div>
  );
};

export default Battle;
