"use strict";
const { Op, QueryTypes } = require("sequelize");

module.exports = function setupTypeNews(Model, db, sequelize) {
  function findAll(options = {}) {
    const { limit, offset, order = [["id", "ASC"]] } = options;
    
    const queryOptions = {
      order,
      ...(limit !== undefined && { limit: parseInt(limit) }),
      ...(offset !== undefined && { offset: parseInt(offset) })
    };
    
    const result = Model.findAll(queryOptions);
    return result;
  }

  function count() {
    return Model.count();
  }

  function findAllActive() {
    return sequelize.query(
      ` select * from type_news where type_news.active = true`,
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
      const created = result.toJSON();
      return created;
    } catch (error) {
      console.log("Error to create", error);
      return { error };
    }
  }

  async function update(id, model) {
    try {
      // Filtrar solo los campos válidos del modelo para evitar problemas
      const fieldsToUpdate = {};
      const allowedFields = [
        'name', 'code', 'duration', 'payment', 'affects', 'applies_to', 
        'percentage', 'amount', 'category', 'active', 'notes', 
        'calculateperhour', 'isDiscount', 'payment_rule'
      ];
      
      allowedFields.forEach(field => {
        if (model.hasOwnProperty(field)) {
          fieldsToUpdate[field] = model[field];
        }
      });
      
      // Ejecutar el update
      const [affectedRows] = await Model.update(fieldsToUpdate, {
        where: { id },
      });
      
      if (affectedRows === 0) {
        return null;
      }
      
      // Obtener el registro actualizado directamente desde la BD para asegurar todos los campos
      const freshRecords = await sequelize.query(
        `SELECT * FROM type_news WHERE id = :id`,
        {
          replacements: { id },
          type: QueryTypes.SELECT,
        }
      );
      
      if (freshRecords && freshRecords.length > 0) {
        const record = freshRecords[0];
        
        // Determinar el valor de payment_rule: priorizar el valor actualizado, luego el de la BD, luego default
        const paymentRuleValue = (fieldsToUpdate.payment_rule !== undefined && fieldsToUpdate.payment_rule !== null) 
          ? fieldsToUpdate.payment_rule 
          : (record.payment_rule !== null && record.payment_rule !== undefined)
            ? record.payment_rule
            : 'normal';
        
        // Crear un objeto limpio con TODOS los campos, FORZANDO payment_rule
        const cleanRecord = {
          id: record.id,
          name: record.name,
          code: record.code,
          duration: record.duration,
          payment: record.payment,
          affects: record.affects,
          applies_to: record.applies_to,
          percentage: record.percentage,
          amount: record.amount,
          category: record.category,
          active: record.active,
          notes: record.notes,
          calculateperhour: record.calculateperhour,
          isDiscount: record.isDiscount,
          payment_rule: paymentRuleValue,
          createdAt: record.createdAt,
          updatedAt: record.updatedAt,
        };
        
        // Convertir a objeto plano para asegurar serialización correcta
        const finalRecord = JSON.parse(JSON.stringify(cleanRecord));
        
        // Asegurar que payment_rule esté presente
        if (!finalRecord.hasOwnProperty('payment_rule') || finalRecord.payment_rule === undefined) {
          finalRecord.payment_rule = paymentRuleValue;
        }
        
        // Crear un nuevo objeto para asegurar que no haya problemas de referencia
        const returnObject = {
          ...finalRecord,
          payment_rule: finalRecord.payment_rule || paymentRuleValue
        };
        
        return returnObject;
      } else {
        // Fallback: intentar con findByPk
        const updated = await Model.findByPk(id);
        if (updated) {
          const updatedData = updated.toJSON ? updated.toJSON() : updated;
          if (!updatedData.payment_rule) {
            updatedData.payment_rule = fieldsToUpdate.payment_rule || 'normal';
          }
          return updatedData;
        }
        return null;
      }
    } catch (error) {
      console.error('❌ Error al actualizar tipo de novedad:', error);
      throw error;
    }
  }

  function deleteById(_id) {
    return Model.deleteOne({
      _id,
    });
  }

  return {
    findAll,
    count,
    findAllActive,
    findById,
    create,
    update,
    deleteById,
  };
};
