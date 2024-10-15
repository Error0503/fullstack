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
import { CommentService } from './comment.service';
import { Comment } from './comment.model';
import { Response } from 'express';

@Controller('comment')
export class CommentController {
  private readonly commentService: CommentService;

  constructor(commentService: CommentService) {
    this.commentService = commentService;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Comment[]> {
    return await this.commentService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Comment> {
    const result = await this.commentService.findOne(id);
    if (result === null) {
      res.status(HttpStatus.NOT_FOUND).send({ message: 'Comment not found' });
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
      postId,
      userId,
      content,
    }: { postId: number; userId: number; content: string },
  ): Promise<Comment> {
    const result = await this.commentService.create(postId, userId, content);

    if (result === null) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: 'Post or user not found' });
      return null;
    }
    res.status(HttpStatus.CREATED).send(result);
    return result;
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const result = await this.commentService.delete(id);
    if (result === null) {
      res.status(HttpStatus.NOT_FOUND).send({ message: 'Comment not found' });
      return null;
    }
    res.status(HttpStatus.NO_CONTENT).send();
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() { content }: { content: string },
    @Res() res: Response,
  ) {
    const result = await this.commentService.update(id, content);
    if (result === null) {
      res.status(HttpStatus.NOT_FOUND).send({ message: 'Comment not found' });
      return null;
    }
    res.status(HttpStatus.OK).send(result);
    return result;
  }
}
