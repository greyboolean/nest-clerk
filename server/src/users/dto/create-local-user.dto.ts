import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateLocalUserDto {
  @IsString()
  @IsNotEmpty()
  clerkId: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  roles: string[];
}
