import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersService } from './members.service';
import { MembersController } from './members.controller'; // 다음 단계에서 생성 필요
import { Member } from './entities/member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member]), // Member Repository 주입을 위해 필수
  ],
  controllers: [MembersController], // API 엔드포인트 처리
  providers: [MembersService], // 비즈니스 로직 처리
  exports: [MembersService], // AuthModule 등 외부에서 MembersService 사용 시 필수
})
export class MembersModule {}
