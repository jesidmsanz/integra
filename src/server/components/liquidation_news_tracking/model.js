const Sequelize = require("sequelize");
const setupDatabase = require("../../db/lib/postgresql");

module.exports = function (config) {
  const sequelize = setupDatabase(config);
  const Model = sequelize.define(
    "liquidation_news_tracking",
    {
      employee_news_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "ID de la novedad del empleado",
        references: {
          model: "employee_news",
          key: "id",
        },
      },
      liquidation_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "ID de la liquidación",
        references: {
          model: "liquidations",
          key: "id",
        },
      },
      liquidation_detail_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "ID del detalle de liquidación",
        references: {
          model: "liquidation_details",
          key: "id",
        },
      },
      status: {
        type: Sequelize.ENUM('included', 'excluded', 'modified'),
        allowNull: false,
        defaultValue: 'included',
        comment: "Estado: included, excluded, modified",
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: "Notas adicionales sobre la inclusión/exclusión",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: "Creation Date",
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: "Update Date",
      },
    },
    { 
      tableName: "liquidation_news_tracking", 
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          fields: ['employee_news_id']
        },
        {
          fields: ['liquidation_id']
        },
        {
          fields: ['status']
        },
        {
          fields: ['liquidation_id', 'employee_news_id']
        }
      ]
    }
  );
  return Model;
};
