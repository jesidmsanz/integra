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
      email: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "email",
      },
      password: {
        type: Sequelize.STRING(),
        allowNull: true,
        comment: "Password",
      },
      firstName: {
        type: Sequelize.STRING(),
        allowNull: true,
        comment: "firstName",
      },
      lastName: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "lastName",
      },
      phone: {
        type: Sequelize.STRING(),
        allowNull: false,
        comment: "phone",
      },
      roles: {
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
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        comment: "Active",
        default: true,
      },
      createdat: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: "Creation Date",
      },
      updatedat: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: "Update Date",
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
