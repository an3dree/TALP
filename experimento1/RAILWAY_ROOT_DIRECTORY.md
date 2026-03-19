# Como Configurar Root Directory no Railway

## ⚠️ IMPORTANTE

O repositório tem esta estrutura:
```
TALP/                    ← Raiz do Git
└── experimento1/        ← Projeto está aqui
    ├── package.json
    └── ...
```

Railway precisa saber que o projeto está em `experimento1/`, não na raiz.

## 📋 Passos no Railway Dashboard

### 1. Acesse o projeto no Railway

Vá para: https://railway.app/project/seu-projeto

### 2. Abra Settings

Click em **"Settings"** no menu lateral

### 3. Configure Root Directory

Procure por:
- **"Root Directory"** ou
- **"Service Settings"** → **"Root Directory"**

Digite:
```
experimento1
```

### 4. Salve e Redeploy

1. Click **"Save"** ou **"Update"**
2. Vá em **"Deployments"**
3. Click **"Redeploy"**

## ✅ O que Railway fará

```bash
# Antes (ERRO)
cd /TALP
npm install  # ❌ Não encontra package.json

# Depois (CORRETO)
cd /TALP/experimento1
npm install  # ✅ Encontra package.json
npm run build
npm run start:prod
```

## 🎯 Resultado Esperado

Logs do Railway mostrarão:

```
Building...
✓ Root directory set to: experimento1
✓ Found package.json
✓ Installing dependencies (npm install)
✓ Running build (npm run build)
✓ Starting server (npm run start:prod)

🚀 AqysProvas Backend rodando na porta 3001
```

## 🔗 URL de Acesso

Após deploy bem-sucedido:
- **Frontend**: https://seu-app.railway.app/
- **API**: https://seu-app.railway.app/api/health

---

**Resumo**: Configure `Root Directory = experimento1` nas Settings do Railway!
