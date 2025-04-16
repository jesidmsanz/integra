const Sequelize = require("sequelize");
const setupDatabase = require("../../db/lib/postgresql");

module.exports = function (config) {
  const sequelize = setupDatabase(config);
  const Model = sequelize.define(
    "type_news",
    {
      name: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "Nombre del tipo de novedad",
      },
      affects: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "A qué afecta la novedad",
      },
      percentage: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        comment: "Porcentaje si aplica",
      },
      status: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "Estado de la novedad",
      },
      category: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "Categoría de la novedad",
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
        comment: "Fecha de creación",
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: "Fecha de actualización",
      },
    },
    { tableName: "type_news", timestamps: true }
  );
  return Model;
};
