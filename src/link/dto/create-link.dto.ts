import {
  IsNotEmpty,
  IsUrl,
  IsString,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateLinkDto {
  @IsUrl()
  @IsNotEmpty()
  longUrl: string;

  @IsString()
  @IsOptional()
  userId: string;

  @IsNumber()
  @IsOptional()
  limit: number;
}
