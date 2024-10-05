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
import type { Post } from './Post';
import type { User } from './User';

type ReportAssociations = 'user' | 'post';

export class Report extends Model<
  InferAttributes<Report, { omit: ReportAssociations }>,
  InferCreationAttributes<Report, { omit: ReportAssociations }>
> {
  declare id: CreationOptional<number>;
  declare body: string;
  declare reason: 'offensive' | 'misleading' | 'spam';
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // Report belongsTo User
  declare user?: NonAttribute<User>;
  declare getUser: BelongsToGetAssociationMixin<User>;
  declare setUser: BelongsToSetAssociationMixin<User, number>;
  declare createUser: BelongsToCreateAssociationMixin<User>;

  // Report belongsTo Post
  declare post?: NonAttribute<Post>;
  declare getPost: BelongsToGetAssociationMixin<Post>;
  declare setPost: BelongsToSetAssociationMixin<Post, number>;
  declare createPost: BelongsToCreateAssociationMixin<Post>;

  declare static associations: {
    user: Association<Report, User>;
    post: Association<Report, Post>;
  };

  static initModel(sequelize: Sequelize): typeof Report {
    Report.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        body: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        reason: {
          type: DataTypes.ENUM('offensive', 'misleading', 'spam'),
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

    return Report;
  }
}
