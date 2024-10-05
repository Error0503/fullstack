const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    static associate(models) {
      this.belongsTo(models.User, { onDelete: 'cascade' });
      this.belongsTo(models.Post, { onDelete: 'cascade' });
    }
  }
  Report.init(
    {
      body: DataTypes.STRING,
      reason: DataTypes.ENUM('offensive', 'misleading', 'spam'),
    },
    {
      sequelize,
      modelName: 'Report',
    },
  );

  return Report;
};
