import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findOneByUsername: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an access token for valid credentials', async () => {
    const user = {
      id: 1,
      username: 'testuser',
      password: 'hashedPassword',
      role: 'user',
    };
    const accessToken = 'someAccessToken';

    userService.findOneByUsername = jest.fn().mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    jwtService.signAsync = jest.fn().mockResolvedValue(accessToken);
    const result = await authService.login('testuser', 'password');

    expect(result).toEqual({ access_token: accessToken });
    expect(userService.findOneByUsername).toHaveBeenCalledWith('testuser');
    expect(bcrypt.compare).toHaveBeenCalledWith('password', user.password);
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      id: user.id,
      username: user.username,
      role: user.role,
    });
  });

  it('should throw UnauthorizedException for invalid credentials', async () => {
    const user = {
      id: 1,
      username: 'testuser',
      password: 'hashedPassword',
      role: 'user',
    };

    userService.findOneByUsername = jest.fn().mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      authService.login('testuser', 'wrongPassword'),
    ).rejects.toThrowError(UnauthorizedException);
  });

  it('should throw UnauthorizedException if user does not exist', async () => {
    userService.findOneByUsername = jest.fn().mockResolvedValue(null);

    await expect(
      authService.login('nonExistentUser', 'password'),
    ).rejects.toThrowError(UnauthorizedException);
  });

  it('should register a new user and return a success message', async () => {
    userService.findOneByUsername = jest.fn().mockResolvedValue(null);
    userService.create = jest.fn().mockResolvedValue(undefined);
    authService.login = jest
      .fn()
      .mockResolvedValue({ access_token: 'someAccessToken' });

    const result = await authService.register('newUser', 'password');

    expect(result).toEqual({
      status: 201,
      message: 'User created successfully',
      access_token: 'someAccessToken',
    });
    expect(userService.create).toHaveBeenCalledWith('newUser', 'password');
  });

  it('should throw ConflictException if username already exists', async () => {
    const existingUser = { id: 1, username: 'existingUser' };
    userService.findOneByUsername = jest.fn().mockResolvedValue(existingUser);

    await expect(
      authService.register('existingUser', 'password'),
    ).rejects.toThrowError(ConflictException);
  });

  it('should throw UnauthorizedException if username or password is missing', async () => {
    await expect(authService.register('', 'password')).rejects.toThrowError(
      UnauthorizedException,
    );
    await expect(authService.register('newUser', '')).rejects.toThrowError(
      UnauthorizedException,
    );
  });
});
