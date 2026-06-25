/**
 * Tests del motor de cálculo de nómina.
 *
 * Cada bloque `describe` corresponde a un hallazgo específico del informe de
 * auditoría funcional (2026-06-25), garantizando que los cálculos corregidos
 * se mantengan estables ante futuros cambios.
 */
const {
  calcularSalarioProporcional,
  calcularAuxilioTransporte,
  calcularBaseSeguridadSocial,
  calcularNovedadPorHora,
  calcularNovedadPorDias,
  esIncapacidadQueReduceSalario,
  esCombinacionCompatible,
  calcularDescuentosSegSocial,
} = require("../index");

// ---------------------------------------------------------------------------
// Datos base comunes (basados en el caso Jocelyn Walcott)
// ---------------------------------------------------------------------------
const EMPLEADA_BASE = {
  basicmonthlysalary: 1_423_500,
  transportationassistance: 200_010 / 30, // valor día → 6667
  paymentmethod: "Mensual",
};

const JORNADA_MENSUAL = 220; // horas base mensuales pactadas

// ---------------------------------------------------------------------------
// HALLAZGO 1: Doble devengo en incapacidades
// ---------------------------------------------------------------------------
describe("Hallazgo 1 — Incapacidades no producen doble devengo", () => {
  test("incapacidad reduce el salario proporcional correctamente", () => {
    const salarioMensual = 2_500_000;
    const diasPeriodo = 30;
    const diasIncapacidad = 10;

    const proporcional = calcularSalarioProporcional(
      salarioMensual,
      diasPeriodo,
      diasIncapacidad
    );

    // Esperado: (30-10)/30 × 2.500.000 = 1.666.667
    expect(proporcional).toBe(1_666_667);
  });

  test("sin días afectados el salario proporcional iguala al mensual", () => {
    const proporcional = calcularSalarioProporcional(1_423_500, 30, 0);
    expect(proporcional).toBe(1_423_500);
  });

  test("proporcional quincenal (15 días sin afectación)", () => {
    const proporcional = calcularSalarioProporcional(1_423_500, 15, 0);
    expect(proporcional).toBe(1_423_500);
  });

  test("proporcional quincenal con 5 días de incapacidad", () => {
    // (1.423.500 / 15) × (15-5) = 94.900 × 10 = 949.000
    const proporcional = calcularSalarioProporcional(1_423_500, 15, 5);
    expect(proporcional).toBe(949_000);
  });

  test("esIncapacidadQueReduceSalario → true para payment_rule EPS", () => {
    const tipoNovedad = { payment_rule: "incapacidad_general_eps", category: "Incapacidad" };
    expect(esIncapacidadQueReduceSalario(tipoNovedad, {})).toBe(true);
  });

  test("esIncapacidadQueReduceSalario → true para payment_rule ARL", () => {
    const tipoNovedad = { payment_rule: "accidente_trabajo", category: "Incapacidad" };
    expect(esIncapacidadQueReduceSalario(tipoNovedad, {})).toBe(true);
  });

  test("esIncapacidadQueReduceSalario → false cuando affects.baseSalary ya es true", () => {
    // Si el tipo ya incluye el salario (baseSalary:true), no se debe reducir dos veces
    const tipoNovedad = { payment_rule: "incapacidad_general_eps", category: "Incapacidad" };
    const affectsData = { baseSalary: true };
    expect(esIncapacidadQueReduceSalario(tipoNovedad, affectsData)).toBe(false);
  });

  test("esIncapacidadQueReduceSalario → false para Hora Extra (no es incapacidad)", () => {
    const tipoNovedad = { payment_rule: "normal", category: "Hora Extra" };
    expect(esIncapacidadQueReduceSalario(tipoNovedad, {})).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// HALLAZGO 2 / Mejora 2 — Cálculo correcto de HEF y recargos dominicales
// ---------------------------------------------------------------------------
describe("Hallazgo 2 — Cálculo de Hora Extra Diurna Festiva (HEDF)", () => {
  const normativasCache = {
    // Normativa HEDF: multiplicador 2.05 (salario × 2.05)
    10: { multiplicador: "2.05", code: "HEDF" },
    // Normativa HED: multiplicador 1.25
    5: { multiplicador: "1.25", code: "HED" },
  };

  test("1 hora HEDF con normativa 2.05 → $13.264 (caso Jocelyn ID 105)", () => {
    const result = calcularNovedadPorHora(
      1,
      { percentage: "205", isDiscount: false, calculateperhour: true },
      EMPLEADA_BASE,
      normativasCache,
      JORNADA_MENSUAL,
      10 // hourTypeId HEDF
    );

    // (1.423.500 × 2.05) / 220 × 1 = 13.263,75 → redondeado = 13.263,75
    expect(result).toBeCloseTo(13_264, 0);
  });

  test("1 hora HEDF con normativa 1.25 (HED) → valor incorrecto menor", () => {
    // Este test documenta el BUG del ID 104: usó HED en lugar de HEDF
    const resultConError = calcularNovedadPorHora(
      1,
      { percentage: "125", isDiscount: false, calculateperhour: true },
      EMPLEADA_BASE,
      normativasCache,
      JORNADA_MENSUAL,
      5 // hourTypeId HED (incorrecto para HEDF)
    );

    const resultCorrecto = calcularNovedadPorHora(
      1,
      { percentage: "205", isDiscount: false, calculateperhour: true },
      EMPLEADA_BASE,
      normativasCache,
      JORNADA_MENSUAL,
      10 // hourTypeId HEDF
    );

    // El valor con HED debe ser menor que con HEDF
    expect(resultConError).toBeLessThan(resultCorrecto);
  });

  test("10 horas HED diurnas con multiplicador 1.25", () => {
    const result = calcularNovedadPorHora(
      10,
      { isDiscount: false, calculateperhour: true },
      EMPLEADA_BASE,
      normativasCache,
      JORNADA_MENSUAL,
      5 // HED
    );

    // (1.423.500 × 1.25) / 220 × 10 = 80.880
    expect(result).toBeCloseTo(80_881, 0);
  });
});

// ---------------------------------------------------------------------------
// HALLAZGO 3 — RDC ≠ RDNC (no deben liquidar igual)
// ---------------------------------------------------------------------------
describe("Hallazgo 3 — RDC y RDNC liquidan valores distintos", () => {
  const normativasCache = {
    // RDC: solo el recargo del 75% (el día ordinario ya fue pagado)
    20: { multiplicador: "0.75", code: "RDC" },
    // RDNC: recargo del 175% (el empleado no descansa en compensatorio)
    21: { multiplicador: "1.75", code: "RDNC" },
  };

  const tipoNovedadBase = { isDiscount: false, calculateperhour: true };

  test("10 horas RDC (multiplicador 0.75) → valor menor que RDNC", () => {
    const valRDC = calcularNovedadPorHora(
      10,
      tipoNovedadBase,
      EMPLEADA_BASE,
      normativasCache,
      JORNADA_MENSUAL,
      20
    );

    const valRDNC = calcularNovedadPorHora(
      10,
      tipoNovedadBase,
      EMPLEADA_BASE,
      normativasCache,
      JORNADA_MENSUAL,
      21
    );

    expect(valRDC).toBeLessThan(valRDNC);
  });

  test("10 horas RDC ≈ $48.528", () => {
    const val = calcularNovedadPorHora(
      10,
      tipoNovedadBase,
      EMPLEADA_BASE,
      normativasCache,
      JORNADA_MENSUAL,
      20
    );
    // (1.423.500 × 0.75) / 220 × 10 = 1.067.625 / 220 × 10 = 48.528,41
    expect(val).toBeCloseTo(48_528, 0);
  });

  test("10 horas RDNC ≈ $113.233", () => {
    const val = calcularNovedadPorHora(
      10,
      tipoNovedadBase,
      EMPLEADA_BASE,
      normativasCache,
      JORNADA_MENSUAL,
      21
    );
    // (1.423.500 × 1.75) / 220 × 10 = 2.491.125 / 220 × 10 = 113.232,95
    expect(val).toBeCloseTo(113_233, 0);
  });
});

// ---------------------------------------------------------------------------
// HALLAZGO 4 — Base seguridad social incluye prestacionales
// ---------------------------------------------------------------------------
describe("Hallazgo 4 — Base seguridad social incluye novedades prestacionales", () => {
  test("sin auxilio movilidad que exceda 40%: base = salario + prestacionales", () => {
    const salarioBase = 1_423_500;
    const prestacionales = 170_000; // HEDFs, RDs, etc.
    const movilidad = 250_000;     // 250k < 40% de 1.423.500 (569.400)

    const base = calcularBaseSeguridadSocial(
      salarioBase,
      prestacionales,
      movilidad,
      salarioBase
    );

    expect(base).toBe(salarioBase + prestacionales);
  });

  test("con auxilio movilidad que excede 40%: movilidad se suma a la base", () => {
    const salarioBase = 500_000;
    const prestacionales = 100_000;
    const movilidad = 250_000; // 250k > 40% de 500k (200k)

    const base = calcularBaseSeguridadSocial(
      salarioBase,
      prestacionales,
      movilidad,
      salarioBase
    );

    expect(base).toBe(salarioBase + prestacionales + movilidad);
  });

  test("salario base 0 (reemplazado por novedad): base = solo prestacionales", () => {
    const base = calcularBaseSeguridadSocial(0, 800_000, 250_000, 0);
    expect(base).toBe(800_000);
  });

  test("descuentos de seguridad social al 4% + 4% sobre base correcta", () => {
    const base = 1_718_553; // salario + dominicales
    const { salud, pension, total } = calcularDescuentosSegSocial(base);

    expect(salud).toBe(Math.round(base * 0.04));
    expect(pension).toBe(Math.round(base * 0.04));
    expect(total).toBe(salud + pension);
  });
});

// ---------------------------------------------------------------------------
// HALLAZGO extra — Compatibilidad novedad ↔ tipo de hora (Mejora 3)
// ---------------------------------------------------------------------------
describe("Validación de compatibilidad novedad ↔ tipo de hora laboral", () => {
  test("HEDF compatible con HEDF", () => {
    expect(esCombinacionCompatible("HEDF", "HEDF")).toBe(true);
  });

  test("HEDF compatible con HEDD (festivo diurno)", () => {
    expect(esCombinacionCompatible("HEDF", "HEDD")).toBe(true);
  });

  test("HEDF incompatible con HED (caso Jocelyn ID 104)", () => {
    expect(esCombinacionCompatible("HEDF", "HED")).toBe(false);
  });

  test("RDC compatible con RDC", () => {
    expect(esCombinacionCompatible("RDC", "RDC")).toBe(true);
  });

  test("RDC incompatible con RDNC (diferentes multiplicadores)", () => {
    expect(esCombinacionCompatible("RDC", "RDNC")).toBe(false);
  });

  test("código no mapeado → siempre compatible (no restricción)", () => {
    expect(esCombinacionCompatible("CUSTOM", "CUALQUIERA")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Auxilio de transporte
// ---------------------------------------------------------------------------
describe("Auxilio de transporte", () => {
  test("mensual = base × 30", () => {
    const emp = { transportationassistance: 6_667, paymentmethod: "Mensual" };
    expect(calcularAuxilioTransporte(emp, "Mensual")).toBe(6_667 * 30);
  });

  test("quincenal = base × 15", () => {
    const emp = { transportationassistance: 6_667, paymentmethod: "Quincenal" };
    expect(calcularAuxilioTransporte(emp, "Quincenal")).toBe(6_667 * 15);
  });

  test("sin auxilio configurado devuelve 0", () => {
    const emp = { transportationassistance: 0, paymentmethod: "Mensual" };
    expect(calcularAuxilioTransporte(emp, "Mensual")).toBe(0);
  });
});
