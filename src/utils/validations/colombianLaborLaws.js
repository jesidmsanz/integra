/**
 * Validaciones según las leyes laborales colombianas
 * Basado en el Código Sustantivo del Trabajo y normativas vigentes
 */

// Valores de referencia para 2024 (estos deberían actualizarse anualmente)
const COLOMBIAN_LEGAL_VALUES = {
  MINIMUM_WAGE_2024: 1300000, // Salario mínimo legal vigente 2024
  TRANSPORTATION_ASSISTANCE_2024: 162000, // Auxilio de transporte 2024
  MAXIMUM_OVERTIME_HOURS_PER_DAY: 2, // Máximo 2 horas extras por día
  MAXIMUM_OVERTIME_HOURS_PER_WEEK: 12, // Máximo 12 horas extras por semana
  MAXIMUM_DAILY_HOURS: 8, // Máximo 8 horas diarias
  MAXIMUM_WEEKLY_HOURS: 48, // Máximo 48 horas semanales
  OVERTIME_RATE: 1.25, // 25% adicional para horas extras
  NIGHT_SHIFT_RATE: 1.35, // 35% adicional para trabajo nocturno
  HOLIDAY_RATE: 1.75, // 75% adicional para trabajo en festivos
  SUNDAY_RATE: 1.75, // 75% adicional para trabajo dominical
  PRIMA_LEGAL_PERCENTAGE: 8.33, // Prima legal (1/12 del salario anual)
  CESANTIAS_LEGAL_PERCENTAGE: 8.33, // Cesantías legales (1/12 del salario anual)
  INTERESES_CESANTIAS_PERCENTAGE: 12, // Intereses sobre cesantías (12% anual)
  VACATIONS_LEGAL_DAYS: 15, // Vacaciones legales (15 días por año)
  HEALTH_CONTRIBUTION_PERCENTAGE: 4, // Aporte salud (4% del salario)
  PENSION_CONTRIBUTION_PERCENTAGE: 4, // Aporte pensión (4% del salario)
  SOLIDARITY_PENSION_FUND_PERCENTAGE: 1, // Fondo de solidaridad pensional (1% del salario)
  ARL_CONTRIBUTION_PERCENTAGE: 0.522, // ARL (varía según riesgo, promedio 0.522%)
  SENA_CONTRIBUTION_PERCENTAGE: 2, // SENA (2% del salario)
  ICBF_CONTRIBUTION_PERCENTAGE: 3, // ICBF (3% del salario)
  CCF_CONTRIBUTION_PERCENTAGE: 4, // Caja de compensación familiar (4% del salario)
};

/**
 * Valida si el salario cumple con el salario mínimo legal
 */
const validateMinimumWage = (salary, year = 2024) => {
  const minimumWage = COLOMBIAN_LEGAL_VALUES.MINIMUM_WAGE_2024;

  if (salary < minimumWage) {
    return {
      isValid: false,
      error: `El salario (${formatCurrency(
        salary
      )}) está por debajo del salario mínimo legal vigente (${formatCurrency(
        minimumWage
      )})`,
    };
  }

  return { isValid: true };
};

/**
 * Valida el auxilio de transporte
 */
const validateTransportationAssistance = (
  salary,
  transportationAssistance,
  year = 2024
) => {
  const legalTransportation =
    COLOMBIAN_LEGAL_VALUES.TRANSPORTATION_ASSISTANCE_2024;

  // Si el salario es menor a 2 SMLV, debe recibir auxilio de transporte
  const twoMinimumWages = COLOMBIAN_LEGAL_VALUES.MINIMUM_WAGE_2024 * 2;

  if (salary < twoMinimumWages) {
    if (transportationAssistance < legalTransportation) {
      return {
        isValid: false,
        error: `El auxilio de transporte (${formatCurrency(
          transportationAssistance
        )}) está por debajo del legal (${formatCurrency(legalTransportation)})`,
      };
    }
  } else {
    // Si el salario es mayor a 2 SMLV, no debe recibir auxilio de transporte
    if (transportationAssistance > 0) {
      return {
        isValid: false,
        error: `El empleado con salario mayor a 2 SMLV no debe recibir auxilio de transporte`,
      };
    }
  }

  return { isValid: true };
};

/**
 * Valida las horas extras
 */
const validateOvertimeHours = (overtimeHours, period = "daily") => {
  const maxHours =
    period === "daily"
      ? COLOMBIAN_LEGAL_VALUES.MAXIMUM_OVERTIME_HOURS_PER_DAY
      : COLOMBIAN_LEGAL_VALUES.MAXIMUM_OVERTIME_HOURS_PER_WEEK;

  if (overtimeHours > maxHours) {
    return {
      isValid: false,
      error: `Las horas extras (${overtimeHours}) exceden el máximo legal (${maxHours} horas ${
        period === "daily" ? "diarias" : "semanales"
      })`,
    };
  }

  return { isValid: true };
};

