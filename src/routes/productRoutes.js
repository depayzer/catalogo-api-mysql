// Importa o Router do Express
const router = require('express').Router();

// Importa o middleware de autenticação
const auth = require('../middlewares/auth');

// Importa os controllers de produto
const {
  create, getAll, getOne, update, remove
} = require('../controllers/productController');

/**
 * Rotas de produtos da API.
 *
 * Todas as rotas abaixo são protegidas pelo middleware de autenticação JWT
 * e permitem criar, listar, buscar, atualizar e remover produtos.
 *
 * @type {import('express').Router}
 */

// Aplica o middleware de autenticação em todas as rotas abaixo
// Ou seja, todas exigem token JWT válido
router.use(auth);

router.post('/', create);        // Criar produto
router.get('/', getAll);         // Listar todos
router.get('/:id', getOne);      // Buscar um
router.put('/:id', update);      // Atualizar
router.delete('/:id', remove);   // Deletar

module.exports = router;