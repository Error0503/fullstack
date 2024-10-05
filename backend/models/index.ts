import type { Sequelize } from 'sequelize';
import { User } from './User';
import { Post } from './Post';
import { Comment } from './Comment';
import { Report } from './Report';

export { User, Post, Comment, Report };

export function initModels(sequelize: Sequelize) {
  User.initModel(sequelize);
  Post.initModel(sequelize);
  Comment.initModel(sequelize);
  Report.initModel(sequelize);

  User.hasMany(Post, {
    as: 'posts',
    foreignKey: 'id',
  });
  User.hasMany(Comment, {
    as: 'comments',
    foreignKey: 'id',
  });
  User.hasMany(Report, {
    as: 'reports',
    foreignKey: 'id',
  });
  Post.belongsTo(User, {
    as: 'user',
    foreignKey: 'id',
  });
  Comment.belongsTo(User, {
    as: 'user',
    foreignKey: 'id',
  });
  Comment.belongsTo(Post, {
    as: 'post',
    foreignKey: 'id',
  });
  Report.belongsTo(User, {
    as: 'user',
    foreignKey: 'id',
  });
  Report.belongsTo(Post, {
    as: 'post',
    foreignKey: 'id',
  });

  return {
    User,
    Post,
    Comment,
    Report,
  };
}
