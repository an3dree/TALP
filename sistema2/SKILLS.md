# SKILLS.md - Fullstack TypeScript (React & Node)

Este arquivo detalha os comandos e padrões técnicos para a execução do projeto.

## Stack
  - Node com TypeScript no Backend
  - React com TypeScript no frontend
  - Não utilize bibliotecas externas a menos que seja estritamente necessário
  - Persistência de dados em Json local 

## Comandos de Ambiente (Node/Backend)
- **Inicialização:** `npm init -y` e `npm install typescript ts-node-dev @types/node -D`
- **Build:** `tsc`
- **Execução Dev:** `npm run dev` (mapeado para `ts-node-dev --respawn src/server.ts`)
- **Padrão de API:** Utilize Express com controladores tipados.

## Comandos de Ambiente (React/Frontend)
- **Criação:** `npm create vite@latest frontend -- --template react-ts`
- **Estilização:** Utilize de componentes próprios reutilizaveis e limpos.
- **Gerenciamento de Estado:** Priorize `React Query` (TanStack Query) para chamadas de API e sincronização com o servidor.

## Padrão de Diretórios Sugerido
- `/shared`: Contratos de tipos (interfaces) usados tanto no Front quanto no Back.
- `/backend`: `/src` (domain, infra, interfaces).
- `/frontend`: `/src` (components, hooks, services).
