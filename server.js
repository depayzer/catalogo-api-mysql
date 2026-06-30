// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

// Importa o Express para criar o servidor
const express = require('express');

// Importa o middleware de sanitização
const sanitize = require('./src/middlewares/sanitize');

// Importa o Swagger UI e a especificação gerada
const swaggerUi   = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');

const app = express();

// Middleware para interpretar JSON no corpo das requisições
app.use(express.json());

// Middleware de proteção contra injeção via chaves maliciosas
app.use(sanitize);

// ─── Documentação Swagger ─────────────────────────────────────────────────────
// Acessível em: http://localhost:3000/api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'Catálogo API – Docs',
  swaggerOptions: {
    persistAuthorization: true, // mantém o token JWT entre recarregamentos da página
  },
}));

// ─── Rotas Públicas ───────────────────────────────────────────────────────────

// GET /api/status e GET /api/versao — sem autenticação
app.use('/api', require('./src/routes/apiRoutes'));

// POST /api/auth/register e POST /api/auth/login — sem autenticação
app.use('/api/auth', require('./src/routes/authRoutes'));

// ─── Rotas Privadas (exigem JWT) ──────────────────────────────────────────────

// CRUD de categorias — /api/categorias
app.use('/api/categorias', require('./src/routes/categoriaRoutes'));

// CRUD de produtos — /api/produtos
app.use('/api/produtos', require('./src/routes/productRoutes'));

// CRUD de clientes — /api/clientes
app.use('/api/clientes', require('./src/routes/clientesRoutes'));

// CRUD de pedidos — /api/pedidos
app.use('/api/pedidos', require('./src/routes/pedidosRoutes'));

// ─── Inicialização ────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
