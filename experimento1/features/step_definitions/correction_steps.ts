import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { expect } from 'chai';
import { correctionService } from '../../src/services/CorrectionService';
import { csvService } from '../../src/services/CsvService';
import { ExamAnswer, StudentAnswer, ExamResult, CorrectionType, AlternativeType } from '../../src/models';

interface CorrectionContext {
  answerKey: ExamAnswer[];
  studentAnswers: StudentAnswer[];
  results: ExamResult[];
  correctionType: CorrectionType;
  alternativeType: AlternativeType;
  currentQuestionScore?: number;
}

const context: CorrectionContext = {
  answerKey: [],
  studentAnswers: [],
  results: [],
  correctionType: CorrectionType.STRICT,
  alternativeType: AlternativeType.LETTERS
};

Before({ tags: '@correction' }, function() {
  context.answerKey = [];
  context.studentAnswers = [];
  context.results = [];
  context.currentQuestionScore = undefined;
  context.alternativeType = AlternativeType.LETTERS;
});

Given('que existe um gabarito com resposta {string} para questão {int}', function(answer: string, questionNum: number) {
  context.answerKey = [{
    examNumber: 1,
    answers: [answer]
  }];
  context.alternativeType = AlternativeType.LETTERS;
});

Given('um aluno respondeu {string} para questão {int}', function(answer: string, questionNum: number) {
  context.studentAnswers = [{
    examNumber: 1,
    studentName: 'João Silva',
    studentCPF: '12345678901',
    answers: [answer]
  }];
});

When('eu corrigir a prova com método {string}', function(method: string) {
  context.correctionType = method === 'estrito' ? CorrectionType.STRICT : CorrectionType.PROPORTIONAL;
  context.results = correctionService.correctExams(
    context.answerKey,
    context.studentAnswers,
    context.correctionType,
    context.alternativeType
  );
  context.currentQuestionScore = context.results[0].questionResults[0].score;
});

Then('a nota da questão {int} deve ser {float}', function(questionNum: number, expectedScore: number) {
  expect(context.currentQuestionScore).to.equal(expectedScore);
});

Then('a nota da questão {int} deve ser maior que {float}', function(questionNum: number, minScore: number) {
  expect(context.currentQuestionScore).to.be.greaterThan(minScore);
});

Given('que existem {int} provas corrigidas', function(count: number) {
  context.answerKey = [];
  context.studentAnswers = [];

  for (let i = 1; i <= count; i++) {
    context.answerKey.push({
      examNumber: i,
      answers: ['A', 'B']
    });

    context.studentAnswers.push({
      examNumber: i,
      studentName: `Aluno ${i}`,
      studentCPF: `1234567890${i}`,
      answers: ['A', 'B']
    });
  }

  context.results = correctionService.correctExams(
    context.answerKey,
    context.studentAnswers,
    CorrectionType.STRICT,
    AlternativeType.LETTERS
  );
});

When('eu gerar o relatório de notas', function() {
  // O relatório já está em context.results
});

Then('o relatório deve conter {int} linhas de alunos', function(count: number) {
  expect(context.results).to.have.lengthOf(count);
});

Then('cada linha deve ter nome, CPF e nota final', function() {
  for (const result of context.results) {
    expect(result.studentName).to.be.a('string').and.not.empty;
    expect(result.studentCPF).to.be.a('string').and.not.empty;
    expect(result.totalScore).to.be.a('number');
  }
});
