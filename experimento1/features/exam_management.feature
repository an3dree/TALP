# language: pt
Funcionalidade: Gerenciamento de Provas
  Como um professor
  Eu quero gerenciar provas
  Para poder aplicá-las aos alunos

  Cenário: Criar uma prova com identificação por letras
    Dado que existem questões cadastradas
    Quando eu criar uma prova "Prova 1" com identificação por "letras"
    E adicionar 2 questões à prova
    Então a prova deve ser criada com sucesso
    E o tipo de alternativa deve ser "LETTERS"

  Cenário: Criar uma prova com identificação por potências de 2
    Dado que existem questões cadastradas
    Quando eu criar uma prova "Prova 2" com identificação por "potências"
    E adicionar 2 questões à prova
    Então a prova deve ser criada com sucesso
    E o tipo de alternativa deve ser "POWERS_OF_TWO"

  Cenário: Atualizar uma prova existente
    Dado que existe uma prova cadastrada
    Quando eu atualizar o nome para "Prova Atualizada"
    Então a prova deve ser atualizada com sucesso

  Cenário: Remover uma prova
    Dado que existe uma prova cadastrada
    Quando eu remover a prova
    Então a prova deve ser removida com sucesso
