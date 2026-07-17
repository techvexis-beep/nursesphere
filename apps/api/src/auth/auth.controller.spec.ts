import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const dto = {
        email: 'test@nurse.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'Nurse',
      };
      const result = {
        user: { id: '1', email: dto.email, firstName: dto.firstName, lastName: dto.lastName, role: 'NURSE_STUDENT' },
        token: 'jwt-token',
      };
      mockAuthService.register.mockResolvedValue(result);

      expect(await controller.register(dto)).toEqual(result);
      expect(mockAuthService.register).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('should login an existing user', async () => {
      const dto = { email: 'test@nurse.com', password: 'password123' };
      const result = {
        user: { id: '1', email: dto.email, firstName: 'Test', lastName: 'Nurse', role: 'NURSE_STUDENT' },
        token: 'jwt-token',
      };
      mockAuthService.login.mockResolvedValue(result);

      expect(await controller.login(dto)).toEqual(result);
      expect(mockAuthService.login).toHaveBeenCalledWith(dto);
    });
  });
});
