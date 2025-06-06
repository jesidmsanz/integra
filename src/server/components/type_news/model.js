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
      code: {
        type: Sequelize.STRING(10),
        allowNull: false,
        comment: "Código de la novedad",
      },
      duration: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "Duración de la novedad",
      },
      payment: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "Información de pago",
      },
      affects: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "A qué afecta la novedad",
      },
      applies_to: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "A quién aplica (femenino/masculino/ambos)",
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
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: "Notas adicionales sobre la novedad",
      },
      noaplicaauxiliotransporte: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        comment: "No aplica auxilio de transporte",
      },
      calculateperhour: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        comment: "Calcular por hora",
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
    { tableName: "type_news", timestamps: true }
  );
  return Model;
};
