import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Reasons, Report, Statuses } from './report.model';
import { Sequelize } from 'sequelize-typescript';
import { User } from '../user/user.model';
import { Post } from '../post/post.model';

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

  async filter(statusFilter: Statuses): Promise<Report[]> {
    return await this.reportModel.findAll({
      where: {
        status: statusFilter,
      },
    });
  }

  async create(
    status: Statuses,
    reason: Reasons,
    body: string,
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
        report.status = status;
        report.reason = reason;
        report.body = body;
        report.userId = userId;
        report.postId = postId;
        return await report.save({ transaction: t });
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async update(id: string, status: Statuses): Promise<Report> {
    try {
      return await this.sequelize.transaction(async (t) => {
        const report = await this.findOne(id);
        report.status = status;
        return await report.save({ transaction: t });
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
