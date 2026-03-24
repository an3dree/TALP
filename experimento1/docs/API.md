# API Reference - Aqys Provas

Documentação técnica completa de todas as classes, métodos e interfaces do sistema.

---

## QuestionService

Serviço para gerenciamento de questões de provas.

### Métodos

#### `createQuestion(statement: string, alternatives: Omit<Alternative, 'id'>[]): Question`

Cria uma nova questão.

**Parâmetros:**
- `statement` - Enunciado da questão
- `alternatives` - Array de alternativas (sem ID)

**Retorna:** Questão criada com ID único

**Exceções:**
- Lança erro se enunciado estiver vazio
- Lança erro se tiver menos de 2 alternativas
- Lança erro se não houver nenhuma alternativa correta

**Exemplo:**
```typescript
const question = questionService.createQuestion(
  'Qual o resultado de 5 + 3?',
  [
    { description: '7', shouldBeMarked: false },
    { description: '8', shouldBeMarked: true },
    { description: '9', shouldBeMarked: false }
  ]
);
```

---

#### `getAllQuestions(): Question[]`

Retorna todas as questões cadastradas.

**Retorna:** Array de questões

---

#### `getQuestionById(id: string): Question | undefined`

Busca uma questão por ID.

**Parâmetros:**
- `id` - ID da questão

**Retorna:** Questão encontrada ou undefined

---

#### `updateQuestion(id: string, statement: string, alternatives: Omit<Alternative, 'id'>[]): Question`

Atualiza uma questão existente.

**Parâmetros:**
- `id` - ID da questão
- `statement` - Novo enunciado
- `alternatives` - Novas alternativas

**Retorna:** Questão atualizada

**Exceções:**
- Lança erro se questão não for encontrada
- Mesmas validações do `createQuestion`

---

#### `deleteQuestion(id: string): boolean`

Remove uma questão.

**Parâmetros:**
- `id` - ID da questão

**Retorna:** `true` se removida com sucesso

**Exceções:**
- Lança erro se questão não for encontrada

---

## ExamService

Serviço para gerenciamento de provas e geração de versões individuais.

### Métodos

#### `createExam(name: string, header: ExamHeader, questionIds: string[], alternativeType: AlternativeType): Exam`

Cria uma nova prova.

**Parâmetros:**
- `name` - Nome da prova
- `header` - Cabeçalho com informações da prova
- `questionIds` - IDs das questões selecionadas
- `alternativeType` - Tipo de identificação (LETTERS ou POWERS_OF_TWO)

**Retorna:** Prova criada

**Exceções:**
- Lança erro se nome estiver vazio
- Lança erro se não houver questões
- Lança erro se alguma questão não existir

---

#### `getAllExams(): Exam[]`

Retorna todas as provas cadastradas.

**Retorna:** Array de provas

---

#### `getExamById(id: string): Exam | undefined`

Busca uma prova por ID.

**Parâmetros:**
- `id` - ID da prova

**Retorna:** Prova encontrada ou undefined

---

#### `updateExam(id: string, name: string, header: ExamHeader, questionIds: string[], alternativeType: AlternativeType): Exam`

Atualiza uma prova existente.

**Parâmetros:**
- `id` - ID da prova
- `name` - Novo nome
- `header` - Novo cabeçalho
- `questionIds` - Novos IDs de questões
- `alternativeType` - Novo tipo de alternativa

**Retorna:** Prova atualizada

**Exceções:**
- Lança erro se prova não for encontrada
- Mesmas validações do `createExam`

---

#### `deleteExam(id: string): boolean`

Remove uma prova.

**Parâmetros:**
- `id` - ID da prova

**Retorna:** `true` se removida com sucesso

**Exceções:**
- Lança erro se prova não for encontrada

---

#### `generateIndividualExams(examId: string, count: number): GeneratedExam[]`

Gera múltiplas versões individuais de uma prova com embaralhamento.

**Parâmetros:**
- `examId` - ID da prova base
- `count` - Número de versões a gerar

**Retorna:** Array de provas individuais geradas

**Exceções:**
- Lança erro se count <= 0
- Lança erro se prova não for encontrada
- Lança erro se alguma questão não existir

**Observações:**
- Questões são embaralhadas em ordem diferente para cada versão
- Alternativas são embaralhadas em ordem diferente para cada questão
- Cada versão recebe um número único (1, 2, 3, ...)

---

#### `generateAnswerKey(generatedExams: GeneratedExam[], alternativeType: AlternativeType): ExamAnswer[]`

Gera o gabarito de provas individuais.

**Parâmetros:**
- `generatedExams` - Provas individuais geradas
- `alternativeType` - Tipo de identificação

