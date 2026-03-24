import { Given, When, Then, Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { expect } from 'chai';
import { questionService } from '../../src/services/QuestionService';
import { questionRepository } from '../../src/repositories/QuestionRepository';
import { Alternative, Question } from '../../src/models';

setDefaultTimeout(5000);

interface QuestionContext {
  statement: string;
  alternatives: Omit<Alternative, 'id'>[];
  createdQuestion?: Question;
  allQuestions?: Question[];
  error?: Error;
}

const context: QuestionContext = {
  statement: '',
  alternatives: []
};

Before({ tags: '@questions' }, function() {
  questionRepository.deleteAll();
  context.statement = '';
  context.alternatives = [];
  context.createdQuestion = undefined;
  context.allQuestions = undefined;
  context.error = undefined;
});

After({ tags: '@questions' }, function() {
  questionRepository.deleteAll();
});

Given('que eu tenho um enunciado {string}', function(statement: string) {
  context.statement = statement;
});

Given('eu tenho as seguintes alternativas:', function(dataTable: any) {
  context.alternatives = dataTable.hashes().map((row: any) => ({
    description: row.descrição || row.descricao,
    shouldBeMarked: row.correta === 'sim'
  }));
});

When('eu criar a questão', function() {
  context.createdQuestion = questionService.createQuestion(context.statement, context.alternatives);
});

When('eu tentar criar a questão', function() {
  try {
    context.createdQuestion = questionService.createQuestion(context.statement, context.alternatives);
  } catch (error: any) {
    context.error = error;
  }
});

Then('a questão deve ser criada com sucesso', function() {
  expect(context.createdQuestion).to.exist;
  expect(context.createdQuestion!.id).to.be.a('string');
});

Then('a questão deve ter {int} alternativas', function(count: number) {
  expect(context.createdQuestion!.alternatives).to.have.lengthOf(count);
});

Then('deve retornar erro {string}', function(errorMessage: string) {
  expect(context.error).to.exist;
  expect(context.error!.message).to.equal(errorMessage);
});

Given('que existe uma questão cadastrada', function() {
  const alternatives = [
    { description: 'Alt A', shouldBeMarked: true },
    { description: 'Alt B', shouldBeMarked: false }
  ];
  context.createdQuestion = questionService.createQuestion('Teste', alternatives);
});

When('eu atualizar o enunciado para {string}', function(newStatement: string) {
  const alternatives = context.createdQuestion!.alternatives.map(alt => ({
    description: alt.description,
    shouldBeMarked: alt.shouldBeMarked
  }));
  context.createdQuestion = questionService.updateQuestion(
    context.createdQuestion!.id,
    newStatement,
    alternatives
  );
});

Then('a questão deve ser atualizada com sucesso', function() {
  expect(context.createdQuestion).to.exist;
});

When('eu remover a questão', function() {
  questionService.deleteQuestion(context.createdQuestion!.id);
});

Then('a questão deve ser removida com sucesso', function() {
  const question = questionService.getQuestionById(context.createdQuestion!.id);
  expect(question).to.be.undefined;
});

Given('que existem {int} questões cadastradas', function(count: number) {
  questionRepository.deleteAll();
  for (let i = 0; i < count; i++) {
    const alternatives = [
      { description: 'Alt A', shouldBeMarked: true },
      { description: 'Alt B', shouldBeMarked: false }
    ];
    questionService.createQuestion(`Questão ${i + 1}`, alternatives);
  }
});

When('eu listar todas as questões', function() {
  context.allQuestions = questionService.getAllQuestions();
});

Then('devo receber {int} questões', function(count: number) {
  expect(context.allQuestions).to.have.lengthOf(count);
});
