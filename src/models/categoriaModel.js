// Importa o pool de conexões com o banco MySQL
const pool = require('../config/db');

/**
 * Retorna todas as categorias cadastradas, ordenadas pelo ID.
 *
 * @async
 * @function getAll
 * @returns {Promise<Array<Object>>} Lista de categorias com id_categoria e nome.
 */
async function getAll() {
  const [rows] = await pool.execute(
    'SELECT * FROM categorias ORDER BY id_categoria'
  );
  return rows;
}

/**
 * Busca uma categoria específica pelo seu ID.
 *
 * Utiliza Prepared Statement (?) para prevenir ataques de SQL Injection.
 *
 * @async
 * @function getById
 * @param {number} id - ID da categoria (id_categoria).
 * @returns {Promise<Object|null>} Retorna o objeto da categoria ou null se não encontrada.
 */
async function getById(id) {
  const [rows] = await pool.execute(
    'SELECT * FROM categorias WHERE id_categoria = ?',
    [id]
  );
  return rows[0] || null;
}

/**
 * Insere uma nova categoria na tabela `categorias`.
 *
 * Utiliza Prepared Statement (?) para prevenir ataques de SQL Injection.
 *
 * @async
 * @function create
 * @param {string} nome - Nome da categoria a ser criada.
 * @returns {Promise<number>} Retorna o ID da categoria recém-inserida.
 */
async function create(nome) {
  const [result] = await pool.execute(
    'INSERT INTO categorias (nome) VALUES (?)',
    [nome]
  );
  return result.insertId;
}

/**
 * Atualiza o nome de uma categoria existente.
 *
 * Utiliza Prepared Statement (?) para prevenir ataques de SQL Injection.
 *
 * @async
 * @function update
 * @param {number} id   - ID da categoria a ser atualizada.
 * @param {string} nome - Novo nome da categoria.
 * @returns {Promise<boolean>} Retorna true se a linha foi alterada, false se o ID não existia.
 */
async function update(id, nome) {
  const [result] = await pool.execute(
    'UPDATE categorias SET nome = ? WHERE id_categoria = ?',
    [nome, id]
  );
  return result.affectedRows > 0;
}

/**
 * Remove uma categoria pelo ID.
 *
 * Utiliza Prepared Statement (?) para prevenir ataques de SQL Injection.
 *
 * @async
 * @function remove
 * @param {number} id - ID da categoria a ser removida.
 * @returns {Promise<boolean>} Retorna true se a linha foi deletada, false se o ID não existia.
 */
async function remove(id) {
  const [result] = await pool.execute(
    'DELETE FROM categorias WHERE id_categoria = ?',
    [id]
  );
  return result.affectedRows > 0;
}

// Exporta as funções para uso no controller
module.exports = { getAll, getById, create, update, remove };