/**
 * Valida las horas de trabajo
 */
const validateWorkingHours = (dailyHours, weeklyHours) => {
  const errors = [];

  if (dailyHours > COLOMBIAN_LEGAL_VALUES.MAXIMUM_DAILY_HOURS) {
    errors.push(
      `Las horas diarias (${dailyHours}) exceden el máximo legal (${COLOMBIAN_LEGAL_VALUES.MAXIMUM_DAILY_HOURS} horas)`
    );
  }

  if (weeklyHours > COLOMBIAN_LEGAL_VALUES.MAXIMUM_WEEKLY_HOURS) {
    errors.push(
      `Las horas semanales (${weeklyHours}) exceden el máximo legal (${COLOMBIAN_LEGAL_VALUES.MAXIMUM_WEEKLY_HOURS} horas)`
    );
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      error: errors.join(". "),
    };
  }

  return { isValid: true };
};

/**
 * Calcula las prestaciones sociales legales
 */
const calculateLegalBenefits = (salary, monthsWorked = 1) => {
  const prima =
    ((salary * COLOMBIAN_LEGAL_VALUES.PRIMA_LEGAL_PERCENTAGE) / 100) *
    monthsWorked;
  const cesantias =
    ((salary * COLOMBIAN_LEGAL_VALUES.CESANTIAS_LEGAL_PERCENTAGE) / 100) *
    monthsWorked;
  const interesesCesantias =
    ((cesantias * COLOMBIAN_LEGAL_VALUES.INTERESES_CESANTIAS_PERCENTAGE) /
      100) *
    monthsWorked;

  return {
    prima,
    cesantias,
    interesesCesantias,
    totalBenefits: prima + cesantias + interesesCesantias,
  };
};

/**
 * Calcula las parafiscales (aportes del empleador)
 */
const calculateParafiscales = (salary) => {
  const salud =
    (salary * COLOMBIAN_LEGAL_VALUES.HEALTH_CONTRIBUTION_PERCENTAGE) / 100;
  const pension =
    (salary * COLOMBIAN_LEGAL_VALUES.PENSION_CONTRIBUTION_PERCENTAGE) / 100;
  const arl =
    (salary * COLOMBIAN_LEGAL_VALUES.ARL_CONTRIBUTION_PERCENTAGE) / 100;
  const sena =
    (salary * COLOMBIAN_LEGAL_VALUES.SENA_CONTRIBUTION_PERCENTAGE) / 100;
  const icbf =
    (salary * COLOMBIAN_LEGAL_VALUES.ICBF_CONTRIBUTION_PERCENTAGE) / 100;
  const ccf =
    (salary * COLOMBIAN_LEGAL_VALUES.CCF_CONTRIBUTION_PERCENTAGE) / 100;

  return {
    salud,
    pension,
    arl,
    sena,
    icbf,
    ccf,
    totalParafiscales: salud + pension + arl + sena + icbf + ccf,
  };
};

/**
 * Valida una liquidación completa según las leyes colombianas
 */
const validateLiquidation = (liquidationData) => {
  const errors = [];
  const warnings = [];

  // Validar cada empleado
  liquidationData.employees_data?.forEach((employee, index) => {
    const employeeErrors = [];

    // Validar salario mínimo
    const salaryValidation = validateMinimumWage(employee.basic_salary);
    if (!salaryValidation.isValid) {
      employeeErrors.push(salaryValidation.error);
    }

    // Validar auxilio de transporte
    const transportValidation = validateTransportationAssistance(
      employee.basic_salary,
      employee.transportation_assistance
    );
    if (!transportValidation.isValid) {
      employeeErrors.push(transportValidation.error);
    }

    // Validar novedades (horas extras, etc.)
    if (employee.news_data) {
      employee.news_data.forEach((news) => {
        // Aquí se podrían agregar validaciones específicas por tipo de novedad
        if (news.type_news_id === "overtime") {
          // Asumiendo que existe un tipo de novedad para horas extras
          const overtimeValidation = validateOvertimeHours(news.hours, "daily");
          if (!overtimeValidation.isValid) {
            employeeErrors.push(overtimeValidation.error);
          }
        }
      });
    }

    if (employeeErrors.length > 0) {
      errors.push({
        employeeIndex: index,
        employeeId: employee.employee_id,
        errors: employeeErrors,
      });
    }
  });

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
  };
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
 * Obtiene los valores legales vigentes
 */
const getLegalValues = (year = 2024) => {
  return COLOMBIAN_LEGAL_VALUES;
};

module.exports = {
  validateMinimumWage,
  validateTransportationAssistance,
  validateOvertimeHours,
  validateWorkingHours,
  calculateLegalBenefits,
  calculateParafiscales,
  validateLiquidation,
  formatCurrency,
  getLegalValues,
};
