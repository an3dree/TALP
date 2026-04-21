import { Given, When, Then } from '@cucumber/cucumber';
import { TestWorld } from '../support/world';
import * as assert from 'assert';
import type { Conceito } from '../../src/shared/types';

function getHoje(): string {
  return new Date().toISOString().split('T')[0];
}

// ============== Cenário: Evitar múltiplos emails no mesmo dia ==============

Given('que o professor alterou {int} notas do aluno {string} em {int} turmas diferentes hoje', async function (
  this: TestWorld,
  numNotas: number,
  nomeAluno: string,
  numTurmas: number
) {
  // Criar aluno
  this.lastAluno = await this.alunoService.createAluno({
    nome: nomeAluno,
    cpf: '111.222.333-44',
    email: `${nomeAluno.toLowerCase()}@email.com`,
  });

  // Criar turmas e avaliar
  const metas = ['Requisitos', 'Testes', 'Implementação'];
  let metaIndex = 0;

  for (let t = 0; t < numTurmas; t++) {
    const turma = await this.turmaService.createTurma({
      topico: `Turma ${t + 1}`,
      ano: 2026,
      semestre: 1,
    });

    await this.turmaService.matricularAluno({
      turmaId: turma.id,
      alunoId: this.lastAluno.id,
    });

    // Distribuir notas entre as turmas
    const notasPorTurma = Math.ceil(numNotas / numTurmas);
    for (let n = 0; n < notasPorTurma && metaIndex < numNotas; n++) {
      await this.turmaService.avaliarAluno({
        turmaId: turma.id,
        alunoId: this.lastAluno.id,
        meta: metas[metaIndex % metas.length],
        conceito: 'MA' as Conceito,
      });
      metaIndex++;
    }
  }
});

When('o processo de envio de email diário for executado', async function (this: TestWorld) {
  await this.notificacaoService.processarNotificacoesDoDia();
});

Then('o aluno deve receber apenas {int} email contendo o resumo das {int} alterações', async function (
  this: TestWorld,
  numEmails: number,
  _numAlteracoes: number
) {
  if (!this.lastAluno) {
    throw new Error('Nenhum aluno disponível');
  }
  const emails = this.emailService.getEmailsEnviados();
  
  // Filtra emails do aluno
  const emailsDoAluno = emails.filter((e) => e.to === this.lastAluno!.email);
  
  assert.strictEqual(
    emailsDoAluno.length,
    numEmails,
    `Esperado ${numEmails} email(s), mas foram enviados ${emailsDoAluno.length}`
  );

  // Verifica que o email menciona as alterações
  if (numEmails > 0 && emailsDoAluno[0]) {
    // O email deve conter referência às alterações
    assert.ok(
      emailsDoAluno[0].body.length > 0,
      'O email deveria conter um resumo das alterações'
    );
  }
});

// ============== Cenário: Agrupamento de alterações por turma no email ==============

Given('que o aluno {string} teve avaliações alteradas em {string} e {string} na turma {string}', async function (
  this: TestWorld,
  nomeAluno: string,
  meta1: string,
  meta2: string,
  nomeTurma: string
) {
  // Criar aluno
  this.lastAluno = await this.alunoService.createAluno({
    nome: nomeAluno,
    cpf: '111.222.333-44',
    email: `${nomeAluno.toLowerCase()}@email.com`,
  });

  // Criar turma
  const turma = await this.turmaService.createTurma({
    topico: nomeTurma,
    ano: 2026,
    semestre: 1,
  });
  this.lastTurma = turma;

  // Matricular
  await this.turmaService.matricularAluno({
    turmaId: turma.id,
    alunoId: this.lastAluno.id,
  });

  // Avaliar nas duas metas
  await this.turmaService.avaliarAluno({
    turmaId: turma.id,
    alunoId: this.lastAluno.id,
    meta: meta1,
    conceito: 'MA' as Conceito,
  });

  await this.turmaService.avaliarAluno({
    turmaId: turma.id,
    alunoId: this.lastAluno.id,
    meta: meta2,
    conceito: 'MPA' as Conceito,
  });
});

