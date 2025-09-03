const {
  validateLiquidation,
} = require("../../../utils/validations/colombianLaborLaws");
const pdfGenerator = require("../../services/pdfGenerator");
const db = require("../../db/index.js");

const list = async (page = 1, limit = 30, status, company_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { Liquidations } = await db();

      // Traer TODAS las liquidaciones con nombres reales
      const result = await Liquidations.findAllWithNames();

      // Devolver todos los datos en el formato esperado
      resolve({
        success: true,
        data: result,
        pagination: {
          page: 1,
          limit: 100,
          total: result.length,
          pages: 1,
        },
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getById = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("🔍 Iniciando getById para ID:", id);
      const { Liquidations } = await db();
      console.log("🔍 Liquidations obtenido:", !!Liquidations);

      const result = await Liquidations.findByIdWithNames(id);
      console.log("🔍 Result completo:", result);

      if (!result || result.length === 0) {
        console.log("🔍 No se encontró liquidación");
        reject({
          success: false,
          message: "Liquidación no encontrada",
        });
        return;
      }

      const liquidation = result[0];
      console.log("🔍 Datos de liquidación obtenidos:", liquidation);

      resolve({
        success: true,
        data: liquidation,
      });
    } catch (error) {
      console.error("Error al obtener liquidación:", error);
      reject({
        success: false,
        message: "Error interno del servidor",
        error: error.message,
      });
    }
  });
};

const create = async (liquidationData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { Liquidations, LiquidationDetails, LiquidationNews } = await db();

      console.log("📦 Datos recibidos en create:", liquidationData);
      console.log(
        "📊 employees_data existe:",
        !!liquidationData.employees_data
      );
      console.log(
        "📊 employees_data length:",
        liquidationData.employees_data?.length
      );

      if (
        liquidationData.employees_data &&
        liquidationData.employees_data.length > 0
      ) {
        console.log("👥 Primer empleado:", liquidationData.employees_data[0]);
        console.log("💰 Valores del primer empleado:", {
          basic_salary: liquidationData.employees_data[0]?.basic_salary,
          transportation_assistance:
            liquidationData.employees_data[0]?.transportation_assistance,
          total_novedades: liquidationData.employees_data[0]?.total_novedades,
          net_amount: liquidationData.employees_data[0]?.net_amount,
        });
      }

      // Validar que tenemos los datos necesarios
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

      // Función helper para convertir a número y redondear a 2 decimales
      const toDecimal = (value) => {
        if (value === null || value === undefined || value === "") {
          return 0;
        }

        // Si es string, remover caracteres no numéricos excepto punto y coma
        let cleanValue = value;
        if (typeof value === "string") {
          cleanValue = value.replace(/[^\d.,-]/g, "").replace(",", ".");
        }

        const num = parseFloat(cleanValue);
        if (isNaN(num)) {
          console.warn(`⚠️ Valor no numérico convertido a 0:`, value);
          return 0;
        }

        // Limitar a 13 dígitos antes del punto decimal (DECIMAL(15,2))
        const maxValue = 9999999999999.99;
        if (Math.abs(num) > maxValue) {
          console.warn(`⚠️ Valor muy grande, limitado a ${maxValue}:`, num);
          return num > 0 ? maxValue : -maxValue;
        }

        return Math.round(num * 100) / 100; // Redondear a 2 decimales
      };

      const totalBasicSalary = employees.reduce(
        (sum, emp) => sum + toDecimal(emp.basic_salary),
        0
      );
      const totalTransportationAssistance = employees.reduce(
        (sum, emp) => sum + toDecimal(emp.transportation_assistance),
        0
      );
      const totalNovedades = employees.reduce(
        (sum, emp) => sum + toDecimal(emp.total_novedades),
        0
      );
      const totalDiscounts = employees.reduce(
        (sum, emp) => sum + toDecimal(emp.total_discounts),
        0
      );
      const totalNetAmount = employees.reduce(
        (sum, emp) => sum + toDecimal(emp.net_amount),
        0
      );

      console.log("💰 Totales calculados:", {
        totalBasicSalary,
        totalTransportationAssistance,
        totalNovedades,
        totalDiscounts,
        totalNetAmount,
      });

      // Crear liquidación principal
      console.log("🏗️ Creando liquidación principal con datos:", {
        company_id: liquidationData.company_id,
        user_id: liquidationData.user_id || 1,
        period: liquidationData.period_start.substring(0, 7),
        total_employees: totalEmployees,
        total_basic_salary: totalBasicSalary,
        total_transportation_assistance: totalTransportationAssistance,
        total_novedades: totalNovedades,
        total_discounts: totalDiscounts,
        total_net_amount: totalNetAmount,
      });

      const liquidationRecord = await Liquidations.create({
        company_id: liquidationData.company_id,
        user_id: liquidationData.user_id || 1, // Temporal, debería venir del token
        period: liquidationData.period_start.substring(0, 7), // Formato YYYY-MM
        status: "draft",
        total_employees: totalEmployees,
        total_basic_salary: totalBasicSalary,
        total_transportation_assistance: totalTransportationAssistance,
        total_mobility_assistance: 0, // Por ahora no hay auxilio de movilidad
        total_novedades: totalNovedades,
        total_discounts: totalDiscounts,
        total_net_amount: totalNetAmount,
        notes: liquidationData.notes || "",
      });

      console.log("✅ Liquidación principal creada:", liquidationRecord.id);

      // Crear detalles de liquidación para cada empleado
      for (const employee of employees) {
        const detail = await LiquidationDetails.create({
          liquidation_id: liquidationRecord.id,
          employee_id: employee.employee_id,
          basic_salary: toDecimal(employee.basic_salary),
          transportation_assistance: toDecimal(
            employee.transportation_assistance
          ),
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
      console.error("Error al crear liquidación:", error);
      reject({
        success: false,
        message: "Error interno del servidor",
        error: error.message,
      });
    }
  });
};

