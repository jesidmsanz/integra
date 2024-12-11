"use strict";
const setupDatabase = require("../lib/postgresql");

// Models
const setupUsersModel = require("../../components/users/model");
const setupEmployeesModel = require("../../components/employees/model");
const setupContractsModel = require("../../components/contracts/model");
const setupCompaniesModel = require("../../components/companies/model");
const setupNewsModel = require("../../components/news/model");

// Stores
const setupUsers = require("../../components/users/store");
const setupEmployees = require("../../components/employees/store");
const setupContracts = require("../../components/contracts/store");
const setupCompanies = require("../../components/companies/store");
const setupNews = require("../../components/news/store");

module.exports = async (config) => {
  const sequelize = setupDatabase(config);

  try {
    // Probar la conexión
    await sequelize.authenticate();

    // Configurar modelos
    const UsersModel = setupUsersModel(sequelize);
    const EmployeesModel = setupEmployeesModel(sequelize);
    const ContractsModel = setupContractsModel(sequelize);
    const CompaniesModel = setupCompaniesModel(sequelize);
    const NewsModel = setupNewsModel(sequelize);

    // Sincroniza los modelos con la base de datos
    await sequelize.sync({ force: false });
    console.log("Conexión a la base de datos establecida con éxito.");

    // Vincular los modelos con las "Stores"
    const Users = setupUsers(UsersModel, config, sequelize);
    const Employees = setupEmployees(EmployeesModel, config, sequelize);
    const Contracts = setupContracts(ContractsModel, config, sequelize);
    const Companies = setupCompanies(CompaniesModel, config, sequelize);
    const News = setupNews(NewsModel, config, sequelize);

    return {
      Users,
      Employees,
      Contracts,
      Companies,
      News,
    };
  } catch (error) {
    console.error("No se pudo conectar a la base de datos:", error);
    throw error;
  }
};