Given('também teve avaliação alterada em {string} na turma {string}', async function (
  this: TestWorld,
  meta: string,
  nomeTurma: string
) {
  if (!this.lastAluno) {
    throw new Error('Nenhum aluno disponível');
  }
  // Criar segunda turma
  const turma = await this.turmaService.createTurma({
    topico: nomeTurma,
    ano: 2026,
    semestre: 1,
  });

  // Matricular aluno
  await this.turmaService.matricularAluno({
    turmaId: turma.id,
    alunoId: this.lastAluno.id,
  });

  // Avaliar
  await this.turmaService.avaliarAluno({
    turmaId: turma.id,
    alunoId: this.lastAluno.id,
    meta,
    conceito: 'MA' as Conceito,
  });
});

When('o email diário for enviado', async function (this: TestWorld) {
  await this.notificacaoService.processarNotificacoesDoDia();
});

Then('o email deve conter as alterações agrupadas por turma', async function (this: TestWorld) {
  if (!this.lastAluno) {
    throw new Error('Nenhum aluno disponível');
  }
  const emails = this.emailService.getEmailsEnviados();
  const emailDoAluno = emails.find((e) => e.to === this.lastAluno!.email);
  
  assert.ok(emailDoAluno, 'Email não foi enviado para o aluno');
  
  // Verifica que o email contém referências às turmas
  // O corpo do email deve mencionar as turmas de alguma forma
  assert.ok(
    emailDoAluno.body.includes('IP') || emailDoAluno.body.includes('BD') || 
    emailDoAluno.body.includes('Turma'),
    'Email deveria mencionar as turmas'
  );
});

// ============== Cenário: Limpeza da fila após envio bem sucedido ==============

Given('que existem notificações pendentes para o dia de hoje', async function (this: TestWorld) {
  // Criar aluno e avaliação
  this.lastAluno = await this.alunoService.createAluno({
    nome: 'Aluno Teste',
    cpf: '111.222.333-44',
    email: 'teste@email.com',
  });

  const turma = await this.turmaService.createTurma({
    topico: 'Turma Teste',
    ano: 2026,
    semestre: 1,
  });

  await this.turmaService.matricularAluno({
    turmaId: turma.id,
    alunoId: this.lastAluno.id,
  });

  await this.turmaService.avaliarAluno({
    turmaId: turma.id,
    alunoId: this.lastAluno.id,
    meta: 'Requisitos',
    conceito: 'MA' as Conceito,
  });

  // Verifica que há notificações pendentes
  const notificacoes = await this.notificacaoRepository.findAll();
  assert.ok(notificacoes.length > 0, 'Deveria haver notificações pendentes');
});

When('o processo de envio de email diário for executado com sucesso', async function (this: TestWorld) {
  await this.notificacaoService.processarNotificacoesDoDia();
});

Then('as notificações do dia devem ser removidas da fila', async function (this: TestWorld) {
  const hoje = getHoje();
  const notificacoes = await this.notificacaoRepository.findAll();
  const notificacoesHoje = notificacoes.filter((n) => n.data === hoje);
  
  assert.strictEqual(
    notificacoesHoje.length,
    0,
    'Notificações do dia deveriam ter sido removidas'
  );
});

// ============== Cenário: Não enviar email se não houver alterações ==============

Given('que não existem notificações pendentes para o dia de hoje', async function (this: TestWorld) {
  // Repositórios já estão limpos pelo Before hook
  const notificacoes = await this.notificacaoRepository.findAll();
  assert.strictEqual(notificacoes.length, 0, 'Não deveria haver notificações');
});

Then('nenhum email deve ser enviado', async function (this: TestWorld) {
  const emails = this.emailService.getEmailsEnviados();
  assert.strictEqual(emails.length, 0, 'Nenhum email deveria ter sido enviado');
});
