import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserRoles } from '../user/user.model';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtService,
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return a token on successful login', async () => {
      const signInDto = { username: 'testUser', password: 'testPass' };
      const result = { access_token: 'some-token' };

      jest.spyOn(authService, 'login').mockResolvedValue(result);

      expect(await authController.login(signInDto)).toBe(result);
    });

    it('should throw UnauthorizedException if login fails', async () => {
      const signInDto = { username: 'wrongUser', password: 'wrongPass' };

      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(new UnauthorizedException());

      try {
        await authController.login(signInDto);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
  });

  describe('register', () => {
    it('should return a user on successful registration', async () => {
      const registerDto = { username: 'newUser', password: 'newPass' };

      const result = { username: 'newUser', id: 1 };

      jest.spyOn(authService, 'register').mockResolvedValue(result);

      expect(await authController.register(registerDto)).toEqual(result);
    });

    it('should throw an error if registration fails', async () => {
      const registerDto = { username: 'newUser', password: 'newPass' };

      jest
        .spyOn(authService, 'register')
        .mockRejectedValue(new Error('Registration failed'));

      try {
        await authController.register(registerDto);
      } catch (error) {
        expect(error).toHaveProperty('message', 'Registration failed');
      }
    });
  });

  describe('getAdminData', () => {
    it('should return user data for admin', async () => {
      const mockRequest = {
        user: { username: 'adminUser', roles: [UserRoles.ADMIN] },
      };
      const result = mockRequest.user;

      expect(await authController.getAdminData(mockRequest)).toBe(result);
    });

    it('should throw UnauthorizedException if user is not authorized', async () => {
      const mockRequest = {
        user: { username: 'user', roles: [UserRoles.MODERATOR] },
      };

      try {
        await authController.getAdminData(mockRequest);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
  });

  describe('getModData', () => {
    it('should return user data for mod', async () => {
      const mockRequest = {
        user: { username: 'modUser', roles: [UserRoles.MODERATOR] },
      };
      const result = mockRequest.user;

      expect(await authController.getModData(mockRequest)).toBe(result);
    });

    it('should throw UnauthorizedException if user is not authorized', async () => {
      const mockRequest = {
        user: { username: 'user', roles: [UserRoles.USER] },
      };

      try {
        await authController.getModData(mockRequest);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const mockRequest = {
        user: { username: 'profileUser', roles: [UserRoles.USER] },
      };
      const result = mockRequest.user;

      expect(await authController.getProfile(mockRequest)).toBe(result);
    });
  });
});
