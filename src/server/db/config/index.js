const configEnv = require("../../config/configMongoDb");
const postgresEnv = require("../../config/configPostgres");

const configMongoDB = configEnv.dbPassword
  ? `mongodb://${configEnv.dbUser}:${configEnv.dbPassword}@${configEnv.dbHost}:${configEnv.dbPort}/${configEnv.dbName}`
  : `mongodb://${configEnv.dbHost}:${configEnv.dbPort}/${configEnv.dbName}`;

const configPostgres = postgresEnv.password
  ? `postgres://${postgresEnv.username}:${postgresEnv.password}@${postgresEnv.host}:${postgresEnv.port}/${postgresEnv.database}`
  : `postgres://${postgresEnv.host}:${postgresEnv.port}/${postgresEnv.dbName}`;

module.exports = { configMongoDB, configPostgres };
