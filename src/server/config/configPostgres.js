require("dotenv").config();
const configPostgres = {
  //JWT
  authJwtSecret: process.env.AUTH_JWT_SECRET || "AUTH_JWT_SECRET",

  //DB
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || null,
  database: process.env.DB_NAME || "database_development",
  host: process.env.DB_HOST || "127.0.0.1",
  port: process.env.DB_PORT || 5432,
  dialect: "postgres",
};
module.exports = configPostgres;
