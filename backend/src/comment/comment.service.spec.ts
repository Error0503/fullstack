import { Sequelize } from 'sequelize-typescript';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { CommentService } from './comment.service';
import { Comment } from './comment.model';
import { Post } from '../post/post.model';
import { User } from '../user/user.model';
import { Report } from '../report/report.model';

describe('CommentService', () => {
  let service: CommentService;
  let sequelizeInstance: Sequelize;

  beforeEach(async () => {
    sequelizeInstance = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
    });

    sequelizeInstance.addModels([Comment, Post, User, Report]);
    await sequelizeInstance.sync({ force: true });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: getModelToken(Comment),
          useValue: sequelizeInstance.model(Comment),
        },
        {
          provide: getModelToken(Post),
          useValue: sequelizeInstance.model(Post),
        },
        {
          provide: getModelToken(User),
          useValue: sequelizeInstance.model(User),
        },
        {
          provide: Sequelize,
          useValue: sequelizeInstance,
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
  });

  afterEach(async () => {
    await sequelizeInstance.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a comment', async () => {
    const post = await sequelizeInstance
      .model(Post)
      .create({ title: 'Test Post', content: 'Test Content' });
    const user = await sequelizeInstance
      .model(User)
      .create({ username: 'TestUser', password: 'password', role: 'user' });

    const comment = await service.create(post.id, user.id, 'Test comment');
    expect(comment).toBeDefined();
    expect(comment.content).toBe('Test comment');
  });

  it('should retrieve a comment by id', async () => {
    const post = await sequelizeInstance
      .model(Post)
      .create({ title: 'Test Post', content: 'Test Content' });
    const user = await sequelizeInstance
      .model(User)
      .create({ username: 'TestUser', password: 'password', role: 'user' });

    const createdComment = await service.create(
      post.id,
      user.id,
      'Test comment',
    );
    const comment = await service.findOne(createdComment.id);
    expect(comment).toBeDefined();
    expect(comment.id).toBe(createdComment.id);
  });

  it('should update a comment', async () => {
    const post = await sequelizeInstance
      .model(Post)
      .create({ title: 'Test Post', content: 'Test Content' });
    const user = await sequelizeInstance
      .model(User)
      .create({ username: 'TestUser', password: 'password', role: 'user' });

    const createdComment = await service.create(
      post.id,
      user.id,
      'Test comment',
    );
    const updatedComment = await service.update(
      createdComment.id,
      'Updated comment',
    );
    expect(updatedComment).toBeDefined();
    expect(updatedComment.content).toBe('Updated comment');
  });

  it('should delete a comment', async () => {
    const post = await sequelizeInstance
      .model(Post)
      .create({ title: 'Test Post', content: 'Test Content' });
    const user = await sequelizeInstance
      .model(User)
      .create({ username: 'TestUser', password: 'password', role: 'user' });

    const createdComment = await service.create(
      post.id,
      user.id,
      'Test comment',
    );
    await service.delete(createdComment.id);
    const comment = await service.findOne(createdComment.id);
    expect(comment).toBeNull();
  });

  it('should find all comments', async () => {
    const post = await sequelizeInstance
      .model(Post)
      .create({ title: 'Test Post', content: 'Test Content' });
    const user = await sequelizeInstance
      .model(User)
      .create({ username: 'TestUser', password: 'password', role: 'user' });

    await service.create(post.id, user.id, 'Test comment 1');
    await service.create(post.id, user.id, 'Test comment 2');

    const comments = await service.findAll();
    expect(comments).toHaveLength(2);
  });

  it('should handle comment not found', async () => {
    const comment = await service.findOne('999');
    expect(comment).toBeNull();
  });

  it('should handle update comment not found', async () => {
    const updatedComment = await service.update('999', 'Updated comment');
    expect(updatedComment).toBeNull();
  });

  it('should handle delete comment not found', async () => {
    const result = await service.delete('999');
    expect(result).toBeNull();
  });

  it('should return null when post or user is not found', async () => {
    const post = await sequelizeInstance
      .model(Post)
      .create({ title: 'Test Post', content: 'Test Content' });
    const user = await sequelizeInstance
      .model(User)
      .create({ username: 'TestUser', password: 'password', role: 'user' });

    const commentWithInvalidPost = await service.create(
      999,
      user.id,
      'Test comment',
    );
    expect(commentWithInvalidPost).toBeNull();

    const commentWithInvalidUser = await service.create(
      post.id,
      999,
      'Test comment',
    );
    expect(commentWithInvalidUser).toBeNull();
  });
});
