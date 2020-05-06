const Operations = require("../../infraestrutura/operations");
const Atendimentos = new Operations("atendimento");

const resolvers = {
  Query: {
    atendimentos: () => Atendimentos.lista(),
    atendimento: (root, { id }) => Atendimentos.buscaPorId(id),
  },
  Mutation: {
    adicionarAtendimento: (root, params) => Atendimentos.adiciona(params),
    atualizarAtendimento: (root, params) => Atendimentos.atualiza(params),
    deletarAtendimento: (root, { id }) => Atendimentos.deleta(id),
  },
};

module.exports = resolvers;
