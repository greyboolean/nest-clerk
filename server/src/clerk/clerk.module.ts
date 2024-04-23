import { Module } from '@nestjs/common';
import { ClerkService } from './clerk.service';
import { ClerkController } from './clerk.controller';
import { ClerkUsersService } from './clerk-users.service';

@Module({
  controllers: [ClerkController],
  providers: [ClerkService, ClerkUsersService],
  exports: [ClerkUsersService],
})
export class ClerkModule {}
