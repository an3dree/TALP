# Documentação do Frontend - AqysProvas

## Visão Geral

O frontend do **AqysProvas** é uma aplicação React desenvolvida com TypeScript que fornece uma interface completa para gerenciamento de questões, criação de provas, geração de PDFs e correção automática.

**Stack:**
- React 19.0.0
- TypeScript 5.7.3
- Vite 6.0.11 (build tool)
- jsPDF (geração de PDFs)

---

## Arquitetura

### Estrutura de Diretórios

```
frontend/
├── src/
│   ├── main.tsx              # Entry point da aplicação
│   ├── App.tsx               # Componente raiz
│   ├── pages/                # Páginas principais
│   │   ├── QuestionsPage.tsx
│   │   ├── ExamsPage.tsx
│   │   ├── GeneratePage.tsx
│   │   └── CorrectionPage.tsx
│   ├── components/           # Componentes reutilizáveis
│   │   └── Tabs.tsx
│   ├── services/             # Camada de serviços
│   │   ├── api.ts           # Cliente HTTP para API
│   │   └── PdfService.ts    # Geração de PDFs
│   ├── types/               # Definições TypeScript
│   │   └── index.ts
│   └── styles/              # Estilos CSS
│       ├── global.css
│       └── tabs.css
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

### Padrões de Design

1. **Separação de responsabilidades**: UI (pages/components) separada da lógica de negócio (services)
2. **Type-safety**: Uso extensivo de TypeScript com interfaces tipadas
3. **Component-based**: Arquitetura baseada em componentes React funcionais
4. **State management**: Uso de hooks nativos do React (useState, useEffect)
5. **API abstraction**: Camada de serviços abstrai chamadas HTTP

---

## Componentes Principais

### App.tsx

**Componente raiz da aplicação**

Responsabilidades:
- Gerenciamento de navegação entre páginas
- Sistema de abas (tabs)
- Layout base com header

```typescript
function App() {
  const [activeTab, setActiveTab] = useState('questions');
  
  const tabs = [
    { id: 'questions', label: '📝 Questões' },
    { id: 'exams', label: '📄 Provas' },
    { id: 'generate', label: '🎲 Gerar' },
    { id: 'correction', label: '✓ Corrigir' }
  ];
  
  // Renderiza página baseada na aba ativa
}
```

**Features:**
- ✅ Navegação por abas sem recarregar página
- ✅ Header fixo com branding
- ✅ Layout responsivo

---

### Tabs.tsx

**Componente de navegação por abas**

Props:
- `tabs: Tab[]` - Lista de abas disponíveis
- `activeTab: string` - ID da aba ativa
- `onTabChange: (tabId: string) => void` - Callback ao trocar aba

```typescript
interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}
```

**Características:**
- Destaque visual da aba ativa
- Estilização via CSS classes
- Reutilizável em qualquer contexto

---

## Páginas

### QuestionsPage.tsx

**Gerenciamento de questões**

**Funcionalidades:**
- ✅ Listar todas as questões cadastradas
- ✅ Criar nova questão com múltiplas alternativas
- ✅ Editar questão existente
- ✅ Remover questão
- ✅ Marcar alternativas corretas
- ✅ Adicionar/remover alternativas dinamicamente (mínimo 2)

**Estado principal:**
```typescript
const [questions, setQuestions] = useState<Question[]>([]);
const [showForm, setShowForm] = useState(false);
const [editingId, setEditingId] = useState<string | null>(null);
const [formData, setFormData] = useState({
  statement: '',
  alternatives: [
    { description: '', shouldBeMarked: false },
    { description: '', shouldBeMarked: false }
  ]
});
```

**Validações:**
- Enunciado não pode ser vazio
- Mínimo de 2 alternativas
- Pelo menos uma alternativa deve ser correta

**UI/UX:**
- Formulário colapsável
- Tabela com listagem de questões
- Confirmação antes de remover
- Feedback visual de sucesso/erro
- Empty state quando não há questões

---

### ExamsPage.tsx

**Gerenciamento de provas**

**Funcionalidades:**
- ✅ Listar todas as provas cadastradas
- ✅ Criar nova prova selecionando questões
- ✅ Editar prova existente
- ✅ Remover prova
- ✅ Configurar cabeçalho (disciplina, professor, data)
- ✅ Escolher tipo de identificação (Letras ou Potências de 2)

**Estado principal:**
```typescript
const [exams, setExams] = useState<Exam[]>([]);
const [questions, setQuestions] = useState<Question[]>([]);
const [formData, setFormData] = useState({
  name: '',
  header: {
    subject: '',
    professor: '',
    date: '',
    additionalInfo: ''
  },
  questionIds: [],
  alternativeType: AlternativeType.LETTERS
});
```

**Campos do formulário:**
- Nome da prova
- Disciplina
- Professor
- Data (date picker)
- Tipo de identificação (select)
- Informações adicionais (textarea)
- Seleção de questões (checkboxes)

**Validações:**
- Nome não pode ser vazio
- Pelo menos uma questão deve ser selecionada
- Questões selecionadas devem existir

**UI/UX:**
- Lista scrollable de questões com checkboxes
- Contador de questões selecionadas
- Badge visual para tipo de alternativa
- Grid responsivo com 2 colunas

---

### GeneratePage.tsx

**Geração de provas individuais e PDFs**

**Funcionalidades:**
- ✅ Selecionar prova base
- ✅ Definir número de provas a gerar (1-100)
- ✅ Gerar provas com embaralhamento de questões e alternativas
- ✅ Baixar gabarito em CSV
- ✅ **Baixar todas as provas em PDF único**
- ✅ **Baixar PDF de prova individual**
- ✅ Grid visual com botões para cada prova gerada

**Estado principal:**
```typescript
const [exams, setExams] = useState<Exam[]>([]);
const [selectedExamId, setSelectedExamId] = useState('');
const [count, setCount] = useState(10);
const [generatedExams, setGeneratedExams] = useState<GeneratedExam[]>([]);
```

**Fluxo de uso:**
1. Selecionar prova cadastrada
2. Definir quantidade de provas
3. Clicar em "🎲 Gerar Provas"
4. Sistema exibe grid com botões para download
5. Opções:
   - Baixar todas as provas em um PDF
   - Baixar PDF individual de cada prova
   - Baixar gabarito CSV

**Características PDFs:**
- Layout A4 (210x297mm)
- Cabeçalho com informações da prova
- Número da prova no canto superior direito
- Campo para nome e CPF do aluno
- Questões numeradas com alternativas
- Quebra de página automática quando necessário
- Suporte para letras (A,B,C) ou potências (1,2,4,8)

**UI/UX:**
- Empty state quando não há provas cadastradas
- Feedback de sucesso após geração
- Grid responsivo de botões (150px min)
- Área scrollable para muitas provas (max 400px)
- Informações claras sobre o processo

---

### CorrectionPage.tsx

**Correção automática de provas**

**Funcionalidades:**
- ✅ Cole CSV do gabarito
- ✅ Cole CSV das respostas dos alunos
- ✅ Escolher tipo de correção (Estrita ou Proporcional)
- ✅ Escolher tipo de alternativa
- ✅ Visualizar resultados em tabela
- ✅ Calcular média da turma
- ✅ Baixar relatório em CSV
- ✅ Badge colorido baseado na nota (verde ≥7, amarelo ≥5, vermelho <5)

**Estado principal:**
```typescript
const [answerKeyCSV, setAnswerKeyCSV] = useState('');
const [studentAnswersCSV, setStudentAnswersCSV] = useState('');
const [correctionType, setCorrectionType] = useState(CorrectionType.STRICT);
const [alternativeType, setAlternativeType] = useState(AlternativeType.LETTERS);
const [results, setResults] = useState<ExamResult[]>([]);
```

**Tipos de correção:**

**STRICT (Estrita):**
- Resposta deve ser exatamente igual ao gabarito
- Qualquer erro zera a questão
- Nota: 0 ou 1 por questão

**PROPORTIONAL (Proporcional):**
- Calcula proporção de acertos
- Considera alternativas marcadas e não marcadas
- Nota: 0 a 1 por questão (valores intermediários possíveis)

**Formato CSV - Gabarito:**
```csv
Numero_Prova,Questao_1,Questao_2,Questao_3
1,AB,C,ACD
2,AC,B,ABD
```

**Formato CSV - Respostas:**
```csv
Numero_Prova,Nome,CPF,Questao_1,Questao_2,Questao_3
1,João Silva,12345678901,AB,C,ACD
2,Maria Santos,98765432109,A,B,ABD
```

**UI/UX:**
- Textareas com fonte monospace para CSVs
- Exemplos visuais dos formatos
- Tabela de resultados com cores por nota
- Badge com média da turma
- Contador de acertos por aluno

---

## Serviços

### api.ts

**Cliente HTTP para comunicação com o backend**

Base URL:
- **Desenvolvimento**: Proxy via Vite para `http://localhost:3001/api`
- **Produção**: `/api` (mesma origem)

