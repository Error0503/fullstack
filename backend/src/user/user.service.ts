import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User, UserRoles } from './user.model';
import { Sequelize } from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
import { Post } from 'src/post/post.model';
import { Report } from 'src/report/report.model';
import { Comment } from 'src/comment/comment.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private sequelize: Sequelize,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userModel.findAll();
  }

  async findOneById(id: string): Promise<User> {
    return await this.userModel.findOne({
      where: {
        id,
      },
      include: [
        { model: Post, as: 'posts' },
        { model: Comment, as: 'comments' },
        { model: Report, as: 'reports' },
      ],
    });
  }

  async findOneByUsername(username: string): Promise<User> {
    return await this.userModel.findOne({
      where: {
        username,
      },
      include: [
        { model: Post, as: 'posts' },
        { model: Comment, as: 'comments' },
        { model: Report, as: 'reports' },
      ],
    });
  }

  async create(username: string, password: string): Promise<User> {
    const existingUser = await this.findOneByUsername(username).catch(
      () => null,
    );

    if (existingUser) {
      throw new ConflictException(
        `User with username ${username} already exists`,
      );
    }

    try {
      return await this.sequelize.transaction(async (t) => {
        const user = new User();
        user.username = username;
        const hashedPwd = bcrypt.hashSync(password, bcrypt.genSaltSync(12));
        user.password = hashedPwd;
        user.role = UserRoles.USER;
        return await user.save({ transaction: t });
      });
    } catch (error) {
      console.error(error);
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const user = await this.findOneById(id);
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      await user.destroy();
    } catch (error) {
      console.error(error);

      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error deleting user');
    }
  }

  async update(id: string, username: string, password: string): Promise<User> {
    try {
      return await this.sequelize.transaction(async (t) => {
        const user = await this.findOneById(id);
        if (!user) {
          throw new NotFoundException(`User with id ${id} not found`);
        }
        user.username = username;
        const hashedPwd = bcrypt.hashSync(password, bcrypt.genSaltSync(12));
        user.password = hashedPwd;
        return await user.save({ transaction: t });
      });
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating user');
    }
  }
}
