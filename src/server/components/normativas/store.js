"use strict";
const { Op, QueryTypes } = require("sequelize");

module.exports = function setupNormativas(Model, db, sequelize) {
  function findAll(filters = {}) {
    const whereClause = {};
    
    // Filtro por tipo
    if (filters.tipo) {
      whereClause.tipo = filters.tipo;
    }
    
    // Filtro por activa
    if (filters.activa !== undefined && filters.activa !== '') {
      whereClause.activa = filters.activa === 'true';
    }
    
    // Filtro por búsqueda en nombre
    if (filters.search) {
      whereClause.nombre = {
        [Op.iLike]: `%${filters.search}%`
      };
    }

    return Model.findAll({
      where: whereClause,
      order: [
        ['vigencia_desde', 'DESC'],
        ['created_at', 'DESC']
      ]
    });
  }

  function findById(id) {
    return Model.findByPk(id);
  }

  async function create(model) {
    const result = await Model.create(model);
    return result;
  }

  async function update(_id, model) {
    const result = await Model.update(model, {
      where: { id: _id }
    });
    return result[0] > 0 ? Model.findByPk(_id) : false;
  }

  function deleteById(id) {
    return Model.update(
      { activa: false },
      { where: { id } }
    );
  }

  function getVigentes(fecha = new Date()) {
    const fechaStr = fecha instanceof Date ? fecha.toISOString().split('T')[0] : fecha;
    
    return Model.findAll({
      where: {
        activa: true,
        vigencia_desde: {
          [Op.lte]: fechaStr
        },
        [Op.or]: [
          { vigencia_hasta: null },
          { vigencia_hasta: { [Op.gte]: fechaStr } }
        ]
      },
      order: [
        ['tipo', 'ASC'],
        ['vigencia_desde', 'DESC']
      ]
    });
  }

  function getVigenteByTipo(tipo, fecha = new Date()) {
    const fechaStr = fecha instanceof Date ? fecha.toISOString().split('T')[0] : fecha;
    
    return Model.findOne({
      where: {
        tipo: tipo,
        activa: true,
        vigencia_desde: {
          [Op.lte]: fechaStr
        },
        [Op.or]: [
          { vigencia_hasta: null },
          { vigencia_hasta: { [Op.gte]: fechaStr } }
        ]
      },
      order: [['vigencia_desde', 'DESC']]
    });
  }

  return {
    findAll,
    findById,
    create,
    update,
    deleteById,
    getVigentes,
    getVigenteByTipo
  };
};