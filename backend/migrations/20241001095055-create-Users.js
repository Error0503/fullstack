const DataTypes = require('sequelize').DataTypes;

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('Users', {
      id: {
        type: DataTypes.INTEGER,
        field: 'id',
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        field: 'username',
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        field: 'password',
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('user', 'moderator', 'admin'),
        field: 'role',
        allowNull: false,
        defaultValue: 'user',
      },
      createdAt: {
        type: DataTypes.DATE,
        field: 'createdAt',
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: 'updatedAt',
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Users');
  },
};
