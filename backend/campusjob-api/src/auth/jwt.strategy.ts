import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptions } from 'passport-jwt';
import { Request } from 'express';
import { MembersService } from '../members/members.service';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
  email: string;
  role: string;
  sub: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private membersService: MembersService,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      jwtFromRequest: (req: Request) => {
        let token: string | null = null;
        if (
          req.headers.authorization &&
          req.headers.authorization.startsWith('Bearer ')
        ) {
          token = req.headers.authorization.substring(7);
        }
        return token;
      },
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    } as StrategyOptions);
  }

  async validate(payload: JwtPayload) {
    // payload에서 email 추출 (Spring의 CustomUserDetails 대체)
    const member = await this.membersService.findOneByEmail(payload.email);
    if (!member) {
      throw new UnauthorizedException();
    }
    return member;
  }
}
