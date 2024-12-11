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
