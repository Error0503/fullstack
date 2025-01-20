'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Posts', {
      id: {
        type: Sequelize.INTEGER,
        field: 'id',
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      heroId: {
        type: Sequelize.INTEGER,
        field: 'heroId',
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        field: 'title',
        allowNull: false,
      },
      shortDescription: {
        type: Sequelize.STRING,
        field: 'shortDescription',
        allowNull: false,
      },
      body: {
        type: Sequelize.JSON,
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
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Posts');
  },
};
