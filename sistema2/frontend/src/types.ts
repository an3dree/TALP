// Shared types between Backend and Frontend

export type Conceito = 'MANA' | 'MPA' | 'MA';

export interface Aluno {
  id: string;
  nome: string;
  cpf: string;
  email: string;
}

export interface Avaliacao {
  alunoId: string;
  meta: string;
  conceito: Conceito;
  dataModificacao: string; // ISO date string
}

export interface Turma {
  id: string;
  topico: string;
  ano: number;
  semestre: number;
  alunosMatriculados: string[]; // Array of Aluno IDs
  avaliacoes: Avaliacao[];
}

export interface NotificacaoPendente {
  alunoId: string;
  email: string;
  data: string; // ISO date string (only date, no time)
  alteracoes: {
    turmaId: string;
    turmaTopico: string;
    meta: string;
    conceitoNovo: Conceito;
  }[];
}

// DTOs for API requests

export interface CreateAlunoDTO {
  nome: string;
  cpf: string;
  email: string;
}

export interface UpdateAlunoDTO {
  id: string;
  nome?: string;
  cpf?: string;
  email?: string;
}

export interface CreateTurmaDTO {
  topico: string;
  ano: number;
  semestre: number;
}

export interface UpdateTurmaDTO {
  id: string;
  topico?: string;
  ano?: number;
  semestre?: number;
}

export interface MatricularAlunoDTO {
  turmaId: string;
  alunoId: string;
}

export interface AvaliarAlunoDTO {
  turmaId: string;
  alunoId: string;
  meta: string;
  conceito: Conceito;
}

// API Response types

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
