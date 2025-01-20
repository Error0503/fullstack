import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';

describe('PostController', () => {
  let app;
  let postServiceMock: any;

  beforeAll(async () => {
    postServiceMock = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        {
          provide: PostService,
          useValue: postServiceMock,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  describe('GET /post', () => {
    it('should return a list of all posts', () => {
      const posts = [{ id: '1', title: 'Test Post', body: 'Post body' }];
      postServiceMock.findAll.mockResolvedValue(posts);
      return request(app.getHttpServer())
        .get('/post')
        .expect(HttpStatus.OK)
        .expect(posts);
    });
  });

  describe('GET /post/:id', () => {
    it('should return a post by ID', () => {
      const post = { id: '1', title: 'Test Post', body: 'Post body' };
      postServiceMock.findOne.mockResolvedValue(post);
      return request(app.getHttpServer())
        .get('/post/1')
        .expect(HttpStatus.OK)
        .expect(post);
    });

    it('should return 404 if post not found', () => {
      postServiceMock.findOne.mockResolvedValue(null);
      return request(app.getHttpServer())
        .get('/post/999')
        .expect(HttpStatus.NOT_FOUND)
        .expect({ message: 'Post not found' });
    });
  });

  describe('POST /post', () => {
    it('should create a new post', () => {
      const newPost = { id: '1', title: 'Test Post', body: 'Post body' };
      postServiceMock.create.mockResolvedValue(newPost);
      return request(app.getHttpServer())
        .post('/post')
        .send({
          title: 'Test Post',
          body: 'Post body',
          userId: 1,
        })
        .expect(HttpStatus.CREATED)
        .expect(newPost);
    });

    it('should return 404 if user not found', () => {
      postServiceMock.create.mockResolvedValue(null);
      return request(app.getHttpServer())
        .post('/post')
        .send({
          title: 'Test Post',
          body: 'Post body',
          userId: 999,
        })
        .expect(HttpStatus.NOT_FOUND)
        .expect({ message: 'Post not found' });
    });
  });

  describe('DELETE /post/:id', () => {
    it('should delete a post by ID', () => {
      postServiceMock.delete.mockResolvedValue(true);
      return request(app.getHttpServer())
        .delete('/post/1')
        .expect(HttpStatus.NO_CONTENT);
    });

    it('should return 404 if post not found', () => {
      postServiceMock.delete.mockResolvedValue(null);
      return request(app.getHttpServer())
        .delete('/post/999')
        .expect(HttpStatus.NOT_FOUND)
        .expect({ message: 'Post not found' });
    });
  });

  describe('PUT /post/:id', () => {
    it('should update a post successfully', () => {
      const updatedPost = {
        id: '1',
        title: 'Updated Post',
        body: 'Updated body',
      };
      postServiceMock.update.mockResolvedValue(updatedPost);
      return request(app.getHttpServer())
        .put('/post/1')
        .send({ title: 'Updated Post', body: 'Updated body' })
        .expect(HttpStatus.OK)
        .expect(updatedPost);
    });

    it('should return 404 if post not found', () => {
      postServiceMock.update.mockResolvedValue(null);
      return request(app.getHttpServer())
        .put('/post/999')
        .send({ title: 'Updated Post', body: 'Updated body' })
        .expect(HttpStatus.NOT_FOUND)
        .expect({ message: 'Post not found' });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
