import { StudentAnswer, ExamAnswer, ExamResult, QuestionResult, CorrectionType, AlternativeType } from '../models';
import { numberToLetter, numberToPowerOfTwo, isValidCPF } from '../utils/helpers';

/**
 * Serviço para correção de provas
 * Implementa correção estrita e proporcional
 */
export class CorrectionService {
  /**
   * Corrige as provas dos alunos
   */
  correctExams(
    answerKey: ExamAnswer[],
    studentAnswers: StudentAnswer[],
    correctionType: CorrectionType,
    alternativeType: AlternativeType
  ): ExamResult[] {
    const results: ExamResult[] = [];

    for (const studentAnswer of studentAnswers) {
      // Valida CPF
      if (!isValidCPF(studentAnswer.studentCPF)) {
        throw new Error(`CPF inválido para aluno ${studentAnswer.studentName}`);
      }

      // Busca o gabarito correspondente
      const examAnswerKey = answerKey.find(key => key.examNumber === studentAnswer.examNumber);
      if (!examAnswerKey) {
        throw new Error(`Gabarito não encontrado para prova número ${studentAnswer.examNumber}`);
      }

      // Valida número de respostas
      if (studentAnswer.answers.length !== examAnswerKey.answers.length) {
        throw new Error(
          `Número de respostas inválido para aluno ${studentAnswer.studentName}. ` +
          `Esperado: ${examAnswerKey.answers.length}, Recebido: ${studentAnswer.answers.length}`
        );
      }

      // Corrige cada questão
      const questionResults: QuestionResult[] = [];
      for (let i = 0; i < examAnswerKey.answers.length; i++) {
        const expectedAnswer = examAnswerKey.answers[i];
        const studentAnswerStr = studentAnswer.answers[i];

        let score: number;
        if (correctionType === CorrectionType.STRICT) {
          score = this.correctQuestionStrict(expectedAnswer, studentAnswerStr);
        } else {
          score = this.correctQuestionProportional(
            expectedAnswer,
            studentAnswerStr,
            alternativeType
          );
        }

        questionResults.push({
          questionNumber: i + 1,
          expectedAnswer,
          studentAnswer: studentAnswerStr,
          score
        });
      }

      // Calcula nota final (0 a 10)
      const totalScore = (questionResults.reduce((sum, qr) => sum + qr.score, 0) / questionResults.length) * 10;

      results.push({
        examNumber: studentAnswer.examNumber,
        studentName: studentAnswer.studentName,
        studentCPF: studentAnswer.studentCPF,
        questionResults,
        totalScore: Math.round(totalScore * 100) / 100 // Arredonda para 2 casas decimais
      });
    }

    return results;
  }

  /**
   * Correção estrita: qualquer erro zera a questão
   */
  private correctQuestionStrict(expectedAnswer: string, studentAnswer: string): number {
    const normalizedExpected = expectedAnswer.trim().toUpperCase();
    const normalizedStudent = studentAnswer.trim().toUpperCase();
    return normalizedExpected === normalizedStudent ? 1 : 0;
  }

  /**
   * Correção proporcional: nota proporcional aos acertos
   */
  private correctQuestionProportional(
    expectedAnswer: string,
    studentAnswer: string,
    alternativeType: AlternativeType
  ): number {
    const normalizedExpected = expectedAnswer.trim().toUpperCase();
    const normalizedStudent = studentAnswer.trim().toUpperCase();

    if (alternativeType === AlternativeType.LETTERS) {
      return this.correctLettersProportional(normalizedExpected, normalizedStudent);
    } else {
      return this.correctPowersProportional(normalizedExpected, normalizedStudent);
    }
  }

  /**
   * Correção proporcional para alternativas com letras
   */
  private correctLettersProportional(expectedAnswer: string, studentAnswer: string): number {
    const expectedLetters = new Set(expectedAnswer.split(''));
    const studentLetters = new Set(studentAnswer.split(''));

    // Conta alternativas corretas que o aluno marcou
    let correctMarked = 0;
    for (const letter of studentLetters) {
      if (expectedLetters.has(letter)) {
        correctMarked++;
      }
    }

    // Conta alternativas que o aluno não marcou corretamente
    const incorrectMarked = studentLetters.size - correctMarked;
    const incorrectNotMarked = expectedLetters.size - correctMarked;

    const totalErrors = incorrectMarked + incorrectNotMarked;
    const totalAlternatives = Math.max(expectedLetters.size, studentLetters.size);

    if (totalAlternatives === 0) return 0;

    return Math.max(0, 1 - (totalErrors / totalAlternatives));
  }

  /**
   * Correção proporcional para alternativas com potências de 2
   */
  private correctPowersProportional(expectedAnswer: string, studentAnswer: string): number {
    const expectedSum = parseInt(expectedAnswer) || 0;
    const studentSum = parseInt(studentAnswer) || 0;

    // Converte somas para conjuntos de potências
    const expectedPowers = this.sumToPowers(expectedSum);
    const studentPowers = this.sumToPowers(studentSum);

    // Conta acertos e erros
    let correctMarked = 0;
    for (const power of studentPowers) {
      if (expectedPowers.has(power)) {
        correctMarked++;
      }
    }

    const incorrectMarked = studentPowers.size - correctMarked;
    const incorrectNotMarked = expectedPowers.size - correctMarked;

    const totalErrors = incorrectMarked + incorrectNotMarked;
    const totalAlternatives = Math.max(expectedPowers.size, studentPowers.size);

    if (totalAlternatives === 0) return 0;

    return Math.max(0, 1 - (totalErrors / totalAlternatives));
  }

  /**
   * Converte uma soma em conjunto de potências de 2
   */
  private sumToPowers(sum: number): Set<number> {
    const powers = new Set<number>();
    let remaining = sum;
    let power = 0;

    while (remaining > 0) {
      const powerValue = Math.pow(2, power);
      if (remaining & 1) {
        powers.add(powerValue);
      }
      remaining = remaining >> 1;
      power++;
    }

    return powers;
  }
}

export const correctionService = new CorrectionService();
