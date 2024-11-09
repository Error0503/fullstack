import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Post } from 'src/post/post.model';
import { User } from 'src/user/user.model';

@Table
export class Comment extends Model<Comment> {
  @Column
  content: string;

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
