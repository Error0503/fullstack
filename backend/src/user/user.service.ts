import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User, UserRoles } from './user.model';
import { Sequelize } from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';

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

  async findOne(id: string): Promise<User> {
    return await this.userModel.findOne({
      where: {
        id,
      },
    });
  }

  async create(username: string, password: string): Promise<User> {
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
      return null;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const user = await this.findOne(id);
      return await user.destroy();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async update(id: string, username: string, password: string): Promise<User> {
    try {
      return await this.sequelize.transaction(async (t) => {
        const user = await this.findOne(id);
        user.username = username;
        const hashedPwd = bcrypt.hashSync(password, bcrypt.genSaltSync(12));
        user.password = hashedPwd;
        return await user.save({ transaction: t });
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
