import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Comment } from './comment.model';
import { Post } from 'src/post/post.model';
import { User } from 'src/user/user.model';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment)
    private commentModel: typeof Comment,
    private sequelize: Sequelize,
  ) {}

  async findAll(): Promise<Comment[]> {
    return await this.commentModel.findAll();
  }

  async findOne(id: string): Promise<Comment> {
    return await this.commentModel.findOne({
      where: {
        id,
      },
      include: [
        { model: Post, as: 'post' },
        { model: User, as: 'user' },
      ],
    });
  }

  async create(
    postId: number,
    userId: number,
    content: string,
  ): Promise<Comment> {
    try {
      const post = await Post.findOne({
        where: {
          id: postId,
        },
      });

      const user = await User.findOne({
        where: {
          id: userId,
        },
      });

      if (post === null || user === null) {
        return null;
      }

      return await this.sequelize.transaction(async (t) => {
        const comment = new Comment();
        comment.postId = postId;
        comment.userId = userId;
        comment.content = content;
        return await comment.save({ transaction: t });
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const comment = await this.findOne(id);
      return await comment.destroy();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async update(id: string, content: string): Promise<Comment> {
    try {
      return await this.sequelize.transaction(async (t) => {
        const comment = await this.findOne(id);
        comment.content = content;
        return await comment.save({ transaction: t });
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
