const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Catálogo API REST – MySQL',
      version: '2.0.0',
      description:
        'API REST para gerenciamento de catálogo de produtos com autenticação JWT e banco de dados MySQL.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local de desenvolvimento',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Insira o token JWT obtido no endpoint /api/auth/login',
        },
      },
      schemas: {
        // ── Auth ──────────────────────────────────────────────────────────
        RegisterBody: {
          type: 'object',
          required: ['nome', 'email', 'password'],
          properties: {
            nome:     { type: 'string', example: 'João Silva' },
            email:    { type: 'string', format: 'email', example: 'joao@email.com' },
            password: { type: 'string', format: 'password', example: 'senha123' },
          },
        },
        LoginBody: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email:    { type: 'string', format: 'email', example: 'joao@email.com' },
            password: { type: 'string', format: 'password', example: 'senha123' },
          },
        },
        TokenResponse: {
          type: 'object',
          properties: {
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          },
        },
        // ── Categoria ─────────────────────────────────────────────────────
        Categoria: {
          type: 'object',
          properties: {
            id_categoria: { type: 'integer', example: 1 },
            nome:         { type: 'string',  example: 'Eletrônicos' },
          },
        },
        CategoriaBody: {
          type: 'object',
          required: ['nome'],
          properties: {
            nome: { type: 'string', example: 'Eletrônicos' },
          },
        },
        // ── Produto ───────────────────────────────────────────────────────
        Produto: {
          type: 'object',
          properties: {
            id_produto:               { type: 'integer', example: 1 },
            nome:                     { type: 'string',  example: 'Notebook Gamer' },
            valor:                    { type: 'number',  format: 'float', example: 4999.90 },
            estoque:                  { type: 'integer', example: 10 },
            categorias_id_categoria:  { type: 'integer', example: 1 },
          },
        },
        ProdutoBody: {
          type: 'object',
          required: ['nome', 'valor', 'estoque', 'categorias_id_categoria'],
          properties: {
            nome:                    { type: 'string',  example: 'Notebook Gamer' },
            valor:                   { type: 'number',  format: 'float', example: 4999.90 },
            estoque:                 { type: 'integer', example: 10 },
            categorias_id_categoria: { type: 'integer', example: 1 },
          },
        },
        // ── Cliente ───────────────────────────────────────────────────────
        Cliente: {
          type: 'object',
          properties: {
            id_cliente: { type: 'integer', example: 1 },
            nome:       { type: 'string',  example: 'Maria Souza' },
            telefone:   { type: 'string',  example: '51999990000' },
            status:     { type: 'string',  enum: ['bom', 'medio', 'ruim'], example: 'bom' },
          },
        },
        ClienteBody: {
          type: 'object',
          required: ['nome', 'telefone'],
          properties: {
            nome:     { type: 'string', example: 'Maria Souza' },
            telefone: { type: 'string', example: '51999990000' },
            status:   { type: 'string', enum: ['bom', 'medio', 'ruim'], example: 'bom' },
          },
        },
        // ── Pedido ────────────────────────────────────────────────────────
        Pedido: {
          type: 'object',
          properties: {
            id_pedido:           { type: 'integer', example: 1 },
            clientes_id_cliente: { type: 'integer', example: 1 },
            data:                { type: 'string',  format: 'date', example: '2026-06-23' },
          },
        },
        PedidoBody: {
          type: 'object',
          required: ['clientes_id_cliente', 'data'],
          properties: {
            clientes_id_cliente: { type: 'integer', example: 1 },
            data:                { type: 'string',  format: 'date', example: '2026-06-23' },
          },
        },
        PedidoUpdateBody: {
          type: 'object',
          required: ['data'],
          properties: {
            data: { type: 'string', format: 'date', example: '2026-07-01' },
          },
        },
        // ── Respostas genéricas ───────────────────────────────────────────
        MensagemSucesso: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Operação realizada com sucesso' },
          },
        },
        Erro: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Mensagem de erro' },
          },
        },
      },
      responses: {
        Unauthorized: {
          description: 'Token JWT ausente ou inválido',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Erro' },
              example: { message: 'Token não fornecido' },
            },
          },
        },
        Forbidden: {
          description: 'ID de usuário não identificado no token',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Erro' },
              example: { message: 'ID de usuário não identificado no token' },
            },
          },
        },
        NotFound: {
          description: 'Recurso não encontrado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Erro' },
              example: { message: 'Recurso não encontrado' },
            },
          },
        },
        InternalError: {
          description: 'Erro interno do servidor',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Erro' },
            },
          },
        },
      },
    },
    // Documenta as rotas inline (sem JSDoc nos arquivos de rota)
    paths: {
      // ── Status / Versão ────────────────────────────────────────────────
      '/api/status': {
        get: {
          tags: ['Status'],
          summary: 'Verifica o status da API',
          description: 'Endpoint público. Retorna a versão e o estado operacional da API.',
          responses: {
            200: {
              description: 'API online',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      versao: { type: 'string', example: '2.0.0' },
                      status: { type: 'string', example: 'online' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/versao': {
        get: {
          tags: ['Status'],
          summary: 'Retorna a versão da API',
          description: 'Alias de /api/status. Endpoint público.',
          responses: {
            200: {
              description: 'Versão da API',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      versao: { type: 'string', example: '2.0.0' },
                      status: { type: 'string', example: 'online' },
                    },
                  },
                },
              },
            },
          },
        },
      },

      // ── Auth ──────────────────────────────────────────────────────────
      '/api/auth/register': {
        post: {
          tags: ['Autenticação'],
          summary: 'Cadastra um novo usuário',
          description: 'Endpoint público. Cria um usuário com senha criptografada via bcrypt.',
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/RegisterBody' } },
            },
          },
          responses: {
            201: {
              description: 'Usuário criado com sucesso',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Usuário criado com sucesso' },
                      id:      { type: 'integer', example: 3 },
                    },
                  },
                },
              },
            },
            400: {
              description: 'Dados inválidos ou e-mail já cadastrado',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Erro' } },
              },
            },
            500: { $ref: '#/components/responses/InternalError' },
          },
        },
      },
      '/api/auth/login': {
        post: {
          tags: ['Autenticação'],
          summary: 'Autentica um usuário e retorna um token JWT',
          description:
            'Endpoint público. Em caso de sucesso, use o token retornado no header `Authorization: Bearer <token>` para acessar rotas protegidas.',
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/LoginBody' } },
            },
          },
          responses: {
            200: {
              description: 'Login realizado com sucesso',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/TokenResponse' } },
              },
            },
            401: {
              description: 'Credenciais inválidas',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Erro' } },
              },
            },
            500: { $ref: '#/components/responses/InternalError' },
          },
        },
      },

      // ── Categorias ────────────────────────────────────────────────────
      '/api/categorias': {
        get: {
          tags: ['Categorias'],
          summary: 'Lista todas as categorias',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Lista de categorias',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/Categoria' } },
                },
              },
            },
            401: { $ref: '#/components/responses/Unauthorized' },
            403: { $ref: '#/components/responses/Forbidden' },
            500: { $ref: '#/components/responses/InternalError' },
          },
        },
        post: {
          tags: ['Categorias'],
          summary: 'Cria uma nova categoria',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/CategoriaBody' } },
            },
          },
          responses: {
            201: {
              description: 'Categoria criada com sucesso',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message:      { type: 'string', example: 'Categoria criada com sucesso' },
                      id_categoria: { type: 'integer', example: 5 },
                    },
                  },
                },
              },
            },
            400: {
              description: 'Campo nome ausente',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Erro' } },
              },
            },
            401: { $ref: '#/components/responses/Unauthorized' },
            403: { $ref: '#/components/responses/Forbidden' },
            500: { $ref: '#/components/responses/InternalError' },
          },
        },
      },
      '/api/categorias/{id}': {
        get: {
          tags: ['Categorias'],
          summary: 'Busca uma categoria pelo ID',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, example: 1 },
          ],
          responses: {
            200: {
              description: 'Dados da categoria',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Categoria' } },
              },
            },
            401: { $ref: '#/components/responses/Unauthorized' },
            403: { $ref: '#/components/responses/Forbidden' },
            404: { $ref: '#/components/responses/NotFound' },
            500: { $ref: '#/components/responses/InternalError' },
          },
        },
        put: {
          tags: ['Categorias'],
          summary: 'Atualiza o nome de uma categoria',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, example: 1 },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/CategoriaBody' } },
            },
          },
          responses: {
            200: {
              description: 'Categoria atualizada',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/MensagemSucesso' } },
              },
            },
            400: {
              description: 'Campo nome ausente',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Erro' } },
              },
            },
            401: { $ref: '#/components/responses/Unauthorized' },
            403: { $ref: '#/components/responses/Forbidden' },
            404: { $ref: '#/components/responses/NotFound' },
            500: { $ref: '#/components/responses/InternalError' },
          },
        },
        delete: {
          tags: ['Categorias'],
          summary: 'Remove uma categoria pelo ID',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, example: 1 },
          ],
          responses: {
            200: {
              description: 'Categoria removida',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/MensagemSucesso' } },
              },
            },
            401: { $ref: '#/components/responses/Unauthorized' },
            403: { $ref: '#/components/responses/Forbidden' },
            404: { $ref: '#/components/responses/NotFound' },
            500: { $ref: '#/components/responses/InternalError' },
          },
        },
      },

      // ── Produtos ──────────────────────────────────────────────────────
      '/api/produtos': {
        get: {
          tags: ['Produtos'],
          summary: 'Lista todos os produtos',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Lista de produtos',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/Produto' } },
                },
              },
            },
            401: { $ref: '#/components/responses/Unauthorized' },
            403: { $ref: '#/components/responses/Forbidden' },
            500: { $ref: '#/components/responses/InternalError' },
          },
        },
        post: {
          tags: ['Produtos'],
          summary: 'Cria um novo produto',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ProdutoBody' } },
            },
          },
          responses: {
            201: {
              description: 'Produto criado com sucesso',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message:    { type: 'string', example: 'Produto criado com sucesso' },
                      id_produto: { type: 'integer', example: 7 },
                    },
                  },
                },
              },
            },
            400: {
              description: 'Campos obrigatórios ausentes',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Erro' } },
              },
            },
            401: { $ref: '#/components/responses/Unauthorized' },
            403: { $ref: '#/components/responses/Forbidden' },
            500: { $ref: '#/components/responses/InternalError' },
          },
        },
      },
      '/api/produtos/{id}': {
        get: {
          tags: ['Produtos'],
          summary: 'Busca um produto pelo ID',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, example: 1 },
          ],
          responses: {
            200: {
              description: 'Dados do produto',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Produto' } },
              },
            },
            401: { $ref: '#/components/responses/Unauthorized' },
            403: { $ref: '#/components/responses/Forbidden' },
            404: { $ref: '#/components/responses/NotFound' },
            500: { $ref: '#/components/responses/InternalError' },
          },
        },
        put: {
          tags: ['Produtos'],
          summary: 'Atualiza um produto',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, example: 1 },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ProdutoBody' } },
            },
          },
          responses: {
            200: {
              description: 'Produto atualizado',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/MensagemSucesso' } },
              },
            },
            400: {
              description: 'Campos obrigatórios ausentes',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Erro' } },
              },
            },
            401: { $ref: '#/components/responses/Unauthorized' },
            403: { $ref: '#/components/responses/Forbidden' },
            404: { $ref: '#/components/responses/NotFound' },
            500: { $ref: '#/components/responses/InternalError' },
          },
        },
        delete: {
          tags: ['Produtos'],
          summary: 'Remove um produto pelo ID',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, example: 1 },
          ],
          responses: {
            200: {
              description: 'Produto removido',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/MensagemSucesso' } },
              },
            },
            401: { $ref: '#/components/responses/Unauthorized' },
            403: { $ref: '#/components/responses/Forbidden' },
            404: { $ref: '#/components/responses/NotFound' },
            500: { $ref: '#/components/responses/InternalError' },
          },
        },
      },

      // ── Clientes ──────────────────────────────────────────────────────
      '/api/clientes': {
        get: {
          tags: ['Clientes'],
          summary: 'Lista todos os clientes',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Lista de clientes',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/Cliente' } },
                },
              },
            },
            401: { $ref: '#/components/responses/Unauthorized' },
            403: { $ref: '#/components/responses/Forbidden' },
            500: { $ref: '#/components/responses/InternalError' },
          },
        },
        post: {
          tags: ['Clientes'],
          summary: 'Cria um novo cliente',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ClienteBody' } },
            },
          },
          responses: {
            201: {
              description: 'Cliente criado com sucesso',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message:    { type: 'string', example: 'Cliente criado com sucesso' },
                      id_cliente: { type: 'integer', example: 4 },
                    },
                  },
                },
              },
            },
            400: {
              description: 'Campos obrigatórios ausentes ou status inválido',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Erro' } },
              },
            },
            401: { $ref: '#/components/responses/Unauthorized' },
            403: { $ref: '#/components/responses/Forbidden' },
            500: { $ref: '#/components/responses/InternalError' },
          },
        },
      },
      '/api/clientes/{id}': {
        get: {
          tags: ['Clientes'],
          summary: 'Busca um cliente pelo ID',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, example: 1 },
          ],
          responses: {
            200: {
              description: 'Dados do cliente',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Cliente' } },
              },
            },
            401: { $ref: '#/components/responses/Unauthorized' },
            403: { $ref: '#/components/responses/Forbidden' },
            404: { $ref: '#/components/responses/NotFound' },
            500: { $ref: '#/components/responses/InternalError' },
          },
        },
        put: {
          tags: ['Clientes'],
          summary: 'Atualiza um cliente',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, example: 1 },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ClienteBody' } },
            },
          },
          responses: {
            200: {
              description: 'Cliente atualizado',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/MensagemSucesso' } },
              },
            },
            400: {
              description: 'Campos obrigatórios ausentes ou status inválido',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Erro' } },
              },
            },
            401: { $ref: '#/components/responses/Unauthorized' },
            403: { $ref: '#/components/responses/Forbidden' },
            404: { $ref: '#/components/responses/NotFound' },
            500: { $ref: '#/components/responses/InternalError' },
          },
        },
        delete: {
          tags: ['Clientes'],
          summary: 'Remove um cliente pelo ID',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, example: 1 },
          ],
          responses: {
            200: {
              description: 'Cliente removido',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/MensagemSucesso' } },
              },
            },
            401: { $ref: '#/components/responses/Unauthorized' },
            403: { $ref: '#/components/responses/Forbidden' },
            404: { $ref: '#/components/responses/NotFound' },
            500: { $ref: '#/components/responses/InternalError' },
          },
        },
      },

      // ── Pedidos ───────────────────────────────────────────────────────
      '/api/pedidos': {
        get: {
          tags: ['Pedidos'],
          summary: 'Lista todos os pedidos',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Lista de pedidos',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/Pedido' } },
                },
              },
            },
            401: { $ref: '#/components/responses/Unauthorized' },
            403: { $ref: '#/components/responses/Forbidden' },
            500: { $ref: '#/components/responses/InternalError' },
          },
        },
        post: {
          tags: ['Pedidos'],
          summary: 'Cria um novo pedido',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/PedidoBody' } },
            },
          },
          responses: {
            201: {
              description: 'Pedido criado com sucesso',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message:   { type: 'string', example: 'Pedido criado com sucesso' },
                      id_pedido: { type: 'integer', example: 2 },
                    },
                  },
                },
              },
            },
            400: {
              description: 'Campos obrigatórios ausentes',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Erro' } },
              },
            },
            401: { $ref: '#/components/responses/Unauthorized' },
            403: { $ref: '#/components/responses/Forbidden' },
            500: { $ref: '#/components/responses/InternalError' },
          },
        },
      },
      '/api/pedidos/{id}': {
        get: {
          tags: ['Pedidos'],
          summary: 'Busca um pedido pelo ID (com itens)',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, example: 1 },
          ],
          responses: {
            200: {
              description: 'Dados do pedido',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Pedido' } },
              },
            },
            401: { $ref: '#/components/responses/Unauthorized' },
            403: { $ref: '#/components/responses/Forbidden' },
            404: { $ref: '#/components/responses/NotFound' },
            500: { $ref: '#/components/responses/InternalError' },
          },
        },
        put: {
          tags: ['Pedidos'],
          summary: 'Atualiza a data de um pedido',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, example: 1 },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/PedidoUpdateBody' } },
            },
          },
          responses: {
            200: {
              description: 'Pedido atualizado',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/MensagemSucesso' } },
              },
            },
            400: {
              description: 'Campo data ausente',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Erro' } },
              },
            },
            401: { $ref: '#/components/responses/Unauthorized' },
            403: { $ref: '#/components/responses/Forbidden' },
            404: { $ref: '#/components/responses/NotFound' },
            500: { $ref: '#/components/responses/InternalError' },
          },
        },
        delete: {
          tags: ['Pedidos'],
          summary: 'Remove um pedido pelo ID',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, example: 1 },
          ],
          responses: {
            200: {
              description: 'Pedido removido',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/MensagemSucesso' } },
              },
            },
            401: { $ref: '#/components/responses/Unauthorized' },
            403: { $ref: '#/components/responses/Forbidden' },
            404: { $ref: '#/components/responses/NotFound' },
            500: { $ref: '#/components/responses/InternalError' },
          },
        },
      },
    },
  },
  // Não usamos JSDoc nos arquivos de rota, então não apontamos apis
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
