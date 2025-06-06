import { useForm, type FieldErrors } from "react-hook-form";
import type { MonsterCreateInput } from "../types";
import { createMonster } from "../usecases/createMonster";
import { MonsterCard } from "../components/MonsterCard";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type { Monster } from "../domain/entities/Monster";

export const MonsterForm = () => {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [monstersCreated, setMonstersCreated] = useState<Monster[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
  } = useForm<MonsterCreateInput>({
    defaultValues: {
      name: "",
      hp: 100,
      attack: 10,
      defense: 5,
      speed: 5,
      imageUrl: "",
    },
  });

  const name = watch("name");
  const hp = watch("hp");
  const attack = watch("attack");
  const defense = watch("defense");
  const speed = watch("speed");
  const imageUrl = watch("imageUrl");

  const onSubmit = (data: MonsterCreateInput) => {
    try {
      const monster = createMonster(data);
      setMonstersCreated((prev) => [...prev, monster]);
      reset();
      setSuccessMessage(`🛡️ ${monster.name} criado com sucesso!`);

      const audio = new Audio("/sounds/dragon-growl.mp3");
      audio.addEventListener("canplaythrough", () => {
        audio.currentTime = 1;
        audio.play();
      });

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "errors" in err) {
        const errorObj = err as { errors?: { message?: string }[] };
        const errorText = errorObj.errors?.[0]?.message ?? "Erro ao criar monstro";
        setErrorMessage(`❌ ${errorText}`);
      } else {
        setErrorMessage("❌ Erro ao criar monstro");
      }

      setTimeout(() => setErrorMessage(""), 4000);
    }

  };

  const onError = (errors: FieldErrors<MonsterCreateInput>) => {
    const firstErrorKey = Object.keys(errors)[0] as keyof MonsterCreateInput;

    const firstErrorMessage =
      (errors[firstErrorKey] as { message?: string } | undefined)?.message ||
      "Erro no formulário";

    setErrorMessage(`❌ ${firstErrorMessage}`);
    setTimeout(() => setErrorMessage(""), 4000);
  };

  useEffect(() => {
    if (monstersCreated.length === 2) {
      const [monster1, monster2] = monstersCreated;
      navigate("/battle", { state: { monster1, monster2 } });
    }
  }, [monstersCreated, navigate]);

  return (
    <div className="flex flex-col md:flex-row items-start justify-center gap-12 px-6 py-12 font-[MedievalSharp]">
      {monstersCreated.length < 2 && (
        <>
          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="w-full max-w-xl bg-[url('/textures/papiro.jpg')] bg-cover bg-no-repeat bg-center rounded-3xl p-8 font-[MedievalSharp] border-2 relative"
            style={{
              borderColor: "#d4af37",
              boxShadow: "0 0 15px 3px rgba(212, 175, 55, 0.8), inset 0 0 10px 2px rgba(212, 175, 55, 0.6)",
            }}
          >
            <h2 className="text-3xl text-white font-bold text-center mb-6 drop-shadow-md">
              Criar Monstro
            </h2>

            {successMessage && (
              <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 text-white text-2xl font-bold py-4 px-8 rounded-xl border-2 border-yellow-600 shadow-2xl bg-[url('/images/papiro-texture.jpg')] bg-cover bg-center drop-shadow-md animate-fadeIn backdrop-blur-md">
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 text-red-100 text-2xl font-bold py-4 px-8 rounded-xl border-2 border-red-600 shadow-2xl bg-[url('/images/papiro-texture.jpg')] bg-cover bg-center drop-shadow-md animate-fadeIn backdrop-blur-md">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="sm:col-span-2">
                <label className="block text-white font-semibold">Nome</label>
                <input
                  {...register("name", { required: "O campo Nome é obrigatório" })}
                  className="w-full rounded bg-white p-2 border border-black text-black shadow-inner"
                  placeholder="Ex: Dragão Flamejante"
                />
              </div>

              <div>
                <label className="block text-white font-semibold">HP</label>
                <input
                  type="number"
                  min={1}
                  {...register("hp", {
                    required: "O campo HP é obrigatório",
                    valueAsNumber: true,
                    validate: (v) => v > 0 || "HP deve ser maior que zero",
                  })}
                  className="w-full rounded bg-white p-2 border border-black text-black shadow-inner"
                />
              </div>

              <div>
                <label className="block text-white font-semibold">Ataque</label>
                <input
                  type="number"
                  min={1}
                  {...register("attack", {
                    required: "O campo Ataque é obrigatório",
                    valueAsNumber: true,
                    validate: (v) => v > 0 || "Ataque deve ser maior que zero",
                  })}
                  className="w-full rounded bg-white p-2 border border-black text-black shadow-inner"
                />
              </div>

              <div>
                <label className="block text-white font-semibold">Defesa</label>
                <input
                  type="number"
                  min={1}
                  {...register("defense", {
                    required: "O campo Defesa é obrigatório",
                    valueAsNumber: true,
                    validate: (v) => v > 0 || "Defesa deve ser maior que zero",
                  })}
                  className="w-full rounded bg-white p-2 border border-black text-black shadow-inner"
                />
              </div>

              <div>
                <label className="block text-white font-semibold">Velocidade</label>
                <input
                  type="number"
                  min={1}
                  {...register("speed", {
                    required: "O campo Velocidade é obrigatório",
                    valueAsNumber: true,
                    validate: (v) => v > 0 || "Velocidade deve ser maior que zero",
                  })}
                  className="w-full rounded bg-white p-2 border border-black text-black shadow-inner"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-white font-semibold">URL da Imagem</label>
                <input
                  type="url"
                  {...register("imageUrl", { required: "O campo URL da Imagem é obrigatório" })}
                  className="w-full rounded bg-white p-2 border border-black text-black shadow-inner"
                  placeholder="https://..."
                />
              </div>
            </div>

            <button type="submit" className="btn-iron-sm w-full">
              Criar
              <span className="fragment-1" />
              <span className="fragment-2" />
              <span className="fragment-3" />
              <span className="fragment-4" />
            </button>
          </form>

          <div>
            <MonsterCard
              name={name}
              hp={hp}
              attack={attack}
              defense={defense}
              speed={speed}
              imageUrl={imageUrl}
            />
          </div>
        </>
      )}
    </div>
  );
};
