# 🚚 Controle de Frotas (Frontend)

<div align="center">
  <img alt="React" src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" />
  <img alt="TailwindCSS" src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img alt="Docker" src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" />
</div>
<br>

Este é o frontend da aplicação **Controle de Frotas**, construído para gerenciar operações de frota, veículos, motoristas e muito mais, oferecendo uma interface moderna, rápida e responsiva. O projeto foi projetado com foco em usabilidade e escalabilidade, funcionando perfeitamente em ambientes locais ou conteinerizados.

---

## 🛠️ Tecnologias Utilizadas

O projeto emprega ferramentas modernas do ecossistema React para garantir alta performance, segurança e uma excelente experiência de desenvolvimento (DX).

- **[React 19](https://react.dev/)** + **[Vite](https://vitejs.dev/)**: Framework e bundler ultrarrápido para desenvolvimento moderno.
- **[TypeScript](https://www.typescriptlang.org/)**: Tipagem estática oferecendo maior segurança e produtividade no desenvolvimento.
- **[Tailwind CSS v4](https://tailwindcss.com/)**: Estilização utilitária de ponta, permitindo a construção rápida de interfaces customizadas.
- **[Shadcn UI](https://ui.shadcn.com/)** & **[Radix UI](https://www.radix-ui.com/)**: Biblioteca de componentes de interface modulares, acessíveis e altamente customizáveis.
- **[React Router DOM v7](https://reactrouter.com/)**: Roteamento robusto da aplicação.
- **[TanStack React Query v5](https://tanstack.com/query/latest)**: Gerenciamento de estado assíncrono, cache e sincronização de dados.
- **[Zustand](https://zustand-demo.pmnd.rs/)**: Gerenciamento de estado global leve e escalável.
- **[React Hook Form](https://react-hook-form.com/)** & **[Zod](https://zod.dev/)**: Validação consistente e gerenciamento de estados de formulários.
- **[Axios](https://axios-http.com/)**: Cliente HTTP para comunicação eficiente com a API do backend.
- **[Lucide React](https://lucide.dev/)**: Biblioteca de ícones elegantes, limpos e consistentes.
- **[Docker](https://www.docker.com/)**: Containerização da aplicação para implantação simplificada em qualquer ambiente.

---

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de ter as seguintes ferramentas instaladas:

- [Node.js](https://nodejs.org/en/) (Versão 20+ recomendada)
- [pnpm](https://pnpm.io/) (Gerenciador de pacotes rápido e eficiente)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) (Caso opte pela execução via containers)

---

## 🚀 Como Executar o Projeto

Você pode rodar este projeto de duas maneiras: utilizando seu ambiente local ou através do Docker. 

### 1️⃣ Clone o repositório
Independente da forma escolhida, o primeiro passo é clonar ou acessar o repositório e navegar até a pasta do projeto:
```bash
cd controle-de-frotas-fe
```

### 💻 Opção A: Execução Local (com pnpm)

1. **Instale as dependências:**
   ```bash
   pnpm install
   ```

2. **Inicie o servidor de desenvolvimento:**
   ```bash
   pnpm dev
   ```

3. **Acesse a aplicação:**
   Abra seu navegador e acesse [http://localhost:5173](http://localhost:5173).

### 🐳 Opção B: Execução via Docker (Recomendado para Produção/Homologação)

O projeto já conta com toda a configuração de containers pronta (`Dockerfile` e `docker-compose.yml`), rodando por trás de um servidor Nginx otimizado.

1. **Inicie os containers:**
   ```bash
   docker-compose up -d
   ```
   *(A flag `-d` executa os containers em segundo plano - detached mode).*

2. **Acesse a aplicação:**
   Abra seu navegador e acesse [http://localhost:8080](http://localhost:8080) (ou a porta correspondente definida no docker-compose).

3. **Para parar a execução:**
   ```bash
   docker-compose down
   ```

---

## 📜 Scripts Disponíveis

Se você estiver rodando localmente (sem Docker), você pode executar os seguintes comandos:

- `pnpm dev`: Inicia a aplicação em modo de desenvolvimento com Hot Module Replacement (HMR).
- `pnpm build`: Compila e otimiza a aplicação para produção, gerando a pasta `dist`.
- `pnpm lint`: Executa o ESLint para encontrar e corrigir problemas no código fonte.
- `pnpm format`: Formata o código do projeto usando Prettier para manter um estilo de código consistente.
- `pnpm preview`: Inicia um servidor local servindo a pasta `dist` para visualizar e testar a build de produção localmente.

---

## 📂 Estrutura do Projeto

A organização do código dentro de `src/` segue um padrão voltado à escalabilidade e manutenção:

```
src/
├── assets/      # Arquivos estáticos (imagens, fontes, etc.)
├── components/  # Componentes reutilizáveis (incluindo Shadcn UI)
├── hooks/       # Hooks customizados do React
├── pages/       # Páginas principais da aplicação e regras de negócio
├── services/    # Configuração do Axios e chamadas à API
├── store/       # Configuração de estado global (Zustand)
└── utils/       # Funções utilitárias, formatadores, etc.
```