#### QuestionService

```typescript
class QuestionService {
  async getAll(): Promise<Question[]>
  async getById(id: string): Promise<Question>
  async create(statement: string, alternatives: Alternative[]): Promise<Question>
  async update(id: string, statement: string, alternatives: Alternative[]): Promise<Question>
  async delete(id: string): Promise<void>
}
```

#### ExamService

```typescript
class ExamService {
  async getAll(): Promise<Exam[]>
  async getById(id: string): Promise<Exam>
  async create(name: string, header: ExamHeader, questionIds: string[], alternativeType: AlternativeType): Promise<Exam>
  async update(id: string, name: string, header: ExamHeader, questionIds: string[], alternativeType: AlternativeType): Promise<Exam>
  async delete(id: string): Promise<void>
  async generateIndividual(examId: string, count: number): Promise<{ generatedExams: GeneratedExam[], answerKey: ExamAnswer[] }>
  async downloadAnswerKeyCSV(examId: string, count: number): Promise<void>
}
```

**Características:**
- Download automático de blobs (CSV)
- Tratamento de erros com mensagens amigáveis
- Type-safe com TypeScript
- Async/await para código limpo

#### CorrectionService

```typescript
class CorrectionService {
  async correctExams(
    answerKeyCSV: string,
    studentAnswersCSV: string,
    correctionType: CorrectionType,
    alternativeType: AlternativeType
  ): Promise<ExamResult[]>
  
  async downloadGradesCSV(
    answerKeyCSV: string,
    studentAnswersCSV: string,
    correctionType: CorrectionType,
    alternativeType: AlternativeType
  ): Promise<void>
}
```

