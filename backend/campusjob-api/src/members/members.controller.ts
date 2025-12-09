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
@UseGuards(JwtAuthGuard)
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get('me')
  getMe(@Request() req: RequestWithUser) {
    return this.sanitizeMember(req.user);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createMemberDto: CreateMemberDto) {
    const member = await this.membersService.create(createMemberDto);
    return this.sanitizeMember(member);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const member = await this.membersService.findOne(+id);
    return this.sanitizeMember(member);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    const member = await this.membersService.update(+id, updateMemberDto);
    return this.sanitizeMember(member);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.membersService.remove(+id);
  }

  private sanitizeMember(member: Member) {
    return {
      id: member.id,
      name: member.name,
      email: member.email,
      role: member.role,
    };
  }
}
