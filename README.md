# Monster Battle Arena 🐉⚔️

Este projeto é uma aplicação front-end interativa para batalhas entre monstros. Os monstros são criados com atributos específicos, e a batalha é realizada com base em regras de combate definidas por lógica de negócio separada da interface.

## 🎨 Inspiração Visual e Assets
Toda a interface da aplicação foi inspirada no estilo visual do jogo de cartas Gwent, do universo The Witcher. O objetivo foi criar uma ambientação medieval, com foco em imersão e estilo próprio para a arena de batalha entre monstros.

## 🖼️ Fontes de imagens e texturas
As imagens dos monstros foram geradas com auxílio do ChatGPT.

Texturas e elementos gráficos adicionais foram obtidos em:

- [Textures](https://www.textures.com/library)
- [Pixbay](pixabay.com)


## 🔥 Funcionalidades

- Criação de monstros com atributos personalizados.
- Batalha entre dois monstros com regras pré-definidas.
- Limite de 10 rodadas por batalha.
- Interface com estilo medieval e botões estilizados.
- Regras rigorosas para validação e execução da batalha.

## 🧱 Tecnologias Utilizadas

- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zod](https://zod.dev/) (para validação de dados)
- Arquitetura limpa (entities, usecases, repositories, etc.)
- [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) para testes

## 🗂️ Estrutura do Projeto

```
src/
│
├── components/           # Componentes visuais reutilizáveis
├── domain/
│   ├── entities/         # Entidades do domínio (Monster, BattleResult, etc.)
│   ├── battle/           # Engine de batalha
│   └── rules/            # Constantes e regras de negócio
│
├── hooks/                # Hooks customizados
├── pages/                # Páginas da aplicação (Home, CreateMonster, Battle)
├── repositories/         # Implementações temporárias sem backend
├── usecases/             # Casos de uso: criação de monstro, início de batalha
├── index.css             # Estilos próprios
```

## 🚀 Como Rodar o Projeto

### 1. Clone o repositório

```bash
git clone https://github.com/leogianluca/judgment-of-the-beasts.git
cd udgment-of-the-beasts
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em \`http://localhost:5173\`.

## ✅ Rodando os Testes

```bash
npm run test
```

Os testes estão localizados em arquivos \`.test.ts\` e cobrem:
- Criação de monstros válidos e inválidos
- Lógica de batalha (ataques, desempates, fim da batalha)
- Limites de rounds

## 📐 Regras da Batalha

- O monstro mais rápido ataca primeiro.
- Dano = ataque - defesa do oponente (mínimo de 1).
- Monstros não podem ter HP negativo.
- Empates são resolvidos de forma declarada (ex: ambos morrem na última rodada).
- Batalha com no máximo 10 rodadas.
- Clonagem de instâncias para preservar imutabilidade.
