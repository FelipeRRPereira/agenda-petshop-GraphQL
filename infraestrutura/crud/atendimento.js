const executaQuery = require("../database/queries");
const moment = require("moment");

class Atendimento {
  lista() {
    const sql = `SELECT 
                    Atendimentos.id,
                    Atendimentos.data,
                    Atendimentos.dataCriacao,
                    Atendimentos.status,
                    Atendimentos.observacoes,
                    Clientes.id AS clienteId,
                    Clientes.nome AS clienteNome,
                    Clientes.cpf AS clienteCpf,
                    Pets.id AS petId,
                    Pets.nome AS petNome,
                    Pets.tipo AS petTipo,
                    Pets.observacoes AS petObservacoes,
                    Servicos.id AS servicoId,
                    Servicos.nome AS servicoNome,
                    Servicos.preco AS servicoPreco,
                    Servicos.descricao AS servicoDescricao
                FROM
                    atendimentos AS Atendimentos
                        INNER JOIN Clientes
                        INNER JOIN Pets
                        INNER JOIN Servicos
                WHERE
                    Atendimentos.cliente = Clientes.id
                        AND Atendimentos.pet = Pets.id
                        AND Atendimentos.servico = Servicos.id`;

    return executaQuery(sql).then((atendimentos) => {
      return atendimentos.map((atendimento) => ({
        id: atendimento.id,
        data: atendimento.data,
        dataCriacao: atendimento.dataCriacao,
        status: atendimento.status,
        observacoes: atendimento.observacoes,
        cliente: {
          id: atendimento.clienteId,
          nome: atendimento.clienteNome,
          cpf: atendimento.clienteCpf,
        },
        pet: {
          id: atendimento.petId,
          nome: atendimento.petNome,
          tipo: atendimento.petTipo,
          observacoes: atendimento.petObservacoes,
        },
        servico: {
          id: atendimento.servicoId,
          nome: atendimento.servicoNome,
          preco: atendimento.servicoPreco,
          descricao: atendimento.servicoDescricao,
        },
      }));
    });
  }

  buscaPorId(res, id) {
    const sql = `SELECT * FROM Atendimentos WHERE id=${parseInt(id)}`;

    executaQuery(res, sql);
  }

  adiciona(item) {
    const { clienteId, petId, servicoId, data, status, observacoes } = item;
    const dataCriacao = moment().format("YYYY-MM-DD HH:mm:ss");
    const dataFormatada = moment(data, "DD/MM/YYYY").format(
      "YYYY-MM-DD HH:mm:ss"
    );

    const sql = `INSERT INTO Atendimentos(cliente, pet, servico, data, dataCriacao, status, observacoes) VALUES(${clienteId}, ${petId}, ${servicoId}, '${dataFormatada}', '${dataCriacao}', '${status}', '${observacoes}');
      SELECT * FROM Clientes WHERE Clientes.id = ${clienteId}; 
      SELECT * FROM Pets WHERE Pets.id = ${petId};
      SELECT * FROM Servicos WHERE Servicos.id = ${servicoId}`;

    return executaQuery(sql).then((dados) => {
      const cliente = dados[1][0];
      const pet = dados[2][0];
      const servico = dados[3][0];
      return {
        id: dados[0].insertId,
        cliente,
        pet,
        servico,
        data: dataFormatada,
        dataCriacao,
        status,
        observacoes,
      };
    });
  }

  atualiza(res, novoItem, id) {
    const { cliente, pet, servico, status, observacoes } = item;
    const data = new Date.toLocaleDateString();

    const sql = `UPDATE Atendimentos SET clienteId=${cliente}, petId=${pet}, servicoId=${servico}, data='${data}', status='${status}' observacoes='${observacoes}' WHERE id=${id}`;

    executaQuery(res, sql);
  }

  deleta(res, id) {
    const sql = `DELETE FROM Atendimentos WHERE id=${id}`;

    executaQuery(res, sql);
  }
}

module.exports = new Atendimento();
