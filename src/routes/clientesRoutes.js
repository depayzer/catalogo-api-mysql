const router  = require('express').Router();
const auth    = require('../middlewares/auth');
const { getAll, getById, create, update, remove } = require('../controllers/clienteController');

/**
 * Rotas privadas do CRUD de clientes.
 * Todas exigem token JWT válido (middleware auth) + userId no payload (controller).
 */
router.use(auth);

router.get('/',      getAll);   // Listar todos os clientes
router.get('/:id',   getById);  // Buscar cliente por ID
router.post('/',     create);   // Criar cliente
router.put('/:id',   update);   // Atualizar cliente
router.delete('/:id', remove);  // Deletar cliente

module.exports = router;
