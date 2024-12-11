//import db from './models';
const db = require("./models");

const { configMongoDB, configPostgres } = require("./config");

function setup() {
  return db(configPostgres);
}

//export default setup;

module.exports = setup;
