import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user/user.model';
import { PostModule } from './post/post.module';
import { ReportModule } from './report/report.module';
import { Post } from './post/post.model';
import { Report } from './report/report.model';
import { CommentModule } from './comment/comment.module';
import { Comment } from './comment/comment.model';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'sqlite',
      storage: 'database/database.sqlite',
      models: [User, Post, Report, Comment],
    }),
    PostModule,
    ReportModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
