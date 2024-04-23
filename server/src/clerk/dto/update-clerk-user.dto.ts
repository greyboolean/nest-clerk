import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateClerkUserDto {
  @IsString()
  @IsOptional()
  password?: string;

  @IsBoolean()
  @IsOptional()
  skipPasswordChecks?: boolean;
}
