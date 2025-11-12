const db = require("../../db/index.js");

function list(filters = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      const { Normativas } = await db();
      const result = await Normativas.findAll(filters);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

function findById(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const { Normativas } = await db();
      const result = await Normativas.findById(id);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

function create(obj) {
  return new Promise(async (resolve, reject) => {
    try {
      const { Normativas } = await db();
      const result = await Normativas.create(obj);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

function update(_id, obj) {
  console.log('controller obj', obj)
  return new Promise(async (resolve, reject) => {
    try {
      const { Normativas } = await db();
      // Convertir ID a número
      const id = parseInt(_id, 10);
      if (isNaN(id)) {
        throw new Error(`ID inválido: ${_id}`);
      }
      
      // Asegurar que activa sea un booleano
      if (obj.activa !== undefined) {
        // Convertir a booleano correctamente
        if (obj.activa === true || obj.activa === 'true' || obj.activa === 1 || obj.activa === '1') {
          obj.activa = true;
        } else {
          obj.activa = false;
        }
      }
      
      console.log('🔧 Controller: Actualizando normativa ID:', id, 'con datos:', JSON.stringify(obj, null, 2));
      const result = await Normativas.update(id, obj);
      console.log('✅ Controller: Resultado:', result ? 'Éxito' : 'Error');
      resolve(result);
    } catch (error) {
      console.error('❌ Controller: Error actualizando normativa:', error);
      reject(error);
    }
  });
}

function deleteById(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const { Normativas } = await db();
      const result = await Normativas.deleteById(id);
      resolve(result);
    } catch (error) {
      console.error('❌ Controller: Error eliminando normativa:', error);
      reject(error);
    }
  });
}

function getVigentes(fecha = new Date()) {
  return new Promise(async (resolve, reject) => {
    try {
      const { Normativas } = await db();
      const result = await Normativas.getVigentes(fecha);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

function getVigenteByTipo(tipo, fecha = new Date()) {
  return new Promise(async (resolve, reject) => {
    try {
      const { Normativas } = await db();
      const result = await Normativas.getVigenteByTipo(tipo, fecha);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  list,
  findById,
  create,
  update,
  deleteById,
  getVigentes,
  getVigenteByTipo,
};