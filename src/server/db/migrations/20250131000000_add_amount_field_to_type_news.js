'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('type_news', 'amount', {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: true,
      comment: 'Cantidad fija de la novedad (alternativa a porcentaje)'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('type_news', 'amount');
  }
};

