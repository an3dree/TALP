// Representa uma alternativa de uma questão
export interface Alternative {
  id: string;
  description: string;
  shouldBeMarked: boolean; // Indica se deve ser marcada pelo aluno
}

// Representa uma questão fechada
export interface Question {
  id: string;
  statement: string; // Enunciado da questão
  alternatives: Alternative[];
  createdAt: Date;
  updatedAt: Date;
}

// Tipo de identificação das alternativas
export enum AlternativeType {
  LETTERS = 'LETTERS', // A, B, C, D, E...
  POWERS_OF_TWO = 'POWERS_OF_TWO' // 1, 2, 4, 8, 16...
}

// Cabeçalho da prova
export interface ExamHeader {
  subject: string; // Nome da disciplina
  professor: string;
  date: string;
  additionalInfo?: string;
}

// Representa uma prova
export interface Exam {
  id: string;
  name: string;
  header: ExamHeader;
  questionIds: string[]; // IDs das questões selecionadas
  alternativeType: AlternativeType;
  createdAt: Date;
  updatedAt: Date;
}

// Representa uma prova individual gerada
export interface GeneratedExam {
  examNumber: number;
  examId: string;
  questions: GeneratedQuestion[];
}

// Questão com alternativas embaralhadas
export interface GeneratedQuestion {
  originalQuestionId: string;
  statement: string;
  alternatives: GeneratedAlternative[];
}

// Alternativa com posição embaralhada
export interface GeneratedAlternative {
  originalAlternativeId: string;
  description: string;
  shouldBeMarked: boolean;
  position: number; // Posição na prova individual
}

// Gabarito de uma prova individual
export interface ExamAnswer {
  examNumber: number;
  answers: string[]; // Resposta esperada para cada questão (letras ou soma)
}

// Resposta do aluno
export interface StudentAnswer {
  examNumber: number;
  studentName: string;
  studentCPF: string;
  answers: string[]; // Respostas dadas pelo aluno
}

// Tipo de correção
export enum CorrectionType {
  STRICT = 'STRICT', // Qualquer erro zera a questão
  PROPORTIONAL = 'PROPORTIONAL' // Nota proporcional aos acertos
}

// Resultado da correção de uma questão
export interface QuestionResult {
  questionNumber: number;
  expectedAnswer: string;
  studentAnswer: string;
  score: number; // Nota da questão (0 a 1)
}

// Resultado da correção de uma prova
export interface ExamResult {
  examNumber: number;
  studentName: string;
  studentCPF: string;
  questionResults: QuestionResult[];
  totalScore: number; // Nota final (0 a 10)
}
