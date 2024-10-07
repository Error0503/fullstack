import {
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  Param,
  Res,
  Delete,
  Put,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostModel } from './post.model';
import { Response } from 'express';

@Controller('post')
export class PostController {
  private readonly postService: PostService;

  constructor(postService: PostService) {
    this.postService = postService;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<PostModel[]> {
    return await this.postService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<PostModel> {
    const result = await this.postService.findOne(id);
    if (result === null) {
      res.status(HttpStatus.NOT_FOUND).send({ message: 'Post not found' });
      return null;
    }
    res.status(HttpStatus.OK).send(result);
    return result;
  }

  @Post()
  async create(
    @Res() res: Response,
    @Body()
    { title, body, userId }: { title: string; body: string; userId: number },
  ): Promise<PostModel> {
    const result = await this.postService.create(title, body, userId);

    if (result === null) {
      res.status(HttpStatus.NOT_FOUND).send({ message: 'User not found' });
      return null;
    }

    res.status(HttpStatus.CREATED).send(result);
    return result;
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const result = await this.postService.delete(id);
    if (result === null) {
      res.status(HttpStatus.NOT_FOUND).send({ message: 'Post not found' });
      return null;
    }
    res.status(HttpStatus.NO_CONTENT).send();
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() { title, body }: { title: string; body: string },
    @Res() res: Response,
  ) {
    const result = await this.postService.update(id, title, body);
    if (result === null) {
      res.status(HttpStatus.NOT_FOUND).send({ message: 'Post not found' });
      return null;
    }
    res.status(HttpStatus.OK).send(result);
    return result;
  }
}
