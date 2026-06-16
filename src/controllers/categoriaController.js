// Importa o model de categorias com as queries MySQL
const categoriaModel = require('../models/categoriaModel');

/**
 * Verifica se o ID do usuário está presente na requisição.
 *
 * O middleware de autenticação popula req.userId a partir do payload do token JWT.
 * Esta validação explícita garante que o ID do usuário esteja identificado
 * e validado na requisição antes de processar qualquer operação no CRUD.
 *
 * @param {import('express').Request}  req - Requisição HTTP com req.userId populado pelo middleware.
 * @param {import('express').Response} res - Resposta usada para retornar erro 403 se necessário.
 * @returns {boolean} Retorna true se req.userId existir; false e envia 403 caso contrário.
 */
function checkUserId(req, res) {
  if (!req.userId) {
    res.status(403).json({ message: 'ID de usuário não identificado no token' });
    return false;
  }
  return true;
}

/**
 * Lista todas as categorias cadastradas.
 *
 * Acesso restrito: exige token JWT válido e ID do usuário no payload.
 * Qualquer tentativa sem essas informações retorna 401 (middleware) ou 403 (checkUserId).
 *
 * @async
 * @function getAll
 * @param {import('express').Request}  req - Requisição HTTP com req.userId definido pelo middleware.
 * @param {import('express').Response} res - Resposta com a lista de categorias em JSON.
 * @returns {Promise<void>}
 */
exports.getAll = async (req, res) => {
  if (!checkUserId(req, res)) return;
  try {
    const categorias = await categoriaModel.getAll();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Busca uma categoria pelo seu ID.
 *
 * Acesso restrito: exige token JWT válido e ID do usuário no payload.
 *
 * @async
 * @function getById
 * @param {import('express').Request}  req - Requisição com req.params.id contendo o ID da categoria.
 * @param {import('express').Response} res - Resposta com os dados da categoria ou erro 404.
 * @returns {Promise<void>}
 */
exports.getById = async (req, res) => {
  if (!checkUserId(req, res)) return;
  try {
    const categoria = await categoriaModel.getById(req.params.id);

    // Retorna 404 se a categoria não for encontrada no banco
    if (!categoria) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    res.json(categoria);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Cria uma nova categoria.
 *
 * Acesso restrito: exige token JWT válido e ID do usuário no payload.
 * O campo `nome` é obrigatório no corpo da requisição.
 *
 * @async
 * @function create
 * @param {import('express').Request}  req - Requisição com req.body.nome contendo o nome da categoria.
 * @param {import('express').Response} res - Resposta com o ID da categoria criada ou erro de validação.
 * @returns {Promise<void>}
 */
exports.create = async (req, res) => {
  if (!checkUserId(req, res)) return;
  try {
    const { nome } = req.body;

    // Valida se o campo nome foi enviado e não está vazio
    if (!nome || nome.trim() === '') {
      return res.status(400).json({ message: 'O campo "nome" é obrigatório' });
    }

    const insertId = await categoriaModel.create(nome.trim());
    res.status(201).json({ message: 'Categoria criada com sucesso', id_categoria: insertId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Atualiza o nome de uma categoria existente.
 *
 * Acesso restrito: exige token JWT válido e ID do usuário no payload.
 * Retorna 404 se a categoria com o ID informado não existir.
 *
 * @async
 * @function update
 * @param {import('express').Request}  req - Requisição com req.params.id e req.body.nome.
 * @param {import('express').Response} res - Resposta confirmando a atualização ou indicando erro.
 * @returns {Promise<void>}
 */
exports.update = async (req, res) => {
  if (!checkUserId(req, res)) return;
  try {
    const { nome } = req.body;

    // Valida se o campo nome foi enviado e não está vazio
    if (!nome || nome.trim() === '') {
      return res.status(400).json({ message: 'O campo "nome" é obrigatório' });
    }

    const updated = await categoriaModel.update(req.params.id, nome.trim());

    // Retorna 404 se nenhuma linha foi afetada (ID inexistente)
    if (!updated) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    res.json({ message: 'Categoria atualizada com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Remove uma categoria pelo ID.
 *
 * Acesso restrito: exige token JWT válido e ID do usuário no payload.
 * Retorna 404 se a categoria com o ID informado não existir.
 *
 * @async
 * @function remove
 * @param {import('express').Request}  req - Requisição com req.params.id contendo o ID da categoria.
 * @param {import('express').Response} res - Resposta confirmando a remoção ou indicando erro.
 * @returns {Promise<void>}
 */
exports.remove = async (req, res) => {
  if (!checkUserId(req, res)) return;
  try {
    const deleted = await categoriaModel.remove(req.params.id);

    // Retorna 404 se nenhuma linha foi deletada (ID inexistente)
    if (!deleted) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    res.json({ message: 'Categoria removida com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
