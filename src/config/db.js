// Importa o mysql2 com suporte a Promises/async-await
const mysql = require('mysql2/promise');

/**
 * Pool de conexões com o banco de dados MySQL.
 *
 * Utiliza variáveis de ambiente para isolar as credenciais,
 * evitando que informações sensíveis fiquem expostas no código-fonte.
 *
 * O pool reutiliza conexões abertas em vez de criar uma nova a cada requisição,
 * melhorando a performance da aplicação.
 *
 * @type {import('mysql2/promise').Pool}
 */
const pool = mysql.createPool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT || 3306,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true, // Aguarda conexão disponível se o limite for atingido
  connectionLimit: 10,      // Máximo de conexões simultâneas no pool
  queueLimit: 0             // 0 = fila ilimitada de requisições aguardando conexão
});

// Exporta o pool para ser utilizado nos models
module.exports = pool;
