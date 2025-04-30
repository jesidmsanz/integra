const Sequelize = require("sequelize");
const setupDatabase = require("../../db/lib/postgresql");

module.exports = function (config) {
  const sequelize = setupDatabase(config);
  const Model = sequelize.define(
    "employee_news",
    {
      companyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "ID de la empresa",
        references: {
          model: "companies",
          key: "id",
        },
      },
      employeeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "ID del empleado",
        references: {
          model: "employees",
          key: "id",
        },
      },
      typeNewsId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "ID del tipo de novedad",
        references: {
          model: "type_news",
          key: "id",
        },
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: "Fecha de inicio",
      },
      startTime: {
        type: Sequelize.TIME,
        allowNull: false,
        comment: "Hora de inicio",
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: "Fecha de fin",
      },
      endTime: {
        type: Sequelize.TIME,
        allowNull: true,
        comment: "Hora de fin",
      },
      status: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "Estado de la novedad",
      },
      approvedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: "ID del usuario que aprobó",
        references: {
          model: "users",
          key: "id",
        },
      },
      observations: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: "Observaciones",
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
    { tableName: "employee_news", timestamps: true }
  );
  return Model;
};
