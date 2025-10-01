'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('liquidation_details', 'health_discount', {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Descuento de salud (4%)'
    });

    await queryInterface.addColumn('liquidation_details', 'pension_discount', {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Descuento de pensión (4%)'
    });

    await queryInterface.addColumn('liquidation_details', 'social_security_discounts', {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Total descuentos de seguridad social (salud + pensión)'
    });

    await queryInterface.addColumn('liquidation_details', 'absence_discounts', {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Descuentos por ausentismo'
    });

    await queryInterface.addColumn('liquidation_details', 'proportional_discounts', {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'Descuentos proporcionales por novedades'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('liquidation_details', 'health_discount');
    await queryInterface.removeColumn('liquidation_details', 'pension_discount');
    await queryInterface.removeColumn('liquidation_details', 'social_security_discounts');
    await queryInterface.removeColumn('liquidation_details', 'absence_discounts');
    await queryInterface.removeColumn('liquidation_details', 'proportional_discounts');
  }
};

