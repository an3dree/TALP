import { Question, Alternative } from '../models';
import { questionRepository } from '../repositories/QuestionRepository';
import { generateId } from '../utils/helpers';

/**
 * Serviço para gerenciamento de questões
 * Implementa operações de CRUD para questões de provas
 */
export class QuestionService {
  /**
   * Cria uma nova questão
   */
  createQuestion(statement: string, alternatives: Omit<Alternative, 'id'>[]): Question {
    if (!statement || statement.trim() === '') {
      throw new Error('O enunciado da questão não pode estar vazio');
    }

    if (!alternatives || alternatives.length < 2) {
      throw new Error('A questão deve ter pelo menos 2 alternativas');
    }

    const hasCorrectAnswer = alternatives.some(alt => alt.shouldBeMarked);
    if (!hasCorrectAnswer) {
      throw new Error('A questão deve ter pelo menos uma alternativa correta');
    }

    const question: Question = {
      id: generateId(),
      statement: statement.trim(),
      alternatives: alternatives.map(alt => ({
        id: generateId(),
        description: alt.description.trim(),
        shouldBeMarked: alt.shouldBeMarked
      })),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return questionRepository.save(question);
  }

  /**
   * Busca todas as questões
   */
  getAllQuestions(): Question[] {
    return questionRepository.findAll();
  }

  /**
   * Busca uma questão por ID
   */
  getQuestionById(id: string): Question | undefined {
    return questionRepository.findById(id);
  }

  /**
   * Atualiza uma questão existente
   */
  updateQuestion(id: string, statement: string, alternatives: Omit<Alternative, 'id'>[]): Question {
    const existingQuestion = questionRepository.findById(id);
    if (!existingQuestion) {
      throw new Error(`Questão com ID ${id} não encontrada`);
    }

    if (!statement || statement.trim() === '') {
      throw new Error('O enunciado da questão não pode estar vazio');
    }

    if (!alternatives || alternatives.length < 2) {
      throw new Error('A questão deve ter pelo menos 2 alternativas');
    }

    const hasCorrectAnswer = alternatives.some(alt => alt.shouldBeMarked);
    if (!hasCorrectAnswer) {
      throw new Error('A questão deve ter pelo menos uma alternativa correta');
    }

    const updatedQuestion: Question = {
      id,
      statement: statement.trim(),
      alternatives: alternatives.map(alt => ({
        id: generateId(),
        description: alt.description.trim(),
        shouldBeMarked: alt.shouldBeMarked
      })),
      createdAt: existingQuestion.createdAt,
      updatedAt: new Date()
    };

    const result = questionRepository.update(id, updatedQuestion);
    if (!result) {
      throw new Error(`Erro ao atualizar questão com ID ${id}`);
    }

    return result;
  }

  /**
   * Remove uma questão
   */
  deleteQuestion(id: string): boolean {
    const deleted = questionRepository.delete(id);
    if (!deleted) {
      throw new Error(`Questão com ID ${id} não encontrada`);
    }
    return true;
  }
}

export const questionService = new QuestionService();
