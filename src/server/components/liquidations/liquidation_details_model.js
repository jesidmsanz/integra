const Sequelize = require("sequelize");
const setupDatabase = require("../../db/lib/postgresql");

module.exports = function (config) {
  const sequelize = setupDatabase(config);
  const Model = sequelize.define(
    "liquidation_details",
    {
      liquidation_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "liquidations",
          key: "id",
        },
        comment: "ID de la liquidación padre",
      },
      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "employees",
          key: "id",
        },
        comment: "ID del empleado",
      },
      basic_salary: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: "Salario básico mensual completo del empleado",
      },
      basic_salary_proportional: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: "Salario básico proporcional (considerando días trabajados y novedades)",
      },
      base_security_social: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: "Base de seguridad social (salario base + novedades prestacionales)",
      },
      transportation_assistance: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: "Auxilio de transporte",
      },
      mobility_assistance: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: "Auxilio de movilidad",
      },
      total_novedades: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: "Total de novedades (adiciones)",
      },
      total_earnings: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: "Total devengado (salario + auxilios + novedades positivas)",
      },
      total_discounts: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: "Total de descuentos",
      },
      health_discount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: "Descuento de salud (4%)",
      },
      pension_discount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: "Descuento de pensión (4%)",
      },
      social_security_discounts: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: "Total descuentos de seguridad social (salud + pensión)",
      },
      absence_discounts: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: "Descuentos por ausentismo",
      },
      proportional_discounts: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: "Descuentos proporcionales por novedades",
      },
      net_amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: "Valor neto a pagar",
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
      tableName: "liquidation_details",
      timestamps: true,
      indexes: [
        {
          fields: ["liquidation_id"],
        },
        {
          fields: ["employee_id"],
        },
        {
          fields: ["liquidation_id", "employee_id"],
          unique: true,
        },
      ],
    }
  );

  return Model;
};
