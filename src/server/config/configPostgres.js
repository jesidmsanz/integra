require("dotenv").config();
const configPostgres = {
  //JWT
  authJwtSecret: process.env.AUTH_JWT_SECRET || "AUTH_JWT_SECRET",

  //DB
  username: process.env.DB_USERNAME || "integra",
  password: process.env.DB_PASSWORD || 'Asd123*-',
  database: process.env.DB_NAME || "integra",
  host: process.env.DB_HOST || "10.10.10.54",
  port: process.env.DB_PORT || 5432,
  dialect: "postgres",
};
module.exports = configPostgres;
