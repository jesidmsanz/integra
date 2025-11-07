"use strict";
const { Op, QueryTypes } = require("sequelize");

module.exports = function setupCountry(Model, db, sequelize) {
  function findAll() {
    return sequelize.query(
      `
    SELECT 
  en.*,
  CONCAT(u."firstName", ' ', u."lastName") AS approved_by_name,
  tn.name AS type_news_name,
  e.fullname AS employee_name
FROM employee_news en
INNER JOIN users u ON en."approvedBy" = u.id
INNER JOIN type_news tn ON en."typeNewsId" = tn.id
INNER JOIN employees e ON en."employeeId" = e.id
ORDER BY en.id DESC;
    `,
      {
        type: QueryTypes.SELECT,
      }
    );
  }

  async function findAllPaginated(page = 1, limit = 30) {
    const safePage = Number.isFinite(parseInt(page)) && parseInt(page) > 0 ? parseInt(page) : 1;
    const safeLimit = Number.isFinite(parseInt(limit)) && parseInt(limit) > 0 ? parseInt(limit) : 30;
    const offset = (safePage - 1) * safeLimit;

    // Obtener el total de registros
    const totalResult = await sequelize.query(
      `
      SELECT COUNT(*) as total
      FROM employee_news en
      INNER JOIN users u ON en."approvedBy" = u.id
      INNER JOIN type_news tn ON en."typeNewsId" = tn.id
      INNER JOIN employees e ON en."employeeId" = e.id
      `,
      {
        type: QueryTypes.SELECT,
      }
    );
    const total = totalResult[0]?.total || 0;

    // Obtener los datos paginados
    const data = await sequelize.query(
      `
      SELECT 
        en.*,
        CONCAT(u."firstName", ' ', u."lastName") AS approved_by_name,
        tn.name AS type_news_name,
        e.fullname AS employee_name
      FROM employee_news en
      INNER JOIN users u ON en."approvedBy" = u.id
      INNER JOIN type_news tn ON en."typeNewsId" = tn.id
      INNER JOIN employees e ON en."employeeId" = e.id
      ORDER BY en.id DESC
      LIMIT :limit OFFSET :offset
      `,
      {
        replacements: { limit: safeLimit, offset: offset },
        type: QueryTypes.SELECT,
      }
    );

    return {
      data,
      total: parseInt(total),
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    };
  }

  function findAllActive() {
    return sequelize.query(
      ` select * from employee_news where employee_news.status = true`,
      {
        type: QueryTypes.SELECT,
      }
    );
  }

  function findById(id) {
    return Model.findByPk(id);
  }

  async function create(form) {
    try {
      const result = await Model.create(form);
      return result.toJSON();
    } catch (error) {
      console.log("Error to create", error);
      return { error };
    }
  }

  async function update(id, model) {
    try {
      console.log("=== STORE UPDATE DEBUG ===");
      console.log("ID recibido:", id);
      console.log("Model recibido:", model);
      console.log("Model keys:", Object.keys(model));
      console.log("Model values:", Object.values(model));
      
      // Verificar que el registro existe antes de actualizar
      const existingRecord = await Model.findByPk(id);
      console.log("Registro existente antes de actualizar:", existingRecord);
      
      if (!existingRecord) {
        console.log("❌ No se encontró el registro con ID:", id);
        return false;
      }
      
      const cond = {
        where: { id },
      };
      
      console.log("Condición de búsqueda:", cond);
      console.log("Datos a actualizar:", model);
      
      const result = await Model.update(model, cond);
      console.log("Resultado de Model.update:", result);
      console.log("Número de registros afectados:", result[0]);
      
      if (result && result[0] > 0) {
        const updatedRecord = await Model.findByPk(id);
        console.log("✅ Registro actualizado exitosamente:", updatedRecord);
        return updatedRecord;
      } else {
        console.log("❌ No se actualizó ningún registro - posible problema con los datos");
        return false;
      }
    } catch (error) {
      console.error("❌ Error en store.update:", error);
      console.error("Error stack:", error.stack);
      throw error;
    }
  }

  function deleteById(_id) {
    return Model.destroy({
      where: { id: _id },
    });
  }

  function getPendingByPeriod(startDate, endDate, companyId) {
    return sequelize.query(
      `
      SELECT 
        en.*,
        e.fullname AS employee_name,
        e.documentnumber AS employee_document,
        e.position AS employee_position,
        tn.name AS type_news_name,
        tn.code AS type_news_code,
        tn.percentage,
        tn.calculateperhour,
        tn.affects,
        c.companyname
      FROM employee_news en
      INNER JOIN employees e ON en."employeeId" = e.id
      INNER JOIN type_news tn ON en."typeNewsId" = tn.id
      INNER JOIN companies c ON en."companyId" = c.id
      WHERE en.active = true
        AND en.approved = true
        AND en.liquidation_status = 'pending'
        AND en."companyId" = :companyId
        AND DATE(en."startDate") >= :startDate
        AND DATE(en."endDate") <= :endDate
      ORDER BY en.id ASC
      `,
      {
        replacements: { 
          companyId: companyId,
          startDate: startDate,
          endDate: endDate
        },
        type: QueryTypes.SELECT,
      }
    );
  }

  // Nueva función para obtener novedades por estado de liquidación
  function getByLiquidationStatus(status, companyId = null, startDate = null, endDate = null) {
    let whereClause = "WHERE en.liquidation_status = :status";
    const replacements = { status };

    if (companyId) {
      whereClause += " AND en.\"companyId\" = :companyId";
      replacements.companyId = companyId;
    }

    if (startDate) {
      whereClause += " AND DATE(en.\"startDate\") >= :startDate";
      replacements.startDate = startDate;
    }

    if (endDate) {
      whereClause += " AND DATE(en.\"endDate\") <= :endDate";
      replacements.endDate = endDate;
    }

    return sequelize.query(
      `
      SELECT 
        en.*,
        e.fullname AS employee_name,
        e.documentnumber AS employee_document,
        e.position AS employee_position,
        tn.name AS type_news_name,
        tn.code AS type_news_code,
        c.companyname
      FROM employee_news en
      INNER JOIN employees e ON en."employeeId" = e.id
      INNER JOIN type_news tn ON en."typeNewsId" = tn.id
      INNER JOIN companies c ON en."companyId" = c.id
      ${whereClause}
      ORDER BY en.id ASC
      `,
      {
        replacements,
        type: QueryTypes.SELECT,
      }
    );
  }

  // Función para marcar novedades como liquidadas e inactivas
  function markAsLiquidated(employeeNewsIds, liquidationId) {
    return sequelize.query(
      `
      UPDATE employee_news 
      SET liquidation_status = 'liquidated', active = false 
      WHERE id IN (${employeeNewsIds.join(',')})
      `,
      {
        type: QueryTypes.UPDATE,
      }
    );
  }

  // Función para restaurar novedades a pendientes y activas
  function restoreToPending(employeeNewsIds) {
    return sequelize.query(
      `
      UPDATE employee_news 
      SET liquidation_status = 'pending', active = true 
      WHERE id IN (${employeeNewsIds.join(',')})
      `,
      {
        type: QueryTypes.UPDATE,
      }
    );
  }

  return {
    findAll,
    findAllActive,
    findAllPaginated,
    findById,
    create,
    update,
    deleteById,
    getPendingByPeriod,
    getByLiquidationStatus,
    markAsLiquidated,
    restoreToPending,
  };
};
