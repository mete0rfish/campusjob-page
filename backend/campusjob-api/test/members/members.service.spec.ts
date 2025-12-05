import { Test, TestingModule } from '@nestjs/testing';
import { MembersService } from '../../src/members/members.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member, MemberRole } from '../../src/members/entities/member.entity';
import { CreateMemberDto } from '../../src/members/dto/create-member.dto';
import { UpdateMemberDto } from '../../src/members/dto/update-member.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('MembersService', () => {
  let service: MembersService;
  let membersRepository: Repository<Member>;

  const mockMember: Member = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword',
    role: MemberRole.USER,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembersService,
        {
          provide: getRepositoryToken(Member),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MembersService>(MembersService);
    membersRepository = module.get<Repository<Member>>(getRepositoryToken(Member));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a new member', async () => {
      const createMemberDto: CreateMemberDto = {
        email: 'new@example.com',
        name: 'New User',
        password: 'password123',
      };

      jest.spyOn(service, 'findOneByEmail').mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHashedPassword');
      (membersRepository.create as jest.Mock).mockReturnValue({
        ...createMemberDto,
        password: 'newHashedPassword',
        role: MemberRole.USER,
      });
      (membersRepository.save as jest.Mock).mockResolvedValue({
        id: 2,
        ...createMemberDto,
        password: 'newHashedPassword',
        role: MemberRole.USER,
      });

      const result = await service.create(createMemberDto);

      expect(service.findOneByEmail).toHaveBeenCalledWith(createMemberDto.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(createMemberDto.password, 10);
      expect(membersRepository.create).toHaveBeenCalledWith({
        ...createMemberDto,
        password: 'newHashedPassword',
      });
      expect(membersRepository.save).toHaveBeenCalled();
      expect(result).toEqual({
        id: 2,
        ...createMemberDto,
        password: 'newHashedPassword',
        role: MemberRole.USER,
      });
    });

    it('should throw ConflictException if member with email already exists', async () => {
      const createMemberDto: CreateMemberDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };

      jest.spyOn(service, 'findOneByEmail').mockResolvedValue(mockMember);

      await expect(service.create(createMemberDto)).rejects.toThrow(
        ConflictException,
      );
      expect(service.findOneByEmail).toHaveBeenCalledWith(createMemberDto.email);
    });
  });

  describe('findOneByEmail', () => {
    it('should return a member if found by email', async () => {
      (membersRepository.findOne as jest.Mock).mockResolvedValue(mockMember);

      const result = await service.findOneByEmail(mockMember.email);
      expect(membersRepository.findOne).toHaveBeenCalledWith({
        where: { email: mockMember.email },
      });
      expect(result).toEqual(mockMember);
    });

    it('should return null if member not found by email', async () => {
      (membersRepository.findOne as jest.Mock).mockResolvedValue(null);

      const result = await service.findOneByEmail('nonexistent@example.com');
      expect(result).toBeNull();
    });
  });

  describe('findOne', () => {
    it('should return a member if found by id', async () => {
      (membersRepository.findOne as jest.Mock).mockResolvedValue(mockMember);

      const result = await service.findOne(mockMember.id);
      expect(membersRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockMember.id },
      });
      expect(result).toEqual(mockMember);
    });

    it('should throw NotFoundException if member not found by id', async () => {
      (membersRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should successfully update a member', async () => {
      const updateMemberDto: UpdateMemberDto = { name: 'Updated Name' };
      const updatedMember = { ...mockMember, name: 'Updated Name' };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockMember);
      (membersRepository.save as jest.Mock).mockResolvedValue(updatedMember);

      const result = await service.update(mockMember.id, updateMemberDto);

      expect(service.findOne).toHaveBeenCalledWith(mockMember.id);
      expect(membersRepository.save).toHaveBeenCalledWith(updatedMember);
      expect(result).toEqual(updatedMember);
    });

    it('should throw NotFoundException if member to update is not found', async () => {
      const updateMemberDto: UpdateMemberDto = { name: 'Updated Name' };

      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(service.update(999, updateMemberDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should successfully remove a member', async () => {
      (membersRepository.delete as jest.Mock).mockResolvedValue({ affected: 1 });

      await expect(service.remove(mockMember.id)).resolves.toBeUndefined();
      expect(membersRepository.delete).toHaveBeenCalledWith(mockMember.id);
    });

    it('should throw NotFoundException if member to remove is not found', async () => {
      (membersRepository.delete as jest.Mock).mockResolvedValue({ affected: 0 });

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
