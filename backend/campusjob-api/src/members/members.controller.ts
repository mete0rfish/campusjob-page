import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Member } from './entities/member.entity';

interface RequestWithUser extends ExpressRequest {
  user: Member;
}

@Controller('api/members')
@UseGuards(JwtAuthGuard) // 모든 엔드포인트에 JWT 인증 적용
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  // 내 정보 조회 (Spring: getMe)
  @Get('me')
  getMe(@Request() req: RequestWithUser) {
    // req.user는 JwtStrategy에서 리턴한 Member 객체입니다.
    return this.sanitizeMember(req.user);
  }

  // 회원 생성 (Spring: createMember)
  // 참고: 회원가입은 보통 /api/join(AuthModule)에서 처리하지만,
  // RESTful 리소스 차원에서 MemberApi에도 존재하므로 구현함.
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createMemberDto: CreateMemberDto) {
    const member = await this.membersService.create(createMemberDto);
    return this.sanitizeMember(member);
  }

  // 특정 회원 조회 (Spring: getMember)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const member = await this.membersService.findOne(+id);
    return this.sanitizeMember(member);
  }

  // 회원 정보 수정 (Spring: updateMember)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    const member = await this.membersService.update(+id, updateMemberDto);
    return this.sanitizeMember(member);
  }

  // 회원 삭제 (Spring: deleteMember)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.membersService.remove(+id);
  }

  // 비밀번호 등 민감 정보를 제거하는 헬퍼 메소드
  private sanitizeMember(member: Member) {
    return {
      id: member.id,
      name: member.name,
      email: member.email,
      role: member.role,
    };
  }
}
