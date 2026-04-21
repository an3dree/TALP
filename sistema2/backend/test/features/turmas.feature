# language: pt

Funcionalidade: Gerenciamento de Turmas
  Como um professor
  Eu quero gerenciar as turmas do sistema
  Para organizar os alunos por disciplina e período

  Cenário: Criação de nova turma
    Dado que eu estou na página de "Gerenciamento de Turmas"
    Quando eu preencho o tópico "Introdução a Programação", ano "2026" e semestre "1"
    E clico em "Cadastrar"
    Então a turma "Introdução a Programação 2026.1" deve aparecer na lista

  Cenário: Matrícula de aluno em turma
    Dado que existe uma turma "Introdução a Programação 2026.1"
    E que existe um aluno "André Silva" cadastrado
    Quando eu matriculo o aluno "André Silva" na turma
    Então o aluno deve aparecer na lista de alunos matriculados da turma

  Cenário: Desmatrícula de aluno da turma
    Dado que o aluno "André Silva" está matriculado na turma "Introdução a Programação 2026.1"
    Quando eu desmatriculo o aluno da turma
    Então o aluno não deve mais aparecer na lista de alunos matriculados

  Cenário: Remoção de turma
    Dado que existe uma turma "Introdução a Programação 2026.1"
    Quando eu removo a turma
    Então a turma não deve mais aparecer na lista de turmas
