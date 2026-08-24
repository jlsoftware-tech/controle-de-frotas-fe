# 🚚 Controle de Frotas (Frontend)

Este é o frontend da aplicação **Controle de Frotas**, construído para gerenciar operações de frota, veículos, motoristas e muito mais, oferecendo uma interface moderna e responsiva.

## 🛠️ Tecnologias Utilizadas

Este projeto foi desenvolvido utilizando as melhores ferramentas e práticas modernas do ecossistema React:

- **[React 19](https://react.dev/)** + **[Vite](https://vitejs.dev/)**: Framework e bundler ultrarrápido.
- **[TypeScript](https://www.typescriptlang.org/)**: Tipagem estática para maior segurança e escalabilidade.
- **[Tailwind CSS v4](https://tailwindcss.com/)**: Estilização utilitária moderna e rápida.
- **[Shadcn UI](https://ui.shadcn.com/)** & **[Radix UI](https://www.radix-ui.com/)**: Componentes de interface acessíveis e customizáveis.
- **[React Router DOM v7](https://reactrouter.com/)**: Roteamento da aplicação.
- **[TanStack React Query v5](https://tanstack.com/query/latest)**: Gerenciamento de estado assíncrono e cache de requisições.
- **[Zustand](https://zustand-demo.pmnd.rs/)**: Gerenciamento de estado global leve.
- **[React Hook Form](https://react-hook-form.com/)** & **[Zod](https://zod.dev/)**: Validação e gerenciamento de formulários.
- **[Axios](https://axios-http.com/)**: Cliente HTTP para comunicação com a API.
- **[Lucide React](https://lucide.dev/)**: Ícones elegantes e consistentes.

## 📋 Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas em seu ambiente de desenvolvimento:

- [Node.js](https://nodejs.org/en/) (Versão 20+ recomendada)
- [pnpm](https://pnpm.io/) (Gerenciador de pacotes utilizado no projeto)

## 🚀 Como Executar o Projeto

Siga os passos abaixo para rodar o projeto localmente:

1. **Clone o repositório (ou acesse a pasta do projeto):**
   ```bash
   cd controle-de-frotas-fe
   ```

2. **Instale as dependências:**
   ```bash
   pnpm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   pnpm dev
   ```

4. **Acesse a aplicação:**
   Abra seu navegador e acesse `http://localhost:5173`.

## 📜 Scripts Disponíveis

No diretório do projeto, você pode executar os seguintes comandos (usando `pnpm`):

- `pnpm dev`: Inicia a aplicação em modo de desenvolvimento.
- `pnpm build`: Compila a aplicação para produção na pasta `dist`.
- `pnpm lint`: Executa o ESLint para encontrar e corrigir problemas no código.
- `pnpm format`: Formata o código do projeto usando Prettier.
- `pnpm preview`: Inicia um servidor local para visualizar a build de produção.

## 📂 Estrutura do Projeto

A estrutura base do código fonte na pasta `src/` segue um padrão de organização focado na escalabilidade:

- `assets/`: Arquivos estáticos como imagens, fontes, etc.
- `components/`: Componentes reutilizáveis (incluindo componentes do Shadcn UI).
- `pages/` (ou `features/`): Páginas e telas da aplicação.
- `services/`: Configuração do Axios e chamadas à API.
- `store/`: Configuração dos estados globais utilizando Zustand.
- `utils/`: Funções auxiliares e utilitários.
- `hooks/`: Hooks customizados do React.

---
*Desenvolvido com 💙 para uma gestão eficiente de frotas.*
