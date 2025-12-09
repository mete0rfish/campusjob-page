import { Test, TestingModule } from '@nestjs/testing';
import { MembersController } from '../../src/members/members.controller';
import { MembersService } from '../../src/members/members.service';
import { CreateMemberDto } from '../../src/members/dto/create-member.dto';
import { UpdateMemberDto } from '../../src/members/dto/update-member.dto';
import { Member, MemberRole } from '../../src/members/entities/member.entity';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('MembersController', () => {
  let controller: MembersController;
  let service: MembersService;

  const mockMember: Member = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword', // Password should not be returned
    role: MemberRole.USER,
  };

  const sanitizedMember = {
    id: mockMember.id,
    email: mockMember.email,
    name: mockMember.name,
    role: mockMember.role,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembersController],
      providers: [
        {
          provide: MembersService,
          useValue: {
            create: jest.fn(),
            findOneByEmail: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MembersController>(MembersController);
    service = module.get<MembersService>(MembersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMe', () => {
    it('should return the sanitized current user', () => {
      const req = { user: mockMember };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      expect(controller.getMe(req as any)).toEqual(sanitizedMember);
    });
  });

  describe('create', () => {
    it('should create a member and return the sanitized member', async () => {
      const createMemberDto: CreateMemberDto = {
        email: 'new@example.com',
        name: 'New User',
        password: 'password123',
      };
      const newMember: Member = {
        id: 2,
        ...createMemberDto,
        password: 'newHashedPassword',
        role: MemberRole.USER,
      };

      (service.create as jest.Mock).mockResolvedValue(newMember);

      const result = await controller.create(createMemberDto);
      expect(service.create).toHaveBeenCalledWith(createMemberDto);
      expect(result).toEqual({
        id: newMember.id,
        email: newMember.email,
        name: newMember.name,
        role: newMember.role,
      });
    });

    it('should throw ConflictException if member already exists', async () => {
      const createMemberDto: CreateMemberDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };

      (service.create as jest.Mock).mockRejectedValue(new ConflictException());

      await expect(controller.create(createMemberDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a sanitized member by id', async () => {
      (service.findOne as jest.Mock).mockResolvedValue(mockMember);

      const result = await controller.findOne('1');
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(sanitizedMember);
    });

    it('should throw NotFoundException if member not found', async () => {
      (service.findOne as jest.Mock).mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a member and return the sanitized member', async () => {
      const updateMemberDto: UpdateMemberDto = { name: 'Updated Name' };
      const updatedMember: Member = { ...mockMember, name: 'Updated Name' };

      (service.update as jest.Mock).mockResolvedValue(updatedMember);

      const result = await controller.update('1', updateMemberDto);
      expect(service.update).toHaveBeenCalledWith(1, updateMemberDto);
      expect(result).toEqual({
        id: updatedMember.id,
        email: updatedMember.email,
        name: updatedMember.name,
        role: updatedMember.role,
      });
    });

    it('should throw NotFoundException if member to update is not found', async () => {
      const updateMemberDto: UpdateMemberDto = { name: 'Updated Name' };

      (service.update as jest.Mock).mockRejectedValue(new NotFoundException());

      await expect(controller.update('999', updateMemberDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a member', async () => {
      (service.remove as jest.Mock).mockResolvedValue(undefined);

      await expect(controller.remove('1')).resolves.toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if member to remove is not found', async () => {
      (service.remove as jest.Mock).mockRejectedValue(new NotFoundException());

      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});
