import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Report } from './report.model';

@Module({
  imports: [SequelizeModule.forFeature([Report])],
  exports: [SequelizeModule],
})
export class ReportModule {}
