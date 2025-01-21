'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reports', {
      id: {
        type: Sequelize.INTEGER,
        field: 'id',
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('open', 'in-progress', 'resolved'),
        field: 'status',
        allowNull: false,
      },
      reason: {
        type: Sequelize.ENUM('offensive', 'misleading', 'spam'),
        field: 'reason',
        allowNull: false,
      },
      body: {
        type: Sequelize.STRING,
        field: 'body',
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        field: 'createdAt',
      },
      updatedAt: {
        type: Sequelize.DATE,
        field: 'updatedAt',
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'UserId',
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'cascade',
      },
      PostId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'PostId',
        references: {
          model: 'Posts',
          key: 'id',
        },
        onDelete: 'cascade',
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Reports');
  },
};
