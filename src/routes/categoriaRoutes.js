// Importa o Router do Express para criar as rotas
const router = require('express').Router();

// Importa o middleware de autenticação JWT
const auth = require('../middlewares/auth');

// Importa o controller de categorias
const { getAll, getById, create, update, remove } = require('../controllers/categoriaController');

/**
 * Rotas privadas do CRUD de categorias.
 *
 * Aplica o middleware de autenticação em todos os endpoints deste roteador.
 *
 * SEGURANÇA: Todos os endpoints abaixo exigem:
 *   1. Token JWT válido no header Authorization: Bearer <token>.
 *   2. ID do usuário presente e válido no payload do token (req.userId).
 *
 * Sem token → 401 Unauthorized (middleware auth).
 * Com token, mas sem userId no payload → 403 Forbidden (controller).
 *
 * @type {import('express').Router}
 */
router.use(auth);

// GET /api/categorias — lista todas as categorias
router.get('/', getAll);

// GET /api/categorias/:id — busca uma categoria pelo ID
router.get('/:id', getById);

// POST /api/categorias — cria uma nova categoria
router.post('/', create);

// PUT /api/categorias/:id — atualiza o nome de uma categoria
router.put('/:id', update);

// DELETE /api/categorias/:id — remove uma categoria
router.delete('/:id', remove);

// Exporta o roteador para ser registrado no server.js
module.exports = router;
