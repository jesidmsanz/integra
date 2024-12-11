const Sequelize = require("sequelize");
const setupDatabase = require("../../db/lib/postgresql");
module.exports = function (config) {
  const sequelize = setupDatabase(config);
  const Model = sequelize.define(
    "companies",
    {
      CompanyName: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "CompanyName",
      },
      Nit: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "Nit",
      },
      Address: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "Address",
      },
      Phone: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "Phone",
      },
      Email: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "Email",
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
    { tableName: "companies", timestamps: true }
  );
  return Model;
};
