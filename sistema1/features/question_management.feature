# language: pt
Funcionalidade: Gerenciamento de Questões
  Como um professor
  Eu quero gerenciar questões de provas
  Para poder criar provas posteriormente

  Cenário: Criar uma questão válida
    Dado que eu tenho um enunciado "Qual é a capital do Brasil?"
    E eu tenho as seguintes alternativas:
      | descrição  | correta |
      | Brasília   | sim     |
      | São Paulo  | não     |
      | Rio        | não     |
    Quando eu criar a questão
    Então a questão deve ser criada com sucesso
    E a questão deve ter 3 alternativas

  Cenário: Falhar ao criar questão sem alternativas corretas
    Dado que eu tenho um enunciado "Teste"
    E eu tenho as seguintes alternativas:
      | descrição | correta |
      | A         | não     |
      | B         | não     |
    Quando eu tentar criar a questão
    Então deve retornar erro "A questão deve ter pelo menos uma alternativa correta"

  Cenário: Atualizar uma questão existente
    Dado que existe uma questão cadastrada
    Quando eu atualizar o enunciado para "Nova pergunta?"
    Então a questão deve ser atualizada com sucesso

  Cenário: Remover uma questão
    Dado que existe uma questão cadastrada
    Quando eu remover a questão
    Então a questão deve ser removida com sucesso

  Cenário: Listar todas as questões
    Dado que existem 3 questões cadastradas
    Quando eu listar todas as questões
    Então devo receber 3 questões
