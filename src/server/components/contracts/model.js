const Sequelize = require("sequelize");
const setupDatabase = require("../../db/lib/postgresql");

module.exports = function (config) {
  const sequelize = setupDatabase(config);
  const Model = sequelize.define(
    "contracts",
    {
      name: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "Name",
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
    { tableName: "contracts", timestamps: true }
  );
  return Model;
};
