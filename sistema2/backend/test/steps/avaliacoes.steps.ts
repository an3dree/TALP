import { Given, When, Then } from '@cucumber/cucumber';
import { TestWorld } from '../support/world';
import * as assert from 'assert';
import type { Conceito } from '../../src/shared/types';

// ============== Cenário: Atribuição de conceito MA em Requisitos ==============

// Given "que o aluno ... está matriculado na turma ..." já definido em turmas.steps.ts

When('eu acesso a matriz de notas da turma', async function (this: TestWorld) {
  // Simula acesso à página de matriz - nada a fazer aqui
});

When('altero a meta {string} do aluno para {string}', async function (
  this: TestWorld,
  meta: string,
  conceito: string
) {
  if (!this.lastTurma) {
    throw new Error('Nenhuma turma disponível');
  }
  if (!this.lastAluno) {
    throw new Error('Nenhum aluno disponível');
  }
  
  await this.turmaService.avaliarAluno({
    turmaId: this.lastTurma.id,
    alunoId: this.lastAluno.id,
    meta,
    conceito: conceito as Conceito,
  });
});

Then('o sistema deve registrar a alteração no JSON da turma', async function (this: TestWorld) {
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
  
  const avaliacao = turma.avaliacoes.find((a) => a.alunoId === this.lastAluno!.id);
  assert.ok(avaliacao, 'Avaliação não encontrada na turma');
});

Then('deve adicionar uma entrada na fila de notificações diárias para o email do aluno', async function (
  this: TestWorld
) {
  if (!this.lastAluno) {
    throw new Error('Nenhum aluno disponível');
  }
  
  const notificacoes = await this.notificacaoRepository.findAll();
  const notificacaoDoAluno = notificacoes.find((n) => n.alunoId === this.lastAluno!.id);
  
  assert.ok(notificacaoDoAluno, 'Notificação não encontrada para o aluno');
  assert.strictEqual(notificacaoDoAluno.email, this.lastAluno.email);
});

// ============== Cenário: Atribuição de conceito MPA/MANA ==============

When('eu altero a meta {string} do aluno para {string}', async function (
  this: TestWorld,
  meta: string,
  conceito: string
) {
  if (!this.lastTurma) {
    throw new Error('Nenhuma turma disponível');
  }
  if (!this.lastAluno) {
    throw new Error('Nenhum aluno disponível');
  }
  
  await this.turmaService.avaliarAluno({
    turmaId: this.lastTurma.id,
    alunoId: this.lastAluno.id,
    meta,
    conceito: conceito as Conceito,
  });
});

Then('o conceito {string} deve ser registrado para a meta {string}', async function (
  this: TestWorld,
  conceitoEsperado: string,
  metaEsperada: string
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
  
  const avaliacao = turma.avaliacoes.find(
    (a) => a.alunoId === this.lastAluno!.id && a.meta === metaEsperada
  );
  
  assert.ok(avaliacao, `Avaliação para meta "${metaEsperada}" não encontrada`);
  assert.strictEqual(
    avaliacao.conceito,
    conceitoEsperado,
    `Esperado conceito "${conceitoEsperado}", mas encontrado "${avaliacao.conceito}"`
  );
});

// ============== Cenário: Atualização de conceito existente ==============

Given('que o aluno {string} tem conceito {string} na meta {string}', async function (
  this: TestWorld,
  nomeAluno: string,
  conceito: string,
  meta: string
) {
  // Criar turma
  this.lastTurma = await this.turmaService.createTurma({
    topico: 'Introdução a Programação',
    ano: 2026,
    semestre: 1,
  });

  // Criar aluno
  this.lastAluno = await this.alunoService.createAluno({
    nome: nomeAluno,
    cpf: '111.222.333-44',
    email: `${nomeAluno.toLowerCase().replace(/\s+/g, '.')}@email.com`,
  });

  // Matricular
  await this.turmaService.matricularAluno({
    turmaId: this.lastTurma.id,
    alunoId: this.lastAluno.id,
  });

  // Avaliar
  await this.turmaService.avaliarAluno({
    turmaId: this.lastTurma.id,
    alunoId: this.lastAluno.id,
    meta,
    conceito: conceito as Conceito,
  });

  // Limpar notificações geradas pela avaliação inicial
  this.notificacaoRepository.clear();
});

Then('o conceito deve ser atualizado de {string} para {string}', async function (
  this: TestWorld,
  _conceitoAntigo: string,
  conceitoNovo: string
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
  
  const avaliacao = turma.avaliacoes.find(
    (a) => a.alunoId === this.lastAluno!.id && a.meta === 'Requisitos'
  );
  
  assert.ok(avaliacao, 'Avaliação não encontrada');
  assert.strictEqual(avaliacao.conceito, conceitoNovo);
});

Then('a alteração deve ser registrada na fila de notificações', async function (this: TestWorld) {
  if (!this.lastAluno) {
    throw new Error('Nenhum aluno disponível');
  }
  const notificacoes = await this.notificacaoRepository.findAll();
  const notificacaoDoAluno = notificacoes.find((n) => n.alunoId === this.lastAluno!.id);
  
  assert.ok(notificacaoDoAluno, 'Notificação não encontrada para a alteração');
  assert.ok(notificacaoDoAluno.alteracoes.length > 0, 'Nenhuma alteração registrada na notificação');
});
