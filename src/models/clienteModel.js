const pool = require('../config/db');

/**
 * Model de Clientes — schema real do banco `loja`.
 *
 * Tabela: clientes (id_cliente, nome, telefone, status)
 * status: enum('bom','medio','ruim') DEFAULT 'medio'
 */

async function getAll() {
  const [rows] = await pool.execute(
    'SELECT * FROM clientes ORDER BY id_cliente'
  );
  return rows;
}

async function getById(id) {
  const [rows] = await pool.execute(
    'SELECT * FROM clientes WHERE id_cliente = ?',
    [id]
  );
  return rows[0] || null;
}

// Body: { nome, telefone, status }
async function create(nome, telefone, status = 'medio') {
  const [result] = await pool.execute(
    'INSERT INTO clientes (nome, telefone, status) VALUES (?, ?, ?)',
    [nome, telefone, status]
  );
  return result.insertId;
}

async function update(id, nome, telefone, status) {
  const [result] = await pool.execute(
    'UPDATE clientes SET nome = ?, telefone = ?, status = ? WHERE id_cliente = ?',
    [nome, telefone, status, id]
  );
  return result.affectedRows > 0;
}

async function remove(id) {
  const [result] = await pool.execute(
    'DELETE FROM clientes WHERE id_cliente = ?',
    [id]
  );
  return result.affectedRows > 0;
}

module.exports = { getAll, getById, create, update, remove };
