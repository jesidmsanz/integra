const db = require("../../db/index.js");
const { Op, QueryTypes } = require("sequelize");

// Función para validar que el período no esté ya liquidado
async function validatePeriodNotLiquidated(companyId, startDate, endDate) {
  const { sequelize } = await db();
  
  // Validar que las fechas existan
  if (!startDate || !endDate) {
    console.error('❌ Fechas faltantes:', { startDate, endDate });
    throw new Error('Las fechas de inicio y fin son requeridas');
  }
  
  console.log('🔍 Validando período:', { companyId, startDate, endDate });
  
  // Verificar si ya existe una liquidación que se solape con el período seleccionado
  // Esto permite múltiples liquidaciones por mes (ej: quincenas) pero evita solapamientos
  const existing = await sequelize.query(
    `SELECT id, period, created_at FROM liquidations 
     WHERE company_id = :companyId 
     AND status != 'cancelled'`,
    {
      replacements: { companyId },
      type: QueryTypes.SELECT,
    }
  );
  
  // Por ahora, permitimos múltiples liquidaciones por mes
  // Solo mostramos un warning si hay muchas liquidaciones en el mismo mes
  const sameMonthLiquidations = existing.filter(liq => 
    liq.period === startDate.substring(0, 7)
  );
  
  if (sameMonthLiquidations.length >= 2) {
    console.log('⚠️ Ya existen múltiples liquidaciones en el mismo mes:', sameMonthLiquidations);
    // No bloqueamos, solo advertimos
  }
  
  console.log('✅ Período validado correctamente');
}

function list(page = 1, limit = 30, status, company_id) {
  return new Promise(async (resolve, reject) => {
    try {
      const { Liquidations } = await db();
      const result = await Liquidations.findAllWithNames();
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

function getById(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const { Liquidations } = await db();
      const result = await Liquidations.findByIdWithNames(id);
      if (!result || result.length === 0) {
        reject({
          success: false,
          message: "Liquidación no encontrada",
        });
        return;
      }
      resolve(result[0]);
    } catch (error) {
      reject(error);
    }
  });
}

function create(liquidationData) {
  return new Promise(async (resolve, reject) => {
    try {
      const { Liquidations, LiquidationDetails, LiquidationNews, LiquidationNewsTracking, sequelize } = await db();

      console.log('📝 Datos de liquidación recibidos:', {
        company_id: liquidationData.company_id,
        startDate: liquidationData.startDate,
        endDate: liquidationData.endDate,
        hasEmployees: !!liquidationData.employees_data,
        employeeCount: liquidationData.employees_data?.length
      });

      // Validar datos
      if (!liquidationData.company_id || !liquidationData.employees_data) {
        reject({
          success: false,
          message: "Datos de liquidación incompletos",
        });
        return;
      }

      // Validar que el período no esté ya liquidado
      await validatePeriodNotLiquidated(
        liquidationData.company_id,
        liquidationData.startDate,
        liquidationData.endDate
      );

      // Calcular totales
      const employees = liquidationData.employees_data;
      const totalEmployees = employees.length;

      const toDecimal = (value) => {
        if (value === null || value === undefined || value === "") return 0;
        let cleanValue = value;
        if (typeof value === "string") {
          cleanValue = value.replace(/[^\d.,-]/g, "").replace(",", ".");
        }
        const num = parseFloat(cleanValue);
        return isNaN(num) ? 0 : Math.round(num * 100) / 100;
      };

      const totalBasicSalary = employees.reduce((sum, emp) => sum + toDecimal(emp.basic_salary), 0);
      const totalTransportationAssistance = employees.reduce((sum, emp) => sum + toDecimal(emp.transportation_assistance), 0);
      const totalNovedades = employees.reduce((sum, emp) => sum + toDecimal(emp.total_novedades), 0);
      const totalDiscounts = employees.reduce((sum, emp) => sum + toDecimal(emp.total_discounts), 0);
      const totalNetAmount = employees.reduce((sum, emp) => sum + toDecimal(emp.net_amount), 0);

      // Crear liquidación principal
      const liquidationRecord = await Liquidations.create({
        company_id: liquidationData.company_id,
        user_id: liquidationData.user_id || 1,
        period: liquidationData.startDate.substring(0, 7),
        start_date: liquidationData.startDate,
        end_date: liquidationData.endDate,
        payment_frequency: liquidationData.payment_frequency || "Mensual",
        cut_number: liquidationData.cut_number || null,
        status: "draft",
        total_employees: totalEmployees,
        total_basic_salary: totalBasicSalary,
        total_transportation_assistance: totalTransportationAssistance,
        total_mobility_assistance: 0,
        total_novedades: totalNovedades,
        total_discounts: totalDiscounts,
        total_net_amount: totalNetAmount,
        notes: liquidationData.notes || "",
      });

      // Crear detalles de liquidación para cada empleado
      for (const employee of employees) {
        const detail = await LiquidationDetails.create({
          liquidation_id: liquidationRecord.id,
          employee_id: employee.employee_id,
          basic_salary: toDecimal(employee.basic_salary),
          transportation_assistance: toDecimal(employee.transportation_assistance),
          mobility_assistance: toDecimal(employee.mobility_assistance),
          total_novedades: toDecimal(employee.total_novedades),
          total_discounts: toDecimal(employee.total_discounts),
          health_discount: toDecimal(employee.health_discount),
          pension_discount: toDecimal(employee.pension_discount),
          social_security_discounts: toDecimal(employee.social_security_discounts),
          absence_discounts: toDecimal(employee.absence_discounts),
          proportional_discounts: toDecimal(employee.proportional_discounts),
          net_amount: toDecimal(employee.net_amount),
        });

        // Crear novedades para cada empleado y registrar trazabilidad
        const employeeNewsIds = [];
        for (const news of employee.news_data || []) {
          const liquidationNews = await LiquidationNews.create({
            liquidation_detail_id: detail.id,
            employee_news_id: news.employee_news_id,
            type_news_id: news.type_news_id,
            hours: toDecimal(news.hours),
            days: toDecimal(news.days),
            amount: toDecimal(news.amount),
          });

          // Crear registro de trazabilidad
          await LiquidationNewsTracking.create({
            employee_news_id: news.employee_news_id,
            liquidation_id: liquidationRecord.id,
            liquidation_detail_id: detail.id,
            status: 'included'
          });

          employeeNewsIds.push(news.employee_news_id);
        }

        // Marcar novedades como liquidadas e inactivas
        if (employeeNewsIds.length > 0) {
          await sequelize.query(
            `UPDATE employee_news 
             SET liquidation_status = 'liquidated', active = false 
             WHERE id IN (${employeeNewsIds.join(',')})`,
            { type: QueryTypes.UPDATE }
          );
        }
      }

      resolve({
        success: true,
        data: liquidationRecord,
        message: "Liquidación creada exitosamente",
      });
    } catch (error) {
      reject(error);
    }
  });
}

function update(id, updateData) {
  return new Promise(async (resolve, reject) => {
    try {
      const { Liquidations } = await db();
      const liquidation = await Liquidations.findById(id);
      if (!liquidation || liquidation.length === 0) {
        reject({
          success: false,
          message: "Liquidación no encontrada",
        });
        return;
      }

      const allowedFields = ["notes", "status"];
      const updateFields = {};
      for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
          updateFields[field] = updateData[field];
        }
      }

      await Liquidations.update(id, updateFields);
      const updatedLiquidation = await Liquidations.findById(id);

      resolve({
        success: true,
        data: updatedLiquidation[0] || updatedLiquidation,
        message: "Liquidación actualizada exitosamente",
      });
    } catch (error) {
      reject(error);
    }
  });
}