**Retorna:** Array com gabarito de cada prova

**Formato da resposta:**
- Para LETTERS: string com letras concatenadas (ex: "AB", "ACD")
- Para POWERS_OF_TWO: string com soma das potências (ex: "3", "7", "15")

**Exemplo:**
```typescript
const generatedExams = examService.generateIndividualExams('exam-id', 5);
const answerKey = examService.generateAnswerKey(
  generatedExams,
  AlternativeType.LETTERS
);

// answerKey = [
//   { examNumber: 1, answers: ['AB', 'C', 'ACD'] },
//   { examNumber: 2, answers: ['BC', 'A', 'BCD'] },
//   ...
// ]
```

---

## CorrectionService

Serviço para correção automática de provas.

### Métodos

#### `correctExams(answerKey: ExamAnswer[], studentAnswers: StudentAnswer[], correctionType: CorrectionType, alternativeType: AlternativeType): ExamResult[]`

Corrige as provas dos alunos.

**Parâmetros:**
- `answerKey` - Gabarito das provas
- `studentAnswers` - Respostas dos alunos
- `correctionType` - Tipo de correção (STRICT ou PROPORTIONAL)
- `alternativeType` - Tipo de identificação usado

**Retorna:** Array com resultado de cada aluno

**Exceções:**
- Lança erro se CPF for inválido
- Lança erro se gabarito não for encontrado para alguma prova
- Lança erro se número de respostas não corresponder ao gabarito

**Tipos de correção:**

**STRICT (Estrita):**
- Resposta deve ser exatamente igual ao gabarito
- Qualquer erro zera a questão
- Nota: 0 ou 1

**PROPORTIONAL (Proporcional):**
- Calcula proporção de acertos
- Considera alternativas marcadas e não marcadas
- Fórmula: `nota = 1 - (erros / total_alternativas)`
- Nota: 0 a 1

**Exemplo:**
```typescript
const results = correctionService.correctExams(
  answerKey,
  studentAnswers,
  CorrectionType.PROPORTIONAL,
  AlternativeType.LETTERS
);

// results[0] = {
//   examNumber: 1,
//   studentName: 'João Silva',
//   studentCPF: '12345678901',
//   questionResults: [
//     { questionNumber: 1, expectedAnswer: 'AB', studentAnswer: 'A', score: 0.5 },
//     { questionNumber: 2, expectedAnswer: 'C', studentAnswer: 'C', score: 1.0 }
//   ],
//   totalScore: 7.5
// }
```

---

## CsvService

Serviço para geração e leitura de arquivos CSV.

### Métodos

#### `generateAnswerKeyCSV(answerKey: ExamAnswer[], outputPath?: string): string`

Gera CSV com gabarito das provas.

**Parâmetros:**
- `answerKey` - Gabarito a ser exportado
- `outputPath` - (Opcional) Caminho para salvar o arquivo

**Retorna:** Conteúdo do CSV como string

**Formato gerado:**
```csv
Numero_Prova,Questao_1,Questao_2,Questao_3
1,AB,C,ACD
2,AC,B,ABD
```

---

#### `parseStudentAnswersCSV(csvContent: string): StudentAnswer[]`

Lê e processa CSV com respostas dos alunos.

**Parâmetros:**
- `csvContent` - Conteúdo do CSV

**Retorna:** Array de respostas dos alunos

**Exceções:**
- Lança erro se CSV estiver vazio
- Lança erro se linha tiver dados insuficientes
- Lança erro se número da prova não for numérico

**Formato esperado:**
```csv
Numero_Prova,Nome,CPF,Questao_1,Questao_2,Questao_3
1,João Silva,12345678901,AB,C,ACD
2,Maria Santos,98765432109,AC,B,ABD
```

---

#### `parseAnswerKeyCSV(csvContent: string): ExamAnswer[]`

Lê e processa CSV com gabarito.

**Parâmetros:**
- `csvContent` - Conteúdo do CSV

**Retorna:** Array com gabarito

**Exceções:**
- Lança erro se CSV estiver vazio
- Lança erro se linha tiver dados insuficientes
- Lança erro se número da prova não for numérico

---

#### `generateGradesReportCSV(results: ExamResult[], outputPath?: string): string`

Gera CSV com relatório de notas.

**Parâmetros:**
- `results` - Resultados da correção
- `outputPath` - (Opcional) Caminho para salvar o arquivo

**Retorna:** Conteúdo do CSV como string

**Formato gerado:**
```csv
Numero_Prova,Nome,CPF,Questao_1,Questao_2,Questao_3,Nota_Final
1,João Silva,12345678901,1.00,1.00,0.50,8.33
2,Maria Santos,98765432109,0.50,0.00,1.00,5.00
```