---

### PdfService.ts

**Serviço para geração de PDFs das provas**

Responsabilidades:
- Gerar PDF individual de uma prova
- Gerar PDF com múltiplas provas (todas em um arquivo)
- Layout profissional em formato A4
- Suporte para letras ou potências de 2

#### Métodos Principais

```typescript
class PdfService {
  // Gera PDF individual
  generateExamPDF(
    exam: GeneratedExam,
    header: ExamHeader,
    alternativeType: AlternativeType
  ): jsPDF
  
  // Gera PDF com múltiplas provas
  generateMultipleExamsPDF(
    exams: GeneratedExam[],
    header: ExamHeader,
    alternativeType: AlternativeType
  ): jsPDF
  
  // Download direto de uma prova
  downloadSingleExam(
    exam: GeneratedExam,
    header: ExamHeader,
    alternativeType: AlternativeType,
    examName: string
  ): void
  
  // Download de todas as provas
  downloadAllExams(
    exams: GeneratedExam[],
    header: ExamHeader,
    alternativeType: AlternativeType,
    examName: string
  ): void
}
```

#### Configurações de Layout

```typescript
private readonly PAGE_WIDTH = 210;      // A4 em mm
private readonly PAGE_HEIGHT = 297;
private readonly MARGIN = 20;
private readonly LINE_HEIGHT = 6;
private readonly CONTENT_WIDTH = 170;   // PAGE_WIDTH - 2*MARGIN
```

#### Estrutura do PDF

**Cabeçalho (primeira página de cada prova):**
- Título "PROVA" centralizado (16pt, bold)
- Disciplina, Professor, Data (11pt)
- Informações adicionais (se houver)
- Número da prova no canto superior direito (12pt, bold)
- Linha separadora
- Campos para Nome e CPF do aluno

**Questões:**
- Numeração sequencial (1, 2, 3...)
- Enunciado em negrito (11pt)
- Alternativas com identificador (A, B, C ou 1, 2, 4, 8)
- Quebra de linha automática para textos longos
- Nova página quando espaço insuficiente

**Características:**
- ✅ Textos longos são quebrados automaticamente (`splitTextToSize`)
- ✅ Quebra de página inteligente (evita cortar questões)
- ✅ Fonte Helvetica padrão
- ✅ Margens consistentes (20mm)
- ✅ Espaçamento entre questões
- ✅ Numeração única por prova

---

## Types (TypeScript)

### Interfaces Principais

