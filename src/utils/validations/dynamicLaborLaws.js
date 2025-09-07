/**
 * Sistema de validaciones dinámicas según normativas laborales
 * Obtiene los valores desde la base de datos en lugar de valores hardcodeados
 */

import { normativesApi } from "../api";

// Cache para normativas activas
let activeNormativeCache = null;
let cacheExpiry = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

/**
 * Obtiene la normativa activa para una fecha específica
 */
const getActiveNormative = async (date = new Date()) => {
  try {
    // Verificar cache
    if (activeNormativeCache && cacheExpiry && new Date() < cacheExpiry) {
      return activeNormativeCache;
    }

    const dateString = date.toISOString().split('T')[0];
    const response = await normativesApi.getActiveByDate(dateString);
    
    if (response.success && response.data) {
      activeNormativeCache = response.data;
      cacheExpiry = new Date(Date.now() + CACHE_DURATION);
      return response.data;
    }

    throw new Error("No se encontró normativa activa para la fecha especificada");
  } catch (error) {
    console.error("Error al obtener normativa activa:", error);
    // Fallback a valores por defecto si no se puede obtener la normativa
    return {
      minimum_wage: 1300000,
      transportation_assistance: 162000,
      workday_hours: 7.33,
      hourly_rate: 6470,
      max_overtime_hours_daily: 2,
      max_overtime_hours_weekly: 12,
      max_daily_hours: 8,
      max_weekly_hours: 48,
      overtime_rate: 1.25,
      night_shift_rate: 1.35,
      holiday_rate: 1.75,
      sunday_rate: 1.75,
      prima_legal_percentage: 8.33,
      cesantias_legal_percentage: 8.33,
      intereses_cesantias_percentage: 12.00,
      vacations_legal_days: 15,
      health_contribution_percentage: 4.00,
      pension_contribution_percentage: 4.00,
      solidarity_pension_fund_percentage: 1.00,
      arl_contribution_percentage: 0.522,
      sena_contribution_percentage: 2.00,
      icbf_contribution_percentage: 3.00,
      ccf_contribution_percentage: 4.00,
    };
  }
};

/**
 * Valida si el salario cumple con el salario mínimo legal según la normativa vigente
 */
const validateMinimumWage = async (salary, date = new Date()) => {
  try {
    const normative = await getActiveNormative(date);
    const minimumWage = parseFloat(normative.minimum_wage);

    if (salary < minimumWage) {
      return {
        isValid: false,
        error: `El salario (${formatCurrency(salary)}) está por debajo del salario mínimo legal vigente (${formatCurrency(minimumWage)}) según la normativa ${normative.name}`,
      };
    }

    return { isValid: true };
  } catch (error) {
    console.error("Error al validar salario mínimo:", error);
    return {
      isValid: false,
      error: "Error al validar el salario mínimo",
    };
  }
};

/**
 * Valida el auxilio de transporte según la normativa vigente
 */
const validateTransportationAssistance = async (salary, transportationAssistance, date = new Date()) => {
  try {
    const normative = await getActiveNormative(date);
    const legalTransportation = parseFloat(normative.transportation_assistance);
    const minimumWage = parseFloat(normative.minimum_wage);

    // Si el salario es menor a 2 SMLV, debe recibir auxilio de transporte
    const twoMinimumWages = minimumWage * 2;

    if (salary < twoMinimumWages) {
      if (transportationAssistance < legalTransportation) {
        return {
          isValid: false,
          error: `El auxilio de transporte (${formatCurrency(transportationAssistance)}) está por debajo del legal (${formatCurrency(legalTransportation)}) según la normativa ${normative.name}`,
        };
      }
    } else {
      // Si el salario es mayor a 2 SMLV, no debe recibir auxilio de transporte
      if (transportationAssistance > 0) {
        return {
          isValid: false,
          error: `El empleado con salario mayor a 2 SMLV no debe recibir auxilio de transporte según la normativa ${normative.name}`,
        };
      }
    }

    return { isValid: true };
  } catch (error) {
    console.error("Error al validar auxilio de transporte:", error);
    return {
      isValid: false,
      error: "Error al validar el auxilio de transporte",
    };
  }
};

/**
 * Valida las horas extras según la normativa vigente
 */
