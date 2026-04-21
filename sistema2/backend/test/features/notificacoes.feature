# language: pt

Funcionalidade: Notificação Diária por Email
  Como um aluno
  Eu quero receber um email diário com minhas avaliações atualizadas
  Para acompanhar meu progresso sem receber muitos emails

  Cenário: Evitar múltiplos emails no mesmo dia
    Dado que o professor alterou 3 notas do aluno "André" em 2 turmas diferentes hoje
    Quando o processo de envio de email diário for executado
    Então o aluno deve receber apenas 1 email contendo o resumo das 3 alterações

  Cenário: Agrupamento de alterações por turma no email
    Dado que o aluno "André" teve avaliações alteradas em "Requisitos" e "Testes" na turma "IP"
    E também teve avaliação alterada em "Documentação" na turma "BD"
    Quando o email diário for enviado
    Então o email deve conter as alterações agrupadas por turma

  Cenário: Limpeza da fila após envio bem sucedido
    Dado que existem notificações pendentes para o dia de hoje
    Quando o processo de envio de email diário for executado com sucesso
    Então as notificações do dia devem ser removidas da fila

  Cenário: Não enviar email se não houver alterações
    Dado que não existem notificações pendentes para o dia de hoje
    Quando o processo de envio de email diário for executado
    Então nenhum email deve ser enviado
