// Importa o Router do Express para criar as rotas
const router = require('express').Router();

// Importa os controllers de autenticação
const { register, login } = require('../controllers/authController');

/**
 * Rotas de autenticação da API.
 *
 * Define os endpoints responsáveis pelo cadastro e login de usuários.
 *
 * @type {import('express').Router}
 */

// Rota para cadastro de novo usuário
router.post('/register', register);

// Rota para login do usuário
router.post('/login', login);

module.exports = router;