import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Member } from './entities/member.entity';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private membersRepository: Repository<Member>,
  ) {}

  // 회원가입 (Spring: MemberLoginService.createMember + MemberService.createMember)
  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    const existingMember = await this.findOneByEmail(createMemberDto.email);
    if (existingMember) {
      throw new ConflictException('이미 존재하는 이메일입니다.'); // ErrorCode.EMAIL_ALREADY_EXISTS
    }

    const hashedPassword = await bcrypt.hash(createMemberDto.password, 10);

    const member = this.membersRepository.create({
      ...createMemberDto,
      password: hashedPassword,
      // role은 Entity @Column default값 또는 DTO에서 처리
    });

    return this.membersRepository.save(member);
  }

  // 인증용 이메일 조회 (Spring: CustomUserDetailsService)
  async findOneByEmail(email: string): Promise<Member | null> {
    return this.membersRepository.findOne({ where: { email } });
  }

  // ID로 조회
  async findOne(id: number): Promise<Member> {
    const member = await this.membersRepository.findOne({ where: { id } });
    if (!member) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    return member;
  }

  // 정보 수정
  async update(id: number, updateMemberDto: UpdateMemberDto): Promise<Member> {
    const member = await this.findOne(id);
    // Spring: member.updateName(request.getName());
    if (updateMemberDto.name) {
      member.name = updateMemberDto.name;
    }
    return this.membersRepository.save(member);
  }

  // 삭제
  async remove(id: number): Promise<void> {
    const result = await this.membersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
  }
}
