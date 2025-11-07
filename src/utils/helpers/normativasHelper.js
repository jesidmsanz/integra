import normativasApi from '@/utils/api/normativasApi';
import moment from 'moment';

/**
 * Obtiene la normativa vigente de un tipo específico para una fecha
 * @param {string} tipo - Tipo de normativa (ej: 'horas_base_mensuales', 'tipo_hora_laboral')
 * @param {Date|string} fecha - Fecha para verificar vigencia (por defecto: hoy)
 * @returns {Promise<Object|null>} - Normativa vigente o null
 */
export async function getNormativaVigente(tipo, fecha = new Date()) {
  try {
    const fechaStr = fecha instanceof Date 
      ? moment(fecha).format('YYYY-MM-DD') 
      : fecha;
    
    const response = await normativasApi.list({
      tipo: tipo,
      activa: 'true',
      fecha_vigencia: fechaStr
    });
    
    // La respuesta viene como { data: { error: '', body: [...] } } según response.js
    let normativas = [];
    
    if (response && response.data && response.data.body && Array.isArray(response.data.body)) {
      normativas = response.data.body;
    } else if (response && response.body && Array.isArray(response.body)) {
      normativas = response.body;
    } else if (Array.isArray(response)) {
      normativas = response;
    } else if (response && response.data && Array.isArray(response.data)) {
      normativas = response.data;
    }
    
    if (!normativas || normativas.length === 0) {
      return null;
    }
    
    // Filtrar por vigencia manualmente si la API no lo hace
    // Asegurar que solo se incluyan normativas activas
    const fechaMoment = moment(fechaStr);
    const vigentes = normativas.filter(n => {
      // Verificar que la normativa esté activa
      if (!n || (n.activa !== true && n.activa !== 'true')) {
        return false;
      }
      
      // Verificar que tenga fecha de inicio de vigencia
      if (!n.vigencia_desde) {
        return false;
      }
      
      try {
        const desde = moment(n.vigencia_desde);
        const hasta = n.vigencia_hasta ? moment(n.vigencia_hasta) : null;
        
        // Verificar que la fecha esté dentro del rango de vigencia
        return fechaMoment.isSameOrAfter(desde) && 
               (!hasta || fechaMoment.isSameOrBefore(hasta));
      } catch (error) {
        console.error('Error procesando vigencia de normativa:', n, error);
        return false;
      }
    });
    
    // Retornar la más reciente
    if (vigentes.length > 0) {
      return vigentes.sort((a, b) => 
        moment(b.vigencia_desde).diff(moment(a.vigencia_desde))
      )[0];
    }
    
    return null;
  } catch (error) {
    console.error(`Error obteniendo normativa vigente de tipo ${tipo}:`, error);
    return null;
  }
}

/**
 * Obtiene las horas base mensuales vigentes
 * @param {Date|string} fecha - Fecha para verificar vigencia
 * @returns {Promise<number>} - Horas base (por defecto: 220)
 */
export async function getHorasBaseMensuales(fecha = new Date()) {
  const normativa = await getNormativaVigente('horas_base_mensuales', fecha);
  
  if (normativa && normativa.unidad === 'horas') {
    return parseFloat(normativa.valor) || 220;
  }
  
  // Valor por defecto si no hay normativa configurada
  return 220;
}

/**
 * Obtiene todos los tipos de horas laborales vigentes
 * @param {Date|string} fecha - Fecha para verificar vigencia
 * @returns {Promise<Array>} - Array de normativas de tipos de horas
 */
export async function getTiposHorasLaborales(fecha = new Date()) {
  try {
    const response = await normativasApi.list({
      tipo: 'tipo_hora_laboral',
      activa: 'true'
    });
    
    // La respuesta de axios viene como response.data
    // Y response.data tiene la estructura { error: '', body: [...] } según response.js
    let normativas = [];
    
    // Intentar diferentes formatos de respuesta
    if (response && response.data && response.data.body && Array.isArray(response.data.body)) {
      // Formato: { data: { error: '', body: [...] } }
      normativas = response.data.body;
    } else if (response && response.body && Array.isArray(response.body)) {
      // Formato: { body: [...] }
      normativas = response.body;
    } else if (Array.isArray(response)) {
      // Formato: [...]
      normativas = response;
    } else if (response && response.data && Array.isArray(response.data)) {
      // Formato: { data: [...] }
      normativas = response.data;
    }
    
    if (normativas.length === 0) {
      console.warn('⚠️ No se encontraron normativas de tipo_hora_laboral');
      return [];
    }
    
    // Filtrar por vigencia y asegurar que estén activas
    const fechaMoment = moment(fecha instanceof Date ? fecha : fecha);
    const vigentes = normativas.filter(n => {
      // Verificar que la normativa esté activa
      if (!n || (n.activa !== true && n.activa !== 'true')) {
        return false;
      }
      
      // Verificar que tenga fecha de inicio de vigencia
      if (!n.vigencia_desde) {
        return false;
      }
      
      try {
        const desde = moment(n.vigencia_desde);
        const hasta = n.vigencia_hasta ? moment(n.vigencia_hasta) : null;
        
        // Verificar que la fecha esté dentro del rango de vigencia
        return fechaMoment.isSameOrAfter(desde) && 
               (!hasta || fechaMoment.isSameOrBefore(hasta));
      } catch (error) {
        console.error('Error procesando vigencia de normativa:', n, error);
        return false;
      }
    });
    
    return vigentes.sort((a, b) => {
      // Ordenar por código si existe, sino por nombre
      if (a.codigo && b.codigo) {
        return a.codigo.localeCompare(b.codigo);
      }
      return moment(b.vigencia_desde).diff(moment(a.vigencia_desde));
    });
  } catch (error) {
    console.error('❌ Error obteniendo tipos de horas laborales:', error);
    return [];
  }
}

/**
 * Calcula el valor de una hora según el tipo de hora laboral
 * @param {number} salarioMensual - Salario mensual del empleado
 * @param {Object} tipoHoraNormativa - Normativa del tipo de hora (con multiplicador)
 * @param {number} horasBase - Horas base mensuales (por defecto: 220)
 * @returns {number} - Valor de la hora calculada
 */
export function calcularValorHora(salarioMensual, tipoHoraNormativa, horasBase = 220) {
  if (!tipoHoraNormativa || !tipoHoraNormativa.multiplicador) {
    // Si no hay multiplicador, usar valor base
    return salarioMensual / horasBase;
  }
  
  const multiplicador = parseFloat(tipoHoraNormativa.multiplicador) || 1;
  return (salarioMensual * multiplicador) / horasBase;
}

