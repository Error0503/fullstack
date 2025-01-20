import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';

describe('CommentController', () => {
  let app;
  let commentServiceMock: any;

  beforeAll(async () => {
    commentServiceMock = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [
        {
          provide: CommentService,
          useValue: commentServiceMock,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  describe('GET /comment', () => {
    it('should return a list of all comments', () => {
      const comments = [
        { id: '1', postId: 1, userId: 1, content: 'Test comment' },
      ];
      commentServiceMock.findAll.mockResolvedValue(comments);
      return request(app.getHttpServer())
        .get('/comment')
        .expect(HttpStatus.OK)
        .expect(comments);
    });
  });

  describe('GET /comment/:id', () => {
    it('should return a comment by ID', () => {
      const comment = {
        id: '1',
        postId: 1,
        userId: 1,
        content: 'Test comment',
      };
      commentServiceMock.findOne.mockResolvedValue(comment);
      return request(app.getHttpServer())
        .get('/comment/1')
        .expect(HttpStatus.OK)
        .expect(comment);
    });

    it('should return 404 if comment not found', () => {
      commentServiceMock.findOne.mockResolvedValue(null);
      return request(app.getHttpServer())
        .get('/comment/999')
        .expect(HttpStatus.NOT_FOUND)
        .expect({ message: 'Comment not found' });
    });
  });

  describe('POST /comment', () => {
    it('should create a new comment', () => {
      const newComment = {
        id: '1',
        postId: 1,
        userId: 1,
        content: 'Test comment',
      };
      commentServiceMock.create.mockResolvedValue(newComment);
      return request(app.getHttpServer())
        .post('/comment')
        .send({
          postId: 1,
          userId: 1,
          content: 'Test comment',
        })
        .expect(HttpStatus.CREATED)
        .expect(newComment);
    });

    it('should return 400 if post or user not found', () => {
      commentServiceMock.create.mockResolvedValue(null);
      return request(app.getHttpServer())
        .post('/comment')
        .send({
          postId: 999,
          userId: 1,
          content: 'Test comment',
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({ message: 'Post or user not found' });
    });
  });

  describe('DELETE /comment/:id', () => {
    it('should delete a comment by ID', () => {
      commentServiceMock.delete.mockResolvedValue(true);
      return request(app.getHttpServer())
        .delete('/comment/1')
        .expect(HttpStatus.NO_CONTENT);
    });

    it('should return 404 if comment not found', () => {
      commentServiceMock.delete.mockResolvedValue(null);
      return request(app.getHttpServer())
        .delete('/comment/999')
        .expect(HttpStatus.NOT_FOUND)
        .expect({ message: 'Comment not found' });
    });
  });

  describe('PUT /comment/:id', () => {
    it('should update a comment successfully', () => {
      const updatedComment = {
        id: '1',
        postId: 1,
        userId: 1,
        content: 'Updated comment',
      };
      commentServiceMock.update.mockResolvedValue(updatedComment);
      return request(app.getHttpServer())
        .put('/comment/1')
        .send({ content: 'Updated comment' })
        .expect(HttpStatus.OK)
        .expect(updatedComment);
    });

    it('should return 404 if comment not found', () => {
      commentServiceMock.update.mockResolvedValue(null);
      return request(app.getHttpServer())
        .put('/comment/999')
        .send({ content: 'Updated comment' })
        .expect(HttpStatus.NOT_FOUND)
        .expect({ message: 'Comment not found' });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
