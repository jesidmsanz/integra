const { DataTypes } = require("sequelize");

module.exports = function setupLiquidationsModel(sequelize) {
  const LiquidationsModel = sequelize.define(
    "liquidations",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "companies",
          key: "id",
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      period: {
        type: DataTypes.STRING(7),
        allowNull: false,
        comment: "Formato YYYY-MM",
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: "Fecha de inicio del período de liquidación",
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: "Fecha de fin del período de liquidación",
      },
      payment_frequency: {
        type: DataTypes.ENUM("Quincenal", "Mensual"),
        allowNull: false,
        defaultValue: "Mensual",
        comment: "Frecuencia de pago: Quincenal o Mensual",
      },
      cut_number: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "Número de corte para liquidaciones quincenales (1 o 2)",
      },
      status: {
        type: DataTypes.ENUM("draft", "approved", "paid", "cancelled"),
        allowNull: false,
        defaultValue: "draft",
      },
      total_employees: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      total_basic_salary: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
      },
      total_transportation_assistance: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
      },
      total_mobility_assistance: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
      },
      total_novedades: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
      },
      total_discounts: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
      },
      total_net_amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      approved_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      approved_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      paid_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      paid_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "liquidations",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          fields: ["company_id"],
        },
        {
          fields: ["user_id"],
        },
        {
          fields: ["period"],
        },
        {
          fields: ["status"],
        },
        {
          fields: ["company_id"],
        },
      ],
    }
  );

  return LiquidationsModel;
};
