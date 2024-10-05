const DataTypes = require('sequelize').DataTypes;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('Posts', {
      fields: ['id'],
      type: 'foreign key',
      name: 'Posts_id_fkey',
      references: {
        table: 'Users',
        field: 'id',
      },
    });

    await queryInterface.addConstraint('Comments', {
      fields: ['id'],
      type: 'foreign key',
      name: 'Comments_id_fkey',
      references: {
        table: 'Users',
        field: 'id',
      },
    });

    await queryInterface.addConstraint('Reports', {
      fields: ['id'],
      type: 'foreign key',
      name: 'Reports_id_fkey',
      references: {
        table: 'Users',
        field: 'id',
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Posts', 'Posts_id_fkey');
    await queryInterface.removeConstraint('Comments', 'Comments_id_fkey');
    await queryInterface.removeConstraint('Reports', 'Reports_id_fkey');
  },
};