const validateOvertimeHours = async (overtimeHours, period = "daily", date = new Date()) => {
  try {
    const normative = await getActiveNormative(date);
    const maxHours = period === "daily" 
      ? parseInt(normative.max_overtime_hours_daily)
      : parseInt(normative.max_overtime_hours_weekly);

    if (overtimeHours > maxHours) {
      return {
        isValid: false,
        error: `Las horas extras (${overtimeHours}) exceden el máximo legal (${maxHours} horas ${period === "daily" ? "diarias" : "semanales"}) según la normativa ${normative.name}`,
      };
    }

    return { isValid: true };
  } catch (error) {
    console.error("Error al validar horas extras:", error);
    return {
      isValid: false,
      error: "Error al validar las horas extras",
    };
  }
};

/**
 * Valida las horas de trabajo según la normativa vigente
 */
const validateWorkingHours = async (dailyHours, weeklyHours, date = new Date()) => {
  try {
    const normative = await getActiveNormative(date);
    const maxDailyHours = parseInt(normative.max_daily_hours);
    const maxWeeklyHours = parseInt(normative.max_weekly_hours);
    const errors = [];

    if (dailyHours > maxDailyHours) {
      errors.push(
        `Las horas diarias (${dailyHours}) exceden el máximo legal (${maxDailyHours} horas) según la normativa ${normative.name}`
      );
    }

    if (weeklyHours > maxWeeklyHours) {
      errors.push(
        `Las horas semanales (${weeklyHours}) exceden el máximo legal (${maxWeeklyHours} horas) según la normativa ${normative.name}`
      );
    }

    if (errors.length > 0) {
      return {
        isValid: false,
        error: errors.join(". "),
      };
    }

    return { isValid: true };
  } catch (error) {
    console.error("Error al validar horas de trabajo:", error);
    return {
      isValid: false,
      error: "Error al validar las horas de trabajo",
    };
  }
};

/**
 * Calcula las prestaciones sociales legales según la normativa vigente
 */
const calculateLegalBenefits = async (salary, monthsWorked = 1, date = new Date()) => {
  try {
    const normative = await getActiveNormative(date);
    const primaPercentage = parseFloat(normative.prima_legal_percentage);
    const cesantiasPercentage = parseFloat(normative.cesantias_legal_percentage);
    const interesesPercentage = parseFloat(normative.intereses_cesantias_percentage);

    const prima = ((salary * primaPercentage) / 100) * monthsWorked;
    const cesantias = ((salary * cesantiasPercentage) / 100) * monthsWorked;
    const interesesCesantias = ((cesantias * interesesPercentage) / 100) * monthsWorked;

    return {
      prima,
      cesantias,
      interesesCesantias,
      totalBenefits: prima + cesantias + interesesCesantias,
      normative: normative.name,
    };
  } catch (error) {
    console.error("Error al calcular prestaciones sociales:", error);
    throw error;
  }
};

/**
 * Calcula las parafiscales según la normativa vigente
 */
const calculateParafiscales = async (salary, date = new Date()) => {
  try {
    const normative = await getActiveNormative(date);
    
    const salud = (salary * parseFloat(normative.health_contribution_percentage)) / 100;
    const pension = (salary * parseFloat(normative.pension_contribution_percentage)) / 100;
    const arl = (salary * parseFloat(normative.arl_contribution_percentage)) / 100;
    const sena = (salary * parseFloat(normative.sena_contribution_percentage)) / 100;
    const icbf = (salary * parseFloat(normative.icbf_contribution_percentage)) / 100;
    const ccf = (salary * parseFloat(normative.ccf_contribution_percentage)) / 100;

    return {
      salud,
      pension,
      arl,
      sena,
      icbf,
      ccf,
      totalParafiscales: salud + pension + arl + sena + icbf + ccf,
      normative: normative.name,
    };
  } catch (error) {
    console.error("Error al calcular parafiscales:", error);
    throw error;
  }
};

/**
 * Valida una liquidación completa según la normativa vigente
 */
