/**
 * Middleware de sanitização básica das requisições.
 *
 * Remove campos cujo nome começa com "$" ou contém "." do body e params,
 * protegendo a API contra tentativas de injeção via nomes de chave maliciosos.
 * Como a API agora usa MySQL com Prepared Statements, o principal vetor de
 * SQL Injection já é bloqueado pelo driver; este middleware adiciona uma
 * camada extra de defesa nos dados recebidos.
 *
 * @param {import('express').Request}  req  - Requisição HTTP.
 * @param {import('express').Response} res  - Resposta HTTP.
 * @param {import('express').NextFunction} next - Próximo middleware.
 */
function deepSanitize(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;
  for (const key of Object.keys(obj)) {
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key];
    } else {
      obj[key] = deepSanitize(obj[key]);
    }
  }
  return obj;
}

module.exports = (req, res, next) => {
  if (req.body)   req.body   = deepSanitize(req.body);
  if (req.params) req.params = deepSanitize(req.params);
  next();
};
