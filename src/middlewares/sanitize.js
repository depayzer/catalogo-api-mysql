// Importa o mongo-sanitize para limpar os dados recebidos
const sanitize = require('mongo-sanitize');

/**
 * Middleware de sanitização das requisições.
 *
 * Remove caracteres maliciosos do body e dos params da requisição,
 * ajudando a proteger a API contra ataques de NoSQL Injection.
 *
 * @param {import('express').Request} req - Requisição HTTP contendo body e params a serem sanitizados.
 * @param {import('express').Response} res - Resposta HTTP da aplicação.
 * @param {import('express').NextFunction} next - Função chamada para passar ao próximo middleware ou controller.
 * @returns {void} Continua o fluxo da requisição após sanitizar os dados.
 */
module.exports = (req, res, next) => {
  // Sanitiza o corpo da requisição
  if (req.body) req.body = sanitize(req.body);

  // Sanitiza os parâmetros da URL
  if (req.params) req.params = sanitize(req.params);

  // Passa para o próximo middleware ou controller
  next();
};