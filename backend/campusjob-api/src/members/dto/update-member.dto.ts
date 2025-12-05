import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateMemberDto {
  @IsNotEmpty({ message: '이름은 필수 입력값입니다.' })
  @IsString()
  name: string;
}
