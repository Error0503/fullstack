const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      this.hasMany(models.Comment);
      this.belongsTo(models.User, { onDelete: 'cascade' });
    }
  }
  Post.init(
    {
      title: DataTypes.STRING,
      body: DataTypes.STRING,
      UserId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Post',
    },
  );
  return Post;
};
