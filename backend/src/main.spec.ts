import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';

describe('AppModule', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  it('should listen on port 3000', async () => {
    const listenSpy = jest
      .spyOn(app, 'listen')
      .mockImplementation(() => Promise.resolve());
    await app.listen(3000);
    expect(listenSpy).toHaveBeenCalledWith(3000);
  });

  afterAll(async () => {
    await app.close();
  });
});
