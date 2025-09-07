const { DataTypes } = require("sequelize");

module.exports = function setupNormativesModel(sequelize) {
  const NormativesModel = sequelize.define(
    "normatives",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: "Nombre de la normativa",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Descripción de la normativa",
      },
      effective_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: "Fecha de vigencia de la normativa",
      },
      expiration_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: "Fecha de expiración (NULL si está vigente)",
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: "Si la normativa está activa",
      },
      
      // Valores legales
      minimum_wage: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: "Salario mínimo legal",
      },
      transportation_assistance: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: "Auxilio de transporte",
      },
      workday_hours: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: false,
        defaultValue: 8.0,
        comment: "Horas de jornada laboral",
      },
      hourly_rate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: "Valor hora laboral",
      },
      
      // Límites de horas
      max_overtime_hours_daily: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 2,
        comment: "Máximo horas extras diarias",
      },
      max_overtime_hours_weekly: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 12,
        comment: "Máximo horas extras semanales",
      },
      max_daily_hours: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 8,
        comment: "Máximo horas diarias",
      },
      max_weekly_hours: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 48,
        comment: "Máximo horas semanales",
      },
      
      // Porcentajes de recargos
      overtime_rate: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: false,
        defaultValue: 1.25,
        comment: "Recargo horas extras (25%)",
      },
      night_shift_rate: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: false,
        defaultValue: 1.35,
        comment: "Recargo trabajo nocturno (35%)",
      },
      holiday_rate: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: false,
        defaultValue: 1.75,
        comment: "Recargo festivos (75%)",
      },
      sunday_rate: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: false,
        defaultValue: 1.75,
        comment: "Recargo dominical (75%)",
      },
      
      // Prestaciones sociales
      prima_legal_percentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 8.33,
        comment: "Prima legal (8.33%)",
      },
      cesantias_legal_percentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 8.33,
        comment: "Cesantías legales (8.33%)",
      },
      intereses_cesantias_percentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 12.00,
        comment: "Intereses cesantías (12%)",
      },
      vacations_legal_days: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 15,
        comment: "Días de vacaciones legales",
      },
      
      // Aportes parafiscales
      health_contribution_percentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 4.00,
        comment: "Aporte salud (4%)",
      },
      pension_contribution_percentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 4.00,
        comment: "Aporte pensión (4%)",
      },
      solidarity_pension_fund_percentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 1.00,
        comment: "Fondo solidaridad pensional (1%)",
      },
      arl_contribution_percentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0.522,
        comment: "ARL (varía según riesgo)",
      },
      sena_contribution_percentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 2.00,
        comment: "SENA (2%)",
      },
      icbf_contribution_percentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 3.00,
        comment: "ICBF (3%)",
      },
      ccf_contribution_percentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 4.00,
        comment: "Caja compensación familiar (4%)",
      },
      
      // Metadatos
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
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "ID del usuario que creó la normativa",
      },
      updated_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "ID del usuario que actualizó la normativa",
      },
    },
    {
      tableName: "normatives",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return NormativesModel;
};


