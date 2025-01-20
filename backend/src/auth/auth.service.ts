import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(
    username: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.userService.findOneByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(username: string, password: string): Promise<any> {
    if (!username || !password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (await this.userService.findOneByUsername(username)) {
      throw new ConflictException('Username already exists');
    }

    await this.userService.create(username, password);
    const { access_token } = await this.login(username, password);
    return { status: 201, message: 'User created successfully', access_token };
  }
}
