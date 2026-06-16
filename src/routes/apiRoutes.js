// Importa o Router do Express para criar as rotas
const router = require('express').Router();

/**
 * Rota pública de metadados da API.
 *
 * Não exige autenticação — serve para monitoramento e verificação de status.
 * Retorna a versão atual da API e seu estado de operação.
 *
 * @name GET /api/status
 * @name GET /api/versao
 * @returns {{ versao: string, status: string }} JSON com versão e status da API.
 */
router.get('/status', (req, res) => {
  res.json({ versao: '2.0.0', status: 'online' });
});

router.get('/versao', (req, res) => {
  res.json({ versao: '2.0.0', status: 'online' });
});

// Exporta o roteador para ser registrado no server.js
module.exports = router;
