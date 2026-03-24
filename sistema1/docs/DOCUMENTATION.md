# Documentação - Aqys Provas

## Visão Geral

O **Aqys Provas** é um sistema fullstack (Node.js + React) para gerenciamento de provas acadêmicas, permitindo criar questões, montar provas, gerar versões individuais com embaralhamento e corrigir automaticamente as respostas dos alunos.

**Stack:**
- Backend: Node.js + TypeScript + Express
- Frontend: React (a ser implementado)
- Testes: Cucumber + Gherkin
- Persistência: JSON local

## Funcionalidades Principais

### 1. Gerenciamento de Questões

**Operações disponíveis:**
- ✅ Criar questões com enunciado e múltiplas alternativas
- ✅ Atualizar questões existentes
- ✅ Remover questões
- ✅ Listar todas as questões

**Validações:**
- Questão deve ter enunciado não vazio
- Mínimo de 2 alternativas
- Pelo menos uma alternativa deve ser correta

**Exemplo de uso:**
```typescript
import { questionService } from './services/QuestionService';

const question = questionService.createQuestion(
  'Qual é a capital do Brasil?',
  [
    { description: 'Brasília', shouldBeMarked: true },
    { description: 'São Paulo', shouldBeMarked: false },
    { description: 'Rio de Janeiro', shouldBeMarked: false }
  ]
);
```

### 2. Gerenciamento de Provas

**Operações disponíveis:**
- ✅ Criar provas selecionando questões cadastradas
- ✅ Definir tipo de identificação (letras ou potências de 2)
- ✅ Atualizar provas existentes
- ✅ Remover provas
- ✅ Listar todas as provas

**Tipos de identificação:**
- **LETTERS**: Alternativas identificadas por A, B, C, D...
- **POWERS_OF_TWO**: Alternativas identificadas por 1, 2, 4, 8, 16...

**Exemplo de uso:**
```typescript
import { examService, AlternativeType } from './services/ExamService';

const exam = examService.createExam(
  'Prova Final de Matemática',
  {
    subject: 'Matemática',
    professor: 'Prof. João Silva',
    date: '2024-06-15',
    additionalInfo: 'Prova sem consulta'
  },
  ['question-id-1', 'question-id-2', 'question-id-3'],
  AlternativeType.LETTERS
);
```

### 3. Geração de Provas Individuais

**Funcionalidades:**
- ✅ Gerar múltiplas versões de uma prova
- ✅ Embaralhar ordem das questões
- ✅ Embaralhar ordem das alternativas
- ✅ Gerar gabarito em formato CSV
- ✅ Cada prova recebe um número único

**Exemplo de uso:**
```typescript
import { examService } from './services/ExamService';
import { csvService } from './services/CsvService';

// Gerar 30 provas individuais
const generatedExams = examService.generateIndividualExams('exam-id', 30);

// Gerar gabarito
const answerKey = examService.generateAnswerKey(
  generatedExams,
  AlternativeType.LETTERS
);

// Exportar gabarito para CSV
const csvContent = csvService.generateAnswerKeyCSV(
  answerKey,
  './data/gabarito.csv'
);
```

**Formato do CSV de gabarito:**
```csv
Numero_Prova,Questao_1,Questao_2,Questao_3
1,AB,C,ACD
2,AC,B,ABD
3,BC,A,ACD
```

### 4. Correção de Provas

**Métodos de correção:**

#### Correção Estrita (STRICT)
- Qualquer erro na questão zera completamente a nota
- Aluno deve marcar exatamente as alternativas corretas

#### Correção Proporcional (PROPORTIONAL)
- Nota proporcional ao percentual de acertos
- Considera alternativas marcadas corretamente e não marcadas corretamente
- Fórmula: `nota = 1 - (erros / total_alternativas)`

