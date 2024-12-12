const Sequelize = require("sequelize");
const setupDatabase = require("../../db/lib/postgresql");
module.exports = function (config) {
  const sequelize = setupDatabase(config);
  const Model = sequelize.define(
    "employees",
    {
      ContractType: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "ContractType",
      },
      Name: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "Name",
      },
      Phone: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "Phone",
      },
      Address: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "Address",
      },
      Email: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "Email",
      },
      Eps: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "Eps",
      },
      Arl: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "Arl",
      },
      Pension: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "Pension",
      },
      Sexo: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "Sexo",
      },
      NumberOfChildren: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "NumberOfChildren",
      },
      Birthdate: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "Birthdate",
      },
      Name: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "Name",
      },
      ContractStartDate: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: "contract start date",
      },
      PositionArea: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "Position/area",
      },
      BasicMonthlySalary: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "basic monthly salary",
      },
      ShiftValuePerHour: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "Shift value per hour",
      },
      TransportationAssistance: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "transportation assistance",
      },
      MobilityAssistance: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "Mobility Assistance",
      },
      HasAdditionalDiscount: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        comment: "HasAdditionalDiscount",
      },
      DiscountValue: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "DiscountValue",
      },
      AdditionalDiscountComment: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "AdditionalDiscountComment",
      },
      Active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        comment: "Active",
        default: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: "FCREACION",
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: "FECHA_ACTUALIZACION",
      },
    },
    { tableName: "employees", timestamps: true }
  );
  return Model;
};
