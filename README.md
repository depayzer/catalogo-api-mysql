# Catálogo de Produtos API

API REST para gerenciamento de produtos com autenticação JWT, desenvolvida com Node.js e MySQL local.

## Tecnologias utilizadas

- Node.js
- Express
- MySQL (local)
- JWT (jsonwebtoken)
- BCryptjs

## Como rodar o projeto

### Pré-requisitos
- Node.js instalado
- MySQL instalado e rodando localmente

### Passo a passo

```bash
# Clonar o repositório
git clone https://github.com/depayzer/catalogo-api.git

# Entrar na pasta
cd catalogo-api

# Instalar as dependências
npm install

# Copiar o arquivo de variáveis de ambiente
cp .env.example .env

# Preencher o .env com seus dados
# PORT=3000
# DB_HOST=localhost
# DB_PORT=3306
# DB_USER=root
# DB_PASSWORD=sua_senha_aqui
# DB_NAME=loja
# JWT_SECRET=sua_chave_secreta_aqui

# Rodar o projeto
npm run dev
```

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_NAME=loja
JWT_SECRET=sua_chave_secreta_aqui
```

## Endpoints

### Autenticação

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /api/auth/register | Cadastrar usuário |
| POST | /api/auth/login | Login (retorna token JWT) |

### Produtos (requer token Bearer)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /api/products | Criar produto |
| GET | /api/products | Listar todos os produtos |
| GET | /api/products/:id | Buscar produto por ID |
| PUT | /api/products/:id | Atualizar produto |
| DELETE | /api/products/:id | Deletar produto |

## Autenticação

Após fazer login, use o token retornado no header de todas as requisições de produtos:

```
Authorization: Bearer SEU_TOKEN_AQUI
```

## Segurança

- Senhas criptografadas com BCryptjs
- Autenticação via JWT
- Proteção contra NoSQL