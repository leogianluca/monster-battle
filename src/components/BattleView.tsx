import { useState, useEffect, useRef } from "react";
import { Monster } from "../domain/entities/Monster";
import { startBattle } from "../usecases/startBattle";
import { MonsterCard } from "./MonsterCard";
import type { RoundResult } from "../domain/entities/RoundResult";
import type { BattleResult } from "../domain/entities/BattleResult";

interface BattleViewProps {
  monster1: Monster;
  monster2: Monster;
}

export const BattleView = ({ monster1, monster2 }: BattleViewProps) => {
  const [currentRound, setCurrentRound] = useState<RoundResult | null>(null);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [started, setStarted] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const battleGeneratorRef = useRef<Generator<RoundResult, BattleResult, unknown> | null>(null);
  const roundCountRef = useRef(0);

  useEffect(() => {
    battleGeneratorRef.current = startBattle(monster1, monster2);
    setCurrentRound(null);
    setBattleResult(null);
    setStarted(false);
    setLog([]);
    roundCountRef.current = 0;
  }, [monster1, monster2]);

  const handleNextRound = () => {
    if (!battleGeneratorRef.current) return;

    const { value, done } = battleGeneratorRef.current.next();

    if (!done) {
      roundCountRef.current += 1;
      setCurrentRound(value);
      setLog((prevLog) => [
        ...prevLog,
        `Round ${roundCountRef.current} - ${value.defender.name} recebeu ${value.damage} de dano. (${value.defender.hp} HP restantes)`,
      ]);
    } else {
      setBattleResult(value);
      setCurrentRound(null);
      setLog((prevLog) => [
        ...prevLog,
        value.isDraw
          ? "A batalha terminou empatada!"
          : `Vitória de ${value.winner?.name}! ⚔️`,
      ]);
    }
  };

  useEffect(() => {
    if (!started) return;
    if (battleResult) return;

    const timer = setTimeout(() => {
      handleNextRound();
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentRound, battleResult, started]);

  return (
    <div className="flex flex-row items-start gap-8">
      <div className="flex gap-12">
        <MonsterCard
          {...monster1}
          currentHp={currentRound?.attacker.hp ?? monster1.hp}
          isAttacking={currentRound?.attacker.name === monster1.name}
          damageTaken={currentRound && currentRound.defender.name === monster1.name ? currentRound.damage : 0}
        />
        <MonsterCard
          {...monster2}
          currentHp={currentRound?.defender.hp ?? monster2.hp}
          isAttacking={currentRound?.attacker.name === monster2.name}
          damageTaken={currentRound && currentRound.defender.name === monster2.name ? currentRound.damage : 0}
        />
      </div>

      <div
        className="w-72 h-[720px] rounded-lg p-4 overflow-y-auto shadow-lg border-4 border-yellow-700"
        style={{
          backgroundImage: "url('/textures/papiro.jpg')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backgroundBlendMode: "darken",
          boxShadow: "inset 0 0 30px 8px rgba(210, 180, 140, 0.8)",
          fontFamily: "'Papyrus', fantasy, cursive",
          color: "white",
          textShadow: "1px 1px 0 #fff8dc",
        }}
      >
        <h3 className="text-xl font-bold mb-4 select-none ring-yellow-400 border-b pb-2">
          Registro da Batalha
        </h3>
        <div className="flex flex-col gap-2 text-sm leading-relaxed whitespace-pre-line">
          {log.length === 0 ? (
            <p className="italic ring-yellow-400 select-none">
              Nenhuma ação registrada...
            </p>
          ) : (
            log.map((entry, index) => (
              <p key={index} className="select-none">
                {entry}
              </p>
            ))
          )}
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
        {!battleResult && (
          <button
            className="btn-iron-sm px-10 py-3 text-xl"
            onClick={() => {
              if (!started) {
                setStarted(true);
                handleNextRound();
              }
            }}
            disabled={started}
          >
            {!started ? "Iniciar Batalha" : "Batalha em andamento..."}
          </button>
        )}

        {battleResult && (
          <div className="text-red-300 text-2xl font-bold mt-6 text-center">
            {battleResult.isDraw
              ? "Empate! 🥊"
              : `Vitória de ${battleResult.winner?.name}! ⚔️`}
          </div>
        )}
      </div>
    </div>
  );
};
