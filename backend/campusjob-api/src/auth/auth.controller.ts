import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { CreateMemberDto } from '../members/dto/create-member.dto';
import { MembersService } from '../members/members.service';
import { AuthService } from './auth.service';

@Controller('api')
export class AuthController {
  constructor(
    private authService: AuthService,
    private membersService: MembersService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('join')
  async join(@Body() createMemberDto: CreateMemberDto) {
    // Spring: MemberLoginService.createMember -> MemberResponse 반환
    const member = await this.membersService.create(createMemberDto);
    return {
      id: member.id,
      name: member.name,
      email: member.email,
      role: member.role,
    };
  }
}
