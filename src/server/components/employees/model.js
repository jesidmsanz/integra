const Sequelize = require("sequelize");
const setupDatabase = require("../../db/lib/postgresql");
module.exports = function (config) {
  const sequelize = setupDatabase(config);
  const Model = sequelize.define(
    "employees",
    {
      contractType: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "ContractType",
      },
      name: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "Name",
      },
      phone: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "Phone",
      },
      address: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "Address",
      },
      email: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "Email",
      },
      eps: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "Eps",
      },
      arl: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "Arl",
      },
      pension: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "Pension",
      },
      sex: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "Sexo",
      },
      numberOfChildren: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "NumberOfChildren",
      },
      birthdate: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "Birthdate",
      },
      name: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "Name",
      },
      contractStartDate: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: "contract start date",
      },
      positionArea: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "Position/area",
      },
      basicMonthlySalary: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "basic monthly salary",
      },
      shiftValuePerHour: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "Shift value per hour",
      },
      transportationAssistance: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "transportation assistance",
      },
      mobilityAssistance: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "Mobility Assistance",
      },
      hasAdditionalDiscount: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        comment: "HasAdditionalDiscount",
      },
      discountValue: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "DiscountValue",
      },
      additionalDiscountComment: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "AdditionalDiscountComment",
      },
      companyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "companies",
          key: "id",
        },
      },
      active: {
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
