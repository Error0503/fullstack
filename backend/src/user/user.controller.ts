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

@Controller('user')
export class UserController {
  private readonly userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Res() res: Response,
    @Body() { username, password }: { username: string; password: string },
  ): Promise<User> {
    return this.userService.create(username, password);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string): Promise<void> {
    return this.userService.delete(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() { username, password }: { username: string; password: string },
  ) {
    return this.userService.update(id, username, password);
  }
}
