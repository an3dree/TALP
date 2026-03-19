# 🚀 Deploy no Railway

Este guia explica como fazer deploy do AqysProvas (monorepo fullstack) no Railway.

## 📋 Pré-requisitos

1. Conta no [Railway.app](https://railway.app)
2. Repositório Git (GitHub/GitLab/Bitbucket) do projeto
3. Conta conectada ao Railway

## 🏗️ Estrutura Preparada para Railway

O projeto está configurado para deploy no Railway como **monorepo** com:

### Arquivos de Configuração

- **`railway.json`** - Configuração do Railway (builder, start command)
- **`Procfile`** - Define o comando de inicialização
- **`.nvmrc`** - Especifica Node.js v20
- **`package.json`** - Scripts unificados de build e start

### Scripts NPM

```json
{
  "build": "npm run build:backend && npm run build:frontend",
  "build:backend": "tsc",
  "build:frontend": "cd frontend && npm install && npm run build",
  "postbuild": "npm run copy:frontend",
  "copy:frontend": "mkdir -p dist/public && cp -r frontend/dist/* dist/public/",
  "start:prod": "npm run build && npm start"
}
```

### Arquitetura de Deploy

```
Requisição → Railway (Porta Dinâmica)
              ↓
         Express Server
              ↓
    ┌─────────┴──────────┐
    ↓                    ↓
/api/*               /*
Backend REST      Frontend SPA
(JSON)            (HTML/CSS/JS)
```

**Backend**: Serve API REST em `/api/*`  
**Frontend**: Servido como arquivos estáticos de `dist/public/`  
**Routing**: Catch-all `/*` retorna `index.html` (suporte SPA)

## 🚀 Passo a Passo do Deploy

### 1. Push para Repositório Git

```bash
cd /home/andre/workspace/cin/TALP/experimento1

# Inicializar git (se ainda não foi)
git init
git add .
git commit -m "feat: setup Railway deployment"

# Adicionar remote e push
git remote add origin https://github.com/seu-usuario/aqysprovas.git
git push -u origin main
```

### 2. Criar Projeto no Railway

1. Acesse [railway.app](https://railway.app)
2. Click **"New Project"**
3. Selecione **"Deploy from GitHub repo"**
4. Escolha o repositório `aqysprovas`
5. Railway detecta automaticamente Node.js

### 3. Configurar Variáveis de Ambiente

No painel do Railway, vá em **Variables** e adicione:

```env
NODE_VERSION=20
PORT=<railway-gera-automaticamente>
```

**Importante**: Railway gera `PORT` automaticamente. Não sobrescreva.

### 4. Deploy Automático

Railway automaticamente:
1. ✅ Executa `npm install`
2. ✅ Executa `npm run build` (compila backend + frontend)
3. ✅ Executa `npm run copy:frontend` (copia frontend para dist/public)
4. ✅ Inicia com `npm run start:prod`

### 5. Verificar Deploy

Após deploy concluído:

1. Railway fornece URL pública: `https://seu-app.railway.app`
2. Acesse a URL para testar o frontend
3. Teste API: `https://seu-app.railway.app/api/health`

**Resposta esperada**:
```json
{
  "status": "ok",
  "message": "AqysProvas API is running"
}
```

## 🔧 Configurações Avançadas

### Custom Domain (Opcional)

1. No Railway, vá em **Settings → Domains**
2. Click **Generate Domain** ou **Add Custom Domain**
3. Configure DNS conforme instruções

### Logs e Monitoramento

```bash
# Ver logs em tempo real no Railway Dashboard
# Ou usar Railway CLI
railway logs
```

### Persistência de Dados

⚠️ **Importante**: Railway usa **sistema de arquivos efêmero**. Dados em `data/*.json` serão perdidos a cada redeploy.

**Soluções**:

#### Opção 1: Railway Volume (Persistência)

```json
// railway.json
{
  "deploy": {
    "volumes": [
      {
        "mountPath": "/app/data",
        "name": "aqysprovas-data"
      }
    ]
  }
}
```

#### Opção 2: Banco de Dados Externo

Migrar de JSON para:
- **PostgreSQL** (Railway fornece gratuitamente)
- **MongoDB Atlas**
- **Supabase**

### Variáveis de Ambiente Adicionais

```env
NODE_ENV=production
LOG_LEVEL=info
```

## 🧪 Testar Localmente como Produção

```bash
# Build completo (backend + frontend)
npm run build

# Iniciar servidor
npm start

# Acesse http://localhost:3001
# Frontend + Backend na mesma porta
```

## 📊 Monitoramento

Railway fornece:
- ✅ Logs em tempo real
- ✅ Métricas de CPU/RAM
- ✅ Status de deploy
- ✅ Histórico de builds

## ⚠️ Troubleshooting

### Erro: "Module not found"

```bash
# Certifique-se que todas as dependências estão em package.json
npm install --save <pacote-faltando>
git add package.json package-lock.json
git commit -m "fix: add missing dependency"
git push
```

### Erro: "Port already in use"

Railway gerencia a porta automaticamente via `process.env.PORT`.  
Não force porta fixa em produção.

### Build Timeout

Se build demora muito:

```json
// railway.json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build"
  }
}
```

### Frontend não carrega

Verifique:
1. `dist/public/` contém `index.html` e `assets/`
2. `server.ts` tem `app.use(express.static(frontendPath))`
3. Catch-all route está após todas as rotas de API

## 🔄 CI/CD Automático

Railway faz deploy automático em cada push para `main`:

```bash
git add .
git commit -m "feat: nova funcionalidade"
git push origin main
# Railway detecta push e faz deploy automaticamente
```

## 📱 Configurações de Rollback

Railway mantém histórico de deploys. Para rollback:

1. Vá em **Deployments**
2. Selecione deploy anterior
3. Click **Redeploy**

## 💰 Custos

**Railway Free Tier**:
- ✅ $5 crédito mensal
- ✅ Suficiente para projetos pequenos/acadêmicos
- ⚠️ Aplicação hiberna após inatividade

**Pro Plan** ($20/mês):
- Sem hibernação
- Mais recursos
- Custom domains ilimitados

## 📚 Referências

- [Railway Docs](https://docs.railway.app)
- [Railway CLI](https://docs.railway.app/develop/cli)
- [Nixpacks](https://nixpacks.com/docs)

---

**Resumo dos Comandos**:

```bash
# Local
npm run build       # Build completo
npm start          # Iniciar produção local

# Deploy
git push origin main   # Railway faz deploy automático

# Logs
railway logs          # Ver logs (requer Railway CLI)
```

✅ **Projeto pronto para deploy no Railway!**
