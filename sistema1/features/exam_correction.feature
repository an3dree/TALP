# language: pt
Funcionalidade: Correção de Provas
  Como um professor
  Eu quero corrigir provas automaticamente
  Para economizar tempo e ter precisão nas notas

  Cenário: Correção estrita - resposta totalmente correta
    Dado que existe um gabarito com resposta "AB" para questão 1
    E um aluno respondeu "AB" para questão 1
    Quando eu corrigir a prova com método "estrito"
    Então a nota da questão 1 deve ser 1.0

  Cenário: Correção estrita - resposta parcialmente correta
    Dado que existe um gabarito com resposta "AB" para questão 1
    E um aluno respondeu "A" para questão 1
    Quando eu corrigir a prova com método "estrito"
    Então a nota da questão 1 deve ser 0.0

  Cenário: Correção proporcional - resposta parcialmente correta
    Dado que existe um gabarito com resposta "AB" para questão 1
    E um aluno respondeu "A" para questão 1
    Quando eu corrigir a prova com método "proporcional"
    Então a nota da questão 1 deve ser maior que 0.0

  Cenário: Gerar relatório de notas
    Dado que existem 3 provas corrigidas
    Quando eu gerar o relatório de notas
    Então o relatório deve conter 3 linhas de alunos
    E cada linha deve ter nome, CPF e nota final
