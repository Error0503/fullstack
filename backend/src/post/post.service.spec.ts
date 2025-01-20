import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { PostService } from './post.service';
import { Post } from './post.model';
import { User } from '../user/user.model';
import { Comment } from '../comment/comment.model';
import { Report } from '../report/report.model';

describe('PostService', () => {
  let service: PostService;
  let postModel: typeof Post;
  let sequelize: Sequelize;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getModelToken(Post),
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
          }),
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    postModel = module.get<typeof Post>(getModelToken(Post));
    sequelize = module.get<Sequelize>(Sequelize);

    sequelize.addModels([Post, User, Comment, Report]);

    await sequelize.sync({ force: true });

    await User.create({
      id: 1,
      username: 'testuser',
      password: 'testpass',
      role: 'user',
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      const result = [new Post()];
      jest.spyOn(postModel, 'findAll').mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single post', async () => {
      const result = new Post();
      jest.spyOn(postModel, 'findOne').mockResolvedValue(result);

      expect(await service.findOne('1')).toBe(result);
    });
  });

  describe('create', () => {
    it('should create and return a post', async () => {
      const user = new User();
      user.id = 1;
      jest.spyOn(User, 'findOne').mockResolvedValue(user);

      const post = new Post({
        id: 1,
        title: 'title',
        heroId: 1,
        shortDescription: 'short description',
        body: 'body',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      jest.spyOn(postModel, 'create').mockResolvedValue(post);

      const result = await service.create(
        'title',
        1,
        'short description',
        'body',
        1,
      );
      expect(result).toEqual(
        expect.objectContaining({
          title: 'title',
          heroId: 1,
          shortDescription: 'short description',
          body: 'body',
          userId: 1,
        }),
      );
    });

    it('should return null if user is not found', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValue(null);

      const result = await service.create(
        'title',
        1,
        'short description',
        'body',
        1,
      );
      expect(result).toBeNull();
    });

    it('should handle errors during post creation', async () => {
      const user = new User({ id: 1 });
      jest.spyOn(User, 'findOne').mockResolvedValue(user);
      const post = new Post();
      jest.spyOn(post, 'save').mockRejectedValue(new Error('Creation error'));
      jest.spyOn(postModel, 'create').mockResolvedValue(post);
    });
  });

  describe('delete', () => {
    it('should delete a post', async () => {
      const post = new Post();
      jest.spyOn(service, 'findOne').mockResolvedValue(post);
      jest.spyOn(post, 'destroy').mockResolvedValue(undefined);

      await service.delete('1');
      expect(post.destroy).toHaveBeenCalled();
    });

    it('should handle errors during post deletion', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(new Post());
      jest
        .spyOn(Post.prototype, 'destroy')
        .mockRejectedValue(new Error('Deletion error'));
    });
  });

  describe('update', () => {
    it('should update and return a post', async () => {
      const post = new Post();
      jest.spyOn(service, 'findOne').mockResolvedValue(post);
      jest.spyOn(post, 'save').mockResolvedValue(post);

      const result = await service.update(
        '1',
        'title',
        1,
        'short description',
        'body',
      );
      expect(result).toBe(post);
    });

    it('should handle errors during post update', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(new Post());
      jest
        .spyOn(Post.prototype, 'save')
        .mockRejectedValue(new Error('Update error'));
    });
  });
});
