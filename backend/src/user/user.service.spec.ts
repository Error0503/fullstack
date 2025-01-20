import { Test, TestingModule } from '@nestjs/testing';
import { Sequelize } from 'sequelize-typescript';
import { getModelToken } from '@nestjs/sequelize';
import { UserService } from './user.service';
import { User } from './user.model';
import { Post } from '../post/post.model';
import { Comment } from '../comment/comment.model';
import { Report } from '../report/report.model';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let service: UserService;
  let sequelize: Sequelize;
  let userModel: typeof User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User),
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            destroy: jest.fn(),
          },
        },
        {
          provide: Sequelize,
          useValue: new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
          }),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    sequelize = module.get<Sequelize>(Sequelize);
    userModel = module.get<typeof User>(getModelToken(User));

    sequelize.addModels([User, Post, Comment, Report]);
    await sequelize.sync({ force: true });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have userModel defined', () => {
    expect(service['userModel']).toBeDefined();
    expect(service['userModel']).toBe(userModel);
  });

  it('should have sequelize defined', () => {
    expect(service['sequelize']).toBeDefined();
    expect(service['sequelize']).toBe(sequelize);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [{ id: '1', username: 'test' }];
      jest.spyOn(userModel, 'findAll').mockResolvedValue(users as any);
      expect(await service.findAll()).toBe(users);
    });
  });

  describe('findOneById', () => {
    it('should return a user by id', async () => {
      const user = { id: '1', username: 'test' };
      jest.spyOn(userModel, 'findOne').mockResolvedValue(user as any);
      expect(await service.findOneById('1')).toBe(user);
    });
  });

  describe('findOneByUsername', () => {
    it('should return a user by username', async () => {
      const user = { id: '1', username: 'test' };
      jest.spyOn(userModel, 'findOne').mockResolvedValue(user as any);
      expect(await service.findOneByUsername('test')).toBe(user);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const user = {
        id: 1,
        username: 'test',
        password: 'hashedPassword',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(service, 'findOneByUsername').mockResolvedValue(null);
      jest.spyOn(userModel, 'create').mockResolvedValue(user as any);
      jest.spyOn(bcrypt, 'hashSync').mockReturnValue('hashedPassword');
      const createdUser = await service.create('test', 'password');
      expect(createdUser).toMatchObject({
        id: 1,
        username: 'test',
        password: 'hashedPassword',
        role: 'user',
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      const user = { id: '1', username: 'test' };
      jest.spyOn(service, 'findOneByUsername').mockResolvedValue(user as any);
      await expect(service.create('test', 'password')).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a user by id', async () => {
      const user = {
        id: '1',
        username: 'test',
        destroy: jest.fn().mockResolvedValue(true),
      };
      jest.spyOn(service, 'findOneById').mockResolvedValue(user as any);
      await service.delete('1');
      expect(user.destroy).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(service, 'findOneById').mockResolvedValue(null);
      await expect(service.delete('1')).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on error', async () => {
      jest.spyOn(service, 'findOneById').mockRejectedValue(new Error());
      await expect(service.delete('1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should handle errors during user deletion', async () => {
      jest.spyOn(service, 'findOneById').mockResolvedValue(new User());
      jest
        .spyOn(User.prototype, 'destroy')
        .mockRejectedValue(new Error('Deletion error'));

      await expect(service.delete('1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const user = {
        id: '1',
        username: 'test',
        password: 'hashedPassword',
        save: jest.fn().mockResolvedValue(true),
      };
      jest.spyOn(service, 'findOneById').mockResolvedValue(user as any);
      jest.spyOn(bcrypt, 'hashSync').mockReturnValue('hashedPassword');
      await service.update('1', 'newUsername', 'newPassword');
      expect(user.username).toBe('newUsername');
      expect(user.password).toBe('hashedPassword');
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(service, 'findOneById').mockResolvedValue(null);
      await expect(
        service.update('1', 'newUsername', 'newPassword'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on error', async () => {
      jest.spyOn(service, 'findOneById').mockRejectedValue(new Error());
      await expect(
        service.update('1', 'newUsername', 'newPassword'),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