**Exemplo de uso:**
```typescript
import { correctionService, CorrectionType, AlternativeType } from './services/CorrectionService';
import { csvService } from './services/CsvService';
import * as fs from 'fs';

// Ler gabarito
const gabaritoCSV = fs.readFileSync('./data/gabarito.csv', 'utf-8');
const answerKey = csvService.parseAnswerKeyCSV(gabaritoCSV);

// Ler respostas dos alunos
const respostasCSV = fs.readFileSync('./data/respostas.csv', 'utf-8');
const studentAnswers = csvService.parseStudentAnswersCSV(respostasCSV);

// Corrigir provas
const results = correctionService.correctExams(
  answerKey,
  studentAnswers,
  CorrectionType.PROPORTIONAL,
  AlternativeType.LETTERS
);

// Gerar relatório de notas
csvService.generateGradesReportCSV(results, './data/notas.csv');
```

**Formato do CSV de respostas dos alunos:**
```csv
Numero_Prova,Nome,CPF,Questao_1,Questao_2,Questao_3
1,João Silva,12345678901,AB,C,ACD
2,Maria Santos,98765432109,AC,B,ABD
```

**Formato do CSV de relatório de notas:**
```csv
Numero_Prova,Nome,CPF,Questao_1,Questao_2,Questao_3,Nota_Final
1,João Silva,12345678901,1.00,1.00,1.00,10.00
2,Maria Santos,98765432109,0.50,0.00,1.00,5.00
```

## Estrutura do Projeto

```
/
├── src/
│   ├── models/               # Definições de tipos e interfaces
│   │   └── index.ts
│   ├── repositories/         # Camada de persistência
│   │   ├── JsonRepository.ts
│   │   ├── QuestionRepository.ts
│   │   └── ExamRepository.ts
│   ├── services/            # Lógica de negócio
│   │   ├── QuestionService.ts
│   │   ├── ExamService.ts
│   │   ├── CorrectionService.ts
│   │   └── CsvService.ts
│   ├── utils/               # Funções auxiliares
│   │   └── helpers.ts
│   └── index.ts            # Ponto de entrada
├── features/                # Testes BDD
│   ├── step_definitions/
│   └── *.feature
├── data/                    # Arquivos JSON de persistência
└── reports/                 # Relatórios de testes
```

## Modelos de Dados

### Question (Questão)
```typescript
{
  id: string;
  statement: string;
  alternatives: Alternative[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Alternative (Alternativa)
```typescript
{
  id: string;
  description: string;
  shouldBeMarked: boolean;
}
```

### Exam (Prova)
```typescript
{
  id: string;
  name: string;
  header: ExamHeader;
  questionIds: string[];
  alternativeType: AlternativeType;
  createdAt: Date;
  updatedAt: Date;
}
```

### ExamHeader (Cabeçalho da Prova)
```typescript
{
  subject: string;
  professor: string;
  date: string;
  additionalInfo?: string;
}
```

## Persistência de Dados

Os dados são armazenados em arquivos JSON na pasta `data/`:
- `questions.json` - Questões cadastradas
- `exams.json` - Provas cadastradas

## Testes

O projeto utiliza **Cucumber** com **Gherkin** para testes BDD.

### Executar testes
```bash
npm test
```

### Categorias de testes
- ✅ Gerenciamento de questões (5 cenários)
- ✅ Gerenciamento de provas (4 cenários)
- ✅ Geração de provas individuais (3 cenários)
- ✅ Correção de provas (4 cenários)

**Total: 16 cenários, 61 steps - todos passando ✓**

## Utilitários

### Funções auxiliares (`utils/helpers.ts`)
- `generateId()` - Gera UUID único
- `shuffleArray()` - Embaralha array (Fisher-Yates)
- `numberToLetter()` - Converte 0→A, 1→B, etc.
- `numberToPowerOfTwo()` - Converte 0→1, 1→2, 2→4, etc.
- `isValidCPF()` - Valida formato de CPF
- `formatDate()` - Formata data para pt-BR

## Exemplo Completo de Uso

```typescript
import {
  questionService,
  examService,
  correctionService,
  csvService,
  AlternativeType,
  CorrectionType
} from './src';

