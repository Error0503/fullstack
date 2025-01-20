import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { ReportModule } from './report/report.module';
import { CommentModule } from './comment/comment.module';
import { AuthModule } from './auth/auth.module';

describe('AppModule', () => {
  let app;
  let appService: AppService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    appService = moduleFixture.get<AppService>(AppService);
    await app.init();
  });

  it('should be defined', () => {
    const controller = app.get(AppController);
    expect(controller).toBeDefined();
    expect(appService).toBeDefined();
  });

  it('should have the necessary imports', () => {
    expect(app.get(PostModule)).toBeDefined();
    expect(app.get(ReportModule)).toBeDefined();
    expect(app.get(CommentModule)).toBeDefined();
    expect(app.get(UserModule)).toBeDefined();
    expect(app.get(AuthModule)).toBeDefined();
    expect(app.get(SequelizeModule)).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
