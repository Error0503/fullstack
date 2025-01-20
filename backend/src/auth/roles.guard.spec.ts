import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';

describe('RolesGuard', () => {
  let rolesGuard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as any;

    rolesGuard = new RolesGuard(reflector);
  });

  it('should be defined', () => {
    expect(rolesGuard).toBeDefined();
  });

  it('should allow access if no roles are defined', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role: 'user' },
        }),
      }),
      getHandler: jest.fn().mockReturnValue(() => {}),
      getClass: jest.fn().mockReturnValue(() => {}),
    } as any;

    expect(rolesGuard.canActivate(mockExecutionContext)).toBe(true);
  });

  it('should allow access if user role matches one of the required roles', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);

    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role: ['admin'] },
        }),
      }),
      getHandler: jest.fn().mockReturnValue(() => {}),
      getClass: jest.fn().mockReturnValue(() => {}),
    } as any;

    expect(rolesGuard.canActivate(mockExecutionContext)).toBe(true);
  });

  it('should deny access if user role does not match required roles', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);

    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role: ['user'] },
        }),
      }),
      getHandler: jest.fn().mockReturnValue(() => {}),
      getClass: jest.fn().mockReturnValue(() => {}),
    } as any;

    expect(rolesGuard.canActivate(mockExecutionContext)).toBe(false);
  });
});
