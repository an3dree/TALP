# language: pt

Funcionalidade: Avaliação por Metas
  Como um professor
  Eu quero avaliar os alunos por metas
  Para acompanhar o progresso de cada um

  Cenário: Atribuição de conceito MA em Requisitos
    Dado que o aluno "André Silva" está matriculado na turma "Introdução a Programação 2026.1"
    Quando eu acesso a matriz de notas da turma
    E altero a meta "Requisitos" do aluno para "MA"
    Então o sistema deve registrar a alteração no JSON da turma
    E deve adicionar uma entrada na fila de notificações diárias para o email do aluno

  Cenário: Atribuição de conceito MPA em Testes
    Dado que o aluno "André Silva" está matriculado na turma "Introdução a Programação 2026.1"
    Quando eu altero a meta "Testes" do aluno para "MPA"
    Então o conceito "MPA" deve ser registrado para a meta "Testes"

  Cenário: Atribuição de conceito MANA
    Dado que o aluno "André Silva" está matriculado na turma "Introdução a Programação 2026.1"
    Quando eu altero a meta "Implementação" do aluno para "MANA"
    Então o conceito "MANA" deve ser registrado para a meta "Implementação"

  Cenário: Atualização de conceito existente
    Dado que o aluno "André Silva" tem conceito "MPA" na meta "Requisitos"
    Quando eu altero a meta "Requisitos" do aluno para "MA"
    Então o conceito deve ser atualizado de "MPA" para "MA"
    E a alteração deve ser registrada na fila de notificações
