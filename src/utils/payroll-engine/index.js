/**
 * Motor de cálculo de nómina — funciones puras reutilizables.
 *
 * Estas funciones no dependen de estado React ni de efectos secundarios.
 * Reciben todos los datos que necesitan como parámetros y devuelven resultados
 * determinísticos, lo cual permite testarlas de forma aislada.
 */

// ---------------------------------------------------------------------------
// Constantes del dominio
// ---------------------------------------------------------------------------

/** Categorías de novedades cuyos valores suman a la base prestacional. */
const CATEGORIAS_PRESTACIONALES = ["Hora Extra", "Recargo"];

/** payment_rule de incapacidades reconocidas por el sistema. */
const REGLAS_INCAPACIDAD = [
  "incapacidad_general_eps",
  "incapacidad_general_arl",
  "incapacidad_eps",
  "accidente_trabajo",
];

// ---------------------------------------------------------------------------
// 1. Salario base proporcional
// ---------------------------------------------------------------------------

/**
 * Calcula el salario base proporcional para un período dado.
 *
 * @param {number} salarioMensual - Salario mensual completo.
 * @param {number} diasPeriodo    - Días totales del período (15 o 30).
 * @param {number} diasAfectados  - Días que reducen el salario (incapacidades, licencias, etc.).
 * @returns {number} Salario base proporcional redondeado al peso.
 */
function calcularSalarioProporcional(salarioMensual, diasPeriodo, diasAfectados) {
  if (diasPeriodo <= 0) return 0;
  const diasEfectivos = Math.max(0, diasPeriodo - diasAfectados);
  return Math.round((salarioMensual / diasPeriodo) * diasEfectivos);
}

// ---------------------------------------------------------------------------
// 2. Auxilio de transporte
// ---------------------------------------------------------------------------

/**
 * Calcula el auxilio de transporte del período.
 *
 * @param {{ transportationassistance: number|string, paymentmethod: string }} employee
 * @param {string} paymentMethod - "Quincenal" o "Mensual".
 * @returns {number}
 */
function calcularAuxilioTransporte(employee, paymentMethod) {
  const auxilioBase = Number(employee.transportationassistance) || 0;
  if (!auxilioBase) return 0;
  const metodo = paymentMethod || employee.paymentmethod;
  return metodo === "Quincenal" ? auxilioBase * 15 : auxilioBase * 30;
}

// ---------------------------------------------------------------------------
// 3. Base de seguridad social
// ---------------------------------------------------------------------------

/**
 * Calcula la base salarial sobre la que se liquidan salud y pensión.
 * Regla: si el auxilio de movilidad supera el 40 % del salario, se incluye
 * en la base prestacional.
 *
 * @param {number} salarioBaseCalculado    - Salario base proporcional del período.
 * @param {number} valorPrestacionales     - Suma de novedades con bandera prestacional.
 * @param {number} auxilioMovilidad        - Auxilio de movilidad del período.
 * @param {number|null} salarioBaseCompleto - Salario completo (sin proporción) para calcular el 40%.
 * @returns {number}
 */
function calcularBaseSeguridadSocial(
  salarioBaseCalculado,
  valorPrestacionales,
  auxilioMovilidad,
  salarioBaseCompleto = null
) {
  if (salarioBaseCalculado === 0) {
    return valorPrestacionales;
  }

  const salarioParaComparar =
    salarioBaseCompleto !== null ? salarioBaseCompleto : salarioBaseCalculado;
  const cuarentaPorciento = salarioParaComparar * 0.4;
  const movilidadIncluida =
    auxilioMovilidad > cuarentaPorciento
      ? valorPrestacionales + auxilioMovilidad
      : valorPrestacionales;

  return salarioBaseCalculado + movilidadIncluida;
}

// ---------------------------------------------------------------------------
// 4. Valor de una novedad por hora (nueva fórmula parametrizada)
// ---------------------------------------------------------------------------