```typescript
// Alternativa de uma questão
interface Alternative {
  id?: string;
  description: string;
  shouldBeMarked: boolean;
}

// Questão
interface Question {
  id: string;
  statement: string;
  alternatives: Alternative[];
  createdAt: string;
  updatedAt: string;
}

// Cabeçalho da prova
interface ExamHeader {
  subject: string;
  professor: string;
  date: string;
  additionalInfo?: string;
}

// Prova
interface Exam {
  id: string;
  name: string;
  header: ExamHeader;
  questionIds: string[];
  alternativeType: AlternativeType;
  createdAt: string;
  updatedAt: string;
}

// Prova individual gerada
interface GeneratedExam {
  examNumber: number;
  examId: string;
  questions: GeneratedQuestion[];
}

// Questão com alternativas embaralhadas
interface GeneratedQuestion {
  originalQuestionId: string;
  statement: string;
  alternatives: GeneratedAlternative[];
}

// Alternativa embaralhada
interface GeneratedAlternative {
  originalAlternativeId: string;
  description: string;
  shouldBeMarked: boolean;
  position: number;
}

// Gabarito
interface ExamAnswer {
  examNumber: number;
  answers: string[];
}

// Resultado da correção
interface ExamResult {
  examNumber: number;
  studentName: string;
  studentCPF: string;
  questionResults: QuestionResult[];
  totalScore: number; // 0 a 10
}

// Resultado de uma questão
interface QuestionResult {
  questionNumber: number;
  expectedAnswer: string;
  studentAnswer: string;
  score: number; // 0 a 1
}
```

### Enums

```typescript
enum AlternativeType {
  LETTERS = 'LETTERS',           // A, B, C, D...
  POWERS_OF_TWO = 'POWERS_OF_TWO' // 1, 2, 4, 8...
}

enum CorrectionType {
  STRICT = 'STRICT',             // Erro zera questão
  PROPORTIONAL = 'PROPORTIONAL'   // Nota proporcional
}
```

---

## Estilos

### global.css

**Sistema de design com CSS Variables**

#### Paleta de Cores
```css
:root {
  --primary-color: #4f46e5;
  --primary-hover: #4338ca;
  --success-color: #10b981;
  --danger-color: #ef4444;
  --warning-color: #f59e0b;
  --text-color: #1f2937;
  --bg-color: #f9fafb;
  --border-color: #e5e7eb;
}
```

#### Componentes Estilizados

**Botões:**
- `.btn` - Base
- `.btn-primary` - Ação principal (azul)
- `.btn-secondary` - Ação secundária (cinza)
- `.btn-success` - Ação positiva (verde)
- `.btn-danger` - Ação destrutiva (vermelho)
- `.btn-outline` - Contorno sem preenchimento

**Formulários:**
- `.form-group` - Container de campo
- `.form-label` - Label do campo
- `.form-input` - Input de texto
- `.form-textarea` - Textarea
- `.form-select` - Select dropdown

**Cards:**
- `.card` - Container com borda e sombra
- `.card-title` - Título do card

**Alertas:**
- `.alert` - Base
- `.alert-success` - Sucesso (verde)
- `.alert-error` - Erro (vermelho)
- `.alert-info` - Informação (azul)

**Tabelas:**
- `.table` - Tabela estilizada
- Zebra striping automático
- Hover em linhas

**Badges:**
- `.badge` - Badge base
- `.badge-primary` - Azul
- `.badge-success` - Verde
- `.badge-warning` - Amarelo
- `.badge-danger` - Vermelho

**Layout:**
- `.container` - Container principal (max 1200px)
- `.flex` - Flexbox com gap
- `.flex-between` - Justify space-between
- `.grid` - Grid layout
- `.grid-cols-2` - 2 colunas

**Estados:**
- `.empty-state` - Estado vazio
- `.loading` - Indicador de carregamento

---

### tabs.css

**Estilos do componente Tabs**

```css
.tabs-header {
  display: flex;
  gap: 0.5rem;
  border-bottom: 2px solid var(--border-color);
}

.tab-button {
  padding: 0.75rem 1.5rem;
  background: transparent;
  border-bottom: 3px solid transparent;
  transition: all 0.2s;
}

.tab-button.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
  background: rgba(79, 70, 229, 0.05);
}
```

---

## Configuração

### vite.config.ts

**Configuração do Vite**

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
});
```

**Características:**
- Porta 3000 para dev server
- Proxy para API backend (porta 3001)
- Hot Module Replacement (HMR)
- Build otimizado para produção

---

## Scripts NPM

```json
{
  "dev": "vite",                    // Inicia dev server (porta 3000)
  "build": "tsc && vite build",     // Compila TypeScript e build produção
  "preview": "vite preview"         // Preview do build
}
```

---

## Fluxo de Desenvolvimento

### Modo Desenvolvimento

1. **Backend** (terminal 1):
   ```bash
   cd /home/andre/workspace/cin/TALP/sistema1
   npm run dev
   ```
   Servidor rodando em `http://localhost:3001`

