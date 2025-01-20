import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Comment } from 'src/comment/comment.model';
import { Report } from 'src/report/report.model';
import { User } from 'src/user/user.model';

@Table
export class Post extends Model<Post> {
  @Column
  title: string;

  @Column
  heroId: number;

  @Column
  shortDescription: string;

  @Column
  body: string;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => Comment)
  comments: Comment[];

  @HasMany(() => Report)
  reports: Report[];
}
