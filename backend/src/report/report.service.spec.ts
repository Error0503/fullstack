import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ReportService } from './report.service';
import { Report, Reasons } from './report.model';
import { User } from '../user/user.model';
import { Post } from '../post/post.model';
import { Comment } from '../comment/comment.model';

describe('ReportService', () => {
  let service: ReportService;
  let reportModel: typeof Report;
  let sequelize: Sequelize;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
        {
          provide: getModelToken(Report),
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            destroy: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: Sequelize,
          useValue: new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            models: [Report, User, Post, Comment],
          }),
        },
      ],
    }).compile();

    service = module.get<ReportService>(ReportService);
    reportModel = module.get<typeof Report>(getModelToken(Report));
    sequelize = module.get<Sequelize>(Sequelize);

    await sequelize.sync({ force: true });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of reports', async () => {
      const result = [new Report()];
      jest.spyOn(reportModel, 'findAll').mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single report', async () => {
      const result = new Report();
      jest.spyOn(reportModel, 'findOne').mockResolvedValue(result);

      expect(await service.findOne('1')).toBe(result);
    });
  });

  describe('create', () => {
    it('should create and return a report', async () => {
      const user = await sequelize
        .model(User)
        .create({ username: 'TestUser', password: 'password', role: 'user' });

      const post = await sequelize
        .model(Post)
        .create({ title: 'Test Post', body: 'Test Content', userId: user.id });

      const result = new Report({
        id: 1,
        body: 'body',
        reason: Reasons.SPAM,
        userId: user.id,
        postId: post.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      jest.spyOn(User, 'findOne').mockResolvedValue(user);
      jest.spyOn(Post, 'findOne').mockResolvedValue(post);
      jest.spyOn(reportModel, 'create').mockResolvedValue(result);

      const createdReport = await service.create(
        'body',
        Reasons.SPAM,
        user.id,
        post.id,
      );

      expect(createdReport).toEqual(
        expect.objectContaining({
          id: 1,
          body: 'body',
          reason: Reasons.SPAM,
          userId: user.id,
          postId: post.id,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
    });

    it('should return null if user or post is not found', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValue(null);
      jest.spyOn(Post, 'findOne').mockResolvedValue(new Post());

      expect(await service.create('body', Reasons.SPAM, 1, 1)).toBeNull();
    });

    it('should return null if post is not found', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValue(new User());
      jest.spyOn(Post, 'findOne').mockResolvedValue(null);

      expect(await service.create('body', Reasons.SPAM, 1, 1)).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete a report', async () => {
      const result = new Report();
      jest.spyOn(service, 'findOne').mockResolvedValue(result);
      jest.spyOn(result, 'destroy').mockResolvedValue(undefined);

      expect(await service.delete('1')).toBeUndefined();
    });

    it('should return null if report is not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      expect(await service.delete('1')).toBeNull();
    });
  });

  describe('update', () => {
    it('should update and return a report', async () => {
      const result = new Report();
      jest.spyOn(service, 'findOne').mockResolvedValue(result);
      jest.spyOn(result, 'save').mockResolvedValue(result);

      expect(await service.update('1', 'new body', Reasons.SPAM)).toBe(result);
    });

    it('should return null if report is not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      expect(await service.update('1', 'new body', Reasons.SPAM)).toBeNull();
    });
  });
});