2. **Frontend** (terminal 2):
   ```bash
   cd /home/andre/workspace/cin/TALP/sistema1/frontend
   npm run dev
   ```
   Interface rodando em `http://localhost:3000`

3. **Proxy automático**: Requisições para `/api` são redirecionadas para backend

### Build de Produção

```bash
# Compila backend + frontend
npm run build

# Estrutura gerada:
dist/
├── server.js              # Backend compilado
├── models/
├── services/
└── public/                # Frontend estático
    ├── index.html
    ├── assets/
    │   ├── index-*.js
    │   └── index-*.css
```

### Deploy

```bash
# Inicia servidor em produção
npm start

# Servidor serve:
# - API REST em /api/*
# - Frontend estático em /*
```

---

## Boas Práticas Implementadas

### 1. Type Safety
- Todas as interfaces tipadas
- Nenhum uso de `any` sem tratamento
- Props dos componentes com interfaces

### 2. Error Handling
- Try/catch em todas as chamadas async
- Mensagens de erro amigáveis
- Feedback visual consistente

### 3. User Experience
- Loading states durante requisições
- Mensagens de sucesso temporárias (3s)
- Confirmação antes de ações destrutivas
- Empty states informativos
- Validações de formulário

### 4. Code Organization
- Separação clara de responsabilidades
- Serviços reutilizáveis
- Componentes desacoplados
- CSS modular com variáveis

### 5. Performance
- Build otimizado com Vite
- Code splitting automático
- Assets minificados e comprimidos
- HMR em desenvolvimento

---

## Limitações Conhecidas

1. **Persistência**: Dados armazenados em JSON no backend (não em banco de dados)
2. **Autenticação**: Sistema não possui controle de acesso
3. **Validação de CPF**: Apenas formato, não valida dígito verificador
4. **Upload de arquivo**: CSVs são colados manualmente (não há upload)
5. **Edição de provas geradas**: Não é possível editar após geração

---

## Melhorias Futuras

### Funcionalidades
- [ ] Upload de CSV por arquivo
- [ ] Visualização de prova antes de gerar PDF
- [ ] Histórico de provas aplicadas
- [ ] Estatísticas e gráficos de desempenho
- [ ] Exportação de questões em formatos padrão
- [ ] Banco de questões com categorias/tags
- [ ] Editor de texto rico para enunciados
- [ ] Suporte a imagens nas questões

### Técnicas
- [ ] Testes unitários (Vitest)
- [ ] Testes E2E (Playwright)
- [ ] State management (Zustand ou Context API)
- [ ] React Router para rotas reais
- [ ] Lazy loading de páginas
- [ ] PWA (Progressive Web App)
- [ ] Dark mode
- [ ] Internacionalização (i18n)

---

## Dependências

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "jspdf": "^2.5.2"
  },
  "devDependencies": {
    "@types/react": "^19.0.6",
    "@types/react-dom": "^19.0.2",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.7.3",
    "vite": "^6.0.11"
  }
}
```

---

## Troubleshooting

### Problema: API retorna erro 404
**Solução**: Verifique se backend está rodando na porta 3001

### Problema: Proxy não funciona
**Solução**: Reinicie o dev server do Vite

### Problema: PDF não baixa
**Solução**: Verifique se jsPDF está instalado (`npm install jspdf`)

### Problema: Build falha
**Solução**: 
1. Limpe node_modules: `rm -rf node_modules && npm install`
2. Limpe cache do Vite: `rm -rf .vite`

### Problema: TypeScript reclama de tipos
**Solução**: Verifique se tipos estão sincronizados entre frontend e backend

---

## Conclusão

O frontend do AqysProvas é uma aplicação moderna, type-safe e user-friendly que oferece todas as funcionalidades necessárias para gerenciamento completo de provas acadêmicas. A arquitetura modular facilita manutenção e extensão, enquanto o uso de TypeScript garante robustez e autocompletar no desenvolvimento.

**Principais Diferenciais:**
✅ Geração de PDF profissional com jsPDF
✅ Interface intuitiva com feedback visual
✅ Type-safety completo com TypeScript
✅ Correção automática com dois métodos
✅ Build otimizado para produção
✅ Código bem documentado e organizado

---

**Documentação Frontend gerada em:** 24/03/2026  
**Versão:** 1.0.0  
**Desenvolvido com:** React + TypeScript + Vite
