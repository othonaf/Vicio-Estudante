# Vicio-Estudante

## Descrição

Uma aplicação em Docker com Backend e Banco de Dados para gerenciamento de alunos, cursos e matrículas de alunos em cursos desenvolvida em Node.js, usando Nest.js e TypeORM no Backend e PostgreSQL, como parte do teste de admissão da Vício de Uma Estudante.


## Tecnologias Utilizadas
- **Node.js**: Stack principal da aplicação.
- **Nest.js**: Biblioteca para criação e gerenciamento de endpoints.
- **PostgreSQL**: Banco de dados utilizado para persistência.
- **TypeORM**: "_Object Relational Mapping_" para interagir com o banco de dados de forma mais simples.

## Arquitetura Utilizada
- **Arquitetura modular padrão do Nest.js**:  </br>
- Utilizei aqui o formato fornecido pelo próprio Nest.js como padrão, de acordo com os comandos de geração de cada módulo (Nest generate module | controller | service <nome>).

## Funcionalidades
A API permite realizar as seguintes operações:
- **Criar um Usuário**: Feito através da inserção de dados cadastrais.
- **Pesquisar um Usuário**: Através da inserção do ID.
- **Criação de um Curso**: Feito através da inserção dos dados: descrição, carga horária e
registra o horário de criação. 
- **Consulta Cursos criados**: Lista todos os cursos de uma vez.
- **Criação de Matrícula**: Matricula um usuário em um curso, registrando
a data e hora da operação.
- **Consulta de Matrículas**: Lista os cursos de um usuário, mostrando
as datas de matrícula ajustadas para o fuso horário do cliente.


## :warning: OBSERVAÇÃO IMPORTANTE PARA O AVALIADOR:

* Não criei a interface Frontend, já que não era obrigatório e o documento PDF informava que o foco da avaliação seria o Backend, e dado o tempo limitado, decidi focar em trabalhar no Backend para torná-lo o melhor possível.


## Instalação
Para rodar o projeto localmente, siga os passos abaixo:

1. Clone o repositório:
```bash
git clone https://github.com/othonaf/Vicio-Estudante.git
```

2. Instale as dependências:

```bash
cd student-course-manage
npm install
```
3. Nesta pasta crie um arquivo .env com SUAS CREDENCIAIS para as chaves abaixo:
   
DB_DATABASE = vicio-manager
DB_USERNAME = postgres
DB_PASSWORD = sua_senha
DB_HOST = localhost
DB_PORT = 5432

4. Inicie o compose docker:
   
```bash
docker-compose up --build
```
  
5. Certifique-se de que o servidor Docker foi iniciado, se não tiver sido, inicie-o manualmente.

A API Backend estará disponível em http://localhost:3000.

## Exemplos de Uso:
Aqui estão alguns exemplos de como interagir com os endpoints da API:</br>
 (Documentação da minha aplicação no Postman).

https://documenter.getpostman.com/view/19721533/2sAYQXpDfD

## Testes Automatizados:





