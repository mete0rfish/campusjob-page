import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/auth/auth.service';
import { MembersService } from '../../src/members/members.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import {
  Member,
  MemberRole,
} from '../../src/members/entities/member.entity';
import * as bcrypt from 'bcrypt';

// bcrypt를 모킹합니다.
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let membersService: MembersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: MembersService,
          useValue: {
            findOneByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    membersService = module.get<MembersService>(MembersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return member data without password if validation is successful', async () => {
      const email = 'test@test.com';
      const password = 'password';
      const member: Member = {
        id: 1,
        email,
        name: 'Test User',
        password: 'hashedPassword',
        role: MemberRole.USER,
      };
      
      (membersService.findOneByEmail as jest.Mock).mockResolvedValue(member);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser(email, password);

      expect(result).toEqual({
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.role,
      });
    });

    it('should return null if member is not found', async () => {
      const email = 'nonexistent@test.com';
      const password = 'password';

      (membersService.findOneByEmail as jest.Mock).mockResolvedValue(null);

      const result = await service.validateUser(email, password);
      expect(result).toBeNull();
    });

    it('should return null if password does not match', async () => {
      const email = 'test@test.com';
      const password = 'wrongpassword';
      const member: Member = {
        id: 1,
        email,
        name: 'Test User',
        password: 'hashedPassword',
        role: MemberRole.USER,
      };

      (membersService.findOneByEmail as jest.Mock).mockResolvedValue(member);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser(email, password);
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access token for a valid user', async () => {
      const loginDto = { email: 'test@test.com', password: 'password' };
      const memberPayload = {
        id: 1,
        email: 'test@test.com',
        name: 'Test User',
        role: MemberRole.USER,
      };
      const token = 'some_access_token';

      jest.spyOn(service, 'validateUser').mockResolvedValue(memberPayload);
      (jwtService.sign as jest.Mock).mockReturnValue(token);

      const result = await service.login(loginDto);

      expect(service.validateUser).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: memberPayload.email,
        role: memberPayload.role,
        sub: memberPayload.id,
      });
      expect(result).toEqual({ access_token: token });
    });

    it('should throw an UnauthorizedException for an invalid user', async () => {
      const loginDto = { email: 'invalid@test.com', password: 'wrongpassword' };

      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