/**
 * Calcula el valor de una novedad que se liquida por horas.
 *
 * Jerarquía de cálculo:
 *  1. Si tiene `hourTypeId` y existe la normativa en cache → formula normativa.
 *  2. Si tiene cantidad fija por hora (`amount`)           → horas × cantidad.
 *  3. Si tiene porcentaje (`percentage`)                   → formula unificada.
 *  4. Fallback                                            → 0.
 *
 * @param {number}  totalHoras       - Horas a liquidar.
 * @param {object}  tipoNovedad      - Registro de type_news.
 * @param {object}  employee         - Registro del empleado.
 * @param {object}  normativasCache  - Mapa { [hourTypeId]: normativa }.
 * @param {number}  horasBaseMensuales - Jornada mensual del empleado (ej. 220).
 * @param {number|null} hourTypeId   - ID del tipo de hora laboral seleccionado.
 * @returns {number} Valor de la novedad (positivo = devengo, negativo = descuento).
 */
function calcularNovedadPorHora(
  totalHoras,
  tipoNovedad,
  employee,
  normativasCache,
  horasBaseMensuales,
  hourTypeId
) {
  if (!totalHoras || totalHoras <= 0) return 0;

  const salarioMensual = Number(employee.basicmonthlysalary) || 0;
  const tieneCantidad = tipoNovedad.amount && parseFloat(tipoNovedad.amount) > 0;
  const tienePorcentaje =
    tipoNovedad.percentage && parseFloat(tipoNovedad.percentage) > 0;

  let valorNovedad = 0;

  if (hourTypeId && normativasCache[hourTypeId]) {
    // Fórmula principal: (salario × multiplicador) / horasBase × horas
    const multiplicador = parseFloat(normativasCache[hourTypeId].multiplicador) || 1;
    const valorHora = (salarioMensual * multiplicador) / horasBaseMensuales;
    valorNovedad = totalHoras * valorHora;
  } else if (tieneCantidad) {
    valorNovedad = totalHoras * parseFloat(tipoNovedad.amount);
  } else if (tienePorcentaje) {
    // Fórmula unificada (legado): igual a la normativa sin `hourTypeId`
    const factor = Number(tipoNovedad.percentage) / 100;
    const valorHora = (salarioMensual * factor) / horasBaseMensuales;
    valorNovedad = totalHoras * valorHora;
  }

  valorNovedad = Math.round(valorNovedad * 100) / 100;

  const esDescuento =
    tipoNovedad.isDiscount === true || tipoNovedad.isDiscount === "true";
  return esDescuento ? -Math.abs(valorNovedad) : valorNovedad;
}

// ---------------------------------------------------------------------------
// 5. Valor de una novedad por días (incapacidades, licencias, etc.)
// ---------------------------------------------------------------------------

/**
 * Calcula el valor de una novedad liquidada por días.
 *
 * @param {number} diasNovedad   - Número de días de la novedad.
 * @param {object} tipoNovedad   - Registro de type_news.
 * @param {object} employee      - Registro del empleado.
 * @returns {number}
 */
function calcularNovedadPorDias(diasNovedad, tipoNovedad, employee) {
  if (!diasNovedad || diasNovedad <= 0) return 0;

  const tieneCantidad = tipoNovedad.amount && parseFloat(tipoNovedad.amount) > 0;
  const tienePorcentaje =
    tipoNovedad.percentage && parseFloat(tipoNovedad.percentage) > 0;

  let valorNovedad = 0;

  if (tieneCantidad) {
    valorNovedad = parseFloat(tipoNovedad.amount);
  } else if (tienePorcentaje) {
    const valorDia = Number(employee.basicmonthlysalary) / 30;
    valorNovedad =
      diasNovedad * valorDia * (Number(tipoNovedad.percentage) / 100);
  }

  valorNovedad = Math.round(valorNovedad * 100) / 100;

  const esDescuento =
    tipoNovedad.isDiscount === true || tipoNovedad.isDiscount === "true";
  return esDescuento ? -Math.abs(valorNovedad) : valorNovedad;
}

// ---------------------------------------------------------------------------
// 6. Clasificación de novedades de incapacidad/licencia
// ---------------------------------------------------------------------------

