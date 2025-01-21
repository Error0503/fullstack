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
      status: DataTypes.ENUM('open', 'in-progress', 'resolved'),
      reason: DataTypes.ENUM('offensive', 'misleading', 'spam'),
      body: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Report',
    },
  );

  return Report;
};
