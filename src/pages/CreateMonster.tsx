import { MonsterForm } from "../forms/MonsterForm";

const CreateMonster = () => {
  return (
    <div
      className="w-screen h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('/images/start.png')" }}
    >
      <div className="absolute inset-0 bg-black/30 z-0" />

      <div className="absolute inset-0 z-10 flex items-center justify-center p-6">
        <MonsterForm />
      </div>
    </div>
  );
};

export default CreateMonster;
