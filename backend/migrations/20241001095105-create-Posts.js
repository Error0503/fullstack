const DataTypes = require('sequelize').DataTypes;

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('Posts', {
      id: {
        type: DataTypes.INTEGER,
        field: 'id',
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        field: 'title',
        allowNull: false,
      },
      body: {
        type: DataTypes.STRING,
        field: 'body',
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
    await queryInterface.dropTable('Posts');
  },
};
