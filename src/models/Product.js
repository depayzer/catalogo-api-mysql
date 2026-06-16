// Importa o Mongoose para criar o modelo
const mongoose = require('mongoose');

/**
 * Schema responsável por definir a estrutura dos produtos no banco de dados.
 *
 * Contém os campos principais do produto, suas validações, atributos dinâmicos
 * e a referência ao usuário responsável pela criação do registro.
 *
 * @type {import('mongoose').Schema}
 */
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome do produto é obrigatório'],
    trim: true // Remove espaços extras
  },
  description: {
    type: String,
    required: [true, 'Descrição é obrigatória']
  },
  price: {
    type: Number,
    required: [true, 'Preço é obrigatório'],
    min: [0, 'Preço não pode ser negativo'] // Validação de valor mínimo
  },
  category: {
    type: String,
    required: [true, 'Categoria é obrigatória']
  },
  attributes: {
    type: Map, // Map permite atributos dinâmicos (flexibilidade do NoSQL)
    of: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId, // Referência ao ID do usuário
    ref: 'User', // Relacionamento com o modelo User
    required: true
  }
}, { timestamps: true }); // Adiciona createdAt e updatedAt automaticamente

/**
 * Modelo Mongoose de Produto.
 *
 * Fornece os recursos necessários para criar, buscar, atualizar e remover
 * documentos da coleção de produtos no MongoDB.
 *
 * @type {import('mongoose').Model}
 */
module.exports = mongoose.model('Product', productSchema);