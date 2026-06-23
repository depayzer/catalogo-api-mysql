const pool = require('../config/db');

/**
 * Model de Pedidos — schema real do banco `loja`.
 *
 * Tabela: pedidos (id_pedido, data, clientes_id_cliente)
 * Tabela: produtos_pedidos (produtos_id_produto, pedidos_id_pedido, quantidade, valor)
 */

async function getAll() {
  const [rows] = await pool.execute(`
    SELECT p.id_pedido, p.data,
           c.id_cliente, c.nome AS cliente
    FROM pedidos p
    LEFT JOIN clientes c ON p.clientes_id_cliente = c.id_cliente
    ORDER BY p.id_pedido
  `);
  return rows;
}

async function getById(id) {
  const [pedido] = await pool.execute(`
    SELECT p.id_pedido, p.data,
           c.id_cliente, c.nome AS cliente
    FROM pedidos p
    LEFT JOIN clientes c ON p.clientes_id_cliente = c.id_cliente
    WHERE p.id_pedido = ?
  `, [id]);

  if (!pedido[0]) return null;

  const [itens] = await pool.execute(`
    SELECT pp.quantidade, pp.valor,
           pr.id_produto, pr.nome AS produto
    FROM produtos_pedidos pp
    LEFT JOIN produtos pr ON pp.produtos_id_produto = pr.id_produto
    WHERE pp.pedidos_id_pedido = ?
  `, [id]);

  return { ...pedido[0], itens };
}

// Body: { clientes_id_cliente, data }  (data formato 'YYYY-MM-DD')
async function create(clientes_id_cliente, data) {
  const [result] = await pool.execute(
    'INSERT INTO pedidos (data, clientes_id_cliente) VALUES (?, ?)',
    [data, clientes_id_cliente]
  );
  return result.insertId;
}

// Pedidos no banco real só têm data e cliente — atualiza a data
async function update(id, data) {
  const [result] = await pool.execute(
    'UPDATE pedidos SET data = ? WHERE id_pedido = ?',
    [data, id]
  );
  return result.affectedRows > 0;
}

async function remove(id) {
  const [result] = await pool.execute(
    'DELETE FROM pedidos WHERE id_pedido = ?',
    [id]
  );
  return result.affectedRows > 0;
}

module.exports = { getAll, getById, create, update, remove };
