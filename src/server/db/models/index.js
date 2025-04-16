"use strict";
const setupDatabase = require("../lib/postgresql");

// Models
const setupUsersModel = require("../../components/users/model");
const setupEmployeesModel = require("../../components/employees/model");
const setupContractsModel = require("../../components/contracts/model");
const setupCompaniesModel = require("../../components/companies/model");
const setupEmployeeNewsModel = require("../../components/employee_news/model");
const setupTypeNewsModel = require("../../components/type_news/model");

// Stores
const setupUsers = require("../../components/users/store");
const setupEmployees = require("../../components/employees/store");
const setupContracts = require("../../components/contracts/store");
const setupCompanies = require("../../components/companies/store");
const setupEmployeeNews = require("../../components/employee_news/store");
const setupTypeNews = require("../../components/type_news/store");

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
    const EmployeeNewsModel = setupEmployeeNewsModel(sequelize);
    const TypeNewsModel = setupTypeNewsModel(sequelize);

    // Sincroniza los modelos con la base de datos
    await sequelize.sync({ force: false });
    console.log("Conexión a la base de datos establecida con éxito.");

    // Vincular los modelos con las "Stores"
    const Users = setupUsers(UsersModel, config, sequelize);
    const Employees = setupEmployees(EmployeesModel, config, sequelize);
    const Contracts = setupContracts(ContractsModel, config, sequelize);
    const Companies = setupCompanies(CompaniesModel, config, sequelize);
    const EmployeeNews = setupEmployeeNews(
      EmployeeNewsModel,
      config,
      sequelize
    );
    const TypeNews = setupTypeNews(TypeNewsModel, config, sequelize);

    return {
      Users,
      Employees,
      Contracts,
      Companies,
      EmployeeNews,
      TypeNews,
    };
  } catch (error) {
    console.error("No se pudo conectar a la base de datos:", error);
    throw error;
  }
};
