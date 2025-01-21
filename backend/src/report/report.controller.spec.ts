import { Test, TestingModule } from '@nestjs/testing';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { Reasons, Statuses } from './report.model';

describe('ReportController', () => {
  let app;
  let reportServiceMock: any;

  beforeAll(async () => {
    reportServiceMock = {
      findAll: jest.fn(),
      filter: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportController],
      providers: [
        {
          provide: ReportService,
          useValue: reportServiceMock,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  describe('GET /report', () => {
    it('should return a list of all reports', () => {
      const reports = [
        {
          id: '1',
          status: Statuses.OPEN,
          reason: Reasons.SPAM,
          body: 'Test Report',
        },
      ];
      reportServiceMock.findAll.mockResolvedValue(reports);
      return request(app.getHttpServer())
        .get('/report')
        .expect(HttpStatus.OK)
        .expect(reports);
    });
  });

  describe('GET /report?status=open', () => {
    it('should return a list of open reports', () => {
      const reports = [
        {
          id: '1',
          status: Statuses.OPEN,
          reason: Reasons.SPAM,
          body: 'Test Report',
        },
      ];
      reportServiceMock.filter.mockResolvedValue(reports);
      return request(app.getHttpServer())
        .get('/report?status=open')
        .expect(HttpStatus.OK)
        .expect(reports);
    });
  });

  describe('GET /report/:id', () => {
    it('should return a report by ID', () => {
      const report = {
        id: '1',
        status: Statuses.OPEN,
        reason: Reasons.SPAM,
        body: 'Test Report',
      };
      reportServiceMock.findOne.mockResolvedValue(report);
      return request(app.getHttpServer())
        .get('/report/1')
        .expect(HttpStatus.OK)
        .expect(report);
    });

    it('should return 404 if report not found', () => {
      reportServiceMock.findOne.mockResolvedValue(null);
      return request(app.getHttpServer())
        .get('/report/999')
        .expect(HttpStatus.NOT_FOUND)
        .expect({ message: 'Report not found' });
    });
  });

  describe('POST /report', () => {
    it('should create a new report', () => {
      const newReport = {
        id: '1',
        status: Statuses.OPEN,
        reason: Reasons.SPAM,
        body: 'Test Report',
      };
      reportServiceMock.create.mockResolvedValue(newReport);
      return request(app.getHttpServer())
        .post('/report')
        .send({
          id: '1',
          status: Statuses.OPEN,
          reason: Reasons.SPAM,
          body: 'Test Report',
          userId: 1,
          postId: 1,
        })
        .expect(HttpStatus.CREATED)
        .expect(newReport);
    });

    it('should return 400 if user or post not found', () => {
      reportServiceMock.create.mockResolvedValue(null);
      return request(app.getHttpServer())
        .post('/report')
        .send({
          body: 'Test Report',
          reason: 'Spam',
          userId: 999,
          postId: 999,
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({ message: 'User or post not found' });
    });
  });

  describe('PUT /report/:id', () => {
    it('should update a report successfully', () => {
      const updatedReport = {
        id: '1',
        status: Statuses.RESOLVED,
        reason: Reasons.SPAM,
        body: 'Test Report',
      };
      reportServiceMock.update.mockResolvedValue(updatedReport);
      return request(app.getHttpServer())
        .put('/report/1')
        .send({ status: Statuses.RESOLVED })
        .expect(HttpStatus.OK)
        .expect(updatedReport);
    });

    it('should return 404 if report not found', () => {
      reportServiceMock.update.mockResolvedValue(null);
      return request(app.getHttpServer())
        .put('/report/999')
        .send({ body: 'Updated Report', reason: 'Abuse' })
        .expect(HttpStatus.NOT_FOUND)
        .expect({ message: 'Report not found' });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
