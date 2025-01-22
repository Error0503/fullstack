import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { Response } from 'express';
import { Reasons, Statuses } from './report.model';

@Controller('report')
export class ReportController {
  private readonly reportService: ReportService;

  constructor(reportService: ReportService) {
    this.reportService = reportService;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async filter(@Query('status') status: Statuses, @Res() res: Response) {
    if (status === undefined) {
      const result = await this.reportService.findAll();
      res.status(HttpStatus.OK).send(result);
      return result;
    } else {
      const result = await this.reportService.filter(status);
      if (result === null) {
        res.status(HttpStatus.NOT_FOUND).send({ message: 'Report not found' });
        return null;
      }
      res.status(HttpStatus.OK).send(result);
      return result;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const result = await this.reportService.findOne(id);
    if (result === null) {
      res.status(HttpStatus.NOT_FOUND).send({ message: 'Report not found' });
      return null;
    }
    res.status(HttpStatus.OK).send(result);
    return result;
  }

  @Post()
  async create(
    @Res() res: Response,
    @Body()
    {
      reason,
      status,
      body,
      userId,
      postId,
    }: {
      status: Statuses;
      reason: Reasons;
      body: string;
      userId: number;
      postId: number;
    },
  ) {
    const result = await this.reportService.create(
      status,
      reason,
      body,
      userId,
      postId,
    );

    if (result === null) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: 'User or post not found' });
      return null;
    }
    res.status(HttpStatus.CREATED).send(result);
    return result;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() { status }: { status: Statuses },
    @Res() res: Response,
  ) {
    const result = await this.reportService.update(id, status);
    if (result === null) {
      res.status(HttpStatus.NOT_FOUND).send({ message: 'Report not found' });
      return null;
    }
    res.status(HttpStatus.OK).send(result);
    return result;
  }
}
