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
        data: moment(atendimento.data).format("YYYY-MM-DD HH:mm:ss"),
        dataCriacao: moment(atendimento.dataCriacao).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
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

  buscaPorId(id) {
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
                        AND Atendimentos.servico = Servicos.id
                        AND Atendimentos.id = ${parseInt(id)}`;

    return executaQuery(sql).then((atendimentos) => {
      const atendimento = atendimentos[0];
      return {
        id: atendimento.id,
        data: moment(atendimento.data).format("YYYY-MM-DD HH:mm:ss"),
        dataCriacao: moment(atendimento.dataCriacao).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
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
      };
    });
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

  atualiza(novoItem) {
    const {
      id,
      clienteId,
      petId,
      servicoId,
      data,
      status,
      observacoes,
    } = novoItem;
    const dataFormatada = moment(data, "DD/MM/YYYY").format(
      "YYYY-MM-DD HH:mm:ss"
    );

    const sql = `UPDATE Atendimentos SET cliente=${clienteId}, pet=${petId}, servico=${servicoId}, data='${dataFormatada}', status='${status}', observacoes='${observacoes}' WHERE id=${id};
      SELECT * FROM Clientes WHERE Clientes.id = ${clienteId}; 
      SELECT * FROM Pets WHERE Pets.id = ${petId};
      SELECT * FROM Servicos WHERE Servicos.id = ${servicoId}`;

    return executaQuery(sql).then((dados) => {
      const cliente = dados[1][0];
      const pet = dados[2][0];
      const servico = dados[3][0];
      return {
        id,
        cliente,
        pet,
        servico,
        data: dataFormatada,
        dataCriacao: null,
        status,
        observacoes,
      };
    });
  }

  deleta(id) {
    const sql = `DELETE FROM Atendimentos WHERE id=${id}`;

    return executaQuery(sql).then(() => id);
  }
}

module.exports = new Atendimento();
