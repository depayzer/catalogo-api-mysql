const router  = require('express').Router();
const auth    = require('../middlewares/auth');
const { getAll, getById, create, update, remove } = require('../controllers/pedidoController');

/**
 * Rotas privadas do CRUD de pedidos.
 * Todas exigem token JWT válido (middleware auth) + userId no payload (controller).
 */
router.use(auth);

router.get('/',      getAll);   // Listar todos os pedidos
router.get('/:id',   getById);  // Buscar pedido por ID (com itens)
router.post('/',     create);   // Criar pedido
router.put('/:id',   update);   // Atualizar status do pedido
router.delete('/:id', remove);  // Deletar pedido

module.exports = router;
