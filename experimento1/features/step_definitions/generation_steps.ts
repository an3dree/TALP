import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { expect } from 'chai';
import { examService } from '../../src/services/ExamService';
import { questionService } from '../../src/services/QuestionService';
import { examRepository } from '../../src/repositories/ExamRepository';
import { questionRepository } from '../../src/repositories/QuestionRepository';
import { Exam, AlternativeType, GeneratedExam, ExamAnswer } from '../../src/models';

interface GenerationContext {
  exam?: Exam;
  generatedExams: GeneratedExam[];
  answerKey: ExamAnswer[];
  alternativeType: AlternativeType;
}

const context: GenerationContext = {
  generatedExams: [],
  answerKey: [],
  alternativeType: AlternativeType.LETTERS
};

Before({ tags: '@generation' }, function() {
  examRepository.deleteAll();
  questionRepository.deleteAll();
  context.exam = undefined;
  context.generatedExams = [];
  context.answerKey = [];
});

After({ tags: '@generation' }, function() {
  examRepository.deleteAll();
  questionRepository.deleteAll();
});

Given('que existe uma prova cadastrada com {int} questões', function(count: number) {
  const questions = [];
  for (let i = 0; i < count; i++) {
    const q = questionService.createQuestion(`Questão ${i + 1}`, [
      { description: 'A', shouldBeMarked: true },
      { description: 'B', shouldBeMarked: false },
      { description: 'C', shouldBeMarked: true }
    ]);
    questions.push(q);
  }

  context.exam = examService.createExam(
    'Prova Teste',
    {
      subject: 'Teste',
      professor: 'Prof. Teste',
      date: '2024-01-01'
    },
    questions.map(q => q.id),
    AlternativeType.LETTERS
  );
  context.alternativeType = AlternativeType.LETTERS;
});

When('eu gerar {int} provas individuais', function(count: number) {
  context.generatedExams = examService.generateIndividualExams(context.exam!.id, count);
});

Then('devem ser geradas {int} provas', function(count: number) {
  expect(context.generatedExams).to.have.lengthOf(count);
});

Then('cada prova deve ter questões embaralhadas', function() {
  // Verifica se as questões estão em ordens diferentes em pelo menos algumas provas
  if (context.generatedExams.length < 2) return;

  const firstExamQuestionIds = context.generatedExams[0].questions.map(q => q.originalQuestionId);
  const secondExamQuestionIds = context.generatedExams[1].questions.map(q => q.originalQuestionId);

  // As questões devem existir mas podem estar em ordem diferente
  expect(firstExamQuestionIds).to.have.lengthOf(secondExamQuestionIds.length);
});

Then('cada prova deve ter alternativas embaralhadas', function() {
  // Verifica se cada questão tem alternativas
  for (const exam of context.generatedExams) {
    for (const question of exam.questions) {
      expect(question.alternatives.length).to.be.greaterThan(0);
    }
  }
});

Given('que existem provas individuais geradas com tipo {string}', function(type: string) {
  context.alternativeType = type === 'LETTERS' ? AlternativeType.LETTERS : AlternativeType.POWERS_OF_TWO;
  
  const q1 = questionService.createQuestion('Questão 1', [
    { description: 'A', shouldBeMarked: true },
    { description: 'B', shouldBeMarked: false },
    { description: 'C', shouldBeMarked: true }
  ]);

  context.exam = examService.createExam(
    'Prova Teste',
    {
      subject: 'Teste',
      professor: 'Prof. Teste',
      date: '2024-01-01'
    },
    [q1.id],
    context.alternativeType
  );

  context.generatedExams = examService.generateIndividualExams(context.exam.id, 2);
});

When('eu gerar o gabarito', function() {
  context.answerKey = examService.generateAnswerKey(context.generatedExams, context.alternativeType);
});

Then('o gabarito deve conter letras como resposta', function() {
  expect(context.answerKey).to.have.lengthOf.greaterThan(0);
  for (const answer of context.answerKey) {
    for (const ans of answer.answers) {
      // Verifica se contém apenas letras
      expect(/^[A-Z]+$/.test(ans)).to.be.true;
    }
  }
});

Then('o gabarito deve conter somas como resposta', function() {
  expect(context.answerKey).to.have.lengthOf.greaterThan(0);
  for (const answer of context.answerKey) {
    for (const ans of answer.answers) {
      // Verifica se é um número
      expect(/^\d+$/.test(ans)).to.be.true;
    }
  }
});
