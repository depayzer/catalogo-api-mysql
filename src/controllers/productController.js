// Importa o model de produto
const Product = require('../models/Product');

/**
 * Cria um novo produto no banco de dados.
 *
 * Utiliza os dados enviados no corpo da requisição e associa o produto
 * ao usuário autenticado por meio do ID disponível em req.userId.
 *
 * @param {import('express').Request} req - Objeto da requisição HTTP contendo os dados do produto em req.body e o ID do usuário em req.userId.
 * @param {import('express').Response} res - Objeto da resposta HTTP usado para retornar o produto criado ou uma mensagem de erro.
 * @returns {Promise<void>} Retorna uma resposta JSON com o produto criado.
 */
exports.create = async (req, res) => {
  try {
    // Cria o produto com os dados do body + ID do usuário logado
    const product = await Product.create({ ...req.body, createdBy: req.userId });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Lista todos os produtos cadastrados.
 *
 * Busca todos os produtos no banco de dados e popula os dados básicos
 * do usuário responsável pela criação de cada produto.
 *
 * @param {import('express').Request} req - Objeto da requisição HTTP.
 * @param {import('express').Response} res - Objeto da resposta HTTP usado para retornar a lista de produtos ou uma mensagem de erro.
 * @returns {Promise<void>} Retorna uma resposta JSON com a lista de produtos.
 */
exports.getAll = async (req, res) => {
  try {
    // Busca todos os produtos e popula os dados do usuário que criou
    const products = await Product.find().populate('createdBy', 'name email');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Busca um produto específico pelo ID informado na URL.
 *
 * Consulta o banco de dados utilizando o parâmetro req.params.id.
 * Caso o produto não exista, retorna status 404.
 *
 * @param {import('express').Request} req - Objeto da requisição HTTP contendo o ID do produto em req.params.id.
 * @param {import('express').Response} res - Objeto da resposta HTTP usado para retornar o produto encontrado ou uma mensagem de erro.
 * @returns {Promise<void>} Retorna uma resposta JSON com o produto encontrado.
 */
exports.getOne = async (req, res) => {
  try {
    // Busca o produto pelo ID passado na URL
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produto não encontrado' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Atualiza um produto existente pelo ID informado na URL.
 *
 * Utiliza os dados enviados em req.body para atualizar o produto.
 * A opção new retorna o documento já atualizado, e runValidators garante
 * que as validações do schema sejam aplicadas durante a atualização.
 *
 * @param {import('express').Request} req - Objeto da requisição HTTP contendo o ID do produto em req.params.id e os dados atualizados em req.body.
 * @param {import('express').Response} res - Objeto da resposta HTTP usado para retornar o produto atualizado ou uma mensagem de erro.
 * @returns {Promise<void>} Retorna uma resposta JSON com o produto atualizado.
 */
exports.update = async (req, res) => {
  try {
    // Busca e atualiza o produto, retornando o documento atualizado
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Retorna o documento após a atualização
      runValidators: true // Valida os dados antes de atualizar
    });
    if (!product) return res.status(404).json({ message: 'Produto não encontrado' });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Remove um produto existente pelo ID informado na URL.
 *
 * Busca o produto pelo ID e o remove do banco de dados.
 * Caso o produto não exista, retorna status 404.
 *
 * @param {import('express').Request} req - Objeto da requisição HTTP contendo o ID do produto em req.params.id.
 * @param {import('express').Response} res - Objeto da resposta HTTP usado para retornar a confirmação da remoção ou uma mensagem de erro.
 * @returns {Promise<void>} Retorna uma resposta JSON confirmando a remoção do produto.
 */
exports.remove = async (req, res) => {
  try {
    // Busca e deleta o produto pelo ID
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produto não encontrado' });
    res.json({ message: 'Produto removido com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};