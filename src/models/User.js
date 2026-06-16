// Importa o pool de conexões com o banco MySQL
const pool = require('../config/db');

/**
 * Busca um usuário pelo endereço de e-mail.
 *
 * Utiliza Prepared Statement (?) para prevenir ataques de SQL Injection.
 *
 * @async
 * @function findByEmail
 * @param {string} email - E-mail do usuário a ser buscado.
 * @returns {Promise<Object|null>} Retorna o objeto do usuário encontrado ou null se não existir.
 */
async function findByEmail(email) {
  const [rows] = await pool.execute(
    'SELECT * FROM usuarios WHERE email = ?',
    [email]
  );
  return rows[0] || null;
}

/**
 * Busca um usuário pelo ID, retornando apenas os campos não sensíveis.
 *
 * Utiliza Prepared Statement (?) para prevenir ataques de SQL Injection.
 *
 * @async
 * @function findById
 * @param {number} id - ID do usuário a ser buscado.
 * @returns {Promise<Object|null>} Retorna o objeto do usuário (sem senha) ou null se não existir.
 */
async function findById(id) {
  const [rows] = await pool.execute(
    'SELECT id, nome, email FROM usuarios WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

/**
 * Insere um novo usuário na tabela `usuarios`.
 *
 * A senha recebida já deve estar criptografada com bcrypt antes de ser passada.
 * Utiliza Prepared Statement (?) para prevenir ataques de SQL Injection.
 *
 * @async
 * @function create
 * @param {string} nome      - Nome completo do usuário.
 * @param {string} email     - E-mail único do usuário.
 * @param {string} senhaHash - Senha já criptografada com bcrypt.
 * @returns {Promise<number>} Retorna o ID do usuário recém-inserido.
 */
async function create(nome, email, senhaHash) {
  const [result] = await pool.execute(
    'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
    [nome, email, senhaHash]
  );
  return result.insertId;
}

// Exporta as funções para uso nos controllers
module.exports = { findByEmail, findById, create };
