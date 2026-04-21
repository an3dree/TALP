import { Given, When, Then } from '@cucumber/cucumber';
import { TestWorld } from '../support/world';
import * as assert from 'assert';

// ============== Cenário: Cadastro de novo aluno com sucesso ==============

Given('que eu estou na página de {string}', async function (this: TestWorld, _pagina: string) {
  // Simula estado inicial - repositórios já limpos pelo Before hook
});

When('eu preencho o nome {string}, CPF {string} e email {string}', async function (
  this: TestWorld,
  nome: string,
  cpf: string,
  email: string
) {
  try {
    this.lastAluno = await this.alunoService.createAluno({ nome, cpf, email });
  } catch (error) {
    this.lastError = error as Error;
  }
});

When('clico em {string}', async function (this: TestWorld, _botao: string) {
  // Ação já realizada no passo anterior (criação/atualização)
});

Then('o aluno {string} deve aparecer na lista de alunos cadastrados', async function (
  this: TestWorld,
  nomeEsperado: string
) {
  const alunos = await this.alunoService.getAllAlunos();
  const alunoEncontrado = alunos.find((a) => a.nome === nomeEsperado);
  assert.ok(alunoEncontrado, `Aluno "${nomeEsperado}" não encontrado na lista`);
});

Then('os dados devem ser persistidos no arquivo {string}', async function (
  this: TestWorld,
  _arquivo: string
) {
  // Em testes de integração usamos InMemoryRepository
  // Verificamos que o aluno foi salvo no repositório
  if (!this.lastAluno) {
    throw new Error('Aluno não foi criado');
  }
  const alunoSalvo = await this.alunoRepository.findById(this.lastAluno.id);
  assert.ok(alunoSalvo, 'Aluno não foi persistido no repositório');
});

// ============== Cenário: Não permitir cadastro de aluno com CPF duplicado ==============

Given('que existe um aluno cadastrado com CPF {string}', async function (
  this: TestWorld,
  cpf: string
) {
  await this.alunoService.createAluno({
    nome: 'Aluno Existente',
    cpf,
    email: 'existente@email.com',
  });
});

When('eu tento cadastrar outro aluno com CPF {string}', async function (
  this: TestWorld,
  cpf: string
) {
  try {
    await this.alunoService.createAluno({
      nome: 'Novo Aluno',
      cpf,
      email: 'novo@email.com',
    });
  } catch (error) {
    this.lastError = error as Error;
  }
});

Then('o sistema deve retornar um erro {string}', async function (
  this: TestWorld,
  mensagemErro: string
) {
  assert.ok(this.lastError, 'Esperava um erro mas nenhum foi lançado');
  assert.ok(
    this.lastError.message.includes(mensagemErro),
    `Mensagem de erro esperada: "${mensagemErro}", recebida: "${this.lastError.message}"`
  );
});

// ============== Cenário: Atualização de dados do aluno ==============

Given('que existe um aluno {string} cadastrado', async function (
  this: TestWorld,
  nome: string
) {
  this.lastAluno = await this.alunoService.createAluno({
    nome,
    cpf: '111.222.333-44',
    email: 'original@email.com',
  });
});

When('eu altero o email do aluno para {string}', async function (
  this: TestWorld,
  novoEmail: string
) {
  if (!this.lastAluno) {
    throw new Error('Nenhum aluno disponível');
  }
  await this.alunoService.updateAluno({
    id: this.lastAluno.id,
    email: novoEmail,
  });
});

Then('o email do aluno deve ser {string}', async function (
  this: TestWorld,
  emailEsperado: string
) {
  if (!this.lastAluno) {
    throw new Error('Nenhum aluno para verificar');
  }
  const aluno = await this.alunoRepository.findById(this.lastAluno.id);
  if (!aluno) {
    throw new Error('Aluno não encontrado');
  }
  assert.strictEqual(aluno.email, emailEsperado);
});

// ============== Cenário: Remoção de aluno ==============

When('eu removo o aluno {string}', async function (this: TestWorld, nome: string) {
  const alunos = await this.alunoService.getAllAlunos();
  const aluno = alunos.find((a) => a.nome === nome);
  if (!aluno) {
    throw new Error(`Aluno "${nome}" não encontrado para remoção`);
  }
  await this.alunoService.deleteAluno(aluno.id);
});

Then('o aluno não deve mais aparecer na lista de alunos', async function (this: TestWorld) {
  const alunos = await this.alunoService.getAllAlunos();
  assert.strictEqual(alunos.length, 0, 'Lista de alunos deveria estar vazia');
});
