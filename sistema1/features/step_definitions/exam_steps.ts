import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { expect } from 'chai';
import { examService } from '../../src/services/ExamService';
import { questionService } from '../../src/services/QuestionService';
import { examRepository } from '../../src/repositories/ExamRepository';
import { questionRepository } from '../../src/repositories/QuestionRepository';
import { Exam, AlternativeType, Question } from '../../src/models';

interface ExamContext {
  exam?: Exam;
  questions: Question[];
  examName: string;
  alternativeType: AlternativeType;
}

const context: ExamContext = {
  questions: [],
  examName: '',
  alternativeType: AlternativeType.LETTERS
};

Before({ tags: '@exams' }, function() {
  examRepository.deleteAll();
  questionRepository.deleteAll();
  context.exam = undefined;
  context.questions = [];
  context.examName = '';
});

After({ tags: '@exams' }, function() {
  examRepository.deleteAll();
  questionRepository.deleteAll();
});

Given('que existem questões cadastradas', function() {
  const q1 = questionService.createQuestion('Questão 1', [
    { description: 'A', shouldBeMarked: true },
    { description: 'B', shouldBeMarked: false }
  ]);
  const q2 = questionService.createQuestion('Questão 2', [
    { description: 'A', shouldBeMarked: true },
    { description: 'B', shouldBeMarked: true },
    { description: 'C', shouldBeMarked: false }
  ]);
  context.questions = [q1, q2];
});

When('eu criar uma prova {string} com identificação por {string}', function(name: string, type: string) {
  context.examName = name;
  context.alternativeType = type === 'letras' ? AlternativeType.LETTERS : AlternativeType.POWERS_OF_TWO;
});

When('adicionar {int} questões à prova', function(count: number) {
  const questionIds = context.questions.slice(0, count).map(q => q.id);
  context.exam = examService.createExam(
    context.examName,
    {
      subject: 'Teste',
      professor: 'Prof. Teste',
      date: '2024-01-01'
    },
    questionIds,
    context.alternativeType
  );
});

Then('a prova deve ser criada com sucesso', function() {
  expect(context.exam).to.exist;
  expect(context.exam!.id).to.be.a('string');
});

Then('o tipo de alternativa deve ser {string}', function(type: string) {
  expect(context.exam!.alternativeType).to.equal(type);
});

Given('que existe uma prova cadastrada', function() {
  const q1 = questionService.createQuestion('Questão 1', [
    { description: 'A', shouldBeMarked: true },
    { description: 'B', shouldBeMarked: false }
  ]);
  context.exam = examService.createExam(
    'Prova Original',
    {
      subject: 'Teste',
      professor: 'Prof. Teste',
      date: '2024-01-01'
    },
    [q1.id],
    AlternativeType.LETTERS
  );
});

When('eu atualizar o nome para {string}', function(newName: string) {
  context.exam = examService.updateExam(
    context.exam!.id,
    newName,
    context.exam!.header,
    context.exam!.questionIds,
    context.exam!.alternativeType
  );
});

Then('a prova deve ser atualizada com sucesso', function() {
  expect(context.exam).to.exist;
});

When('eu remover a prova', function() {
  examService.deleteExam(context.exam!.id);
});

Then('a prova deve ser removida com sucesso', function() {
  const exam = examService.getExamById(context.exam!.id);
  expect(exam).to.be.undefined;
});
