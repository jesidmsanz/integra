const Sequelize = require("sequelize");
const setupDatabase = require("../../db/lib/postgresql");
module.exports = function (config) {
  const sequelize = setupDatabase(config);
  const Model = sequelize.define(
    "news",
    {
      Name: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "Name",
      },
      EquivalentPercentage: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "EquivalentPercentage",
      },
      Observation: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "Observation",
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
    { tableName: "news", timestamps: true }
  );
  return Model;
};
