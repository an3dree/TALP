import { Given, When, Then } from '@cucumber/cucumber';
import { TestWorld } from '../support/world';
import * as assert from 'assert';

// ============== Cenário: Criação de nova turma ==============

When('eu preencho o tópico {string}, ano {string} e semestre {string}', async function (
  this: TestWorld,
  topico: string,
  ano: string,
  semestre: string
) {
  try {
    this.lastTurma = await this.turmaService.createTurma({
      topico,
      ano: parseInt(ano, 10),
      semestre: parseInt(semestre, 10),
    });
  } catch (error) {
    this.lastError = error as Error;
  }
});

Then('a turma {string} deve aparecer na lista', async function (
  this: TestWorld,
  turmaDescricao: string
) {
  const turmas = await this.turmaService.getAllTurmas();
  const turmaEncontrada = turmas.find((t) => {
    const descricao = `${t.topico} ${t.ano}.${t.semestre}`;
    return descricao === turmaDescricao;
  });
  assert.ok(turmaEncontrada, `Turma "${turmaDescricao}" não encontrada na lista`);
});

// ============== Cenário: Matrícula de aluno em turma ==============

Given('que existe uma turma {string}', async function (
  this: TestWorld,
  turmaDescricao: string
) {
  // Parse "Introdução a Programação 2026.1"
  const match = turmaDescricao.match(/^(.+)\s+(\d{4})\.(\d)$/);
  if (match) {
    const [, topico, ano, semestre] = match;
    this.lastTurma = await this.turmaService.createTurma({
      topico,
      ano: parseInt(ano, 10),
      semestre: parseInt(semestre, 10),
    });
  }
});

// Nota: "que existe um aluno X cadastrado" está definido em alunos.steps.ts

When('eu matriculo o aluno {string} na turma', async function (
  this: TestWorld,
  _nome: string
) {
  if (!this.lastTurma) {
    throw new Error('Nenhuma turma disponível');
  }
  if (!this.lastAluno) {
    throw new Error('Nenhum aluno disponível');
  }
  await this.turmaService.matricularAluno({
    turmaId: this.lastTurma.id,
    alunoId: this.lastAluno.id,
  });
});

Then('o aluno deve aparecer na lista de alunos matriculados da turma', async function (
  this: TestWorld
) {
  if (!this.lastTurma) {
    throw new Error('Nenhuma turma disponível');
  }
  if (!this.lastAluno) {
    throw new Error('Nenhum aluno disponível');
  }
  const turma = await this.turmaRepository.findById(this.lastTurma.id);
  if (!turma) {
    throw new Error('Turma não encontrada');
  }
  assert.ok(
    turma.alunosMatriculados.includes(this.lastAluno.id),
    'Aluno não está na lista de matriculados'
  );
});

// ============== Cenário: Desmatrícula de aluno da turma ==============

Given('que o aluno {string} está matriculado na turma {string}', async function (
  this: TestWorld,
  nomeAluno: string,
  turmaDescricao: string
) {
  // Criar turma
  const match = turmaDescricao.match(/^(.+)\s+(\d{4})\.(\d)$/);
  if (match) {
    const [, topico, ano, semestre] = match;
    this.lastTurma = await this.turmaService.createTurma({
      topico,
      ano: parseInt(ano, 10),
      semestre: parseInt(semestre, 10),
    });
  }

  // Criar aluno
  this.lastAluno = await this.alunoService.createAluno({
    nome: nomeAluno,
    cpf: '111.222.333-44',
    email: `${nomeAluno.toLowerCase().replace(/\s+/g, '.')}@email.com`,
  });

  // Matricular
  if (!this.lastTurma) {
    throw new Error('Turma não foi criada');
  }
  await this.turmaService.matricularAluno({
    turmaId: this.lastTurma.id,
    alunoId: this.lastAluno.id,
  });
});

When('eu desmatriculo o aluno da turma', async function (this: TestWorld) {
  if (!this.lastTurma) {
    throw new Error('Nenhuma turma disponível');
  }
  if (!this.lastAluno) {
    throw new Error('Nenhum aluno disponível');
  }
  await this.turmaService.desmatricularAluno(this.lastTurma.id, this.lastAluno.id);
});

Then('o aluno não deve mais aparecer na lista de alunos matriculados', async function (
  this: TestWorld
) {
  if (!this.lastTurma) {
    throw new Error('Nenhuma turma disponível');
  }
  if (!this.lastAluno) {
    throw new Error('Nenhum aluno disponível');
  }
  const turma = await this.turmaRepository.findById(this.lastTurma.id);
  if (!turma) {
    throw new Error('Turma não encontrada');
  }
  assert.ok(
    !turma.alunosMatriculados.includes(this.lastAluno.id),
    'Aluno ainda está na lista de matriculados'
  );
});

// ============== Cenário: Remoção de turma ==============

When('eu removo a turma', async function (this: TestWorld) {
  if (!this.lastTurma) {
    throw new Error('Nenhuma turma disponível');
  }
  await this.turmaService.deleteTurma(this.lastTurma.id);
});

Then('a turma não deve mais aparecer na lista de turmas', async function (this: TestWorld) {
  const turmas = await this.turmaService.getAllTurmas();
  assert.strictEqual(turmas.length, 0, 'Lista de turmas deveria estar vazia');
});
