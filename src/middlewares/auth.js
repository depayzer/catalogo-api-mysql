// Importa o jsonwebtoken para verificar o token JWT
const jwt = require('jsonwebtoken');

/**
 * Middleware de autenticação das rotas protegidas.
 *
 * Verifica se a requisição possui um token JWT válido no header Authorization.
 * Quando o token é válido, adiciona o ID do usuário em req.userId.
 *
 * @param {import('express').Request} req - Requisição HTTP contendo o header Authorization.
 * @param {import('express').Response} res - Resposta HTTP usada para retornar erros de autenticação.
 * @param {import('express').NextFunction} next - Função chamada para passar ao próximo middleware ou controller.
 * @returns {void} Continua o fluxo da requisição ou retorna erro 401.
 */
module.exports = (req, res, next) => {
  // Pega o header Authorization da requisição
  const authHeader = req.headers.authorization;

  // Verifica se o header existe e começa com "Bearer "
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  // Extrai o token removendo o prefixo "Bearer "
  const token = authHeader.split(' ')[1];

  try {
    // Verifica se o token é válido usando a chave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Salva o ID do usuário na requisição para usar nos controllers
    req.userId = decoded.id;

    // Passa para o próximo middleware ou controller
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido' });
  }
};