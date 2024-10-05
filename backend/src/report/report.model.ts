import * as _ from 'lodash';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Post } from 'src/post/post.model';
import { User } from 'src/user/user.model';

// TODO: More?
export enum Reasons {
  OFFENSIVE = 'offensive',
  SPAM = 'spam',
  MISLEADING = 'misleading',
}

const reasons: string[] = _.values(Reasons);

@Table
export class Report extends Model<Report> {
  @Column
  body: string;

  @Column({
    type: DataType.ENUM({ values: reasons }),
    allowNull: false,
    validate: {
      isIn: [reasons],
    },
  })
  reason: string;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Post)
  @Column
  postId: number;

  @BelongsTo(() => Post)
  post: Post;
}
