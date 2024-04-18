import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ConfigModule, UsersModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
