const Sequelize = require("sequelize");
const setupDatabase = require("../../db/lib/postgresql");
module.exports = function (config) {
  const sequelize = setupDatabase(config);
  const Model = sequelize.define(
    "users",
    {
      uuid: {
        type: Sequelize.STRING(),
        allowNull: true,
        comment: "Code",
      },
      Email: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "email",
      },
      Password: {
        type: Sequelize.STRING(),
        allowNull: true,
        comment: "Password",
      },
      FirstName: {
        type: Sequelize.STRING(),
        allowNull: true,
        comment: "FirstName",
      },
      LastName: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "LastName",
      },
      Phone: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "Phone",
      },
      Roles: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
        comment: "roles",
      },
      accessToken: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "roles",
      },
      refreshToken: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "roles",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: "FCREACION",
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: "FECHA_ACTUALIZACION",
      },
    },
    { tableName: "users", timestamps: true }
  );

  // Método personalizado para validar la contraseña
  Model.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.Password);
  };

  // Hook antes de crear un usuario para encriptar la contraseña
  Model.beforeCreate((user) => {
    user.Password = bcrypt.hashSync(
      user.Password,
      bcrypt.genSaltSync(10),
      null
    );
  });

  return Model;
};
