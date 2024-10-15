import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Comment } from './comment.model';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  imports: [SequelizeModule.forFeature([Comment])],
  exports: [SequelizeModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
