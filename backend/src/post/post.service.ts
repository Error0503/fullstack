import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './post.model';
import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/user/user.model';
import { Comment } from 'src/comment/comment.model';
import { Report } from 'src/report/report.model';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post)
    private postModel: typeof Post,
    private sequelize: Sequelize,
  ) {}

  async findAll(): Promise<Post[]> {
    return await this.postModel.findAll();
  }

  async findOne(id: string): Promise<Post> {
    return await this.postModel.findOne({
      where: {
        id,
      },
      include: [
        { model: Comment, as: 'comments' },
        { model: Report, as: 'reports' },
        { model: User, as: 'user' },
      ],
    });
  }

  async create(title: string, body: string, userId: number): Promise<Post> {
    try {
      const user = await User.findOne({
        where: {
          id: userId,
        },
      });

      if (user === null) {
        return null;
      }

      return await this.sequelize.transaction(async (t) => {
        const post = new Post();
        post.title = title;
        post.body = body;
        post.userId = user.id;
        return await post.save({ transaction: t });
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const post = await this.findOne(id);
      return await post.destroy();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async update(id: string, title: string, body: string): Promise<Post> {
    try {
      return await this.sequelize.transaction(async (t) => {
        const post = await this.findOne(id);
        post.title = title;
        post.body = body;
        return await post.save({ transaction: t });
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
