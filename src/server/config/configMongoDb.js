require("dotenv").config();
const configMongoDb = {
  //JWT
  authJwtSecret: process.env.AUTH_JWT_SECRET || "AUTH_JWT_SECRET",

  //DB
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  dbName: process.env.DB_NAME,
};
module.exports = configMongoDb;
