const Sequelize = require("sequelize");
const setupDatabase = require("../../db/lib/postgresql");

module.exports = function (config) {
  const sequelize = setupDatabase(config);
  const Model = sequelize.define(
    "permissions",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      key: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
        comment: "Clave única del permiso (ej: liquidation.create)",
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: "Nombre descriptivo del permiso",
      },
      description: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: "Descripción del permiso",
      },
      category: {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: "Categoría del permiso (ej: liquidation, employee, reports)",
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: "Estado activo/inactivo",
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
    { tableName: "permissions", timestamps: true }
  );

  return Model;
};

