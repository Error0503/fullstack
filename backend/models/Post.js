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
      heroId: DataTypes.INTEGER,
      title: DataTypes.STRING,
      shortDescription: DataTypes.STRING,
      body: DataTypes.JSON,
      UserId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Post',
    },
  );
  return Post;
};
