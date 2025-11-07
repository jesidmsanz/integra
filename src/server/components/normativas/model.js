const { DataTypes } = require('sequelize');

const setupNormativasModel = (sequelize) => {
  const Normativas = sequelize.define('Normativas', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Nombre de la normativa (ej: Salario Mínimo 2025)'
    },
    tipo: {
      type: DataTypes.ENUM(
        'salario_minimo',
        'auxilio_transporte', 
        'hora_extra',
        'recargo_nocturno',
        'recargo_domingo',
        'vacaciones',
        'cesantias',
        'prima',
        'horas_base_mensuales',
        'tipo_hora_laboral',
        'otro'
      ),
      allowNull: false,
      comment: 'Tipo de normativa'
    },
    valor: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      comment: 'Valor de la normativa'
    },
    unidad: {
      type: DataTypes.ENUM('pesos', 'porcentaje', 'horas', 'dias'),
      allowNull: false,
      defaultValue: 'pesos',
      comment: 'Unidad del valor (pesos, porcentaje, horas, días)'
    },
    vigencia_desde: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: 'Fecha desde cuando es vigente'
    },
    vigencia_hasta: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Fecha hasta cuando es vigente (null = vigente indefinidamente)'
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Descripción detallada de la normativa'
    },
    activa: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Si la normativa está activa'
    },
    multiplicador: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: true,
      comment: 'Multiplicador para calcular el valor (ej: 1.25 para hora extra diurna)'
    },
    codigo: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Código único para identificar el tipo de hora (ej: HED, HEN, RNO)'
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      comment: 'Usuario que creó la normativa'
    }
  }, {
    tableName: 'normativas',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['tipo']
      },
      {
        fields: ['activa']
      },
      {
        fields: ['vigencia_desde', 'vigencia_hasta']
      },
      {
        fields: ['created_by']
      }
    ]
  });

  return Normativas;
};

module.exports = setupNormativasModel;
