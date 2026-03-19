import { Question, Exam, AlternativeType, ExamResult, CorrectionType, Alternative, ExamHeader } from '../types';

// Em produção, usa a mesma origem; em dev, usa proxy do Vite
const API_BASE = import.meta.env.PROD ? '/api' : '/api';

/**
 * Serviço para comunicação com a API de questões
 */
class QuestionService {
  async getAll(): Promise<Question[]> {
    const response = await fetch(`${API_BASE}/questions`);
    if (!response.ok) throw new Error('Erro ao buscar questões');
    return response.json();
  }

  async getById(id: string): Promise<Question> {
    const response = await fetch(`${API_BASE}/questions/${id}`);
    if (!response.ok) throw new Error('Questão não encontrada');
    return response.json();
  }

  async create(statement: string, alternatives: Alternative[]): Promise<Question> {
    const response = await fetch(`${API_BASE}/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statement, alternatives })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao criar questão');
    }
    return response.json();
  }

  async update(id: string, statement: string, alternatives: Alternative[]): Promise<Question> {
    const response = await fetch(`${API_BASE}/questions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statement, alternatives })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao atualizar questão');
    }
    return response.json();
  }

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/questions/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao remover questão');
    }
  }
}

/**
 * Serviço para comunicação com a API de provas
 */
class ExamService {
  async getAll(): Promise<Exam[]> {
    const response = await fetch(`${API_BASE}/exams`);
    if (!response.ok) throw new Error('Erro ao buscar provas');
    return response.json();
  }

  async getById(id: string): Promise<Exam> {
    const response = await fetch(`${API_BASE}/exams/${id}`);
    if (!response.ok) throw new Error('Prova não encontrada');
    return response.json();
  }

  async create(
    name: string,
    header: ExamHeader,
    questionIds: string[],
    alternativeType: AlternativeType
  ): Promise<Exam> {
    const response = await fetch(`${API_BASE}/exams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, header, questionIds, alternativeType })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao criar prova');
    }
    return response.json();
  }

  async update(
    id: string,
    name: string,
    header: ExamHeader,
    questionIds: string[],
    alternativeType: AlternativeType
  ): Promise<Exam> {
    const response = await fetch(`${API_BASE}/exams/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, header, questionIds, alternativeType })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao atualizar prova');
    }
    return response.json();
  }

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/exams/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao remover prova');
    }
  }

  async generateIndividual(examId: string, count: number) {
    const response = await fetch(`${API_BASE}/exams/${examId}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ count })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao gerar provas');
    }
    return response.json();
  }

  async downloadAnswerKeyCSV(examId: string, count: number): Promise<void> {
    const response = await fetch(`${API_BASE}/exams/${examId}/answer-key/csv`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ count })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao gerar gabarito');
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gabarito-${examId}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}

/**
 * Serviço para correção de provas
 */
class CorrectionService {
  async correctExams(
    answerKeyCSV: string,
    studentAnswersCSV: string,
    correctionType: CorrectionType,
    alternativeType: AlternativeType
  ): Promise<ExamResult[]> {
    const response = await fetch(`${API_BASE}/correction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answerKeyCSV,
        studentAnswersCSV,
        correctionType,
        alternativeType
      })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao corrigir provas');
    }
    return response.json();
  }

  async downloadGradesCSV(
    answerKeyCSV: string,
    studentAnswersCSV: string,
    correctionType: CorrectionType,
    alternativeType: AlternativeType
  ): Promise<void> {
    const response = await fetch(`${API_BASE}/correction/csv`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answerKeyCSV,
        studentAnswersCSV,
        correctionType,
        alternativeType
      })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao gerar relatório');
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'relatorio-notas.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}

export const questionService = new QuestionService();
export const examService = new ExamService();
export const correctionService = new CorrectionService();
