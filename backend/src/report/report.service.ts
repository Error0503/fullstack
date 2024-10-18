import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Reasons, Report } from './report.model';
import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/user/user.model';
import { Post } from 'src/post/post.model';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Report)
    private reportModel: typeof Report,
    private sequelize: Sequelize,
  ) {}

  async findAll(): Promise<Report[]> {
    return await this.reportModel.findAll();
  }

  async findOne(id: string): Promise<Report> {
    return await this.reportModel.findOne({
      where: {
        id,
      },
      include: [
        { model: User, as: 'user' },
        { model: Post, as: 'post' },
      ],
    });
  }

  async create(
    body: string,
    reason: Reasons,
    userId: number,
    postId: number,
  ): Promise<Report> {
    try {
      const user = await User.findOne({
        where: {
          id: userId,
        },
      });

      const post = await Post.findOne({
        where: {
          id: postId,
        },
      });

      if (user === null || post === null) {
        return null;
      }

      return await this.sequelize.transaction(async (t) => {
        const report = new Report();
        report.body = body;
        report.reason = reason;
        report.userId = userId;
        report.postId = postId;
        return await report.save({ transaction: t });
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const report = await this.findOne(id);
      return await report.destroy();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async update(id: string, body: string, reason: Reasons): Promise<Report> {
    try {
      return await this.sequelize.transaction(async (t) => {
        const report = await this.findOne(id);
        report.body = body;
        report.reason = reason;
        return await report.save({ transaction: t });
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
