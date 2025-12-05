import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MembersService } from '../members/members.service';
import { LoginDto } from './dto/login.dto';
import { Member } from '../members/entities/member.entity';

@Injectable()
export class AuthService {
  constructor(
    private membersService: MembersService,
    private jwtService: JwtService,
  ) {}

  // 사용자 검증 (Spring: LoginFilter.attemptAuthentication + AuthenticationManager)
  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<Member, 'password'> | null> {
    const member = await this.membersService.findOneByEmail(email);

    if (member && (await bcrypt.compare(pass, member.password))) {
      return {
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.role,
      };
    }
    return null;
  }

  // 로그인 (토큰 발급) (Spring: LoginFilter.successfulAuthentication + JwtUtil.createJwt)
  async login(loginDto: LoginDto) {
    const member = await this.validateUser(loginDto.email, loginDto.password);
    if (!member) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 일치하지 않습니다.',
      );
    }

    const payload = { email: member.email, role: member.role, sub: member.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
