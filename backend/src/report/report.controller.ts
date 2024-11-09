import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { Response } from 'express';
import { Reasons } from './report.model';

@Controller('report')
export class ReportController {
  private readonly reportService: ReportService;

  constructor(reportService: ReportService) {
    this.reportService = reportService;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.reportService.findAll();
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
      body,
      reason,
      userId,
      postId,
    }: { body: string; reason: Reasons; userId: number; postId: number },
  ) {
    const result = await this.reportService.create(
      body,
      reason,
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

  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    const result = await this.reportService.delete(id);
    if (result === null) {
      res.status(HttpStatus.NOT_FOUND).send({ message: 'Report not found' });
      return null;
    }
    res.status(HttpStatus.NO_CONTENT).send();
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() { body, reason }: { body: string; reason: Reasons },
    @Res() res: Response,
  ) {
    const result = await this.reportService.update(id, body, reason);
    if (result === null) {
      res.status(HttpStatus.NOT_FOUND).send({ message: 'Report not found' });
      return null;
    }
    res.status(HttpStatus.OK).send(result);
    return result;
  }
}