/**
 * Determina si una novedad es una incapacidad o licencia que debe reducir
 * el salario base (evitar doble devengo).
 *
 * @param {object} tipoNovedad - Registro de type_news.
 * @param {object} affectsData - Objeto `affects` parseado.
 * @returns {boolean}
 */
function esIncapacidadQueReduceSalario(tipoNovedad, affectsData = {}) {
  // Si ya tiene bandera affects.baseSalary = true → el tipo la incluye en salario;
  // no hace falta reducir manualmente.
  const yaAfectaSalario =
    affectsData.baseSalary === true || affectsData.baseSalary === "true";
  if (yaAfectaSalario) return false;

  const esIncapacidadPorReglaPago = REGLAS_INCAPACIDAD.includes(
    tipoNovedad.payment_rule
  );
  const esIncapacidadPorCategoria =
    tipoNovedad.category === "Incapacidad" &&
    (!tipoNovedad.payment_rule || tipoNovedad.payment_rule === "normal");

  return esIncapacidadPorReglaPago || esIncapacidadPorCategoria;
}

// ---------------------------------------------------------------------------
// 7. Validar compatibilidad novedad ↔ tipo de hora laboral
// ---------------------------------------------------------------------------

/**
 * Mapa de compatibilidad entre el código de tipo de novedad y los códigos
 * de normativa (tipo de hora laboral) permitidos.
 */
const COMPATIBILIDAD_NOVEDAD_HORA = {
  HED: ["HED"],
  HEN: ["HEN"],
  HEDF: ["HEDF", "HEDD"],
  HENF: ["HENF", "HEDN"],
  RNO: ["RNO"],
  RNFC: ["RNFC"],
  RNF: ["RNF"],
  RDC: ["RDC", "RDD"],
  RD: ["RD", "RDN"],
  HO: ["HO"],
};

/**
 * Comprueba si la combinación tipoNovedad ↔ tipoHora es compatible.
 *
 * @param {string} codigoNovedad  - Código del tipo de novedad (ej. "HEDF").
 * @param {string} codigoHoraTipo - Código de la normativa (ej. "HEDD").
 * @returns {boolean} `true` si son compatibles o si no hay mapa definido.
 */
function esCombinacionCompatible(codigoNovedad, codigoHoraTipo) {
  if (!codigoNovedad || !codigoHoraTipo) return true;
  const permitidos = COMPATIBILIDAD_NOVEDAD_HORA[codigoNovedad];
  if (!permitidos) return true; // Sin restricción para novedades no mapeadas
  return permitidos.includes(codigoHoraTipo);
}

// ---------------------------------------------------------------------------
// 8. Descuentos de seguridad social
// ---------------------------------------------------------------------------

/**
 * Calcula los descuentos de salud y pensión del empleado.
 *
 * @param {number} baseSeguridadSocial - Base salarial calculada.
 * @param {number} porcentajeSalud     - Porcentaje del empleado (ej. 0.04).
 * @param {number} porcentajePension   - Porcentaje del empleado (ej. 0.04).
 * @returns {{ salud: number, pension: number, total: number }}
 */
function calcularDescuentosSegSocial(
  baseSeguridadSocial,
  porcentajeSalud = 0.04,
  porcentajePension = 0.04
) {
  const salud = Math.round(baseSeguridadSocial * porcentajeSalud);
  const pension = Math.round(baseSeguridadSocial * porcentajePension);
  return { salud, pension, total: salud + pension };
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

module.exports = {
  // Constantes
  CATEGORIAS_PRESTACIONALES,
  REGLAS_INCAPACIDAD,
  COMPATIBILIDAD_NOVEDAD_HORA,

  // Funciones
  calcularSalarioProporcional,
  calcularAuxilioTransporte,
  calcularBaseSeguridadSocial,
  calcularNovedadPorHora,
  calcularNovedadPorDias,
  esIncapacidadQueReduceSalario,
  esCombinacionCompatible,
  calcularDescuentosSegSocial,
};
