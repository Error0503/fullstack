import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    authGuard = module.get<AuthGuard>(AuthGuard);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });

  describe('canActivate', () => {
    let context: ExecutionContext;
    let request: Request;

    beforeEach(() => {
      request = { headers: { authorization: 'Bearer validToken' } } as Request;
      context = {
        switchToHttp: jest
          .fn()
          .mockReturnValue({ getRequest: jest.fn().mockReturnValue(request) }),
      } as any;
    });

    it('should throw UnauthorizedException if no token is found', async () => {
      request.headers.authorization = undefined;
      await expect(authGuard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      jest.spyOn(jwtService, 'verifyAsync').mockRejectedValueOnce(new Error());
      await expect(authGuard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should assign payload to request if token is valid', async () => {
      const payload = { userId: 1, username: 'testUser' };
      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValueOnce(payload);

      await expect(authGuard.canActivate(context)).resolves.toBe(true);
      expect(request['user']).toEqual(payload);
    });
  });
});
