import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

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
