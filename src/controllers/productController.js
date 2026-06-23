const Product = require('../models/Product');

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
    res.json(await Product.getAll());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOne = async (req, res) => {
  if (!checkUserId(req, res)) return;
  try {
    const produto = await Product.getById(req.params.id);
    if (!produto) return res.status(404).json({ message: 'Produto não encontrado' });
    res.json(produto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Cria um produto.
 * Body: { nome, valor, estoque, categorias_id_categoria }
 */
exports.create = async (req, res) => {
  if (!checkUserId(req, res)) return;
  try {
    const { nome, valor, estoque, categorias_id_categoria } = req.body;

    if (!nome || valor === undefined || estoque === undefined || !categorias_id_categoria) {
      return res.status(400).json({
        message: 'nome, valor, estoque e categorias_id_categoria são obrigatórios'
      });
    }

    const id = await Product.create(nome, valor, estoque, categorias_id_categoria);
    res.status(201).json({ message: 'Produto criado com sucesso', id_produto: id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Atualiza um produto.
 * Body: { nome, valor, estoque, categorias_id_categoria }
 */
exports.update = async (req, res) => {
  if (!checkUserId(req, res)) return;
  try {
    const { nome, valor, estoque, categorias_id_categoria } = req.body;

    if (!nome || valor === undefined || estoque === undefined || !categorias_id_categoria) {
      return res.status(400).json({
        message: 'nome, valor, estoque e categorias_id_categoria são obrigatórios'
      });
    }

    const updated = await Product.update(req.params.id, nome, valor, estoque, categorias_id_categoria);
    if (!updated) return res.status(404).json({ message: 'Produto não encontrado' });
    res.json({ message: 'Produto atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.remove = async (req, res) => {
  if (!checkUserId(req, res)) return;
  try {
    const deleted = await Product.remove(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Produto não encontrado' });
    res.json({ message: 'Produto removido com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
