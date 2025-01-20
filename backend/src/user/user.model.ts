import * as _ from 'lodash';
import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Comment } from '../comment/comment.model';
import { Post } from '../post/post.model';
import { Report } from '../report/report.model';

export enum UserRoles {
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
}

const roles: string[] = _.values(UserRoles);

@Table
export class User extends Model<User> {
  @Column
  username: string;

  @Column
  password: string;

  @Column({
    type: DataType.ENUM({ values: roles }),
    allowNull: false,
    validate: {
      isIn: [roles],
    },
  })
  role: string;

  @HasMany(() => Post)
  posts: Post[];

  @HasMany(() => Comment)
  comments: Comment[];

  @HasMany(() => Report)
  reports: Report[];
}
