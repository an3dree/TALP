import * as fs from 'fs';
import * as path from 'path';
import { ExamAnswer, StudentAnswer, ExamResult } from '../models';

/**
 * Serviço para geração e leitura de arquivos CSV
 */
export class CsvService {
  /**
   * Gera CSV com gabarito das provas
   */
  generateAnswerKeyCSV(answerKey: ExamAnswer[], outputPath?: string): string {
    const lines: string[] = [];
    
    // Cabeçalho
    const maxQuestions = Math.max(...answerKey.map(ak => ak.answers.length));
    const headers = ['Numero_Prova', ...Array.from({ length: maxQuestions }, (_, i) => `Questao_${i + 1}`)];
    lines.push(headers.join(','));

    // Dados
    for (const answer of answerKey) {
      const row = [answer.examNumber.toString(), ...answer.answers];
      lines.push(row.join(','));
    }

    const csvContent = lines.join('\n');

    if (outputPath) {
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(outputPath, csvContent);
    }

    return csvContent;
  }

  /**
   * Lê CSV com respostas dos alunos
   */
  parseStudentAnswersCSV(csvContent: string): StudentAnswer[] {
    const lines = csvContent.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV vazio ou sem dados');
    }

    const headers = lines[0].split(',').map(h => h.trim());
    const studentAnswers: StudentAnswer[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      
      if (values.length < 3) {
        throw new Error(`Linha ${i + 1} inválida: dados insuficientes`);
      }

      const examNumber = parseInt(values[0]);
      if (isNaN(examNumber)) {
        throw new Error(`Linha ${i + 1} inválida: número da prova deve ser numérico`);
      }

      studentAnswers.push({
        examNumber,
        studentName: values[1],
        studentCPF: values[2],
        answers: values.slice(3)
      });
    }

    return studentAnswers;
  }

  /**
   * Lê CSV com gabarito das provas
   */
  parseAnswerKeyCSV(csvContent: string): ExamAnswer[] {
    const lines = csvContent.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV vazio ou sem dados');
    }

    const answerKey: ExamAnswer[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      
      if (values.length < 2) {
        throw new Error(`Linha ${i + 1} inválida: dados insuficientes`);
      }

      const examNumber = parseInt(values[0]);
      if (isNaN(examNumber)) {
        throw new Error(`Linha ${i + 1} inválida: número da prova deve ser numérico`);
      }

      answerKey.push({
        examNumber,
        answers: values.slice(1)
      });
    }

    return answerKey;
  }

  /**
   * Gera CSV com relatório de notas
   */
  generateGradesReportCSV(results: ExamResult[], outputPath?: string): string {
    const lines: string[] = [];
    
    // Cabeçalho
    const maxQuestions = Math.max(...results.map(r => r.questionResults.length));
    const headers = [
      'Numero_Prova',
      'Nome',
      'CPF',
      ...Array.from({ length: maxQuestions }, (_, i) => `Questao_${i + 1}`),
      'Nota_Final'
    ];
    lines.push(headers.join(','));

    // Dados
    for (const result of results) {
      const questionScores = result.questionResults.map(qr => qr.score.toFixed(2));
      const row = [
        result.examNumber.toString(),
        result.studentName,
        result.studentCPF,
        ...questionScores,
        result.totalScore.toFixed(2)
      ];
      lines.push(row.join(','));
    }

    const csvContent = lines.join('\n');

    if (outputPath) {
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(outputPath, csvContent);
    }

    return csvContent;
  }
}

export const csvService = new CsvService();
