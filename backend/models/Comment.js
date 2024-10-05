const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      this.belongsTo(models.User, { onDelete: 'cascade' });
      this.belongsTo(models.Post, { onDelete: 'cascade' });
    }
  }
  Comment.init(
    {
      content: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Comment',
    },
  );
  return Comment;
};
