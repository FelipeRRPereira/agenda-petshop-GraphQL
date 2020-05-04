const { GraphQLServer } = require('graphql-yoga')
const conexao = require('./infraestrutura/conexao')
const Tabelas = require('./infraestrutura/database/tabelas')
const Operations = require('./infraestrutura/operations')

conexao.connect(erro => {
  if (erro) {
    console.log(erro)
  }

  console.log('conectou no banco')

  Tabelas.init(conexao)
})

const Clientes = new Operations('cliente')
const Pets = new Operations('pet')
const resolvers = {
  Query: {
    status: () => 'Servidor rodando!',
    clientes: () => Clientes.lista(),
    cliente: (root, {id}) => Clientes.buscaPorId(id)
  },
  Mutation: {
    // Cliente
    adicionarCliente: (root, params) => (Clientes.adiciona(params)),
    atualizarCliente: (root, params) => (Clientes.atualiza(params)),
    deletarCliente: (root, {id}) => (Clientes.deleta(id)),
    // Pet
    adicionarPet: (root, params) => (Pets.adiciona(params))
  }
}

const servidor = new GraphQLServer({
  resolvers,
  typeDefs: "./schema.graphql"
})

servidor.start(() => console.log('Servidor ouvindo'))
