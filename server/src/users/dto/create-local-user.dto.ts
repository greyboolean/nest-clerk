import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { Role } from '../enums/role.enum';

export class CreateLocalUserDto {
  @IsString()
  @IsNotEmpty()
  clerkId: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  roles: Role[];
}
