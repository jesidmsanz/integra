"use strict";
const setupDatabase = require("../lib/postgresql");

// Models
const setupUsersModel = require("../../components/users/model");
const setupEmployeesModel = require("../../components/employees/model");
const setupContractsModel = require("../../components/contracts/model");
const setupCompaniesModel = require("../../components/companies/model");
const setupEmployeeNewsModel = require("../../components/employee_news/model");
const setupTypeNewsModel = require("../../components/type_news/model");
const setupLiquidationNewsTrackingModel = require("../../components/liquidation_news_tracking/model");
const setupLiquidationsModel = require("../../components/liquidations/model");
const setupLiquidationDetailsModel = require("../../components/liquidations/liquidation_details_model");
const setupLiquidationNewsModel = require("../../components/liquidations/liquidation_news_model");
const setupNormativasModel = require("../../components/normativas/model");
const setupRolesModel = require("../../components/roles/model");
const setupPermissionsModel = require("../../components/permissions/model");
const setupRolePermissionsModel = require("../../components/role_permissions/model");
const setupPositionsModel = require("../../components/positions/model");

// Stores
const setupUsers = require("../../components/users/store");
const setupEmployees = require("../../components/employees/store");
const setupContracts = require("../../components/contracts/store");
const setupCompanies = require("../../components/companies/store");
const setupEmployeeNews = require("../../components/employee_news/store");
const setupTypeNews = require("../../components/type_news/store");
const setupLiquidationNewsTracking = require("../../components/liquidation_news_tracking/store");
const setupLiquidations = require("../../components/liquidations/store");
const setupLiquidationDetails = require("../../components/liquidations/liquidation_details_store");
const setupLiquidationNews = require("../../components/liquidations/liquidation_news_store");
const setupNormativas = require("../../components/normativas/store");
const setupRoles = require("../../components/roles/store");
const setupPermissions = require("../../components/permissions/store");
const setupRolePermissions = require("../../components/role_permissions/store");
const setupPositions = require("../../components/positions/store");

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
    const LiquidationNewsTrackingModel = setupLiquidationNewsTrackingModel(sequelize);
    const LiquidationsModel = setupLiquidationsModel(sequelize);
    const LiquidationDetailsModel = setupLiquidationDetailsModel(sequelize);
    const LiquidationNewsModel = setupLiquidationNewsModel(sequelize);
    const NormativasModel = setupNormativasModel(sequelize);
    const RolesModel = setupRolesModel(sequelize);
    const PermissionsModel = setupPermissionsModel(sequelize);
    const RolePermissionsModel = setupRolePermissionsModel(sequelize);
    const PositionsModel = setupPositionsModel(sequelize);

    // Establecer relaciones entre modelos
    // Liquidations -> Companies
    LiquidationsModel.belongsTo(CompaniesModel, {
      foreignKey: "company_id",
      as: "company",
    });
    CompaniesModel.hasMany(LiquidationsModel, {
      foreignKey: "company_id",
      as: "liquidations",
    });

    // Liquidations -> Users (user_id)
    LiquidationsModel.belongsTo(UsersModel, {
      foreignKey: "user_id",
      as: "creator",
    });
    UsersModel.hasMany(LiquidationsModel, {
      foreignKey: "user_id",
      as: "createdLiquidations",
    });

    // Liquidations -> Users (approved_by)
    LiquidationsModel.belongsTo(UsersModel, {
      foreignKey: "approved_by",
      as: "approver",
    });
    UsersModel.hasMany(LiquidationsModel, {
      foreignKey: "approved_by",
      as: "approvedLiquidations",
    });

    // LiquidationDetails -> Liquidations
    LiquidationDetailsModel.belongsTo(LiquidationsModel, {
      foreignKey: "liquidation_id",
      as: "liquidation",
    });
    LiquidationsModel.hasMany(LiquidationDetailsModel, {
      foreignKey: "liquidation_id",
      as: "details",
    });

    // LiquidationDetails -> Employees
    LiquidationDetailsModel.belongsTo(EmployeesModel, {
      foreignKey: "employee_id",
      as: "employee",
    });
    EmployeesModel.hasMany(LiquidationDetailsModel, {
      foreignKey: "employee_id",
      as: "liquidationDetails",
    });

    // LiquidationNews -> LiquidationDetails
    LiquidationNewsModel.belongsTo(LiquidationDetailsModel, {
      foreignKey: "liquidation_detail_id",
      as: "liquidationDetail",
    });
    LiquidationDetailsModel.hasMany(LiquidationNewsModel, {
      foreignKey: "liquidation_detail_id",
      as: "news",
    });

    // LiquidationNews -> EmployeeNews
    LiquidationNewsModel.belongsTo(EmployeeNewsModel, {
      foreignKey: "employee_news_id",
      as: "employeeNews",
    });
    EmployeeNewsModel.hasMany(LiquidationNewsModel, {
      foreignKey: "employee_news_id",
      as: "liquidationNews",
    });

    // LiquidationNews -> TypeNews
    LiquidationNewsModel.belongsTo(TypeNewsModel, {
      foreignKey: "type_news_id",
      as: "typeNews",
    });
    TypeNewsModel.hasMany(LiquidationNewsModel, {
      foreignKey: "type_news_id",
      as: "liquidationNews",
    });

    // Normativas -> Users (creator)
    NormativasModel.belongsTo(UsersModel, {
      foreignKey: "created_by",
      as: "creator",
    });
    UsersModel.hasMany(NormativasModel, {
      foreignKey: "created_by",
      as: "normativas",
    });

    // RolePermissions -> Roles
    RolePermissionsModel.belongsTo(RolesModel, {
      foreignKey: "role_id",
      as: "role",
    });
    RolesModel.hasMany(RolePermissionsModel, {
      foreignKey: "role_id",
      as: "permissions",
    });

    // RolePermissions ahora usa permission_key directamente (sin relación con PermissionsModel)

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
    const LiquidationNewsTracking = setupLiquidationNewsTracking(
      LiquidationNewsTrackingModel,
      config,
      sequelize
    );
    const Liquidations = setupLiquidations(
      LiquidationsModel,
      config,
      sequelize
    );
    const LiquidationDetails = setupLiquidationDetails(
      LiquidationDetailsModel,
      config,
      sequelize
    );
    const LiquidationNews = setupLiquidationNews(
      LiquidationNewsModel,
      config,
      sequelize
    );
    const Normativas = setupNormativas(NormativasModel, config, sequelize);
    const Roles = setupRoles(RolesModel, config, sequelize);
    const Permissions = setupPermissions(PermissionsModel, config, sequelize);
    const RolePermissions = setupRolePermissions(RolePermissionsModel, config, sequelize);
    const Positions = setupPositions(PositionsModel, config, sequelize);

    return {
      Users,
      Employees,
      Contracts,
      Companies,
      EmployeeNews,
      TypeNews,
      LiquidationNewsTracking,
      Liquidations,
      LiquidationDetails,
      LiquidationNews,
      Normativas,
      Roles,
      Permissions,
      RolePermissions,
      Positions,
      sequelize,
    };
  } catch (error) {
    console.error("No se pudo conectar a la base de datos:", error);
    throw error;
  }
};
