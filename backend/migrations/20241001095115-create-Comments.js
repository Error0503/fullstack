const DataTypes = require('sequelize').DataTypes;

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('Comments', {
      id: {
        type: DataTypes.INTEGER,
        field: 'id',
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING,
        field: 'content',
        allowNull: false,
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
    await queryInterface.dropTable('Comments');
  },
};
