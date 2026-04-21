# TEST_SKILLS.md - Cenários de Aceitação (Gherkin)

Sempre que implementar um requisito, valide contra estes cenários ou crie novos baseados nestes modelos:

## Requisito: Gerenciamento de Alunos
```gherkin
Cenário: Cadastro de novo aluno com sucesso
  Dado que eu estou na página de "Gerenciamento de Alunos"
  Quando eu preencho o nome "André Silva", CPF "123.456.789-00" e email "andre@ufpe.br"
  E clico em "Cadastrar"
  Então o aluno "André Silva" deve aparecer na lista de alunos cadastrados
  E os dados devem ser persistidos no arquivo "alunos.json"```

## Requisito: Avaliação por Metas
```gherkin
Cenário: Atribuição de conceito MA em Requisitos
  Dado que o aluno "André Silva" está matriculado na turma "Introdução a Programação 2026.1"
  Quando eu acesso a matriz de notas da turma
  E altero a meta "Requisitos" do aluno para "MA"
  Então o sistema deve registrar a alteração no JSON da turma
  E deve adicionar uma entrada na fila de notificações diárias para o email "alssg@cin.ufpe.br"```

## Requisito: Notificação Diária (Agrupamento)
```gherkin
Cenário: Evitar múltiplos emails no mesmo dia
  Dado que o professor alterou 3 notas do aluno "André" em 2 turmas diferentes hoje
  Quando o processo de envio de email diário for executado
  Então o aluno deve receber apenas 1 email contendo o resumo das 3 alterações```

---

