const path = require("path");
const { fileLoader, mergeTypes } = require("merge-graphql-schemas");

const arquivos = path.join(__dirname, "./");

const arquivosCarregados = fileLoader(arquivos);
const schemas = mergeTypes(arquivosCarregados);

module.exports = schemas;