function approve(id, approvedBy) {
  return new Promise(async (resolve, reject) => {
    try {
      const { Liquidations } = await db();
      const liquidation = await Liquidations.findById(id);
      if (!liquidation || liquidation.length === 0) {
        reject({
          success: false,
          message: "Liquidación no encontrada",
        });
        return;
      }

      const liquidationData = liquidation[0];
      if (liquidationData.status !== "draft") {
        reject({
          success: false,
          message: "Solo se pueden aprobar liquidaciones en estado borrador",
        });
        return;
      }

      let approverId;
      if (typeof approvedBy === 'object' && approvedBy !== null) {
        approverId = approvedBy.id || approvedBy.userId || approvedBy.approved_by || approvedBy.user_id;
      } else {
        approverId = approvedBy;
      }

      // Validar que el ID del aprobador sea válido
      const validApproverId = parseInt(approverId);
      if (isNaN(validApproverId) || validApproverId <= 0) {
        console.log("❌ ID de aprobador inválido:", approverId);
        reject({
          success: false,
          message: "ID de usuario aprobador inválido",
        });
        return;
      }

      console.log("🔄 Actualizando liquidación ID:", id, "con datos:", {
        status: "approved",
        approved_at: new Date(),
        approved_by: validApproverId,
      });

      await Liquidations.update(id, {
        status: "approved",
        approved_at: new Date(),
        approved_by: validApproverId,
      });

      const updatedLiquidation = await Liquidations.findById(id);

      resolve({
        success: true,
        data: updatedLiquidation[0] || updatedLiquidation,
        message: "Liquidación aprobada exitosamente",
      });
    } catch (error) {
      reject(error);
    }
  });
}

function markAsPaid(id, paidBy) {
  return new Promise(async (resolve, reject) => {
    try {
      const { Liquidations } = await db();
      const liquidation = await Liquidations.findById(id);
      if (!liquidation) {
        reject({
          success: false,
          message: "Liquidación no encontrada",
        });
        return;
      }

      if (liquidation.status !== "approved") {
        reject({
          success: false,
          message: "Solo se pueden marcar como pagadas las liquidaciones aprobadas",
        });
        return;
      }

      await Liquidations.update(id, {
        status: "paid",
        paid_at: new Date(),
        paid_by: paidBy,
      });

      const updatedLiquidation = await Liquidations.findById(id);

      resolve({
        success: true,
        data: updatedLiquidation,
        message: "Liquidación marcada como pagada exitosamente",
      });
    } catch (error) {
      reject(error);
    }
  });
}

