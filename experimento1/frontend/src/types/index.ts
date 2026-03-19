// Tipos do sistema
export interface Alternative {
  id?: string;
  description: string;
  shouldBeMarked: boolean;
}

export interface Question {
  id: string;
  statement: string;
  alternatives: Alternative[];
  createdAt: string;
  updatedAt: string;
}

export enum AlternativeType {
  LETTERS = 'LETTERS',
  POWERS_OF_TWO = 'POWERS_OF_TWO'
}

export interface ExamHeader {
  subject: string;
  professor: string;
  date: string;
  additionalInfo?: string;
}

export interface Exam {
  id: string;
  name: string;
  header: ExamHeader;
  questionIds: string[];
  alternativeType: AlternativeType;
  createdAt: string;
  updatedAt: string;
}

export interface GeneratedExam {
  examNumber: number;
  examId: string;
  questions: GeneratedQuestion[];
}

export interface GeneratedQuestion {
  originalQuestionId: string;
  statement: string;
  alternatives: GeneratedAlternative[];
}

export interface GeneratedAlternative {
  originalAlternativeId: string;
  description: string;
  shouldBeMarked: boolean;
  position: number;
}

export interface ExamAnswer {
  examNumber: number;
  answers: string[];
}

export enum CorrectionType {
  STRICT = 'STRICT',
  PROPORTIONAL = 'PROPORTIONAL'
}

export interface ExamResult {
  examNumber: number;
  studentName: string;
  studentCPF: string;
  questionResults: QuestionResult[];
  totalScore: number;
}

export interface QuestionResult {
  questionNumber: number;
  expectedAnswer: string;
  studentAnswer: string;
  score: number;
}
