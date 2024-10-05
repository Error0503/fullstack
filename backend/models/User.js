'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.Post);
      this.hasMany(models.Report);
    }

    comparePassword(password) {
      return bcrypt.compareSync(password, this.password);
    }

    toJSON() {
      const userData = this.get();
      if (userData.hasOwnProperty('password')) {
        delete userData.password;
      }
      return userData;
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      role: {
        type: DataTypes.ENUM('user', 'moderator', 'admin'),
        defaultValue: 'user',
      },
    },
    {
      sequelize,
      modelName: 'User',
      hooks: {
        beforeCreate: (instance) => {
          instance.password = bcrypt.hashSync(
            instance.password,
            bcrypt.genSaltSync(12),
          );
        },
      },
    },
  );

  return User;
};
