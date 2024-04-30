import { ApiProperty } from '@nestjs/swagger';
import { User as UserModel } from '@prisma/client';

export class User implements UserModel {
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  clerkId: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  roles: string[];
}
