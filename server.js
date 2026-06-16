// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

// Importa o Express para criar o servidor
const express = require('express');

// Importa o middleware de sanitização contra NoSQL Injection
const sanitize = require('./src/middlewares/sanitize');

const app = express();

// Middleware para interpretar JSON no corpo das requisições
app.use(express.json());

// Middleware de proteção contra NoSQL Injection
app.use(sanitize);

// Rota pública de metadados — GET /api/status e GET /api/versao (sem autenticação)
app.use('/api', require('./src/routes/apiRoutes'));

// Rotas de autenticação
app.use('/api/auth', require('./src/routes/authRoutes'));

// Rotas privadas de categorias — CRUD completo protegido por JWT
app.use('/api/categorias', require('./src/routes/categoriaRoutes'));

// Rotas de produtos (protegidas por JWT)
app.use('/api/products', require('./src/routes/productRoutes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
