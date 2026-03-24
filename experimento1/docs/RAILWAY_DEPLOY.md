# 🚀 Deploy no Railway - Configuração Monorepo

Este guia explica como fazer deploy do AqysProvas no Railway considerando a estrutura de **monorepo** onde o projeto está dentro de um subdiretório.

## 📁 Estrutura do Repositório

```
TALP/                           ← Raiz do repositório Git
└── experimento1/               ← Projeto AqysProvas aqui
    ├── src/                    ← Backend
    ├── frontend/               ← Frontend
    ├── package.json
    ├── railway.toml            ← Configuração Railway
    └── ...
```

## ⚠️ Problema Comum

Railway por padrão tenta fazer build da **raiz do repositório**. Se seu `package.json` está em um subdiretório, você verá:

```
⚠ Script start.sh not found
✖ Railpack could not determine how to build the app.
```

## ✅ Solução: Configurar Root Directory

Há **duas formas** de resolver:

### Opção 1: Via Interface do Railway (Recomendado)

1. Acesse o projeto no Railway Dashboard
2. Vá em **Settings**
3. Na seção **Build**, configure:
   - **Root Directory**: `experimento1`
   - **Build Command**: `npm run build` (opcional, Railway detecta)
   - **Start Command**: `npm run start:prod` (opcional, Railway detecta)
4. Click **Deploy** novamente

### Opção 2: Via railway.toml (Já Configurado)

O arquivo `railway.toml` já está criado no projeto:

```toml
[build]
builder = "NIXPACKS"
buildCommand = "npm run build"

[deploy]
startCommand = "npm run start:prod"
restartPolicyType = "on-failure"
restartPolicyMaxRetries = 10
```

**IMPORTANTE**: Você ainda precisa configurar o **Root Directory** na interface:
- Railway **NÃO** lê `rootDirectory` do `railway.toml`
- Deve ser configurado em **Settings → Root Directory**

## 🚀 Passo a Passo Completo

### 1. Commit e Push

```bash
cd /home/andre/workspace/cin/TALP/experimento1
git add .
git commit -m "feat: Railway deployment config"
cd ..
git push origin main
```

### 2. Criar Projeto no Railway

1. Acesse [railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub repo**
3. Selecione repositório **TALP**
4. Railway tenta fazer build → **FALHA** (esperado)

### 3. Configurar Root Directory

1. No Railway Dashboard, vá em **Settings**
2. Procure por **Root Directory** ou **Service Settings**
3. Configure:
   ```
   Root Directory: experimento1
   ```
4. **Save Changes**

### 4. Redeploy

1. Vá em **Deployments**
2. Click **Deploy** ou **Redeploy**
3. Railway agora encontra `package.json` em `experimento1/`
4. Build deve funcionar:
   ```
   ✓ Found package.json
   ✓ Installing dependencies
   ✓ Running npm run build
   ✓ Starting with npm run start:prod
   ```

### 5. Verificar Deploy

Railway fornece URL pública: `https://seu-app.railway.app`

Teste:
- **Frontend**: `https://seu-app.railway.app/`
- **API Health**: `https://seu-app.railway.app/api/health`

## 🎯 Configurações no Railway Dashboard

### Settings → Build

```
Root Directory: experimento1
Build Command: npm run build (Railway detecta automaticamente)
Install Command: npm install (Railway detecta automaticamente)
```

### Settings → Deploy

```
Start Command: npm run start:prod (ou Railway usa package.json)
Restart Policy: On Failure
```

### Variables

Railway gera automaticamente:
```env
PORT=<gerado-pelo-railway>
NODE_VERSION=20 (detecta de .nvmrc)
```

Adicione se necessário:
```env
NODE_ENV=production
```

## 📊 Estrutura de Deploy

```
GitHub: TALP/experimento1/
         ↓
Railway detecta subdiretório
         ↓
cd experimento1/
npm install
npm run build (compila backend + frontend)
npm run start:prod
         ↓
Express Server (porta dinâmica)
         ↓
    ┌────┴─────┐
    ↓          ↓
 /api/*     /*
Backend    Frontend
```

## 🔧 Troubleshooting

### Erro: "Script start.sh not found"

**Causa**: Railway não encontra `package.json` (está procurando na raiz)

**Solução**:
1. Settings → Root Directory → `experimento1`
2. Save e Redeploy

### Erro: "Module not found"

**Causa**: Dependências não instaladas corretamente

**Solução**:
```bash
# Localmente, teste:
cd /home/andre/workspace/cin/TALP/experimento1
rm -rf node_modules frontend/node_modules
npm run build
```

Se funcionar local, funciona no Railway.

### Erro: "Port already in use"

**Causa**: Porta hardcoded no código

**Solução**: `src/server.ts` já usa `process.env.PORT || 3001` ✅

### Build Timeout

**Causa**: Frontend build demora muito

**Solução**: Railway oferece até 20 minutos, mas configure:
```toml
[build]
watchPatterns = ["src/**", "frontend/src/**"]
```

### Dados não persistem

**Causa**: Filesystem efêmero do Railway

**Solução**:
1. **Railway Volumes** (persistência)
   - Settings → Volumes
   - Mount Path: `/app/data`
   
2. **PostgreSQL** (Railway fornece grátis)
   - Add Database → PostgreSQL
   - Migrar de JSON para SQL

## 📝 Variáveis de Ambiente Úteis

```env
# Railway gera automaticamente
PORT=<dinamico>
RAILWAY_ENVIRONMENT=production

# Adicionar manualmente se necessário
NODE_ENV=production
LOG_LEVEL=info
```

## 🔄 CI/CD Automático

Railway faz deploy automático:

```bash
cd /home/andre/workspace/cin/TALP
git add experimento1/
git commit -m "feat: nova funcionalidade"
git push origin main
# Railway detecta push → redeploy automático
```

## 📱 Monitoramento

Railway Dashboard mostra:
- ✅ Logs em tempo real
- ✅ CPU/RAM usage
- ✅ Request metrics
- ✅ Deploy history

## 💡 Dicas

### Deploy mais rápido

Configure `.railwayignore` (como `.gitignore`):
```
node_modules/
.git/
*.log
tests/
features/
```

### Múltiplos ambientes

Crie branches:
- `main` → Produção
- `dev` → Staging

Railway pode criar serviço separado para cada branch.

### Custom Domain

1. Settings → Domains
2. Add Custom Domain
3. Configure DNS (CNAME):
   ```
   app.seudominio.com → seu-app.railway.app
   ```

## 🆘 Suporte

- [Railway Docs](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [Railway Templates](https://railway.app/templates)

## 📋 Checklist de Deploy

- [x] `railway.toml` criado em `experimento1/`
- [x] `.nvmrc` com Node.js v20
- [x] `package.json` com script `start:prod`
- [x] Frontend build configurado
- [ ] Push para GitHub
- [ ] Criar projeto no Railway
- [ ] **Configurar Root Directory: `experimento1`** ⚠️ **CRUCIAL**
- [ ] Redeploy
- [ ] Testar URL fornecida

## 🎉 Resumo

**Comando mais importante**:
```
Railway Settings → Root Directory → experimento1
```

Sem isso, Railway não encontra seu `package.json`!

---

✅ **Projeto pronto para deploy no Railway com estrutura de monorepo!**
