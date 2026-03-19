# language: pt
Funcionalidade: Geração de Provas Individuais
  Como um professor
  Eu quero gerar múltiplas versões de uma prova
  Para evitar cola entre alunos

  Cenário: Gerar 3 provas individuais
    Dado que existe uma prova cadastrada com 2 questões
    Quando eu gerar 3 provas individuais
    Então devem ser geradas 3 provas
    E cada prova deve ter questões embaralhadas
    E cada prova deve ter alternativas embaralhadas

  Cenário: Gerar gabarito com identificação por letras
    Dado que existem provas individuais geradas com tipo "LETTERS"
    Quando eu gerar o gabarito
    Então o gabarito deve conter letras como resposta

  Cenário: Gerar gabarito com identificação por potências
    Dado que existem provas individuais geradas com tipo "POWERS_OF_TWO"
    Quando eu gerar o gabarito
    Então o gabarito deve conter somas como resposta
