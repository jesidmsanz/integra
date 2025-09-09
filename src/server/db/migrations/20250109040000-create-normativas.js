'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('normativas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: 'Nombre de la normativa (ej: Salario Mínimo 2025)'
      },
      tipo: {
        type: Sequelize.ENUM('salario_minimo', 'auxilio_transporte', 'hora_extra', 'recargo_nocturno', 'recargo_domingo', 'vacaciones', 'cesantias', 'prima', 'otro'),
        allowNull: false,
        comment: 'Tipo de normativa'
      },
      valor: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Valor de la normativa'
      },
      unidad: {
        type: Sequelize.ENUM('pesos', 'porcentaje', 'horas', 'dias'),
        allowNull: false,
        defaultValue: 'pesos',
        comment: 'Unidad del valor (pesos, porcentaje, horas, días)'
      },
      vigencia_desde: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        comment: 'Fecha desde cuando es vigente'
      },
      vigencia_hasta: {
        type: Sequelize.DATEONLY,
        allowNull: true,
        comment: 'Fecha hasta cuando es vigente (null = vigente indefinidamente)'
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Descripción detallada de la normativa'
      },
      activa: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Si la normativa está activa'
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        comment: 'Usuario que creó la normativa'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Agregar índices para mejorar el rendimiento
    await queryInterface.addIndex('normativas', ['tipo']);
    await queryInterface.addIndex('normativas', ['activa']);
    await queryInterface.addIndex('normativas', ['vigencia_desde', 'vigencia_hasta']);
    await queryInterface.addIndex('normativas', ['created_by']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('normativas');
  }
};
