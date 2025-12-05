import { IsString, IsInt, IsArray, IsNotEmpty } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsString()
  company: string;

  @IsArray()
  @IsString({ each: true })
  certificates: string[];

  @IsInt()
  age: number;

  @IsString()
  seekPeriod: string;

  @IsString()
  tip: string;
}
