import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { SoundToggleButton } from "../components/SoundToggleButton";
import { StoneButton } from "../components/StoneButton";

const Home = () => {
  const navigate = useNavigate();
  const [isStarting, setIsStarting] = useState(false);

  const handleStartClick = () => {
    if (isStarting) return;
    setIsStarting(true);

    const startSound = new Audio("/sounds/rock.mp3");
    startSound.play();

    navigate("/create-monster");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center relative"
      style={{ backgroundImage: "url('/images/start.png')" }}
    >
      <div className="absolute inset-0 bg-black/60 z-0" />
      <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0)_40%,_rgba(0,0,0,0.8)_100%)]" />

      <div className="z-20 text-center text-white p-6 max-w-xl">
        <h1 className="text-5xl md:text-7xl font-bold mb-10 tracking-wide leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] font-[UnifrakturCook]">
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-500 to-red-600">
            A Arena Ancestral
          </span>
          <span className="block text-yellow-300">aguarda</span>
        </h1>

        <h3 className="mb-12 text-lg md:text-xl text-white/90 tracking-wide drop-shadow-sm animate-fade-in font-[MedievalSharp]">
          Ecos de batalhas antigas ressoam.
          <br className="hidden md:block" />
          Dois gigantes estão prestes a se revelar...
        </h3>

        <div className="p-8">
          <StoneButton onClick={handleStartClick} disabled={isStarting}>
            {isStarting ? "Carregando..." : "Iniciar"}
          </StoneButton>
        </div>
      </div>

      <SoundToggleButton />
    </div>
  );
};

export default Home;
