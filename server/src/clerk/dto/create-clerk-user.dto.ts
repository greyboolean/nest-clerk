import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class CreateClerkUserDto {
  @IsEmail()
  @IsNotEmpty()
  emailAddress: string[];

  @IsString()
  @IsNotEmpty()
  password: string;
}
