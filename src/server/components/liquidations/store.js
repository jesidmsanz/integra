"use strict";
const { Op, QueryTypes } = require("sequelize");

module.exports = function setupLiquidations(Model, db, sequelize) {
  // Obtener todas las liquidaciones
  function findAll(options = {}) {
    const { order = [["id", "DESC"]] } = options;
    return Model.findAll({ order });
  }

  // Obtener liquidaciones con nombres reales
  function findAllWithNames() {
    const query = `
      SELECT 
        l.*,
        c.companyname,
        u."firstName" as user_first_name,
        u."lastName" as user_last_name
      FROM liquidations l
      LEFT JOIN companies c ON l.company_id = c.id
      LEFT JOIN users u ON l.user_id = u.id
      ORDER BY l.id DESC
    `;

    return sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
  }

  // Obtener liquidación por ID con nombres reales y detalles
  function findByIdWithNames(id) {
    const query = `
      SELECT 
        l.*,
        c.companyname,
        u."firstName" as user_first_name,
        u."lastName" as user_last_name,
        COALESCE(
          json_agg(
            json_build_object(
              'id', ld.id,
              'employee_id', ld.employee_id,
              'employee_name', e.fullname,
              'employee_document', e.documentnumber,
              'employee_position', e.position,
              'basic_salary', ld.basic_salary,
              'transportation_assistance', ld.transportation_assistance,
              'mobility_assistance', ld.mobility_assistance,
              'total_earnings', ld.total_novedades,
              'total_deductions', ld.total_discounts,
              'net_amount', ld.net_amount
            )
          ) FILTER (WHERE ld.id IS NOT NULL), 
          '[]'::json
        ) as liquidation_details
      FROM liquidations l
      LEFT JOIN companies c ON l.company_id = c.id
      LEFT JOIN users u ON l.user_id = u.id
      LEFT JOIN liquidation_details ld ON l.id = ld.liquidation_id
      LEFT JOIN employees e ON ld.employee_id = e.id
      WHERE l.id = :id
      GROUP BY l.id, c.companyname, u."firstName", u."lastName"
    `;

    return sequelize.query(query, {
      replacements: { id },
      type: QueryTypes.SELECT,
    });
  }

  // Contar registros
  function count() {
    return Model.count();
  }

  // Buscar por ID
  function findById(id) {
    return Model.findByPk(id, {
      include: [
        {
          model: db.Companies,
          as: "company",
          attributes: ["id", "companyname"],
        },
        {
          model: db.Users,
          as: "creator",
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: db.Users,
          as: "approver",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
    });
  }

  // Crear nueva liquidación
  async function create(form) {
    try {
      const liquidation = await Model.create(form);
      return liquidation;
    } catch (error) {
      throw new Error(`Error al crear liquidación: ${error.message}`);
    }
  }

  // Actualizar liquidación
  async function update(id, model) {
    try {
      const [updatedRowsCount] = await Model.update(model, {
        where: { id },
      });

      if (updatedRowsCount === 0) {
        throw new Error("Liquidación no encontrada");
      }

      return await findById(id);
    } catch (error) {
      throw new Error(`Error al actualizar liquidación: ${error.message}`);
    }
  }

  // Eliminar liquidación
  function deleteById(id) {
    return Model.destroy({
      where: { id },
    });
  }

  // Obtener liquidación con todos los detalles
  async function findWithDetails(id) {
    try {
      const liquidation = await Model.findByPk(id, {
        include: [
          {
            model: db.Companies,
            as: "company",
            attributes: ["id", "companyname"],
          },
          {
            model: db.Users,
            as: "creator",
            attributes: ["id", "firstName", "lastName"],
          },
          {
            model: db.Users,
            as: "approver",
            attributes: ["id", "firstName", "lastName"],
          },
          {
            model: db.LiquidationDetails,
            as: "details",
            include: [
              {
                model: db.Employees,
                as: "employee",
                attributes: [
                  "id",
                  "firstname",
                  "lastname",
                  "document",
                  "position",
                ],
              },
              {
                model: db.LiquidationNews,
                as: "news",
                include: [
                  {
                    model: db.EmployeeNews,
                    as: "employeeNews",
                    attributes: ["id", "status", "approved", "document"],
                  },
                  {
                    model: db.TypeNews,
                    as: "typeNews",
                    attributes: [
                      "id",
                      "name",
                      "percentage",
                      "calculateperhour",
                      "affects",
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });

      return liquidation;
    } catch (error) {
      throw new Error(
        `Error al obtener liquidación con detalles: ${error.message}`
      );
    }
  }

  // Obtener liquidaciones con información básica (para listados)
  function findAllWithInfo() {
    return Model.findAll({
      include: [
        {
          model: db.Companies,
          as: "company",
          attributes: ["id", "companyname"],
        },
        {
          model: db.Users,
          as: "creator",
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: db.Users,
          as: "approver",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
      order: [["id", "DESC"]],
    });
  }

  // Obtener estadísticas de liquidaciones
  function getStatistics() {
    return sequelize.query(
      `
      SELECT 
        COUNT(*) as total_liquidations,
        COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_count,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_count,
        COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_count,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_count,
        SUM(total_amount) as total_amount,
        AVG(total_amount) as average_amount
      FROM liquidations
      `,
      { type: QueryTypes.SELECT }
    );
  }

  // Obtener liquidaciones por empresa
  function findByCompany(companyId, options = {}) {
    return Model.findAll({
      where: { company_id: companyId },
      ...options,
      include: [
        {
          model: db.Companies,
          as: "company",
          attributes: ["id", "companyname"],
        },
        {
          model: db.Users,
          as: "creator",
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: db.Users,
          as: "approver",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
      order: [["id", "DESC"]],
    });
  }

  // Obtener liquidaciones por período
  function findByPeriod(startDate, endDate, options = {}) {
    return Model.findAll({
      where: {
        period_start: {
          [Op.gte]: startDate,
        },
        period_end: {
          [Op.lte]: endDate,
        },
      },
      ...options,
      include: [
        {
          model: db.Companies,
          as: "company",
          attributes: ["id", "companyname"],
        },
        {
          model: db.Users,
          as: "creator",
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: db.Users,
          as: "approver",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
      order: [["id", "DESC"]],
    });
  }

  return {
    findAll,
    findAllWithNames,
    findByIdWithNames,
    count,
    findById,
    create,
    update,
    deleteById,
    findWithDetails,
    findAllWithInfo,
    getStatistics,
    findByCompany,
    findByPeriod,
  };
};
