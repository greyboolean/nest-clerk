import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { ClerkModule } from 'src/clerk/clerk.module';

@Module({
  imports: [ConfigModule, UsersModule, ClerkModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
