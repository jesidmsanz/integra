const setupNormativesModel = require("./model");
const setupDatabase = require("../../db/lib/postgresql");
const config = require("../../config/configPostgres");

const normativesModel = setupNormativesModel(setupDatabase(config));

// Obtener todas las normativas
const list = async (req, res) => {
  try {
    const { page = 1, limit = 10, active_only = false } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};
    if (active_only === 'true') {
      whereClause.is_active = true;
    }

    const { count, rows } = await normativesModel.findAndCountAll({
      where: whereClause,
      order: [['effective_date', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Error al obtener normativas:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Obtener normativa por ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const normativa = await normativesModel.findByPk(id);

    if (!normativa) {
      return res.status(404).json({
        success: false,
        message: "Normativa no encontrada",
      });
    }

    res.json({
      success: true,
      data: normativa,
    });
  } catch (error) {
    console.error("Error al obtener normativa:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Obtener normativa vigente para una fecha específica
const getActiveByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const targetDate = new Date(date);

    const normativa = await normativesModel.findOne({
      where: {
        effective_date: {
          [require('sequelize').Op.lte]: targetDate,
        },
        [require('sequelize').Op.or]: [
          { expiration_date: null },
          { expiration_date: { [require('sequelize').Op.gte]: targetDate } }
        ],
        is_active: true,
      },
      order: [['effective_date', 'DESC']],
    });

    if (!normativa) {
      return res.status(404).json({
        success: false,
        message: "No hay normativa vigente para la fecha especificada",
      });
    }

    res.json({
      success: true,
      data: normativa,
    });
  } catch (error) {
    console.error("Error al obtener normativa vigente:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Crear nueva normativa
const create = async (req, res) => {
  try {
    const normativaData = {
      ...req.body,
      created_by: req.user?.id || null,
      updated_by: req.user?.id || null,
    };

    // Validar que no haya conflictos de fechas
    const existingNormativa = await normativesModel.findOne({
      where: {
        effective_date: normativaData.effective_date,
        is_active: true,
      },
    });

    if (existingNormativa) {
      return res.status(409).json({
        success: false,
        message: "Ya existe una normativa activa para esta fecha de vigencia",
      });
    }

    const normativa = await normativesModel.create(normativaData);

    res.status(201).json({
      success: true,
      message: "Normativa creada exitosamente",
      data: normativa,
    });
  } catch (error) {
    console.error("Error al crear normativa:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Actualizar normativa
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updated_by: req.user?.id || null,
    };

    const normativa = await normativesModel.findByPk(id);
    if (!normativa) {
      return res.status(404).json({
        success: false,
        message: "Normativa no encontrada",
      });
    }

    await normativa.update(updateData);

    res.json({
      success: true,
      message: "Normativa actualizada exitosamente",
      data: normativa,
    });
  } catch (error) {
    console.error("Error al actualizar normativa:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Desactivar normativa
const deactivate = async (req, res) => {
  try {
    const { id } = req.params;

    const normativa = await normativesModel.findByPk(id);
    if (!normativa) {
      return res.status(404).json({
        success: false,
        message: "Normativa no encontrada",
      });
    }

    await normativa.update({
      is_active: false,
      updated_by: req.user?.id || null,
    });

    res.json({
      success: true,
      message: "Normativa desactivada exitosamente",
    });
  } catch (error) {
    console.error("Error al desactivar normativa:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Eliminar normativa
const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const normativa = await normativesModel.findByPk(id);
    if (!normativa) {
      return res.status(404).json({
        success: false,
        message: "Normativa no encontrada",
      });
    }

    // Verificar si la normativa está siendo usada
    if (normativa.is_active) {
      return res.status(400).json({
        success: false,
        message: "No se puede eliminar una normativa activa",
      });
    }

    await normativa.destroy();

    res.json({
      success: true,
      message: "Normativa eliminada exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar normativa:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

module.exports = {
  list,
  getById,
  getActiveByDate,
  create,
  update,
  deactivate,
  remove,
};


