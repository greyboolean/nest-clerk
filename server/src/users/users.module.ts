import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { LocalUsersService } from './local-users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ClerkModule } from 'src/clerk/clerk.module';

@Module({
  imports: [PrismaModule, ClerkModule],
  controllers: [UsersController],
  providers: [UsersService, LocalUsersService],
  exports: [LocalUsersService],
})
export class UsersModule {}
