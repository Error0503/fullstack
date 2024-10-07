import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  Res,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { User } from './user.model';
import { UserService } from './user.service';
import { Response } from 'express';

@Controller('user')
export class UserController {
  private readonly userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response): Promise<User> {
    const result = await this.userService.findOne(id);
    if (result === null) {
      res.status(HttpStatus.NOT_FOUND).send({ message: 'User not found' });
      return null;
    }
    res.status(HttpStatus.OK).send(result);
    return result;
  }

  @Post()
  async create(
    @Res() res: Response,
    @Body() { username, password }: { username: string; password: string },
  ): Promise<User> {
    const result = await this.userService.create(username, password);

    if (result === null) {
      res
        .status(HttpStatus.CONFLICT)
        .send({ message: 'Username already exists' });
      return null;
    }
    res.status(HttpStatus.CREATED).send(result);
    return result;
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const result = await this.userService.delete(id);
    if (result === null) {
      res.status(HttpStatus.NOT_FOUND).send({ message: 'User not found' });
      return null;
    }
    res.status(HttpStatus.NO_CONTENT).send();
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() { username, password }: { username: string; password: string },
    @Res() res: Response,
  ) {
    const result = await this.userService.update(id, username, password);
    if (result === null) {
      res.status(HttpStatus.NOT_FOUND).send({ message: 'User not found' });
      return null;
    }
    res.status(HttpStatus.OK).send(result);
    return result;
  }
}
