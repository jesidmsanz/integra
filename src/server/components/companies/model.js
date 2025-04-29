const Sequelize = require("sequelize");
const setupDatabase = require("../../db/lib/postgresql");
module.exports = function (config) {
  const sequelize = setupDatabase(config);
  const Model = sequelize.define(
    "companies",
    {
      companyname: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "CompanyName",
      },
      nit: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "Nit",
      },
      address: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "Address",
      },
      phone: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "Phone",
      },
      email: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "Email",
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        comment: "Active",
        default: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: "Creation Date",
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: "Update Date",
      },
    },
    { tableName: "companies", timestamps: true }
  );
  return Model;
};
