# AqysProvas

Sistema fullstack de gerenciamento de provas desenvolvido com Node.js + TypeScript (backend) e React (frontend).

## Estrutura do Projeto

```
/
├── src/              # Código fonte TypeScript
├── features/         # Testes BDD com Gherkin/Cucumber
├── data/             # Arquivos JSON de persistência
├── dist/             # Código compilado
└── reports/          # Relatórios de testes
```

## Comandos

- `npm install` - Instalar dependências
- `npm run build` - Compilar TypeScript
- `npm test` - Executar testes
- `npm run dev` - Executar servidor backend em modo desenvolvimento
- `npm start` - Executar servidor backend em produção (após build)

## Iniciar o Backend

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3001`

Endpoints principais:
- Health check: `GET http://localhost:3001/api/health`
- Questões: `http://localhost:3001/api/questions`
- Provas: `http://localhost:3001/api/exams`

## Stack Tecnológica

**Backend:**
- Node.js + TypeScript
- Express (API REST)
- Cucumber (Testes BDD)
- JSON (Persistência local)

**Frontend:**
- React (a ser implementado)

**Comunicação:**
- API REST (CORS habilitado)
