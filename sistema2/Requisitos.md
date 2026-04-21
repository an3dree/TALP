# Aqys Alunos - Requisitos

## Sistema de gerenciamento de alunos e avaliações

## O Sistema

Basicamente, o sistema a ser desenvolvido deve implementar as seguintes funcionalidades principais:

  1. Gerenciamento (inclusão, alteração e remoção) de alunos, com uma página específica com a lista de alunos cadastrados. Cada aluno deve ter o seu nome, CPF, e email.

  2. Numa outra página, o sistema deve permitir o gerenciamento das avaliações dos alunos, mostrando uma tabela com os nomes dos alunos na primeira coluna, e para cada aluno as suas avaliações em várias metas (Requisitos, Testes, etc.). Cada meta em uma coluna diferente. As avaliações são indicadas pelos conceitos MANA, MPA, ou MA, que respectivamente indicam Meta Ainda Não Atingida, Meta Parcialmente Atingida, e Meta Atingida.

  3. Persistência (via JSON) do cadastro de alunos e suas avaliações nas várias metas.

  4. Gerenciamento (inclusão, alteração e remoção) de turmas. Cada turma contém a descrição do seu tópico (por exemplo, Introdução a Programação), o ano, o semestre, os alunos matriculados na mesma, e as informações das avaliações desses alunos naquela turma. Deve ser possível visualizar cada turma com seus alunos e avaliações separadamente.

  5. Envio de email para um aluno quando o professor preencher ou alterar a avaliação do aluno para alguma meta. Para evitar que o aluno receba muitos emails (caso o professor digite várias avaliações num mesmo dia), enviar apenas um email por dia com todas as avaliações modificadas, nas várias turmas em que aquele aluno está matriculado.

O sistema deve ser uma aplicação web com cliente React em Typescript, e o servidor Node também em Typescript. Para cenários, use a linguagem Gherkin do Cucumber, que deve ser usado para implementar os testes de aceitação.
