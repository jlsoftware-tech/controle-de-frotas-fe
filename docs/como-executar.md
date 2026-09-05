# Como Executar o Projeto

Este documento explica como você pode rodar a aplicação frontend do Controle de Frotas de duas maneiras: em **Modo de Desenvolvimento (Localmente)** e em **Produção (usando Docker)**.

## 💻 1. Modo de Desenvolvimento (Localmente)

Utilize este modo quando você estiver escrevendo código e quiser ver as alterações refletidas instantaneamente na tela.

### Passos:

1. Certifique-se de ter o [Node.js](https://nodejs.org/) (versão 20 ou superior) e o [pnpm](https://pnpm.io/) instalados no seu computador.
2. Abra o terminal na raiz do projeto (`controle-de-frotas-fe`).
3. Instale as dependências executando:
   ```bash
   pnpm install
   ```
4. Inicie o servidor local:
   ```bash
   pnpm dev
   ```
5. Acesse a aplicação no seu navegador: **http://localhost:5173**

---

## 🐋 2. Modo de Desenvolvimento (com Docker Compose)

Utilize este modo se você não quiser instalar o Node.js na sua máquina, mas ainda quiser ver as alterações no código em tempo real.

### Passos:

1. Certifique-se de ter o [Docker](https://www.docker.com/) rodando na sua máquina.
2. Abra o terminal na raiz do projeto.
3. Suba o ambiente de desenvolvimento executando:
   ```bash
   docker compose up -d
   ```
4. Acesse a aplicação no seu navegador: **http://localhost:5173**
   _(Qualquer alteração no seu código será refletida no container automaticamente graças aos Volumes do Docker)._
5. Para parar o ambiente de desenvolvimento, rode:
   ```bash
   docker compose down
   ```

---

## 🐳 3. Modo de Produção (com Docker)

Utilize este modo para testar a aplicação exatamente como ela irá rodar em um ambiente de produção (usando arquivos compilados otimizados e um servidor Nginx).

### Passos:

1. Certifique-se de ter o [Docker](https://www.docker.com/) rodando na sua máquina.
2. Abra o terminal na raiz do projeto.
3. Construa a imagem Docker executando:
   ```bash
   docker build -t controle-de-frotas-fe .
   ```
4. Inicie o container a partir da imagem gerada:
   ```bash
   docker run -d -p 8080:80 --name controle-de-frotas controle-de-frotas-fe
   ```
5. Acesse a aplicação de produção no navegador: **http://localhost:8080**

### Comandos Úteis do Docker

- **Parar o container:**
  ```bash
  docker stop controle-de-frotas
  ```
- **Iniciar o container pausado:**
  ```bash
  docker start controle-de-frotas
  ```
- **Remover o container (para criar um novo do zero):**
  ```bash
  docker rm -f controle-de-frotas
  ```
