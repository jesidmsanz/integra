"use strict";
const { Op, QueryTypes } = require("sequelize");

module.exports = function setupLiquidationNews(Model, db, sequelize) {
  // Obtener todas las novedades de liquidación
  function findAll(options = {}) {
    return Model.findAll({
      ...options,
      include: [
        {
          model: db.EmployeeNews,
          as: "employeeNews",
          attributes: ["id", "status", "approved", "document"],
        },
        {
          model: db.TypeNews,
          as: "typeNews",
          attributes: [
            "id",
            "name",
            "percentage",
            "calculateperhour",
            "affects",
          ],
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
          model: db.EmployeeNews,
          as: "employeeNews",
          attributes: ["id", "status", "approved", "document"],
        },
        {
          model: db.TypeNews,
          as: "typeNews",
          attributes: [
            "id",
            "name",
            "percentage",
            "calculateperhour",
            "affects",
          ],
        },
      ],
    });
  }

  // Buscar por liquidation_detail_id
  function findByLiquidationDetailId(liquidationDetailId) {
    return Model.findAll({
      where: { liquidation_detail_id: liquidationDetailId },
      include: [
        {
          model: db.EmployeeNews,
          as: "employeeNews",
          attributes: ["id", "status", "approved", "document"],
        },
        {
          model: db.TypeNews,
          as: "typeNews",
          attributes: [
            "id",
            "name",
            "percentage",
            "calculateperhour",
            "affects",
          ],
        },
      ],
      order: [["typeNews", "name", "ASC"]],
    });
  }

  // Crear nueva novedad de liquidación
  async function create(form) {
    try {
      const liquidationNews = await Model.create(form);
      return liquidationNews;
    } catch (error) {
      throw new Error(
        `Error al crear novedad de liquidación: ${error.message}`
      );
    }
  }

  // Crear múltiples novedades
  async function createMultiple(news) {
    try {
      const liquidationNews = await Model.bulkCreate(news, {
        validate: true,
        returning: true,
      });
      return liquidationNews;
    } catch (error) {
      throw new Error(
        `Error al crear novedades de liquidación: ${error.message}`
      );
    }
  }

  // Actualizar novedad
  async function update(id, model) {
    try {
      const [updatedRowsCount] = await Model.update(model, {
        where: { id },
      });

      if (updatedRowsCount === 0) {
        throw new Error("Novedad de liquidación no encontrada");
      }

      return await findById(id);
    } catch (error) {
      throw new Error(
        `Error al actualizar novedad de liquidación: ${error.message}`
      );
    }
  }

  // Eliminar novedad
  function deleteById(id) {
    return Model.destroy({
      where: { id },
    });
  }

  // Eliminar por liquidation_detail_id
  function deleteByLiquidationDetailId(liquidationDetailId) {
    return Model.destroy({
      where: { liquidation_detail_id: liquidationDetailId },
    });
  }

  // Obtener resumen por tipo de novedad
  function getNewsSummaryByType(liquidationId) {
    return sequelize.query(
      `
      SELECT 
        tn.id as type_news_id,
        tn.name as type_news_name,
        tn.percentage,
        tn.calculateperhour,
        COUNT(ln.id) as total_applications,
        SUM(ln.amount) as total_amount,
        SUM(ln.hours) as total_hours,
        SUM(ln.days) as total_days
      FROM liquidation_news ln
      INNER JOIN liquidation_details ld ON ln.liquidation_detail_id = ld.id
      INNER JOIN type_news tn ON ln.type_news_id = tn.id
      WHERE ld.liquidation_id = :liquidationId
      GROUP BY tn.id, tn.name, tn.percentage, tn.calculateperhour
      ORDER BY tn.name
      `,
      {
        replacements: { liquidationId },
        type: QueryTypes.SELECT,
      }
    );
  }

  // Obtener novedades por empleado en una liquidación
  function getNewsByEmployeeInLiquidation(liquidationId, employeeId) {
    return sequelize.query(
      `
      SELECT 
        ln.*,
        tn.name as type_news_name,
        tn.percentage,
        tn.calculateperhour,
        en.status as employee_news_status,
        en.approved as employee_news_approved
      FROM liquidation_news ln
      INNER JOIN liquidation_details ld ON ln.liquidation_detail_id = ld.id
      INNER JOIN type_news tn ON ln.type_news_id = tn.id
      INNER JOIN employee_news en ON ln.employee_news_id = en.id
      WHERE ld.liquidation_id = :liquidationId 
        AND ld.employee_id = :employeeId
      ORDER BY tn.name
      `,
      {
        replacements: { liquidationId, employeeId },
        type: QueryTypes.SELECT,
      }
    );
  }

  return {
    findAll,
    count,
    findById,
    findByLiquidationDetailId,
    create,
    createMultiple,
    update,
    deleteById,
    deleteByLiquidationDetailId,
    getNewsSummaryByType,
    getNewsByEmployeeInLiquidation,
  };
};
