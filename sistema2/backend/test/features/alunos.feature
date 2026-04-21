# language: pt

Funcionalidade: Gerenciamento de Alunos
  Como um professor
  Eu quero gerenciar os alunos do sistema
  Para manter o cadastro atualizado

  Cenário: Cadastro de novo aluno com sucesso
    Dado que eu estou na página de "Gerenciamento de Alunos"
    Quando eu preencho o nome "André Silva", CPF "123.456.789-00" e email "andre@ufpe.br"
    E clico em "Cadastrar"
    Então o aluno "André Silva" deve aparecer na lista de alunos cadastrados
    E os dados devem ser persistidos no arquivo "alunos.json"

  Cenário: Não permitir cadastro de aluno com CPF duplicado
    Dado que existe um aluno cadastrado com CPF "123.456.789-00"
    Quando eu tento cadastrar outro aluno com CPF "123.456.789-00"
    Então o sistema deve retornar um erro "CPF já cadastrado"

  Cenário: Atualização de dados do aluno
    Dado que existe um aluno "André Silva" cadastrado
    Quando eu altero o email do aluno para "andre.silva@cin.ufpe.br"
    E clico em "Atualizar"
    Então o email do aluno deve ser "andre.silva@cin.ufpe.br"

  Cenário: Remoção de aluno
    Dado que existe um aluno "André Silva" cadastrado
    Quando eu removo o aluno "André Silva"
    Então o aluno não deve mais aparecer na lista de alunos
