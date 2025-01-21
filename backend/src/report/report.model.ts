import * as _ from 'lodash';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Post } from '../post/post.model';
import { User } from '../user/user.model';

// TODO: More?
export enum Reasons {
  OFFENSIVE = 'offensive',
  SPAM = 'spam',
  MISLEADING = 'misleading',
}

export enum Statuses {
  OPEN = 'open',
  IN_PROGRESS = 'in-progress',
  RESOLVED = 'resolved',
}

const reasons: string[] = _.values(Reasons);
const statuses: string[] = _.values(Statuses);

@Table
export class Report extends Model<Report> {
  @Column({
    type: DataType.ENUM({ values: statuses }),
    allowNull: false,
    validate: {
      isIn: [statuses],
    },
  })
  status: string;

  @Column({
    type: DataType.ENUM({ values: reasons }),
    allowNull: false,
    validate: {
      isIn: [reasons],
    },
  })
  reason: string;

  @Column
  body: string;

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
