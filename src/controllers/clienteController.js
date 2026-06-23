const clienteModel = require('../models/clienteModel');

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
    res.json(await clienteModel.getAll());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  if (!checkUserId(req, res)) return;
  try {
    const cliente = await clienteModel.getById(req.params.id);
    if (!cliente) return res.status(404).json({ message: 'Cliente não encontrado' });
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Cria um cliente.
 * Body: { nome, telefone, status }
 * status: 'bom' | 'medio' | 'ruim'  (opcional, default 'medio')
 */
exports.create = async (req, res) => {
  if (!checkUserId(req, res)) return;
  try {
    const { nome, telefone, status } = req.body;

    if (!nome || !telefone) {
      return res.status(400).json({ message: 'nome e telefone são obrigatórios' });
    }

    const statusValidos = ['bom', 'medio', 'ruim'];
    if (status && !statusValidos.includes(status)) {
      return res.status(400).json({ message: 'status deve ser: bom, medio ou ruim' });
    }

    const id = await clienteModel.create(nome, telefone, status || 'medio');
    res.status(201).json({ message: 'Cliente criado com sucesso', id_cliente: id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Atualiza um cliente.
 * Body: { nome, telefone, status }
 */
exports.update = async (req, res) => {
  if (!checkUserId(req, res)) return;
  try {
    const { nome, telefone, status } = req.body;

    if (!nome || !telefone) {
      return res.status(400).json({ message: 'nome e telefone são obrigatórios' });
    }

    const statusValidos = ['bom', 'medio', 'ruim'];
    if (status && !statusValidos.includes(status)) {
      return res.status(400).json({ message: 'status deve ser: bom, medio ou ruim' });
    }

    const updated = await clienteModel.update(req.params.id, nome, telefone, status || 'medio');
    if (!updated) return res.status(404).json({ message: 'Cliente não encontrado' });
    res.json({ message: 'Cliente atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.remove = async (req, res) => {
  if (!checkUserId(req, res)) return;
  try {
    const deleted = await clienteModel.remove(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Cliente não encontrado' });
    res.json({ message: 'Cliente removido com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
