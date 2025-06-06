import { useAmbientAudio } from "../hooks/useAmbientAudio";

export const SoundToggleButton = () => {
  const { isPlaying, toggleAudio } = useAmbientAudio();

  return (
    <button
      onClick={toggleAudio}
      aria-label={isPlaying ? "Desligar som" : "Ligar som"}
      className="
        fixed top-6 right-6 z-30
        bg-gradient-to-tr from-yellow-600 via-yellow-500 to-yellow-400
        border-4 border-yellow-800 rounded-md
        shadow-lg shadow-yellow-900/70
        text-yellow-900
        font-[MedievalSharp] text-lg
        px-5 py-2
        hover:bg-gradient-to-br hover:from-yellow-700 hover:via-yellow-600 hover:to-yellow-500
        active:scale-95
        transition-all duration-200
        select-none
        cursor-pointer
        flex items-center gap-2
        ring-2 ring-yellow-700
        focus:outline-none focus:ring-4 focus:ring-yellow-900
      "
    >
      {isPlaying ? (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11 5L6 9H3v6h3l5 4V5zM16 9a4 4 0 010 6"
            />
          </svg>
          Som Ligado
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5L4 9H1v6h3l5 4V5zM16 9a4 4 0 010 6M19 5l-6 6m0 0l6 6m-6-6h6"
            />
          </svg>
          Som Desligado
        </>
      )}
    </button>
  );
};