// 1. Criar questões
const q1 = questionService.createQuestion('Quanto é 2+2?', [
  { description: '3', shouldBeMarked: false },
  { description: '4', shouldBeMarked: true },
  { description: '5', shouldBeMarked: false }
]);

const q2 = questionService.createQuestion('Qual a capital da França?', [
  { description: 'Londres', shouldBeMarked: false },
  { description: 'Paris', shouldBeMarked: true },
  { description: 'Berlim', shouldBeMarked: false }
]);

// 2. Criar prova
const exam = examService.createExam(
  'Prova 1 - Conhecimentos Gerais',
  {
    subject: 'Conhecimentos Gerais',
    professor: 'Prof. Silva',
    date: '2024-06-15'
  },
  [q1.id, q2.id],
  AlternativeType.LETTERS
);

// 3. Gerar 10 versões individuais
const generatedExams = examService.generateIndividualExams(exam.id, 10);

// 4. Gerar e salvar gabarito
const answerKey = examService.generateAnswerKey(
  generatedExams,
  AlternativeType.LETTERS
);
csvService.generateAnswerKeyCSV(answerKey, './data/gabarito.csv');

// 5. Corrigir provas (após coleta de respostas)
const studentAnswers = csvService.parseStudentAnswersCSV(
  fs.readFileSync('./data/respostas.csv', 'utf-8')
);

const results = correctionService.correctExams(
  answerKey,
  studentAnswers,
  CorrectionType.PROPORTIONAL,
  AlternativeType.LETTERS
);

// 6. Gerar relatório final
csvService.generateGradesReportCSV(results, './data/notas.csv');

console.log('Correção concluída!');
console.log(`Total de alunos: ${results.length}`);
console.log(`Média da turma: ${
  (results.reduce((sum, r) => sum + r.totalScore, 0) / results.length).toFixed(2)
}`);
```

## Comandos NPM

```bash
# Instalar dependências
npm install

# Compilar TypeScript
npm run build

# Executar servidor em modo desenvolvimento
npm run dev

# Executar servidor em produção (após build)
npm start

# Executar testes
npm test
```

## API REST

O backend expõe uma API REST na porta 3001 (configurável via `PORT`).

**Base URL:** `http://localhost:3001/api`

### Endpoints Disponíveis

#### Questões
- `GET /api/questions` - Lista todas as questões
- `GET /api/questions/:id` - Busca questão por ID
- `POST /api/questions` - Cria nova questão
- `PUT /api/questions/:id` - Atualiza questão
- `DELETE /api/questions/:id` - Remove questão

#### Provas
- `GET /api/exams` - Lista todas as provas
- `GET /api/exams/:id` - Busca prova por ID
- `POST /api/exams` - Cria nova prova
- `PUT /api/exams/:id` - Atualiza prova
- `DELETE /api/exams/:id` - Remove prova
- `POST /api/exams/:id/generate` - Gera provas individuais
- `POST /api/exams/:id/answer-key/csv` - Exporta gabarito em CSV

#### Correção
- `POST /api/correction` - Corrige provas (retorna JSON)
- `POST /api/correction/csv` - Corrige provas (retorna CSV)

## Próximos Passos (Sugestões)

Para expandir o sistema, considere implementar:
- 📄 Geração de PDFs das provas (usando bibliotecas como PDFKit)
- 🔐 Sistema de autenticação e autorização
- 🌐 API REST para integração com frontend
- 📊 Relatórios estatísticos avançados
- 💾 Suporte a banco de dados (PostgreSQL, MongoDB)
- 📤 Export/import de questões em formatos padrão
- 🎨 Interface web para professores e alunos

## Licença

ISC

---

**Desenvolvido com Node.js, TypeScript e Cucumber**
