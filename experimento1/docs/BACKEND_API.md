# API REST - Backend AqysProvas

Documentação completa da API REST do backend.

## Informações Gerais

**Base URL:** `http://localhost:3001/api`

**Formato:** JSON

**CORS:** Habilitado para todas as origens

---

## Endpoints

### Health Check

#### `GET /api/health`

Verifica se o servidor está rodando.

**Resposta:**
```json
{
  "status": "ok",
  "message": "AqysProvas API is running"
}
```

---

## Questões

### Listar todas as questões

#### `GET /api/questions`

**Resposta:**
```json
[
  {
    "id": "uuid",
    "statement": "Qual é a capital do Brasil?",
    "alternatives": [
      {
        "id": "uuid",
        "description": "Brasília",
        "shouldBeMarked": true
      },
      {
        "id": "uuid",
        "description": "São Paulo",
        "shouldBeMarked": false
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### Buscar questão por ID

#### `GET /api/questions/:id`

**Parâmetros de URL:**
- `id` - ID da questão

**Resposta (200):**
```json
{
  "id": "uuid",
  "statement": "Qual é a capital do Brasil?",
  "alternatives": [...],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Resposta (404):**
```json
{
  "error": "Questão não encontrada"
}
```

---

### Criar nova questão

#### `POST /api/questions`

**Body:**
```json
{
  "statement": "Quanto é 2 + 2?",
  "alternatives": [
    {
      "description": "3",
      "shouldBeMarked": false
    },
    {
      "description": "4",
      "shouldBeMarked": true
    },
    {
      "description": "5",
      "shouldBeMarked": false
    }
  ]
}
```

**Resposta (201):**
```json
{
  "id": "uuid",
  "statement": "Quanto é 2 + 2?",
  "alternatives": [
    {
      "id": "uuid",
      "description": "3",
      "shouldBeMarked": false
    },
    {
      "id": "uuid",
      "description": "4",
      "shouldBeMarked": true
    },
    {
      "id": "uuid",
      "description": "5",
      "shouldBeMarked": false
    }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Resposta (400):**
```json
{
  "error": "O enunciado da questão não pode estar vazio"
}
```

---

### Atualizar questão

#### `PUT /api/questions/:id`

**Parâmetros de URL:**
- `id` - ID da questão

**Body:**
```json
{
  "statement": "Novo enunciado",
  "alternatives": [
    {
      "description": "Alt A",
      "shouldBeMarked": true
    },
    {
      "description": "Alt B",
      "shouldBeMarked": false
    }
  ]
}
```

**Resposta (200):**
```json
{
  "id": "uuid",
  "statement": "Novo enunciado",
  "alternatives": [...],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

---

### Remover questão

#### `DELETE /api/questions/:id`

**Parâmetros de URL:**
- `id` - ID da questão

**Resposta (204):** Sem conteúdo

**Resposta (404):**
```json
{
  "error": "Questão com ID xyz não encontrada"
}
```

---

## Provas

### Listar todas as provas

#### `GET /api/exams`

**Resposta:**
```json
[
  {
    "id": "uuid",
    "name": "Prova Final - Matemática",
    "header": {
      "subject": "Matemática",
      "professor": "Prof. João Silva",
      "date": "2024-06-15",
      "additionalInfo": "Prova sem consulta"
    },
    "questionIds": ["uuid1", "uuid2", "uuid3"],
    "alternativeType": "LETTERS",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### Buscar prova por ID

#### `GET /api/exams/:id`

**Parâmetros de URL:**
- `id` - ID da prova

**Resposta (200):**
```json
{
  "id": "uuid",
  "name": "Prova Final - Matemática",
  "header": {...},
  "questionIds": ["uuid1", "uuid2"],
  "alternativeType": "LETTERS",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### Criar nova prova

#### `POST /api/exams`

**Body:**
```json
{
  "name": "Prova 1 - História",
  "header": {
    "subject": "História",
    "professor": "Prof. Maria Santos",
    "date": "2024-06-20",
    "additionalInfo": "Prova com consulta ao livro"
  },
  "questionIds": ["question-id-1", "question-id-2"],
  "alternativeType": "LETTERS"
}
```

**Valores possíveis para `alternativeType`:**
- `"LETTERS"` - Alternativas identificadas por letras (A, B, C...)
- `"POWERS_OF_TWO"` - Alternativas identificadas por potências de 2 (1, 2, 4, 8...)

**Resposta (201):**
```json
{
  "id": "uuid",
  "name": "Prova 1 - História",
  "header": {...},
  "questionIds": ["question-id-1", "question-id-2"],
  "alternativeType": "LETTERS",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### Atualizar prova

#### `PUT /api/exams/:id`

**Parâmetros de URL:**
- `id` - ID da prova

**Body:** Mesmo formato do POST

**Resposta (200):** Prova atualizada

---

### Remover prova

#### `DELETE /api/exams/:id`

**Resposta (204):** Sem conteúdo

---

## Geração de Provas Individuais

### Gerar provas individuais

#### `POST /api/exams/:id/generate`

Gera múltiplas versões de uma prova com questões e alternativas embaralhadas.

**Parâmetros de URL:**
- `id` - ID da prova base

**Body:**
```json
{
  "count": 30
}
```

**Resposta (200):**
```json
{
  "generatedExams": [
    {
      "examNumber": 1,
      "examId": "uuid",
      "questions": [
        {
          "originalQuestionId": "uuid",
          "statement": "Questão 1",
          "alternatives": [
            {
              "originalAlternativeId": "uuid",
              "description": "Alternativa A",
              "shouldBeMarked": true,
              "position": 0
            }
          ]
        }
      ]
    }
  ],
  "answerKey": [
    {
      "examNumber": 1,
      "answers": ["A", "BC", "ABD"]
    },
    {
      "examNumber": 2,
      "answers": ["B", "AC", "ACD"]
    }
  ]
}
```

---

### Exportar gabarito em CSV

#### `POST /api/exams/:id/answer-key/csv`

Gera e retorna o gabarito em formato CSV para download.

**Parâmetros de URL:**
- `id` - ID da prova

**Body:**
```json
{
  "count": 30
}
```

**Resposta (200):**
- Content-Type: `text/csv`
- Content-Disposition: `attachment; filename=gabarito-{nome-prova}.csv`

**Conteúdo do CSV:**
```csv
Numero_Prova,Questao_1,Questao_2,Questao_3
1,AB,C,ACD
2,AC,B,ABD
3,BC,A,BCD
```

---

## Correção de Provas

### Corrigir provas (JSON)

#### `POST /api/correction`

Corrige provas e retorna os resultados em JSON.

**Body:**
```json
{
  "answerKeyCSV": "Numero_Prova,Questao_1,Questao_2\n1,AB,C\n2,AC,B",
  "studentAnswersCSV": "Numero_Prova,Nome,CPF,Questao_1,Questao_2\n1,João Silva,12345678901,AB,C\n2,Maria Santos,98765432109,A,B",
  "correctionType": "PROPORTIONAL",
  "alternativeType": "LETTERS"
}
```

**Valores possíveis para `correctionType`:**
- `"STRICT"` - Qualquer erro zera a questão
- `"PROPORTIONAL"` - Nota proporcional aos acertos

**Valores possíveis para `alternativeType`:**
- `"LETTERS"` - Alternativas identificadas por letras
- `"POWERS_OF_TWO"` - Alternativas identificadas por potências de 2

**Resposta (200):**
```json
[
  {
    "examNumber": 1,
    "studentName": "João Silva",
    "studentCPF": "12345678901",
    "questionResults": [
      {
        "questionNumber": 1,
        "expectedAnswer": "AB",
        "studentAnswer": "AB",
        "score": 1.0
      },
      {
        "questionNumber": 2,
        "expectedAnswer": "C",
        "studentAnswer": "C",
        "score": 1.0
      }
    ],
    "totalScore": 10.0
  }
]
```

---

### Corrigir provas (CSV)

#### `POST /api/correction/csv`

Corrige provas e retorna relatório em CSV.

**Body:** Mesmo formato do endpoint anterior

**Resposta (200):**
- Content-Type: `text/csv`
- Content-Disposition: `attachment; filename=relatorio-notas.csv`

**Conteúdo do CSV:**
```csv
Numero_Prova,Nome,CPF,Questao_1,Questao_2,Nota_Final
1,João Silva,12345678901,1.00,1.00,10.00
2,Maria Santos,98765432109,0.50,0.00,2.50
```

---

## Códigos de Status HTTP

- `200 OK` - Requisição bem-sucedida
- `201 Created` - Recurso criado com sucesso
- `204 No Content` - Recurso removido com sucesso
- `400 Bad Request` - Dados inválidos na requisição
- `404 Not Found` - Recurso não encontrado
- `500 Internal Server Error` - Erro interno do servidor

---

## Exemplos de Uso

### Exemplo com cURL

**Criar uma questão:**
```bash
curl -X POST http://localhost:3001/api/questions \
  -H "Content-Type: application/json" \
  -d '{
    "statement": "Qual é 2 + 2?",
    "alternatives": [
      {"description": "3", "shouldBeMarked": false},
      {"description": "4", "shouldBeMarked": true}
    ]
  }'
```

**Listar questões:**
```bash
curl http://localhost:3001/api/questions
```

**Criar uma prova:**
```bash
curl -X POST http://localhost:3001/api/exams \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Prova 1",
    "header": {
      "subject": "Matemática",
      "professor": "Prof. Silva",
      "date": "2024-06-15"
    },
    "questionIds": ["question-id-aqui"],
    "alternativeType": "LETTERS"
  }'
```

**Gerar 10 provas individuais:**
```bash
curl -X POST http://localhost:3001/api/exams/{exam-id}/generate \
  -H "Content-Type: application/json" \
  -d '{"count": 10}'
```

---

## Estrutura de Dados

### Alternative
```typescript
{
  id: string;
  description: string;
  shouldBeMarked: boolean;
}
```

### Question
```typescript
{
  id: string;
  statement: string;
  alternatives: Alternative[];
  createdAt: Date;
  updatedAt: Date;
}
```

### ExamHeader
```typescript
{
  subject: string;
  professor: string;
  date: string;
  additionalInfo?: string;
}
```

### Exam
```typescript
{
  id: string;
  name: string;
  header: ExamHeader;
  questionIds: string[];
  alternativeType: "LETTERS" | "POWERS_OF_TWO";
  createdAt: Date;
  updatedAt: Date;
}
```

---

**Backend desenvolvido com Node.js, TypeScript e Express**
