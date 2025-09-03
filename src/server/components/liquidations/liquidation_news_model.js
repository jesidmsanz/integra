const Sequelize = require("sequelize");
const setupDatabase = require("../../db/lib/postgresql");

module.exports = function (config) {
  const sequelize = setupDatabase(config);
  const Model = sequelize.define(
    "liquidation_news",
    {
      liquidation_detail_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "liquidation_details",
          key: "id",
        },
        comment: "ID del detalle de liquidación",
      },
      employee_news_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "employee_news",
          key: "id",
        },
        comment: "ID de la novedad del empleado",
      },
      type_news_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "type_news",
          key: "id",
        },
        comment: "ID del tipo de novedad",
      },
      hours: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: false,
        defaultValue: 0,
        comment: "Horas aplicadas",
      },
      days: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "Días aplicados",
      },
      amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: "Valor calculado de la novedad",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "liquidation_news",
      timestamps: true,
      indexes: [
        {
          fields: ["liquidation_detail_id"],
        },
        {
          fields: ["employee_news_id"],
        },
        {
          fields: ["type_news_id"],
        },
      ],
    }
  );

  return Model;
};
