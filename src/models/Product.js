const pool = require('../config/db');

/**
 * Model de Produtos — refatorado para o schema real do banco `loja`.
 *
 * Tabela: produtos (id_produto, nome, valor, estoque, categorias_id_categoria)
 * FK: categorias_id_categoria → categorias(id_categoria)
 */

async function getAll() {
  const [rows] = await pool.execute(`
    SELECT p.id_produto, p.nome, p.valor, p.estoque,
           c.id_categoria, c.nome AS categoria
    FROM produtos p
    LEFT JOIN categorias c ON p.categorias_id_categoria = c.id_categoria
    ORDER BY p.id_produto
  `);
  return rows;
}

async function getById(id) {
  const [rows] = await pool.execute(`
    SELECT p.id_produto, p.nome, p.valor, p.estoque,
           c.id_categoria, c.nome AS categoria
    FROM produtos p
    LEFT JOIN categorias c ON p.categorias_id_categoria = c.id_categoria
    WHERE p.id_produto = ?
  `, [id]);
  return rows[0] || null;
}

// Body: { nome, valor, estoque, categorias_id_categoria }
async function create(nome, valor, estoque, categorias_id_categoria) {
  const [result] = await pool.execute(
    'INSERT INTO produtos (nome, valor, estoque, categorias_id_categoria) VALUES (?, ?, ?, ?)',
    [nome, valor, estoque, categorias_id_categoria]
  );
  return result.insertId;
}

async function update(id, nome, valor, estoque, categorias_id_categoria) {
  const [result] = await pool.execute(
    'UPDATE produtos SET nome = ?, valor = ?, estoque = ?, categorias_id_categoria = ? WHERE id_produto = ?',
    [nome, valor, estoque, categorias_id_categoria, id]
  );
  return result.affectedRows > 0;
}

async function remove(id) {
  const [result] = await pool.execute(
    'DELETE FROM produtos WHERE id_produto = ?',
    [id]
  );
  return result.affectedRows > 0;
}

module.exports = { getAll, getById, create, update, remove };
