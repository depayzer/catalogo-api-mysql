const pedidoModel = require('../models/pedidoModel');

function checkUserId(req, res) {
  if (!req.userId) {
    res.status(403).json({ message: 'ID de usuário não identificado no token' });
    return false;
  }
  return true;
}

exports.getAll = async (req, res) => {
  if (!checkUserId(req, res)) return;
  try {
    res.json(await pedidoModel.getAll());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  if (!checkUserId(req, res)) return;
  try {
    const pedido = await pedidoModel.getById(req.params.id);
    if (!pedido) return res.status(404).json({ message: 'Pedido não encontrado' });
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Cria um pedido.
 * Body: { clientes_id_cliente, data }
 * data: formato 'YYYY-MM-DD'
 */
exports.create = async (req, res) => {
  if (!checkUserId(req, res)) return;
  try {
    const { clientes_id_cliente, data } = req.body;

    if (!clientes_id_cliente || !data) {
      return res.status(400).json({ message: 'clientes_id_cliente e data são obrigatórios' });
    }

    const id = await pedidoModel.create(clientes_id_cliente, data);
    res.status(201).json({ message: 'Pedido criado com sucesso', id_pedido: id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Atualiza a data de um pedido.
 * Body: { data }
 */
exports.update = async (req, res) => {
  if (!checkUserId(req, res)) return;
  try {
    const { data } = req.body;
    if (!data) {
      return res.status(400).json({ message: 'data é obrigatória' });
    }
    const updated = await pedidoModel.update(req.params.id, data);
    if (!updated) return res.status(404).json({ message: 'Pedido não encontrado' });
    res.json({ message: 'Pedido atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.remove = async (req, res) => {
  if (!checkUserId(req, res)) return;
  try {
    const deleted = await pedidoModel.remove(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Pedido não encontrado' });
    res.json({ message: 'Pedido removido com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
