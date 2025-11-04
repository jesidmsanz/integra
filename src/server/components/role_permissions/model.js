const Sequelize = require("sequelize");
const setupDatabase = require("../../db/lib/postgresql");

module.exports = function (config) {
  const sequelize = setupDatabase(config);
  const Model = sequelize.define(
    "role_permissions",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "roles",
          key: "id",
        },
        comment: "ID del rol",
      },
      permission_key: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: "Clave del permiso (ej: liquidation.create)",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: "Creation Date",
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: "Update Date",
      },
    },
    {
      tableName: "role_permissions",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["role_id", "permission_key"],
          name: "unique_role_permission",
        },
      ],
    }
  );

  return Model;
};

