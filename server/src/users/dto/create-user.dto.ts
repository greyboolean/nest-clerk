import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  clerkId: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;
}