---

## JsonRepository<T>

Repositório genérico para persistência em JSON.

### Métodos

#### `findAll(): T[]`

Retorna todos os itens armazenados.

**Retorna:** Array de itens

---

#### `findById(id: string): T | undefined`

Busca um item por ID.

**Parâmetros:**
- `id` - ID do item

**Retorna:** Item encontrado ou undefined

---

#### `save(item: T): T`

Salva um novo item.

**Parâmetros:**
- `item` - Item a ser salvo (deve ter propriedade `id`)

**Retorna:** Item salvo

---

#### `update(id: string, updatedItem: T): T | null`

Atualiza um item existente.

**Parâmetros:**
- `id` - ID do item
- `updatedItem` - Dados atualizados

**Retorna:** Item atualizado ou null se não encontrado

---

#### `delete(id: string): boolean`

Remove um item pelo ID.

**Parâmetros:**
- `id` - ID do item

**Retorna:** `true` se removido, `false` se não encontrado

---

#### `deleteAll(): void`

Remove todos os itens (útil para testes).

---

## Utilitários (helpers.ts)

### `generateId(): string`

Gera um ID único usando UUID v4.

**Retorna:** UUID string

---

### `shuffleArray<T>(array: T[]): T[]`

Embaralha um array usando algoritmo Fisher-Yates.

**Parâmetros:**
- `array` - Array a ser embaralhado

**Retorna:** Novo array embaralhado (não modifica original)

---

### `numberToLetter(num: number): string`

Converte número para letra (0=A, 1=B, ...).

**Parâmetros:**
- `num` - Número (0-25)

**Retorna:** Letra correspondente

---

### `numberToPowerOfTwo(num: number): number`

Converte número para potência de 2 (0=1, 1=2, 2=4, ...).

**Parâmetros:**
- `num` - Expoente

**Retorna:** 2^num

---

### `isValidCPF(cpf: string): boolean`

Valida formato de CPF.

**Parâmetros:**
- `cpf` - CPF a validar (pode conter formatação)

**Retorna:** `true` se válido

**Validações:**
- Remove caracteres não numéricos
- Verifica se tem 11 dígitos
- Verifica se não são todos iguais

---

### `formatDate(date: Date): string`

Formata data no padrão brasileiro (DD/MM/YYYY).

**Parâmetros:**
- `date` - Data a formatar

**Retorna:** String formatada

---

## Enums

### AlternativeType

```typescript
enum AlternativeType {
  LETTERS = 'LETTERS',           // A, B, C, D...
  POWERS_OF_TWO = 'POWERS_OF_TWO' // 1, 2, 4, 8...
}
```

### CorrectionType

```typescript
enum CorrectionType {
  STRICT = 'STRICT',           // Qualquer erro zera
  PROPORTIONAL = 'PROPORTIONAL' // Nota proporcional
}
```

---

## Interfaces Principais

### Question
```typescript
interface Question {
  id: string;
  statement: string;
  alternatives: Alternative[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Alternative
```typescript
interface Alternative {
  id: string;
  description: string;
  shouldBeMarked: boolean;
}
```

### Exam
```typescript
interface Exam {
  id: string;
  name: string;
  header: ExamHeader;
  questionIds: string[];
  alternativeType: AlternativeType;
  createdAt: Date;
  updatedAt: Date;
}
```

### ExamHeader
```typescript
interface ExamHeader {
  subject: string;
  professor: string;
  date: string;
  additionalInfo?: string;
}
```

### GeneratedExam
```typescript
interface GeneratedExam {
  examNumber: number;
  examId: string;
  questions: GeneratedQuestion[];
}
```

### GeneratedQuestion
```typescript
interface GeneratedQuestion {
  originalQuestionId: string;
  statement: string;
  alternatives: GeneratedAlternative[];
}
```

### GeneratedAlternative
```typescript
interface GeneratedAlternative {
  originalAlternativeId: string;
  description: string;
  shouldBeMarked: boolean;
  position: number;
}
```

### ExamAnswer
```typescript
interface ExamAnswer {
  examNumber: number;
  answers: string[];
}
```

### StudentAnswer
```typescript
interface StudentAnswer {
  examNumber: number;
  studentName: string;
  studentCPF: string;
  answers: string[];
}
```

### QuestionResult
```typescript
interface QuestionResult {
  questionNumber: number;
  expectedAnswer: string;
  studentAnswer: string;
  score: number; // 0 a 1
}
```

### ExamResult
```typescript
interface ExamResult {
  examNumber: number;
  studentName: string;
  studentCPF: string;
  questionResults: QuestionResult[];
  totalScore: number; // 0 a 10
}
```

---

**Fim da documentação da API**
