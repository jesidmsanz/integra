"use strict";
const { Op, QueryTypes } = require("sequelize");

module.exports = function setupNormativas(Model, db, sequelize) {
  /**
   * Desactiva automáticamente las normativas que han cumplido su fecha de vencimiento
   * Esta función se ejecuta de forma asíncrona sin bloquear las consultas
   */
  async function desactivarVencidas() {
    try {
      const fechaActual = new Date().toISOString().split('T')[0];
      
      // Buscar y desactivar normativas vencidas
      const result = await Model.update(
        { activa: false },
        {
          where: {
            activa: true,
            vigencia_hasta: {
              [Op.not]: null,
              [Op.lt]: fechaActual
            }
          }
        }
      );
      
      if (result[0] > 0) {
        console.log(`✅ Se desactivaron ${result[0]} normativa(s) vencida(s)`);
      }
    } catch (error) {
      console.error('Error al desactivar normativas vencidas:', error);
      // No lanzamos el error para no interrumpir las consultas
    }
  }

  async function findAll(filters = {}) {
    // Desactivar normativas vencidas antes de consultar
    await desactivarVencidas();
    
    const whereClause = {};
    
    // Filtro por tipo
    if (filters.tipo) {
      whereClause.tipo = filters.tipo;
    }
    
    // Filtro por activa
    if (filters.activa !== undefined && filters.activa !== '') {
      whereClause.activa = filters.activa === 'true';
    }
    
    // Filtro por búsqueda en nombre
    if (filters.search) {
      whereClause.nombre = {
        [Op.iLike]: `%${filters.search}%`
      };
    }

    return Model.findAll({
      where: whereClause,
      order: [
        ['vigencia_desde', 'DESC'],
        ['created_at', 'DESC']
      ]
    });
  }

  function findById(id) {
    return Model.findByPk(id);
  }

  async function create(model) {
    const result = await Model.create(model);
    return result;
  }

  async function update(_id, model) {
    console.log('🔄 Store: Actualizando normativa', _id, 'con datos:', model);
    
    // Asegurar que activa sea explícitamente un booleano para PostgreSQL
    const updateData = { ...model };
    if (updateData.activa !== undefined) {
      // Convertir explícitamente a booleano - manejar todos los casos
      if (updateData.activa === true || updateData.activa === 'true' || updateData.activa === 1 || updateData.activa === '1') {
        updateData.activa = true;
      } else {
        // Cualquier otro valor (false, 'false', 0, '0', null, undefined, etc.) se convierte a false
        updateData.activa = false;
      }
    }
    
    console.log('🔄 Store: Datos a actualizar (después de conversión):', JSON.stringify(updateData, null, 2));
    console.log('🔄 Store: Valor de activa:', updateData.activa, 'tipo:', typeof updateData.activa);
    
    // Verificar el valor actual antes de actualizar
    const before = await Model.findByPk(_id);
    if (before) {
      console.log('📋 Store: Valor ANTES de actualizar - activa:', before.activa, 'tipo:', typeof before.activa);
    }
    
    // Intentar actualizar con Sequelize
    let result = await Model.update(updateData, {
      where: { id: _id }
    });
    
    console.log('✅ Store: Resultado de actualización Sequelize:', result[0], 'filas afectadas');
    
    // Si no se actualizó ninguna fila o si activa es false, usar consulta SQL directa para asegurar
    if (result[0] === 0 || (updateData.activa !== undefined && updateData.activa === false)) {
      console.log('⚠️ Store: Usando consulta SQL directa para asegurar la actualización de activa');
      
      // Construir la consulta SQL dinámicamente con todos los campos
      const setClauses = [];
      const replacements = { id: _id };
      
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          setClauses.push(`${key} = :${key}`);
          replacements[key] = updateData[key];
        }
      });
      
      setClauses.push('updated_at = CURRENT_TIMESTAMP');
      
      const sqlQuery = `UPDATE normativas 
                        SET ${setClauses.join(', ')}
                        WHERE id = :id`;
      
      console.log('🔍 Store: SQL Query:', sqlQuery);
      console.log('🔍 Store: Replacements:', replacements);
      
      const sqlResult = await sequelize.query(sqlQuery, {
        replacements: replacements,
        type: QueryTypes.UPDATE
      });
      
      console.log('✅ Store: Resultado de actualización SQL directa:', sqlResult);
    }
    
    // Obtener el registro actualizado directamente de la BD
    const updated = await Model.findByPk(_id, {
      raw: false // Asegurar que devuelva una instancia del modelo
    });
    
    if (updated) {
      const jsonData = updated.toJSON();
      console.log('📋 Store: Normativa actualizada:', JSON.stringify(jsonData, null, 2));
      console.log('📋 Store: Valor de activa DESPUÉS de actualizar:', jsonData.activa, 'tipo:', typeof jsonData.activa);
      
      // Verificación adicional: consulta directa a la BD
      const directQuery = await sequelize.query(
        `SELECT id, activa FROM normativas WHERE id = :id`,
        {
          replacements: { id: _id },
          type: QueryTypes.SELECT
        }
      );
      if (directQuery && directQuery.length > 0) {
        console.log('🔍 Store: Verificación directa en BD - activa:', directQuery[0].activa, 'tipo:', typeof directQuery[0].activa);
      }
    } else {
      console.error('❌ Store: No se pudo obtener la normativa actualizada');
    }
    
    return updated;
  }

  async function deleteById(id) {
    // Verificar si hay referencias en employee_news
    const hasReferences = await sequelize.query(
      `SELECT COUNT(*) as count FROM employee_news WHERE hour_type_id = :id`,
      {
        replacements: { id },
        type: QueryTypes.SELECT
      }
    );

    const count = hasReferences[0]?.count || 0;
    
    if (count > 0) {
      throw new Error(`No se puede eliminar esta hora extra porque está siendo utilizada en ${count} novedad(es) de empleado(s). Por favor, desactívela en lugar de eliminarla.`);
    }

    // Si no hay referencias, eliminar físicamente
    return Model.destroy({
      where: { id }
    });
  }

  async function getVigentes(fecha = new Date()) {
    // Desactivar normativas vencidas antes de consultar
    await desactivarVencidas();
    
    const fechaStr = fecha instanceof Date ? fecha.toISOString().split('T')[0] : fecha;
    
    return Model.findAll({
      where: {
        activa: true,
        vigencia_desde: {
          [Op.lte]: fechaStr
        },
        [Op.or]: [
          { vigencia_hasta: null },
          { vigencia_hasta: { [Op.gte]: fechaStr } }
        ]
      },
      order: [
        ['tipo', 'ASC'],
        ['vigencia_desde', 'DESC']
      ]
    });
  }

  async function getVigenteByTipo(tipo, fecha = new Date()) {
    // Desactivar normativas vencidas antes de consultar
    await desactivarVencidas();
    
    const fechaStr = fecha instanceof Date ? fecha.toISOString().split('T')[0] : fecha;
    
    return Model.findOne({
      where: {
        tipo: tipo,
        activa: true,
        vigencia_desde: {
          [Op.lte]: fechaStr
        },
        [Op.or]: [
          { vigencia_hasta: null },
          { vigencia_hasta: { [Op.gte]: fechaStr } }
        ]
      },
      order: [['vigencia_desde', 'DESC']]
    });
  }

  return {
    findAll,
    findById,
    create,
    update,
    deleteById,
    getVigentes,
    getVigenteByTipo
  };
};