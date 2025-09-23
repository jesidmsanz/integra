const db = require("../../db/index.js");
const { Op, QueryTypes } = require("sequelize");

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
      const { Liquidations, LiquidationDetails, LiquidationNews } = await db();

      // Validar datos
      if (!liquidationData.company_id || !liquidationData.employees_data) {
        reject({
          success: false,
          message: "Datos de liquidación incompletos",
        });
        return;
      }

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
        period: liquidationData.period_start.substring(0, 7),
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
          net_amount: toDecimal(employee.net_amount),
        });

        // Crear novedades para cada empleado
        for (const news of employee.news_data || []) {
          await LiquidationNews.create({
            liquidation_detail_id: detail.id,
            employee_news_id: news.employee_news_id,
            type_news_id: news.type_news_id,
            hours: toDecimal(news.hours),
            days: toDecimal(news.days),
            amount: toDecimal(news.amount),
          });
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

      await Liquidations.update(id, {
        status: "approved",
        approved_at: new Date(),
        approved_by: parseInt(approverId),
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
      const { Liquidations, LiquidationDetails, LiquidationNews, sequelize } = await db();
      
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

      // Eliminar en cascada: primero liquidation_news, luego liquidation_details, finalmente liquidations
      console.log("🗑️ Eliminando registros relacionados...");
      
      // 1. Eliminar liquidation_news relacionados usando SQL directo
      await sequelize.query(
        `DELETE FROM liquidation_news WHERE liquidation_detail_id IN (
          SELECT id FROM liquidation_details WHERE liquidation_id = :liquidationId
        )`,
        {
          replacements: { liquidationId: id },
          type: QueryTypes.DELETE
        }
      );
      
      // 2. Eliminar liquidation_details relacionados
      await sequelize.query(
        'DELETE FROM liquidation_details WHERE liquidation_id = :liquidationId',
        {
          replacements: { liquidationId: id },
          type: QueryTypes.DELETE
        }
      );
      
      // 3. Finalmente eliminar la liquidación
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