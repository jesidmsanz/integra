"use strict";
const { Op, QueryTypes } = require("sequelize");

module.exports = function setupLiquidationDetails(Model, db, sequelize) {
  // Obtener todos los detalles de liquidación
  function findAll(options = {}) {
    return Model.findAll({
      ...options,
      include: [
        {
          model: db.Employees,
          as: "employee",
          attributes: ["id", "firstname", "lastname", "document", "position"],
        },
      ],
    });
  }

  // Contar registros
  function count() {
    return Model.count();
  }

  // Buscar por ID
  function findById(id) {
    return Model.findByPk(id, {
      include: [
        {
          model: db.Employees,
          as: "employee",
          attributes: ["id", "firstname", "lastname", "document", "position"],
        },
      ],
    });
  }

  // Buscar por liquidation_id
  function findByLiquidationId(liquidationId) {
    return Model.findAll({
      where: { liquidation_id: liquidationId },
      include: [
        {
          model: db.Employees,
          as: "employee",
          attributes: ["id", "firstname", "lastname", "document", "position"],
        },
      ],
      order: [["employee", "firstname", "ASC"]],
    });
  }

  // Crear nuevo detalle
  async function create(form) {
    try {
      const liquidationDetail = await Model.create(form);
      return liquidationDetail;
    } catch (error) {
      throw new Error(
        `Error al crear detalle de liquidación: ${error.message}`
      );
    }
  }

  // Crear múltiples detalles
  async function createMultiple(details) {
    try {
      const liquidationDetails = await Model.bulkCreate(details, {
        validate: true,
        returning: true,
      });
      return liquidationDetails;
    } catch (error) {
      throw new Error(
        `Error al crear detalles de liquidación: ${error.message}`
      );
    }
  }

  // Actualizar detalle
  async function update(id, model) {
    try {
      const [updatedRowsCount] = await Model.update(model, {
        where: { id },
      });

      if (updatedRowsCount === 0) {
        throw new Error("Detalle de liquidación no encontrado");
      }

      return await findById(id);
    } catch (error) {
      throw new Error(
        `Error al actualizar detalle de liquidación: ${error.message}`
      );
    }
  }

  // Eliminar detalle
  function deleteById(id) {
    return Model.destroy({
      where: { id },
    });
  }

  // Eliminar por liquidation_id
  function deleteByLiquidationId(liquidationId) {
    return Model.destroy({
      where: { liquidation_id: liquidationId },
    });
  }

  // Obtener resumen de liquidación
  function getLiquidationSummary(liquidationId) {
    return sequelize.query(
      `
      SELECT 
        COUNT(*) as total_employees,
        SUM(basic_salary) as total_basic_salary,
        SUM(transportation_assistance) as total_transportation,
        SUM(mobility_assistance) as total_mobility,
        SUM(total_novedades) as total_novedades,
        SUM(total_discounts) as total_discounts,
        SUM(net_amount) as total_net_amount
      FROM liquidation_details 
      WHERE liquidation_id = :liquidationId
      `,
      {
        replacements: { liquidationId },
        type: QueryTypes.SELECT,
      }
    );
  }

  return {
    findAll,
    count,
    findById,
    findByLiquidationId,
    create,
    createMultiple,
    update,
    deleteById,
    deleteByLiquidationId,
    getLiquidationSummary,
  };
};
