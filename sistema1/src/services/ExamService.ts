import { Exam, ExamHeader, AlternativeType, Question, GeneratedExam, GeneratedQuestion, GeneratedAlternative, ExamAnswer } from '../models';
import { examRepository } from '../repositories/ExamRepository';
import { questionRepository } from '../repositories/QuestionRepository';
import { generateId, shuffleArray, numberToLetter, numberToPowerOfTwo } from '../utils/helpers';

/**
 * Serviço para gerenciamento de provas
 * Implementa operações de CRUD e geração de provas individuais
 */
export class ExamService {
  /**
   * Cria uma nova prova
   */
  createExam(
    name: string,
    header: ExamHeader,
    questionIds: string[],
    alternativeType: AlternativeType
  ): Exam {
    if (!name || name.trim() === '') {
      throw new Error('O nome da prova não pode estar vazio');
    }

    if (!questionIds || questionIds.length === 0) {
      throw new Error('A prova deve ter pelo menos uma questão');
    }

    // Valida se todas as questões existem
    for (const questionId of questionIds) {
      const question = questionRepository.findById(questionId);
      if (!question) {
        throw new Error(`Questão com ID ${questionId} não encontrada`);
      }
    }

    const exam: Exam = {
      id: generateId(),
      name: name.trim(),
      header,
      questionIds,
      alternativeType,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return examRepository.save(exam);
  }

  /**
   * Busca todas as provas
   */
  getAllExams(): Exam[] {
    return examRepository.findAll();
  }

  /**
   * Busca uma prova por ID
   */
  getExamById(id: string): Exam | undefined {
    return examRepository.findById(id);
  }

  /**
   * Atualiza uma prova existente
   */
  updateExam(
    id: string,
    name: string,
    header: ExamHeader,
    questionIds: string[],
    alternativeType: AlternativeType
  ): Exam {
    const existingExam = examRepository.findById(id);
    if (!existingExam) {
      throw new Error(`Prova com ID ${id} não encontrada`);
    }

    if (!name || name.trim() === '') {
      throw new Error('O nome da prova não pode estar vazio');
    }

    if (!questionIds || questionIds.length === 0) {
      throw new Error('A prova deve ter pelo menos uma questão');
    }

    // Valida se todas as questões existem
    for (const questionId of questionIds) {
      const question = questionRepository.findById(questionId);
      if (!question) {
        throw new Error(`Questão com ID ${questionId} não encontrada`);
      }
    }

    const updatedExam: Exam = {
      id,
      name: name.trim(),
      header,
      questionIds,
      alternativeType,
      createdAt: existingExam.createdAt,
      updatedAt: new Date()
    };

    const result = examRepository.update(id, updatedExam);
    if (!result) {
      throw new Error(`Erro ao atualizar prova com ID ${id}`);
    }

    return result;
  }

  /**
   * Remove uma prova
   */
  deleteExam(id: string): boolean {
    const deleted = examRepository.delete(id);
    if (!deleted) {
      throw new Error(`Prova com ID ${id} não encontrada`);
    }
    return true;
  }

  /**
   * Gera provas individuais com questões e alternativas embaralhadas
   */
  generateIndividualExams(examId: string, count: number): GeneratedExam[] {
    if (count <= 0) {
      throw new Error('O número de provas deve ser maior que zero');
    }

    const exam = examRepository.findById(examId);
    if (!exam) {
      throw new Error(`Prova com ID ${examId} não encontrada`);
    }

    const questions: Question[] = [];
    for (const questionId of exam.questionIds) {
      const question = questionRepository.findById(questionId);
      if (!question) {
        throw new Error(`Questão com ID ${questionId} não encontrada`);
      }
      questions.push(question);
    }

    const generatedExams: GeneratedExam[] = [];

    for (let i = 1; i <= count; i++) {
      const shuffledQuestions = shuffleArray(questions);
      
      const generatedQuestions: GeneratedQuestion[] = shuffledQuestions.map(question => {
        const shuffledAlternatives = shuffleArray(question.alternatives);
        
        const generatedAlternatives: GeneratedAlternative[] = shuffledAlternatives.map((alt, index) => ({
          originalAlternativeId: alt.id,
          description: alt.description,
          shouldBeMarked: alt.shouldBeMarked,
          position: index
        }));

        return {
          originalQuestionId: question.id,
          statement: question.statement,
          alternatives: generatedAlternatives
        };
      });

      generatedExams.push({
        examNumber: i,
        examId: exam.id,
        questions: generatedQuestions
      });
    }

    return generatedExams;
  }

  /**
   * Gera o gabarito de provas individuais
   */
  generateAnswerKey(generatedExams: GeneratedExam[], alternativeType: AlternativeType): ExamAnswer[] {
    return generatedExams.map(exam => {
      const answers = exam.questions.map(question => {
        const correctAlternatives = question.alternatives
          .filter(alt => alt.shouldBeMarked)
          .sort((a, b) => a.position - b.position);

        if (alternativeType === AlternativeType.LETTERS) {
          return correctAlternatives
            .map(alt => numberToLetter(alt.position))
            .join('');
        } else {
          const sum = correctAlternatives
            .reduce((acc, alt) => acc + numberToPowerOfTwo(alt.position), 0);
          return sum.toString();
        }
      });

      return {
        examNumber: exam.examNumber,
        answers
      };
    });
  }
}

export const examService = new ExamService();
