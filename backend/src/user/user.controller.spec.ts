import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';

describe('UserController', () => {
  let app;
  let userServiceMock: any;

  beforeAll(async () => {
    userServiceMock = {
      findOneById: jest.fn(),
      findOneByUsername: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: userServiceMock,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  describe('GET /user', () => {
    it('should return a user by ID', () => {
      const user = { id: '1', username: 'testuser' };
      userServiceMock.findOneById.mockResolvedValue(user);
      return request(app.getHttpServer())
        .get('/user?id=1')
        .expect(HttpStatus.OK)
        .expect(user);
    });

    it('should return 404 if user not found', () => {
      userServiceMock.findOneById.mockResolvedValue(null);
      return request(app.getHttpServer())
        .get('/user?id=999')
        .expect(HttpStatus.NOT_FOUND)
        .expect({ message: 'Data not found' });
    });
  });

  describe('POST /user', () => {
    it('should create a new user successfully', () => {
      const user = { id: '1', username: 'testuser' };
      userServiceMock.create.mockResolvedValue(user);
      return request(app.getHttpServer())
        .post('/user')
        .send({ username: 'testuser', password: 'password123' })
        .expect(HttpStatus.CREATED)
        .expect(user);
    });

    it('should return 409 if username already exists', () => {
      userServiceMock.create.mockResolvedValue(null);
      return request(app.getHttpServer())
        .post('/user')
        .send({ username: 'existinguser', password: 'password123' })
        .expect(HttpStatus.CONFLICT)
        .expect({ message: 'Username already exists' });
    });
  });

  describe('DELETE /user/:id', () => {
    it('should delete a user by ID', () => {
      userServiceMock.delete.mockResolvedValue(true);
      return request(app.getHttpServer())
        .delete('/user/1')
        .expect(HttpStatus.NO_CONTENT);
    });

    it('should return 404 if user not found', () => {
      userServiceMock.delete.mockResolvedValue(null);
      return request(app.getHttpServer())
        .delete('/user/999')
        .expect(HttpStatus.NOT_FOUND)
        .expect({ message: 'User not found' });
    });
  });

  describe('PUT /user/:id', () => {
    it('should update user information', () => {
      const updatedUser = { id: '1', username: 'updateduser' };
      userServiceMock.update.mockResolvedValue(updatedUser);
      return request(app.getHttpServer())
        .put('/user/1')
        .send({ username: 'updateduser', password: 'newpassword' })
        .expect(HttpStatus.OK)
        .expect(updatedUser);
    });

    it('should return 404 if user not found', () => {
      userServiceMock.update.mockResolvedValue(null);
      return request(app.getHttpServer())
        .put('/user/999')
        .send({ username: 'nonexistentuser' })
        .expect(HttpStatus.NOT_FOUND)
        .expect({ message: 'User not found' });
    });

    describe('GET /user', () => {
      it('should return a user by ID', () => {
        const user = { id: '1', username: 'testuser' };
        userServiceMock.findOneById.mockResolvedValue(user);
        return request(app.getHttpServer())
          .get('/user?id=1')
          .expect(HttpStatus.OK)
          .expect(user);
      });

      it('should return a user by username', () => {
        const user = { id: '1', username: 'testuser' };
        userServiceMock.findOneByUsername.mockResolvedValue(user);
        return request(app.getHttpServer())
          .get('/user?username=testuser')
          .expect(HttpStatus.OK)
          .expect(user);
      });

      it('should return all users', () => {
        const users = [
          { id: '1', username: 'testuser1' },
          { id: '2', username: 'testuser2' },
        ];
        userServiceMock.findAll.mockResolvedValue(users);
        return request(app.getHttpServer())
          .get('/user')
          .expect(HttpStatus.OK)
          .expect(users);
      });

      it('should return 404 if user by ID not found', () => {
        userServiceMock.findOneById.mockResolvedValue(null);
        return request(app.getHttpServer())
          .get('/user?id=999')
          .expect(HttpStatus.NOT_FOUND)
          .expect({ message: 'Data not found' });
      });

      it('should return 404 if user by username not found', () => {
        userServiceMock.findOneByUsername.mockResolvedValue(null);
        return request(app.getHttpServer())
          .get('/user?username=nonexistentuser')
          .expect(HttpStatus.NOT_FOUND)
          .expect({ message: 'Data not found' });
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
