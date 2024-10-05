import {
  Association,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin,
  CreationOptional,
  DataTypes,
  InferCreationAttributes,
  InferAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from 'sequelize';
import type { User } from './User';

type PostAssociations = 'user';

export class Post extends Model<
  InferAttributes<Post, { omit: PostAssociations }>,
  InferCreationAttributes<Post, { omit: PostAssociations }>
> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare body: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // Post belongsTo User
  declare user?: NonAttribute<User>;
  declare getUser: BelongsToGetAssociationMixin<User>;
  declare setUser: BelongsToSetAssociationMixin<User, number>;
  declare createUser: BelongsToCreateAssociationMixin<User>;

  declare static associations: {
    user: Association<Post, User>;
  };

  static initModel(sequelize: Sequelize): typeof Post {
    Post.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        body: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.DATE,
        },
        updatedAt: {
          type: DataTypes.DATE,
        },
      },
      {
        sequelize,
      },
    );

    return Post;
  }
}
