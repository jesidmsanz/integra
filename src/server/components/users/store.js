"use strict";

module.exports = function setupUser(UserModel, db, sequelize) {
  function findById(id) {
    return UserModel.findByPk(id);
  }

  async function exists(user) {
    const cond = {
      $or: [
        { uuid: user.uuid },
        { username: user.username },
        { email: user.email },
      ],
    };
    const exists = await UserModel.findOne(cond).lean();
    return exists;
  }

  async function createOrUpdate(user) {
    const existingUser = await exists(user);
    if (existingUser) {
      const updated = await UserModel.updated(user, cond);
      return updated ? UserModel.findOne(cond) : existingUser;
    }

    const result = await UserModel.create(user);
    return result.toJSON();
  }

  async function create(user) {
    const myModel = new UserModel(user);
    await myModel.save();
    const result = { ...myModel };
    return result._doc;
  }

  function findByUuid(uuid) {
    return UserModel.findOne({
      where: {
        uuid,
      },
    });
  }

  function findAll() {
    return UserModel.findAll();
  }

  function findByUsername(username) {
    return UserModel.findOne(
      {
        where: {
          Email: username,
        },
      },
      { raw: true }
    );
  }

  async function updateRefreshToken(id, refreshToken) {
    console.log('id updateRefreshToken:>> ', id);
    const result = await UserModel.update(
      { refreshToken },
      {
        where: {
          id,
        },
      }
    );
    console.log("Update Refresh Token");
    return result;
  }

  async function updateAccessToken(id, accessToken) {
    console.log('id updateAccessToken:>> ', id);
    const result = await UserModel.update(
      { accessToken },
      {
        where: {
          id,
        },
      }
    );
    console.log("Update Access Token");
    return result;
  }

  async function changePassword({ id, password }) {
    const result = await UserModel.update(
      { password },
      {
        where: {
          id,
        },
      }
    );
    return result;
  }

  return {
    findById,
    exists,
    createOrUpdate,
    create,
    findByUuid,
    findAll,
    findByUsername,
    updateRefreshToken,
    updateAccessToken,
    changePassword,
  };
};
