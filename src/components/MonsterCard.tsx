interface MonsterCardProps {
  name: string;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  imageUrl: string;

  currentHp?: number;
  isAttacking?: boolean;
  damageTaken?: number;
}

export const MonsterCard = ({
  name,
  hp,
  currentHp,
  attack,
  defense,
  speed,
  imageUrl,
  isAttacking,
  damageTaken,
}: MonsterCardProps) => {
  return (
    <div
      className={`relative w-[480px] h-[720px] rounded-3xl overflow-hidden shadow-lg text-yellow-300 bg-[url('/textures/papiro.jpg')] bg-cover bg-no-repeat border-2
        ${isAttacking ? "ring-4 ring-yellow-400 animate-pulse" : ""}`}
      style={{
        borderColor: "#d4af37",
        boxShadow:
          "0 0 15px 3px rgba(212, 175, 55, 0.8), inset 0 0 10px 2px rgba(212, 175, 55, 0.6)",
      }}
    >
      <div className="w-full h-[320px] border-b-2 border-yellow-600 overflow-hidden rounded-t-3xl shadow-inner">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center italic text-yellow-400 text-xl">
            Sem imagem
          </div>
        )}
      </div>

      <div className="p-8 flex flex-col items-center relative z-10">
        <h2
          className="text-4xl font-extrabold mb-6 select-none"
          style={{
            textShadow:
              "2px 2px 4px rgba(0,0,0,0.7), -2px -2px 2px rgba(255, 215, 0, 0.7)",
          }}
        >
          {name || "Monstro Sem Nome"}
        </h2>

        <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 rounded-full mb-6 shadow-md"></div>

        <div className="w-full max-w-sm">
          <p className="text-2xl font-semibold select-none flex items-center gap-3 mb-3">
            <span role="img" aria-label="HP">
              ❤️
            </span>
            <span>
              {currentHp} / {hp}
            </span>
            {(damageTaken ?? 0) > 0 && (
              <span className="text-red-500 font-bold animate-ping ml-2">
                -{damageTaken}
              </span>
            )}
          </p>

          <div className="grid grid-cols-3 gap-6 text-xl font-semibold select-none">
            <p className="flex items-center justify-center gap-2">
              <span role="img" aria-label="Ataque">
                ⚔️
              </span>
              {attack}
            </p>
            <p className="flex items-center justify-center gap-2">
              <span role="img" aria-label="Defesa">
                🛡️
              </span>
              {defense}
            </p>
            <p className="flex items-center justify-center gap-2">
              <span role="img" aria-label="Velocidade">
                💨
              </span>
              {speed}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
