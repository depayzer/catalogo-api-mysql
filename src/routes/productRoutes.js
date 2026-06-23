const router  = require('express').Router();
const auth    = require('../middlewares/auth');
const { getAll, getOne, create, update, remove } = require('../controllers/productController');

/**
 * Rotas privadas do CRUD de produtos.
 * Todas exigem token JWT válido (middleware auth) + userId no payload (controller).
 */
router.use(auth);

router.get('/',     getAll);   // Listar todos os produtos
router.get('/:id',  getOne);   // Buscar produto por ID
router.post('/',    create);   // Criar produto
router.put('/:id',  update);   // Atualizar produto
router.delete('/:id', remove); // Deletar produto

module.exports = router;