const update = async (id, updateData) => {
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

      // Solo permitir actualizar ciertos campos
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
        data: updatedLiquidation,
        message: "Liquidación actualizada exitosamente",
      });
    } catch (error) {
      console.error("Error al actualizar liquidación:", error);
      reject({
        success: false,
        message: "Error interno del servidor",
        error: error.message,
      });
    }
  });
};

const approve = async (id, approvedBy) => {
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

      if (liquidation.status !== "draft") {
        reject({
          success: false,
          message: "Solo se pueden aprobar liquidaciones en estado borrador",
        });
        return;
      }

      await Liquidations.update(id, {
        status: "approved",
        approved_at: new Date(),
        approved_by: approvedBy,
      });

      const updatedLiquidation = await Liquidations.findById(id);

      resolve({
        success: true,
        data: updatedLiquidation,
        message: "Liquidación aprobada exitosamente",
      });
    } catch (error) {
      console.error("Error al aprobar liquidación:", error);
      reject({
        success: false,
        message: "Error interno del servidor",
        error: error.message,
      });
    }
  });
};

const markAsPaid = async (id, paidBy) => {
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
          message:
            "Solo se pueden marcar como pagadas las liquidaciones aprobadas",
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
      console.error("Error al marcar liquidación como pagada:", error);
      reject({
        success: false,
        message: "Error interno del servidor",
        error: error.message,
      });
    }
  });
};

const deleteById = async (id) => {
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

      if (liquidation.status === "paid") {
        reject({
          success: false,
          message:
            "No se pueden eliminar liquidaciones que ya han sido pagadas",
        });
        return;
      }

      await Liquidations.deleteById(id);

      resolve({
        success: true,
        message: "Liquidación eliminada exitosamente",
      });
    } catch (error) {
      console.error("Error al eliminar liquidación:", error);
      reject({
        success: false,
        message: "Error interno del servidor",
        error: error.message,
      });
    }
  });
};

const generatePDF = async (id, employeeId = null) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("🔍 Generando PDF para liquidación ID:", id);
      const { Liquidations } = await db();

      // Usar la función que funciona correctamente
      const result = await Liquidations.findByIdWithNames(id);
      if (!result || result.length === 0) {
        reject({
          success: false,
          message: "Liquidación no encontrada",
        });
        return;
      }

      const liquidation = result[0];
      console.log("📄 Datos de liquidación para PDF:", liquidation);

      let pdfResult;
      if (employeeId) {
        // Generar PDF individual para un empleado
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
        pdfResult = await pdfGenerator.generateEmployeePDF(
          liquidation,
          employee
        );
      } else {
        // Generar PDF completo de la liquidación
        pdfResult = await pdfGenerator.generateLiquidationPDF(liquidation);
      }

      console.log("✅ PDF generado:", pdfResult);

      resolve({
        success: true,
        data: pdfResult,
        message: "PDF generado exitosamente",
      });
    } catch (error) {
      console.error("❌ Error al generar PDF:", error);
      reject({
        success: false,
        message: "Error interno del servidor",
        error: error.message,
      });
    }
  });
};

module.exports = {
  list,
  getById,
  create,
  update,
  approve,
  markAsPaid,
  deleteById,
  generatePDF,
};
