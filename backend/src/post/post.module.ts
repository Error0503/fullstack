import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Post } from './post.model';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [SequelizeModule.forFeature([Post])],
  exports: [SequelizeModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
