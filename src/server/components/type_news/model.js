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
        allowNull: true,
        comment: "Información de pago",
      },
      affects: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: "Campos de dinero afectados (JSON string)",
      },
      applies_to: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: "Opciones de género aplicables (JSON string)",
      },
      percentage: {
        type: Sequelize.STRING(),
        allowNull: true,
        comment: "Porcentaje de la novedad",
      },
      amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
        comment: "Cantidad fija de la novedad (alternativa a porcentaje)",
      },
      category: {
        type: Sequelize.STRING(),
        allowNull: true,
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
      calculateperhour: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
        comment: "Calcular por hora",
      },
      isDiscount: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: "Si es true, la novedad descuenta; si es false, suma",
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
