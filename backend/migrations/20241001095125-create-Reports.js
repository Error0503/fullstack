const DataTypes = require('sequelize').DataTypes;

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('Reports', {
      id: {
        type: DataTypes.INTEGER,
        field: 'id',
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      body: {
        type: DataTypes.STRING,
        field: 'body',
        allowNull: false,
      },
      reason: {
        type: DataTypes.ENUM('offensive', 'misleading', 'spam'),
        field: 'reason',
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
    await queryInterface.dropTable('Reports');
  },
};
