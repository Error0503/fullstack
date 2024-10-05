'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        field: 'id',
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING,
        field: 'username',
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        field: 'password',
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM('user', 'moderator', 'admin'),
        field: 'role',
        allowNull: false,
        defaultValue: 'user',
      },
      createdAt: {
        type: Sequelize.DATE,
        field: 'createdAt',
      },
      updatedAt: {
        type: Sequelize.DATE,
        field: 'updatedAt',
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Users');
  },
};