const validateLiquidation = async (liquidationData, date = new Date()) => {
  try {
    const normative = await getActiveNormative(date);
    const errors = [];
    const warnings = [];

    // Validar cada empleado
    for (let i = 0; i < liquidationData.employees_data?.length; i++) {
      const employee = liquidationData.employees_data[i];
      const employeeErrors = [];

      // Validar salario mínimo
      const salaryValidation = await validateMinimumWage(employee.basic_salary, date);
      if (!salaryValidation.isValid) {
        employeeErrors.push(salaryValidation.error);
      }

      // Validar auxilio de transporte
      const transportValidation = await validateTransportationAssistance(
        employee.basic_salary,
        employee.transportation_assistance,
        date
      );
      if (!transportValidation.isValid) {
        employeeErrors.push(transportValidation.error);
      }

      // Validar novedades (horas extras, etc.)
      if (employee.news_data) {
        for (const news of employee.news_data) {
          if (news.type_news_id === "overtime") {
            const overtimeValidation = await validateOvertimeHours(news.hours, "daily", date);
            if (!overtimeValidation.isValid) {
              employeeErrors.push(overtimeValidation.error);
            }
          }
        }
      }

      if (employeeErrors.length > 0) {
        errors.push({
          employeeIndex: i,
          employeeId: employee.employee_id,
          errors: employeeErrors,
        });
      }
    }

    // Validaciones generales
    if (!liquidationData.company_id) {
      errors.push({ general: "Debe seleccionar una empresa" });
    }

    if (!liquidationData.period_start || !liquidationData.period_end) {
      errors.push({ general: "Debe especificar el período de liquidación" });
    }

    if (!liquidationData.payment_frequency) {
      errors.push({ general: "Debe especificar la frecuencia de pago" });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      normative: normative.name,
    };
  } catch (error) {
    console.error("Error al validar liquidación:", error);
    return {
      isValid: false,
      errors: [{ general: "Error al validar la liquidación" }],
      warnings: [],
    };
  }
};

/**
 * Obtiene los valores legales vigentes para una fecha específica
 */
const getLegalValues = async (date = new Date()) => {
  try {
    const normative = await getActiveNormative(date);
    return {
      minimum_wage: parseFloat(normative.minimum_wage),
      transportation_assistance: parseFloat(normative.transportation_assistance),
      workday_hours: parseFloat(normative.workday_hours),
      hourly_rate: parseFloat(normative.hourly_rate),
      max_overtime_hours_daily: parseInt(normative.max_overtime_hours_daily),
      max_overtime_hours_weekly: parseInt(normative.max_overtime_hours_weekly),
      max_daily_hours: parseInt(normative.max_daily_hours),
      max_weekly_hours: parseInt(normative.max_weekly_hours),
      overtime_rate: parseFloat(normative.overtime_rate),
      night_shift_rate: parseFloat(normative.night_shift_rate),
      holiday_rate: parseFloat(normative.holiday_rate),
      sunday_rate: parseFloat(normative.sunday_rate),
      prima_legal_percentage: parseFloat(normative.prima_legal_percentage),
      cesantias_legal_percentage: parseFloat(normative.cesantias_legal_percentage),
      intereses_cesantias_percentage: parseFloat(normative.intereses_cesantias_percentage),
      vacations_legal_days: parseInt(normative.vacations_legal_days),
      health_contribution_percentage: parseFloat(normative.health_contribution_percentage),
      pension_contribution_percentage: parseFloat(normative.pension_contribution_percentage),
      solidarity_pension_fund_percentage: parseFloat(normative.solidarity_pension_fund_percentage),
      arl_contribution_percentage: parseFloat(normative.arl_contribution_percentage),
      sena_contribution_percentage: parseFloat(normative.sena_contribution_percentage),
      icbf_contribution_percentage: parseFloat(normative.icbf_contribution_percentage),
      ccf_contribution_percentage: parseFloat(normative.ccf_contribution_percentage),
      normative_name: normative.name,
      normative_effective_date: normative.effective_date,
    };
  } catch (error) {
    console.error("Error al obtener valores legales:", error);
    throw error;
  }
};

/**
 * Formatea un valor como moneda colombiana
 */
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(amount || 0);
};

/**
 * Limpia el cache de normativas
 */
const clearCache = () => {
  activeNormativeCache = null;
  cacheExpiry = null;
};

module.exports = {
  getActiveNormative,
  validateMinimumWage,
  validateTransportationAssistance,
  validateOvertimeHours,
  validateWorkingHours,
  calculateLegalBenefits,
  calculateParafiscales,
  validateLiquidation,
  getLegalValues,
  formatCurrency,
  clearCache,
};