function deleteById(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const { Liquidations, LiquidationDetails, LiquidationNews, LiquidationNewsTracking, sequelize } = await db();
      
      console.log("🔄 Eliminando liquidación ID:", id);
      
      const liquidation = await Liquidations.findById(id);
      if (!liquidation) {
        reject({
          success: false,
          message: "Liquidación no encontrada",
        });
        return;
      }

      if (liquidation.status === "paid") {
        reject({
          success: false,
          message: "No se pueden eliminar liquidaciones que ya han sido pagadas",
        });
        return;
      }

      // Obtener novedades que se van a restaurar
      const newsToRestore = await sequelize.query(
        `SELECT ln.employee_news_id 
         FROM liquidation_news ln
         JOIN liquidation_details ld ON ln.liquidation_detail_id = ld.id
         WHERE ld.liquidation_id = :liquidationId`,
        {
          replacements: { liquidationId: id },
          type: QueryTypes.SELECT
        }
      );

      // Eliminar en cascada: primero liquidation_news_tracking, luego liquidation_news, luego liquidation_details, finalmente liquidations
      console.log("🗑️ Eliminando registros relacionados...");
      
      // 1. Eliminar registros de trazabilidad
      await LiquidationNewsTracking.deleteByLiquidationId(id);
      
      // 2. Eliminar liquidation_news relacionados usando SQL directo
      await sequelize.query(
        `DELETE FROM liquidation_news WHERE liquidation_detail_id IN (
          SELECT id FROM liquidation_details WHERE liquidation_id = :liquidationId
        )`,
        {
          replacements: { liquidationId: id },
          type: QueryTypes.DELETE
        }
      );
      
      // 3. Eliminar liquidation_details relacionados
      await sequelize.query(
        'DELETE FROM liquidation_details WHERE liquidation_id = :liquidationId',
        {
          replacements: { liquidationId: id },
          type: QueryTypes.DELETE
        }
      );
      
      // 4. Restaurar novedades a pendientes y activas
      if (newsToRestore.length > 0) {
        const employeeNewsIds = newsToRestore.map(n => n.employee_news_id);
        await sequelize.query(
          `UPDATE employee_news 
           SET liquidation_status = 'pending', active = true 
           WHERE id IN (${employeeNewsIds.join(',')})`,
          { type: QueryTypes.UPDATE }
        );
        console.log("🔄 Restauradas", employeeNewsIds.length, "novedades a pendientes y activas");
      }
      
      // 5. Finalmente eliminar la liquidación
      await Liquidations.deleteById(id);
      
      console.log("✅ Liquidación eliminada exitosamente");

      resolve({
        success: true,
        message: "Liquidación eliminada exitosamente",
      });
    } catch (error) {
      console.error("❌ Error al eliminar liquidación:", error);
      reject(error);
    }
  });
}

function generatePDF(id, employeeId = null) {
  return new Promise(async (resolve, reject) => {
    try {
      const { Liquidations } = await db();
      const result = await Liquidations.findByIdWithNames(id);
      if (!result || result.length === 0) {
        reject({
          success: false,
          message: "Liquidación no encontrada",
        });
        return;
      }

      const liquidation = result[0];
      const pdfGenerator = require("../../services/pdfGenerator");

      let pdfResult;
      if (employeeId) {
        const employee = liquidation.liquidation_details?.find(
          (detail) => detail.employee_id === parseInt(employeeId)
        );
        if (!employee) {
          reject({
            success: false,
            message: "Empleado no encontrado en la liquidación",
          });
          return;
        }
        pdfResult = await pdfGenerator.generateEmployeePDF(liquidation, employee);
      } else {
        pdfResult = await pdfGenerator.generateLiquidationPDF(liquidation);
      }

      resolve({
        success: true,
        data: pdfResult,
        message: "PDF generado exitosamente",
      });
    } catch (error) {
      reject(error);
    }
  });
}

function sendBulkEmails(liquidationId, employees) {
  return new Promise(async (resolve, reject) => {
    try {
      const emailService = require("../../services/emailService");
      const { Liquidations } = await db();
      const result = await Liquidations.findByIdWithNames(liquidationId);
      
      if (!result || result.length === 0) {
        reject({
          success: false,
          message: "Liquidación no encontrada",
        });
        return;
      }

      const liquidation = result[0];
      const liquidationData = {
        id: liquidation.id,
        period: liquidation.period,
        company_name: liquidation.company_name || "PROFESIONALES DE ASEO DE COLOMBIA SAS"
      };

      const results = await emailService.sendBulkPayrollStubs(employees, liquidationData);
      
      resolve({
        success: true,
        data: results,
        message: "Correos enviados exitosamente",
      });
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  list,
  getById,
  create,
  update,
  approve,
  markAsPaid,
  deleteById,
  generatePDF,
  sendBulkEmails,
};