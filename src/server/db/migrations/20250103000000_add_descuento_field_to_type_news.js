'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('type_news', 'isDiscount', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Si es true, la novedad descuenta; si es false, suma'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('type_news', 'isDiscount');
  }
};
