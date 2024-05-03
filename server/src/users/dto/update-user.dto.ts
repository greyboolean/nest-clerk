import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  password?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  skipPasswordChecks?: boolean;

  @IsString({ each: true })
  @IsOptional()
  @ApiProperty()
  roles?: Role[];
}
