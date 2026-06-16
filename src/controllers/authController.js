// Importa o model de usuário com as queries MySQL
const User = require('../models/User');

// Importa o bcryptjs para criptografar e comparar senhas
const bcrypt = require('bcryptjs');

// Importa o jsonwebtoken para gerar tokens de autenticação
const jwt = require('jsonwebtoken');

/**
 * Registra um novo usuário no sistema.
 *
 * Verifica se o e-mail já está cadastrado na base MySQL, criptografa
 * a senha informada com bcrypt e insere o novo usuário na tabela `usuarios`.
 *
 * @async
 * @function register
 * @param {import('express').Request}  req - Requisição contendo nome, email e password em req.body.
 * @param {import('express').Response} res - Resposta usada para retornar o status do cadastro.
 * @returns {Promise<void>} Retorna uma mensagem de sucesso com o ID do usuário criado.
 */
exports.register = async (req, res) => {
  try {
    // Extrai os dados do corpo da requisição
    const { nome, email, password } = req.body;

    // Valida se todos os campos obrigatórios foram enviados
    if (!nome || !email || !password) {
      return res.status(400).json({ message: 'nome, email e password são obrigatórios' });
    }

    // Verifica se já existe um usuário com esse e-mail
    const exists = await User.findByEmail(email);
    if (exists) {
      return res.status(400).json({ message: 'E-mail já cadastrado' });
    }

    // Criptografa a senha antes de salvar (nunca salva senha em texto puro)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insere o usuário no banco de dados relacional
    const insertId = await User.create(nome, email, hashedPassword);

    res.status(201).json({ message: 'Usuário criado com sucesso', id: insertId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Autentica um usuário e gera um token JWT.
 *
 * Busca o usuário pelo e-mail na base MySQL, compara a senha enviada com a
 * senha criptografada armazenada e, se as credenciais forem válidas,
 * retorna um token JWT contendo o ID do usuário no payload.
 *
 * O ID do usuário no token é exigido pelas rotas protegidas de categorias.
 *
 * @async
 * @function login
 * @param {import('express').Request}  req - Requisição contendo email e password em req.body.
 * @param {import('express').Response} res - Resposta usada para retornar o token JWT ou erro.
 * @returns {Promise<void>} Retorna um token JWT em formato JSON.
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Busca o usuário pelo e-mail no banco relacional
    const user = await User.findByEmail(email);
    if (!user) {
      // Mensagem genérica para não revelar se o e-mail existe ou não
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Compara a senha digitada com a senha criptografada no banco
    const match = await bcrypt.compare(password, user.senha);
    if (!match) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Gera o token JWT com o ID do usuário, expira em 1 dia
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
