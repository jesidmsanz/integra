"use strict";
const { Op, QueryTypes } = require("sequelize");

module.exports = function setupLiquidationNewsTracking(Model, db, sequelize) {
  
  // Crear registro de trazabilidad
  async function create(trackingData) {
    try {
      const result = await Model.create(trackingData);
      return result.toJSON();
    } catch (error) {
      console.error("Error creating liquidation news tracking:", error);
      throw error;
    }
  }

  // Obtener trazabilidad por liquidación
  function findByLiquidationId(liquidationId) {
    return sequelize.query(
      `
      SELECT 
        lnt.*,
        en."startDate",
        en."endDate",
        e.fullname as employee_name,
        e.documentnumber as employee_document,
        tn.name as type_news_name,
        tn.code as type_news_code
      FROM liquidation_news_tracking lnt
      INNER JOIN employee_news en ON lnt.employee_news_id = en.id
      INNER JOIN employees e ON en."employeeId" = e.id
      INNER JOIN type_news tn ON en."typeNewsId" = tn.id
      WHERE lnt.liquidation_id = :liquidationId
      ORDER BY lnt.created_at DESC
      `,
      {
        replacements: { liquidationId },
        type: QueryTypes.SELECT,
      }
    );
  }

  // Obtener trazabilidad por novedad de empleado
  function findByEmployeeNewsId(employeeNewsId) {
    return sequelize.query(
      `
      SELECT 
        lnt.*,
        l.id as liquidation_id,
        l.period,
        l.status as liquidation_status,
        c.companyname
      FROM liquidation_news_tracking lnt
      INNER JOIN liquidations l ON lnt.liquidation_id = l.id
      INNER JOIN companies c ON l.company_id = c.id
      WHERE lnt.employee_news_id = :employeeNewsId
      ORDER BY lnt.created_at DESC
      `,
      {
        replacements: { employeeNewsId },
        type: QueryTypes.SELECT,
      }
    );
  }

  // Obtener estadísticas de trazabilidad
  function getTrackingStats(companyId = null, startDate = null, endDate = null) {
    let whereClause = "WHERE 1=1";
    const replacements = {};

    if (companyId) {
      whereClause += " AND l.company_id = :companyId";
      replacements.companyId = companyId;
    }

    if (startDate) {
      whereClause += " AND l.period_start >= :startDate";
      replacements.startDate = startDate;
    }

    if (endDate) {
      whereClause += " AND l.period_end <= :endDate";
      replacements.endDate = endDate;
    }

    return sequelize.query(
      `
      SELECT 
        lnt.status,
        COUNT(*) as count,
        COUNT(DISTINCT lnt.employee_news_id) as unique_news,
        COUNT(DISTINCT lnt.liquidation_id) as unique_liquidations
      FROM liquidation_news_tracking lnt
      INNER JOIN liquidations l ON lnt.liquidation_id = l.id
      ${whereClause}
      GROUP BY lnt.status
      ORDER BY lnt.status
      `,
      {
        replacements,
        type: QueryTypes.SELECT,
      }
    );
  }

  // Obtener novedades incluidas en una liquidación
  function getIncludedNews(liquidationId) {
    return sequelize.query(
      `
      SELECT 
        lnt.employee_news_id,
        en."startDate",
        en."endDate",
        e.fullname as employee_name,
        e.documentnumber as employee_document,
        tn.name as type_news_name,
        tn.code as type_news_code,
        lnt.status as tracking_status,
        lnt.created_at as included_at
      FROM liquidation_news_tracking lnt
      INNER JOIN employee_news en ON lnt.employee_news_id = en.id
      INNER JOIN employees e ON en."employeeId" = e.id
      INNER JOIN type_news tn ON en."typeNewsId" = tn.id
      WHERE lnt.liquidation_id = :liquidationId
        AND lnt.status = 'included'
      ORDER BY e.fullname, en."startDate"
      `,
      {
        replacements: { liquidationId },
        type: QueryTypes.SELECT,
      }
    );
  }

  // Obtener novedades excluidas de una liquidación
  function getExcludedNews(liquidationId) {
    return sequelize.query(
      `
      SELECT 
        lnt.employee_news_id,
        en."startDate",
        en."endDate",
        e.fullname as employee_name,
        e.documentnumber as employee_document,
        tn.name as type_news_name,
        tn.code as type_news_code,
        lnt.notes as exclusion_reason,
        lnt.created_at as excluded_at
      FROM liquidation_news_tracking lnt
      INNER JOIN employee_news en ON lnt.employee_news_id = en.id
      INNER JOIN employees e ON en."employeeId" = e.id
      INNER JOIN type_news tn ON en."typeNewsId" = tn.id
      WHERE lnt.liquidation_id = :liquidationId
        AND lnt.status = 'excluded'
      ORDER BY e.fullname, en."startDate"
      `,
      {
        replacements: { liquidationId },
        type: QueryTypes.SELECT,
      }
    );
  }

  // Eliminar trazabilidad por liquidación (para cuando se elimina una liquidación)
  function deleteByLiquidationId(liquidationId) {
    return Model.destroy({
      where: { liquidation_id: liquidationId },
    });
  }

  // Eliminar trazabilidad por novedad de empleado
  function deleteByEmployeeNewsId(employeeNewsId) {
    return Model.destroy({
      where: { employee_news_id: employeeNewsId },
    });
  }

  // Actualizar estado de trazabilidad
  async function updateStatus(id, status, notes = null) {
    try {
      const updateData = { status };
      if (notes) {
        updateData.notes = notes;
      }
      
      const result = await Model.update(updateData, {
        where: { id },
        returning: true,
      });
      
      return result[1][0]; // Retorna el registro actualizado
    } catch (error) {
      console.error("Error updating liquidation news tracking status:", error);
      throw error;
    }
  }

  return {
    create,
    findByLiquidationId,
    findByEmployeeNewsId,
    getTrackingStats,
    getIncludedNews,
    getExcludedNews,
    deleteByLiquidationId,
    deleteByEmployeeNewsId,
    updateStatus,
  };
};
