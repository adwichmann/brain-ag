# Brain Agriculture

## Introdução

Projeto criado baseado nos requisitos do teste técnico, utilizando NestJS como framework e Typescript:

- CRUD (Controllers, Decorators, Services, Modules)
- Validação de DTO com class-validator
- Variáveis de ambiente com ConfigService
- Banco de dados - Postgres
- Docker
- TypeORM
- Swagger

## Instalação

### Pré-requisitos

Esse projeto foi desenvolvido utilizando a seguinte versão do node:

[Node v18.12.0 LTS](https://nodejs.org/en/blog/release/v18.12.0)

E tambem é necessário o Docker instalado para rodar a base de dados

### Passos de Instalação

1. Clone o repositório: `git clone git@github.com:adwichmann/brain-ag.git`
2. Navegue até o diretório do projeto: `cd backend`
3. Instale as dependências: `npm install`

## Configuração

- Crie copie o arquivo .env.example e renomeie para .env, preenchendo todas a variáveis.
- Inicialize o container do banco de dados com:

```
  docker-compose up -d
```

- Inicializa a aplicação

```
  npm run start
```

- Aplicação iniciará na porta 3000 e poderar ser acessada através da url

```
  http://localhost:3000
```

## Documentação

A documentação foi gerada utilizando o Swagger e está disponivel no seguinte endereço:

```
 http://localhost:3000/api
```

## Uso

A proposta da Brain Agriculture é criar uma aplicação para gerenciar o cadastro de produtores rurais.
Para isso foram criados endpoints para cadastro, atualização, busca e exclusão de Produtor, Fazenda, Safra e Culturas plantadas.
