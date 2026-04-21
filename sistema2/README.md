# Aqys Alunos - Sistema de Gerenciamento

Sistema web fullstack para gerenciamento de alunos, turmas e avaliações.

## Estrutura do Projeto

```
sistema2/
├── shared/           # Tipos e interfaces compartilhadas (TypeScript)
├── backend/          # API Node.js com Express e TypeScript
│   ├── src/
│   │   ├── domain/       # Regras de negócio e serviços
│   │   ├── infra/        # Repositórios e serviços de infraestrutura
│   │   ├── interfaces/   # Controllers da API
│   │   └── server.ts     # Servidor Express
│   └── data/         # Arquivos JSON de persistência
└── frontend/         # Aplicação React com TypeScript
    └── src/
        ├── components/   # Componentes de página
        ├── hooks/        # React Query hooks
        └── services/     # Cliente API
```

## Tecnologias

### Backend
- Node.js com TypeScript
- Express para API REST
- Persistência em arquivos JSON
- Clean Architecture (Domain, Infra, Interfaces)

### Frontend
- React com TypeScript
- Vite como bundler
- TanStack Query (React Query) para gerenciamento de estado
- CSS Modules para estilização

## Como Executar

### Backend

```bash
cd backend
npm install
npm run dev
```

O servidor rodará em `http://localhost:3001`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

A aplicação rodará em `http://localhost:5173`

## Funcionalidades

1. **Gerenciamento de Alunos**
   - Cadastro, edição e remoção de alunos
   - Campos: nome, CPF, email

2. **Gerenciamento de Turmas**
   - Cadastro, edição e remoção de turmas
   - Matrícula e desmatrícula de alunos
   - Campos: tópico, ano, semestre

3. **Avaliações por Metas**
   - Matriz de avaliação por turma
   - Conceitos: MANA (Meta Ainda Não Atingida), MPA (Meta Parcialmente Atingida), MA (Meta Atingida)
   - Notificação pendente quando avaliações são alteradas

4. **Persistência**
   - Dados salvos em arquivos JSON:
     - `backend/data/alunos.json`
     - `backend/data/turmas.json`
     - `backend/data/notificacoes.json`

## Arquitetura

O projeto segue os princípios de:
- **Tipagem Estrita**: Sem uso de `any`, interfaces compartilhadas entre front e back
- **Clean Architecture**: Separação de domínio, infraestrutura e interfaces
- **Pure Functions**: Lógica de negócio isolada de efeitos colaterais
- **Componentes Atômicos**: Frontend organizado em componentes reutilizáveis

## Endpoints da API

### Alunos
- `GET /api/alunos` - Lista todos os alunos
- `GET /api/alunos/:id` - Busca aluno por ID
- `POST /api/alunos` - Cria novo aluno
- `PUT /api/alunos/:id` - Atualiza aluno
- `DELETE /api/alunos/:id` - Remove aluno

### Turmas
- `GET /api/turmas` - Lista todas as turmas
- `GET /api/turmas/:id` - Busca turma por ID
- `POST /api/turmas` - Cria nova turma
- `PUT /api/turmas/:id` - Atualiza turma
- `DELETE /api/turmas/:id` - Remove turma
- `POST /api/turmas/matricular` - Matricula aluno em turma
- `DELETE /api/turmas/:turmaId/alunos/:alunoId` - Desmatricula aluno
- `POST /api/turmas/avaliar` - Registra avaliação de aluno
